import React, { forwardRef, HTMLAttributes } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

import { BlogPostRow, BlogPostRowProps } from '@/components/ui/molecules/BlogPostRow';
import { PaginationBar } from '@/components/ui/molecules/PaginationBar';

// BlogPostRowProps를 재사용하여 타입 일관성 유지
export type BlogPostRowListItem = BlogPostRowProps;

export type SortOption = 'id';
export type SortDirection = 'asc' | 'desc';

export interface BlogPostRowListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * 블로그 포스트 목록
   */
  posts: BlogPostRowListItem[];

  /**
   * 현재 페이지 번호 (1부터 시작)
   */
  currentPage?: number;

  /**
   * 전체 페이지 수
   */
  totalPages?: number;

  /**
   * 페이지 변경 시 호출되는 콜백 함수
   */
  onPageChange?: (page: number) => void;

  /**
   * 표시할 페이지 번호의 최대 개수
   */
  maxPageNumbers?: number;

  /**
   * 로딩 상태
   */
  isLoading?: boolean;

  /**
   * 빈 상태 메시지
   */
  emptyMessage?: string;

  /**
   * 페이지네이션 비활성화 여부
   */
  paginationDisabled?: boolean;

  /**
   * 정렬 옵션 표시 여부
   */
  showSort?: boolean;

  /**
   * 현재 정렬 옵션
   */
  sortBy?: SortOption;

  /**
   * 정렬 방향
   */
  sortDirection?: SortDirection;

  /**
   * 정렬 변경 핸들러
   */
  onSortChange?: (sortBy: SortOption, direction: SortDirection) => void;

  /**
   * 카테고리 클릭 핸들러
   */
  onCategoryClick?: (category: string) => void;

  /**
   * 태그 클릭 핸들러
   */
  onTagClick?: (tag: string) => void;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * BlogPostRowList 컴포넌트
 * 블로그 포스트 목록을 행 형태로 표시하고 페이지네이션을 제공하는 organism 컴포넌트
 */
export const BlogPostRowList = forwardRef<HTMLDivElement, BlogPostRowListProps>(
  (
    {
      posts,
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      maxPageNumbers = 6,
      isLoading = false,
      emptyMessage = '포스트가 없습니다.',
      paginationDisabled = false,
      showSort = true,
      sortDirection = 'desc',
      onSortChange,
      onCategoryClick,
      onTagClick,
      className = '',
      ...props
    },
    ref,
  ) => {
    // 기본 스타일 클래스들
    const containerClasses = ['w-full max-w-4xl mx-auto', 'transition-colors duration-200']
      .filter(Boolean)
      .join(' ');

    const listContainerClasses = ['relative', 'transition-colors duration-200']
      .filter(Boolean)
      .join(' ');

    // 로딩 상태 렌더링
    if (isLoading) {
      return (
        <div ref={ref} className={`${containerClasses} ${className}`} {...props}>
          {/* 정렬 옵션 */}
          {showSort && (
            <div className="flex items-center gap-2 mb-4 px-2">
              <span className="text-[color:var(--color-text)] font-pretendard font-bold text-sm">
                정렬
              </span>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-[color:var(--color-secondary)] rounded animate-pulse" />
                <div className="w-6 h-6 bg-[color:var(--color-secondary)] rounded animate-pulse" />
              </div>
            </div>
          )}

          {/* 로딩 스켈레톤 */}
          <div className={listContainerClasses}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row w-full border-b border-[color:var(--color-secondary)] py-8 px-6 animate-pulse"
              >
                <div className="flex-1 space-y-3 md:space-y-4">
                  <div className="w-20 h-6 bg-[color:var(--color-secondary)] rounded-full" />
                  <div className="w-3/4 h-6 bg-[color:var(--color-secondary)] rounded" />
                  <div className="w-1/4 h-4 bg-[color:var(--color-secondary)] rounded" />
                  <div className="w-full h-8 bg-[color:var(--color-secondary)] rounded" />
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-[color:var(--color-secondary)] rounded-full" />
                    <div className="w-16 h-6 bg-[color:var(--color-secondary)] rounded-full" />
                    <div className="w-16 h-6 bg-[color:var(--color-secondary)] rounded-full" />
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                  <div className="w-full md:w-[300px] h-[180px] bg-[color:var(--color-secondary)] rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 빈 상태 렌더링
    if (!posts || posts.length === 0) {
      return (
        <div ref={ref} className={`${containerClasses} ${className}`} {...props}>
          {/* 정렬 옵션 */}
          {showSort && (
            <div className="flex items-center gap-2 mb-4 px-2">
              <span className="text-[color:var(--color-text)] font-pretendard font-bold text-sm">
                정렬
              </span>
              <div className="flex items-center">
                {/* 오름차순 버튼 */}
                <button
                  onClick={() => onSortChange?.('id', 'asc')}
                  className={`p-1 rounded transition-colors focus:outline-none focus-visible:outline-none ${
                    sortDirection === 'asc'
                      ? 'pointer-events-none opacity-50 cursor-not-allowed'
                      : 'hover:bg-[color:var(--color-primary)] cursor-pointer'
                  }`}
                  disabled={sortDirection === 'asc'}
                  aria-label="오름차순 정렬"
                  aria-pressed={sortDirection === 'asc'}
                >
                  <ChevronUp className="size-4 text-[color:var(--color-text)]" />
                </button>
                {/* 내림차순 버튼 */}
                <button
                  onClick={() => onSortChange?.('id', 'desc')}
                  className={`p-1 rounded transition-colors focus:outline-none focus-visible:outline-none ${
                    sortDirection === 'desc'
                      ? 'pointer-events-none opacity-50 cursor-not-allowed'
                      : 'hover:bg-[color:var(--color-primary)] cursor-pointer'
                  }`}
                  disabled={sortDirection === 'desc'}
                  aria-label="내림차순 정렬"
                  aria-pressed={sortDirection === 'desc'}
                >
                  <ChevronDown className="size-4 text-[color:var(--color-text)]" />
                </button>
              </div>
            </div>
          )}

          {/* 빈 상태 */}
          <div className={`${listContainerClasses} flex items-center justify-center py-16`}>
            <div className="text-center">
              <div className="text-[color:var(--color-text)] opacity-60 text-lg font-medium mb-2">
                📝
              </div>
              <div className="text-[color:var(--color-text)] opacity-60">{emptyMessage}</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={`${containerClasses} ${className}`} {...props}>
        {/* 정렬 옵션 */}
        {showSort && (
          <div className="flex items-center gap-2 mb-4 px-2">
            <span className="text-[color:var(--color-text)] font-pretendard font-bold text-sm">
              정렬
            </span>
            <div className="flex items-center">
              {/* 오름차순 버튼 */}
              <button
                onClick={() => onSortChange?.('id', 'asc')}
                className={`p-1 rounded transition-colors focus:outline-none focus-visible:outline-none ${
                  sortDirection === 'asc'
                    ? 'pointer-events-none opacity-50 cursor-not-allowed'
                    : 'hover:bg-[color:var(--color-primary)] cursor-pointer'
                }`}
                disabled={sortDirection === 'asc'}
                aria-label="오름차순 정렬"
                aria-pressed={sortDirection === 'asc'}
              >
                <ChevronUp className="size-4 text-[color:var(--color-text)]" />
              </button>
              {/* 내림차순 버튼 */}
              <button
                onClick={() => onSortChange?.('id', 'desc')}
                className={`p-1 rounded transition-colors focus:outline-none focus-visible:outline-none ${
                  sortDirection === 'desc'
                    ? 'pointer-events-none opacity-50 cursor-not-allowed'
                    : 'hover:bg-[color:var(--color-primary)] cursor-pointer'
                }`}
                disabled={sortDirection === 'desc'}
                aria-label="내림차순 정렬"
                aria-pressed={sortDirection === 'desc'}
              >
                <ChevronDown className="size-4 text-[color:var(--color-text)]" />
              </button>
            </div>
          </div>
        )}

        {/* 포스트 목록 */}
        <div className={listContainerClasses}>
          {posts.map((post, index) => (
            <BlogPostRow
              key={post.id}
              {...post}
              onCategoryClick={onCategoryClick}
              onTagClick={onTagClick}
              className={`
                ${index === posts.length - 1 ? '' : 'border-b border-[color:var(--color-secondary)]'}
                hover:bg-[color:var(--color-primary)]
                transition-colors duration-200
              `}
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && onPageChange && (
          <div className="mt-8 flex justify-center">
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              maxPageNumbers={maxPageNumbers}
              disabled={paginationDisabled}
              size="md"
              className="bg-[color:var(--color-background)]"
            />
          </div>
        )}
      </div>
    );
  },
);

BlogPostRowList.displayName = 'BlogPostRowList';

export default BlogPostRowList;
