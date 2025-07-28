import React, { forwardRef, HTMLAttributes } from 'react';

import { RelatedPostRow, type RelatedPostRowProps } from '@/components/ui/blog/RelatedPostRow';
import { PaginationBar } from '@/components/ui/pagination/PaginationBar';
import { Heading } from '@/components/ui/typography';
import { DEFAULT_POSTS_PER_PAGE } from '@/constants';

export interface RelatedPostsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * 관련 포스트 목록
   */
  posts: RelatedPostRowProps[];

  /**
   * 현재 포스트 ID (해당 포스트는 '현재' 표시됨)
   */
  currentPostId?: string;

  /**
   * 카테고리 이름 (제목에 "{category} 주제의 다른 글" 형태로 표시)
   */
  category: string;

  /**
   * 전체 포스트 개수 (제목에 "N개" 형태로 표시)
   */
  totalPostsCount?: number;

  /**
   * 페이지네이션 활성화 여부
   */
  enablePagination?: boolean;

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
   * 페이지당 포스트 수 (기본값: 5)
   */
  postsPerPage?: number;

  /**
   * 로딩 상태
   */
  isLoading?: boolean;

  /**
   * 빈 상태 메시지
   */
  emptyMessage?: string;

  /**
   * 제목 표시 여부
   */
  showTitle?: boolean;

  /**
   * 페이지네이션 크기
   */
  paginationSize?: 'sm' | 'md' | 'lg';
}

/**
 * RelatedPosts 컴포넌트
 * 관련 포스트 목록을 표시하는 organism 컴포넌트
 *
 * @example
 * ```tsx
 * <RelatedPosts
 *   posts={relatedPosts}
 *   currentPostId="current-post-id"
 *   enablePagination={true}
 *   currentPage={1}
 *   totalPages={3}
 *   onPageChange={(page) => console.log('Page changed to:', page)}
 * />
 * ```
 */
export const RelatedPosts = forwardRef<HTMLDivElement, RelatedPostsProps>(
  (
    {
      posts,
      currentPostId,
      category,
      totalPostsCount,
      enablePagination = false,
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      postsPerPage = DEFAULT_POSTS_PER_PAGE,
      isLoading = false,
      emptyMessage = '관련 포스트가 없습니다.',
      showTitle = true,
      paginationSize = 'md',
      className = '',
      ...props
    },
    ref,
  ) => {
    // 기본 컨테이너 스타일 - 1024px 고정 너비
    const containerStyles = 'mx-auto';

    // 동적 제목 생성
    const displayTitle = `${category} 주제의 다른 글`;

    // 페이지네이션이 활성화된 경우 현재 페이지의 포스트만 표시
    const displayPosts = enablePagination
      ? posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
      : posts;

    return (
      <div ref={ref} className={`${containerStyles} ${className}`} {...props}>
        {/* 제목과 총 개수 라벨 */}
        {showTitle && (
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <Heading level={3}>{displayTitle}</Heading>
              {totalPostsCount !== undefined && (
                <span className="ml-3 px-3 py-1 text-sm bg-[color:var(--color-secondary)] text-[color:var(--color-text)] rounded-full">
                  {totalPostsCount}개
                </span>
              )}
            </div>
            {/* 구분선 */}
            <div className="w-full h-px bg-[color:var(--color-secondary)]"></div>
          </div>
        )}

        {/* 콘텐츠 영역 - 상태별 조건부 렌더링 */}
        {isLoading ? (
          // 로딩 상태
          <div className="space-y-3">
            {Array.from({ length: postsPerPage }).map((_, index) => (
              <div
                key={index}
                className="h-[85px] bg-[color:var(--color-primary)] border border-[color:var(--color-secondary)] rounded-md animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          // 빈 상태
          <div className="flex items-center justify-center h-32 bg-[color:var(--color-primary)] border border-[color:var(--color-secondary)] rounded-md">
            <p className="text-[color:var(--color-text)] opacity-70">{emptyMessage}</p>
          </div>
        ) : (
          // 정상 상태 - 포스트 목록과 페이지네이션
          <>
            {/* 포스트 목록 */}
            <div className="space-y-3 mb-6">
              {displayPosts.map(post => (
                <RelatedPostRow
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  createdAt={post.createdAt}
                  href={post.href}
                  isCurrent={post.id === currentPostId}
                  className="w-full"
                />
              ))}
            </div>

            {/* 페이지네이션 */}
            {enablePagination && totalPages > 1 && onPageChange && (
              <div className="flex justify-center">
                <PaginationBar
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  size={paginationSize}
                  className="bg-transparent p-0"
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);

RelatedPosts.displayName = 'RelatedPosts';
