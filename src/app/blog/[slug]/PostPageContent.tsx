'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExtendedRecordMap } from 'notion-types';

import { PostTemplate } from '@/components/templates/PostTemplate';
import { PostMeta } from '@/types/blog';
import { DEFAULT_POSTS_PER_PAGE } from '@/constants';

/**
 * 포스트 페이지 클라이언트 컴포넌트 Props
 */
export interface PostPageContentProps {
  post: PostMeta;
  recordMap: ExtendedRecordMap;
  prevPost?: { title: string; href: string };
  nextPost?: { title: string; href: string };
  relatedPosts: Array<{
    id: string;
    title: string;
    createdAt: string;
    href: string;
  }>;
  showRelatedPosts: boolean;
  enableRelatedPostsPagination: boolean;
}

/**
 * 포스트 페이지 클라이언트 컴포넌트
 * 이벤트 핸들링 로직을 담당
 */
export function PostPageContent({
  post,
  recordMap,
  prevPost,
  nextPost,
  relatedPosts,
  showRelatedPosts,
  enableRelatedPostsPagination,
}: PostPageContentProps) {
  const router = useRouter();

  // 관련 포스트 페이지네이션 상태
  const [relatedPostsCurrentPage, setRelatedPostsCurrentPage] = useState(1);
  const postsPerPage = DEFAULT_POSTS_PER_PAGE;

  // 관련 포스트 총 페이지 수 계산
  const relatedPostsTotalPages = useMemo(() => {
    return Math.ceil(relatedPosts.length / postsPerPage);
  }, [relatedPosts.length, postsPerPage]);

  // 현재 페이지에 표시할 관련 포스트들
  const paginatedRelatedPosts = useMemo(() => {
    if (!enableRelatedPostsPagination) {
      return relatedPosts.slice(0, postsPerPage);
    }

    const startIndex = (relatedPostsCurrentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return relatedPosts.slice(startIndex, endIndex);
  }, [relatedPosts, relatedPostsCurrentPage, enableRelatedPostsPagination, postsPerPage]);

  // 카테고리 클릭 핸들러 - 블로그 메인 페이지로 이동하면서 카테고리 필터 적용
  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams();

    // 카테고리가 '전체'가 아닌 경우만 파라미터 추가
    if (category && category !== '전체') {
      params.set('category', category);
    }

    const blogURL = `/blog${params.toString() ? '?' + params.toString() : ''}`;
    router.push(blogURL);
  };

  // 태그 클릭 핸들러 - 블로그 메인 페이지로 이동하면서 태그 필터 적용
  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams();
    params.set('tags', tag);

    const blogURL = `/blog?${params.toString()}`;
    router.push(blogURL);
  };

  // 관련 포스트 페이지네이션 핸들러
  const handleRelatedPostsPageChange = (page: number) => {
    setRelatedPostsCurrentPage(page);

    // 스크롤을 관련 포스트 섹션으로 이동 (부드럽게)
    const relatedPostsSection = document.querySelector('[data-section="related-posts"]');
    if (relatedPostsSection) {
      relatedPostsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <PostTemplate
      post={post}
      recordMap={recordMap}
      prevPost={prevPost}
      nextPost={nextPost}
      onCategoryClick={handleCategoryClick}
      onTagClick={handleTagClick}
      relatedPosts={paginatedRelatedPosts}
      showRelatedPosts={showRelatedPosts}
      enableRelatedPostsPagination={enableRelatedPostsPagination}
      relatedPostsCurrentPage={relatedPostsCurrentPage}
      relatedPostsTotalPages={relatedPostsTotalPages}
      onRelatedPostsPageChange={handleRelatedPostsPageChange}
    />
  );
}
