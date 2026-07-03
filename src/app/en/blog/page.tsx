import type { Metadata } from 'next';
import React from 'react';

import { LocalizedBlogListPage, createBlogListMetadata } from '@/libs/blogPages';

export const metadata: Metadata = createBlogListMetadata('en');

/**
 * 블로그 목록 페이지 (en 번역)
 */
export default async function EnBlogPage() {
  return <LocalizedBlogListPage lang="en" />;
}
