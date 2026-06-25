#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type { Code, Root } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { resolveCategoryRgb } from '../src/libs/content/category.js';
import type { PostMeta } from '../src/types/blog.js';
import { PROJECT_ROOT } from './content-paths.js';

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function fail(message: string): never {
  console.error(`[ERROR] ${message}`);
  process.exit(1);
}

function exportedMarkdownPath(slug: string): string {
  return path.join(PROJECT_ROOT, 'content', 'posts', slug, 'index.md');
}

function publicPathToFilePath(publicPath: string): string | null {
  return publicPath.startsWith('/') ? path.join(PROJECT_ROOT, 'public', publicPath) : null;
}

function isExternalUrl(value: string): boolean {
  return /^(https?:)?\/\//i.test(value) || /^[a-z][a-z0-9+.-]*:/i.test(value);
}

function isMarkdownFileHref(value: string): boolean {
  if (!value || value.startsWith('#') || isExternalUrl(value)) {
    return false;
  }

  const [pathname] = value.split('#');
  return /\.mdx?$/i.test(pathname);
}

function renderedMarkdownFileHrefs(html: string): string[] {
  return [...html.matchAll(/"href":"([^"]+)"/g), ...html.matchAll(/\bhref="([^"]+)"/g)]
    .map(match => match[1])
    .filter(isMarkdownFileHref);
}

function createBlogFilterHref(type: 'category' | 'tags', value: string): string {
  const params = new URLSearchParams({ [type]: value });
  return `/blog/?${params.toString()}`;
}

function walkFiles(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }

  const result: string[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const absolutePath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      result.push(...walkFiles(absolutePath));
      continue;
    }

    if (entry.isFile()) {
      result.push(absolutePath);
    }
  }

  return result;
}

function readBuiltCss(outRoot: string): string {
  return walkFiles(path.join(outRoot, '_next', 'static'))
    .filter(filePath => filePath.endsWith('.css'))
    .map(filePath => fs.readFileSync(filePath, 'utf8'))
    .join('\n');
}

function readBuiltCssRule(css: string, selector: string): string {
  return (
    css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\{[^}]*\\}`))?.[0] ??
    ''
  );
}

function detectMarkdownFeatures(markdown: string) {
  const parsed = matter(markdown);
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .parse(parsed.content) as Root;
  const features = {
    alert: /> \[!(TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]/.test(parsed.content),
    table: false,
    image: false,
    math: false,
    mermaid: false,
    code: false,
    details: /<details\b/i.test(parsed.content) && /<summary\b/i.test(parsed.content),
    references:
      /^(#{1,6})\s+(?:\d+(?:\.\d+)*\.?\s*)?(참고문헌|references?|reference|sources?|source)\s*$/im.test(
        parsed.content,
      ),
  };

  visit(tree, node => {
    if (node.type === 'table') {
      features.table = true;
      return;
    }

    if (node.type === 'image') {
      features.image = true;
      return;
    }

    if (node.type === 'math' || node.type === 'inlineMath') {
      features.math = true;
      return;
    }

    if (node.type === 'code') {
      const code = node as Code;
      if (code.lang === 'mermaid') {
        features.mermaid = true;
      } else {
        features.code = true;
      }
    }
  });

  return features;
}

function checkRenderedPost(post: PostMeta, errors: string[]) {
  const markdownPath = exportedMarkdownPath(post.slug);
  const htmlPath = path.join(PROJECT_ROOT, 'out', 'blog', post.slug, 'index.html');

  if (!fs.existsSync(markdownPath)) {
    errors.push(`Exported Markdown is missing for "${post.slug}".`);
    return;
  }

  if (!fs.existsSync(htmlPath)) {
    errors.push(`Post HTML is missing: ${path.relative(PROJECT_ROOT, htmlPath)}`);
    return;
  }

  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const features = detectMarkdownFeatures(markdown);

  const markerChecks = [
    [features.alert, 'markdown-alert', 'GitHub alert'],
    [features.table, '<table', 'GFM table'],
    [features.math, 'katex', 'KaTeX'],
    [features.mermaid, 'mermaid', 'Mermaid'],
    [features.code, 'data-rehype-pretty-code-figure', 'code highlight'],
    [features.details, '<details', 'Markdown details'],
    [features.references, 'reference-card', 'compact reference card'],
    [features.image, 'markdown-image-trigger', 'markdown image lightbox trigger'],
  ] as const;

  for (const [required, marker, label] of markerChecks) {
    if (required && !html.includes(marker)) {
      errors.push(`Post "${post.slug}" is missing rendered ${label} marker "${marker}".`);
    }
  }

  if (features.code && !html.includes('data-theme="github-light github-dark"')) {
    errors.push(`Post "${post.slug}" code blocks must render light and dark Shiki themes.`);
  }

  if (features.code && html.includes('data-theme="github-dark"')) {
    errors.push(`Post "${post.slug}" still renders dark-only code highlighting.`);
  }

  if (features.details && !html.includes('markdown-details-summary')) {
    errors.push(`Post "${post.slug}" is missing rendered Markdown details summary styling.`);
  }

  if (post.cover && !html.includes('object-fill')) {
    errors.push(`Post "${post.slug}" cover image must fill its fixed frame with object-fill.`);
  }

  if (post.cover && !html.includes('object-fit:fill')) {
    errors.push(`Post "${post.slug}" cover image must set inline object-fit:fill.`);
  }

  if (post.cover) {
    const coverFilePath = publicPathToFilePath(post.cover);
    if (
      coverFilePath &&
      coverFilePath.endsWith('.svg') &&
      fs.existsSync(coverFilePath) &&
      !fs.readFileSync(coverFilePath, 'utf8').includes('preserveAspectRatio="none"')
    ) {
      errors.push(`Post "${post.slug}" SVG cover must use preserveAspectRatio="none".`);
    }
  }

  const categoryHref = createBlogFilterHref('category', post.category.text);
  if (!html.includes(`href="${categoryHref}"`)) {
    errors.push(`Post "${post.slug}" category must link to "${categoryHref}".`);
  }

  for (const tag of post.tags) {
    const tagHref = createBlogFilterHref('tags', tag);
    if (!html.includes(`href="${tagHref}"`)) {
      errors.push(`Post "${post.slug}" tag "${tag}" must link to "${tagHref}".`);
    }
  }

  const forbiddenMarkers = ['katex-error', '\\mathbb{E}\\_', '\\big\\['];
  for (const marker of forbiddenMarkers) {
    if (html.includes(marker)) {
      errors.push(`Post "${post.slug}" contains forbidden rendered marker "${marker}".`);
    }
  }

  const markdownFileHrefs = renderedMarkdownFileHrefs(html);
  if (markdownFileHrefs.length > 0) {
    errors.push(
      `Post "${post.slug}" rendered Markdown file hrefs: ${markdownFileHrefs.join(', ')}`,
    );
  }

  if (/annotation encoding="application\/x-tex">[^<]*[’‘′″‴]/.test(html)) {
    errors.push(`Post "${post.slug}" contains unnormalized Unicode prime in rendered KaTeX.`);
  }

  if (html.includes('**<a') || html.includes('</a>**')) {
    errors.push(`Post "${post.slug}" leaked escaped bold markers around a rendered link.`);
  }

  if (/\["\$","a","[^"]*",\{[^\n]*"children":"\*[^"\n]+\*[^"\n]*"/.test(html)) {
    errors.push(`Post "${post.slug}" leaked escaped emphasis markers inside a rendered link.`);
  }

  if (features.references && html.includes('reference-card-title">원문')) {
    errors.push(`Post "${post.slug}" rendered duplicate 원문 reference bookmark cards.`);
  }

  if (post.publishedAt && !html.includes(`"datePublished":"${post.publishedAt}"`)) {
    errors.push(
      `Post "${post.slug}" JSON-LD must use frontmatter published_at/added as datePublished.`,
    );
  }

  if (post.updatedAt && !html.includes(`"dateModified":"${post.updatedAt}"`)) {
    errors.push(`Post "${post.slug}" JSON-LD must use frontmatter updated as dateModified.`);
  }

  if (post.publishedAt && html.includes(`"datePublished":"${post.createdAt}"`)) {
    errors.push(`Post "${post.slug}" JSON-LD must not use display createdAt as datePublished.`);
  }
}

function checkBuiltMarkdownStyles(outRoot: string, errors: string[]) {
  const css = readBuiltCss(outRoot);

  if (!css) {
    errors.push('Built CSS was not found under out/_next/static.');
    return;
  }

  if (
    /\.post-body h1,\s*\.post-body h2,\s*\.post-body h3,\s*\.post-body h4,\s*\.post-body h5,\s*\.post-body h6\{[^}]*display:inline-block/.test(
      css,
    )
  ) {
    errors.push('Built Markdown CSS makes headings inline-block, so h2/h3 can visually merge.');
  }

  if (
    !/\.post-body h1,\s*\.post-body h2,\s*\.post-body h3,\s*\.post-body h4,\s*\.post-body h5,\s*\.post-body h6\{[^}]*display:block/.test(
      css,
    )
  ) {
    errors.push('Built Markdown CSS must include display:block for post-body headings.');
  }

  if (/\.post-body \.markdown-alert\{[^}]*background:(0 0|transparent)/.test(css)) {
    errors.push('Built Markdown CSS must not render callouts with a transparent background.');
  }

  if (!/\.post-body \.markdown-alert\{[^}]*background:var\(--markdown-alert-bg\)/.test(css)) {
    errors.push('Built Markdown CSS is missing the callout background variable.');
  }

  if (!/\.post-body blockquote>p\{[^}]*margin:0[^}]*padding:0/.test(css)) {
    errors.push('Built Markdown CSS must reset blockquote paragraph margin and padding.');
  }

  if (!/\.post-body blockquote\{[^}]*margin:\.25rem 0[^}]*padding:\.15rem \.9rem/.test(css)) {
    errors.push('Built Markdown CSS must keep compact blockquote vertical padding.');
  }

  if (/\.post-body blockquote\{[^}]*white-space:pre-wrap/.test(css)) {
    errors.push('Built Markdown CSS must not preserve renderer whitespace inside blockquotes.');
  }

  if (
    !/\.post-body pre\{[^}]*background:var\(--bg-color-1\)[^}]*color:var\(--fg-color\)/.test(css)
  ) {
    errors.push('Built Markdown CSS must keep Notion-like code block background and foreground.');
  }

  if (!css.includes('color:var(--shiki-light)')) {
    errors.push('Built Markdown CSS must apply light-mode Shiki token colors.');
  }

  if (!css.includes('color:var(--shiki-dark)')) {
    errors.push('Built Markdown CSS must apply dark-mode Shiki token colors.');
  }

  if (!/\.post-body \.katex-display\{[^}]*padding:\.625rem \.125rem/.test(css)) {
    errors.push('Built Markdown CSS must keep enlarged vertical padding on display KaTeX blocks.');
  }

  if (/\.post-body \.markdown-image img\{[^}]*background:/.test(css)) {
    errors.push('Built Markdown CSS must not set a background color on Markdown images.');
  }

  if (/\.post-body \.markdown-image img\{[^}]*width:100%/.test(css)) {
    errors.push('Built Markdown CSS must not let the generic image rule override lightbox width.');
  }

  if (!/\.post-body \.markdown-image\{[^}]*max-width:45rem[^}]*margin:\.5rem auto/.test(css)) {
    errors.push('Built Markdown body images must be capped at 45rem/720px and centered.');
  }

  if (!/\.post-body \.markdown-image-trigger\{[^}]*cursor:zoom-in/.test(css)) {
    errors.push('Built Markdown images must expose a zoom-in trigger.');
  }

  const lightboxRule = readBuiltCssRule(css, '.post-body .markdown-image-lightbox');
  if (!lightboxRule.includes('position:fixed') || !lightboxRule.includes('cursor:default')) {
    errors.push('Built Markdown image lightbox must render as a fixed default-cursor overlay.');
  }

  const lightboxBackdropRule = readBuiltCssRule(
    css,
    '.post-body .markdown-image-lightbox-backdrop',
  );
  if (
    !lightboxBackdropRule.includes('position:absolute') ||
    !lightboxBackdropRule.includes('cursor:default')
  ) {
    errors.push('Built Markdown image lightbox must expose a default-cursor clickable backdrop.');
  }

  const lightboxContentRule = readBuiltCssRule(css, '.post-body .markdown-image-lightbox-content');
  if (!lightboxContentRule.includes('pointer-events:none')) {
    errors.push('Built Markdown image lightbox empty content space must click through to close.');
  }

  const lightboxImageRule = readBuiltCssRule(css, '.post-body .markdown-image-lightbox-image');
  const compactLightboxImageRule = lightboxImageRule.replace(/\s+/g, '');
  if (
    !compactLightboxImageRule.includes(
      'width:min(92vw,62.5rem,calc(82vh*var(--markdown-image-aspect-ratio)))',
    ) ||
    !compactLightboxImageRule.includes('object-fit:contain') ||
    !compactLightboxImageRule.includes('pointer-events:auto')
  ) {
    errors.push('Built Markdown image lightbox must enlarge images within the viewport.');
  }

  const lightboxCaptionRule = readBuiltCssRule(css, '.post-body .markdown-image-lightbox-caption');
  if (!lightboxCaptionRule.includes('pointer-events:auto')) {
    errors.push('Built Markdown image lightbox caption must not make image-adjacent space close.');
  }

  if (
    !/\.post-body \.markdown-image\[data-sized=['"]?true['"]?\]\{[^}]*align-items:center/.test(css)
  ) {
    errors.push('Built Markdown CSS must center explicitly sized Markdown images.');
  }

  const referenceCardRule = readBuiltCssRule(css, '.post-body .reference-card');
  if (
    !referenceCardRule.includes('display:flex') ||
    !referenceCardRule.includes('padding:.85rem .75rem') ||
    !referenceCardRule.includes('background:var(--bg-color-1)') ||
    !referenceCardRule.includes('box-shadow:0 .125rem .375rem var(--fg-color-0)') ||
    !referenceCardRule.includes('cursor:pointer')
  ) {
    errors.push('Built Markdown CSS must include clickable compact reference card styling.');
  }

  if (
    !/\.post-body \.reference-card-list\{[^}]*padding-inline-start:0[^}]*list-style:none/.test(css)
  ) {
    errors.push('Built Markdown CSS must remove list indentation for compact reference cards.');
  }

  if (!/\.post-body \.markdown-alert p\{[^}]*margin:0[^}]*padding:0/.test(css)) {
    errors.push('Built Markdown CSS must reset callout paragraph margin and padding.');
  }

  if (
    !/\.post-body \.markdown-details\{[^}]*background:var\(--bg-color-1\)/.test(css) ||
    !/\.post-body \.markdown-details-summary\{[^}]*cursor:pointer/.test(css) ||
    !/\.post-body \.markdown-details-content\{[^}]*border-top:\.0625rem solid var\(--fg-color-0\)/.test(
      css,
    )
  ) {
    errors.push('Built Markdown CSS must style collapsible details blocks.');
  }

  for (const alertType of ['note', 'tip', 'important', 'warning', 'caution']) {
    if (!css.includes(`.post-body .markdown-alert-${alertType}{`)) {
      errors.push(`Built Markdown CSS is missing ${alertType} callout styling.`);
    }
  }
}

function checkBuiltCategoryColors(posts: PostMeta[], errors: string[]) {
  const categoryColorByName = new Map<string, string>();
  const categoryRgbByName = new Map<string, string>();

  for (const post of posts) {
    const previousColor = categoryColorByName.get(post.category.text);
    if (previousColor && previousColor !== post.category.color) {
      errors.push(
        `Category "${post.category.text}" has unstable rendered colors: ${previousColor}, ${post.category.color}.`,
      );
    }
    categoryColorByName.set(post.category.text, post.category.color);

    const expectedRgb = resolveCategoryRgb(post.category.text);
    if (!post.category.rgb) {
      errors.push(`Category "${post.category.text}" is missing deterministic rgb metadata.`);
    } else if (post.category.rgb !== expectedRgb) {
      errors.push(
        `Category "${post.category.text}" has rgb "${post.category.rgb}", expected "${expectedRgb}".`,
      );
    }

    const previousRgb = categoryRgbByName.get(post.category.text);
    if (previousRgb && previousRgb !== post.category.rgb) {
      errors.push(
        `Category "${post.category.text}" has unstable rendered rgb values: ${previousRgb}, ${post.category.rgb}.`,
      );
    }
    if (post.category.rgb) {
      categoryRgbByName.set(post.category.text, post.category.rgb);
    }
  }

  if (categoryColorByName.size > 1 && new Set(categoryColorByName.values()).size === 1) {
    errors.push('Rendered post metadata assigns the same color to every category.');
  }

  if (categoryRgbByName.size > 1 && new Set(categoryRgbByName.values()).size === 1) {
    errors.push('Rendered post metadata assigns the same rgb to every category.');
  }
}

function main() {
  const outRoot = path.join(PROJECT_ROOT, 'out');
  const postMetaPath = path.join(PROJECT_ROOT, 'public', 'data', 'postMeta.json');

  if (!fs.existsSync(outRoot)) {
    fail('out/ was not generated.');
  }

  if (!fs.existsSync(postMetaPath)) {
    fail('public/data/postMeta.json was not generated.');
  }

  const posts = readJson<PostMeta[]>(postMetaPath);
  if (posts.length === 0) {
    console.log('Build smoke skipped: no published posts.');
    return;
  }

  const errors: string[] = [];
  for (const post of posts) {
    checkRenderedPost(post, errors);
  }
  checkBuiltMarkdownStyles(outRoot, errors);
  checkBuiltCategoryColors(posts, errors);

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`[ERROR] ${error}`);
    }
    process.exit(1);
  }

  console.log(`Build smoke checked ${posts.length} rendered posts.`);
}

main();
