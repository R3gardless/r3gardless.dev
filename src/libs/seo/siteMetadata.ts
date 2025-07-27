import type { Metadata } from 'next';

import { getSiteConfig } from '@/utils/config';

// 사이트 설정을 한 번만 가져와서 재사용
const siteConfig = getSiteConfig();

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
    default: siteConfig.site.name,
    template: `%s | ${siteConfig.site.name}`,
  },
  description: siteConfig.site.description,
  keywords: siteConfig.site.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.site.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.site.url,
    siteName: siteConfig.site.name,
    title: siteConfig.site.name,
    description: siteConfig.site.description,
    images: [
      {
        url: `${siteConfig.site.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.site.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.site.name,
    description: siteConfig.site.description,
    images: [`${siteConfig.site.url}/og-image.png`],
    creator: `@${siteConfig.author.name}`,
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};
