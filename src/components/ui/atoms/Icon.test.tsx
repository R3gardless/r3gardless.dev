import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Icon } from './Icon';

describe('Icon', () => {
  it('기본 아이콘이 렌더링된다', () => {
    render(<Icon />);
    const icon = screen.getByRole('button');
    expect(icon).toBeInTheDocument();
    // 기본 theme는 light
    expect(icon).toHaveAttribute('data-theme', 'light');
  });

  it('CircleX 아이콘이 기본값으로 적용된다', () => {
    render(<Icon />);
    const icon = screen.getByRole('button');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-label', 'CircleX icon inactive');
    // SVG가 렌더링되었는지 확인
    const svg = icon.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('특정 Lucide 아이콘이 올바르게 렌더링된다', () => {
    render(<Icon name="ChevronRight" />);
    const icon = screen.getByRole('button');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-label', 'ChevronRight icon inactive');
  });

  it('다양한 크기가 올바르게 적용된다', () => {
    const sizes = [
      { size: 'sm', expectedClass: 'w-5 h-5' },
      { size: 'md', expectedClass: 'w-6 h-6' },
      { size: 'lg', expectedClass: 'w-8 h-8' },
      { size: 'xl', expectedClass: 'w-10 h-10' },
    ] as const;

    sizes.forEach(({ size, expectedClass }) => {
      const { unmount } = render(<Icon size={size} />);
      const icon = screen.getByRole('button');
      expect(icon).toHaveClass(expectedClass);
      unmount();
    });
  });

  it('다양한 variant가 올바르게 적용된다', () => {
    const variants = [
      { variant: 'text', expectedColorClass: 'text-[color:var(--color-text)]' },
      { variant: 'primary', expectedColorClass: 'text-[color:var(--color-primary)]' },
      { variant: 'secondary', expectedColorClass: 'text-[color:var(--color-secondary)]' },
    ] as const;

    variants.forEach(({ variant, expectedColorClass }) => {
      const { unmount } = render(<Icon variant={variant} />);
      const icon = screen.getByRole('button');
      expect(icon).toHaveClass(expectedColorClass);
      unmount();
    });
  });

  it('활성 상태가 올바르게 적용된다', () => {
    const { rerender } = render(<Icon isActive={false} />);
    let icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('data-active', 'false');
    expect(icon).toHaveAttribute('aria-label', 'CircleX icon inactive');
    expect(icon).toHaveClass('opacity-50'); // 비활성화 시 opacity-50

    rerender(<Icon isActive={true} />);
    icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('data-active', 'true');
    expect(icon).toHaveAttribute('aria-label', 'CircleX icon active');
    expect(icon).toHaveClass('opacity-100'); // 활성화 시 opacity-100
  });

  it('비활성화 상태가 올바르게 적용된다', () => {
    render(<Icon disabled={true} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(icon).toHaveAttribute('tabIndex', '-1');
    // disabled일 때만 tabIndex -1, 아니면 0
  });

  it('테마가 올바르게 적용된다', () => {
    const { rerender } = render(<Icon theme="light" />);
    let icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('data-theme', 'light');

    rerender(<Icon theme="dark" />);
    icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('data-theme', 'dark');
  });

  it('커스텀 className이 올바르게 적용된다', () => {
    render(<Icon className="custom-class" />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('custom-class');
  });

  it('클릭 이벤트가 올바르게 동작한다', () => {
    const handleClick = vi.fn();
    render(<Icon onClick={handleClick} />);
    const icon = screen.getByRole('button');

    fireEvent.click(icon);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('키보드 이벤트가 올바르게 동작한다', () => {
    const handleKeyDown = vi.fn();
    render(<Icon onKeyDown={handleKeyDown} />);
    const icon = screen.getByRole('button');

    fireEvent.keyDown(icon, { key: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('strokeWidth가 올바르게 적용된다', () => {
    render(<Icon strokeWidth={3} />);
    const icon = screen.getByRole('button');
    const svg = icon.querySelector('svg');
    expect(svg).toHaveAttribute('stroke-width', '3');
  });

  it('잘못된 아이콘 이름이 제공되면 기본 CircleX 아이콘이 표시된다', () => {
    // @ts-expect-error - 의도적으로 잘못된 타입 전달
    render(<Icon name="NonExistentIcon" />);
    const icon = screen.getByRole('button');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-label', 'CircleX icon inactive');
  });

  it('호버 효과 클래스가 비활성화되지 않은 상태에서 적용된다', () => {
    render(<Icon disabled={false} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('hover:scale-110', 'hover:opacity-100'); // disabled=false일 때만 hover 효과
  });

  it('호버 효과 클래스가 비활성화된 상태에서 제거된다', () => {
    render(<Icon disabled={true} />);
    const icon = screen.getByRole('button');
    expect(icon).not.toHaveClass('hover:scale-110', 'hover:opacity-100'); // disabled=true일 때 hover 효과 없음
  });

  it('ref가 올바르게 전달된다', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Icon ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement); // ref는 div에 연결됨
  });

  it('접근성 속성이 올바르게 설정된다', () => {
    render(<Icon name="Search" isActive={true} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('aria-label', 'Search icon active');
    expect(icon).toHaveAttribute('tabIndex', '0'); // 활성화 상태일 때 tabIndex 0
  });

  it('지원하는 아이콘들이 올바르게 렌더링된다', () => {
    const supportedIcons = [
      'Search',
      'ChevronUp',
      'ChevronDown',
      'ChevronLeft',
      'ChevronRight',
      'Ellipsis',
      'ArrowDownRight',
      'CircleX',
    ] as const;

    supportedIcons.forEach(iconName => {
      const { unmount } = render(<Icon name={iconName} />);
      const icon = screen.getByRole('button');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-label', `${iconName} icon inactive`);
      unmount();
    });
  });

  it('모든 props가 함께 올바르게 적용된다', () => {
    render(
      <Icon
        name="Ellipsis"
        size="lg"
        variant="primary"
        isActive={true}
        disabled={false}
        theme="dark"
        strokeWidth={2.5}
        className="test-class"
        data-testid="test-icon"
      />,
    );

    const icon = screen.getByRole('button');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('w-8', 'h-8', 'test-class');
    expect(icon).toHaveClass('text-[color:var(--color-primary)]');
    expect(icon).toHaveClass('opacity-100');
    expect(icon).toHaveAttribute('data-theme', 'dark');
    expect(icon).toHaveAttribute('data-active', 'true');
    expect(icon).toHaveAttribute('aria-label', 'Ellipsis icon active');
    expect(icon).toHaveAttribute('data-testid', 'test-icon');

    const svg = icon.querySelector('svg');
    expect(svg).toHaveAttribute('stroke-width', '2.5');
  });
});
