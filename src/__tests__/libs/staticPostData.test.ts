import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  getPostListWithStaticFallback,
  getStaticPostList,
  getStaticPostMeta,
} from '@/libs/staticPostData';
import type { PostMeta } from '@/types/blog';

const fsMocks = vi.hoisted(() => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('node:fs', async importOriginal => {
  const actual = (await importOriginal()) as typeof import('node:fs') & {
    default: typeof import('node:fs');
  };
  return {
    ...actual,
    default: {
      ...actual.default,
      existsSync: fsMocks.existsSync,
      readFileSync: fsMocks.readFileSync,
    },
  };
});

const loggerMocks = vi.hoisted(() => ({
  logWarn: vi.fn(),
  logError: vi.fn(),
}));

vi.mock('@/utils/logger', () => loggerMocks);

const samplePosts: Partial<PostMeta>[] = [
  { pageId: 'post-a', id: 1, title: 'Post A', slug: 'post-a' },
  { pageId: 'post-b', id: 2, title: 'Post B', slug: 'post-b' },
];

describe('staticPostData', () => {
  beforeEach(() => {
    fsMocks.existsSync.mockReset();
    fsMocks.readFileSync.mockReset();
    loggerMocks.logWarn.mockClear();
    loggerMocks.logError.mockClear();
  });

  it('postMeta.json이 있으면 포스트 목록을 반환한다', () => {
    fsMocks.existsSync.mockReturnValue(true);
    fsMocks.readFileSync.mockReturnValue(JSON.stringify(samplePosts));

    const posts = getStaticPostList();

    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe('Post A');
  });

  it('postMeta.json이 없으면 경고를 남기고 빈 배열을 반환한다', () => {
    fsMocks.existsSync.mockReturnValue(false);

    expect(getStaticPostList()).toEqual([]);
    expect(loggerMocks.logWarn).toHaveBeenCalledWith(
      expect.stringContaining('Post metadata file is unavailable'),
    );
  });

  it('postMeta.json 파싱에 실패하면 에러를 남기고 빈 배열을 반환한다', () => {
    fsMocks.existsSync.mockReturnValue(true);
    fsMocks.readFileSync.mockReturnValue('{invalid json');

    expect(getStaticPostList()).toEqual([]);
    expect(loggerMocks.logError).toHaveBeenCalledWith(
      'Static post metadata read failed',
      expect.anything(),
    );
  });

  it('pageId로 특정 포스트 메타를 찾고 없으면 null을 반환한다', () => {
    fsMocks.existsSync.mockReturnValue(true);
    fsMocks.readFileSync.mockReturnValue(JSON.stringify(samplePosts));

    expect(getStaticPostMeta('post-b')?.title).toBe('Post B');
    expect(getStaticPostMeta('missing')).toBeNull();
  });

  it('fallback 로더는 정적 데이터가 있으면 그대로 반환한다', async () => {
    fsMocks.existsSync.mockReturnValue(true);
    fsMocks.readFileSync.mockReturnValue(JSON.stringify(samplePosts));

    await expect(getPostListWithStaticFallback()).resolves.toHaveLength(2);
  });

  it('fallback 로더는 정적 데이터가 비어 있으면 에러를 남기고 빈 배열을 반환한다', async () => {
    fsMocks.existsSync.mockReturnValue(false);

    await expect(getPostListWithStaticFallback()).resolves.toEqual([]);
    expect(loggerMocks.logError).toHaveBeenCalledWith(
      expect.stringContaining('Static post metadata is empty'),
    );
  });
});
