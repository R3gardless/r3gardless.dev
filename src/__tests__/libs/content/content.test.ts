import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildContentIndex,
  normalizeFrontmatter,
  normalizePostLang,
  resolveCategoryColor,
  resolveCategoryForegroundRgb,
  resolveCategoryRgb,
  createDatedPostSlug,
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
    expect(index.publishedNotes.map(note => note.slug)).toEqual([
      '2026-06-21-published-note',
      '2026-06-20-second-note',
    ]);
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

    expect(index.publishedByBasename.get('published-note')?.href).toBe(
      '/blog/2026-06-21-published-note',
    );
    expect(index.publishedByBasename.get('Published Note')?.href).toBe(
      '/blog/2026-06-21-published-note',
    );
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
    expect(createDatedPostSlug('published-note', undefined, '2026-06-21')).toBe(
      '2026-06-21-published-note',
    );
    expect(createDatedPostSlug('2025-01-01-published-note', undefined, '2026-06-21')).toBe(
      '2026-06-21-published-note',
    );
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
      href: '/blog/2026-06-20-second-note',
    });

    expect(resolveWikiLink('second-note#Details Section', 'alias', index)).toEqual({
      kind: 'internal',
      label: 'alias',
      target: 'second-note#Details Section',
      href: '/blog/2026-06-20-second-note#details-section',
    });
  });

  it('resolves source wikilinks to public source URLs', () => {
    const index = buildContentIndex(fixtureKbRoot);

    expect(resolveWikiLink('youtube-source', undefined, index)).toEqual({
      kind: 'external',
      label: 'YouTube Source',
      target: 'youtube-source',
      href: 'https://www.youtube.com/watch?v=fixture',
      external: true,
    });

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
      href: '/blog/2026-06-20-second-note',
    });
    expect(resolveMarkdownLink('/blog/second-note', 'old internal', note!, index)).toEqual({
      kind: 'internal',
      label: 'old internal',
      target: '/blog/second-note',
      href: '/blog/2026-06-20-second-note',
    });
    expect(
      resolveMarkdownLink(
        'https://r3gardless.dev/blog/second-note#details-section',
        'old absolute',
        note!,
        index,
      ),
    ).toEqual({
      kind: 'internal',
      label: 'old absolute',
      target: 'https://r3gardless.dev/blog/second-note#details-section',
      href: '/blog/2026-06-20-second-note#details-section',
    });
    expect(
      resolveMarkdownLink('https://example.com/blog/second-note', 'external', note!, index),
    ).toEqual({
      kind: 'external',
      label: 'external',
      target: 'https://example.com/blog/second-note',
      href: 'https://example.com/blog/second-note',
      external: true,
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

describe('multilingual content', () => {
  it('normalizes frontmatter lang values to kr/en/ja', () => {
    expect(normalizePostLang(undefined)).toBe('kr');
    expect(normalizePostLang('')).toBe('kr');
    expect(normalizePostLang('en')).toBe('en');
    expect(normalizePostLang('EN')).toBe('en');
    expect(normalizePostLang('ja')).toBe('ja');
    expect(normalizePostLang('fr')).toBeUndefined();
    expect(normalizePostLang(42)).toBeUndefined();
  });

  it('aliases the legacy jp lang code to ja', () => {
    expect(normalizePostLang('jp')).toBe('ja');
    expect(normalizePostLang('JP')).toBe('ja');
    expect(normalizePostLang('ja')).toBe('ja');
  });

  it('keeps kr notes canonical and groups en/ja variants by shared slug', () => {
    const index = buildContentIndex(fixtureKbRoot);

    expect(index.diagnostics).toEqual([]);
    expect(index.publishedNotes).toHaveLength(2);
    expect(index.publishedVariants).toHaveLength(5);
    expect(
      index.publishedVariants
        .filter(note => note.lang === 'en')
        .map(note => note.slug)
        .sort(),
    ).toEqual(['2026-06-20-second-note', '2026-06-21-published-note']);
    expect(
      index.publishedVariants.filter(note => note.lang === 'ja').map(note => note.slug),
    ).toEqual(['2026-06-21-published-note']);
    expect(index.languagesBySlug.get('2026-06-21-published-note')).toEqual(['kr', 'en', 'ja']);
    expect(index.languagesBySlug.get('2026-06-20-second-note')).toEqual(['kr', 'en']);
  });

  it('maps translated notes by basename and title onto language routes', () => {
    const index = buildContentIndex(fixtureKbRoot);

    expect(index.translatedByBasename.get('en')?.get('published-note')?.href).toBe(
      '/en/blog/2026-06-21-published-note',
    );
    expect(index.translatedByBasename.get('en')?.get('Published Note (EN)')?.href).toBe(
      '/en/blog/2026-06-21-published-note',
    );
    expect(index.translatedByBasename.get('ja')?.get('published-note')?.href).toBe(
      '/ja/blog/2026-06-21-published-note',
    );
    expect(index.translatedByBasename.get('ja')?.get('second-note')).toBeUndefined();
    expect(index.publishedByBasename.get('published-note')?.href).toBe(
      '/blog/2026-06-21-published-note',
    );
  });

  it('resolves wikilinks to same-language routes with kr fallback', () => {
    const index = buildContentIndex(fixtureKbRoot);

    expect(resolveWikiLink('second-note', undefined, index, 'en').href).toBe(
      '/en/blog/2026-06-20-second-note',
    );
    expect(resolveWikiLink('second-note', undefined, index, 'ja').href).toBe(
      '/blog/2026-06-20-second-note',
    );
    expect(resolveWikiLink('second-note', undefined, index, 'kr').href).toBe(
      '/blog/2026-06-20-second-note',
    );
  });

  it('localizes direct blog links based on the source note language', () => {
    const index = buildContentIndex(fixtureKbRoot);
    const enNote = index.translatedByBasename.get('en')?.get('published-note');
    const jaNote = index.translatedByBasename.get('ja')?.get('published-note');

    expect(enNote).toBeDefined();
    expect(jaNote).toBeDefined();
    expect(resolveMarkdownLink('/blog/second-note', 'link', enNote!, index).href).toBe(
      '/en/blog/2026-06-20-second-note',
    );
    expect(resolveMarkdownLink('/blog/second-note', 'link', jaNote!, index).href).toBe(
      '/blog/2026-06-20-second-note',
    );
  });

  it('reports same-language duplicates, invalid langs, and orphan translations', () => {
    const tempKb = fs.mkdtempSync(path.join(os.tmpdir(), 'r3gardless-kb-'));

    try {
      const krDir = path.join(tempKb, 'dev/blog/wiki/kr');
      const enDir = path.join(tempKb, 'dev/blog/wiki/en');
      fs.mkdirSync(krDir, { recursive: true });
      fs.mkdirSync(enDir, { recursive: true });

      const frontmatter = (extra: string) =>
        `---\nlayer: wiki\ntitle: 'Temp'\npublish: true\nadded: 2026-01-01\npublished_at: 2026-01-01\n${extra}---\n\nBody\n`;

      fs.writeFileSync(path.join(krDir, 'first.md'), frontmatter('slug: dup\n'), 'utf8');
      fs.writeFileSync(path.join(krDir, 'second.md'), frontmatter('slug: dup\n'), 'utf8');
      fs.writeFileSync(path.join(enDir, 'orphan.md'), frontmatter('lang: en\n'), 'utf8');
      fs.writeFileSync(path.join(krDir, 'invalid.md'), frontmatter('lang: fr\n'), 'utf8');

      const index = buildContentIndex(tempKb);
      const codes = index.diagnostics.map(diagnostic => diagnostic.code);

      expect(codes).toContain('DUPLICATE_SLUG');
      expect(codes).toContain('TRANSLATION_WITHOUT_CANONICAL');
      expect(codes).toContain('INVALID_LANG');
    } finally {
      fs.rmSync(tempKb, { recursive: true, force: true });
    }
  });
});
