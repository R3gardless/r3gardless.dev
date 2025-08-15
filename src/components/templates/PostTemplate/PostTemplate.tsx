'use client';

import React from 'react';
import { ExtendedRecordMap } from 'notion-types';

import { PostHeader } from '@/components/ui/blog/PostHeader';
import { PostBody } from '@/components/ui/blog/PostBody';
import { TableOfContents } from '@/components/ui/blog/TableOfContents';
import { PostNavigator } from '@/components/sections/PostNavigator';
import { RelatedPosts, type RelatedPostsProps } from '@/components/sections/RelatedPosts';
import { PostComments } from '@/components/sections/PostComments';
import { PostMeta, TableOfContentsItem } from '@/types/blog';

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
   * 관련 포스트 목록
   */
  relatedPosts?: RelatedPostsProps['posts'];
  /**
   * 관련 포스트 섹션 표시 여부
   */
  showRelatedPosts?: boolean;
  /**
   * 관련 포스트 페이지네이션 활성화 여부
   */
  enableRelatedPostsPagination?: boolean;
  /**
   * 관련 포스트 현재 페이지
   */
  relatedPostsCurrentPage?: number;
  /**
   * 관련 포스트 전체 페이지 수
   */
  relatedPostsTotalPages?: number;
  /**
   * 관련 포스트 페이지 변경 핸들러
   */
  onRelatedPostsPageChange?: (page: number) => void;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
  /**
   * 목차 데이터
   */
  tableOfContents?: TableOfContentsItem[];
}

/**
 * PostTemplate 컴포넌트
 * 블로그 포스트 페이지의 전체 레이아웃을 담당하는 template 컴포넌트
 *
 * Figma 디자인에 따라 구성:
 * 1. PostHeader - 포스트 헤더 (썸네일, 카테고리, 제목, 날짜, 태그, 설명)
 * 2. PostBody - 포스트 본문 (Notion 콘텐츠)
 * 3. PostNavigator - 이전글/다음글 네비게이션
 * 4. RelatedPosts - 관련 포스트 목록
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
  relatedPosts = [],
  showRelatedPosts = true,
  enableRelatedPostsPagination = false,
  relatedPostsCurrentPage = 1,
  relatedPostsTotalPages = 1,
  onRelatedPostsPageChange,
  className = '',
  tableOfContents = [],
}: PostTemplateProps) => {
  // 기본 컨테이너 스타일 - xl 이상에서는 1280px (PostBody 1024px + ToC 256px), 이하에서는 1024px
  const containerStyles = `
    min-h-screen w-full mx-auto my-20 px-3
    max-w-[1024px] xl:max-w-[1280px]
  `;

  return (
    <div className={`${containerStyles} ${className}`}>
      <main className="flex-1">
        {/* Post Header Section - 1024px 유지 */}
        <section className="mt-12 mb-6 max-w-[1024px]">
          <PostHeader {...post} onCategoryClick={onCategoryClick} onTagClick={onTagClick} />
        </section>

        {/* Post Body Section - xl 이상에서는 PostBody(1024px) + ToC(256px) */}
        <section className="mb-12">
          {/* TableOfContents - xl 이하에서는 PostBody 위에 표시 */}
          <div className="xl:hidden max-w-[1024px]">
            <TableOfContents
              items={tableOfContents}
              onCommentClick={() => {
                const commentsSection = document.querySelector('[aria-label="Comments-Section"]');
                if (commentsSection) {
                  commentsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>

          <div className="xl:flex">
            {/* PostBody - 1024px 고정 크기 유지 */}
            <div className="w-full xl:w-[1024px] xl:flex-shrink-0">
              <PostBody recordMap={recordMap} />
            </div>

            {/* TableOfContents - PostBody 우측에 sticky (xl 이상에서만 표시) */}
            <div className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-[100px]">
                <TableOfContents
                  items={tableOfContents}
                  onCommentClick={() => {
                    const commentsSection = document.querySelector(
                      '[aria-label="Comments-Section"]',
                    );
                    if (commentsSection) {
                      commentsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Post Navigation Section - 1024px 유지 */}
        {(prevPost ?? nextPost) && (
          <section className="mb-12 max-w-[1024px]">
            <PostNavigator prevPost={prevPost} nextPost={nextPost} />
          </section>
        )}

        {/* Related Posts Section - 1024px 유지 */}
        {showRelatedPosts && relatedPosts.length > 0 && (
          <section data-section="related-posts" className="max-w-[1024px]">
            <RelatedPosts
              posts={relatedPosts}
              currentPostId={post.id}
              category={post.category.text}
              totalPostsCount={relatedPosts.length}
              enablePagination={enableRelatedPostsPagination}
              currentPage={relatedPostsCurrentPage}
              totalPages={relatedPostsTotalPages}
              onPageChange={onRelatedPostsPageChange}
              showTitle={true}
              paginationSize="md"
            />
          </section>
        )}

        {/* Comments Section - 1024px 유지 */}
        <section className="mb-12 max-w-[1024px]">
          <PostComments identifier={post.id} />
        </section>
      </main>
    </div>
  );
};

export default PostTemplate;
