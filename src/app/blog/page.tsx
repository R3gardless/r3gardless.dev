import React from 'react';

import { getPostList } from '@/libs/notion';

import BlogPageClient from './BlogPageClient';

/**
 * 블로그 페이지
 * 정적 생성으로 빌드 타임에 데이터 가져오기
 */
export default async function BlogPage() {
  try {
    // 빌드 타임에 데이터 가져오기
    const posts = await getPostList();

    // 카테고리와 태그 추출
    const categories = ['전체', ...Array.from(new Set(posts.map(post => post.category.text)))];
    const tags = Array.from(new Set(posts.flatMap(post => post.tags)));

    return (
      <BlogPageClient initialPosts={posts} initialCategories={categories} initialTags={tags} />
    );
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    return <div>포스트를 불러오는 중 오류가 발생했습니다.</div>;
  }
}
