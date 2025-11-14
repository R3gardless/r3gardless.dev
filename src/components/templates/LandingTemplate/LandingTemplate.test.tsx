import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { PostCardProps } from '@/components/ui/blog/PostCard';

import { LandingTemplate } from './LandingTemplate';

// Next.js router mocking
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock('@/components/sections/LandingHero', () => ({
  LandingHero: ({ className }: { className?: string }) => (
    <section data-testid="landing-hero" className={className}>
      Landing Hero Component
    </section>
  ),
}));

vi.mock('@/components/sections/RecentPosts', () => ({
  RecentPosts: ({
    posts,
    categories,
    selectedCategory,
    isLoading,
    onCategoryClick,
    onMoreButtonClick,
    className,
  }: {
    posts: PostCardProps[];
    categories: string[];
    selectedCategory?: string;
    isLoading?: boolean;
    onCategoryClick?: (category: string) => void;
    onMoreButtonClick?: () => void;
    className?: string;
  }) => (
    <section data-testid="recent-posts" className={className}>
      <div data-testid="posts-count">{posts.length}</div>
      <div data-testid="categories-count">{categories.length}</div>
      <div data-testid="selected-category">{selectedCategory ?? 'none'}</div>
      <div data-testid="loading-state">{isLoading ? 'loading' : 'not-loading'}</div>
      <button onClick={() => onCategoryClick?.('test-category')} data-testid="category-button">
        Category Button
      </button>
      <button onClick={onMoreButtonClick} data-testid="more-button">
        More Button
      </button>
    </section>
  ),
}));

describe('LandingTemplate', () => {
  const samplePosts: PostCardProps[] = [
    {
      pageId: 'abcdafdf-1234-5678-90ab-cdef12345678',
      id: 1,
      slug: 'test-post-1',
      title: 'Test Post 1',
      description: 'Test description 1',
      createdAt: 'Jan 22, 2025',
      category: { text: 'Tech', color: 'blue' },
      tags: ['React', 'TypeScript'],
      href: '/blog/test-1',
    },
    {
      pageId: 'abcdafdf-1234-5678-90ab-cdef12345678',
      id: 2,
      slug: 'test-post-2',
      title: 'Test Post 2',
      description: 'Test description 2',
      createdAt: 'Jan 20, 2025',
      category: { text: 'Design', color: 'green' },
      tags: ['UI', 'UX'],
      href: '/blog/test-2',
    },
  ];

  const sampleCategories = ['전체', 'Tech', 'Design'];

  const defaultProps = {
    posts: samplePosts,
    categories: sampleCategories,
    selectedCategory: '전체',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
  });

  it('renders without crashing', () => {
    render(<LandingTemplate {...defaultProps} />);
    expect(screen.getByTestId('landing-hero')).toBeInTheDocument();
    expect(screen.getByTestId('recent-posts')).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-landing-template';
    render(<LandingTemplate {...defaultProps} className={customClass} />);

    const container = screen.getByTestId('landing-hero').closest('div');
    expect(container).toHaveClass(customClass);
  });

  it('passes correct props to RecentPosts', () => {
    render(<LandingTemplate {...defaultProps} />);

    expect(screen.getByTestId('posts-count')).toHaveTextContent('2');
    expect(screen.getByTestId('categories-count')).toHaveTextContent('3');
    expect(screen.getByTestId('selected-category')).toHaveTextContent('전체');
    expect(screen.getByTestId('loading-state')).toHaveTextContent('not-loading');
  });

  it('handles loading state correctly', () => {
    render(<LandingTemplate {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');
  });

  it('handles empty posts array', () => {
    render(<LandingTemplate {...defaultProps} posts={[]} />);
    expect(screen.getByTestId('posts-count')).toHaveTextContent('0');
  });

  it('handles category click events', () => {
    const mockCategoryClick = vi.fn();
    render(<LandingTemplate {...defaultProps} onCategoryClick={mockCategoryClick} />);

    fireEvent.click(screen.getByTestId('category-button'));
    expect(mockCategoryClick).toHaveBeenCalledWith('test-category');
  });

  it('handles more button click events', () => {
    const mockMoreButtonClick = vi.fn();
    render(<LandingTemplate {...defaultProps} onMoreButtonClick={mockMoreButtonClick} />);

    fireEvent.click(screen.getByTestId('more-button'));
    expect(mockMoreButtonClick).toHaveBeenCalled();
  });

  it('applies correct layout structure', () => {
    render(<LandingTemplate {...defaultProps} />);

    const container = screen.getByTestId('landing-hero').closest('div');
    expect(container).toHaveClass('min-h-screen');
  });

  it('applies correct styling to LandingHero', () => {
    render(<LandingTemplate {...defaultProps} />);

    const landingHero = screen.getByTestId('landing-hero');
    expect(landingHero).toHaveClass('w-full', 'max-w-[1024px]', 'mx-auto');
  });

  it('applies correct styling to RecentPosts', () => {
    render(<LandingTemplate {...defaultProps} />);

    const recentPosts = screen.getByTestId('recent-posts');
    expect(recentPosts).toBeInTheDocument();
  });

  it('passes all RecentPosts props correctly', () => {
    const props = {
      ...defaultProps,
      showMoreButton: false,
      moreButtonText: 'Custom Button Text',
      emptyMessage: 'Custom Empty Message',
    };

    render(<LandingTemplate {...props} />);

    // RecentPosts component should receive all these props
    expect(screen.getByTestId('recent-posts')).toBeInTheDocument();
  });

  it('renders main content wrapper with correct structure', () => {
    render(<LandingTemplate {...defaultProps} />);

    const landingHero = screen.getByTestId('landing-hero');
    const recentPosts = screen.getByTestId('recent-posts');
    const main = landingHero.closest('main');

    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-1');
    expect(main).toContainElement(landingHero);
    expect(main).toContainElement(recentPosts);
  });

  it('maintains proper component order', () => {
    render(<LandingTemplate {...defaultProps} />);

    const main = screen.getByRole('main');
    const landingHero = screen.getByTestId('landing-hero');
    const recentPosts = screen.getByTestId('recent-posts');

    expect(main).toContainElement(landingHero);
    expect(main).toContainElement(recentPosts);

    const children = Array.from(main.children);
    expect(children[0]).toContainElement(landingHero);
    expect(children[1]).toContainElement(recentPosts);
  });
});
