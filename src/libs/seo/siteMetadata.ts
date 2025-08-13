import type { Metadata } from 'next';

import { SITE_CONFIG, AUTHOR_CONFIG } from '@/constants';

/**
 * 사이트 메타데이터 설정
 *
 * SEO 최적화를 위한 전역 메타데이터 설정
 * - 기본 제목 및 템플릿
 * - OpenGraph 설정
 * - Twitter Card 설정
 * - 검색엔진 최적화 설정
 */
export const siteMetadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [
    {
      name: AUTHOR_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  ],
  creator: AUTHOR_CONFIG.name,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/og-image.png`],
    creator: `@${AUTHOR_CONFIG.name}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Google Search Console은 도메인 연결 방식으로 설정됨
};
