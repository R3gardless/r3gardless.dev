import { MetadataRoute } from 'next';

import { SITE_CONFIG } from '@/constants';
import { getStaticPostList } from '@/libs/staticPostData';

// 정적 내보내기를 위한 설정
export const dynamic = 'force-static';

/**
 * Sitemap.xml 생성
 *
 * SEO 최적화를 위한 사이트맵 자동 생성
 * - 정적 페이지 (홈, 블로그, 어바웃 등)
 * - 동적 블로그 포스트 (빌드 시 생성된 정적 데이터 사용)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // 블로그 포스트들 (정적 데이터에서 가져오기)
  const posts = getStaticPostList();
  const blogPosts: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastEditedAt ? new Date(post.lastEditedAt) : new Date(post.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPosts];
}
