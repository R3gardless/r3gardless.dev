import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import type { PostMeta } from '@/types/blog';

import {
  deriveCategoryFromPath,
  resolveCategoryColor,
  resolveCategoryForegroundRgb,
  resolveCategoryRgb,
} from './category';
import { normalizeFrontmatter } from './frontmatter';
import { createPostSlug } from './slug';
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
    const slug = createPostSlug(slugFromDirectory, frontmatter.slug);

    return {
      absolutePath: path.resolve(filePath),
      relativePath,
      dirRelativePath: path.dirname(relativePath) === '.' ? '' : path.dirname(relativePath),
      basename,
      stem: slug,
      content: parsed.content,
      frontmatter: {
        ...frontmatter,
        slug,
      },
    };
  });
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

export function createPostMetaList(notes: KbNote[]): PostMeta[] {
  const sorted = [...notes].sort((a, b) => {
    const dateCompare = getPostDate(b.frontmatter).localeCompare(getPostDate(a.frontmatter));
    if (dateCompare !== 0) {
      return dateCompare;
    }

    return (a.frontmatter.title || a.stem).localeCompare(b.frontmatter.title || b.stem);
  });

  return sorted.map((note, index) => {
    const slug = createPostSlug(note.stem, note.frontmatter.slug);
    const date = getPostDate(note.frontmatter);
    const updated = note.frontmatter.updated || date;
    const categoryText = getPostCategoryText(note);
    const publishedAt = normalizeMachineDate(date);
    const updatedAt = normalizeMachineDate(updated);

    return {
      pageId: slug,
      id: sorted.length - index,
      title: note.frontmatter.title || note.stem,
      description: note.frontmatter.description || extractDescription(note.content),
      createdAt: formatContentDate(date),
      lastEditedAt: formatContentDate(updated),
      publishedAt,
      updatedAt,
      category: {
        text: categoryText,
        color: resolveCategoryColor(categoryText, note.frontmatter.category_color),
        rgb: resolveCategoryRgb(categoryText),
        foregroundRgb: resolveCategoryForegroundRgb(categoryText),
      },
      tags: note.frontmatter.tags || [],
      slug,
      encodedSlug: encodeURIComponent(slug),
      cover: note.frontmatter.cover,
    };
  });
}

export function readPostMetaFromContent(contentRoot: string): PostMeta[] {
  return createPostMetaList(readExportedContentNotes(contentRoot));
}
