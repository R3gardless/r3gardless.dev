import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { usePathname } from 'next/navigation';

import { useThemeStore } from '@/store/themeStore';

import { Header } from './Header';

// Zustand store 모킹
vi.mock('@/store/themeStore', () => ({
  useThemeStore: vi.fn(),
}));

// Next.js hooks 모킹
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Next.js Image 컴포넌트 모킹
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

// Lucide React 아이콘 모킹
vi.mock('lucide-react', () => ({
  Menu: ({ size, className }: { size: number; className?: string }) => (
    <div data-testid="menu-icon" data-size={size} className={className}>
      Menu
    </div>
  ),
  X: ({ size, className }: { size: number; className?: string }) => (
    <div data-testid="x-icon" data-size={size} className={className}>
      X
    </div>
  ),
}));

// Next.js Link 컴포넌트 모킹
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    style,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <a href={href} className={className} style={style}>
      {children}
    </a>
  ),
}));

// Config 모킹
vi.mock('@/utils/config', () => ({
  getSiteConfig: () => ({
    site: {
      name: 'R3gardless.dev',
      url: 'https://r3gardless.dev',
    },
  }),
}));

// Typography 컴포넌트 모킹
vi.mock('@/components/ui/atoms/Typography', () => ({
  Heading: ({
    children,
    className,
    level,
    fontFamily,
  }: {
    children: React.ReactNode;
    className?: string;
    level?: number;
    fontFamily?: string;
  }) => (
    <h1 className={className} data-level={level} data-font={fontFamily}>
      {children}
    </h1>
  ),
  Text: ({
    children,
    className,
    fontFamily,
  }: {
    children: React.ReactNode;
    className?: string;
    fontFamily?: string;
  }) => (
    <span className={className} data-font={fontFamily}>
      {children}
    </span>
  ),
}));

const mockUseThemeStore = vi.mocked(useThemeStore);

describe('Header', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseThemeStore.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });
  });

  it('로고가 config에서 가져온 이름으로 렌더링되어야 한다', () => {
    render(<Header />);

    const logo = screen.getByText('R3gardless.dev');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('네비게이션 링크들이 올바르게 렌더링되어야 한다', () => {
    render(<Header />);

    const aboutLink = screen.getByText('About');
    const blogLink = screen.getByText('Blog');

    expect(aboutLink).toBeInTheDocument();
    expect(blogLink).toBeInTheDocument();
    expect(aboutLink.closest('a')).toHaveAttribute('href', '/about');
    expect(blogLink.closest('a')).toHaveAttribute('href', '/blog');
  });

  it('라이트 모드에서 테마 토글 버튼이 올바른 아이콘을 표시해야 한다', () => {
    render(<Header />);

    const themeButton = screen.getByLabelText('다크 모드로 전환');
    const themeIcon = screen.getByAltText('라이트 모드 아이콘');

    expect(themeButton).toBeInTheDocument();
    expect(themeIcon).toBeInTheDocument();
    expect(themeIcon).toHaveAttribute('src', '/icons/lightmode.png');
  });

  it('다크 모드에서 테마 토글 버튼이 올바른 아이콘을 표시해야 한다', () => {
    mockUseThemeStore.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<Header />);

    const themeButton = screen.getByLabelText('라이트 모드로 전환');
    const themeIcon = screen.getByAltText('다크 모드 아이콘');

    expect(themeButton).toBeInTheDocument();
    expect(themeIcon).toBeInTheDocument();
    expect(themeIcon).toHaveAttribute('src', '/icons/darkmode.png');
  });

  it('테마 토글 버튼 클릭 시 toggleTheme 함수가 호출되어야 한다', () => {
    render(<Header />);

    const themeButton = screen.getByLabelText('다크 모드로 전환');
    fireEvent.click(themeButton);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('커스텀 className이 적용되어야 한다', () => {
    const customClass = 'custom-header-class';
    render(<Header className={customClass} />);

    const header = screen.getByRole('navigation');
    expect(header).toHaveClass(customClass);
  });

  it('올바른 구조와 스타일링이 적용되어야 한다', () => {
    render(<Header />);

    const header = screen.getByRole('navigation');
    expect(header).toHaveClass('w-full', 'h-[100px]', 'flex', 'justify-center');

    // 내부 컨테이너 확인
    const container = header.firstChild as HTMLElement;
    expect(container).toHaveClass('w-full', 'max-w-[1300px]', 'px-12', 'py-8');
    expect(container).toHaveClass('flex', 'items-center', 'justify-between');
  });

  it('배경색이 제거되어야 한다', () => {
    render(<Header />);

    const header = screen.getByRole('navigation');
    expect(header).not.toHaveClass('bg-[var(--color-background)]');
  });

  it('pathname이 null일 때 에러 없이 렌더링되어야 한다', () => {
    vi.mocked(usePathname).mockReturnValue('');

    expect(() => render(<Header />)).not.toThrow();

    const aboutLink = screen.getByText('About');
    const blogLink = screen.getByText('Blog');

    // pathname이 null일 때는 모든 링크가 normal font weight를 가져야 함
    expect(aboutLink).toHaveClass('font-normal');
    expect(blogLink).toHaveClass('font-normal');
  });

  it('현재 경로에 따라 메뉴가 bold 처리되어야 한다', () => {
    vi.mocked(usePathname).mockReturnValue('/about');

    render(<Header />);

    const aboutLink = screen.getByText('About');
    const blogLink = screen.getByText('Blog');

    expect(aboutLink).toHaveClass('font-bold');
    expect(blogLink).toHaveClass('font-normal');
  });

  it('햄버거 메뉴 버튼이 모바일에서 표시되어야 한다', () => {
    render(<Header />);

    const hamburgerButton = screen.getByLabelText('메뉴 열기/닫기');
    expect(hamburgerButton).toBeInTheDocument();
    expect(hamburgerButton).toHaveClass('md:hidden');
  });

  it('햄버거 메뉴 클릭 시 모바일 메뉴가 열려야 한다', () => {
    render(<Header />);

    const hamburgerButton = screen.getByLabelText('메뉴 열기/닫기');

    // 초기에는 메뉴 아이콘이 표시되어야 함
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();

    // 햄버거 버튼 클릭
    fireEvent.click(hamburgerButton);

    // X 아이콘으로 변경되어야 함
    expect(screen.getByTestId('x-icon')).toBeInTheDocument();

    // 모바일 메뉴가 표시되어야 함 (About, Blog 링크가 모바일 메뉴에도 있음)
    const mobileAboutLinks = screen.getAllByText('About');
    const mobileBlogLinks = screen.getAllByText('Blog');
    expect(mobileAboutLinks).toHaveLength(2); // 데스크톱 + 모바일
    expect(mobileBlogLinks).toHaveLength(2); // 데스크톱 + 모바일
  });

  it('데스크톱 메뉴가 md 이상에서만 표시되어야 한다', () => {
    render(<Header />);

    // 데스크톱 메뉴 컨테이너를 찾기
    const desktopMenu = screen.getByText('About').closest('.hidden.md\\:flex');
    expect(desktopMenu).toBeInTheDocument();
  });
});
