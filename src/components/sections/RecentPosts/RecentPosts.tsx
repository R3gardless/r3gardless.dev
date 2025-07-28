'use client';

import React from 'react';
import Masonry from 'react-masonry-css';

import { PostCard, PostCardProps } from '@/components/ui/blog/PostCard';
import { CategoryList } from '@/components/ui/blog/CategoryList';
import { ExploreButton } from '@/components/ui/buttons/ExploreButton';
import { Heading } from '@/components/ui/typography';
/**
 * RecentPosts 컴포넌트 Props
 */
export interface RecentPostsProps {
  /**
   * 블로그 포스트 카드 목록
   */
  posts: PostCardProps[];
  /**
   * 카테고리 목록
   */
  categories: string[];
  /**
   * 선택된 카테고리
   */
  selectedCategory?: string;
  /**
   * 더보기 버튼 표시 여부
   */
  showMoreButton?: boolean;
  /**
   * 더보기 버튼 텍스트
   */
  moreButtonText?: string;
  /**
   * 로딩 상태
   */
  isLoading?: boolean;
  /**
   * 빈 상태 메시지
   */
  emptyMessage?: string;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
  /**
   * 카테고리 클릭 이벤트 핸들러
   */
  onCategoryClick?: (category: string) => void;
  /**
   * 더보기 버튼 클릭 이벤트 핸들러
   */
  onMoreButtonClick?: () => void;
}

/**
 * RecentPosts 컴포넌트
 * 카테고리 가로 목록과 블로그 포스트 카드들을 그리드 형태로 표시하는 organism 컴포넌트
 * Figma 디자인에 맞춰 3열 그리드 레이아웃으로 구성
 */
export const RecentPosts = ({
  posts,
  categories,
  selectedCategory,
  showMoreButton = true,
  moreButtonText = '둘러보기',
  isLoading = false,
  emptyMessage = '포스트가 없습니다.',
  className = '',
  onCategoryClick,
  onMoreButtonClick,
}: RecentPostsProps) => {
  // 기본 컨테이너 스타일 - 1024px 고정 너비
  const containerStyles = 'mx-auto mb-20';

  // Masonry breakpoints 설정 - react-masonry-css 방식
  const breakpointColumnsObj = {
    default: 3, // 1024px 이상: 3열
    1024: 2, // 1023px 이하: 2열 (Tailwind lg breakpoint 직전)
    768: 1, // 767px 이하: 1열 (Tailwind md breakpoint 직전)
  };

  // 로딩 스켈레톤 렌더링
  if (isLoading) {
    return (
      <div className={`${containerStyles} ${className}`}>
        {/* 제목 */}
        <div className="mb-8">
          <Heading level={1} fontFamily="maruBuri" className="text-3xl">
            Recent Posts
          </Heading>
        </div>

        {/* 카테고리 스켈레톤 */}
        <div className="mb-6">
          <div className="flex items-center gap-4 overflow-x-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-8 bg-[color:var(--color-secondary)] rounded-full flex-shrink-0"
                style={{
                  width: `${60 + Math.random() * 40}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* 포스트 카드 Masonry 스켈레톤 */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid mb-8"
          columnClassName="masonry-grid_column"
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="mb-6 rounded-2xl bg-[color:var(--color-secondary)] animate-pulse"
            >
              {/* 이미지 스켈레톤 */}
              <div className="w-full h-[200px] bg-[color:var(--color-primary)] rounded-t-2xl" />

              {/* 내용 스켈레톤 */}
              <div className="p-4 space-y-3">
                <div className="h-6 bg-[color:var(--color-primary)] rounded w-3/4" />
                <div className="h-4 bg-[color:var(--color-primary)] rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-4 bg-[color:var(--color-primary)] rounded w-full" />
                  <div className="h-4 bg-[color:var(--color-primary)] rounded w-2/3" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-[color:var(--color-primary)] rounded-full w-16" />
                  <div className="h-6 bg-[color:var(--color-primary)] rounded-full w-16" />
                  <div className="h-6 bg-[color:var(--color-primary)] rounded-full w-16" />
                </div>
              </div>
            </div>
          ))}
        </Masonry>

        {/* 더보기 버튼 스켈레톤 */}
        {showMoreButton && (
          <div className="flex justify-center mt-8">
            <div className="h-8 w-20 bg-[color:var(--color-secondary)] rounded" />
          </div>
        )}
      </div>
    );
  }

  // 빈 상태 렌더링
  if (posts.length === 0) {
    return (
      <div className={`${containerStyles} ${className}`}>
        {/* 제목 */}
        <div className="mb-8">
          <Heading level={1} fontFamily="maruBuri" className="text-3xl">
            Recent Posts
          </Heading>
        </div>

        {/* 카테고리 목록 */}
        {categories.length > 0 && (
          <div className="mb-8">
            <CategoryList
              variant="horizontal"
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryClick={onCategoryClick}
            />
          </div>
        )}

        {/* 빈 상태 메시지 */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4 opacity-20">📝</div>
          <p className="text-[color:var(--color-text)] text-lg font-medium mb-2">{emptyMessage}</p>
          <p className="text-[color:var(--color-text-secondary)] text-sm">
            다른 카테고리를 선택해보세요.
          </p>
        </div>
      </div>
    );
  }

  // 포스트를 createdAt 기준으로 내림차순 정렬하고 최대 9개까지만 표시
  const displayPosts = posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 9);

  return (
    <div className={`${containerStyles} ${className}`}>
      {/* 제목 */}
      <div className="mb-3">
        <Heading level={1} fontFamily="maruBuri" className="text-3xl">
          Recent Posts
        </Heading>
      </div>

      {/* 카테고리 가로 목록 */}
      {categories.length > 0 && (
        <div className="mb-8">
          <CategoryList
            variant="horizontal"
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={onCategoryClick}
          />
        </div>
      )}

      {/* 블로그 포스트 카드 Masonry 그리드 */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid mb-8 animate-fade-in-up [animation-delay:0.3s]"
        columnClassName="masonry-grid_column"
      >
        {displayPosts.map((post, index) => (
          <div
            key={post.id}
            className={`mb-6 animate-fade-in-up [animation-delay:${0.1 * (index % 9)}s]`}
          >
            <PostCard {...post} />
          </div>
        ))}
      </Masonry>

      {/* 더보기 버튼 */}
      {showMoreButton && (
        <div className="flex justify-center animate-fade-in [animation-delay:0.5s]">
          <ExploreButton text={moreButtonText} onClick={onMoreButtonClick} />
        </div>
      )}
    </div>
  );
};

export default RecentPosts;
