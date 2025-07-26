import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useThemeStore } from '@/store/themeStore';

import { PostComments } from './PostComments';

// useThemeStore 모킹
vi.mock('@/store/themeStore', () => ({
  useThemeStore: vi.fn(() => ({ theme: 'light' })),
}));

const mockedUseThemeStore = vi.mocked(useThemeStore);

describe('PostComments', () => {
  beforeEach(() => {
    // DOM 초기화
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
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
});
