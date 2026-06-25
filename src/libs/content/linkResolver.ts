import path from 'node:path';

import { SITE_CONFIG } from '@/constants';

import { slugifyHeading } from './slug';
import type { ContentIndex, ContentLinkMaps, KbNote, LinkResolution } from './types';

const SITE_HOSTNAME = SITE_CONFIG.url
  .replace(/^https?:\/\//i, '')
  .replace(/\/.*$/, '')
  .replace(/^www\./i, '');

interface ParsedTarget {
  page: string;
  anchor?: string;
}

function parseTarget(target: string): ParsedTarget {
  const [page, anchor] = target.split('#');
  return {
    page: page.trim(),
    anchor: anchor?.trim() || undefined,
  };
}

function withAnchor(href: string, anchor?: string): string {
  if (!anchor) {
    return href;
  }

  return `${href}#${slugifyHeading(anchor)}`;
}

function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href) || /^[a-z][a-z0-9+.-]*:/i.test(href);
}

function isMarkdownHref(href: string): boolean {
  const [pathname] = href.split('#');
  return /\.mdx?$/i.test(pathname);
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseInternalBlogHref(href: string): { slug: string; hash: string } | null {
  let pathWithHash = href;

  if (!href.startsWith('/')) {
    const hostPattern = SITE_HOSTNAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = href.match(new RegExp(`^https?://(?:www\\.)?${hostPattern}(/.*)?$`, 'i'));
    if (!match) {
      return null;
    }

    pathWithHash = match[1] || '/';
  }

  const hashIndex = pathWithHash.indexOf('#');
  const pathname = hashIndex === -1 ? pathWithHash : pathWithHash.slice(0, hashIndex);
  const hash = hashIndex === -1 ? '' : pathWithHash.slice(hashIndex);
  const match = pathname.match(/^\/blog\/([^/?]+)\/?$/);

  if (!match) {
    return null;
  }

  return {
    slug: match[1],
    hash,
  };
}

function resolveDirectBlogHref(href: string, maps: ContentLinkMaps): string | null {
  const parsed = parseInternalBlogHref(href);
  if (!parsed) {
    return null;
  }

  const rawSlug = parsed.slug;
  const resolvedHref = maps.published[rawSlug] ?? maps.published[safeDecodeURIComponent(rawSlug)];

  if (!resolvedHref) {
    return null;
  }

  return `${resolvedHref}${parsed.hash}`;
}

export function resolveWikiLink(
  target: string,
  label: string | undefined,
  index: ContentIndex,
): LinkResolution {
  return resolveWikiLinkFromMaps(target, label, createContentLinkMaps(index));
}

export function createContentLinkMaps(index: ContentIndex): ContentLinkMaps {
  const publishedEntries = Array.from(index.publishedByBasename.entries()).map(([key, note]) => [
    key,
    note.href,
  ]);

  for (const note of index.publishedNotes) {
    publishedEntries.push([note.slug, note.href]);
  }

  return {
    published: Object.fromEntries(publishedEntries),
    sources: Object.fromEntries(index.sourceUrlByBasename.entries()),
    sourceLabels: Object.fromEntries(index.sourceLabelByBasename.entries()),
  };
}

export function resolveWikiLinkFromMaps(
  target: string,
  label: string | undefined,
  maps: ContentLinkMaps,
): LinkResolution {
  const parsed = parseTarget(target);
  const linkLabel = label || parsed.page;
  const publishedHref = maps.published[parsed.page];

  if (publishedHref) {
    return {
      kind: 'internal',
      label: linkLabel,
      target,
      href: withAnchor(publishedHref, parsed.anchor),
    };
  }

  const sourceUrl = maps.sources[parsed.page];
  if (sourceUrl) {
    return {
      kind: 'external',
      label: label || maps.sourceLabels?.[parsed.page] || linkLabel,
      target,
      href: sourceUrl,
      external: true,
    };
  }

  return {
    kind: 'text',
    label: linkLabel,
    target,
    warning: `Unpublished or missing target "${target}" has no source_url.`,
  };
}

export function resolveMarkdownLink(
  href: string,
  label: string,
  fromNote: KbNote,
  index: ContentIndex,
): LinkResolution {
  const normalizedBlogHref = resolveDirectBlogHref(href, createContentLinkMaps(index));
  if (normalizedBlogHref) {
    return {
      kind: 'internal',
      label,
      target: href,
      href: normalizedBlogHref,
    };
  }

  if (isExternalHref(href) || href.startsWith('#') || !isMarkdownHref(href)) {
    return {
      kind: isExternalHref(href) ? 'external' : 'internal',
      label,
      target: href,
      href,
      external: isExternalHref(href),
    };
  }

  const [pathname, anchor] = href.split('#');
  const resolvedPath = path.resolve(path.dirname(fromNote.absolutePath), pathname);
  const targetNote = index.notesByAbsolutePath.get(resolvedPath);

  if (!targetNote) {
    return {
      kind: 'text',
      label,
      target: href,
      warning: `Markdown link target "${href}" does not exist.`,
    };
  }

  return resolveWikiLink(`${targetNote.stem}${anchor ? `#${anchor}` : ''}`, label, index);
}
