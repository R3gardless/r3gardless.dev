import path from 'node:path';

import { slugifyHeading } from './slug';
import type { ContentIndex, ContentLinkMaps, KbNote, LinkResolution } from './types';

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

export function resolveWikiLink(
  target: string,
  label: string | undefined,
  index: ContentIndex,
): LinkResolution {
  return resolveWikiLinkFromMaps(target, label, createContentLinkMaps(index));
}

export function createContentLinkMaps(index: ContentIndex): ContentLinkMaps {
  return {
    published: Object.fromEntries(
      Array.from(index.publishedByBasename.entries()).map(([key, note]) => [key, note.href]),
    ),
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
