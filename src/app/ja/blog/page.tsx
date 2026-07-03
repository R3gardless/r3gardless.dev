import type { Metadata } from 'next';
import React from 'react';

import { LocalizedBlogListPage, createBlogListMetadata } from '@/libs/blogPages';

export const metadata: Metadata = createBlogListMetadata('ja');

/**
 * 블로그 목록 페이지 (ja 번역)
 */
export default async function JaBlogPage() {
  return <LocalizedBlogListPage lang="ja" />;
}
