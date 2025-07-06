import Head from 'next/head';
import React from 'react';

/**
 * SEO 메타데이터를 관리하는 컴포넌트의 Props 인터페이스
 * 블로그 포스트에서 사용
 */
export interface SeoProps {
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
}

/**
 * 블로그 포스트의 SEO 메타데이터를 관리하는 컴포넌트
 *
 * @description
 * - 검색 엔진 최적화(SEO)를 위한 기본 메타 태그
 * - 소셜 미디어 공유를 위한 Open Graph와 Twitter Card 태그
 * - 블로그 포스트를 위한 Article 메타데이터
 * - 정규 URL 설정으로 중복 콘텐츠 방지
 *
 * @example
 * // 블로그 포스트
 * <Seo
 *   title="React Hook 완벽 가이드"
 *   description="React Hook을 마스터하는 방법"
 *   keywords={['React', 'Hook', 'useState', 'useEffect']}
 *   publishedTime="2025-07-06T10:00:00Z"
 *   ogImage="/images/react-hooks.jpg"
 * />
 */
export const Seo = ({
  title,
  description,
  ogImage,
  canonical,
  keywords,
  publishedTime,
  modifiedTime,
}: SeoProps) => (
  <Head>
    {/* 기본 SEO 메타 태그 - 검색 엔진과 브라우저에서 사용 */}
    <title>{title}</title>
    <meta name="description" content={description} />
    {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
    {/* Open Graph 메타 태그 - 페이스북, 링크드인 등 소셜 미디어 공유 최적화 */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="article" />
    {ogImage && <meta property="og:image" content={ogImage} />}
    {canonical && <meta property="og:url" content={canonical} />}
    {/* Twitter Card 메타 태그 - 트위터 공유 시 미리보기 최적화 */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {ogImage && <meta name="twitter:image" content={ogImage} />}
    {/* 블로그 포스트 전용 메타데이터 - 검색 엔진에게 발행/수정 시간 알림 */}
    {publishedTime && <meta property="article:published_time" content={publishedTime} />}
    {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
    {/* 정규 URL - 중복 콘텐츠 방지 및 링크 주스 통합 */}
    {canonical && <link rel="canonical" href={canonical} />}
    {/* 추가 SEO 및 브라우저 설정 */}
    <meta name="robots" content="index, follow" /> {/* 검색 엔진 크롤링 허용 */}
    <meta name="viewport" content="width=device-width, initial-scale=1" /> {/* 반응형 디자인 */}
    <meta charSet="utf-8" /> {/* 문자 인코딩 설정 */}
  </Head>
);
