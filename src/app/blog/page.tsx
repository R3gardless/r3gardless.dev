import React from 'react';

import { getPostListWithStaticFallback } from '@/libs/staticPostData';

import BlogPageClient from './BlogPageClient';

/**
 * 블로그 페이지
 * 정적 생성으로 빌드 타임에 데이터 가져오기
 */
export default async function BlogPage() {
  // 빌드 타임에 정적 데이터 가져오기
  const result = await getPostListWithStaticFallback().catch(error => {
    console.error('Failed to load blog posts:', error);
    return null;
  });

  if (!result) {
    return <div>포스트를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const posts = result;
  // 카테고리와 태그 추출
  const categories = ['전체', ...Array.from(new Set(posts.map(post => post.category.text)))];
  const tags = Array.from(new Set(posts.flatMap(post => post.tags)));

  return <BlogPageClient initialPosts={posts} initialCategories={categories} initialTags={tags} />;
}
