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

  // 초기 테마 설정 및 시스템 테마 변경 리스너 등록/해제
  // (initializeTheme이 반환한 정리 함수를 그대로 반환해 언마운트 시 리스너를 해제)
  useEffect(() => {
    return initializeTheme();
  }, [initializeTheme]);

  // 테마가 바뀔 때 전환 애니메이션만 처리한다.
  // data-theme 속성/클래스 자체는 store(setTheme/toggleTheme/initializeTheme)가
  // 이미 동기적으로 적용하므로 여기서 다시 쓰지 않는다.
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const { documentElement, body } = document;

    // 전환 애니메이션 클래스/인라인 스타일 적용
    documentElement.classList.add('theme-transition', 'theme-transitioning');
    documentElement.style.transition = 'background-color 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    body.style.transition =
      'background-color 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    // 애니메이션 흔적 원복 — CSS 기본 규칙이 다시 적용되도록 한다.
    const clearTransitionArtifacts = () => {
      documentElement.classList.remove('theme-transition', 'theme-transitioning');
      documentElement.style.transition = '';
      body.style.transition = '';
    };

    // 전환이 끝나면 정리
    const timer = setTimeout(clearTransitionArtifacts, 1000);

    // 타이머가 끝나기 전에 언마운트/재실행되어도 클래스·스타일이 DOM에 남지 않도록 함께 정리
    return () => {
      clearTimeout(timer);
      clearTransitionArtifacts();
    };
  }, [theme]);

  return <>{children}</>;
};
