'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';

import { LandingHero } from '@/components/sections/LandingHero';
import { RecentPosts, RecentPostsProps } from '@/components/sections/RecentPosts';
import { PostCardProps } from '@/components/ui/blog/PostCard';
import { ALL_POSTS_CATEGORY } from '@/constants/blog';
import { getExplorePostsLabel } from '@/constants/i18n';
import { DEFAULT_POST_LANG, PostMeta } from '@/types/blog';
import type { PostLang } from '@/types/blog';
import { blogLangPathPrefix, convertPostsForRendering, isAllPostsCategory } from '@/utils/blog';

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
   * 콘텐츠 언어. en/ja이면 포스트 링크와 더보기 경로가 언어 라우트를 사용합니다.
   * @default 'kr'
   */
  lang?: PostLang;
  /**
   * 더보기 버튼 표시 여부
   */
  showMoreButton?: boolean;
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
  selectedCategory: initialSelectedCategory = ALL_POSTS_CATEGORY,
  lang = DEFAULT_POST_LANG,
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
    if (!isAllPostsCategory(selectedCategory)) {
      filtered = posts.filter(post => post.category.text === selectedCategory);
    }

    return convertPostsForRendering<PostCardProps>(filtered, lang);
  }, [posts, selectedCategory, lang]);

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    externalOnCategoryClick?.(category);
  };

  // 더보기 버튼 클릭 핸들러 - 선택된 카테고리로 블로그 페이지 이동
  const handleMoreButtonClick = () => {
    const params = new URLSearchParams();

    // 선택된 카테고리가 '전체'가 아닌 경우만 파라미터 추가
    if (!isAllPostsCategory(selectedCategory)) {
      params.set('category', selectedCategory);
    }

    const blogURL = `${blogLangPathPrefix(lang)}/blog${params.toString() ? `?${params}` : ''}`;
    router.push(blogURL);

    // 외부 핸들러도 호출
    onMoreButtonClick?.();
  };

  // "둘러보기" 버튼 텍스트 (언어와 무관하게 항상 영어)
  const dynamicButtonText = useMemo(
    () => getExplorePostsLabel(selectedCategory),
    [selectedCategory],
  );

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

  const containerStyles = 'min-h-screen max-w-[1024px] mx-auto my-20 px-3';

  return (
    <div className={`${containerStyles} ${className}`}>
      {/* Main Content */}
      <main className="flex-1">
        {/* Landing Hero Section */}
        <LandingHero className="w-full max-w-[1024px] mx-auto" />

        {/* Recent Posts Section */}
        <RecentPosts {...recentPostsProps} lang={lang} />
      </main>
    </div>
  );
};

export default LandingTemplate;
