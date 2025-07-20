'use client';

import React from 'react';
import { ExtendedRecordMap } from 'notion-types';

import { PostHeader } from '@/components/ui/blog/PostHeader';
import { PostBody } from '@/components/ui/blog/PostBody';
import { PostNavigator } from '@/components/sections/PostNavigator';
import { PostMeta } from '@/types/blog';

/**
 * PostTemplate 컴포넌트 Props
 */
export interface PostTemplateProps {
  /**
   * 포스트 메타데이터 (제목, 설명, 날짜, 카테고리, 태그, 커버 이미지 등)
   */
  post: PostMeta;
  /**
   * Notion 페이지의 블록 데이터 (포스트 본문)
   */
  recordMap: ExtendedRecordMap;
  /**
   * 이전글 정보
   */
  prevPost?: {
    title: string;
    href: string;
  };
  /**
   * 다음글 정보
   */
  nextPost?: {
    title: string;
    href: string;
  };
  /**
   * 카테고리 클릭 이벤트 핸들러
   */
  onCategoryClick?: (category: string) => void;
  /**
   * 태그 클릭 이벤트 핸들러
   */
  onTagClick?: (tag: string) => void;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * PostTemplate 컴포넌트
 * 블로그 포스트 페이지의 전체 레이아웃을 담당하는 template 컴포넌트
 *
 * Figma 디자인에 따라 구성:
 * 1. PostHeader - 포스트 헤더 (썸네일, 카테고리, 제목, 날짜, 태그, 설명)
 * 2. PostBody - 포스트 본문 (Notion 콘텐츠)
 * 3. PostNavigator - 이전글/다음글 네비게이션
 *
 * 최대 크기: 1024px
 */
export const PostTemplate = ({
  post,
  recordMap,
  prevPost,
  nextPost,
  onCategoryClick,
  onTagClick,
  className = '',
}: PostTemplateProps) => {
  // 기본 컨테이너 스타일 - 1024px 고정 너비, 반응형 패딩
  const containerStyles = `
    w-full max-w-[1024px] mx-auto
  `;

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Main Content */}
      <main className="flex-1">
        <div className={containerStyles}>
          {/* Post Header Section */}
          <section className="mb-12">
            <PostHeader {...post} onCategoryClick={onCategoryClick} onTagClick={onTagClick} />
          </section>

          {/* Post Body Section */}
          <section className="mb-12">
            <PostBody recordMap={recordMap} postId={post.id} />
          </section>

          {/* Post Navigation Section */}
          {(prevPost ?? nextPost) && (
            <section className="mb-12">
              <PostNavigator prevPost={prevPost} nextPost={nextPost} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default PostTemplate;
