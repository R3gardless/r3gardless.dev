/**
 * @fileoverview 테마 스토어 단위 테스트
 *
 * 테스트 범위:
 * - 기본 테마 상태 및 토글 기능
 * - localStorage를 통한 테마 영속화
 * - DOM 조작 및 CSS 클래스 관리
 * - 시스템 테마 선호도 감지 및 실시간 변경 감지
 * - 서버 사이드 렌더링 안전성
 * - 에러 처리 및 fallback 동작
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useThemeStore, useThemeInitializer } from '@/store/themeStore';

// DOM 환경 설정을 위한 헬퍼
const setupDOMEnvironment = () => {
  // jsdom 환경에서도 matchMedia mock 설정
  const mockMatchMedia = vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }));

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });

  return mockMatchMedia;
};

describe('useThemeStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 상태 초기화
    localStorage.clear();

    // DOM 요소가 존재하는지 확인하고 초기화
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.className = '';
      document.documentElement.dataset.theme = '';
      document.documentElement.removeAttribute('data-theme');
    }

    // matchMedia mock 설정
    setupDOMEnvironment();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('기본 상태', () => {
    it('기본 테마는 light이어야 한다', () => {
      const { result } = renderHook(() => useThemeStore());
      expect(result.current.theme).toBe('light');
    });

    it('초기 로딩 상태는 true이어야 한다', () => {
      const { result } = renderHook(() => useThemeStore());
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('테마 토글 기능', () => {
    it('toggleTheme은 light에서 dark로 전환한다', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.dataset.theme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('toggleTheme은 dark에서 light로 전환한다', () => {
      const { result } = renderHook(() => useThemeStore());

      // 먼저 dark로 설정
      act(() => {
        result.current.setTheme('dark');
      });

      // 다시 토글
      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.dataset.theme).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('테마 설정 기능', () => {
    it('setTheme으로 dark 테마를 설정할 수 있다', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.dataset.theme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('setTheme으로 light 테마를 설정할 수 있다', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.dataset.theme).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
    });
  });

  describe('DOM 조작 안전성', () => {
    it('기존 CSS 클래스를 보존하면서 테마 클래스를 교체한다', () => {
      // 기존 클래스 추가
      document.documentElement.classList.add('existing-class', 'another-class');

      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('dark');
      });

      // 기존 클래스는 보존되고 테마 클래스만 추가됨
      expect(document.documentElement.classList.contains('existing-class')).toBe(true);
      expect(document.documentElement.classList.contains('another-class')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('테마 변경 시 이전 테마 클래스를 제거한다', () => {
      const { result } = renderHook(() => useThemeStore());

      // dark 설정
      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);

      // light로 변경
      act(() => {
        result.current.setTheme('light');
      });

      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('시스템 테마 감지', () => {
    it('시스템이 다크 모드일 때 initializeTheme이 dark 테마를 설정한다', () => {
      // 시스템 다크 모드 상태로 설정
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn((query: string) => ({
          matches: true,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.initializeTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.isLoading).toBe(false);
      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('시스템이 라이트 모드일 때 initializeTheme이 light 테마를 설정한다', () => {
      // 시스템 라이트 모드 상태로 설정
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn((query: string) => ({
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.initializeTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.isLoading).toBe(false);
      expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('시스템 테마 변경 이벤트 리스너를 등록한다', () => {
      const mockAddEventListener = vi.fn();

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn((query: string) => ({
          matches: false,
          media: query,
          addEventListener: mockAddEventListener,
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.initializeTheme();
      });

      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });
  });

  describe('localStorage 영속화', () => {
    it('저장된 테마가 있을 때 initializeTheme이 해당 테마를 복원한다', () => {
      // localStorage에 dark 테마 저장
      const mockThemeData = {
        state: { theme: 'dark' },
        version: 0,
      };
      localStorage.setItem('theme-storage', JSON.stringify(mockThemeData));

      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.initializeTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('잘못된 localStorage 데이터가 있을 때 시스템 테마를 사용한다', () => {
      // 잘못된 JSON 데이터 저장
      localStorage.setItem('theme-storage', 'invalid-json');

      // 시스템 다크 모드로 설정
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn((query: string) => ({
          matches: true,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.initializeTheme();
      });

      expect(result.current.theme).toBe('dark'); // 시스템 테마 사용
    });

    it('테마 변경이 localStorage에 저장된다', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('dark');
      });

      // localStorage에서 데이터 확인
      const storedData = localStorage.getItem('theme-storage');
      expect(storedData).toBeTruthy();

      const parsedData = JSON.parse(storedData!);
      expect(parsedData.state.theme).toBe('dark');
    });
  });
});

describe('useThemeInitializer', () => {
  beforeEach(() => {
    localStorage.clear();

    // DOM 요소가 존재하는지 확인하고 초기화
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.className = '';
      document.documentElement.dataset.theme = '';
      document.documentElement.removeAttribute('data-theme');
    }

    // matchMedia mock 설정
    setupDOMEnvironment();
  });

  it('initializeTheme 함수를 반환한다', () => {
    const { result } = renderHook(() => useThemeInitializer());

    expect(typeof result.current.initializeTheme).toBe('function');
  });

  it('반환된 initializeTheme 함수가 정상적으로 동작한다', () => {
    const { result } = renderHook(() => useThemeInitializer());

    expect(() => {
      act(() => {
        result.current.initializeTheme();
      });
    }).not.toThrow();
  });
});
