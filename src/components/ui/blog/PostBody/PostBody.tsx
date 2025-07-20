/**
 * 블로그 포스트 본문을 렌더링하는 컴포넌트
 * Notion 페이지의 블록 데이터를 받아서 HTML로 렌더링
 */
'use client';

import React from 'react';
import { NotionRenderer } from 'react-notion-x';
import { ExtendedRecordMap } from 'notion-types';
import { Code } from 'react-notion-x/build/third-party/code';
import { Collection } from 'react-notion-x/build/third-party/collection';
import { Equation } from 'react-notion-x/build/third-party/equation';
import { Pdf } from 'react-notion-x/build/third-party/pdf';

// Notion 렌더러 관련 스타일 import
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';
import '@/styles/notion.css'; // 반드시 style.css 다음에 import!

export interface PostBodyProps {
  /**
   * Notion 페이지의 블록 데이터
   */
  recordMap: ExtendedRecordMap;
  /**
   * 블로그 포스트 ID
   */
  postId?: string;
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
export function PostBody({ recordMap, postId, className = '' }: PostBodyProps) {
  const baseStyles = 'w-full max-w-[1024px] mx-auto';

  // recordMap이 없거나 비어있는 경우
  if (!recordMap) {
    return (
      <div className={`notion-body ${baseStyles} ${className}`}>
        <p className="text-gray-500 text-center py-8">콘텐츠를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={`notion-body ${baseStyles} ${className}`}>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        rootPageId={postId}
        darkMode={false}
        previewImages={true}
        showCollectionViewDropdown={false}
        showTableOfContents={true}
        minTableOfContentsItems={1}
        defaultPageIcon="📄"
        defaultPageCover=""
        defaultPageCoverPosition={0.5}
        components={{
          // 코드 블록 렌더링
          Code,
          // 컬렉션 (데이터베이스) 렌더링
          Collection,
          // 수식 렌더링
          Equation,
          // PDF 렌더링
          Pdf,
          // 커스텀 페이지 링크 렌더링 (내부 링크는 Next.js Link로 처리)
          nextLink: ({
            href,
            children,
            ...props
          }: {
            href?: string;
            children: React.ReactNode;
            [key: string]: unknown;
          }) => {
            // 내부 링크인 경우 Next.js Link 사용
            if (href?.startsWith('/')) {
              return (
                <a href={href} {...props}>
                  {children}
                </a>
              );
            }
            // 외부 링크인 경우 새 탭에서 열기
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            );
          },
        }}
      />
    </div>
  );
}
