import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useScroll, useMotionValueEvent } from 'framer-motion';

import { TableOfContentsItem } from '@/types/blog';

import useScrollSpy from './useScrollSpy';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  useScroll: vi.fn(),
  useMotionValueEvent: vi.fn(),
}));

const mockUseScroll = vi.mocked(useScroll);
const mockUseMotionValueEvent = vi.mocked(useMotionValueEvent);

// Mock DOM methods
const mockQuerySelector = vi.fn();
const mockGetElementById = vi.fn();

Object.defineProperty(document, 'querySelector', {
  writable: true,
  value: mockQuerySelector,
});

Object.defineProperty(document, 'getElementById', {
  writable: true,
  value: mockGetElementById,
});

Object.defineProperty(document, 'querySelectorAll', {
  writable: true,
  value: vi.fn(() => []),
});

Object.defineProperty(document, 'readyState', {
  writable: true,
  value: 'complete',
});

const mockItems: TableOfContentsItem[] = [
  {
    id: 'section-1',
    title: 'Section 1',
    level: 1,
    children: [
      {
        id: 'section-1-1',
        title: 'Section 1.1',
        level: 2,
      },
    ],
  },
  {
    id: 'section-2',
    title: 'Section 2',
    level: 1,
  },
];

describe('useScrollSpy', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock header element
    mockQuerySelector.mockImplementation(selector => {
      if (selector === 'header') {
        return { offsetHeight: 100 };
      }
      return null;
    });

    // Mock scroll object
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUseScroll.mockReturnValue({
      scrollX: { get: () => 0 } as any,
      scrollY: { get: () => 0 } as any,
      scrollXProgress: { get: () => 0 } as any,
      scrollYProgress: { get: () => 0 } as any,
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Reset timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('isEnabled가 false일 때 빈 문자열을 반환한다', () => {
    const { result } = renderHook(() => useScrollSpy({ items: mockItems, isEnabled: false }));

    expect(result.current).toBe('');
  });

  it('items가 비어있을 때 빈 문자열을 반환한다', () => {
    const { result } = renderHook(() => useScrollSpy({ items: [], isEnabled: true }));

    expect(result.current).toBe('');
  });

  it('스크롤 위치에 따라 활성 섹션을 업데이트한다', () => {
    const mockScrollValue = { get: vi.fn(() => 0) };
    let motionValueCallback: ((latest: number) => void) | null = null;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUseScroll.mockReturnValue({
      scrollX: mockScrollValue as any,
      scrollY: mockScrollValue as any,
      scrollXProgress: { get: () => 0 } as any,
      scrollYProgress: { get: () => 0 } as any,
    });

    mockUseMotionValueEvent.mockImplementation((_value: any, _event: any, callback: any) => {
      motionValueCallback = callback;
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Mock elements with positions and offsetParent chain
    const mockElements = {
      'section-1': {
        offsetTop: 200,
        tagName: 'H1',
        offsetParent: null, // 절대 위치 계산을 위한 offsetParent 체인의 끝
      },
      'section-1-1': {
        offsetTop: 600,
        tagName: 'H2',
        offsetParent: null,
      },
      'section-2': {
        offsetTop: 1000,
        tagName: 'H1',
        offsetParent: null,
      },
    };

    mockQuerySelector.mockImplementation(selector => {
      if (selector === 'header') {
        return { offsetHeight: 100 };
      }
      return null;
    });

    mockGetElementById.mockImplementation(id => {
      if (mockElements[id as keyof typeof mockElements]) {
        return {
          ...mockElements[id as keyof typeof mockElements],
          textContent: `Section ${id}`,
          getAttribute: () => id,
          className: 'notion-h1',
          offsetParent: null, // offsetParent 체인의 끝
        };
      }
      return null;
    });

    const { result } = renderHook(() => useScrollSpy({ items: mockItems }));

    // 타이머들을 실행하여 초기화 완료
    act(() => {
      vi.runAllTimers();
    });

    // 스크롤 위치 변경 시뮬레이션 (새로운 계산 방식: offsetTop - headerHeight - 80)
    if (motionValueCallback) {
      // section-1: 200 - 100 - 80 = 20, bottom = 520 (section-1-1까지)
      act(() => {
        motionValueCallback!(10); // 첫 번째 섹션 영역 전 (20보다 작음)
      });
      expect(result.current).toBe('section-1'); // 기본값 (첫 번째)

      act(() => {
        motionValueCallback!(50); // 첫 번째 섹션 영역 (20 <= scroll < 520)
      });
      expect(result.current).toBe('section-1');

      // section-1-1: 600 - 100 - 80 = 420, bottom = 920 (section-2까지)
      act(() => {
        motionValueCallback!(500); // 두 번째 섹션 영역 (420 <= scroll < 920)
      });
      expect(result.current).toBe('section-1-1');

      // section-2: 1000 - 100 - 80 = 820, bottom = Number.MAX_SAFE_INTEGER
      act(() => {
        motionValueCallback!(900); // 세 번째 섹션 영역 (820 <= scroll)
      });
      expect(result.current).toBe('section-2');
    }
  });
});
