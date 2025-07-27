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
  /** 테마 초기화 로딩 상태 */
  isLoading: boolean;
  /** 테마 토글 함수 (light ↔ dark) */
  toggleTheme: () => void;
  /** 특정 테마로 설정하는 함수 */
  setTheme: (theme: Theme) => void;
  /** 앱 시작 시 테마 초기화 함수 */
  initializeTheme: () => void;
}

/**
 * DOM에 테마를 적용하는 공통 함수
 * - data-theme 속성 설정
 * - dataset.theme 설정
 * - CSS 클래스 안전하게 교체 (기존 클래스 보존)
 * - FOUC 방지 스크립트와 동일한 방식으로 적용
 *
 * @param theme - 적용할 테마 ('light' | 'dark')
 */
const applyThemeToDOM = (theme: Theme) => {
  // 서버 사이드에서는 DOM 조작 불가
  if (typeof window === 'undefined') return;

  // CSS에서 [data-theme="dark"] 선택자로 사용 가능
  document.documentElement.setAttribute('data-theme', theme);
  // JavaScript에서 element.dataset.theme으로 접근 가능
  document.documentElement.dataset.theme = theme;

  // 기존 테마 클래스들을 안전하게 제거하고 새 테마 클래스 추가
  // 다른 클래스들은 건드리지 않음
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
      /** 초기화 중 상태 */
      isLoading: true,

      /**
       * 현재 테마를 반대 테마로 토글
       * light → dark, dark → light
       */
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // 스토어 상태 업데이트
        set({ theme: newTheme });
        // DOM에 테마 적용
        applyThemeToDOM(newTheme);
      },

      /**
       * 특정 테마로 설정
       * @param theme - 설정할 테마
       */
      setTheme: (theme: Theme) => {
        // 스토어 상태 업데이트
        set({ theme });
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

        const storedTheme = localStorage.getItem('theme-storage');
        let initialTheme: Theme = 'light';

        if (storedTheme) {
          try {
            // localStorage에서 Zustand persist 데이터 파싱
            const parsed = JSON.parse(storedTheme);
            initialTheme = parsed.state?.theme || getSystemTheme();
          } catch {
            // 파싱 실패 시 시스템 테마 사용
            initialTheme = getSystemTheme();
          }
        } else {
          // 저장된 테마가 없으면 시스템 선호도 사용
          initialTheme = getSystemTheme();
        }

        // FOUC 방지 스크립트가 이미 DOM에 테마를 적용했지만,
        // 일관성과 테스트를 위해 여기서도 DOM을 업데이트합니다.
        applyThemeToDOM(initialTheme);

        // 시스템 테마 변경 감지 리스너 등록
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          // 사용자가 명시적으로 테마를 설정하지 않은 경우에만 시스템 테마 따름
          const currentStoredTheme = localStorage.getItem('theme-storage');
          if (!currentStoredTheme) {
            const systemTheme = e.matches ? 'dark' : 'light';
            set({ theme: systemTheme });
            applyThemeToDOM(systemTheme);
          }
        };

        // 시스템 테마 변경 이벤트 리스너 등록
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        // 초기화 완료 및 로딩 상태 해제
        set({ theme: initialTheme, isLoading: false });

        // cleanup 함수 반환 (메모리 누수 방지용, 필요시 사용)
        return () => {
          mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
      },
    }),
    {
      // localStorage 키 이름
      name: 'theme-storage',
      // localStorage에 저장할 상태 필드 선택 (theme만 저장, isLoading은 제외)
      partialize: (state: ThemeStore) => ({ theme: state.theme }),
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
