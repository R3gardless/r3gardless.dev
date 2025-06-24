/**
 * @fileoverview Storybook용 테마 토글 버튼 컴포넌트
 * 
 * Storybook 환경에서 라이트/다크 모드를 쉽게 전환할 수 있는
 * 고정 위치 토글 버튼을 제공합니다.
 * Docs 페이지에서는 자동으로 숨겨집니다.
 */

import React, { useEffect, useState } from 'react';
import { useThemeStore } from '../../src/store/themeStore';

/**
 * Storybook 전용 테마 토글 버튼
 * 
 * 화면 우측 하단에 고정된 위치에 버튼을 표시하여
 * 개발자가 Storybook에서 컴포넌트의 다크/라이트 모드를
 * 쉽게 테스트할 수 있도록 합니다.
 * 
 * Docs 탭에서는 자동으로 숨겨지고, Canvas(Story) 탭에서만 표시됩니다.
 * 
 * @returns JSX.Element - 테마 토글 버튼
 */
export const ThemeToggle = () => {
  // Zustand 스토어에서 현재 테마와 토글 함수 가져오기
  const { theme, toggleTheme } = useThemeStore();
  // Docs 페이지 감지를 위한 상태
  const [isDocsPage, setIsDocsPage] = useState(false);

  useEffect(() => {
    // URL이나 DOM을 통해 현재 페이지가 Docs인지 확인
    const checkIfDocsPage = () => {
      // Storybook의 Docs 페이지는 URL에 'docs'가 포함되거나
      // body에 특정 클래스가 있습니다
      const url = window.location.href;
      const isUrlDocs = url.includes('docs') || url.includes('viewMode=docs');
      
      // DOM을 통한 확인 (Storybook Docs 페이지의 특정 요소 확인)
      const docsRoot = document.querySelector('.docs-story') || 
                      document.querySelector('[data-docs-root]') ||
                      document.querySelector('.sbdocs');
      
      setIsDocsPage(isUrlDocs || !!docsRoot);
    };

    // 초기 체크
    checkIfDocsPage();

    // URL 변경 감지 (Storybook은 SPA이므로)
    const handleUrlChange = () => {
      setTimeout(checkIfDocsPage, 100); // DOM 업데이트 대기
    };

    // popstate 이벤트 리스너 (뒤로가기/앞으로가기)
    window.addEventListener('popstate', handleUrlChange);
    
    // MutationObserver로 DOM 변경 감지 (더 정확한 감지)
    const observer = new MutationObserver(handleUrlChange);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['class', 'data-docs-root']
    });

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      observer.disconnect();
    };
  }, []);

  // Docs 페이지에서는 렌더링하지 않음
  if (isDocsPage) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        // 화면 우측 하단 고정 위치
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        // 버튼 스타일링
        padding: '0.5rem 1rem',
        background: '#222',
        color: '#fff',
        borderRadius: 8,
        // Storybook UI보다 위에 표시
        zIndex: 9999,
        // 호버 효과를 위한 기본 스타일
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s ease',
      }}
      // 마우스 호버 시 배경색 변경
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#333';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#222';
      }}
    >
      {/* 현재 테마에 따라 다음 전환될 테마 표시 */}
      Toggle {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};
