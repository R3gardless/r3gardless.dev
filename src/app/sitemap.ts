import { MetadataRoute } from 'next';

import { SITE_CONFIG } from '@/constants';
import { getStaticPostList } from '@/libs/staticPostData';
import { DEFAULT_POST_LANG, TRANSLATED_POST_LANGUAGES } from '@/types/blog';
import { blogLangPathPrefix, getPostLanguages } from '@/utils/blog';

// 정적 내보내기를 위한 설정
export const dynamic = 'force-static';

function toSitemapDate(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Sitemap.xml 생성
 *
 * SEO 최적화를 위한 사이트맵 자동 생성
 * - 정적 페이지 (홈, 블로그, 어바웃 등)
 * - 동적 블로그 포스트 (빌드 시 생성된 정적 데이터 사용)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const posts = getStaticPostList();
  const latestPostDate = posts
    .map(post => toSitemapDate(post.updatedAt || post.publishedAt || post.lastEditedAt))
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // 번역 블로그 목록 (/en/blog, /jp/blog)
    ...TRANSLATED_POST_LANGUAGES.map(lang => ({
      url: `${baseUrl}/${lang}/blog`,
      lastModified: latestPostDate,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    })),
  ];

  // 블로그 포스트들 (정적 데이터에서 가져오기, kr 원문 + en/jp 번역 라우트 포함)
  const blogPosts: MetadataRoute.Sitemap = posts.flatMap(post =>
    getPostLanguages(post).map(lang => ({
      url: `${baseUrl}${blogLangPathPrefix(lang)}/blog/${post.slug}`,
      lastModified: toSitemapDate(post.updatedAt || post.publishedAt || post.lastEditedAt),
      changeFrequency: 'weekly' as const,
      priority: lang === DEFAULT_POST_LANG ? 0.7 : 0.5,
    })),
  );

  return [...staticPages, ...blogPosts];
}
