import React from 'react';

import { LandingTemplate } from '@/components/templates/LandingTemplate';
import { getPostListWithStaticFallback } from '@/libs/staticPostData';

/**
 * 메인 페이지 (Landing Page)
 * 정적 생성으로 빌드 타임에 데이터 가져오기
 */
export default async function LandingPage() {
  // 빌드 타임에 정적 데이터 가져오기
  const result = await getPostListWithStaticFallback().catch(error => {
    console.error('Failed to load posts:', error);
    return null;
  });

  const posts = result ?? [];
  const categories = ['전체', ...Array.from(new Set(posts.map(post => post.category.text)))];
  const emptyMessage = result === null ? '포스트를 불러오는 중 오류가 발생했습니다.' : '';

  return (
    <LandingTemplate
      posts={posts}
      categories={categories}
      isLoading={false}
      showMoreButton={true}
      moreButtonText="둘러보기"
      emptyMessage={emptyMessage}
    />
  );
}
