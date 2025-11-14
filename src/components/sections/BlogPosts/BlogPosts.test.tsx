import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import type { PostRowProps } from '@/components/ui/blog/PostRow';

import { BlogPosts } from './BlogPosts';

// 샘플 데이터
const mockPosts: PostRowProps[] = [
  {
    pageId: 'abcd1234-5678-90ab-cdef-123456789asd',
    id: 1,
    slug: 'test-post-1',
    title: 'Test Post 1',
    description: 'This is a test description for post 1',
    createdAt: 'Jan 22, 2025',
    category: {
      text: '테스트',
      color: 'blue',
    },
    tags: ['test', 'react'],
    href: '/posts/test-1',
  },
  {
    pageId: 'abcd1234-5678-90ab-cdef-123456789012',
    id: 2,
    slug: 'test-post-2',
    title: 'Test Post 2',
    description: 'This is a test description for post 2',
    createdAt: 'Jan 20, 2025',
    category: {
      text: '개발',
      color: 'green',
    },
    tags: ['development', 'typescript'],
    href: '/posts/test-2',
    cover: '/test-image.jpg',
  },
];

describe('BlogPosts', () => {
  it('renders correctly with posts', () => {
    render(<BlogPosts posts={mockPosts} />);

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    const { container } = render(<BlogPosts posts={[]} isLoading={true} />);

    // 로딩 스켈레톤이 렌더링되는지 확인
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);

    // 정렬 옵션 스켈레톤도 확인
    expect(screen.getByText('정렬')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<BlogPosts posts={[]} isLoading={false} emptyMessage="No posts available" />);

    expect(screen.getByText('No posts available')).toBeInTheDocument();
  });

  it('renders without explicit props', () => {
    render(<BlogPosts posts={mockPosts} />);

    // 포스트들이 렌더링되는지 확인
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('handles pagination', () => {
    const handlePageChange = vi.fn();

    render(
      <BlogPosts
        posts={mockPosts}
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );

    // 페이지네이션이 렌더링되는지 확인
    expect(screen.getByRole('navigation', { name: '페이지네이션' })).toBeInTheDocument();
  });

  it('handles category click', () => {
    const handleCategoryClick = vi.fn();

    render(<BlogPosts posts={mockPosts} onCategoryClick={handleCategoryClick} />);

    const categoryButton = screen.getByText('테스트');
    fireEvent.click(categoryButton);

    expect(handleCategoryClick).toHaveBeenCalledWith('테스트');
  });

  it('handles tag click', () => {
    const handleTagClick = vi.fn();

    render(<BlogPosts posts={mockPosts} onTagClick={handleTagClick} />);

    const tagButton = screen.getByText('#test');
    fireEvent.click(tagButton);

    expect(handleTagClick).toHaveBeenCalledWith('test');
  });

  it('does not render pagination when totalPages is 1', () => {
    render(<BlogPosts posts={mockPosts} currentPage={1} totalPages={1} onPageChange={vi.fn()} />);

    expect(screen.queryByRole('navigation', { name: '페이지네이션' })).not.toBeInTheDocument();
  });

  it('does not render pagination when onPageChange is not provided', () => {
    render(<BlogPosts posts={mockPosts} currentPage={1} totalPages={5} />);

    expect(screen.queryByRole('navigation', { name: '페이지네이션' })).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<BlogPosts posts={mockPosts} className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with disabled pagination', () => {
    render(
      <BlogPosts
        posts={mockPosts}
        currentPage={1}
        totalPages={5}
        onPageChange={vi.fn()}
        paginationDisabled={true}
      />,
    );

    const pagination = screen.getByRole('navigation', { name: '페이지네이션' });
    expect(pagination).toHaveClass('opacity-50');
  });

  it('renders thumbnails when available', () => {
    render(<BlogPosts posts={mockPosts} />);

    const image = screen.getByAltText('Test Post 2 커버 이미지');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test-image.jpg'));
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();

    render(<BlogPosts ref={ref} posts={mockPosts} />);

    expect(ref).toHaveBeenCalled();
  });

  it('renders sort controls when showSort is true', () => {
    render(<BlogPosts posts={mockPosts} showSort={true} sortDirection="desc" />);

    expect(screen.getByText('정렬')).toBeInTheDocument();
    expect(screen.getByLabelText('오름차순 정렬')).toBeInTheDocument();
    expect(screen.getByLabelText('내림차순 정렬')).toBeInTheDocument();
  });

  it('does not render sort controls when showSort is false', () => {
    render(<BlogPosts posts={mockPosts} showSort={false} />);

    expect(screen.queryByText('정렬')).not.toBeInTheDocument();
  });

  it('handles sort direction selection for ascending', () => {
    const handleSortChange = vi.fn();

    render(
      <BlogPosts
        posts={mockPosts}
        showSort={true}
        sortDirection="desc"
        onSortChange={handleSortChange}
      />,
    );

    const ascButton = screen.getByLabelText('오름차순 정렬');
    fireEvent.click(ascButton);

    expect(handleSortChange).toHaveBeenCalledWith('id', 'asc');
  });

  it('handles sort direction selection for descending', () => {
    const handleSortChange = vi.fn();

    render(
      <BlogPosts
        posts={mockPosts}
        showSort={true}
        sortDirection="asc"
        onSortChange={handleSortChange}
      />,
    );

    const descButton = screen.getByLabelText('내림차순 정렬');
    fireEvent.click(descButton);

    expect(handleSortChange).toHaveBeenCalledWith('id', 'desc');
  });

  it('disables currently selected sort direction', () => {
    render(<BlogPosts posts={mockPosts} showSort={true} sortDirection="asc" />);

    const ascButton = screen.getByLabelText('오름차순 정렬');
    const descButton = screen.getByLabelText('내림차순 정렬');

    expect(ascButton).toBeDisabled();
    expect(ascButton).toHaveAttribute('aria-pressed', 'true');
    expect(descButton).not.toBeDisabled();
    expect(descButton).toHaveAttribute('aria-pressed', 'false');
  });
});
