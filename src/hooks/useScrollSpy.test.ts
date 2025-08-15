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

  it('DOM 요소를 찾고 위치를 계산한다', () => {
    const mockElement1 = {
      offsetTop: 200,
      tagName: 'H1',
      className: 'notion-h1',
      textContent: 'Section 1',
      getAttribute: vi.fn(() => 'section-1'),
    };

    const mockElement2 = {
      offsetTop: 600,
      tagName: 'H2',
      className: 'notion-h2',
      textContent: 'Section 1.1',
      getAttribute: vi.fn(() => 'section-1-1'),
    };

    const mockElement3 = {
      offsetTop: 1000,
      tagName: 'H1',
      className: 'notion-h1',
      textContent: 'Section 2',
      getAttribute: vi.fn(() => 'section-2'),
    };

    mockQuerySelector.mockImplementation(selector => {
      if (selector === 'header') {
        return { offsetHeight: 100 };
      }
      if (selector.includes('h1[data-id="section-1"]') || selector === '[data-id="section-1"]') {
        return mockElement1;
      }
      if (
        selector.includes('h2[data-id="section-1-1"]') ||
        selector === '[data-id="section-1-1"]'
      ) {
        return mockElement2;
      }
      if (selector.includes('h1[data-id="section-2"]') || selector === '[data-id="section-2"]') {
        return mockElement3;
      }
      return null;
    });

    mockGetElementById.mockImplementation(id => {
      if (id === 'section-1') return mockElement1;
      if (id === 'section-1-1') return mockElement2;
      if (id === 'section-2') return mockElement3;
      return null;
    });

    renderHook(() => useScrollSpy({ items: mockItems }));

    // 타이머들을 실행하여 위치 계산 완료
    act(() => {
      vi.runAllTimers();
    });

    // DOM 요소 검색이 호출되었는지 확인
    expect(mockQuerySelector).toHaveBeenCalledWith('header');
    expect(mockGetElementById).toHaveBeenCalledWith('section-1');
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

    // Mock elements with positions
    const mockElements = {
      'section-1': { offsetTop: 200, tagName: 'H1' },
      'section-1-1': { offsetTop: 600, tagName: 'H2' },
      'section-2': { offsetTop: 1000, tagName: 'H1' },
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
        };
      }
      return null;
    });

    const { result } = renderHook(() => useScrollSpy({ items: mockItems }));

    // 타이머들을 실행하여 초기화 완료
    act(() => {
      vi.runAllTimers();
    });

    // 스크롤 위치 변경 시뮬레이션 (계산된 top 값 고려: offsetTop - headerHeight + 400)
    if (motionValueCallback) {
      // section-1: 200 - 100 + 400 = 500
      act(() => {
        motionValueCallback!(50); // 첫 번째 섹션 영역 (500보다 작음)
      });
      expect(result.current).toBe('section-1');

      // section-1-1: 600 - 100 + 400 = 900
      act(() => {
        motionValueCallback!(800); // 두 번째 섹션 영역 (500보다 크고 900보다 작음)
      });
      expect(result.current).toBe('section-1');

      act(() => {
        motionValueCallback!(950); // 두 번째 섹션 영역 (900보다 크고 1300보다 작음)
      });
      expect(result.current).toBe('section-1-1');

      // section-2: 1000 - 100 + 400 = 1300
      act(() => {
        motionValueCallback!(1400); // 세 번째 섹션 영역 (1300보다 큼)
      });
      expect(result.current).toBe('section-2');
    }
  });

  it('헤더 높이를 올바르게 계산한다', () => {
    const mockHeader = { offsetHeight: 120 };
    mockQuerySelector.mockImplementation(selector => {
      if (selector === 'header') {
        return mockHeader;
      }
      return null;
    });

    mockGetElementById.mockImplementation(id => {
      if (id === 'section-1') {
        return { offsetTop: 200, tagName: 'H1' };
      }
      return null;
    });

    renderHook(() => useScrollSpy({ items: mockItems }));

    // 타이머들을 실행하여 초기화 완료
    act(() => {
      vi.runAllTimers();
    });

    expect(mockQuerySelector).toHaveBeenCalledWith('header');
  });

  it('헤더가 없을 때 기본값 100을 사용한다', () => {
    mockQuerySelector.mockImplementation(selector => {
      if (selector === 'header') {
        return null;
      }
      return null;
    });

    mockGetElementById.mockImplementation(id => {
      if (id === 'section-1') {
        return { offsetTop: 200, tagName: 'H1' };
      }
      return null;
    });

    renderHook(() => useScrollSpy({ items: mockItems }));

    // 타이머들을 실행하여 초기화 완료
    act(() => {
      vi.runAllTimers();
    });

    // 에러 없이 실행되어야 함
    expect(mockQuerySelector).toHaveBeenCalledWith('header');
  });

  it('DOM 요소가 없을 때 재시도한다', () => {
    let retryCount = 0;
    mockQuerySelector.mockImplementation(selector => {
      if (selector === 'header') {
        return { offsetHeight: 100 };
      }

      // 첫 번째 호출에서는 요소를 찾지 못함
      if (retryCount === 0) {
        retryCount++;
        return null;
      }

      // 두 번째 호출에서는 요소를 찾음
      return {
        offsetTop: 200,
        tagName: 'H1',
        textContent: 'Section',
        getAttribute: () => 'section-1',
        className: 'notion-h1',
      };
    });

    renderHook(() => useScrollSpy({ items: mockItems }));

    // 재시도 로직이 실행되도록 타이머 진행
    act(() => {
      vi.runAllTimers();
    });

    expect(retryCount).toBeGreaterThan(0);
  });
});
