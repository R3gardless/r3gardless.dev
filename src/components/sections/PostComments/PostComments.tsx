'use client';

import React, { useEffect, useRef } from 'react';

import { useThemeStore } from '@/store/themeStore';

/**
 * PostComments 컴포넌트 Props 인터페이스
 */
export interface PostCommentsProps {
  /** 댓글을 구분하기 위한 고유 식별자 (보통 포스트 slug나 ID) */
  identifier?: string;
  /** 추가적인 CSS 클래스명 */
  className?: string;
}

/**
 * Giscus를 사용한 댓글 시스템 컴포넌트
 *
 * 이 컴포넌트는 GitHub Discussions를 기반으로 한 Giscus 댓글 시스템을
 * 블로그 포스트에 통합합니다.
 *
 * 주요 기능:
 * - GitHub Discussions 기반 댓글
 * - 다크/라이트 모드 자동 연동
 * - 반응형 디자인
 * - 한국어 지원
 *
 * @param identifier - 댓글을 구분하기 위한 고유 식별자
 * @param className - 추가적인 CSS 클래스명
 */
export function PostComments({ identifier, className = '' }: PostCommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();

  useEffect(() => {
    if (!commentsRef.current) return;

    // 기존 Giscus 스크립트가 있다면 제거
    const existingScript = commentsRef.current.querySelector('script');
    if (existingScript) {
      existingScript.remove();
    }

    // Giscus 스크립트 생성 및 설정
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'r3gardless/r3gardless.dev');
    script.setAttribute('data-repo-id', 'R_kgDOOYvG6g');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOOYvG6s4CtbrZ');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    // 식별자가 있는 경우 term으로 설정
    if (identifier) {
      script.setAttribute('data-mapping', 'specific');
      script.setAttribute('data-term', identifier);
    }

    commentsRef.current.appendChild(script);
  }, [theme, identifier]);

  return (
    <section className={`w-full ${className}`} aria-label="댓글 섹션">
      {/* Giscus 댓글 시스템 */}
      <div
        ref={commentsRef}
        className="w-full min-h-[200px]"
        style={
          {
            // Giscus 컨테이너 스타일링
            '--giscus-primary-color': 'var(--color-primary)',
            '--giscus-primary-color-light': 'var(--color-primary-light)',
          } as React.CSSProperties
        }
      />

      {/* 로딩 상태 표시 */}
      <noscript>
        <div className="p-4 text-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
          댓글을 보려면 JavaScript를 활성화해주세요.
        </div>
      </noscript>
    </section>
  );
}
