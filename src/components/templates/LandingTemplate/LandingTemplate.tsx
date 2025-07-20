import React from 'react';

import { LandingHero } from '@/components/sections/LandingHero';
import { RecentPosts, RecentPostsProps } from '@/components/sections/RecentPosts';
import { PostCardProps } from '@/components/ui/blog/PostCard';

/**
 * LandingTemplate 컴포넌트 Props
 */
export interface LandingTemplateProps {
  /**
   * RecentPosts에 전달할 포스트 목록
   */
  posts: PostCardProps[];
  /**
   * RecentPosts에 전달할 카테고리 목록
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
 * LandingTemplate 컴포넌트
 * 메인 랜딩 페이지의 콘텐츠 레이아웃을 담당하는 template 컴포넌트
 * Figma 디자인에 따라 LandingHero, RecentPosts 순서로 구성
 * Header와 Footer는 layout.tsx에서 처리
 */
export const LandingTemplate = ({
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
}: LandingTemplateProps) => {
  // RecentPosts props 구성
  const recentPostsProps: RecentPostsProps = {
    posts,
    categories,
    selectedCategory,
    showMoreButton,
    moreButtonText,
    isLoading,
    emptyMessage,
    onCategoryClick,
    onMoreButtonClick,
  };

  const containerStyles = 'min-h-screen max-w-[1024px] mx-auto';

  return (
    <div className={`${containerStyles} ${className}`}>
      {/* Main Content */}
      <main className="flex-1">
        {/* Landing Hero Section */}
        <LandingHero className="w-full max-w-[1024px] mx-auto" />

        {/* Recent Posts Section */}
        <RecentPosts {...recentPostsProps} />
      </main>
    </div>
  );
};

export default LandingTemplate;
