import type { Metadata } from 'next';
import React from 'react';

import BlogPageClient from '@/app/blog/BlogPageClient';
import { SITE_CONFIG } from '@/constants';
import { buildBlogListLanguageAlternates } from '@/libs/seo/postMetadata';
import { getPostListWithStaticFallback } from '@/libs/staticPostData';
import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang, PostMeta } from '@/types/blog';
import {
  blogLangPathPrefix,
  getPostCategories,
  getPostLanguages,
  getPostTags,
  localizePostMeta,
} from '@/utils/blog';
import { logError } from '@/utils/logger';

/**
 * 블로그 목록 라우트의 언어별 메타데이터 (canonical + hreflang alternate)
 */
export function createBlogListMetadata(lang: PostLang): Metadata {
  return {
    alternates: {
      canonical: `${SITE_CONFIG.url}${blogLangPathPrefix(lang)}/blog`,
      languages: buildBlogListLanguageAlternates(),
    },
  };
}

/**
 * 언어별 블로그 목록 페이지 렌더링 (kr 원문 + en/jp 번역 라우트 공용)
 * en/jp는 해당 번역본이 있는 포스트만 노출하고 title/description을 번역 값으로 치환합니다.
 */
export async function LocalizedBlogListPage({ lang }: { lang: PostLang }) {
  const result = await getPostListWithStaticFallback().catch(error => {
    logError('Blog posts load failed', error);
    return null;
  });

  if (!result) {
    return <div>포스트를 불러오는 중 오류가 발생했습니다.</div>;
  }

  const posts =
    lang === DEFAULT_POST_LANG
      ? result
      : result
          .filter((post: PostMeta) => getPostLanguages(post).includes(lang))
          .map((post: PostMeta) => localizePostMeta(post, lang));
  const categories = getPostCategories(posts);
  const tags = getPostTags(posts);

  return (
    <BlogPageClient
      initialPosts={posts}
      initialCategories={categories}
      initialTags={tags}
      lang={lang}
    />
  );
}
