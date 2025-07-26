import React from 'react';

import { LandingTemplate } from '@/components/templates/LandingTemplate';
import { getPostList } from '@/libs/notion';

/**
 * 메인 페이지 (Landing Page)
 * 정적 생성으로 빌드 타임에 데이터 가져오기
 */
export default async function LandingPage() {
  try {
    // 빌드 타임에 데이터 가져오기
    const posts = await getPostList();

    // 카테고리 추출
    const categories = ['전체', ...Array.from(new Set(posts.map(post => post.category.text)))];

    return (
      <LandingTemplate
        posts={posts}
        categories={categories}
        isLoading={false}
        showMoreButton={true}
        moreButtonText="둘러보기"
        emptyMessage=""
      />
    );
  } catch (error) {
    console.error('Failed to load posts:', error);
    return (
      <LandingTemplate
        posts={[]}
        categories={['전체']}
        isLoading={false}
        showMoreButton={true}
        moreButtonText="둘러보기"
        emptyMessage="포스트를 불러오는 중 오류가 발생했습니다."
      />
    );
  }
}
