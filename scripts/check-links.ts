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
import {
  PROJECT_ROOT,
  resolveContentRoot,
  resolveKbPath,
  resolvePublicRoot,
} from './content-paths.js';

const WIKI_LINK_PATTERN = /\[\[([^\]|#]+(?:#[^\]|]+)?)(?:\|([^\]]+))?\]\]/g;

function readExportedPosts(contentRoot: string) {
  if (!fs.existsSync(contentRoot)) {
    return [];
  }

  return fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(contentRoot, entry.name, 'index.md'))
    .filter(filePath => fs.existsSync(filePath));
}

function checkImagePath(url: string): boolean {
  if (/^(https?:)?\/\//i.test(url) || /^[a-z][a-z0-9+.-]*:/i.test(url)) {
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
  const sourceNote = index.publishedNotes.find(note => note.slug === slug);
  const relativeFile = path.relative(PROJECT_ROOT, filePath);

  if (!sourceNote) {
    diagnostics.push(
      diagnostic(
        'error',
        'UNKNOWN_EXPORTED_POST',
        `No published KB note maps to slug "${slug}".`,
        relativeFile,
      ),
    );
    return diagnostics;
  }

  visit(tree, ['link', 'image'], node => {
    if (node.type === 'link') {
      const link = node as Link;
      if (/\.mdx?(#.*)?$/i.test(link.url)) {
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
      if (resolution.warning && /\.mdx?(#.*)?$/i.test(link.url)) {
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
    const resolution = resolveWikiLink(target, label, index);

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

  for (const note of index.publishedNotes) {
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
