#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type { Image, Link, Root } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { resolveCategoryRgb } from '../src/libs/content/category.js';
import type { PostMeta } from '../src/types/blog.js';
import {
  PROJECT_ROOT,
  resolveContentRoot,
  resolveKbPath,
  resolvePublicRoot,
} from './content-paths.js';

const FORBIDDEN_CATEGORY_NAMES = new Set([
  'concept',
  'entity',
  'experience',
  'moc',
  'report',
  'source',
  'youtube',
]);
const RELATIVE_MARKDOWN_LINK_PATTERN = /\.mdx?(#.*)?$/i;
const LOCAL_ASSET_PATTERN = /^(\.{1,2}\/|assets\/)/i;
const PUBLIC_CONTENT_ASSET_PATTERN = /^\/content\/posts\/[^/]+\/assets\/[^?#]+$/;
const CONTENT_HASHED_ASSET_PATTERN = /\.[a-f0-9]{12}\.[^/.?#]+$/i;

interface MathNode {
  type: 'math' | 'inlineMath';
  value: string;
}

interface ContentLinkIndexData {
  sources?: Record<string, string>;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function readExportedPosts(contentRoot: string) {
  if (!fs.existsSync(contentRoot)) {
    return [];
  }

  return fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(contentRoot, entry.name, 'index.md'))
    .filter(filePath => fs.existsSync(filePath))
    .sort();
}

function walkMarkdownFiles(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }

    const absolutePath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMarkdownFiles(absolutePath));
      continue;
    }

    if (entry.isFile() && /\.mdx?$/i.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function publicFileExists(publicPath: string): boolean {
  if (/^(https?:)?\/\//i.test(publicPath) || /^[a-z][a-z0-9+.-]*:/i.test(publicPath)) {
    return true;
  }

  const filePath = publicPathToFilePath(publicPath);
  return Boolean(filePath && fs.existsSync(filePath));
}

function publicPathToFilePath(publicPath: string): string | null {
  if (/^(https?:)?\/\//i.test(publicPath) || /^[a-z][a-z0-9+.-]*:/i.test(publicPath)) {
    return null;
  }

  return publicPath.startsWith('/') ? path.join(resolvePublicRoot(), publicPath) : null;
}

function isPublicContentAssetPath(value: string): boolean {
  return PUBLIC_CONTENT_ASSET_PATTERN.test(value);
}

function hasContentHashInAssetName(value: string): boolean {
  return CONTENT_HASHED_ASSET_PATTERN.test(value);
}

function checkMarkdownMath(filePath: string, content: string, errors: string[]) {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(content) as Root;
  const relativeFile = path.relative(PROJECT_ROOT, filePath);

  visit(tree, ['math', 'inlineMath'], node => {
    const mathNode = node as MathNode;
    const brokenEscapes = ['\\_', '\\[', '\\]'].filter(pattern => mathNode.value.includes(pattern));

    if (brokenEscapes.length > 0) {
      errors.push(
        `${relativeFile}: KaTeX math contains escaped syntax likely introduced by export: ${brokenEscapes.join(', ')}`,
      );
    }
  });
}

function checkMarkdownLinksAndImages(filePath: string, content: string, errors: string[]) {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(content) as Root;
  const relativeFile = path.relative(PROJECT_ROOT, filePath);

  if (/\\\*\\\*(?:\[\[[^\]\n]+\]\]|\[[^\]\n]+\]\([^)]+\))\\\*\\\*/.test(content)) {
    errors.push(`${relativeFile}: bold links must not be exported with escaped ** markers.`);
  }

  visit(tree, ['link', 'image'], node => {
    if (node.type === 'link') {
      const link = node as Link;
      if (RELATIVE_MARKDOWN_LINK_PATTERN.test(link.url)) {
        errors.push(`${relativeFile}: leftover Markdown file link was not rewritten: ${link.url}`);
      }
      return;
    }

    const image = node as Image;
    if (LOCAL_ASSET_PATTERN.test(image.url)) {
      errors.push(`${relativeFile}: leftover local image path was not exported: ${image.url}`);
      return;
    }

    if (!publicFileExists(image.url)) {
      errors.push(`${relativeFile}: image asset does not exist in public/: ${image.url}`);
    }

    if (isPublicContentAssetPath(image.url) && !hasContentHashInAssetName(image.url)) {
      errors.push(
        `${relativeFile}: exported image asset must include a content hash for cache busting: ${image.url}`,
      );
    }
  });
}

function extractReferenceSections(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const sections: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const headingMatch = lines[index].match(
      /^(#{1,6})\s+(?:\d+(?:\.\d+)*\.?\s*)?(참고문헌|references?|reference|sources?|source)\s*$/i,
    );

    if (!headingMatch) {
      continue;
    }

    const headingDepth = headingMatch[1].length;
    const sectionLines: string[] = [];

    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const nextHeadingMatch = lines[cursor].match(/^(#{1,6})\s+/);
      if (nextHeadingMatch && nextHeadingMatch[1].length <= headingDepth) {
        break;
      }

      sectionLines.push(lines[cursor]);
    }

    sections.push(sectionLines.join('\n'));
  }

  return sections;
}

function wikiTargetPage(rawTarget: string): string {
  const [target] = rawTarget.split('|');
  return target.split('#')[0].trim();
}

function checkReferenceSourceWikilinks(
  filePath: string,
  content: string,
  errors: string[],
  linkIndex: ContentLinkIndexData,
) {
  const sourceLinks = linkIndex.sources ?? {};
  const relativeFile = path.relative(PROJECT_ROOT, filePath);

  if (Object.keys(sourceLinks).length === 0) {
    return;
  }

  for (const section of extractReferenceSections(content)) {
    for (const match of section.matchAll(/\[\[([^\]]+)\]\]/g)) {
      const targetPage = wikiTargetPage(match[1]);

      if (sourceLinks[targetPage]) {
        errors.push(
          `${relativeFile}: reference source wikilink "${match[0]}" must be exported as a Markdown link to source_url.`,
        );
      }
    }
  }
}

function checkSourceFrontmatter(errors: string[]) {
  const kbRoot = resolveKbPath();
  const sourceFiles = walkMarkdownFiles(kbRoot);

  for (const filePath of sourceFiles) {
    const parsed = matter(fs.readFileSync(filePath, 'utf8'));
    const frontmatter = parsed.data as Record<string, unknown>;
    if (frontmatter.publish !== true || !Object.hasOwn(frontmatter, 'thumbnail')) {
      continue;
    }

    const relativeFile = path.relative(kbRoot, filePath);
    errors.push(
      `${relativeFile}: published KNOWLEDGE_BASE frontmatter must use cover, not thumbnail.`,
    );
  }
}

function checkPostMetadata(postFiles: string[], errors: string[], linkIndex: ContentLinkIndexData) {
  const postMetaPath = path.join(PROJECT_ROOT, 'public', 'data', 'postMeta.json');
  const posts = readJson<PostMeta[]>(postMetaPath);
  const postsBySlug = new Map(posts.map(post => [post.slug, post]));
  const postSlugs = new Set(postFiles.map(filePath => path.basename(path.dirname(filePath))));
  const categoryColorByName = new Map<string, string>();
  const categoryRgbByName = new Map<string, string>();

  if (posts.length !== postFiles.length) {
    errors.push(
      `postMeta count (${posts.length}) does not match exported post count (${postFiles.length}).`,
    );
  }

  for (const post of posts) {
    if (!postSlugs.has(post.slug)) {
      errors.push(`public/data/postMeta.json references missing content post "${post.slug}".`);
    }
  }

  for (const filePath of postFiles) {
    const slug = path.basename(path.dirname(filePath));
    const post = postsBySlug.get(slug);
    const parsed = matter(fs.readFileSync(filePath, 'utf8'));
    const frontmatter = parsed.data as Record<string, unknown>;
    const relativeFile = path.relative(PROJECT_ROOT, filePath);

    if (!post) {
      errors.push(`${relativeFile}: missing postMeta record for slug "${slug}".`);
      continue;
    }

    if (frontmatter.layer === 'source') {
      errors.push(`${relativeFile}: source-layer notes must never be exported.`);
    }

    if (frontmatter.publish !== true) {
      errors.push(`${relativeFile}: exported posts must preserve publish: true.`);
    }

    if (Object.hasOwn(frontmatter, 'thumbnail')) {
      errors.push(`${relativeFile}: exported frontmatter must use cover, not thumbnail.`);
    }

    const frontmatterCategory =
      typeof frontmatter.category === 'string' ? frontmatter.category.trim() : '';
    const generatedCategory = post.category.text.trim();
    const frontmatterCategoryColor =
      typeof frontmatter.category_color === 'string' ? frontmatter.category_color.trim() : '';

    if (!generatedCategory || generatedCategory === 'Uncategorized') {
      errors.push(`${relativeFile}: generated category is empty or Uncategorized.`);
    }

    if (
      FORBIDDEN_CATEGORY_NAMES.has(generatedCategory.toLowerCase()) &&
      frontmatterCategory !== generatedCategory
    ) {
      errors.push(
        `${relativeFile}: generated category "${generatedCategory}" looks like a KNOWLEDGE_BASE type/layer, not a blog category.`,
      );
    }

    if (frontmatterCategory && generatedCategory !== frontmatterCategory) {
      errors.push(
        `${relativeFile}: generated category "${generatedCategory}" does not match frontmatter category "${frontmatterCategory}".`,
      );
    }

    if (frontmatterCategoryColor && post.category.color !== frontmatterCategoryColor) {
      errors.push(
        `${relativeFile}: postMeta category color "${post.category.color}" does not match frontmatter category_color "${frontmatterCategoryColor}".`,
      );
    }

    const previousColor = categoryColorByName.get(generatedCategory);
    if (previousColor && previousColor !== post.category.color) {
      errors.push(
        `${relativeFile}: category "${generatedCategory}" must keep a stable color, got "${post.category.color}" after "${previousColor}".`,
      );
    }
    categoryColorByName.set(generatedCategory, post.category.color);

    const expectedRgb = resolveCategoryRgb(generatedCategory);
    if (!post.category.rgb) {
      errors.push(`${relativeFile}: postMeta category must include deterministic rgb.`);
    } else if (post.category.rgb !== expectedRgb) {
      errors.push(
        `${relativeFile}: postMeta category rgb "${post.category.rgb}" must match hashed rgb "${expectedRgb}".`,
      );
    }

    const previousRgb = categoryRgbByName.get(generatedCategory);
    if (previousRgb && previousRgb !== post.category.rgb) {
      errors.push(
        `${relativeFile}: category "${generatedCategory}" must keep a stable rgb, got "${post.category.rgb}" after "${previousRgb}".`,
      );
    }
    if (post.category.rgb) {
      categoryRgbByName.set(generatedCategory, post.category.rgb);
    }

    const cover = typeof frontmatter.cover === 'string' ? frontmatter.cover.trim() : '';
    if (cover) {
      if (LOCAL_ASSET_PATTERN.test(cover)) {
        errors.push(`${relativeFile}: cover must be exported to a public path, got "${cover}".`);
      }

      if (!publicFileExists(cover)) {
        errors.push(`${relativeFile}: cover asset does not exist in public/: ${cover}`);
      }

      if (isPublicContentAssetPath(cover) && !hasContentHashInAssetName(cover)) {
        errors.push(
          `${relativeFile}: cover asset must include a content hash for cache busting: ${cover}`,
        );
      }

      const coverFilePath = publicPathToFilePath(cover);
      if (
        coverFilePath &&
        coverFilePath.endsWith('.svg') &&
        fs.existsSync(coverFilePath) &&
        !fs.readFileSync(coverFilePath, 'utf8').includes('preserveAspectRatio="none"')
      ) {
        errors.push(
          `${relativeFile}: exported SVG cover must set preserveAspectRatio="none" to fill fixed frames: ${cover}`,
        );
      }

      if (post.cover !== cover) {
        errors.push(
          `${relativeFile}: postMeta cover "${post.cover || ''}" does not match frontmatter cover "${cover}".`,
        );
      }
    }

    if (!frontmatterCategory) {
      errors.push(`${relativeFile}: exported frontmatter must include category.`);
    }

    if (!frontmatter.title || typeof frontmatter.title !== 'string') {
      errors.push(`${relativeFile}: exported frontmatter must include title.`);
    }

    if (!frontmatter.description || typeof frontmatter.description !== 'string') {
      errors.push(`${relativeFile}: exported frontmatter must include description.`);
    }

    if (!frontmatter.slug || typeof frontmatter.slug !== 'string') {
      errors.push(`${relativeFile}: exported frontmatter must include slug.`);
    }

    if (frontmatter.slug !== slug) {
      errors.push(
        `${relativeFile}: frontmatter slug "${String(frontmatter.slug)}" must match directory "${slug}".`,
      );
    }

    checkMarkdownMath(filePath, parsed.content, errors);
    checkMarkdownLinksAndImages(filePath, parsed.content, errors);
    checkReferenceSourceWikilinks(filePath, parsed.content, errors, linkIndex);
  }

  if (categoryColorByName.size > 1) {
    const colorCount = new Set(categoryColorByName.values()).size;
    if (colorCount === 1) {
      errors.push('Multiple blog categories must not all resolve to the same category color.');
    }
  }

  if (categoryRgbByName.size > 1) {
    const rgbCount = new Set(categoryRgbByName.values()).size;
    if (rgbCount === 1) {
      errors.push('Multiple blog categories must not all resolve to the same category rgb.');
    }
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readCssRules(css: string, selector: string): string[] {
  return [...css.matchAll(new RegExp(`${escapeRegExp(selector)}\\s*\\{([^}]*)\\}`, 'g'))].map(
    match => match[1],
  );
}

function requireCssDeclarations(
  css: string,
  relativeFile: string,
  errors: string[],
  selector: string,
  declarations: Array<[string, string]>,
) {
  const rules = readCssRules(css, selector);
  if (rules.length === 0) {
    errors.push(`${relativeFile}: missing Markdown CSS rule "${selector}".`);
    return;
  }

  for (const [property, value] of declarations) {
    const declarationPattern = new RegExp(`${property}:\\s*${escapeRegExp(value)};`);
    if (!rules.some(rule => declarationPattern.test(rule))) {
      errors.push(`${relativeFile}: "${selector}" must keep "${property}: ${value};".`);
    }
  }
}

function checkMarkdownCss(errors: string[]) {
  const legacyCssPath = path.join(PROJECT_ROOT, 'src', 'styles', 'notion.css');
  if (fs.existsSync(legacyCssPath)) {
    errors.push('src/styles/notion.css must not exist; Markdown body styles live in markdown.css.');
  }

  const postBodyPath = path.join(
    PROJECT_ROOT,
    'src',
    'components',
    'ui',
    'blog',
    'PostBody',
    'PostBody.tsx',
  );
  const postBodySource = fs.readFileSync(postBodyPath, 'utf8');
  if (postBodySource.includes('styles/notion.css')) {
    errors.push('PostBody must import markdown.css, not notion.css.');
  }

  const cssPath = path.join(PROJECT_ROOT, 'src', 'styles', 'markdown.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  const relativeFile = path.relative(PROJECT_ROOT, cssPath);

  if (!css.includes('font-family: var(--font-pretendard), var(--notion-font), sans-serif;')) {
    errors.push(`${relativeFile}: .post-body must use Pretendard as the body font.`);
  }

  if (/\.post-body\s*\{[\s\S]*?font-family:\s*var\(--font-maruBuri\)/.test(css)) {
    errors.push(`${relativeFile}: .post-body must not use MaruBuri for body copy.`);
  }

  if (
    css.includes('.post-body .wiki-link::before') ||
    css.includes('.post-body .wiki-link::after')
  ) {
    errors.push(`${relativeFile}: rendered wiki links must not add visible bracket decorations.`);
  }

  if (/\.post-body h2[\s\S]{0,240}border-bottom/.test(css)) {
    errors.push(`${relativeFile}: Markdown h2 should keep the old Notion-like heading style.`);
  }

  if (/\.post-body h[1-3][\s\S]{0,200}clamp\(/.test(css)) {
    errors.push(
      `${relativeFile}: Markdown headings must use stable fixed sizes, not viewport clamp.`,
    );
  }

  const pxMatches = [...css.matchAll(/\b\d*\.?\d+px\b/g)].map(match => match[0]);
  if (pxMatches.length > 0) {
    errors.push(
      `${relativeFile}: Markdown body CSS must use rem units instead of px. Found: ${[...new Set(pxMatches)].join(', ')}`,
    );
  }

  requireCssDeclarations(css, relativeFile, errors, '.post-body p', [
    ['margin', '0.0625rem 0'],
    ['padding', '0.1875rem 0.125rem'],
    ['font-size', '1rem'],
    ['line-height', '1.6'],
    ['white-space', 'pre-wrap'],
    ['word-break', 'break-word'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body ul', [
    ['padding-inline-start', '1.7rem'],
    ['list-style-type', 'disc'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body ol', [
    ['padding-inline-start', '1.6rem'],
    ['list-style-type', 'decimal'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body li', [
    ['padding', '0.375rem 0'],
    ['white-space', 'pre-wrap'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body :not(pre) > code', [
    ['padding', '0.2rem 0.4rem'],
    ['border-radius', '0.1875rem'],
    ['background', 'var(--bg-color-2)'],
    ['color', '#eb5757'],
    ['font-size', '85%'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body pre', [
    ['margin', '0.25rem 0'],
    ['padding', '1rem'],
    ['border-radius', '0.1875rem'],
    ['background', 'var(--bg-color-1)'],
    ['color', 'var(--fg-color)'],
    ['font-size', '0.875rem'],
    ['tab-size', '2'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body table', [
    ['display', 'block'],
    ['width', '100%'],
    ['margin', '0.25rem 0'],
    ['font-size', '1rem'],
  ]);

  if (
    !/\.post-body th,\s*\.post-body td\s*\{[\s\S]*?padding:\s*0\.5rem;[\s\S]*?border:\s*0\.0625rem solid var\(--fg-color-5\);[\s\S]*?white-space:\s*normal;[\s\S]*?word-break:\s*break-word;[\s\S]*?overflow-wrap:\s*break-word;/.test(
      css,
    )
  ) {
    errors.push(`${relativeFile}: table cells must keep the old Notion-like cell spacing.`);
  }

  if (!/\.post-body blockquote > p\s*\{[\s\S]*?margin:\s*0;[\s\S]*?padding:\s*0;/.test(css)) {
    errors.push(
      `${relativeFile}: blockquote paragraph padding must be reset so quote vertical padding matches the old Notion style.`,
    );
  }

  if (
    !/\.post-body blockquote\s*\{[\s\S]*?margin:\s*0\.25rem 0;[\s\S]*?padding:\s*0\.15rem 0\.9rem;/.test(
      css,
    )
  ) {
    errors.push(`${relativeFile}: blockquote vertical padding must stay compact.`);
  }

  if (/\.post-body blockquote\s*\{[^}]*white-space:\s*pre-wrap;/.test(css)) {
    errors.push(
      `${relativeFile}: blockquote itself must not use pre-wrap because renderer whitespace becomes visible blank lines.`,
    );
  }

  if (
    !/\.post-body pre\s*\{[\s\S]*?background:\s*var\(--bg-color-1\);[\s\S]*?color:\s*var\(--fg-color\);/.test(
      css,
    )
  ) {
    errors.push(
      `${relativeFile}: code blocks must keep the old Notion-like bg-color-1 background and fg-color foreground.`,
    );
  }

  if (!css.includes('color: var(--shiki-light);')) {
    errors.push(`${relativeFile}: light mode code tokens must use --shiki-light colors.`);
  }

  if (!css.includes('color: var(--shiki-dark);')) {
    errors.push(`${relativeFile}: dark mode code tokens must use --shiki-dark colors.`);
  }

  if (!/\.post-body \.katex-display\s*\{[\s\S]*?padding:\s*0\.625rem 0\.125rem;/.test(css)) {
    errors.push(`${relativeFile}: display KaTeX blocks must keep enlarged vertical padding.`);
  }

  const markdownImageRules = readCssRules(css, '.post-body .markdown-image-trigger > img').join(
    '\n',
  );
  if (/background\s*:/.test(markdownImageRules)) {
    errors.push(`${relativeFile}: Markdown images must not set a background color.`);
  }

  requireCssDeclarations(css, relativeFile, errors, '.post-body .markdown-image', [
    ['max-width', '45rem'],
    ['margin', '0.5rem auto'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body .markdown-image-trigger', [
    ['cursor', 'zoom-in'],
    ['background', 'transparent'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body .markdown-image-lightbox', [
    ['position', 'fixed'],
    ['cursor', 'default'],
  ]);

  requireCssDeclarations(
    css,
    relativeFile,
    errors,
    '.post-body .markdown-image-lightbox-backdrop',
    [
      ['position', 'absolute'],
      ['cursor', 'default'],
    ],
  );

  requireCssDeclarations(css, relativeFile, errors, '.post-body .markdown-image-lightbox-close', [
    ['cursor', 'pointer'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body .markdown-image-lightbox-content', [
    ['pointer-events', 'none'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body .markdown-image-lightbox-image', [
    ['width', 'min(92vw, 62.5rem, calc(82vh * var(--markdown-image-aspect-ratio)))'],
    ['object-fit', 'contain'],
    ['pointer-events', 'auto'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body .markdown-image-lightbox-caption', [
    ['pointer-events', 'auto'],
  ]);

  requireCssDeclarations(
    css,
    relativeFile,
    errors,
    ".post-body .markdown-image[data-sized='true']",
    [['align-items', 'center']],
  );

  requireCssDeclarations(css, relativeFile, errors, '.post-body .reference-card-list', [
    ['margin', '0.35rem 0'],
    ['padding-inline-start', '0'],
    ['list-style', 'none'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body .reference-card-list-item', [
    ['padding', '0.25rem 0'],
    ['white-space', 'normal'],
    ['list-style', 'none'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body .reference-card', [
    ['display', 'flex'],
    ['width', '100%'],
    ['padding', '0.85rem 0.75rem'],
    ['gap', '0.75rem'],
    ['border', '0.0625rem solid var(--fg-color-1)'],
    ['border-radius', '0.375rem'],
    ['background', 'var(--bg-color-1)'],
    ['box-shadow', '0 0.125rem 0.375rem var(--fg-color-0)'],
    ['cursor', 'pointer'],
    ['text-decoration', 'none'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body .reference-card-title', [
    ['font-size', '0.95rem'],
    ['font-weight', '600'],
    ['line-height', '1.4'],
  ]);

  requireCssDeclarations(css, relativeFile, errors, '.post-body .reference-card-source', [
    ['font-size', '0.8125rem'],
    ['line-height', '1.35'],
  ]);

  if (!/\.post-body \.markdown-alert p\s*\{[\s\S]*?margin:\s*0;[\s\S]*?padding:\s*0;/.test(css)) {
    errors.push(
      `${relativeFile}: Markdown callout paragraphs must not add extra vertical padding.`,
    );
  }

  if (
    !/\.post-body \.markdown-alert p:not\(\.markdown-alert-title\)\s*\{[\s\S]*?padding-left:\s*1\.375rem;/.test(
      css,
    )
  ) {
    errors.push(`${relativeFile}: Markdown callout body must be indented separately from icon.`);
  }

  if (
    /\.post-body h1,\s*\.post-body h2,\s*\.post-body h3,\s*\.post-body h4,\s*\.post-body h5,\s*\.post-body h6\s*\{[\s\S]*?display:\s*inline-block/.test(
      css,
    )
  ) {
    errors.push(
      `${relativeFile}: Markdown headings must be block-level so consecutive h2/h3 headings cannot visually merge.`,
    );
  }

  if (
    !/\.post-body h1,\s*\.post-body h2,\s*\.post-body h3,\s*\.post-body h4,\s*\.post-body h5,\s*\.post-body h6\s*\{[\s\S]*?display:\s*block/.test(
      css,
    )
  ) {
    errors.push(`${relativeFile}: Markdown headings must explicitly use display: block.`);
  }

  if (/\.post-body \.markdown-alert\s*\{[\s\S]*?background:\s*transparent/.test(css)) {
    errors.push(`${relativeFile}: Markdown callouts must keep a visible background.`);
  }

  if (!css.includes('background: var(--markdown-alert-bg);')) {
    errors.push(`${relativeFile}: Markdown callouts must use the alert background variable.`);
  }

  for (const alertType of ['note', 'tip', 'important', 'warning', 'caution']) {
    if (!css.includes(`.post-body .markdown-alert-${alertType} {`)) {
      errors.push(`${relativeFile}: Markdown callout style is missing for ${alertType}.`);
    }
  }
}

function main() {
  const contentRoot = resolveContentRoot();
  const postFiles = readExportedPosts(contentRoot);
  const linkIndexPath = path.join(PROJECT_ROOT, 'public', 'data', 'contentLinkIndex.json');
  const linkIndex = fs.existsSync(linkIndexPath)
    ? readJson<ContentLinkIndexData>(linkIndexPath)
    : {};
  const errors: string[] = [];

  if (postFiles.length === 0) {
    errors.push('content/posts has no exported posts.');
  }

  checkSourceFrontmatter(errors);
  checkPostMetadata(postFiles, errors, linkIndex);
  checkMarkdownCss(errors);

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`[ERROR] ${error}`);
    }
    process.exit(1);
  }

  console.log(`Content quality checked ${postFiles.length} exported posts.`);
}

main();
