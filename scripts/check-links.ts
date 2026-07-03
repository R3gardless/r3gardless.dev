#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type { Image, Link, Root } from 'mdast';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import {
  buildContentIndex,
  parseKbMarkdownFile,
  resolveMarkdownLink,
  resolveWikiLink,
} from '../src/libs/content/index.js';
import type { ContentDiagnostic, ContentIndex } from '../src/libs/content/index.js';
import { DEFAULT_POST_LANG, TRANSLATED_POST_LANGUAGES } from '../src/types/blog.js';
import type { PostLang } from '../src/types/blog.js';
import {
  PROJECT_ROOT,
  resolveContentRoot,
  resolveKbPath,
  resolvePublicRoot,
} from './content-paths.js';

const WIKI_LINK_PATTERN = /\[\[([^\]|#]+(?:#[^\]|]+)?)(?:\|([^\]]+))?\]\]/g;

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

function readExportedPosts(contentRoot: string) {
  if (!fs.existsSync(contentRoot)) {
    return [];
  }

  const variantFileNames = [
    'index.md',
    ...TRANSLATED_POST_LANGUAGES.map(lang => `index.${lang}.md`),
  ];

  return fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .flatMap(entry =>
      variantFileNames.map(fileName => path.join(contentRoot, entry.name, fileName)),
    )
    .filter(filePath => fs.existsSync(filePath));
}

function exportedPostLang(filePath: string): PostLang {
  const match = path.basename(filePath).match(/^index\.(\w+)\.md$/);
  return match ? (match[1] as PostLang) : DEFAULT_POST_LANG;
}

function checkImagePath(url: string): boolean {
  if (isExternalUrl(url)) {
    return true;
  }

  if (!url.startsWith('/')) {
    return false;
  }

  return fs.existsSync(path.join(resolvePublicRoot(), url));
}

function diagnostic(
  level: ContentDiagnostic['level'],
  code: string,
  message: string,
  file: string,
) {
  return { level, code, message, file } satisfies ContentDiagnostic;
}

function checkExportedPost(filePath: string, index: ContentIndex): ContentDiagnostic[] {
  const diagnostics: ContentDiagnostic[] = [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const tree = unified().use(remarkParse).use(remarkGfm).parse(parsed.content) as Root;
  const slug = path.basename(path.dirname(filePath));
  const lang = exportedPostLang(filePath);
  const sourceNote = index.publishedVariants.find(note => note.slug === slug && note.lang === lang);
  const relativeFile = path.relative(PROJECT_ROOT, filePath);

  if (!sourceNote) {
    diagnostics.push(
      diagnostic(
        'error',
        'UNKNOWN_EXPORTED_POST',
        `No published KNOWLEDGE_BASE note maps to slug "${slug}" (${lang}).`,
        relativeFile,
      ),
    );
    return diagnostics;
  }

  visit(tree, ['link', 'image'], node => {
    if (node.type === 'link') {
      const link = node as Link;
      if (isMarkdownFileHref(link.url)) {
        diagnostics.push(
          diagnostic(
            'error',
            'MARKDOWN_LINK_LEFTOVER',
            `Markdown link was not rewritten: ${link.url}`,
            relativeFile,
          ),
        );
      }

      const resolution = resolveMarkdownLink(
        link.url,
        toString(link) || link.url,
        sourceNote,
        index,
      );
      if (resolution.warning && isMarkdownFileHref(link.url)) {
        diagnostics.push(
          diagnostic('warning', 'LINK_DEGRADED_TO_TEXT', resolution.warning, relativeFile),
        );
      }
      return;
    }

    const image = node as Image;
    if (!checkImagePath(image.url)) {
      diagnostics.push(
        diagnostic(
          'error',
          'MISSING_IMAGE',
          `Image path does not exist in public/: ${image.url}`,
          relativeFile,
        ),
      );
    }
  });

  for (const match of parsed.content.matchAll(WIKI_LINK_PATTERN)) {
    const target = match[1];
    const label = match[2];
    const resolution = resolveWikiLink(target, label, index, lang);

    if (resolution.warning) {
      diagnostics.push(
        diagnostic('warning', 'WIKI_LINK_DEGRADED_TO_TEXT', resolution.warning, relativeFile),
      );
    }
  }

  return diagnostics;
}

function reportDiagnostics(diagnostics: ContentDiagnostic[]) {
  for (const item of diagnostics) {
    const prefix = item.level === 'error' ? 'ERROR' : 'WARN';
    console[item.level === 'error' ? 'error' : 'warn'](
      `[${prefix}] ${item.code}${item.file ? ` ${item.file}` : ''}: ${item.message}`,
    );
  }
}

function main() {
  const kbRoot = resolveKbPath();
  const contentRoot = resolveContentRoot();
  const index = buildContentIndex(kbRoot);
  const diagnostics: ContentDiagnostic[] = [...index.diagnostics];
  const exportedPosts = readExportedPosts(contentRoot);

  for (const filePath of exportedPosts) {
    diagnostics.push(...checkExportedPost(filePath, index));
  }

  for (const note of index.publishedVariants) {
    parseKbMarkdownFile(note.absolutePath, kbRoot);
  }

  reportDiagnostics(diagnostics);

  const errors = diagnostics.filter(item => item.level === 'error');
  if (errors.length > 0) {
    process.exit(1);
  }

  console.log(`Checked ${exportedPosts.length} exported posts.`);
}

main();
