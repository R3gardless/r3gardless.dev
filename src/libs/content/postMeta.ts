import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import { DEFAULT_POST_LANG, TRANSLATED_POST_LANGUAGES } from '@/types/blog';
import type { PostLang, PostMeta, PostTranslationMeta, TranslatedPostLang } from '@/types/blog';

import {
  deriveCategoryFromPath,
  resolveCategoryColor,
  resolveCategoryForegroundRgb,
  resolveCategoryRgb,
} from './category';
import { normalizeFrontmatter, normalizePostLang } from './frontmatter';
import { createDatedPostSlug } from './slug';
import type { ContentFrontmatter, KbNote } from './types';

function formatContentDate(value: string | undefined): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  });
}

function normalizeMachineDate(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return trimmed;
  }

  return date.toISOString();
}

function removeMarkdownSyntax(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/[*_`>#-]/g, '')
    .trim();
}

function extractDescription(content: string): string {
  const blocks = content.split(/\n{2,}/);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (
      !trimmed ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('|') ||
      trimmed.startsWith('```') ||
      trimmed.startsWith('![')
    ) {
      continue;
    }

    return removeMarkdownSyntax(trimmed).slice(0, 180);
  }

  return '';
}

function readExportedPostFiles(contentRoot: string): string[] {
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

export function readExportedContentNotes(contentRoot: string): KbNote[] {
  return readExportedPostFiles(contentRoot).map(filePath => {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    const relativePath = path.relative(contentRoot, filePath).split(path.sep).join('/');
    const basename = path.basename(filePath);
    const slugFromDirectory = path.basename(path.dirname(filePath));
    const frontmatter = normalizeFrontmatter(parsed.data as Record<string, unknown>);
    const slug = createDatedPostSlug(
      slugFromDirectory,
      frontmatter.slug,
      frontmatter.added || frontmatter.published_at,
    );

    return {
      absolutePath: path.resolve(filePath),
      relativePath,
      dirRelativePath: path.dirname(relativePath) === '.' ? '' : path.dirname(relativePath),
      basename,
      stem: slug,
      lang: normalizePostLang(frontmatter.lang) ?? DEFAULT_POST_LANG,
      content: parsed.content,
      frontmatter: {
        ...frontmatter,
        slug,
      },
    };
  });
}

export type PostTranslationsBySlug = Map<
  string,
  Partial<Record<TranslatedPostLang, PostTranslationMeta>>
>;

/**
 * content/posts/<slug>/index.<lang>.md 번역본에서 언어별 title/description을 읽습니다.
 */
export function readExportedTranslations(contentRoot: string): PostTranslationsBySlug {
  const translationsBySlug: PostTranslationsBySlug = new Map();

  if (!fs.existsSync(contentRoot)) {
    return translationsBySlug;
  }

  for (const entry of fs.readdirSync(contentRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const slug = entry.name;
    for (const lang of TRANSLATED_POST_LANGUAGES) {
      const filePath = path.join(contentRoot, slug, `index.${lang}.md`);
      if (!fs.existsSync(filePath)) {
        continue;
      }

      const parsed = matter(fs.readFileSync(filePath, 'utf8'));
      const frontmatter = normalizeFrontmatter(parsed.data as Record<string, unknown>);
      const translations = translationsBySlug.get(slug) ?? {};
      translations[lang] = {
        title: frontmatter.title || slug,
        description: frontmatter.description || extractDescription(parsed.content) || undefined,
        // 번역본 frontmatter의 series는 표시용 이름만 바꾸고, 그룹핑 키는 kr 원문 값을 유지합니다.
        ...(frontmatter.series ? { seriesName: frontmatter.series } : {}),
      };
      translationsBySlug.set(slug, translations);
    }
  }

  return translationsBySlug;
}

function getPostDate(frontmatter: ContentFrontmatter): string {
  return frontmatter.published_at || frontmatter.added || '';
}

function getPostCategoryText(note: KbNote): string {
  if (note.frontmatter.category) {
    return note.frontmatter.category;
  }

  const pathCategory = deriveCategoryFromPath(note.dirRelativePath);
  if (pathCategory) {
    return pathCategory;
  }

  return note.frontmatter.layer || note.frontmatter.type || 'Uncategorized';
}

export function createPostMetaList(
  notes: KbNote[],
  translationsBySlug?: PostTranslationsBySlug,
): PostMeta[] {
  const sorted = [...notes].sort((a, b) => {
    const dateCompare = getPostDate(b.frontmatter).localeCompare(getPostDate(a.frontmatter));
    if (dateCompare !== 0) {
      return dateCompare;
    }

    return (a.frontmatter.title || a.stem).localeCompare(b.frontmatter.title || b.stem);
  });

  return sorted.map((note, index) => {
    const slug = createDatedPostSlug(
      note.stem,
      note.frontmatter.slug,
      note.frontmatter.added || note.frontmatter.published_at,
    );
    const date = getPostDate(note.frontmatter);
    const updated = note.frontmatter.updated || date;
    const categoryText = getPostCategoryText(note);
    const publishedAt = normalizeMachineDate(date);
    const updatedAt = normalizeMachineDate(updated);
    const translations = translationsBySlug?.get(slug);
    const languages: PostLang[] = [
      'kr',
      ...TRANSLATED_POST_LANGUAGES.filter(lang => Boolean(translations?.[lang])),
    ];

    return {
      pageId: slug,
      id: sorted.length - index,
      title: note.frontmatter.title || note.stem,
      description: note.frontmatter.description || extractDescription(note.content),
      createdAt: formatContentDate(date),
      lastEditedAt: formatContentDate(updated),
      publishedAt,
      updatedAt,
      readingTime: note.frontmatter.reading_time,
      category: {
        text: categoryText,
        color: resolveCategoryColor(categoryText, note.frontmatter.category_color),
        rgb: resolveCategoryRgb(categoryText),
        foregroundRgb: resolveCategoryForegroundRgb(categoryText),
      },
      tags: note.frontmatter.tags || [],
      ...(note.frontmatter.series
        ? {
            series: {
              name: note.frontmatter.series,
              ...(note.frontmatter.series_order !== undefined
                ? { order: note.frontmatter.series_order }
                : {}),
            },
          }
        : {}),
      slug,
      encodedSlug: encodeURIComponent(slug),
      cover: note.frontmatter.cover,
      languages,
      ...(translations && Object.keys(translations).length > 0 ? { translations } : {}),
    };
  });
}

export function readPostMetaFromContent(contentRoot: string): PostMeta[] {
  return createPostMetaList(
    readExportedContentNotes(contentRoot),
    readExportedTranslations(contentRoot),
  );
}
