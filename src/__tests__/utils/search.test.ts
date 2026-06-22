import { describe, expect, it } from 'vitest';

import type { PostMeta } from '@/types/blog';
import { filterPostsBySearch, matchesPostSearch } from '@/utils/search';

const createPost = (overrides: Partial<PostMeta>): PostMeta => ({
  pageId: 'post',
  id: 1,
  title: 'Product Quantization for Nearest Neighbor Search',
  description: 'Codebook compression keeps vector distance search small enough for memory.',
  createdAt: 'Jun 21, 2026',
  category: {
    text: 'Vector Search',
    color: 'purple',
  },
  tags: ['Paper Review', 'Vector Database'],
  slug: 'product-quantization',
  encodedSlug: 'product-quantization',
  ...overrides,
});

describe('search utils', () => {
  it('description을 검색 범위에 포함한다', () => {
    const post = createPost({
      title: 'Unrelated Title',
      description: 'Approximate nearest neighbor index를 설명합니다.',
    });

    expect(matchesPostSearch(post, 'nearest neighbor')).toBe(true);
  });

  it('제목의 오타를 fuzzy search로 매칭한다', () => {
    const post = createPost({});

    expect(matchesPostSearch(post, 'product quantizaton')).toBe(true);
    expect(matchesPostSearch(post, 'neareset')).toBe(true);
  });

  it('description의 오타를 fuzzy search로 매칭한다', () => {
    const post = createPost({
      title: 'Unrelated Title',
      description: 'Large codebook memory pressure and vector compression tradeoffs.',
    });

    expect(matchesPostSearch(post, 'codebok')).toBe(true);
  });

  it('여러 검색어를 title, description, tag 범위에 걸쳐 모두 만족해야 매칭한다', () => {
    const post = createPost({
      title: 'PostgreSQL Source Debugging',
      description: 'VSCode launch configuration으로 디버깅 환경을 잡습니다.',
      tags: ['Database'],
    });

    expect(matchesPostSearch(post, 'postgresql launch database')).toBe(true);
    expect(matchesPostSearch(post, 'postgresql mermaid')).toBe(false);
  });

  it('기존 category와 tag 검색 의도를 유지한다', () => {
    const post = createPost({
      title: 'Unrelated Title',
      description: 'No keyword here.',
      category: { text: 'Build System', color: 'blue' },
      tags: ['Makefile'],
    });

    expect(matchesPostSearch(post, 'build system')).toBe(true);
    expect(matchesPostSearch(post, 'makefile')).toBe(true);
  });

  it('포스트 배열을 검색 결과로 필터링한다', () => {
    const posts = [
      createPost({ id: 1, slug: 'pq' }),
      createPost({
        id: 2,
        slug: 'browser-sync',
        title: 'Browser File Sync',
        description: 'File System Access API를 이용한 동기화.',
        tags: ['Browser'],
      }),
    ];

    expect(filterPostsBySearch(posts, 'file system access')).toEqual([posts[1]]);
    expect(filterPostsBySearch(posts, '')).toEqual(posts);
  });
});
