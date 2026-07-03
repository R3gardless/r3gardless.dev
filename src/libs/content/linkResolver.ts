import path from 'node:path';

import { SITE_CONFIG } from '@/constants';
import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang, TranslatedPostLang } from '@/types/blog';

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

/**
 * kr canonical href(/blog/<slug>)를 같은 언어의 번역본 href로 승격합니다.
 * 해당 언어 번역본이 없으면 kr href를 그대로 유지합니다.
 */
function localizePublishedHref(href: string, maps: ContentLinkMaps, lang: PostLang): string {
  if (lang === DEFAULT_POST_LANG || !maps.publishedByLang) {
    return href;
  }

  const langMap = maps.publishedByLang[lang as TranslatedPostLang];
  if (!langMap) {
    return href;
  }

  const slug = href.match(/^\/blog\/([^/#?]+)/)?.[1];
  if (!slug) {
    return href;
  }

  return langMap[slug] ?? langMap[safeDecodeURIComponent(slug)] ?? href;
}

function lookupPublishedHref(
  page: string,
  maps: ContentLinkMaps,
  lang: PostLang,
): string | undefined {
  if (lang !== DEFAULT_POST_LANG) {
    const langHref = maps.publishedByLang?.[lang as TranslatedPostLang]?.[page];
    if (langHref) {
      return langHref;
    }
  }

  const krHref = maps.published[page];
  return krHref ? localizePublishedHref(krHref, maps, lang) : undefined;
}

function resolveDirectBlogHref(
  href: string,
  maps: ContentLinkMaps,
  lang: PostLang = DEFAULT_POST_LANG,
): string | null {
  const parsed = parseInternalBlogHref(href);
  if (!parsed) {
    return null;
  }

  const rawSlug = parsed.slug;
  const resolvedHref =
    lookupPublishedHref(rawSlug, maps, lang) ??
    lookupPublishedHref(safeDecodeURIComponent(rawSlug), maps, lang);

  if (!resolvedHref) {
    return null;
  }

  return `${resolvedHref}${parsed.hash}`;
}

export function resolveWikiLink(
  target: string,
  label: string | undefined,
  index: ContentIndex,
  lang: PostLang = DEFAULT_POST_LANG,
): LinkResolution {
  return resolveWikiLinkFromMaps(target, label, createContentLinkMaps(index), lang);
}

export function createContentLinkMaps(index: ContentIndex): ContentLinkMaps {
  const publishedEntries = Array.from(index.publishedByBasename.entries()).map(([key, note]) => [
    key,
    note.href,
  ]);

  for (const note of index.publishedNotes) {
    publishedEntries.push([note.slug, note.href]);
  }

  const publishedByLang: Partial<Record<TranslatedPostLang, Record<string, string>>> = {};
  for (const [lang, notesByKey] of index.translatedByBasename) {
    if (notesByKey.size === 0) {
      continue;
    }

    publishedByLang[lang] = Object.fromEntries(
      Array.from(notesByKey.entries()).map(([key, note]) => [key, note.href]),
    );
  }

  return {
    published: Object.fromEntries(publishedEntries),
    sources: Object.fromEntries(index.sourceUrlByBasename.entries()),
    sourceLabels: Object.fromEntries(index.sourceLabelByBasename.entries()),
    ...(Object.keys(publishedByLang).length > 0 ? { publishedByLang } : {}),
  };
}

export function resolveWikiLinkFromMaps(
  target: string,
  label: string | undefined,
  maps: ContentLinkMaps,
  lang: PostLang = DEFAULT_POST_LANG,
): LinkResolution {
  const parsed = parseTarget(target);
  const linkLabel = label || parsed.page;
  const publishedHref = lookupPublishedHref(parsed.page, maps, lang);

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
  const lang = fromNote.lang ?? DEFAULT_POST_LANG;
  const normalizedBlogHref = resolveDirectBlogHref(href, createContentLinkMaps(index), lang);
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

  return resolveWikiLink(`${targetNote.stem}${anchor ? `#${anchor}` : ''}`, label, index, lang);
}
