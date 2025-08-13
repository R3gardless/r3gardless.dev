import { MetadataRoute } from 'next';

import { SITE_CONFIG } from '@/constants';

/**
 * Robots.txt 생성
 *
 * SEO 최적화를 위한 검색 엔진 크롤러 가이드라인 제공
 * - 모든 크롤러에 대해 전체 사이트 접근 허용
 * - sitemap.xml 위치 명시
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'], // 필요시 제외할 경로 추가
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
  };
}
