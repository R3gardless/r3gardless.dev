import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import { DEFAULT_POST_LANG, POST_LANGUAGES } from '@/types/blog';
import type { PostLang } from '@/types/blog';

import { stripMarkdownExtension } from './slug';
import type { ContentFrontmatter, KbNote } from './types';

const CATEGORY_COLORS = new Set<NonNullable<ContentFrontmatter['category_color']>>([
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
]);

function normalizeDate(value: unknown): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    return value;
  }

  return String(value);
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeCategoryColor(value: unknown): ContentFrontmatter['category_color'] | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  return CATEGORY_COLORS.has(value as NonNullable<ContentFrontmatter['category_color']>)
    ? (value as NonNullable<ContentFrontmatter['category_color']>)
    : undefined;
}

/**
 * reading_time을 양의 정수(분)로 정규화합니다.
 * 숫자, 숫자 문자열("5", "5 min") 모두 허용하고, 0 이하/비정상 값은 undefined입니다.
 */
function normalizeReadingTime(value: unknown): number | undefined {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseFloat(value)
        : Number.NaN;

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  // 반올림 후에도 양의 정수를 보장합니다(예: 0.4 → 0은 유효한 읽기 시간이 아님).
  const minutes = Math.round(parsed);
  return minutes > 0 ? minutes : undefined;
}

/**
 * series_order를 1 이상의 양의 정수로 정규화합니다.
 * 숫자와 숫자 문자열을 허용하고, 0 이하/비정상 값은 undefined입니다.
 */
function normalizeSeriesOrder(value: unknown): number | undefined {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseFloat(value)
        : Number.NaN;

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  const order = Math.round(parsed);
  return order > 0 ? order : undefined;
}

/**
 * frontmatter lang 값을 kr/en/ja로 정규화합니다.
 * lang이 없으면 kr(원문)이고, 알 수 없는 값이면 undefined를 반환합니다.
 * KB 원본이 일본어를 jp로 표기하는 전환기를 위해 jp는 ja로 매핑합니다.
 */
export function normalizePostLang(value: unknown): PostLang | undefined {
  if (value === undefined || value === null || value === '') {
    return DEFAULT_POST_LANG;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  const aliased = normalized === 'jp' ? 'ja' : normalized;
  return (POST_LANGUAGES as readonly string[]).includes(aliased)
    ? (aliased as PostLang)
    : undefined;
}

export function normalizeFrontmatter(data: Record<string, unknown>): ContentFrontmatter {
  const sanitizedData = { ...data };
  delete sanitizedData.thumbnail;

  return {
    ...sanitizedData,
    layer: typeof data.layer === 'string' ? data.layer : undefined,
    lang: typeof data.lang === 'string' ? data.lang : undefined,
    type: typeof data.type === 'string' ? data.type : undefined,
    title: typeof data.title === 'string' ? data.title : undefined,
    description: typeof data.description === 'string' ? data.description : undefined,
    category: typeof data.category === 'string' ? data.category : undefined,
    category_color: normalizeCategoryColor(data.category_color),
    tags: normalizeTags(data.tags),
    publish: data.publish === true,
    slug: typeof data.slug === 'string' ? data.slug : undefined,
    published_at: normalizeDate(data.published_at),
    // KB frontmatter의 added가 created로 일괄 개명되는 전환기를 지원합니다.
    // added가 있으면 기존 동작 그대로, 없으면 created를 사용해 slug/URL 날짜를 유지합니다.
    added: normalizeDate(data.added ?? data.created),
    updated: normalizeDate(data.updated),
    cover: typeof data.cover === 'string' ? data.cover : undefined,
    as_of: normalizeDate(data.as_of),
    source_url: typeof data.source_url === 'string' ? data.source_url : undefined,
    archived_url: typeof data.archived_url === 'string' ? data.archived_url : undefined,
    reading_time: normalizeReadingTime(data.reading_time),
    series: typeof data.series === 'string' ? data.series.trim() || undefined : undefined,
    series_order: normalizeSeriesOrder(data.series_order),
  };
}

export function parseKbMarkdownFile(filePath: string, kbRoot: string): KbNote {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const relativePath = path.relative(kbRoot, filePath).split(path.sep).join('/');
  const basename = path.basename(filePath);
  const stem = stripMarkdownExtension(basename);
  const frontmatter = normalizeFrontmatter(parsed.data);

  return {
    absolutePath: path.resolve(filePath),
    relativePath,
    dirRelativePath: path.dirname(relativePath) === '.' ? '' : path.dirname(relativePath),
    basename,
    stem,
    lang: normalizePostLang(frontmatter.lang) ?? DEFAULT_POST_LANG,
    content: parsed.content,
    frontmatter,
  };
}
