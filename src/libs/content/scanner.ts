import fs from 'node:fs';
import path from 'node:path';

import { parseKbMarkdownFile } from './frontmatter';
import { createPostSlug } from './slug';
import type { ContentDiagnostic, ContentIndex, KbNote, PublishedContentNote } from './types';

const MARKDOWN_EXTENSION = /\.mdx?$/i;
const IGNORED_DIRECTORIES = new Set(['.git', '.github', '.cache', '.next', 'node_modules', 'out']);

function walkMarkdownFiles(root: string): string[] {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const result: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.startsWith('.') || IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      result.push(...walkMarkdownFiles(absolutePath));
      continue;
    }

    if (entry.isFile() && MARKDOWN_EXTENSION.test(entry.name)) {
      result.push(absolutePath);
    }
  }

  return result.sort();
}

function addBasenameIndex(index: Map<string, KbNote[]>, note: KbNote) {
  const keys = new Set([note.stem, note.frontmatter.title, note.frontmatter.slug].filter(Boolean));

  for (const key of keys) {
    const current = index.get(String(key)) ?? [];
    current.push(note);
    index.set(String(key), current);
  }
}

function createPublishedNote(note: KbNote): PublishedContentNote {
  const slug = createPostSlug(note.stem, note.frontmatter.slug);

  return {
    ...note,
    slug,
    href: `/blog/${slug}`,
  };
}

export function scanKbNotes(kbRoot: string): KbNote[] {
  if (!fs.existsSync(kbRoot)) {
    throw new Error(`KB_PATH does not exist: ${kbRoot}`);
  }

  return walkMarkdownFiles(kbRoot).map(filePath => parseKbMarkdownFile(filePath, kbRoot));
}

export function buildContentIndex(kbRoot: string): ContentIndex {
  const notes = scanKbNotes(kbRoot);
  const diagnostics: ContentDiagnostic[] = [];
  const notesByAbsolutePath = new Map<string, KbNote>();
  const notesByRelativePath = new Map<string, KbNote>();
  const notesByBasename = new Map<string, KbNote[]>();
  const publishedByBasename = new Map<string, PublishedContentNote>();
  const sourceUrlByBasename = new Map<string, string>();
  const publishedNotes: PublishedContentNote[] = [];
  const slugs = new Map<string, PublishedContentNote>();

  for (const note of notes) {
    notesByAbsolutePath.set(path.resolve(note.absolutePath), note);
    notesByRelativePath.set(note.relativePath, note);
    addBasenameIndex(notesByBasename, note);

    const publicSourceUrl = note.frontmatter.archived_url || note.frontmatter.source_url;
    if (note.frontmatter.layer === 'source' && publicSourceUrl) {
      sourceUrlByBasename.set(note.stem, publicSourceUrl);
      if (note.frontmatter.title) {
        sourceUrlByBasename.set(note.frontmatter.title, publicSourceUrl);
      }
    }

    if (!note.frontmatter.publish) {
      continue;
    }

    if (note.frontmatter.layer === 'source') {
      diagnostics.push({
        level: 'error',
        code: 'SOURCE_NOTE_PUBLISHED',
        message: 'Source notes must not be exported even when publish is true.',
        file: note.relativePath,
      });
      continue;
    }

    const published = createPublishedNote(note);
    const duplicate = slugs.get(published.slug);
    if (duplicate) {
      diagnostics.push({
        level: 'error',
        code: 'DUPLICATE_SLUG',
        message: `Duplicate published slug "${published.slug}" also used by ${duplicate.relativePath}.`,
        file: note.relativePath,
      });
    }

    slugs.set(published.slug, published);
    publishedNotes.push(published);
    publishedByBasename.set(note.stem, published);
    if (note.frontmatter.title) {
      publishedByBasename.set(note.frontmatter.title, published);
    }
    if (note.frontmatter.slug) {
      publishedByBasename.set(note.frontmatter.slug, published);
    }
  }

  publishedNotes.sort((a, b) => {
    const aDate = a.frontmatter.published_at || a.frontmatter.added || '';
    const bDate = b.frontmatter.published_at || b.frontmatter.added || '';
    return bDate.localeCompare(aDate);
  });

  return {
    notes,
    publishedNotes,
    notesByAbsolutePath,
    notesByRelativePath,
    notesByBasename,
    publishedByBasename,
    sourceUrlByBasename,
    diagnostics,
  };
}
