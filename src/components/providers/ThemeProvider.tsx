'use client';

import React, { useEffect } from 'react';

import { useThemeStore } from '@/store/themeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider 컴포넌트
 *
 * 테마 시스템을 관리하는 Context Provider
 * - 초기 테마 설정
 * - 로컬 스토리지에서 테마 복원
 * - 다크/라이트 모드 자동 적용
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, initializeTheme } = useThemeStore();

  // 초기 테마 설정
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // 테마가 변경될 때 HTML 요소에 data-theme 속성 설정 및 애니메이션 처리
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const documentElement = document.documentElement;
      const bodyElement = document.body;

      // 테마 전환 중임을 표시
      documentElement.classList.add('theme-transitioning');

      // 기존 테마 클래스 제거
      documentElement.classList.remove('theme-transition');

      // 테마 전환 애니메이션 클래스 추가
      documentElement.classList.add('theme-transition');

      // 인라인 스타일로 강제 전환 적용
      documentElement.style.transition = 'background-color 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      bodyElement.style.transition =
        'background-color 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      // 테마 속성 설정 (FOUC 방지 스크립트와 동기화)
      documentElement.setAttribute('data-theme', theme);
      documentElement.dataset.theme = theme;

      // 기존 테마 클래스 제거 후 새 테마 클래스 추가
      documentElement.classList.remove('light', 'dark');
      documentElement.classList.add(theme);

      // 전환 애니메이션이 완료된 후 클래스 제거 (1000ms로 증가)
      const timer = setTimeout(() => {
        documentElement.classList.remove('theme-transition', 'theme-transitioning');
        // 인라인 스타일 제거 (CSS가 다시 적용되도록)
        documentElement.style.transition = '';
        bodyElement.style.transition = '';
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [theme]);

  return <>{children}</>;
};
