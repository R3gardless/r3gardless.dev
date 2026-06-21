#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';

import {
  buildContentIndex,
  createContentLinkMaps,
  exportPublishedPost,
} from '../src/libs/content/index.js';
import type { ContentDiagnostic } from '../src/libs/content/index.js';
import {
  PROJECT_ROOT,
  resolveContentRoot,
  resolveKbPath,
  resolvePublicRoot,
} from './content-paths.js';

const PUBLIC_ASSETS_BASE_PATH = 'content/posts';
const LINK_INDEX_PATH = path.join(PROJECT_ROOT, 'public', 'data', 'contentLinkIndex.json');

function resetDirectory(dirPath: string) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

function reportDiagnostics(diagnostics: ContentDiagnostic[]) {
  for (const diagnostic of diagnostics) {
    const prefix = diagnostic.level === 'error' ? 'ERROR' : 'WARN';
    console[diagnostic.level === 'error' ? 'error' : 'warn'](
      `[${prefix}] ${diagnostic.code}${diagnostic.file ? ` ${diagnostic.file}` : ''}: ${diagnostic.message}`,
    );
  }
}

function writeLinkIndex(index: ReturnType<typeof buildContentIndex>) {
  const data = createContentLinkMaps(index);

  fs.mkdirSync(path.dirname(LINK_INDEX_PATH), { recursive: true });
  fs.writeFileSync(LINK_INDEX_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function main() {
  const kbRoot = resolveKbPath();
  const contentRoot = resolveContentRoot();
  const publicRoot = resolvePublicRoot();
  const publicAssetsRoot = path.join(publicRoot, PUBLIC_ASSETS_BASE_PATH);
  const index = buildContentIndex(kbRoot);
  const diagnostics: ContentDiagnostic[] = [...index.diagnostics];

  resetDirectory(contentRoot);
  resetDirectory(publicAssetsRoot);

  for (const note of index.publishedNotes) {
    const exported = exportPublishedPost(note, index, {
      contentRoot,
      publicRoot,
      publicAssetsBasePath: PUBLIC_ASSETS_BASE_PATH,
    });
    diagnostics.push(...exported.diagnostics);
  }

  writeLinkIndex(index);
  reportDiagnostics(diagnostics);

  const errors = diagnostics.filter(diagnostic => diagnostic.level === 'error');
  if (errors.length > 0) {
    process.exit(1);
  }

  console.log(`Exported ${index.publishedNotes.length} posts from ${kbRoot}`);
}

main();
