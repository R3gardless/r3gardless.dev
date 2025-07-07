import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

import { RecentPosts } from './RecentPosts';

// 샘플 데이터
const sampleCategories = ['전체', '데이터베이스', '네트워크', '프로그래밍언어'];

const samplePosts = [
  {
    title: 'Test Post 1',
    description: 'Test description 1',
    publishedAt: 'Jan 22, 2025',
    tags: ['React', 'JavaScript'],
    thumbnailUrl: '/test-image-1.jpg',
    href: '/posts/test-1',
    id: '1',
    category: {
      text: '프론트엔드',
      color: 'blue' as const,
    },
  },
  {
    title: 'Test Post 2',
    description: 'Test description 2',
    publishedAt: 'Jan 20, 2025',
    tags: ['Node.js', 'Backend'],
    thumbnailUrl: '/test-image-2.jpg',
    href: '/posts/test-2',
    id: '2',
    category: {
      text: '백엔드',
      color: 'orange' as const,
    },
  },
];

describe('RecentPosts', () => {
  it('renders posts correctly', () => {
    render(
      <RecentPosts posts={samplePosts} categories={sampleCategories} selectedCategory="전체" />,
    );

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.getByText('Test description 1')).toBeInTheDocument();
    expect(screen.getByText('Test description 2')).toBeInTheDocument();
  });

  it('renders categories correctly', () => {
    render(
      <RecentPosts posts={samplePosts} categories={sampleCategories} selectedCategory="전체" />,
    );

    sampleCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('calls onCategoryClick when category is clicked', () => {
    const handleCategoryClick = vi.fn();

    render(
      <RecentPosts
        posts={samplePosts}
        categories={sampleCategories}
        selectedCategory="전체"
        onCategoryClick={handleCategoryClick}
      />,
    );

    fireEvent.click(screen.getByText('데이터베이스'));
    expect(handleCategoryClick).toHaveBeenCalledWith('데이터베이스');
  });

  it('renders more button when showMoreButton is true', () => {
    render(
      <RecentPosts
        posts={samplePosts}
        categories={sampleCategories}
        selectedCategory="전체"
        showMoreButton={true}
        moreButtonText="더 보기"
      />,
    );

    expect(screen.getByText('더 보기')).toBeInTheDocument();
  });

  it('calls onMoreButtonClick when more button is clicked', () => {
    const handleMoreButtonClick = vi.fn();

    render(
      <RecentPosts
        posts={samplePosts}
        categories={sampleCategories}
        selectedCategory="전체"
        showMoreButton={true}
        moreButtonText="더 보기"
        onMoreButtonClick={handleMoreButtonClick}
      />,
    );

    fireEvent.click(screen.getByText('더 보기'));
    expect(handleMoreButtonClick).toHaveBeenCalled();
  });

  it('does not render more button when showMoreButton is false', () => {
    render(
      <RecentPosts
        posts={samplePosts}
        categories={sampleCategories}
        selectedCategory="전체"
        showMoreButton={false}
      />,
    );

    expect(screen.queryByText('둘러보기')).not.toBeInTheDocument();
  });

  it('renders loading state correctly', () => {
    render(
      <RecentPosts
        posts={[]}
        categories={sampleCategories}
        selectedCategory="전체"
        isLoading={true}
      />,
    );

    // 로딩 스켈레톤이 렌더링되는지 확인 (animate-pulse 클래스로 확인)
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);

    // 카테고리 스켈레톤 확인
    const categorySkeletons = document.querySelectorAll(
      '.flex.items-center.gap-4.overflow-x-hidden',
    );
    expect(categorySkeletons).toHaveLength(1);

    // 카드 스켈레톤 확인
    const cardSkeletons = document.querySelectorAll(
      '.rounded-2xl.bg-\\[color\\:var\\(--color-secondary\\)\\].animate-pulse',
    );
    expect(cardSkeletons.length).toBeGreaterThan(0);
  });

  it('renders empty state correctly', () => {
    const emptyMessage = '포스트가 없습니다.';

    render(
      <RecentPosts
        posts={[]}
        categories={sampleCategories}
        selectedCategory="전체"
        isLoading={false}
        emptyMessage={emptyMessage}
      />,
    );

    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
    expect(screen.getByText('다른 카테고리를 선택해보세요.')).toBeInTheDocument();
  });

  it('renders without categories when categories array is empty', () => {
    render(<RecentPosts posts={samplePosts} categories={[]} selectedCategory={undefined} />);

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();

    // 카테고리가 렌더링되지 않는지 확인
    expect(screen.queryByText('전체')).not.toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    const { container } = render(
      <RecentPosts
        posts={samplePosts}
        categories={sampleCategories}
        selectedCategory="전체"
        className="custom-class"
      />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders grid layout correctly', () => {
    render(
      <RecentPosts posts={samplePosts} categories={sampleCategories} selectedCategory="전체" />,
    );

    // 그리드 컨테이너가 올바른 클래스를 가지는지 확인
    const gridContainer = screen.getByText('Test Post 1').closest('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });
});
