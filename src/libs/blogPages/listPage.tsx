import type { Metadata } from 'next';
import React from 'react';

import BlogPageClient from '@/app/blog/BlogPageClient';
import { LandingTemplate } from '@/components/templates/LandingTemplate';
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
 * 해당 언어로 제공되는 포스트만 골라 번역 메타로 치환합니다.
 * kr은 전체 포스트를 원본 그대로 반환합니다.
 */
function localizePostsForLang(posts: PostMeta[], lang: PostLang): PostMeta[] {
  if (lang === DEFAULT_POST_LANG) {
    return posts;
  }
  return posts
    .filter((post: PostMeta) => getPostLanguages(post).includes(lang))
    .map((post: PostMeta) => localizePostMeta(post, lang));
}

/**
 * 언어별 랜딩(홈) 페이지 렌더링.
 * en/ja은 해당 번역본이 있는 포스트만 노출하고 링크도 언어 라우트를 사용합니다.
 */
export async function LocalizedLandingPage({ lang }: { lang: PostLang }) {
  const result = await getPostListWithStaticFallback().catch(error => {
    logError('Landing posts load failed', error);
    return null;
  });

  const posts = localizePostsForLang(result ?? [], lang);
  const categories = getPostCategories(posts);
  // 에러 시에만 로드 실패 문구를 언어별로 노출하고, 정상일 때는 en/ja에서만 영어 빈 상태
  // 문구를 지정합니다(kr은 LandingTemplate 기본 문구 사용). 빈 문자열을 넘기지 않습니다.
  let emptyMessage: string | undefined;
  if (result === null) {
    emptyMessage =
      lang === DEFAULT_POST_LANG
        ? '포스트를 불러오는 중 오류가 발생했습니다.'
        : 'Failed to load posts.';
  } else if (lang !== DEFAULT_POST_LANG) {
    emptyMessage = 'No posts yet.';
  }

  return (
    <LandingTemplate
      posts={posts}
      categories={categories}
      lang={lang}
      isLoading={false}
      showMoreButton={true}
      emptyMessage={emptyMessage}
    />
  );
}

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
 * 언어별 블로그 목록 페이지 렌더링 (kr 원문 + en/ja 번역 라우트 공용)
 * en/ja는 해당 번역본이 있는 포스트만 노출하고 title/description을 번역 값으로 치환합니다.
 */
export async function LocalizedBlogListPage({ lang }: { lang: PostLang }) {
  const result = await getPostListWithStaticFallback().catch(error => {
    logError('Blog posts load failed', error);
    return null;
  });

  if (!result) {
    return (
      <div>
        {lang === DEFAULT_POST_LANG
          ? '포스트를 불러오는 중 오류가 발생했습니다.'
          : 'Failed to load posts.'}
      </div>
    );
  }

  const posts = localizePostsForLang(result, lang);
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
