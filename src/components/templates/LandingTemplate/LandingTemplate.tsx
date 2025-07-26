'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { LandingHero } from '@/components/sections/LandingHero';
import { RecentPosts, RecentPostsProps } from '@/components/sections/RecentPosts';
import { convertPostsToCards } from '@/utils/blog';
import { PostMeta } from '@/types/blog';

/**
 * LandingTemplate 컴포넌트 Props
 */
export interface LandingTemplateProps {
  /**
   * RecentPosts에 전달할 포스트 목록 (원본 PostMeta)
   */
  posts: PostMeta[];
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
  selectedCategory: initialSelectedCategory = '전체',
  showMoreButton = true,
  isLoading = false,
  emptyMessage = '포스트가 없습니다.',
  className = '',
  onCategoryClick: externalOnCategoryClick,
  onMoreButtonClick,
}: LandingTemplateProps) => {
  const router = useRouter();

  // 내부 상태로 선택된 카테고리 관리
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);

  // 카테고리별 필터링된 포스트 목록
  const filteredPosts = useMemo(() => {
    // 카테고리 필터링
    let filtered = posts;
    if (selectedCategory && selectedCategory !== '전체') {
      filtered = posts.filter(post => post.category.text === selectedCategory);
    }

    return convertPostsToCards(filtered);
  }, [posts, selectedCategory]);

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    externalOnCategoryClick?.(category);
  };

  // 더보기 버튼 클릭 핸들러 - 선택된 카테고리로 블로그 페이지 이동
  const handleMoreButtonClick = () => {
    const params = new URLSearchParams();

    // 선택된 카테고리가 '전체'가 아닌 경우만 파라미터 추가
    if (selectedCategory && selectedCategory !== '전체') {
      params.set('category', selectedCategory);
    }

    const blogURL = `/blog${params.toString() ? '?' + params.toString() : ''}`;
    router.push(blogURL);

    // 외부 핸들러도 호출
    onMoreButtonClick?.();
  };

  // 선택된 카테고리에 맞는 버튼 텍스트 생성
  const dynamicButtonText = useMemo(() => {
    if (selectedCategory === '전체') {
      return '전체 글 둘러보기';
    }
    return `${selectedCategory} 글 둘러보기`;
  }, [selectedCategory]);

  // RecentPosts props 구성
  const recentPostsProps: RecentPostsProps = {
    posts: filteredPosts,
    categories,
    selectedCategory,
    showMoreButton,
    moreButtonText: dynamicButtonText,
    isLoading,
    emptyMessage,
    onCategoryClick: handleCategoryClick,
    onMoreButtonClick: handleMoreButtonClick,
  };

  const containerStyles = 'min-h-screen max-w-[1024px] mx-auto my-20 px-5';

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
