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

// 모든 Notion 컴포넌트를 하나의 동적 import로 최적화
const NotionComponents = dynamic(
  async () => {
    const [notionModule, codeModule, equationModule, pdfModule] = await Promise.all([
      import('react-notion-x'),
      import('react-notion-x/build/third-party/code'),
      import('react-notion-x/build/third-party/equation'),
      import('react-notion-x/build/third-party/pdf'),
    ]);

    // 모든 컴포넌트를 포함한 래퍼 컴포넌트 반환
    const NotionWrapper = (props: {
      recordMap: ExtendedRecordMap;
      fullPage?: boolean;
      darkMode?: boolean;
      disableHeader?: boolean;
      components?: Record<string, React.ComponentType<unknown>>;
    }) => {
      const { NotionRenderer } = notionModule;
      const { Code } = codeModule;
      const { Equation } = equationModule;
      const { Pdf } = pdfModule;

      return (
        <NotionRenderer
          {...props}
          components={{
            Code,
            Equation,
            Pdf,
            ...props.components,
          }}
        />
      );
    };

    return NotionWrapper;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">콘텐츠를 불러오는 중...</div>
      </div>
    ),
  },
);

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
      <NotionComponents
        recordMap={recordMap}
        fullPage={true}
        darkMode={theme === 'dark'}
        disableHeader={true}
      />
    </div>
  );
}
