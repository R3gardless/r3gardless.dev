import fs from 'node:fs';
import path from 'node:path';

import {
  DEFAULT_POST_LANG,
  POST_LANGUAGES,
  TRANSLATED_POST_LANGUAGES,
  langPathPrefix,
} from '@/types/blog';
import type { PostLang, TranslatedPostLang } from '@/types/blog';

import { normalizePostLang, parseKbMarkdownFile } from './frontmatter';
import { createDatedPostSlug } from './slug';
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

/**
 * 언어별 블로그 경로 prefix. kr은 기존 URL을 유지하기 위해 prefix가 없습니다.
 */
export function postLangPathPrefix(lang: PostLang): string {
  return langPathPrefix(lang);
}

function createPublishedNote(note: KbNote): PublishedContentNote {
  const slug = createDatedPostSlug(
    note.stem,
    note.frontmatter.slug,
    note.frontmatter.added || note.frontmatter.published_at,
  );

  return {
    ...note,
    slug,
    href: `${postLangPathPrefix(note.lang)}/blog/${slug}`,
  };
}

export function scanKbNotes(kbRoot: string): KbNote[] {
  if (!fs.existsSync(kbRoot)) {
    throw new Error('KNOWLEDGE_BASE_PATH does not exist.');
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
  const translatedByBasename = new Map<TranslatedPostLang, Map<string, PublishedContentNote>>(
    TRANSLATED_POST_LANGUAGES.map(lang => [lang, new Map<string, PublishedContentNote>()]),
  );
  const sourceUrlByBasename = new Map<string, string>();
  const sourceLabelByBasename = new Map<string, string>();
  const publishedNotes: PublishedContentNote[] = [];
  const publishedVariants: PublishedContentNote[] = [];
  const slugsByLang = new Map<PostLang, Map<string, PublishedContentNote>>(
    POST_LANGUAGES.map(lang => [lang, new Map<string, PublishedContentNote>()]),
  );

  for (const note of notes) {
    notesByAbsolutePath.set(path.resolve(note.absolutePath), note);
    notesByRelativePath.set(note.relativePath, note);
    addBasenameIndex(notesByBasename, note);

    const publicSourceUrl = note.frontmatter.archived_url || note.frontmatter.source_url;
    if (note.frontmatter.layer === 'source' && publicSourceUrl) {
      const sourceLabel = note.frontmatter.title || note.stem;
      sourceUrlByBasename.set(note.stem, publicSourceUrl);
      sourceLabelByBasename.set(note.stem, sourceLabel);
      if (note.frontmatter.title) {
        sourceUrlByBasename.set(note.frontmatter.title, publicSourceUrl);
        sourceLabelByBasename.set(note.frontmatter.title, sourceLabel);
      }
      if (note.frontmatter.slug) {
        sourceUrlByBasename.set(note.frontmatter.slug, publicSourceUrl);
        sourceLabelByBasename.set(note.frontmatter.slug, sourceLabel);
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

    if (
      note.frontmatter.lang !== undefined &&
      normalizePostLang(note.frontmatter.lang) === undefined
    ) {
      diagnostics.push({
        level: 'error',
        code: 'INVALID_LANG',
        message: `Unsupported frontmatter lang "${note.frontmatter.lang}". Allowed values: kr, en, ja (jp is accepted as an alias for ja).`,
        file: note.relativePath,
      });
      continue;
    }

    const published = createPublishedNote(note);
    const langSlugs = slugsByLang.get(published.lang)!;
    const duplicate = langSlugs.get(published.slug);
    if (duplicate) {
      diagnostics.push({
        level: 'error',
        code: 'DUPLICATE_SLUG',
        message: `Duplicate published slug "${published.slug}" is used by more than one published "${published.lang}" note.`,
        file: note.relativePath,
      });
    }

    langSlugs.set(published.slug, published);
    publishedVariants.push(published);

    if (published.lang === DEFAULT_POST_LANG) {
      publishedNotes.push(published);
      publishedByBasename.set(note.stem, published);
      if (note.frontmatter.title) {
        publishedByBasename.set(note.frontmatter.title, published);
      }
      if (note.frontmatter.slug) {
        publishedByBasename.set(note.frontmatter.slug, published);
      }
    } else {
      const langBasenames = translatedByBasename.get(published.lang)!;
      langBasenames.set(note.stem, published);
      langBasenames.set(published.slug, published);
      if (note.frontmatter.title) {
        langBasenames.set(note.frontmatter.title, published);
      }
      if (note.frontmatter.slug) {
        langBasenames.set(note.frontmatter.slug, published);
      }
    }
  }

  const krSlugs = slugsByLang.get(DEFAULT_POST_LANG)!;
  for (const variant of publishedVariants) {
    if (variant.lang !== DEFAULT_POST_LANG && !krSlugs.has(variant.slug)) {
      diagnostics.push({
        level: 'error',
        code: 'TRANSLATION_WITHOUT_CANONICAL',
        message: `Published "${variant.lang}" translation "${variant.slug}" has no published kr canonical note with the same slug.`,
        file: variant.relativePath,
      });
    }
  }

  publishedNotes.sort((a, b) => {
    const aDate = a.frontmatter.published_at || a.frontmatter.added || '';
    const bDate = b.frontmatter.published_at || b.frontmatter.added || '';
    return bDate.localeCompare(aDate);
  });

  const languagesBySlug = new Map<string, PostLang[]>();
  for (const note of publishedNotes) {
    languagesBySlug.set(
      note.slug,
      POST_LANGUAGES.filter(lang => slugsByLang.get(lang)!.has(note.slug)),
    );
  }

  return {
    notes,
    publishedNotes,
    publishedVariants,
    notesByAbsolutePath,
    notesByRelativePath,
    notesByBasename,
    publishedByBasename,
    translatedByBasename,
    languagesBySlug,
    sourceUrlByBasename,
    sourceLabelByBasename,
    diagnostics,
  };
}
