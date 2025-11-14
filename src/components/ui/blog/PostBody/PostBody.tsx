/**
 * 블로그 포스트 본문을 렌더링하는 컴포넌트
 * Notion 페이지의 블록 데이터를 받아서 HTML로 렌더링
 */

'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ExtendedRecordMap } from 'notion-types';
import React from 'react';

// Prism.js core import 먼저
import 'prismjs';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-csharp.js';
import 'prismjs/components/prism-docker.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-js-templates.js';
import 'prismjs/components/prism-coffeescript.js';
import 'prismjs/components/prism-diff.js';
import 'prismjs/components/prism-git.js';
import 'prismjs/components/prism-go.js';
import 'prismjs/components/prism-kotlin.js';
import 'prismjs/components/prism-graphql.js';
import 'prismjs/components/prism-handlebars.js';
import 'prismjs/components/prism-less.js';
import 'prismjs/components/prism-makefile.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-objectivec.js';
import 'prismjs/components/prism-ocaml.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-reason.js';
import 'prismjs/components/prism-rust.js';
import 'prismjs/components/prism-sass.js';
import 'prismjs/components/prism-scss.js';
import 'prismjs/components/prism-solidity.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-stylus.js';
import 'prismjs/components/prism-swift.js';
import 'prismjs/components/prism-wasm.js';
import 'prismjs/components/prism-yaml.js';

import { useThemeStore } from '@/store/themeStore';

// Notion 렌더러 관련 스타일 import
import '@/styles/notion.css';
import 'prismjs/themes/prism-tomorrow.css';
import '@/styles/prism-theme.css';
import 'katex/dist/katex.min.css';

// 각 컴포넌트를 개별적으로 dynamic import
const NotionRenderer = dynamic(() => import('react-notion-x').then(m => m.NotionRenderer), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <div className="text-gray-500">콘텐츠를 불러오는 중...</div>
    </div>
  ),
});

const Code = dynamic(() => import('react-notion-x/build/third-party/code').then(m => m.Code));

const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then(m => m.Equation),
);

const Pdf = dynamic(() => import('react-notion-x/build/third-party/pdf').then(m => m.Pdf), {
  ssr: false,
});

const Modal = dynamic(() => import('react-notion-x/build/third-party/modal').then(m => m.Modal), {
  ssr: false,
});

// 페이지 URL 매핑 함수 - Notion 내부 링크를 블로그 URL로 변환
const mapPageUrl = (id: string) => {
  // Notion 페이지 ID를 블로그 포스트 URL로 매핑
  return 'https://www.notion.so/' + id.replace(/-/g, '');
};

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
      <div className={className}>
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
          Code,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
      />
    </div>
  );
}
