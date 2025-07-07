import React from 'react';

import { PostCard, PostCardProps } from '@/components/ui/blog/PostCard';
import { CategoryHorizontalList } from '@/components/ui/blog/CategoryHorizontalList';
import { LoadMoreButton } from '@/components/ui/buttons/LoadMoreButton';
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
  const containerStyles = 'w-full max-w-[1024px] mx-auto px-4 md:px-0';

  // 테마에 따른 배경 스타일
  const backgroundStyles = 'bg-[color:var(--color-background)]';

  <Heading level={1} fontFamily="maruBuri" className="text-3xl">
    Recent Posts
  </Heading>;

  // 로딩 스켈레톤 렌더링
  if (isLoading) {
    return (
      <div className={`${containerStyles} ${backgroundStyles} ${className}`}>
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

        {/* 포스트 카드 스켈레톤 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[color:var(--color-secondary)] animate-pulse"
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
        </div>

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
      <div className={`${containerStyles} ${backgroundStyles} ${className}`}>
        {/* 카테고리 목록 */}
        {categories.length > 0 && (
          <div className="mb-8">
            <CategoryHorizontalList
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

  return (
    <div className={`${containerStyles} ${backgroundStyles} ${className}`}>
      {/* 카테고리 가로 목록 */}
      {categories && categories.length > 0 && (
        <div className="mb-8">
          <CategoryHorizontalList
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={onCategoryClick}
          />
        </div>
      )}

      {/* 블로그 포스트 카드 그리드 */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 
                     animate-fade-in-up [animation-delay:0.3s]"
      >
        {posts.map((post, index) => (
          <PostCard
            key={post.id || index}
            {...post}
            className={`mx-auto animate-fade-in-up [animation-delay:${0.1 * (index % 9)}s]`}
          />
        ))}
      </div>

      {/* 더보기 버튼 */}
      {showMoreButton && (
        <div className="flex justify-center animate-fade-in [animation-delay:0.5s]">
          <LoadMoreButton
            text={moreButtonText}
            onClick={onMoreButtonClick}
            className="px-6 py-3 bg-[color:var(--color-secondary)] hover:bg-[color:var(--color-primary)] 
                     text-[color:var(--color-text)] font-bold text-sm rounded-lg transition-all duration-300 
                     shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] 
                     dark:shadow-[0px_4px_4px_0px_rgba(255,255,255,0.25)]
                     hover:scale-105 hover:shadow-lg transform"
          />
        </div>
      )}
    </div>
  );
};

export default RecentPosts;
