import React from 'react';

import { LandingTemplate } from '@/components/templates/LandingTemplate';
import { getLocalPostMeta } from '@/utils/localData';
import { extractCategories } from '@/utils/blog';

/**
 * 메인 페이지 (Landing Page)
 * SSG (Static Site Generation)를 사용하여 빌드 타임에 데이터를 가져옵니다
 */
export default async function LandingPage() {
  try {
    // 빌드된 로컬 데이터에서 포스트 목록 가져오기 (SSG)
    const posts = await getLocalPostMeta();

    // 카테고리 목록 추출
    const categories = extractCategories(posts);

    return (
      <LandingTemplate
        posts={posts}
        categories={categories}
        showMoreButton={true}
        moreButtonText="둘러보기"
        emptyMessage="아직 포스트가 없습니다."
      />
    );
  } catch (error) {
    console.error('Failed to load posts:', error);

    // 에러 발생 시 빈 상태로 렌더링
    return (
      <LandingTemplate
        posts={[]}
        categories={['전체']}
        showMoreButton={false}
        emptyMessage="포스트를 불러오는 중 오류가 발생했습니다."
      />
    );
  }
}
