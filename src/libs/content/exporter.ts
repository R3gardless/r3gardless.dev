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

import { deriveCategoryFromPath } from './category';
import { normalizeMarkdownImageSizeSyntax } from './imageDimensions';
import { resolveMarkdownLink } from './linkResolver';
import { normalizeKatexMathTree } from './math';
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
    children: [textNode(label)],
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

  const file = readAssetForExport(sourcePath, options);
  const fileName = createContentHashedFileName(sourcePath, file);
  const destinationPath = path.join(publicAssetDir, fileName);
  fs.writeFileSync(destinationPath, file);

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
  return markdown
    .replace(/\\\[\\\[/g, '[[')
    .replace(/\\\*\\\*(\[\[[^\]\n]+\]\])\\\*\\\*/g, '**$1**')
    .replace(/\\\*\\\*(\[[^\]\n]+\]\([^)]+\))\\\*\\\*/g, '**$1**')
    .replace(/^> \\\[!(TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]/gm, '> [!$1]');
}

function isReferencesHeading(node: RootContent): node is Heading {
  if (node.type !== 'heading') {
    return false;
  }

  const title = toString(node)
    .trim()
    .toLowerCase()
    .replace(/^\d+(?:\.\d+)*\.?\s*/, '');
  return (
    title === '참고문헌' ||
    title === 'references' ||
    title === 'reference' ||
    title === 'sources' ||
    title === 'source'
  );
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

function transformReferenceSourceWikilinks(tree: Root, index: ContentIndex) {
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
        const sourceUrl = index.sourceUrlByBasename.get(wikiTargetPage(parsed.target));

        if (!sourceUrl) {
          continue;
        }

        if (start > cursor) {
          replacements.push(textNode(text.value.slice(cursor, start)));
        }

        const label =
          parsed.alias ||
          index.sourceLabelByBasename.get(wikiTargetPage(parsed.target)) ||
          parsed.target;
        replacements.push(markdownLinkNode(label, sourceUrl));
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
  transformReferenceSourceWikilinks(tree, index);
  removeDuplicateReferenceOriginalLinks(tree);

  if (cover && isLocalAssetUrl(cover)) {
    try {
      cover = copyAsset(note, cover, paths, { stretchSvg: true });
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
  };

  return {
    markdown: matter.stringify(body, removeUndefinedValues(outputFrontmatter)).trimEnd() + '\n',
    diagnostics,
    cover,
  };
}

export function exportPublishedPost(
  note: PublishedContentNote,
  index: ContentIndex,
  paths: ExportPaths,
): ExportedPost {
  const outputDir = path.join(paths.contentRoot, note.slug);
  ensureDirectory(outputDir);

  const outputPath = path.join(outputDir, 'index.md');
  const transformed = transformMarkdownForExport(note, index, paths);
  fs.writeFileSync(outputPath, transformed.markdown, 'utf8');

  return {
    note,
    markdown: transformed.markdown,
    outputPath,
    diagnostics: transformed.diagnostics,
  };
}
