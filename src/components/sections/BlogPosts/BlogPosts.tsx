import { ChevronUp, ChevronDown } from 'lucide-react';
import React, { forwardRef, HTMLAttributes } from 'react';

import { PostRow, PostRowProps } from '@/components/ui/blog/PostRow';
import { PaginationBar } from '@/components/ui/pagination/PaginationBar';

export type SortOption = 'id';
export type SortDirection = 'asc' | 'desc';

const CONTAINER_STYLES = 'w-full max-w-4xl mx-auto transition-colors duration-200';
const LIST_CONTAINER_STYLES = 'relative transition-colors duration-200';
const BLOG_POSTS_SKELETON_COUNT = 5;
const SORT_OPTIONS: Array<{
  direction: SortDirection;
  label: string;
  Icon: typeof ChevronUp;
}> = [
  {
    direction: 'asc',
    label: '오름차순 정렬',
    Icon: ChevronUp,
  },
  {
    direction: 'desc',
    label: '내림차순 정렬',
    Icon: ChevronDown,
  },
];

export interface BlogPostsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * 블로그 포스트 목록
   */
  posts: PostRowProps[];

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

interface SortControlsProps {
  sortDirection: SortDirection;
  onSortChange?: (sortBy: SortOption, direction: SortDirection) => void;
}

function SortControls({ sortDirection, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center gap-2 mb-4 px-2">
      <span className="text-[color:var(--color-text)] font-pretendard font-bold text-sm">정렬</span>
      <div className="flex items-center">
        {SORT_OPTIONS.map(({ direction, label, Icon }) => {
          const isSelected = sortDirection === direction;

          return (
            <button
              key={direction}
              onClick={() => {
                onSortChange?.('id', direction);
              }}
              className={`p-1 rounded transition-colors focus:outline-none focus-visible:outline-none ${
                isSelected
                  ? 'pointer-events-none opacity-50 cursor-not-allowed'
                  : 'hover:bg-[color:var(--color-primary)] cursor-pointer'
              }`}
              disabled={isSelected}
              aria-label={label}
              aria-pressed={isSelected}
            >
              <Icon className="size-4 text-[color:var(--color-text)]" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * BlogPosts 컴포넌트
 * 블로그 포스트 목록을 행 형태로 표시하고 페이지네이션을 제공하는 organism 컴포넌트
 */
export const BlogPosts = forwardRef<HTMLDivElement, BlogPostsProps>(
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
    // 로딩 상태 렌더링
    if (isLoading) {
      return (
        <div ref={ref} className={`${CONTAINER_STYLES} ${className}`} {...props}>
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
          <div className={LIST_CONTAINER_STYLES}>
            {Array.from({ length: BLOG_POSTS_SKELETON_COUNT }).map((_, index) => (
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
    if (posts.length === 0) {
      return (
        <div ref={ref} className={`${CONTAINER_STYLES} ${className}`} {...props}>
          {/* 정렬 옵션 */}
          {showSort && <SortControls sortDirection={sortDirection} onSortChange={onSortChange} />}

          {/* 빈 상태 */}
          <div className={`${LIST_CONTAINER_STYLES} flex items-center justify-center py-16`}>
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
      <div ref={ref} className={`${CONTAINER_STYLES} ${className}`} {...props}>
        {/* 정렬 옵션 */}
        {showSort && <SortControls sortDirection={sortDirection} onSortChange={onSortChange} />}

        {/* 포스트 목록 */}
        <div className={LIST_CONTAINER_STYLES}>
          {posts.map((post, index) => (
            <PostRow
              key={`${sortDirection}-${post.id}-${index}`}
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
            />
          </div>
        )}
      </div>
    );
  },
);

BlogPosts.displayName = 'BlogPosts';

export default BlogPosts;
