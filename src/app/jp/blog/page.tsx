import type { Metadata } from 'next';
import React from 'react';

import { LocalizedBlogListPage, createBlogListMetadata } from '@/libs/blogPages';

export const metadata: Metadata = createBlogListMetadata('jp');

/**
 * 블로그 목록 페이지 (jp 번역)
 */
export default async function JpBlogPage() {
  return <LocalizedBlogListPage lang="jp" />;
}
