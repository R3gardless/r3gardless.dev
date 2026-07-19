import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PostMeta } from '@/types/blog';

import BlogPageClient from './BlogPageClient';

const navigationMocks = vi.hoisted(() => ({
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: navigationMocks.replace,
  }),
  useSearchParams: () => navigationMocks.searchParams,
}));

vi.mock('@/components/templates/BlogTemplate', () => ({
  BlogTemplate: ({
    header,
    posts,
  }: {
    header: {
      searchValue: string;
      onSearchChange?: (value: string) => void;
      onSearch?: (value: string) => void;
    };
    posts: {
      posts: Array<{ slug: string; title: string }>;
      emptyMessage?: string;
    };
  }) => (
    <section>
      <input
        aria-label="search"
        value={header.searchValue}
        onChange={event => header.onSearchChange?.(event.currentTarget.value)}
      />
      <button type="button" onClick={() => header.onSearch?.(header.searchValue)}>
        Search
      </button>
      <div data-testid="post-count">{posts.posts.length}</div>
      {posts.posts.map(post => (
        <article key={post.slug}>{post.title}</article>
      ))}
      {posts.emptyMessage ? <p>{posts.emptyMessage}</p> : null}
    </section>
  ),
}));

const createPost = (overrides: Partial<PostMeta>): PostMeta => ({
  pageId: 'post',
  id: 1,
  title: 'Product Quantization for Nearest Neighbor Search',
  description: 'Codebook compression for vector search.',
  createdAt: 'Jun 21, 2026',
  category: {
    text: 'Vector Search',
    color: 'purple',
  },
  tags: ['Paper Review'],
  slug: 'product-quantization',
  encodedSlug: 'product-quantization',
  ...overrides,
});

describe('BlogPageClient search filtering', () => {
  const posts = [
    createPost({ id: 1, slug: 'product-quantization' }),
    createPost({
      id: 2,
      slug: 'browser-file-sync',
      title: 'Browser File Sync',
      description: 'File System Access API로 브라우저에서 파일을 동기화합니다.',
      category: {
        text: 'Frontend',
        color: 'blue',
      },
      tags: ['Browser'],
    }),
  ];

  beforeEach(() => {
    navigationMocks.replace.mockClear();
    navigationMocks.searchParams = new URLSearchParams();
  });

  it('title에 없는 description 검색어로 포스트를 필터링한다', async () => {
    const user = userEvent.setup();
    render(<BlogPageClient initialPosts={posts} initialCategories={[]} initialTags={[]} />);

    await waitFor(() => expect(screen.getByTestId('post-count')).toHaveTextContent('2'));
    const input = screen.getByLabelText('search');
    await waitFor(() => expect(input).toHaveValue(''));

    await user.type(input, 'file system access');
    await waitFor(() => expect(input).toHaveValue('file system access'));

    expect(screen.getByText('Browser File Sync')).toBeInTheDocument();
    expect(
      screen.queryByText('Product Quantization for Nearest Neighbor Search'),
    ).not.toBeInTheDocument();
  });

  it('오타가 있는 검색어를 fuzzy search로 필터링한다', async () => {
    const user = userEvent.setup();
    render(<BlogPageClient initialPosts={posts} initialCategories={[]} initialTags={[]} />);

    await waitFor(() => expect(screen.getByTestId('post-count')).toHaveTextContent('2'));
    const input = screen.getByLabelText('search');
    await waitFor(() => expect(input).toHaveValue(''));

    await user.type(input, 'quantizaton');
    await waitFor(() => expect(input).toHaveValue('quantizaton'));

    expect(
      screen.getByText('Product Quantization for Nearest Neighbor Search'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Browser File Sync')).not.toBeInTheDocument();
  });

  it('URL의 series 파라미터로 포스트를 필터링한다', async () => {
    navigationMocks.searchParams = new URLSearchParams('series=ANN 논문 리뷰');
    const seriesPosts = [
      createPost({ id: 1, slug: 'pq', series: { name: 'ANN 논문 리뷰', order: 1 } }),
      createPost({ id: 2, slug: 'browser-file-sync', title: 'Browser File Sync' }),
    ];

    render(
      <BlogPageClient
        initialPosts={seriesPosts}
        initialCategories={[]}
        initialSeries={[{ name: 'ANN 논문 리뷰', count: 1 }]}
        initialTags={[]}
      />,
    );

    await waitFor(() => expect(screen.getByTestId('post-count')).toHaveTextContent('1'));
    expect(
      screen.getByText('Product Quantization for Nearest Neighbor Search'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Browser File Sync')).not.toBeInTheDocument();
  });

  it('현재 언어 목록에 없는 series 파라미터는 해제한다 (언어 전환 잔여값)', async () => {
    // en 페이지로 kr 시리즈 이름이 넘어온 상황: 필터를 풀고 전체를 보여준다
    navigationMocks.searchParams = new URLSearchParams('series=ANN 논문 리뷰');
    const seriesPosts = [
      createPost({ id: 1, slug: 'pq', series: { name: 'ANN Paper Review', order: 1 } }),
      createPost({ id: 2, slug: 'browser-file-sync', title: 'Browser File Sync' }),
    ];

    render(
      <BlogPageClient
        initialPosts={seriesPosts}
        initialCategories={[]}
        initialSeries={[{ name: 'ANN Paper Review', count: 1 }]}
        initialTags={[]}
        lang="en"
      />,
    );

    await waitFor(() => expect(screen.getByTestId('post-count')).toHaveTextContent('2'));
  });
});
