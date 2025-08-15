import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExtendedRecordMap } from 'notion-types';

import { PostTemplate } from './PostTemplate';

// Mock PostHeader 컴포넌트
vi.mock('@/components/ui/blog/PostHeader', () => ({
  PostHeader: ({
    title,
    onCategoryClick,
    onTagClick,
    ...props
  }: {
    title: string;
    onCategoryClick?: (category: string) => void;
    onTagClick?: (tag: string) => void;
    [key: string]: unknown;
  }) => (
    <div data-testid="post-header" data-props={JSON.stringify(props)}>
      <h1>{title}</h1>
      {onCategoryClick && (
        <button
          onClick={() => {
            onCategoryClick('test-category');
          }}
          data-testid="category-button"
        >
          Category
        </button>
      )}
      {onTagClick && (
        <button
          onClick={() => {
            onTagClick('test-tag');
          }}
          data-testid="tag-button"
        >
          Tag
        </button>
      )}
    </div>
  ),
}));

// Mock PostBody 컴포넌트
vi.mock('@/components/ui/blog/PostBody', () => ({
  PostBody: ({
    recordMap,
    postId,
    ...props
  }: {
    recordMap: ExtendedRecordMap;
    postId?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid="post-body" data-props={JSON.stringify({ recordMap, postId, ...props })}>
      Post Body Content
    </div>
  ),
}));

// Mock PostNavigator 컴포넌트
vi.mock('@/components/sections/PostNavigator', () => ({
  PostNavigator: ({
    prevPost,
    nextPost,
    ...props
  }: {
    prevPost?: { title: string; href: string };
    nextPost?: { title: string; href: string };
    [key: string]: unknown;
  }) => (
    <div data-testid="post-navigator" data-props={JSON.stringify({ prevPost, nextPost, ...props })}>
      {prevPost && <div data-testid="prev-post">{prevPost.title}</div>}
      {nextPost && <div data-testid="next-post">{nextPost.title}</div>}
    </div>
  ),
}));

// Mock RelatedPosts 컴포넌트
vi.mock('@/components/sections/RelatedPosts', () => ({
  RelatedPosts: ({
    posts,
    currentPostId,
    category,
    totalPostsCount,
    enablePagination,
    currentPage,
    totalPages,
    onPageChange,
    showTitle,
    ...props
  }: {
    posts: Array<{ id: string; title: string; createdAt: string; href: string }>;
    currentPostId?: string;
    category: string;
    totalPostsCount?: number;
    enablePagination?: boolean;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    showTitle?: boolean;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="related-posts"
      data-props={JSON.stringify({
        posts,
        currentPostId,
        category,
        totalPostsCount,
        enablePagination,
        currentPage,
        totalPages,
        showTitle,
        ...props,
      })}
    >
      <h2>Related Posts: {category}</h2>
      {posts.map(post => (
        <div key={post.id} data-testid={`related-post-${post.id}`}>
          {post.title}
        </div>
      ))}
      {enablePagination && onPageChange && (
        <button
          onClick={() => {
            onPageChange(2);
          }}
          data-testid="page-change-button"
        >
          Page 2
        </button>
      )}
    </div>
  ),
}));

// Mock PostComments 컴포넌트
vi.mock('@/components/sections/PostComments', () => ({
  PostComments: ({
    identifier,
    className,
    ...props
  }: {
    identifier?: string;
    className?: string;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="post-comments"
      data-props={JSON.stringify({ identifier, className, ...props })}
    >
      Comments Section
    </div>
  ),
}));

describe('PostTemplate', () => {
  const mockRecordMap: ExtendedRecordMap = {
    block: {
      'test-block': {
        role: 'reader',
        value: {
          id: 'test-block',
          type: 'text',
          properties: {
            title: [['Test content']],
          },
          content: [],
          format: {},
          created_time: Date.now(),
          last_edited_time: Date.now(),
          parent_id: 'test-page',
          parent_table: 'block',
          alive: true,
          space_id: 'test-space',
          version: 1,
          created_by_table: 'notion_user',
          created_by_id: 'test-user',
          last_edited_by_table: 'notion_user',
          last_edited_by_id: 'test-user',
        } as unknown,
      },
    },
    collection: {},
    collection_view: {},
    signed_urls: {},
    preview_images: {},
    notion_user: {},
    collection_query: {},
  } as unknown as ExtendedRecordMap;

  const defaultPost = {
    pageId: 'test-post-1',
    id: 1,
    slug: 'test-post-title',
    title: 'Test Post Title',
    description: 'Test post description',
    createdAt: 'Jan 22, 2025',
    category: {
      text: 'Frontend',
      color: 'blue' as const,
    },
    tags: ['React', 'TypeScript'],
    cover: '/test-image.jpg',
  };

  const defaultProps = {
    post: defaultPost,
    recordMap: mockRecordMap,
    prevPost: {
      title: 'Previous Post',
      href: '/posts/previous',
    },
    nextPost: {
      title: 'Next Post',
      href: '/posts/next',
    },
    relatedPosts: [
      {
        id: 1,
        title: 'Related Post 1',
        createdAt: 'Jan 20, 2025',
        href: '/posts/related-1',
      },
      {
        id: 2,
        title: 'Related Post 2',
        createdAt: 'Jan 18, 2025',
        href: '/posts/related-2',
      },
    ],
    showRelatedPosts: true,
  };

  describe('렌더링', () => {
    it('기본 props로 올바르게 렌더링된다', () => {
      render(<PostTemplate {...defaultProps} />);

      expect(screen.getByTestId('post-header')).toBeInTheDocument();
      expect(screen.getByTestId('post-body')).toBeInTheDocument();
      expect(screen.getByTestId('related-posts')).toBeInTheDocument();
      expect(screen.getByTestId('post-navigator')).toBeInTheDocument();
      expect(screen.getByTestId('post-comments')).toBeInTheDocument();
    });

    it('제목이 PostHeader에서 렌더링된다', () => {
      render(<PostTemplate {...defaultProps} />);

      expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    });

    it('PostBody에 올바른 props가 전달된다', () => {
      render(<PostTemplate {...defaultProps} />);

      const postBody = screen.getByTestId('post-body');
      const props = JSON.parse(postBody.getAttribute('data-props') ?? '{}');

      expect(props.recordMap).toBeDefined();
    });

    it('RelatedPosts에 올바른 props가 전달된다', () => {
      render(<PostTemplate {...defaultProps} />);

      const relatedPosts = screen.getByTestId('related-posts');
      const props = JSON.parse(relatedPosts.getAttribute('data-props') ?? '{}');

      expect(props.posts).toHaveLength(2);
      expect(props.currentPostId).toBe(1);
      expect(props.category).toBe('Frontend');
      expect(props.totalPostsCount).toBe(2);
      expect(props.showTitle).toBe(true);
    });

    it('PostNavigator에 올바른 props가 전달된다', () => {
      render(<PostTemplate {...defaultProps} />);

      const postNavigator = screen.getByTestId('post-navigator');
      const props = JSON.parse(postNavigator.getAttribute('data-props') ?? '{}');

      expect(props.prevPost.title).toBe('Previous Post');
      expect(props.nextPost.title).toBe('Next Post');
    });

    it('PostComments에 올바른 props가 전달된다', () => {
      render(<PostTemplate {...defaultProps} />);

      const postComments = screen.getByTestId('post-comments');
      const props = JSON.parse(postComments.getAttribute('data-props') ?? '{}');

      expect(props.identifier).toBe(1);
    });
  });

  describe('RelatedPosts 조건부 렌더링', () => {
    it('showRelatedPosts가 true이고 관련 포스트가 있을 때 RelatedPosts가 렌더링된다', () => {
      render(<PostTemplate {...defaultProps} />);

      expect(screen.getByTestId('related-posts')).toBeInTheDocument();
      expect(screen.getByText('Related Post 1')).toBeInTheDocument();
      expect(screen.getByText('Related Post 2')).toBeInTheDocument();
    });

    it('showRelatedPosts가 false일 때 RelatedPosts가 렌더링되지 않는다', () => {
      const props = {
        ...defaultProps,
        showRelatedPosts: false,
      };

      render(<PostTemplate {...props} />);

      expect(screen.queryByTestId('related-posts')).not.toBeInTheDocument();
    });

    it('관련 포스트가 비어있을 때 RelatedPosts가 렌더링되지 않는다', () => {
      const props = {
        ...defaultProps,
        relatedPosts: [],
      };

      render(<PostTemplate {...props} />);

      expect(screen.queryByTestId('related-posts')).not.toBeInTheDocument();
    });

    it('관련 포스트 페이지네이션이 활성화될 때 올바르게 작동한다', () => {
      const mockOnPageChange = vi.fn();
      const props = {
        ...defaultProps,
        enableRelatedPostsPagination: true,
        relatedPostsCurrentPage: 1,
        relatedPostsTotalPages: 3,
        onRelatedPostsPageChange: mockOnPageChange,
      };

      render(<PostTemplate {...props} />);

      const relatedPosts = screen.getByTestId('related-posts');
      const relatedProps = JSON.parse(relatedPosts.getAttribute('data-props') ?? '{}');

      expect(relatedProps.enablePagination).toBe(true);
      expect(relatedProps.currentPage).toBe(1);
      expect(relatedProps.totalPages).toBe(3);

      const pageChangeButton = screen.getByTestId('page-change-button');
      fireEvent.click(pageChangeButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe('네비게이션 조건부 렌더링', () => {
    it('이전글과 다음글이 모두 있을 때 PostNavigator가 렌더링된다', () => {
      render(<PostTemplate {...defaultProps} />);

      expect(screen.getByTestId('post-navigator')).toBeInTheDocument();
      expect(screen.getByTestId('prev-post')).toBeInTheDocument();
      expect(screen.getByTestId('next-post')).toBeInTheDocument();
    });

    it('이전글만 있을 때 PostNavigator가 렌더링된다', () => {
      const props = {
        ...defaultProps,
        nextPost: undefined,
      };

      render(<PostTemplate {...props} />);

      expect(screen.getByTestId('post-navigator')).toBeInTheDocument();
      expect(screen.getByTestId('prev-post')).toBeInTheDocument();
      expect(screen.queryByTestId('next-post')).not.toBeInTheDocument();
    });

    it('다음글만 있을 때 PostNavigator가 렌더링된다', () => {
      const props = {
        ...defaultProps,
        prevPost: undefined,
      };

      render(<PostTemplate {...props} />);

      expect(screen.getByTestId('post-navigator')).toBeInTheDocument();
      expect(screen.queryByTestId('prev-post')).not.toBeInTheDocument();
      expect(screen.getByTestId('next-post')).toBeInTheDocument();
    });

    it('이전글과 다음글이 모두 없을 때 PostNavigator가 렌더링되지 않는다', () => {
      const props = {
        ...defaultProps,
        prevPost: undefined,
        nextPost: undefined,
      };

      render(<PostTemplate {...props} />);

      expect(screen.queryByTestId('post-navigator')).not.toBeInTheDocument();
    });
  });

  describe('이벤트 핸들러', () => {
    it('카테고리 클릭 이벤트가 올바르게 전달된다', () => {
      const mockOnCategoryClick = vi.fn();
      const props = {
        ...defaultProps,
        onCategoryClick: mockOnCategoryClick,
      };

      render(<PostTemplate {...props} />);

      const categoryButton = screen.getByTestId('category-button');
      fireEvent.click(categoryButton);

      expect(mockOnCategoryClick).toHaveBeenCalledWith('test-category');
    });

    it('태그 클릭 이벤트가 올바르게 전달된다', () => {
      const mockOnTagClick = vi.fn();
      const props = {
        ...defaultProps,
        onTagClick: mockOnTagClick,
      };

      render(<PostTemplate {...props} />);

      const tagButton = screen.getByTestId('tag-button');
      fireEvent.click(tagButton);

      expect(mockOnTagClick).toHaveBeenCalledWith('test-tag');
    });
  });

  describe('스타일링', () => {
    it('기본 컨테이너 스타일이 적용된다', () => {
      const { container } = render(<PostTemplate {...defaultProps} />);

      const contentContainer = container.querySelector('div');
      expect(contentContainer).toHaveClass('w-full', 'max-w-[1024px]', 'mx-auto', 'my-20', 'px-3');

      const mainElement = container.querySelector('main');
      expect(mainElement).toHaveClass('flex-1');
    });

    it('커스텀 className이 적용된다', () => {
      const { container } = render(<PostTemplate {...defaultProps} className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });

    // it('반응형 패딩이 적용된다', () => {
    //   const { container } = render(<PostTemplate {...defaultProps} />);

    //   const contentContainer = container.querySelector('main > div');
    //   expect(contentContainer).toHaveClass('px-4', 'md:px-8');
    // });
  });

  describe('섹션 구조', () => {
    it('PostBody 섹션이 올바른 마진을 가진다', () => {
      const { container } = render(<PostTemplate {...defaultProps} />);

      // PostBody는 이제 3번째 섹션 (header, toc-mobile, body)
      const bodySection = container.querySelector('section:nth-of-type(3)');
      expect(bodySection).toHaveClass('mb-12');
    });

    it('RelatedPosts 섹션이 올바른 마진을 가진다', () => {
      const { container } = render(<PostTemplate {...defaultProps} />);

      const relatedSection = container.querySelector('section:nth-of-type(3)');
      expect(relatedSection).toHaveClass('mb-12');
    });
  });

  describe('접근성', () => {
    it('메인 콘텐츠가 main 태그로 구성된다', () => {
      render(<PostTemplate {...defaultProps} />);

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });

    it('각 섹션이 section 태그로 구성된다', () => {
      const { container } = render(<PostTemplate {...defaultProps} />);

      const sections = container.querySelectorAll('section');
      expect(sections).toHaveLength(5); // header, body, navigator, related-posts, comments
    });

    it('관련 포스트가 없을 때는 4개의 섹션만 렌더링된다', () => {
      const props = {
        ...defaultProps,
        relatedPosts: [],
      };
      const { container } = render(<PostTemplate {...props} />);

      const sections = container.querySelectorAll('section');
      expect(sections).toHaveLength(4); // header, body, navigator, comments
    });

    it('네비게이션도 없을 때는 3개의 섹션만 렌더링된다', () => {
      const props = {
        ...defaultProps,
        relatedPosts: [],
        prevPost: undefined,
        nextPost: undefined,
      };
      const { container } = render(<PostTemplate {...props} />);

      const sections = container.querySelectorAll('section');
      expect(sections).toHaveLength(3); // header, body, comments
    });
  });

  describe('에지 케이스', () => {
    it('빈 recordMap으로도 렌더링된다', () => {
      const emptyRecordMap = {
        block: {},
        collection: {},
        collection_view: {},
        signed_urls: {},
        preview_images: {},
        notion_user: {},
        collection_query: {},
      } as ExtendedRecordMap;

      const props = {
        ...defaultProps,
        recordMap: emptyRecordMap,
      };

      expect(() => render(<PostTemplate {...props} />)).not.toThrow();
    });

    it('최소한의 post 정보로도 렌더링된다', () => {
      const minimalPost = {
        pageId: 'minimal-post',
        id: 2,
        slug: 'minimal-post',
        title: 'Minimal Post',
        description: '',
        createdAt: 'Jan 22, 2025',
        tags: [],
        category: {
          text: 'General',
          color: 'gray' as const,
        },
      };

      const props = {
        ...defaultProps,
        post: minimalPost,
      };

      expect(() => render(<PostTemplate {...props} />)).not.toThrow();
    });

    it('관련 포스트가 undefined일 때도 렌더링된다', () => {
      const props = {
        ...defaultProps,
        relatedPosts: undefined,
      };

      expect(() => render(<PostTemplate {...props} />)).not.toThrow();
      expect(screen.queryByTestId('related-posts')).not.toBeInTheDocument();
    });

    it('관련 포스트 페이지네이션 핸들러가 없어도 렌더링된다', () => {
      const props = {
        ...defaultProps,
        enableRelatedPostsPagination: true,
        onRelatedPostsPageChange: undefined,
      };

      expect(() => render(<PostTemplate {...props} />)).not.toThrow();
    });
  });
});
