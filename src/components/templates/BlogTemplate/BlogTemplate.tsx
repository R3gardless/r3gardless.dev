'use client';

import React from 'react';

import { BlogHeader, BlogHeaderProps } from '@/components/sections/BlogHeader';
import { BlogSidebar, BlogSidebarProps } from '@/components/sections/BlogSidebar';
import { BlogPosts, BlogPostsProps } from '@/components/sections/BlogPosts';

export interface BlogTemplateProps {
  /**
   * BlogHeader 관련 props
   */
  header: BlogHeaderProps;

  /**
   * BlogSidebar 관련 props
   */
  sidebar: BlogSidebarProps;

  /**
   * BlogPosts 관련 props
   */
  posts: BlogPostsProps;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * BlogTemplate 컴포넌트
 *
 * 블로그 목록 페이지의 전체 레이아웃을 담당하는 template 컴포넌트
 * - 상단: BlogHeader (전체 1024px 너비)
 * - 하단 좌측: BlogSidebar (246px 너비)
 * - 하단 우측: BlogPosts (768px 너비)
 * - 반응형 레이아웃: 1024px 미만에서는 중앙 정렬된 세로 배치 (최대 768px)
 */
export const BlogTemplate: React.FC<BlogTemplateProps> = ({
  header,
  sidebar,
  posts,
  className = '',
}) => {
  // 기본 컨테이너 스타일 - 1024px 고정 너비 (Figma 디자인 기준)
  const containerStyles = 'w-full max-w-[1024px] mx-auto my-20 px-3';

  // 헤더 스타일 - 전체 너비
  const headerStyles = 'w-full mb-8 lg:mb-12';

  // 콘텐츠 레이아웃 스타일 - 사이드바(왼쪽) + 포스트(오른쪽)
  // 반응형에서는 중앙 정렬로 세로 배치
  const contentLayoutStyles = 'flex flex-col lg:flex-row items-center lg:items-start gap-[10px]';

  // 사이드바 스타일 - 고정 너비 (Figma 디자인 기준 246px)
  const sidebarStyles = 'w-full max-w-[768px] lg:w-[246px] lg:max-w-none flex-shrink-0';

  // 포스트 영역 스타일 - 768px 너비 (246px + 768px = 1014px, gap 10px = 1024px)
  // 반응형에서는 최대 768px로 제한
  const postsStyles = 'w-full max-w-[768px] lg:flex-none lg:w-[768px] lg:max-w-none min-w-0';

  return (
    <div className={`${containerStyles} ${className}`}>
      {/* 상단: 블로그 헤더 (전체 너비) */}
      <header className={headerStyles}>
        <BlogHeader {...header} />
      </header>

      {/* 하단: 사이드바 + 포스트 목록 */}
      <div className={contentLayoutStyles}>
        {/* 왼쪽: 사이드바 (246px) */}
        <aside className={sidebarStyles}>
          <BlogSidebar {...sidebar} />
        </aside>

        {/* 오른쪽: 포스트 목록 (768px) */}
        <main className={postsStyles}>
          <BlogPosts {...posts} />
        </main>
      </div>
    </div>
  );
};

export default BlogTemplate;
