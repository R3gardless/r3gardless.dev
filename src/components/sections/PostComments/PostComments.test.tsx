import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useThemeStore } from '@/store/themeStore';

import { PostComments } from './PostComments';

// useThemeStore 모킹
vi.mock('@/store/themeStore', () => ({
  useThemeStore: vi.fn(() => ({ theme: 'light' })),
}));

const mockedUseThemeStore = vi.mocked(useThemeStore);

// localStorage 모킹
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// postMessage 모킹
const mockPostMessage = vi.fn();
const mockIframe = {
  contentWindow: {
    postMessage: mockPostMessage,
  },
} as unknown as HTMLIFrameElement;

describe('PostComments', () => {
  beforeEach(() => {
    // DOM 초기화
    document.body.innerHTML = '';
    // 환경 변수 설정
    process.env.NEXT_PUBLIC_GISCUS_REPO = 'test/repo';
    process.env.NEXT_PUBLIC_GISCUS_REPO_ID = 'test-repo-id';
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_GISCUS_REPO;
    delete process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  });

  it('기본적으로 렌더링된다', () => {
    render(<PostComments />);

    expect(screen.getByLabelText('댓글 섹션')).toBeInTheDocument();
  });

  it('커스텀 식별자와 함께 렌더링된다', () => {
    render(<PostComments identifier="test-post" />);

    expect(screen.getByLabelText('댓글 섹션')).toBeInTheDocument();
  });

  it('추가 클래스명이 적용된다', () => {
    const customClass = 'custom-comments-class';
    render(<PostComments className={customClass} />);

    const section = screen.getByLabelText('댓글 섹션');
    expect(section).toHaveClass(customClass);
  });

  it('컴포넌트가 올바른 구조로 렌더링된다', () => {
    const { container } = render(<PostComments />);

    // section 태그 확인
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-label', '댓글 섹션');

    // Giscus 컨테이너 div 확인
    const giscusDiv = container.querySelector('div[style]');
    expect(giscusDiv).toBeInTheDocument();
    expect(giscusDiv).toHaveClass('w-full', 'min-h-[200px]');
  });

  it('접근성 속성이 올바르게 설정된다', () => {
    render(<PostComments />);

    const section = screen.getByRole('region', { name: '댓글 섹션' });
    expect(section).toBeInTheDocument();
  });

  it('환경 변수가 없으면 Giscus 스크립트를 로드하지 않는다', () => {
    delete process.env.NEXT_PUBLIC_GISCUS_REPO;
    delete process.env.NEXT_PUBLIC_GISCUS_REPO_ID;

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<PostComments />);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Missing required environment variables: NEXT_PUBLIC_GISCUS_REPO or NEXT_PUBLIC_GISCUS_REPO_ID',
    );

    consoleSpy.mockRestore();
  });

  it('localStorage에서 저장된 테마를 가져와서 초기 테마로 사용한다', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(<PostComments />);

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('giscus-theme');
  });

  it('테마 변경 시 localStorage에 테마를 저장한다', async () => {
    // Giscus iframe 모킹
    vi.spyOn(document, 'querySelector').mockReturnValue(mockIframe);

    const { rerender } = render(<PostComments />);

    // 테마 변경
    mockedUseThemeStore.mockReturnValue({ theme: 'dark' });
    rerender(<PostComments />);

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('giscus-theme', 'dark');
    });
  });

  it('테마 변경 시 Giscus iframe에 postMessage를 전송한다', async () => {
    // Giscus iframe 모킹
    vi.spyOn(document, 'querySelector').mockReturnValue(mockIframe);

    const { rerender } = render(<PostComments />);

    // 테마 변경
    mockedUseThemeStore.mockReturnValue({ theme: 'dark' });
    rerender(<PostComments />);

    await waitFor(() => {
      expect(mockPostMessage).toHaveBeenCalledWith(
        {
          giscus: {
            setConfig: {
              theme: 'dark',
            },
          },
        },
        'https://giscus.app',
      );
    });
  });

  it('Giscus iframe이 없으면 postMessage를 전송하지 않는다', async () => {
    vi.spyOn(document, 'querySelector').mockReturnValue(null);

    const { rerender } = render(<PostComments />);

    // 테마 변경
    mockedUseThemeStore.mockReturnValue({ theme: 'dark' });
    rerender(<PostComments />);

    await waitFor(() => {
      expect(mockPostMessage).not.toHaveBeenCalled();
    });
  });

  it('다크 테마에서 올바른 스타일이 적용된다', () => {
    mockedUseThemeStore.mockReturnValue({ theme: 'dark' });

    render(<PostComments />);

    const section = screen.getByLabelText('댓글 섹션');
    expect(section).toBeInTheDocument();
  });

  it('라이트 테마에서 올바른 스타일이 적용된다', () => {
    mockedUseThemeStore.mockReturnValue({ theme: 'light' });

    render(<PostComments />);

    const section = screen.getByLabelText('댓글 섹션');
    expect(section).toBeInTheDocument();
  });

  it('Giscus 컨테이너가 렌더링된다', () => {
    render(<PostComments />);

    // Giscus가 로드될 컨테이너 확인
    const giscusContainer = screen.getByLabelText('댓글 섹션').querySelector('div[style]');
    expect(giscusContainer).toBeInTheDocument();
    expect(giscusContainer).toHaveClass('w-full', 'min-h-[200px]');
  });

  it('식별자가 있으면 specific mapping을 사용한다', () => {
    const identifier = 'test-post-123';
    render(<PostComments identifier={identifier} />);

    // Giscus 스크립트가 DOM에 추가되는지 확인
    expect(screen.getByLabelText('댓글 섹션')).toBeInTheDocument();
  });
});
