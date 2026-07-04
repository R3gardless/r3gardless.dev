/**
 * BlogTemplate 컴포넌트 테스트
 *
 * 테스트 케이스:
 * 1. 기본 렌더링 및 구조 검증
 * 2. 올바른 레이아웃 구조 (상단: BlogHeader, 하단: BlogSidebar + BlogPosts)
 * 3. props 전달 검증
 * 4. 접근성 검증
 * 5. 반응형 레이아웃 (1024px 기준)
 */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { BlogTemplate } from '.';

// 테스트용 샘플 데이터
const SAMPLE_CATEGORIES = ['전체', 'React', 'JavaScript'];
const SAMPLE_TAGS = ['React', 'TypeScript', 'Next.js'];
const SAMPLE_POSTS = [
  {
    id: 1,
    pageId: '1234567890abcdef',
    slug: 'test-post-1',
    title: 'Test Post 1',
    description: 'Test description 1',
    createdAt: 'Jan 22, 2025',
    category: { text: 'React', color: 'blue' as const },
    tags: ['React', 'TypeScript'],
    href: '/blog/test-post-1',
  },
  {
    id: 2,
    pageId: 'abcdef1234567890',
    slug: 'test-post-2',
    title: 'Test Post 2',
    description: 'Test description 2',
    createdAt: 'Jan 20, 2025',
    category: { text: 'JavaScript', color: 'green' as const },
    tags: ['JavaScript'],
    href: '/blog/test-post-2',
  },
];

const mockProps = {
  header: {
    searchValue: '',
    onSearchChange: vi.fn(),
    onSearch: vi.fn(),
    isSearchLoading: false,
  },
  sidebar: {
    categories: SAMPLE_CATEGORIES,
    tags: SAMPLE_TAGS,
    selectedCategory: undefined,
    selectedTags: [],
    onCategoryClick: vi.fn(),
    onTagClick: vi.fn(),
    onTagRemove: vi.fn(),
    onClearAllTags: vi.fn(),
  },
  posts: {
    posts: SAMPLE_POSTS,
    currentPage: 1,
    totalPages: 1,
    onPageChange: vi.fn(),
    showSort: true,
    sortDirection: 'desc' as const,
    onSortChange: vi.fn(),
    onCategoryClick: vi.fn(),
    onTagClick: vi.fn(),
  },
};

describe('BlogTemplate', () => {
  describe('기본 렌더링', () => {
    it('BlogTemplate이 렌더링된다', () => {
      render(<BlogTemplate {...mockProps} />);

      // BlogHeader가 렌더링되는지 확인 (Blog 제목으로 확인)
      expect(screen.getByText('Blog')).toBeInTheDocument();

      // BlogSidebar가 렌더링되는지 확인 (카테고리 제목으로 확인)
      expect(screen.getByText('카테고리')).toBeInTheDocument();
      expect(screen.getByText('태그')).toBeInTheDocument();

      // BlogPosts가 렌더링되는지 확인 (포스트 제목으로 확인)
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });

    it('레이아웃이 올바르게 구성된다', () => {
      const { container } = render(<BlogTemplate {...mockProps} />);

      // 메인 컨테이너가 있는지 확인
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('w-full', 'max-w-[1024px]', 'mx-auto');

      // 콘텐츠 레이아웃 컨테이너를 더 구체적으로 찾기
      const contentLayoutContainer = container.querySelector('div.flex.flex-col.lg\\:flex-row');
      expect(contentLayoutContainer).toBeInTheDocument();
      expect(contentLayoutContainer).toHaveClass(
        'flex-col',
        'lg:flex-row',
        'items-center',
        'lg:items-start',
      );
    });

    it('사이드바와 메인 콘텐츠 영역이 구분되어 있다', () => {
      const { container } = render(<BlogTemplate {...mockProps} />);

      // 사이드바 영역 확인
      const sidebarArea = container.querySelector('.lg\\:w-\\[246px\\]');
      expect(sidebarArea).toBeInTheDocument();

      // 메인 콘텐츠 영역 확인 (포스트 목록)
      const mainContent = container.querySelector('main');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent).toHaveClass('w-full', 'max-w-[768px]', 'lg:w-[768px]');
    });
  });

  describe('Props 전달', () => {
    it('header props가 BlogHeader에 전달된다', () => {
      const headerProps = {
        ...mockProps.header,
        searchValue: 'test search',
      };

      render(<BlogTemplate {...mockProps} header={headerProps} />);

      // 검색어가 표시되는지 확인
      expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
    });

    it('sidebar props가 BlogSidebar에 전달된다', () => {
      const sidebarProps = {
        ...mockProps.sidebar,
        selectedCategory: 'React',
        selectedTags: ['TypeScript'],
      };

      render(<BlogTemplate {...mockProps} sidebar={sidebarProps} />);

      // 선택된 카테고리가 표시되는지 확인 (카테고리 버튼에서)
      const selectedCategoryButton = screen.getByRole('button', {
        name: 'React',
        pressed: true,
      });
      expect(selectedCategoryButton).toBeInTheDocument();

      // 선택된 태그가 표시되는지 확인 (여러 개가 있을 수 있으므로 getAllByText 사용)
      const tagElements = screen.getAllByText('#TypeScript');
      expect(tagElements.length).toBeGreaterThan(0);
    });

    it('posts props가 BlogPosts에 전달된다', () => {
      const postsProps = {
        ...mockProps.posts,
        posts: [SAMPLE_POSTS[0]], // 하나의 포스트만
      };

      render(<BlogTemplate {...mockProps} posts={postsProps} />);

      // 첫 번째 포스트만 표시되는지 확인
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Post 2')).not.toBeInTheDocument();
    });
  });

  describe('사이드바 숨김', () => {
    it('isHidden=true인 경우 사이드바가 렌더링되지 않는다', () => {
      const sidebarProps = {
        ...mockProps.sidebar,
        isHidden: true,
      };

      render(<BlogTemplate {...mockProps} sidebar={sidebarProps} />);

      // 카테고리와 태그 제목이 표시되지 않는지 확인
      expect(screen.queryByText('카테고리')).not.toBeInTheDocument();
      expect(screen.queryByText('태그')).not.toBeInTheDocument();

      // 하지만 BlogHeader와 BlogPosts는 여전히 렌더링됨
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
  });

  describe('로딩 상태', () => {
    it('로딩 상태가 올바르게 전달된다', () => {
      const postsProps = {
        ...mockProps.posts,
        isLoading: true,
        posts: [],
      };

      render(<BlogTemplate {...mockProps} posts={postsProps} />);

      // 로딩 스켈레톤이 표시되는지 확인 (정렬 텍스트로 확인)
      expect(screen.getByText('정렬')).toBeInTheDocument();

      // 실제 포스트는 표시되지 않음
      expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument();
    });
  });

  describe('빈 상태', () => {
    it('포스트가 없을 때 빈 상태가 표시된다', () => {
      const postsProps = {
        ...mockProps.posts,
        posts: [],
        emptyMessage: '검색 결과가 없습니다.',
      };

      render(<BlogTemplate {...mockProps} posts={postsProps} />);

      // 빈 상태 메시지가 표시되는지 확인
      expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
    });
  });

  describe('커스텀 스타일', () => {
    it('추가 className이 적용된다', () => {
      const { container } = render(<BlogTemplate {...mockProps} className="custom-class" />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('custom-class');
    });
  });

  describe('반응형 레이아웃', () => {
    it('1024px 기준 반응형 클래스가 적용되어 있다', () => {
      const { container } = render(<BlogTemplate {...mockProps} />);

      // 플렉스 방향이 1024px 미만에서는 세로, 1024px 이상에서는 가로로 설정됨
      const layoutContainer = container.querySelector('div.flex.flex-col.lg\\:flex-row');
      expect(layoutContainer).toHaveClass(
        'flex-col',
        'lg:flex-row',
        'items-center',
        'lg:items-start',
      );

      // 사이드바가 1024px 미만에서는 최대 768px, 1024px 이상에서는 246px 고정
      const sidebarArea = container.querySelector('.w-full.max-w-\\[768px\\].lg\\:w-\\[246px\\]');
      expect(sidebarArea).toBeInTheDocument();

      // 포스트 영역이 1024px 미만에서는 최대 768px, 1024px 이상에서는 768px 고정
      const postsArea = container.querySelector('.w-full.max-w-\\[768px\\].lg\\:w-\\[768px\\]');
      expect(postsArea).toBeInTheDocument();
    });
  });
});
