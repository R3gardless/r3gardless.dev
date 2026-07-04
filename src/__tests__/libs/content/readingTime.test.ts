import { describe, expect, it } from 'vitest';

import { normalizeFrontmatter } from '@/libs/content/frontmatter';
import { createPostMetaList } from '@/libs/content/postMeta';
import type { KbNote } from '@/libs/content/types';

function makeNote(frontmatter: Record<string, unknown>): KbNote {
  return {
    absolutePath: '/kb/note.md',
    relativePath: 'note.md',
    dirRelativePath: '',
    basename: 'note.md',
    stem: 'note',
    lang: 'kr',
    content: 'Body text.',
    frontmatter: normalizeFrontmatter({ title: 'Note', added: '2026-01-02', ...frontmatter }),
  };
}

describe('reading_time frontmatter', () => {
  it('normalizes reading_time to a positive integer number of minutes', () => {
    expect(normalizeFrontmatter({ reading_time: 5 }).reading_time).toBe(5);
    expect(normalizeFrontmatter({ reading_time: '7' }).reading_time).toBe(7);
    expect(normalizeFrontmatter({ reading_time: '8 min' }).reading_time).toBe(8);
    expect(normalizeFrontmatter({ reading_time: 4.6 }).reading_time).toBe(5);
    expect(normalizeFrontmatter({ reading_time: 0 }).reading_time).toBeUndefined();
    expect(normalizeFrontmatter({ reading_time: -3 }).reading_time).toBeUndefined();
    expect(normalizeFrontmatter({ reading_time: 'abc' }).reading_time).toBeUndefined();
    expect(normalizeFrontmatter({}).reading_time).toBeUndefined();
  });

  it('maps reading_time into PostMeta.readingTime', () => {
    const [meta] = createPostMetaList([makeNote({ reading_time: 6 })]);
    expect(meta.readingTime).toBe(6);
  });

  it('leaves readingTime undefined when reading_time is absent', () => {
    const [meta] = createPostMetaList([makeNote({})]);
    expect(meta.readingTime).toBeUndefined();
  });
});
