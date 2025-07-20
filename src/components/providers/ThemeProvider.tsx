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

  // 테마가 변경될 때 HTML 요소에 data-theme 속성 설정
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return <>{children}</>;
};
