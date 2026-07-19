import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type { Heading, Image, Link, Parent, Root, RootContent, Text } from 'mdast';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang } from '@/types/blog';

import { deriveCategoryFromPath } from './category';
import { extractImageAltAtStart, unescapeMarkersInImageAlts } from './imageAlt';
import { normalizeMarkdownImageSizeSyntax } from './imageDimensions';
import { parseInlineMarkdownChildren } from './inlineMarkdown';
import { resolveMarkdownLink } from './linkResolver';
import { normalizeKatexMathTree } from './math';
import { isReferenceHeadingTitle } from './references';
import { slugifyHeading } from './slug';
import type {
  ContentDiagnostic,
  ContentIndex,
  KbNote,
  LinkResolution,
  PublishedContentNote,
} from './types';

export interface ExportPaths {
  contentRoot: string;
  publicRoot: string;
  publicAssetsBasePath: string;
}

export interface ExportedPost {
  note: PublishedContentNote;
  markdown: string;
  outputPath: string;
  diagnostics: ContentDiagnostic[];
}

interface CopyAssetOptions {
  stretchSvg?: boolean;
  /**
   * 이미지 용도. body는 본문 컬럼(720px)의 레티나 2배 폭으로 webp 변환하고,
   * cover는 OG 크롤러 호환을 위해 원본 포맷을 유지한 채 폭만 제한합니다.
   */
  assetKind?: 'body' | 'cover';
}

/**
 * 빌드 시 축소·변환 대상 래스터 포맷. GIF(애니메이션)와 SVG는 원본 그대로 복사합니다.
 */
const RASTER_IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

/**
 * 본문 이미지 최대 폭. 본문 컬럼(720px 표시 폭)의 레티나 2배입니다.
 */
const BODY_IMAGE_MAX_WIDTH = 1440;

/**
 * 커버 이미지 최대 폭. 헤더 커버 컨테이너(768px 표시 폭)의 레티나 2배입니다.
 */
const COVER_IMAGE_MAX_WIDTH = 1536;

const WEBP_QUALITY = 82;

interface PendingImageExport {
  sourcePath: string;
  destinationPath: string;
  assetKind: 'body' | 'cover';
  extension: string;
}

const pendingImageExports = new Map<string, PendingImageExport>();

function isRasterImage(extension: string): boolean {
  return RASTER_IMAGE_EXTENSIONS.has(extension);
}

async function runImageExport(job: PendingImageExport): Promise<void> {
  // sharp는 빌드/테스트에서만 필요한 native 모듈이라 실행 시점에 lazy import합니다.
  const { default: sharp } = await import('sharp');
  const maxWidth = job.assetKind === 'cover' ? COVER_IMAGE_MAX_WIDTH : BODY_IMAGE_MAX_WIDTH;
  const pipeline = sharp(job.sourcePath).rotate().resize({
    width: maxWidth,
    withoutEnlargement: true,
  });

  try {
    if (job.assetKind === 'cover') {
      // 커버는 OG 크롤러 호환을 위해 원본 포맷을 유지합니다.
      if (job.extension === '.png') {
        await pipeline.png().toFile(job.destinationPath);
      } else if (job.extension === '.webp') {
        await pipeline.webp({ quality: WEBP_QUALITY }).toFile(job.destinationPath);
      } else {
        await pipeline.jpeg({ quality: WEBP_QUALITY, mozjpeg: true }).toFile(job.destinationPath);
      }
    } else {
      await pipeline.webp({ quality: WEBP_QUALITY }).toFile(job.destinationPath);
    }
  } catch (error) {
    throw new Error(
      `Image export failed for ${path.basename(job.sourcePath)}: ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error },
    );
  }
}

/**
 * copyAsset이 큐에 쌓은 래스터 이미지 축소·변환 작업을 실행합니다.
 * export 루프(exportPublishedPost 반복) 이후 반드시 한 번 await해야 하며,
 * 대상 파일이 이미 존재하면(동일 content hash) 건너뜁니다.
 */
export async function flushPendingImageExports(): Promise<number> {
  const jobs = Array.from(pendingImageExports.values());
  pendingImageExports.clear();

  const results = await Promise.all(
    jobs.map(async job => {
      if (fs.existsSync(job.destinationPath)) {
        return 0;
      }

      await runImageExport(job);
      return 1;
    }),
  );

  return results.reduce<number>((sum, value) => sum + value, 0);
}

function isExternalUrl(value: string): boolean {
  return /^(https?:)?\/\//i.test(value) || /^[a-z][a-z0-9+.-]*:/i.test(value);
}

function isLocalAssetUrl(value: string): boolean {
  return (
    Boolean(value) && !isExternalUrl(value) && !value.startsWith('#') && !value.startsWith('/')
  );
}

function ensureDirectory(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function textNode(value: string): Text {
  return { type: 'text', value };
}

function markdownLinkNode(label: string, url: string): Link {
  return {
    type: 'link',
    url,
    children: parseInlineMarkdownChildren(label),
  };
}

function replaceChild(parent: Parent | undefined, index: number | undefined, node: RootContent) {
  if (!parent || typeof index !== 'number') {
    return;
  }

  parent.children[index] = node;
}

function replaceChildWithNodes(
  parent: Parent | undefined,
  index: number | undefined,
  nodes: Array<Text | Link>,
) {
  if (!parent || typeof index !== 'number') {
    return;
  }

  parent.children.splice(index, 1, ...(nodes as never[]));
}

function resolveAssetPath(note: KbNote, assetUrl: string): string {
  return path.resolve(path.dirname(note.absolutePath), assetUrl);
}

function stretchSvgToFrame(source: string): string {
  return source.replace(/<svg\b([^>]*)>/i, (_match, attributes: string) => {
    const cleanedAttributes = attributes.replace(/\s+preserveAspectRatio=(["']).*?\1/i, '');
    return `<svg${cleanedAttributes} preserveAspectRatio="none">`;
  });
}

function readAssetForExport(sourcePath: string, options: CopyAssetOptions): Buffer {
  const file = fs.readFileSync(sourcePath);

  if (!options.stretchSvg || path.extname(sourcePath).toLowerCase() !== '.svg') {
    return file;
  }

  return Buffer.from(stretchSvgToFrame(file.toString('utf8')), 'utf8');
}

function createContentHashedFileName(sourcePath: string, file: Buffer): string {
  const parsedPath = path.parse(sourcePath);
  const hash = crypto.createHash('sha256').update(file).digest('hex').slice(0, 12);

  return `${parsedPath.name}.${hash}${parsedPath.ext}`;
}

function copyAsset(
  note: PublishedContentNote,
  assetUrl: string,
  paths: ExportPaths,
  options: CopyAssetOptions = {},
): string {
  const sourcePath = resolveAssetPath(note, assetUrl);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Asset does not exist: ${assetUrl}`);
  }

  const publicAssetDir = path.join(
    paths.publicRoot,
    paths.publicAssetsBasePath,
    note.slug,
    'assets',
  );
  ensureDirectory(publicAssetDir);

  const extension = path.extname(sourcePath).toLowerCase();
  let fileName: string;

  if (isRasterImage(extension)) {
    // 래스터 이미지는 폭 제한 축소(+본문은 webp 변환) 대상입니다. 이름의 content hash는
    // 원본 바이트와 변환 파라미터에서 계산하므로, 원본 교체나 파라미터 변경 시 캐시가 무효화됩니다.
    const assetKind = options.assetKind ?? 'body';
    const file = fs.readFileSync(sourcePath);
    const params =
      assetKind === 'cover'
        ? `cover-w${COVER_IMAGE_MAX_WIDTH}-q${WEBP_QUALITY}`
        : `body-w${BODY_IMAGE_MAX_WIDTH}-q${WEBP_QUALITY}-webp`;
    const hash = crypto.createHash('sha256').update(file).update(params).digest('hex').slice(0, 12);
    const outputExtension = assetKind === 'cover' ? extension : '.webp';
    fileName = `${path.parse(sourcePath).name}.${hash}${outputExtension}`;
    const destinationPath = path.join(publicAssetDir, fileName);

    pendingImageExports.set(destinationPath, {
      sourcePath,
      destinationPath,
      assetKind,
      extension,
    });
  } else {
    const file = readAssetForExport(sourcePath, options);
    fileName = createContentHashedFileName(sourcePath, file);
    const destinationPath = path.join(publicAssetDir, fileName);
    fs.writeFileSync(destinationPath, file);
  }

  return `/${paths.publicAssetsBasePath}/${note.slug}/assets/${fileName}`.replace(/\/+/g, '/');
}

function resolutionToDiagnostic(
  resolution: LinkResolution,
  note: PublishedContentNote,
): ContentDiagnostic | null {
  if (!resolution.warning) {
    return null;
  }

  return {
    level: 'warning',
    code: 'LINK_DEGRADED_TO_TEXT',
    message: resolution.warning,
    file: note.relativePath,
  };
}

function removeUndefinedValues<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<T>;
}

function restoreKbMarkdownSyntax(markdown: string): string {
  const restored = markdown
    .replace(/\\\[\\\[/g, '[[')
    .replace(/\\\*\\\*(\[\[[^\]\n]+\]\])\\\*\\\*/g, '**$1**')
    .replace(/\\\*\\\*(\[[^\]\n]+\]\([^)]+\))\\\*\\\*/g, '**$1**')
    .replace(/\\\*(\[\[[^\]\n]+\]\])\\\*/g, '*$1*')
    .replace(/\\\*(\[[^\]\n]+\]\([^)]+\))\\\*/g, '*$1*')
    .replace(/^> \\\[!(TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]/gm, '> [!$1]');

  // 이미지 캡션(alt)에 보존한 강조/취소선/인라인 코드/math 마커의 이스케이프를 해제합니다.
  // 중첩 대괄호(`![a [b] c](...)`)를 고려해 alt 경계를 상태 머신으로 찾습니다.
  return unescapeMarkersInImageAlts(restored);
}

function isReferencesHeading(node: RootContent): node is Heading {
  if (node.type !== 'heading') {
    return false;
  }

  return isReferenceHeadingTitle(toString(node));
}

function collectReferenceSectionChildren(tree: Root): Set<RootContent> {
  const referenceChildren = new Set<RootContent>();
  let referenceDepth: number | null = null;

  for (const child of tree.children) {
    if (referenceDepth !== null) {
      if (child.type === 'heading' && child.depth <= referenceDepth) {
        referenceDepth = null;
      } else {
        referenceChildren.add(child);
        continue;
      }
    }

    if (isReferencesHeading(child)) {
      referenceDepth = child.depth;
    }
  }

  return referenceChildren;
}

interface ParsedWikiLink {
  target: string;
  alias?: string;
}

function parseWikiLink(value: string): ParsedWikiLink {
  const separatorIndex = value.indexOf('|');

  if (separatorIndex === -1) {
    return {
      target: value.trim(),
    };
  }

  return {
    target: value.slice(0, separatorIndex).trim(),
    alias: value.slice(separatorIndex + 1).trim(),
  };
}

function wikiTargetPage(target: string): string {
  return target.split('#')[0].trim();
}

function wikiTargetAnchor(target: string): string | undefined {
  return target.split('#')[1]?.trim() || undefined;
}

function withAnchor(href: string, anchor?: string): string {
  return anchor ? `${href}#${slugifyHeading(anchor)}` : href;
}

function resolveReferenceWikiLink(
  parsed: ParsedWikiLink,
  index: ContentIndex,
  lang: PostLang,
): { label: string; href: string } | null {
  const targetPage = wikiTargetPage(parsed.target);
  let publishedNote =
    lang !== DEFAULT_POST_LANG ? index.translatedByBasename.get(lang)?.get(targetPage) : undefined;

  if (!publishedNote) {
    const canonicalNote = index.publishedByBasename.get(targetPage);
    if (canonicalNote && lang !== DEFAULT_POST_LANG) {
      // 같은 slug의 같은 언어 번역본이 있으면 번역본 경로를 우선합니다.
      publishedNote =
        index.translatedByBasename.get(lang)?.get(canonicalNote.slug) ?? canonicalNote;
    } else {
      publishedNote = canonicalNote;
    }
  }

  if (publishedNote) {
    // 참고문헌의 내부 포스트 링크는 (번역 alias보다) 대상 포스트의 실제 제목을 우선 표시합니다.
    return {
      label: publishedNote.frontmatter.title || parsed.alias || publishedNote.stem,
      href: withAnchor(publishedNote.href, wikiTargetAnchor(parsed.target)),
    };
  }

  const sourceUrl = index.sourceUrlByBasename.get(targetPage);

  if (sourceUrl) {
    return {
      label: parsed.alias || index.sourceLabelByBasename.get(targetPage) || parsed.target,
      href: sourceUrl,
    };
  }

  return null;
}

function transformReferenceWikilinks(tree: Root, index: ContentIndex, lang: PostLang) {
  const referenceChildren = collectReferenceSectionChildren(tree);

  if (referenceChildren.size === 0) {
    return;
  }

  for (const child of referenceChildren) {
    visit(child as Node, 'text', (node, nodeIndex, parent) => {
      if (!parent || typeof nodeIndex !== 'number') {
        return;
      }

      const text = node as Text;
      const replacements: Array<Text | Link> = [];
      const wikiLinkPattern = /\[\[([^\]]+)\]\]/g;
      let cursor = 0;
      let changed = false;

      for (const match of text.value.matchAll(wikiLinkPattern)) {
        const rawValue = match[1];
        const start = match.index ?? 0;
        const parsed = parseWikiLink(rawValue);
        const resolution = resolveReferenceWikiLink(parsed, index, lang);

        if (!resolution) {
          continue;
        }

        if (start > cursor) {
          replacements.push(textNode(text.value.slice(cursor, start)));
        }

        replacements.push(markdownLinkNode(resolution.label, resolution.href));
        cursor = start + match[0].length;
        changed = true;
      }

      if (!changed) {
        return;
      }

      if (cursor < text.value.length) {
        replacements.push(textNode(text.value.slice(cursor)));
      }

      replaceChildWithNodes(parent as Parent | undefined, nodeIndex, replacements);
    });
  }
}

function isLinkNode(value: unknown): value is Link {
  return Boolean(
    value && typeof value === 'object' && (value as { type?: unknown }).type === 'link',
  );
}

function isTextNode(value: unknown): value is Text {
  return Boolean(
    value && typeof value === 'object' && (value as { type?: unknown }).type === 'text',
  );
}

function isReferenceOriginalLabel(value: string): boolean {
  return /^(원문|original)$/i.test(value.trim());
}

function removeDuplicateReferenceOriginalLinks(tree: Root) {
  const referenceChildren = collectReferenceSectionChildren(tree);

  if (referenceChildren.size === 0) {
    return;
  }

  for (const child of referenceChildren) {
    visit(child as Node, 'paragraph', node => {
      const paragraph = node as Parent;

      for (let index = 0; index < paragraph.children.length - 2; index += 1) {
        const first = paragraph.children[index];
        const separator = paragraph.children[index + 1];
        const second = paragraph.children[index + 2];

        if (!isLinkNode(first) || !isTextNode(separator) || !isLinkNode(second)) {
          continue;
        }

        if (!/^\s*[—-]\s*$/.test(separator.value)) {
          continue;
        }

        if (first.url !== second.url || !isReferenceOriginalLabel(toString(second))) {
          continue;
        }

        paragraph.children.splice(index + 1, 2);
        index -= 1;
      }
    });
  }
}

const FIGURE_PATTERN =
  /<figure\b[^>]*>\s*<img\b[^>]*\/?>\s*(?:<figcaption\b[^>]*>[\s\S]*?<\/figcaption>\s*)?<\/figure>/gi;

function extractHtmlAttribute(tag: string, name: string): string | undefined {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return match?.[1];
}

/**
 * HTML 태그를 남김없이 제거합니다. 중첩 태그(`<scr<script>ipt>`)가 1회 치환 후
 * 다시 태그를 만들 수 있으므로 고정점에 도달할 때까지 반복합니다.
 */
function stripHtmlTags(value: string): string {
  let result = value;
  let previous: string;

  do {
    previous = result;
    result = result.replace(/<[^>]*>/g, '');
  } while (result !== previous);

  return result;
}

/**
 * KB에서 이미지를 나란히 배치할 때 쓰는 raw HTML 블록
 * (`<div style="display: flex...">` 안의 `<figure><img/><figcaption/></figure>` 목록)을
 * 같은 문단의 연속 markdown 이미지로 변환합니다.
 *
 * raw HTML img는 exporter의 에셋 복사/webp 변환을 타지 못하므로, 알려진 패턴은
 * markdown 이미지 노드로 바꿔 파이프라인 전체(에셋·캡션·라이트박스·row 배치)를 태웁니다.
 * 패턴에 맞지 않는 raw HTML은 건드리지 않고 check-content 게이트가 실패 처리합니다.
 */
function transformHtmlImageFigures(tree: Root) {
  visit(tree, 'html', (node, index, parent) => {
    const html = node as { value?: string };
    const value = html.value;

    if (!parent || typeof index !== 'number' || typeof value !== 'string') {
      return;
    }

    const trimmed = value.trim();
    if (
      !/^<div\b[^>]*>/i.test(trimmed) ||
      !/<\/div>\s*$/i.test(trimmed) ||
      !/<img\b/i.test(trimmed)
    ) {
      return;
    }

    const figures = trimmed.match(FIGURE_PATTERN) ?? [];
    if (figures.length === 0) {
      return;
    }

    // div 안에 figure 외 다른 콘텐츠가 있으면 변환하지 않는다 (게이트가 잡도록 둔다)
    const remainder = trimmed
      .replace(/^<div\b[^>]*>/i, '')
      .replace(/<\/div>\s*$/i, '')
      .replace(FIGURE_PATTERN, '')
      .trim();
    if (remainder) {
      return;
    }

    const images: Image[] = [];
    for (const figure of figures) {
      const imgTag = figure.match(/<img\b[^>]*\/?>/i)?.[0] ?? '';
      const src = extractHtmlAttribute(imgTag, 'src');
      if (!src) {
        return;
      }

      const rawFigcaption = figure.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1];
      const figcaption = rawFigcaption ? stripHtmlTags(rawFigcaption).trim() : undefined;
      const alt = figcaption || extractHtmlAttribute(imgTag, 'alt') || '';

      images.push({ type: 'image', url: src, alt });
    }

    const paragraphChildren: RootContent[] = [];
    images.forEach((image, imageIndex) => {
      if (imageIndex > 0) {
        paragraphChildren.push(textNode('\n'));
      }
      paragraphChildren.push(image);
    });

    parent.children[index] = {
      type: 'paragraph',
      children: paragraphChildren,
    } as RootContent;
  });
}

export function transformMarkdownForExport(
  note: PublishedContentNote,
  index: ContentIndex,
  paths: ExportPaths,
): { markdown: string; diagnostics: ContentDiagnostic[]; cover?: string } {
  const diagnostics: ContentDiagnostic[] = [];
  const normalizedContent = normalizeMarkdownImageSizeSyntax(note.content);
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .parse(normalizedContent) as Root;
  let cover = note.frontmatter.cover;

  normalizeKatexMathTree(tree);
  // raw HTML figure 블록을 markdown 이미지 row로 변환 (아래 image visit에서 에셋 처리됨)
  transformHtmlImageFigures(tree);
  transformReferenceWikilinks(tree, index, note.lang);
  removeDuplicateReferenceOriginalLinks(tree);

  if (cover && isLocalAssetUrl(cover)) {
    try {
      cover = copyAsset(note, cover, paths, { stretchSvg: true, assetKind: 'cover' });
    } catch (error) {
      diagnostics.push({
        level: 'error',
        code: 'MISSING_COVER_ASSET',
        message: error instanceof Error ? error.message : String(error),
        file: note.relativePath,
      });
    }
  }

  visit(tree, ['link', 'image'], (node, nodeIndex, parent) => {
    if (node.type === 'link') {
      const link = node as Link;
      const label = toString(link) || link.url;
      const resolution = resolveMarkdownLink(link.url, label, note, index);
      const diagnostic = resolutionToDiagnostic(resolution, note);

      if (diagnostic) {
        diagnostics.push(diagnostic);
      }

      if (resolution.kind === 'text') {
        replaceChild(parent as Parent | undefined, nodeIndex, textNode(resolution.label));
        return;
      }

      link.url = resolution.href || link.url;
      return;
    }

    const image = node as Image;

    // mdast는 `![*강조*](url)`의 alt를 계산할 때 강조/취소선/math 마커를 제거하므로,
    // 원본 소스에서 alt 부분을 그대로 되살려 캡션 서식이 export 결과에 남도록 합니다.
    // (stringify가 마커를 이스케이프하면 restoreKbMarkdownSyntax가 다시 풀어냅니다.)
    const startOffset = image.position?.start?.offset;
    const endOffset = image.position?.end?.offset;
    if (typeof startOffset === 'number' && typeof endOffset === 'number') {
      const rawImage = normalizedContent.slice(startOffset, endOffset);
      // 중첩 대괄호(`![a [b] c](...)`)·이스케이프까지 고려해 alt를 정확히 추출합니다.
      const rawAlt = extractImageAltAtStart(rawImage);
      if (rawAlt !== null) {
        image.alt = rawAlt;
      }
    }

    if (!isLocalAssetUrl(image.url)) {
      return;
    }

    try {
      image.url = copyAsset(note, image.url, paths);
    } catch (error) {
      diagnostics.push({
        level: 'error',
        code: 'MISSING_IMAGE_ASSET',
        message: error instanceof Error ? error.message : String(error),
        file: note.relativePath,
      });
    }
  });

  const body = restoreKbMarkdownSyntax(
    String(unified().use(remarkGfm).use(remarkMath).use(remarkStringify).stringify(tree)),
  );
  const outputFrontmatter = {
    ...note.frontmatter,
    category: note.frontmatter.category || deriveCategoryFromPath(note.dirRelativePath),
    slug: note.slug,
    cover,
    // kr 원문은 lang 필드를 항상 제거하고(실수로 lang: kr가 있어도 제외),
    // 번역본만 정규화된 언어 코드를 기록합니다(KB의 jp → ja 등).
    lang: note.lang === DEFAULT_POST_LANG ? undefined : note.lang,
  };

  return {
    markdown: matter.stringify(body, removeUndefinedValues(outputFrontmatter)).trimEnd() + '\n',
    diagnostics,
    cover,
  };
}

/**
 * 언어별 export 파일 이름. kr은 기존 index.md를 유지하고 번역본은 index.<lang>.md입니다.
 */
export function exportedPostFileName(lang: PostLang): string {
  return lang === DEFAULT_POST_LANG ? 'index.md' : `index.${lang}.md`;
}

export function exportPublishedPost(
  note: PublishedContentNote,
  index: ContentIndex,
  paths: ExportPaths,
): ExportedPost {
  const outputDir = path.join(paths.contentRoot, note.slug);
  ensureDirectory(outputDir);

  const outputPath = path.join(outputDir, exportedPostFileName(note.lang));
  const transformed = transformMarkdownForExport(note, index, paths);
  fs.writeFileSync(outputPath, transformed.markdown, 'utf8');

  return {
    note,
    markdown: transformed.markdown,
    outputPath,
    diagnostics: transformed.diagnostics,
  };
}
