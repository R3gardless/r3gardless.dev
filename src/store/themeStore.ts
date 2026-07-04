/**
 * @fileoverview 테마(다크 모드) 전역 상태 관리
 *
 * 이 파일은 Zustand를 사용하여 애플리케이션의 테마 상태를 관리합니다.
 *
 * 주요 기능:
 * - 라이트/다크 모드 전환
 * - localStorage를 통한 테마 설정 영속화
 * - 시스템 다크 모드 선호도 자동 감지
 * - 실시간 시스템 테마 변경 감지
 * - 안전한 DOM 조작 (기존 클래스 보존)
 *
 * 사용법:
 * 1. 앱 시작 시: initializeTheme() 호출
 * 2. 테마 토글: toggleTheme() 사용
 * 3. 특정 테마 설정: setTheme(theme) 사용
 *
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { THEME_STORAGE_KEY } from '@/constants';

/**
 * 테마 타입 정의
 * - light: 라이트 모드
 * - dark: 다크 모드
 */
type Theme = 'light' | 'dark';

/**
 * 테마 스토어 인터페이스
 */
interface ThemeStore {
  /** 현재 적용된 테마 */
  theme: Theme;
  /**
   * 사용자가 직접 테마를 선택했는지 여부.
   * true면 시스템 테마 변경을 더 이상 따라가지 않습니다.
   */
  userSelectedTheme: boolean;
  /** 테마 초기화 로딩 상태 */
  isLoading: boolean;
  /** 테마 토글 함수 (light ↔ dark) */
  toggleTheme: () => void;
  /** 특정 테마로 설정하는 함수 */
  setTheme: (theme: Theme) => void;
  /**
   * 앱 시작 시 테마 초기화 함수.
   * 시스템 테마 변경 리스너를 등록하며, 정리(해제) 함수를 반환합니다.
   */
  initializeTheme: () => (() => void) | void;
}

/**
 * DOM에 테마를 적용하는 공통 함수
 * - `data-theme` 속성 설정 (CSS `[data-theme="dark"]` 및 JS `dataset.theme` 모두 이 속성을 참조)
 * - CSS 클래스 안전하게 교체 (기존 클래스 보존)
 * - FOUC 방지 스크립트(layout.tsx)와 동일한 방식으로 적용
 *
 * @param theme - 적용할 테마 ('light' | 'dark')
 */
const applyThemeToDOM = (theme: Theme) => {
  // 서버 사이드에서는 DOM 조작 불가
  if (typeof window === 'undefined') return;

  // data-theme 속성 하나로 CSS 선택자와 element.dataset.theme 접근을 모두 커버
  document.documentElement.setAttribute('data-theme', theme);

  // 기존 테마 클래스들을 안전하게 제거하고 새 테마 클래스 추가 (다른 클래스는 보존)
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
};

/**
 * 사용자 시스템의 다크 모드 선호도를 감지하는 함수
 *
 * @returns 시스템 선호 테마 ('light' | 'dark')
 */
const getSystemTheme = (): Theme => {
  // 서버 사이드에서는 기본값 반환
  if (typeof window === 'undefined') return 'light';

  // CSS Media Query를 사용하여 시스템 다크 모드 선호도 확인
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * localStorage(Zustand persist)에 저장된 테마를 읽습니다.
 * 저장값이 없거나 파싱에 실패하면 null을 반환합니다. (호출부에서 시스템 테마로 폴백)
 */
const readPersistedTheme = (): Theme | null => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return (parsed.state?.theme as Theme | undefined) ?? null;
  } catch {
    return null;
  }
};

/**
 * 테마 관리를 위한 Zustand 스토어
 * - localStorage를 통한 테마 설정 영속화
 * - 시스템 테마 선호도 자동 감지
 * - 실시간 시스템 테마 변경 감지
 */
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      /** 기본 테마: light */
      theme: 'light',
      /** 사용자가 아직 명시적으로 테마를 고르지 않음 */
      userSelectedTheme: false,
      /** 초기화 중 상태 */
      isLoading: true,

      /**
       * 현재 테마를 반대 테마로 토글
       * light → dark, dark → light
       */
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // 사용자가 직접 선택했으므로 이후 시스템 테마 변경은 무시
        set({ theme: newTheme, userSelectedTheme: true });
        // DOM에 테마 적용
        applyThemeToDOM(newTheme);
      },

      /**
       * 특정 테마로 설정
       * @param theme - 설정할 테마
       */
      setTheme: (theme: Theme) => {
        // 사용자가 직접 선택했으므로 이후 시스템 테마 변경은 무시
        set({ theme, userSelectedTheme: true });
        // DOM에 테마 적용
        applyThemeToDOM(theme);
      },

      /**
       * 앱 시작 시 테마 초기화
       * 1. localStorage에서 저장된 테마 확인
       * 2. 저장된 테마가 없으면 시스템 선호도 사용
       * 3. 시스템 테마 변경 감지 리스너 등록
       * 4. DOM에 테마 적용 (FOUC 방지 스크립트와 동기화)
       *
       * 참고: FOUC 방지 스크립트가 이미 DOM에 테마를 적용했지만,
       * 일관성과 테스트를 위해 여기서도 DOM을 업데이트합니다.
       */
      initializeTheme: () => {
        // 서버 사이드에서는 실행하지 않음
        if (typeof window === 'undefined') return;

        const initialTheme = readPersistedTheme() ?? getSystemTheme();

        // FOUC 방지 스크립트가 이미 DOM에 테마를 적용했지만,
        // 일관성과 테스트를 위해 여기서도 DOM을 업데이트합니다.
        applyThemeToDOM(initialTheme);

        // 시스템 테마 변경 감지 리스너 등록
        // (사용자가 직접 테마를 고르기 전까지만 시스템 테마를 따름)
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          if (!get().userSelectedTheme) {
            const systemTheme: Theme = e.matches ? 'dark' : 'light';
            set({ theme: systemTheme });
            applyThemeToDOM(systemTheme);
          }
        };
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        // 초기화 완료 및 로딩 상태 해제
        set({ theme: initialTheme, isLoading: false });

        // 리스너 해제 함수 반환 (ThemeProvider의 useEffect가 언마운트 시 호출)
        return () => {
          mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      // localStorage에 저장할 상태 필드 선택 (theme·사용자 선택 여부만 저장, isLoading은 제외)
      partialize: (state: ThemeStore) => ({
        theme: state.theme,
        userSelectedTheme: state.userSelectedTheme,
      }),
    },
  ),
);

/**
 * 테마 초기화를 위한 편의 훅
 * 앱의 최상위 컴포넌트(layout.tsx, _app.tsx)에서 사용
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * const { initializeTheme } = useThemeInitializer();
 *
 * useEffect(() => {
 *   initializeTheme();
 * }, []);
 * ```
 */
export const useThemeInitializer = () => {
  const { initializeTheme } = useThemeStore();

  return { initializeTheme };
};
