import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Icon, type IconProps } from './Icon';

describe('Icon', () => {
  it('기본 아이콘이 렌더링된다', () => {
    render(<Icon />);
    const icon = screen.getByRole('button');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-theme', 'light');
  });

  it('dot 타입이 기본값으로 적용된다', () => {
    render(<Icon />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('rounded-full');
  });

  it('square 타입이 올바르게 적용된다', () => {
    render(<Icon type="square" />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('rounded-none');
  });

  it('triangle 타입이 올바르게 적용된다', () => {
    render(<Icon type="triangle" />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('triangle-shape');
  });

  it('diamond 타입이 올바르게 적용된다', () => {
    render(<Icon type="diamond" />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('rotate-45', 'rounded-sm');
  });

  it('다양한 크기가 올바르게 적용된다', () => {
    const sizes = [
      { size: 'xs', expectedClass: 'w-1.5 h-1.5' },
      { size: 'sm', expectedClass: 'w-2 h-2' },
      { size: 'md', expectedClass: 'w-3 h-3' },
      { size: 'lg', expectedClass: 'w-4 h-4' },
      { size: 'xl', expectedClass: 'w-6 h-6' },
    ] as const;

    sizes.forEach(({ size, expectedClass }) => {
      const { unmount } = render(<Icon size={size} />);
      const icon = screen.getByRole('button');
      expect(icon).toHaveClass(expectedClass);
      unmount();
    });
  });

  it('활성화 상태가 올바르게 적용된다', () => {
    render(<Icon isActive={true} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('data-active', 'true');
    expect(icon).toHaveAttribute('aria-label', 'dot icon active');
  });

  it('비활성화 상태가 올바르게 적용된다', () => {
    render(<Icon isActive={false} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('data-active', 'false');
    expect(icon).toHaveAttribute('aria-label', 'dot icon inactive');
  });

  it('primary variant가 활성화 상태에서 올바른 스타일을 가진다', () => {
    render(<Icon variant="primary" isActive={true} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('bg-[color:var(--color-primary)]');
  });

  it('primary variant가 비활성화 상태에서 올바른 스타일을 가진다', () => {
    render(<Icon variant="primary" isActive={false} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('bg-[color:var(--color-primary)]', 'opacity-30');
  });

  it('secondary variant가 올바르게 적용된다', () => {
    render(<Icon variant="secondary" isActive={true} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('bg-[color:var(--color-secondary)]');
  });

  it('disabled 상태가 올바르게 적용된다', () => {
    render(<Icon disabled={true} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(icon).toHaveAttribute('tabIndex', '-1');
  });

  it('disabled가 아닐 때 호버 효과가 적용된다', () => {
    render(<Icon disabled={false} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('hover:scale-130', 'hover:opacity-100');
  });

  it('disabled일 때 호버 효과가 적용되지 않는다', () => {
    render(<Icon disabled={true} />);
    const icon = screen.getByRole('button');
    expect(icon).not.toHaveClass('hover:scale-110');
  });

  it('다크 테마가 올바르게 적용된다', () => {
    render(<Icon theme="dark" />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('data-theme', 'dark');
  });

  it('라이트 테마가 기본값으로 적용된다', () => {
    render(<Icon />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('data-theme', 'light');
  });

  it('커스텀 클래스명이 적용된다', () => {
    render(<Icon className="custom-class" />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('custom-class');
  });

  it('click 이벤트가 올바르게 처리된다', () => {
    const handleClick = vi.fn();
    render(<Icon onClick={handleClick} />);
    const icon = screen.getByRole('button');

    fireEvent.click(icon);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태에서 tabIndex가 -1로 설정된다', () => {
    render(<Icon disabled={true} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('tabIndex', '-1');
  });

  it('disabled가 아닐 때 tabIndex가 0으로 설정된다', () => {
    render(<Icon disabled={false} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveAttribute('tabIndex', '0');
  });

  it('기본 클래스들이 적용된다', () => {
    render(<Icon />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass(
      'inline-block',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'cursor-pointer',
      'select-none',
    );
  });

  it('잘못된 type 값이 들어와도 기본값으로 fallback된다', () => {
    // 의도적으로 잘못된 타입을 전달하여 fallback 동작을 테스트
    render(<Icon type={'invalid' as IconProps['type']} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('rounded-full'); // dot type의 기본 클래스
  });

  it('잘못된 size 값이 들어와도 기본값으로 fallback된다', () => {
    // 의도적으로 잘못된 크기를 전달하여 fallback 동작을 테스트
    render(<Icon size={'invalid' as IconProps['size']} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('w-3', 'h-3'); // md size의 기본 클래스
  });

  it('잘못된 variant 값이 들어와도 기본값으로 fallback된다', () => {
    // 의도적으로 잘못된 variant를 전달하여 fallback 동작을 테스트
    render(<Icon variant={'invalid' as IconProps['variant']} isActive={true} />);
    const icon = screen.getByRole('button');
    expect(icon).toHaveClass('bg-[color:var(--color-primary)]'); // primary variant의 기본 클래스
  });

  it('모든 HTML attributes가 올바르게 전달된다', () => {
    render(<Icon data-testid="custom-icon" title="Custom Title" role="button" />);
    const icon = screen.getByTestId('custom-icon');
    expect(icon).toHaveAttribute('title', 'Custom Title');
    expect(icon).toHaveAttribute('role', 'button');
  });

  it('forwardRef가 올바르게 작동한다', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Icon ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
