import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { ThemeProvider } from './ThemeProvider';

const storeMocks = vi.hoisted(() => ({
  theme: 'light' as 'light' | 'dark',
  cleanup: vi.fn(),
  initializeTheme: vi.fn(),
}));

vi.mock('@/store/themeStore', () => ({
  useThemeStore: () => ({
    theme: storeMocks.theme,
    initializeTheme: storeMocks.initializeTheme,
  }),
}));

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    storeMocks.theme = 'light';
    storeMocks.cleanup.mockClear();
    storeMocks.initializeTheme.mockClear();
    storeMocks.initializeTheme.mockReturnValue(storeMocks.cleanup);
  });

  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.classList.remove('theme-transition', 'theme-transitioning');
    document.documentElement.style.transition = '';
    document.body.style.transition = '';
  });

  it('children을 렌더링한다', () => {
    render(
      <ThemeProvider>
        <span>테마 자식</span>
      </ThemeProvider>,
    );

    expect(screen.getByText('테마 자식')).toBeInTheDocument();
  });

  it('마운트 시 initializeTheme을 호출하고 언마운트 시 정리 함수를 호출한다', () => {
    const { unmount } = render(<ThemeProvider>content</ThemeProvider>);

    expect(storeMocks.initializeTheme).toHaveBeenCalledTimes(1);
    expect(storeMocks.cleanup).not.toHaveBeenCalled();

    unmount();
    expect(storeMocks.cleanup).toHaveBeenCalledTimes(1);
  });

  it('테마 전환 애니메이션 클래스를 부여하고 1초 후 정리한다', () => {
    render(<ThemeProvider>content</ThemeProvider>);

    const html = document.documentElement;
    expect(html.classList.contains('theme-transition')).toBe(true);
    expect(html.classList.contains('theme-transitioning')).toBe(true);
    expect(html.style.transition).toContain('background-color');
    expect(document.body.style.transition).toContain('color');

    vi.advanceTimersByTime(1000);

    expect(html.classList.contains('theme-transition')).toBe(false);
    expect(html.classList.contains('theme-transitioning')).toBe(false);
    expect(html.style.transition).toBe('');
    expect(document.body.style.transition).toBe('');
  });

  it('타이머가 끝나기 전에 언마운트되어도 전환 클래스와 스타일을 정리한다', () => {
    const { unmount } = render(<ThemeProvider>content</ThemeProvider>);

    expect(document.documentElement.classList.contains('theme-transitioning')).toBe(true);

    unmount();

    expect(document.documentElement.classList.contains('theme-transition')).toBe(false);
    expect(document.documentElement.classList.contains('theme-transitioning')).toBe(false);
    expect(document.documentElement.style.transition).toBe('');
    expect(document.body.style.transition).toBe('');
  });
});
