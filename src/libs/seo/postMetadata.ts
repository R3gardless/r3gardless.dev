import type { Metadata } from 'next';

import { SITE_CONFIG, AUTHOR_CONFIG } from '@/constants';
import { DEFAULT_POST_LANG, langPathPrefix } from '@/types/blog';
import type { PostLang } from '@/types/blog';

/**
 * 블로그 언어 -> hreflang 코드 매핑 (ja 콘텐츠는 일본어)
 */
export const POST_LANG_HREFLANG: Record<PostLang, string> = {
  kr: 'ko',
  en: 'en',
  ja: 'ja',
};

/**
 * 블로그 언어 -> Open Graph locale 매핑
 */
export const POST_LANG_OG_LOCALE: Record<PostLang, string> = {
  kr: 'ko_KR',
  en: 'en_US',
  ja: 'ja_JP',
};

/**
 * 블로그 언어 -> JSON-LD inLanguage 매핑
 */
export const POST_LANG_IN_LANGUAGE: Record<PostLang, string> = {
  kr: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
};

/**
 * kr/en/ja 포스트 변형에 대한 hreflang alternate URL 맵을 생성합니다.
 * x-default는 kr 원문을 가리킵니다.
 */
export function buildPostLanguageAlternates(
  slug: string,
  languages: PostLang[],
): Record<string, string> {
  const siteUrl = SITE_CONFIG.url;
  const alternates: Record<string, string> = {};

  for (const lang of languages) {
    const prefix = langPathPrefix(lang);
    alternates[POST_LANG_HREFLANG[lang]] = `${siteUrl}${prefix}/blog/${slug}`;
  }

  alternates['x-default'] = `${siteUrl}/blog/${slug}`;
  return alternates;
}

/**
 * 블로그 목록 라우트(/blog, /en/blog, /ja/blog)의 hreflang alternate URL 맵을 생성합니다.
 * x-default는 kr 목록을 가리킵니다.
 */
export function buildBlogListLanguageAlternates(): Record<string, string> {
  const siteUrl = SITE_CONFIG.url;
  const alternates: Record<string, string> = {};

  for (const lang of Object.keys(POST_LANG_HREFLANG) as PostLang[]) {
    const prefix = langPathPrefix(lang);
    alternates[POST_LANG_HREFLANG[lang]] = `${siteUrl}${prefix}/blog`;
  }

  alternates['x-default'] = `${siteUrl}/blog`;
  return alternates;
}

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
  lang = DEFAULT_POST_LANG,
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
    inLanguage: POST_LANG_IN_LANGUAGE[lang],
    url: absoluteCanonical,
  };
}

/**
 * JSON-LD를 script 태그에 넣을 때 HTML/script context를 깨는 문자를 escape합니다.
 */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
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
  /** 콘텐츠 언어 (kr/en/ja). 생략 시 kr */
  lang?: PostLang;
  /** hreflang alternate URL 맵 (buildPostLanguageAlternates 결과) */
  languageAlternates?: Record<string, string>;
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
  lang = DEFAULT_POST_LANG,
  languageAlternates,
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
      locale: POST_LANG_OG_LOCALE[lang],
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

    // 정규 URL + hreflang alternate 링크
    alternates:
      absoluteCanonical || languageAlternates
        ? {
            ...(absoluteCanonical ? { canonical: absoluteCanonical } : {}),
            ...(languageAlternates ? { languages: languageAlternates } : {}),
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
