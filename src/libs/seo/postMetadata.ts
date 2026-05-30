import type { Metadata } from 'next';

import { SITE_CONFIG, AUTHOR_CONFIG } from '@/constants';

/**
 * BlogPosting JSON-LD 생성을 위한 입력
 */
export interface PostJsonLdInput extends PostMetadataProps {
  /** 절대 URL 형태의 정규 URL (필수) */
  canonical: string;
}

/**
 * schema.org/BlogPosting JSON-LD 객체 생성
 *
 * AI 크롤러(GPTBot, ClaudeBot 등)와 검색 엔진이 구조화된 메타데이터로
 * 글의 제목, 저자, 발행일 등을 안정적으로 인식하도록 돕습니다.
 * 페이지 컴포넌트에서 `<script type="application/ld+json">`으로 직렬화해 주입하세요.
 */
export function generatePostJsonLd({
  title,
  description,
  ogImage = '/og-image.png',
  canonical,
  keywords = [],
  publishedTime,
  modifiedTime,
  author,
}: PostJsonLdInput): Record<string, unknown> {
  const authorName = author || AUTHOR_CONFIG.name;
  const siteUrl = SITE_CONFIG.url;
  const absoluteOgImage = ogImage?.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  const absoluteCanonical = canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteCanonical,
    },
    headline: title,
    description,
    image: [absoluteOgImage],
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.png`,
      },
    },
    keywords: keywords.join(', '),
    inLanguage: 'ko-KR',
    url: absoluteCanonical,
  };
}

/**
 * 블로그 포스트의 SEO 메타데이터 생성을 위한 Props 인터페이스
 */
export interface PostMetadataProps {
  /** 페이지 제목 (브라우저 탭과 검색 결과에 표시) */
  title: string;
  /** 페이지 설명 (검색 결과와 소셜 미디어 공유 시 표시) */
  description: string;
  /** 소셜 미디어 공유 시 표시될 이미지 URL */
  ogImage?: string;
  /** 검색 엔진 중복 콘텐츠 방지를 위한 정규 URL */
  canonical?: string;
  /** 검색 엔진 최적화를 위한 키워드 배열 */
  keywords?: string[];
  /** 블로그 글 최초 발행 시간 (ISO 8601 형식) */
  publishedTime?: string;
  /** 블로그 글 마지막 수정 시간 (ISO 8601 형식) */
  modifiedTime?: string;
  /** 작성자 정보 */
  author?: string;
}

/**
 * 블로그 포스트의 SEO 메타데이터를 생성하는 함수
 *
 * App Router의 Metadata API를 사용하여 SEO 최적화
 * - 검색 엔진 최적화(SEO)를 위한 기본 메타 태그
 * - 소셜 미디어 공유를 위한 Open Graph와 Twitter Card 태그
 * - 블로그 포스트를 위한 Article 메타데이터
 *
 * @example
 * ```typescript
 * export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
 *   const post = await getPostBySlug(params.slug);
 *
 *   return generatePostMetadata({
 *     title: post.title,
 *     description: post.description,
 *     keywords: post.tags,
 *     publishedTime: post.createdAt,
 *     ogImage: post.cover,
 *     canonical: `https://example.com/blog/${params.slug}`
 *   });
 * }
 * ```
 */
export function generatePostMetadata({
  title,
  description,
  ogImage = '/og-image.png',
  canonical,
  keywords = [],
  publishedTime,
  modifiedTime,
  author,
}: PostMetadataProps): Metadata {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const authorName = author || AUTHOR_CONFIG.name;
  const siteUrl = SITE_CONFIG.url;

  // 절대 URL 생성 (상대 URL인 경우)
  const absoluteOgImage = ogImage?.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  const absoluteCanonical = canonical?.startsWith('http') ? canonical : `${siteUrl}${canonical}`;

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, ...SITE_CONFIG.keywords],
    authors: [{ name: authorName, url: siteUrl }],
    creator: authorName,
    publisher: SITE_CONFIG.name,

    // Open Graph (Facebook, LinkedIn 등)
    openGraph: {
      type: 'article',
      title: fullTitle,
      description,
      url: absoluteCanonical,
      siteName: SITE_CONFIG.name,
      locale: 'ko_KR',
      images: absoluteOgImage
        ? [
            {
              url: absoluteOgImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      publishedTime,
      modifiedTime,
      authors: [authorName],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: `@${AUTHOR_CONFIG.name}`,
      images: absoluteOgImage ? [absoluteOgImage] : undefined,
    },

    // Article 관련 메타데이터
    other: {
      ...(publishedTime && { 'article:published_time': publishedTime }),
      ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      ...(authorName && { 'article:author': authorName }),
    },

    // 정규 URL
    alternates: absoluteCanonical
      ? {
          canonical: absoluteCanonical,
        }
      : undefined,

    // 검색 엔진 설정
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
  };
}
