'use client';

import React, { useEffect, useRef } from 'react';

import { useThemeStore } from '@/store/themeStore';
import { THEME_STORAGE_KEY } from '@/constants';

/**
 * PostComments 컴포넌트 Props 인터페이스
 */
export interface PostCommentsProps {
  /** 댓글을 구분하기 위한 고유 식별자 (보통 ID) */
  identifier?: number;
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
 * - 다크/라이트 모드 자동 연동 (최적화된 테마 변경)
 * - 반응형 디자인
 * - 한국어 지원
 *
 * @param identifier - 댓글을 구분하기 위한 고유 식별자
 * @param className - 추가적인 CSS 클래스명
 */
export function PostComments({ identifier, className = '' }: PostCommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);
  const isGiscusLoadedRef = useRef(false);
  const { theme } = useThemeStore();

  // Giscus 초기 로드 (한 번만 실행)
  useEffect(() => {
    if (!commentsRef.current || isGiscusLoadedRef.current) return;
    // 환경 변수 검증
    if (!process.env.NEXT_PUBLIC_GISCUS_REPO || !process.env.NEXT_PUBLIC_GISCUS_REPO_ID) {
      console.error(
        'Missing required environment variables: NEXT_PUBLIC_GISCUS_REPO or NEXT_PUBLIC_GISCUS_REPO_ID',
      );
      return;
    }

    // localStorage에서 테마 설정 가져오기 (layout.tsx의 FOUC 방지 스크립트와 동일한 로직)
    let initialTheme = 'light';

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            initialTheme = parsed.state?.theme || 'light';
          } catch {
            // 파싱 실패 시 시스템 선호도 사용
            initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
          }
        } else {
          // 저장된 테마가 없으면 시스템 선호도 사용
          initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        }
      } catch {
        // 오류 발생 시 현재 Zustand 스토어의 테마 사용
        initialTheme = theme === 'dark' ? 'dark' : 'light';
      }
    }

    // Giscus 스크립트 속성 설정
    const giscusAttributes = {
      src: 'https://giscus.app/client.js',
      'data-repo': process.env.NEXT_PUBLIC_GISCUS_REPO,
      'data-repo-id': process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
      'data-category': 'Comments',
      'data-category-id': process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      'data-mapping': identifier ? 'specific' : 'pathname',
      'data-strict': '1',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'top',
      'data-theme': initialTheme,
      'data-lang': 'ko',
      crossorigin: 'anonymous',
      async: 'true',
      ...(identifier && { 'data-term': String(identifier) }),
    };

    // Giscus 스크립트 생성 및 설정
    const script = document.createElement('script');
    Object.entries(giscusAttributes).forEach(([key, value]) => {
      if (typeof value !== 'undefined') {
        script.setAttribute(key, value as string);
      }
    });

    commentsRef.current.appendChild(script);
    isGiscusLoadedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identifier]); // theme는 초기 로드 시에만 필요하므로 의존성에서 제외

  // 테마 변경 시 Giscus에 메시지 전송 (스크립트 재로드 없이)
  useEffect(() => {
    if (!isGiscusLoadedRef.current) return;

    const giscusTheme = theme === 'dark' ? 'dark' : 'light';

    // Giscus iframe을 찾아서 테마 변경 메시지 전송
    const sendThemeMessage = () => {
      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            giscus: {
              setConfig: {
                theme: giscusTheme,
              },
            },
          },
          'https://giscus.app',
        );
      }
    };

    // iframe이 로드될 때까지 잠시 대기 후 메시지 전송
    const timer = setTimeout(sendThemeMessage, 100);

    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <section className={`w-full ${className}`} aria-label="Comments-Section">
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
