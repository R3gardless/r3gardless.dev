import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { LocalizedPostPage } from '@/libs/blogPages/postPage';
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

const staticDataMocks = vi.hoisted(() => ({
  posts: [] as PostMeta[],
}));

vi.mock('@/libs/staticPostData', () => ({
  getPostListWithStaticFallback: () => Promise.resolve(staticDataMocks.posts),
}));

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NOT_FOUND');
  },
}));

// PostBody 등 async 서버 컴포넌트 렌더를 피하고, postPage가 계산해 넘기는 props를 검증한다
vi.mock('@/components/templates/PostTemplate', () => ({
  PostTemplate: ({
    post,
    seriesPosts,
    prevPost,
    nextPost,
  }: {
    post: PostMeta;
    seriesPosts?: Array<{ id: number; title: string; href: string }>;
    prevPost?: { title: string };
    nextPost?: { title: string };
  }) => (
    <div>
      <h1>{post.title}</h1>
      {post.series && seriesPosts && seriesPosts.length > 1 && (
        <section data-testid="series">
          <span>{post.series.name}</span>
          <span>{`${seriesPosts.findIndex(p => p.id === post.id) + 1} / ${seriesPosts.length}`}</span>
        </section>
      )}
      {prevPost && <span data-testid="prev">{prevPost.title}</span>}
      {nextPost && <span data-testid="next">{nextPost.title}</span>}
    </div>
  ),
}));

const createPost = (overrides: Partial<PostMeta>): PostMeta => ({
  pageId: 'post',
  id: 1,
  title: 'Post',
  description: 'Description',
  createdAt: 'May 05, 2026',
  category: { text: 'Vector Search', color: 'purple' },
  tags: ['Paper Review'],
  slug: 'post',
  encodedSlug: 'post',
  ...overrides,
});

describe('LocalizedPostPage', () => {
  beforeEach(() => {
    fsMocks.existsSync.mockReset();
    fsMocks.readFileSync.mockReset();
    // 포스트 markdown은 존재, contentLinkIndex는 없음(빈 링크맵)으로 동작
    fsMocks.existsSync.mockImplementation((filePath: string) =>
      String(filePath).includes('content/posts'),
    );
    fsMocks.readFileSync.mockReturnValue('# 본문 제목\n\n본문 내용입니다.');
  });

  it('시리즈 포스트는 시리즈 박스와 시리즈 순서 이전/다음 내비게이션을 렌더링한다', async () => {
    // 전체 목록 순서(최신순)와 시리즈 순서(작성일순)가 다르도록 구성:
    // 시리즈 밖의 최신 글(unrelated)이 사이에 끼어 있어도 내비게이션은 시리즈 순서를 따라야 한다
    staticDataMocks.posts = [
      createPost({
        id: 3,
        slug: 'series-2',
        title: '시리즈 2편',
        createdAt: 'May 07, 2026',
        series: { name: 'ANN 논문리뷰' },
        publishedAt: '2026-05-07',
      }),
      createPost({ id: 2, slug: 'unrelated', title: '무관한 글', createdAt: 'May 06, 2026' }),
      createPost({
        id: 1,
        slug: 'series-1',
        title: '시리즈 1편',
        createdAt: 'May 05, 2026',
        series: { name: 'ANN 논문리뷰' },
        publishedAt: '2026-05-05',
      }),
    ];

    render(await LocalizedPostPage({ slug: 'series-1', lang: 'kr' }));

    // 시리즈 박스: 이름과 현재 위치 1 / 2
    expect(screen.getByText('ANN 논문리뷰')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    // 이전/다음 내비게이션이 시간순(무관한 글)이 아닌 시리즈 순서(2편)를 따른다
    expect(screen.getByTestId('next')).toHaveTextContent('시리즈 2편');
    expect(screen.queryByText('무관한 글')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prev')).not.toBeInTheDocument();
  });

  it('시리즈가 없는 포스트는 시리즈 박스 없이 전체 목록 순서 내비게이션을 쓴다', async () => {
    staticDataMocks.posts = [
      createPost({ id: 2, slug: 'newer', title: '더 최신 글', createdAt: 'May 06, 2026' }),
      createPost({ id: 1, slug: 'target', title: '대상 글', createdAt: 'May 05, 2026' }),
    ];

    render(await LocalizedPostPage({ slug: 'target', lang: 'kr' }));

    expect(screen.queryByTestId('series')).not.toBeInTheDocument();
    // 전체 목록(최신순)에서 바로 앞 항목이 prev로 이어진다
    expect(screen.getByTestId('prev')).toHaveTextContent('더 최신 글');
  });

  it('없는 slug는 notFound 처리한다', async () => {
    staticDataMocks.posts = [createPost({ id: 1, slug: 'exists' })];

    await expect(LocalizedPostPage({ slug: 'missing', lang: 'kr' })).rejects.toThrow('NOT_FOUND');
  });
});
