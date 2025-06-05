import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Button } from './Button';

// 테스트용 아이콘 컴포넌트
const TestIcon = ({ className }: { className?: string }) => (
  <svg className={className} data-testid="test-icon" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

describe('Button', () => {
  it('기본 버튼이 렌더링된다', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('모든 variant가 올바르게 적용된다', () => {
    const variants = ['primary', 'secondary', 'text', 'icon'] as const;

    variants.forEach(variant => {
      const { rerender } = render(<Button variant={variant}>{variant} button</Button>);
      const button = screen.getByRole('button');

      if (variant === 'primary') {
        expect(button).toHaveClass('bg-[var(--color-primary)]', 'text-[var(--color-text)]');
      } else if (variant === 'secondary') {
        expect(button).toHaveClass('bg-[var(--color-secondary)]', 'text-[var(--color-text)]');
      } else if (variant === 'text' || variant === 'icon') {
        expect(button).toHaveClass('bg-transparent', 'text-[var(--color-text)]');
      }

      rerender(<></>);
    });
  });

  it('모든 size가 올바르게 적용된다', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      const { rerender } = render(<Button size={size}>Size {size}</Button>);
      const button = screen.getByRole('button');

      if (size === 'sm') {
        expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm', 'rounded-sm');
      } else if (size === 'md') {
        expect(button).toHaveClass('px-4', 'py-2', 'text-sm', 'rounded-sm');
      } else if (size === 'lg') {
        expect(button).toHaveClass('px-6', 'py-3', 'text-base', 'rounded');
      }

      rerender(<></>);
    });
  });

  it('icon variant의 size가 올바르게 적용된다', () => {
    const { rerender } = render(
      <Button variant="icon" size="sm">
        Icon
      </Button>,
    );
    let button = screen.getByRole('button');
    expect(button).toHaveClass('w-8', 'h-8');

    rerender(
      <Button variant="icon" size="md">
        Icon
      </Button>,
    );
    button = screen.getByRole('button');
    expect(button).toHaveClass('w-10', 'h-10');

    rerender(
      <Button variant="icon" size="lg">
        Icon
      </Button>,
    );
    button = screen.getByRole('button');
    expect(button).toHaveClass('w-12', 'h-12');
  });

  it('fullWidth가 올바르게 적용된다', () => {
    render(<Button fullWidth>Full width button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('loading 상태가 올바르게 표시된다', () => {
    render(<Button loading>Loading button</Button>);
    const button = screen.getByRole('button');
    const spinner = button.querySelector('.animate-spin');

    expect(button).toBeDisabled();
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-4',
      'w-4',
      'border-2',
      'border-current',
      'border-t-transparent',
    );
  });

  it('disabled 상태가 올바르게 적용된다', () => {
    render(<Button disabled>Disabled button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('loading일 때 버튼이 비활성화된다', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('클릭 이벤트가 올바르게 처리된다', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태에서 클릭 이벤트가 발생하지 않는다', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>,
    );
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('아이콘이 올바르게 렌더링된다', () => {
    render(<Button icon={TestIcon}>With icon</Button>);
    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('flex-shrink-0');
  });

  it('loading 상태에서 아이콘이 숨겨진다', () => {
    render(
      <Button icon={TestIcon} loading>
        Loading with icon
      </Button>,
    );
    const icon = screen.queryByTestId('test-icon');
    expect(icon).not.toBeInTheDocument();
  });

  it('icon variant에서 children이 올바르게 렌더링된다', () => {
    render(<Button variant="icon">X</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('X');
    expect(button).not.toContainHTML('<span>');
  });

  it('icon variant가 아닐 때 children이 span으로 감싸진다', () => {
    render(<Button variant="primary">Primary text</Button>);
    const button = screen.getByRole('button');
    const span = button.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('Primary text');
  });

  it('커스텀 클래스명이 적용된다', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('기본 스타일 클래스들이 적용된다', () => {
    render(<Button>Styled</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'font-bold',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus-visible:outline-none',
    );
  });

  it('forwardRef가 올바르게 작동한다', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>With ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('HTML 버튼 속성들이 올바르게 전달된다', () => {
    render(
      <Button type="submit" id="test-button" data-testid="custom-button">
        Submit
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('id', 'test-button');
    expect(button).toHaveAttribute('data-testid', 'custom-button');
  });

  it('icon variant에서 rounded-full 클래스가 적용된다', () => {
    render(<Button variant="icon">Icon</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-full', 'p-2');
  });

  it('primary와 secondary variant에서 hover 효과가 적용된다', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('hover:opacity-90', 'active:scale-95');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('hover:opacity-90', 'active:scale-95');
  });

  it('text와 icon variant에서 다른 hover 효과가 적용된다', () => {
    const { rerender } = render(<Button variant="text">Text</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass(
      'hover:bg-[var(--color-primary)]',
      'hover:bg-opacity-20',
      'active:bg-opacity-30',
    );

    rerender(<Button variant="icon">Icon</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass(
      'hover:bg-[var(--color-primary)]',
      'hover:bg-opacity-20',
      'active:bg-opacity-30',
    );
  });
});
