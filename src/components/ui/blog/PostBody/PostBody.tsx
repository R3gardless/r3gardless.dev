/**
 * 블로그 포스트 본문을 렌더링하는 컴포넌트
 * Notion 페이지의 블록 데이터를 받아서 HTML로 렌더링
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ExtendedRecordMap } from 'notion-types';

import { useThemeStore } from '@/store/themeStore';

// Notion 렌더러 관련 스타일 import
import 'react-notion-x/src/styles.css';
import 'katex/dist/katex.min.css';

// 동적 import로 SSR 비활성화
const NotionRenderer = dynamic(() => import('react-notion-x').then(m => m.NotionRenderer), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <div className="text-gray-500">콘텐츠를 불러오는 중...</div>
    </div>
  ),
});

const Code = dynamic(() => import('react-notion-x/build/third-party/code').then(m => m.Code), {
  ssr: false,
});

const Equation = dynamic(
  () => import('react-notion-x/build/third-party/equation').then(m => m.Equation),
  { ssr: false },
);

const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then(m => m.Pdf), {
  ssr: false,
});

export interface PostBodyProps {
  /**
   * Notion 페이지의 블록 데이터
   */
  recordMap: ExtendedRecordMap;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * PostBody 컴포넌트
 *
 * Notion 페이지 콘텐츠를 렌더링하는 메인 컴포넌트
 * react-notion-x를 사용하여 Notion 블록들을 HTML로 변환
 */
export function PostBody({ recordMap, className = '' }: PostBodyProps) {
  const { theme } = useThemeStore();

  // recordMap이 없거나 비어있는 경우
  if (!recordMap) {
    return (
      <div className={`${className}`}>
        <p className="text-gray-500 text-center py-8">콘텐츠를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={theme === 'dark'}
        disableHeader={true}
        components={{
          // 코드 블록 렌더링
          Code,
          // 수식 렌더링
          Equation,
          // PDF 렌더링
          Pdf,
        }}
      />
    </div>
  );
}
