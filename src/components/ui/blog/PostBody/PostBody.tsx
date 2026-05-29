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
import { NotionRenderer } from 'react-notion-x';

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

// Notion 렌더러 관련 스타일 import
import '@/styles/notion.css';
import 'prismjs/themes/prism-tomorrow.css';
import '@/styles/prism-theme.css';
import 'katex/dist/katex.min.css';

// 본문은 SSG 시점에 HTML로 직렬화되어야 AI 크롤러와 SEO에 노출됨 → top-level import
// 아래 third-party는 사용 빈도가 낮거나 브라우저 전용이라 dynamic으로 코드 스플리팅 유지
const Code = dynamic(() => import('react-notion-x/build/third-party/code').then(m => m.Code));

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(m => m.Collection),
);

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
  // recordMap이 없거나 비어있는 경우
  if (!recordMap) {
    return (
      <div className={className}>
        <p className="text-gray-500 text-center py-8">콘텐츠를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // darkMode prop은 의도적으로 넘기지 않음
  // SSG 시점엔 사용자 테마를 알 수 없으므로 light-mode 클래스로 prerender되고
  // 실제 다크/라이트 색상은 root `[data-theme]` 속성 + notion.css 변수로 제어됨
  // (FOUC 방지 스크립트가 paint 전에 data-theme를 설정하므로 깜빡임 없음)
  return (
    <div className={`${className}`}>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        disableHeader={true}
        components={{
          Code,
          Collection,
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
