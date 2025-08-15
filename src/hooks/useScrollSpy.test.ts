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

    // Mock scroll object
    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUseScroll.mockReturnValue({
      scrollX: { get: () => 0 } as any,
      scrollY: { get: () => 0 } as any,
      scrollXProgress: { get: () => 0 } as any,
      scrollYProgress: { get: () => 0 } as any,
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */
  });

  it('isEnabled가 false일 때 빈 문자열을 반환한다', () => {
    const { result } = renderHook(() => useScrollSpy({ items: mockItems, isEnabled: false }));
    expect(result.current).toBe('');
  });

  it('items가 비어있을 때 빈 문자열을 반환한다', () => {
    const { result } = renderHook(() => useScrollSpy({ items: [], isEnabled: true }));
    expect(result.current).toBe('');
  });

  it('스크롤 위치에 따라 활성 섹션을 실시간으로 업데이트한다', () => {
    const mockScrollValue = { get: vi.fn(() => 0) };
    let motionValueCallback: ((latest: number) => void) | null = null;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUseScroll.mockReturnValue({
      scrollX: mockScrollValue as any,
      scrollY: mockScrollValue as any,
      scrollXProgress: { get: () => 0 } as any,
      scrollYProgress: { get: () => 0 } as any,
    });

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUseMotionValueEvent.mockImplementation((_value: any, _event: any, callback: any) => {
      motionValueCallback = callback;
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Mock elements with offsetParent chain for accurate position calculation
    const createMockElement = (offsetTop: number, tagName: string, id: string) => ({
      offsetTop,
      tagName,
      textContent: `Section ${id}`,
      getAttribute: () => id,
      className: `notion-${tagName.toLowerCase()}`,
      offsetParent: null, // No parent for simplicity
    });

    const mockElements = {
      'section-1': createMockElement(200, 'H1', 'section-1'),
      'section-1-1': createMockElement(600, 'H2', 'section-1-1'),
      'section-2': createMockElement(1000, 'H1', 'section-2'),
    };

    // Mock header
    mockQuerySelector.mockImplementation(selector => {
      if (selector === 'header') {
        return { offsetHeight: 100 };
      }

      // Mock element selection for data-id queries
      for (const [id, element] of Object.entries(mockElements)) {
        if (selector.includes(`[data-id="${id}"]`) || selector.includes(`data-id="${id}"`)) {
          return element;
        }
      }

      return null;
    });

    mockGetElementById.mockImplementation(id => {
      return mockElements[id as keyof typeof mockElements] || null;
    });

    const { result } = renderHook(() => useScrollSpy({ items: mockItems }));

    // 실시간 계산 방식 테스트: offsetTop - headerHeight - 50
    if (motionValueCallback) {
      // section-1: 200 - 100 - 50 = 50, bottom = 450 (section-1-1까지)
      act(() => {
        motionValueCallback!(30); // 첫 번째 섹션 영역 전 (50보다 작음)
      });
      expect(result.current).toBe('section-1'); // 기본값

      act(() => {
        motionValueCallback!(100); // 첫 번째 섹션 영역 (50 <= scroll < 450)
      });
      expect(result.current).toBe('section-1');

      // section-1-1: 600 - 100 - 50 = 450, bottom = 850 (section-2까지)
      act(() => {
        motionValueCallback!(500); // 두 번째 섹션 영역 (450 <= scroll < 850)
      });
      expect(result.current).toBe('section-1-1');

      // section-2: 1000 - 100 - 50 = 850, bottom = Infinity
      act(() => {
        motionValueCallback!(900); // 세 번째 섹션 영역 (850 <= scroll)
      });
      expect(result.current).toBe('section-2');
    }
  });

  it('헤더 높이를 올바르게 계산한다', () => {
    const mockHeader = { offsetHeight: 120 };
    let motionValueCallback: ((latest: number) => void) | null = null;

    mockQuerySelector.mockImplementation(selector => {
      if (selector === 'header') {
        return mockHeader;
      }
      if (selector.includes('[data-id="section-1"]')) {
        return { offsetTop: 200, tagName: 'H1', offsetParent: null };
      }
      return null;
    });

    mockGetElementById.mockImplementation(id => {
      if (id === 'section-1') {
        return { offsetTop: 200, tagName: 'H1', offsetParent: null };
      }
      return null;
    });

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUseMotionValueEvent.mockImplementation((_value: any, _event: any, callback: any) => {
      motionValueCallback = callback;
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { result } = renderHook(() => useScrollSpy({ items: mockItems }));

    // 커스텀 헤더 높이로 계산: 200 - 120 - 50 = 30
    if (motionValueCallback) {
      act(() => {
        motionValueCallback!(50); // 30 이상이므로 section-1 활성화
      });
      expect(result.current).toBe('section-1');
    }
  });

  it('헤더가 없을 때 기본값 100을 사용한다', () => {
    let motionValueCallback: ((latest: number) => void) | null = null;

    mockQuerySelector.mockImplementation(selector => {
      if (selector === 'header') {
        return null; // 헤더 없음
      }
      if (selector.includes('[data-id="section-1"]')) {
        return { offsetTop: 200, tagName: 'H1', offsetParent: null };
      }
      return null;
    });

    mockGetElementById.mockImplementation(id => {
      if (id === 'section-1') {
        return { offsetTop: 200, tagName: 'H1', offsetParent: null };
      }
      return null;
    });

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUseMotionValueEvent.mockImplementation((_value: any, _event: any, callback: any) => {
      motionValueCallback = callback;
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { result } = renderHook(() => useScrollSpy({ items: mockItems }));

    // 기본 헤더 높이로 계산: 200 - 100 - 50 = 50
    if (motionValueCallback) {
      act(() => {
        motionValueCallback!(70); // 50 이상이므로 section-1 활성화
      });
      expect(result.current).toBe('section-1');
    }
  });

  it('DOM 요소를 찾지 못할 때 해당 요소를 건너뛴다', () => {
    let motionValueCallback: ((latest: number) => void) | null = null;

    mockQuerySelector.mockImplementation(selector => {
      if (selector === 'header') {
        return { offsetHeight: 100 };
      }
      // section-1만 찾을 수 있음, section-1-1과 section-2는 찾을 수 없음
      if (selector.includes('[data-id="section-1"]') && !selector.includes('section-1-1')) {
        return { offsetTop: 200, tagName: 'H1', offsetParent: null };
      }
      return null;
    });

    mockGetElementById.mockImplementation(id => {
      if (id === 'section-1') {
        return { offsetTop: 200, tagName: 'H1', offsetParent: null };
      }
      return null;
    });

    /* eslint-disable @typescript-eslint/no-explicit-any */
    mockUseMotionValueEvent.mockImplementation((_value: any, _event: any, callback: any) => {
      motionValueCallback = callback;
    });
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const { result } = renderHook(() => useScrollSpy({ items: mockItems }));

    // section-1만 있으므로 이것이 활성화됨
    if (motionValueCallback) {
      act(() => {
        motionValueCallback!(100);
      });
      expect(result.current).toBe('section-1');
    }
  });
});
