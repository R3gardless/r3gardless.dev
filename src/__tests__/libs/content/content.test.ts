import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildContentIndex,
  normalizeFrontmatter,
  resolveCategoryColor,
  resolveCategoryForegroundRgb,
  resolveCategoryRgb,
  resolveMarkdownLink,
  resolveWikiLink,
  slugifyHeading,
  slugifyPost,
} from '@/libs/content';

const fixtureKbRoot = path.join(process.cwd(), 'tests/fixtures/kb/KNOWELDGE_BASE');

describe('content loader', () => {
  it('parses frontmatter and keeps only non-source publish:true notes as published content', () => {
    const index = buildContentIndex(fixtureKbRoot);

    expect(index.diagnostics).toEqual([]);
    expect(index.notes.length).toBeGreaterThan(0);
    expect(index.publishedNotes.map(note => note.slug)).toEqual(['published-note', 'second-note']);
    expect(index.publishedNotes.map(note => note.frontmatter.title)).toEqual([
      'Published Note',
      'Second Note',
    ]);
    expect(index.publishedNotes.some(note => note.frontmatter.layer === 'source')).toBe(false);
  });

  it('keeps cover as the only canonical image frontmatter field', () => {
    const frontmatter = normalizeFrontmatter({
      title: 'Cover Fixture',
      publish: true,
      thumbnail: './assets/old-thumb.png',
      cover: './assets/cover.png',
    });

    expect(frontmatter.cover).toBe('./assets/cover.png');
    expect(frontmatter).not.toHaveProperty('thumbnail');
  });

  it('builds published and source_url maps by basename and title', () => {
    const index = buildContentIndex(fixtureKbRoot);

    expect(index.publishedByBasename.get('published-note')?.href).toBe('/blog/published-note');
    expect(index.publishedByBasename.get('Published Note')?.href).toBe('/blog/published-note');
    expect(index.sourceUrlByBasename.get('youtube-source')).toBe(
      'https://www.youtube.com/watch?v=fixture',
    );
    expect(index.sourceUrlByBasename.get('YouTube Source')).toBe(
      'https://www.youtube.com/watch?v=fixture',
    );
    expect(index.sourceLabelByBasename.get('youtube-source')).toBe('YouTube Source');
    expect(index.sourceLabelByBasename.get('YouTube Source')).toBe('YouTube Source');
  });

  it('normalizes post and heading slugs without dropping Korean text', () => {
    expect(slugifyPost('송희구. 투자 원칙')).toBe('송희구-투자-원칙');
    expect(slugifyHeading('Details Section')).toBe('details-section');
  });

  it('assigns stable category colors when KNOWLEDGE_BASE frontmatter has no Notion color', () => {
    expect(resolveCategoryColor('Vector Search')).toBe('purple');
    expect(resolveCategoryColor('Frontend')).toBe('green');
    expect(resolveCategoryColor('Database')).toBe('blue');
    expect(resolveCategoryColor('Build System')).toBe('orange');
    expect(resolveCategoryColor('Vector Search', 'pink')).toBe('pink');
    expect(resolveCategoryColor('Unmapped Category')).toBe(
      resolveCategoryColor('Unmapped Category'),
    );
  });

  it('assigns stable RGB values from category text hashes', () => {
    const vectorSearchRgb = resolveCategoryRgb('Vector Search');
    const frontendRgb = resolveCategoryRgb('Frontend');

    expect(vectorSearchRgb).toMatch(/^\d+ \d+ \d+$/);
    expect(resolveCategoryRgb('Vector Search')).toBe(vectorSearchRgb);
    expect(frontendRgb).not.toBe(vectorSearchRgb);
    expect(resolveCategoryForegroundRgb('Vector Search')).toMatch(/^\d+ \d+ \d+$/);
  });
});

describe('content link resolver', () => {
  it('resolves wikilinks to published internal URLs', () => {
    const index = buildContentIndex(fixtureKbRoot);

    expect(resolveWikiLink('second-note', undefined, index)).toEqual({
      kind: 'internal',
      label: 'second-note',
      target: 'second-note',
      href: '/blog/second-note',
    });

    expect(resolveWikiLink('second-note#Details Section', 'alias', index)).toEqual({
      kind: 'internal',
      label: 'alias',
      target: 'second-note#Details Section',
      href: '/blog/second-note#details-section',
    });
  });

  it('resolves source wikilinks to public source URLs', () => {
    const index = buildContentIndex(fixtureKbRoot);

    expect(resolveWikiLink('youtube-source', 'original', index)).toEqual({
      kind: 'external',
      label: 'original',
      target: 'youtube-source',
      href: 'https://www.youtube.com/watch?v=fixture',
      external: true,
    });
  });

  it('degrades unpublished targets without source_url to text', () => {
    const index = buildContentIndex(fixtureKbRoot);
    const result = resolveWikiLink('private-source', undefined, index);

    expect(result.kind).toBe('text');
    expect(result.label).toBe('private-source');
    expect(result.warning).toContain('source_url');
  });

  it('applies the same rules to relative markdown links', () => {
    const index = buildContentIndex(fixtureKbRoot);
    const note = index.publishedByBasename.get('published-note');

    expect(note).toBeDefined();
    expect(resolveMarkdownLink('./second-note.md', 'second', note!, index)).toEqual({
      kind: 'internal',
      label: 'second',
      target: 'second-note',
      href: '/blog/second-note',
    });
    expect(resolveMarkdownLink('../sources/youtube-source.md', 'source', note!, index)).toEqual({
      kind: 'external',
      label: 'source',
      target: 'youtube-source',
      href: 'https://www.youtube.com/watch?v=fixture',
      external: true,
    });

    const privateResult = resolveMarkdownLink(
      '../sources/private-source.md',
      'private',
      note!,
      index,
    );
    expect(privateResult.kind).toBe('text');
    expect(privateResult.label).toBe('private');
  });
});
