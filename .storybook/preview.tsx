/**
 * @fileoverview Storybook 설정 및 테마 데코레이터
 * 
 * Storybook에서 Zustand 테마 스토어를 사용하여 글로벌 테마 관리를
 * 구현하는 설정 파일입니다.
 */

import type { Preview } from '@storybook/react-vite';
import React, { useEffect } from 'react';
import { useThemeStore } from '../src/store/themeStore';
import '../src/styles/globals.css';
import { ThemeToggle } from './components/ThemeToggle';

/**
 * Zustand 테마 스토어와 Storybook을 연동하는 데코레이터
 * 
 * 모든 Story에 적용되어 다음 기능을 제공합니다:
 * 1. 테마 상태 변경 시 DOM에 자동 적용
 * 2. 테마 토글 버튼 표시
 * 3. CSS 변수 기반 테마 시스템 활성화
 * 
 * @param Story - 렌더링할 스토리 컴포넌트
 * @returns JSX.Element - 테마가 적용된 스토리와 토글 버튼
 */
const withZustandTheme = (Story: any) => {
  // Zustand 스토어에서 현재 테마 상태 구독
  const theme = useThemeStore((state) => state.theme);

  // 테마 변경 시 DOM에 적용
  useEffect(() => {
    // data-theme 속성 설정 (CSS 변수 전환용)
    document.documentElement.setAttribute('data-theme', theme);
    // 클래스명 설정 (추가적인 CSS 선택자용)
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <>
      {/* 테마 토글 버튼 - 모든 스토리에 표시 */}
      <ThemeToggle />
      {/* 실제 스토리 컴포넌트 렌더링 */}
      <Story />
    </>
  );
};

/**
 * Storybook Preview 설정
 * 
 * 모든 스토리에 적용되는 글로벌 설정을 정의합니다.
 */
const preview: Preview = {
  // 모든 스토리에 적용할 데코레이터 목록
  decorators: [
    withZustandTheme, // Zustand 테마 데코레이터 적용
  ],
  
  // Storybook Controls 설정
  parameters: {
    controls: {
      matchers: {
        // 색상 관련 props 자동 감지
        color: /(background|color)$/i,
        // 날짜 관련 props 자동 감지  
        date: /Date$/i,
      },
    },
  },
};

export default preview;
