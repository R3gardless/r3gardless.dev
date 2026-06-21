import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildContentIndex, exportPublishedPost, readPostMetaFromContent } from '@/libs/content';

const fixtureKbRoot = path.join(process.cwd(), 'tests/fixtures/kb/KNOWELDGE_BASE');

let tempRoot: string;

beforeEach(() => {
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'r3gardless-meta-'));
});

afterEach(() => {
  fs.rmSync(tempRoot, { recursive: true, force: true });
});

describe('post metadata from exported content', () => {
  it('creates PostMeta records from content/posts frontmatter', () => {
    const index = buildContentIndex(fixtureKbRoot);
    const contentRoot = path.join(tempRoot, 'content/posts');
    const paths = {
      contentRoot,
      publicRoot: path.join(tempRoot, 'public'),
      publicAssetsBasePath: 'content/posts',
    };

    for (const note of index.publishedNotes) {
      exportPublishedPost(note, index, paths);
    }

    const posts = readPostMetaFromContent(contentRoot);

    expect(posts).toHaveLength(2);
    expect(posts[0]).toMatchObject({
      pageId: 'published-note',
      id: 2,
      title: 'Published Note',
      description: 'A published fixture note.',
      category: {
        text: 'blog',
        color: 'blue',
        rgb: expect.stringMatching(/^\d+ \d+ \d+$/),
        foregroundRgb: expect.stringMatching(/^\d+ \d+ \d+$/),
      },
      tags: ['blog', 'fixture'],
      slug: 'published-note',
      encodedSlug: 'published-note',
      cover: '/content/posts/published-note/assets/cover.svg',
    });
    expect(posts[0].createdAt).toBe('Jun 21, 2026');
    expect(posts[1]).toMatchObject({
      pageId: 'second-note',
      id: 1,
      title: 'Second Note',
      slug: 'second-note',
    });
  });
});
