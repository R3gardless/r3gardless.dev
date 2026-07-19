import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { LocalizedBlogListPage } from '@/libs/blogPages/listPage';
import type { PostMeta } from '@/types/blog';
import type { SeriesSummary } from '@/utils/blog';

const staticDataMocks = vi.hoisted(() => ({
  posts: [] as PostMeta[],
}));

vi.mock('@/libs/staticPostData', () => ({
  getPostListWithStaticFallback: () => Promise.resolve(staticDataMocks.posts),
}));

vi.mock('@/app/blog/BlogPageClient', () => ({
  default: ({
    initialSeries,
    initialCategories,
  }: {
    initialSeries?: SeriesSummary[];
    initialCategories: string[];
  }) => (
    <div>
      <div data-testid="categories">{initialCategories.join(',')}</div>
      <ul data-testid="series">
        {(initialSeries ?? []).map(item => (
          <li key={item.name}>{`${item.name}:${item.count}`}</li>
        ))}
      </ul>
    </div>
  ),
}));

const createPost = (overrides: Partial<PostMeta>): PostMeta => ({
  pageId: 'post',
  id: 1,
  title: 'Post',
  createdAt: 'May 05, 2026',
  category: { text: 'Vector Search', color: 'purple' },
  tags: [],
  slug: 'post',
  encodedSlug: 'post',
  ...overrides,
});

describe('LocalizedBlogListPage', () => {
  it('시리즈 요약 목록을 BlogPageClient에 전달한다', async () => {
    staticDataMocks.posts = [
      createPost({ id: 1, slug: 'a', series: { name: 'ANN 논문리뷰', order: 1 } }),
      createPost({ id: 2, slug: 'b', series: { name: 'ANN 논문리뷰', order: 2 } }),
      createPost({ id: 3, slug: 'c' }),
    ];

    render(await LocalizedBlogListPage({ lang: 'kr' }));

    expect(screen.getByTestId('series')).toHaveTextContent('ANN 논문리뷰:2');
  });

  it('en 페이지에서는 번역된 시리즈 이름으로 요약을 만든다', async () => {
    staticDataMocks.posts = [
      createPost({
        id: 1,
        slug: 'a',
        series: { name: 'ANN 논문리뷰', order: 1 },
        languages: ['kr', 'en'],
        translations: { en: { title: 'Post (EN)', seriesName: 'ANN Paper Review' } },
      }),
    ];

    render(await LocalizedBlogListPage({ lang: 'en' }));

    expect(screen.getByTestId('series')).toHaveTextContent('ANN Paper Review:1');
    expect(screen.getByTestId('series')).not.toHaveTextContent('ANN 논문리뷰');
  });
});
