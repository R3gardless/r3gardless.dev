import type { Metadata } from 'next';
import React from 'react';

import { LocalizedBlogListPage, createBlogListMetadata } from '@/libs/blogPages';

export const metadata: Metadata = createBlogListMetadata('kr');

/**
 * 블로그 페이지 (kr 원문)
 * 정적 생성으로 빌드 타임에 데이터 가져오기
 */
export default async function BlogPage() {
  return <LocalizedBlogListPage lang="kr" />;
}
