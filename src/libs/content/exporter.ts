import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type { Image, Link, Parent, Root, RootContent, Text } from 'mdast';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { deriveCategoryFromPath } from './category';
import { resolveMarkdownLink } from './linkResolver';
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

function replaceChild(parent: Parent | undefined, index: number | undefined, node: RootContent) {
  if (!parent || typeof index !== 'number') {
    return;
  }

  parent.children[index] = node;
}

function resolveAssetPath(note: KbNote, assetUrl: string): string {
  return path.resolve(path.dirname(note.absolutePath), assetUrl);
}

function copyAsset(note: PublishedContentNote, assetUrl: string, paths: ExportPaths): string {
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

  const fileName = path.basename(sourcePath);
  const destinationPath = path.join(publicAssetDir, fileName);
  fs.copyFileSync(sourcePath, destinationPath);

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
    .replace(/^> \\\[!(TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]/gm, '> [!$1]');
}

export function transformMarkdownForExport(
  note: PublishedContentNote,
  index: ContentIndex,
  paths: ExportPaths,
): { markdown: string; diagnostics: ContentDiagnostic[]; cover?: string } {
  const diagnostics: ContentDiagnostic[] = [];
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .parse(note.content) as Root;
  let cover = note.frontmatter.cover;

  if (cover && isLocalAssetUrl(cover)) {
    try {
      cover = copyAsset(note, cover, paths);
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
