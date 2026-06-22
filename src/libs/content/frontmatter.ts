import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

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

export function normalizeFrontmatter(data: Record<string, unknown>): ContentFrontmatter {
  const sanitizedData = { ...data };
  delete sanitizedData.thumbnail;

  return {
    ...sanitizedData,
    layer: typeof data.layer === 'string' ? data.layer : undefined,
    type: typeof data.type === 'string' ? data.type : undefined,
    title: typeof data.title === 'string' ? data.title : undefined,
    description: typeof data.description === 'string' ? data.description : undefined,
    category: typeof data.category === 'string' ? data.category : undefined,
    category_color: normalizeCategoryColor(data.category_color),
    tags: normalizeTags(data.tags),
    publish: data.publish === true,
    slug: typeof data.slug === 'string' ? data.slug : undefined,
    published_at: normalizeDate(data.published_at),
    added: normalizeDate(data.added),
    updated: normalizeDate(data.updated),
    cover: typeof data.cover === 'string' ? data.cover : undefined,
    as_of: normalizeDate(data.as_of),
    source_url: typeof data.source_url === 'string' ? data.source_url : undefined,
    archived_url: typeof data.archived_url === 'string' ? data.archived_url : undefined,
  };
}

export function parseKbMarkdownFile(filePath: string, kbRoot: string): KbNote {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const relativePath = path.relative(kbRoot, filePath).split(path.sep).join('/');
  const basename = path.basename(filePath);
  const stem = stripMarkdownExtension(basename);

  return {
    absolutePath: path.resolve(filePath),
    relativePath,
    dirRelativePath: path.dirname(relativePath) === '.' ? '' : path.dirname(relativePath),
    basename,
    stem,
    content: parsed.content,
    frontmatter: normalizeFrontmatter(parsed.data),
  };
}
