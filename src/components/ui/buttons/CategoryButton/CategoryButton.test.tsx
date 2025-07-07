import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { CategoryButton } from './CategoryButton';

describe('CategoryButton', () => {
  it('renders children correctly', () => {
    render(<CategoryButton variant="horizontal">React</CategoryButton>);
    expect(screen.getByRole('button')).toHaveTextContent('React');
  });

  it('applies correct styles for horizontal variant', () => {
    render(<CategoryButton variant="horizontal">React</CategoryButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('whitespace-nowrap', 'px-4', 'py-4');
  });

  it('applies correct styles for vertical variant', () => {
    render(<CategoryButton variant="vertical">React</CategoryButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-2.5', 'py-1.5', 'rounded', 'w-full');
  });

  it('shows selected state for horizontal variant', () => {
    render(
      <CategoryButton variant="horizontal" isSelected={true}>
        React
      </CategoryButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('font-bold', 'cursor-default');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows selected state for vertical variant', () => {
    render(
      <CategoryButton variant="vertical" isSelected={true}>
        React
      </CategoryButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('font-bold');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onClick when clicked and not selected', () => {
    const handleClick = vi.fn();
    render(
      <CategoryButton variant="horizontal" onClick={handleClick}>
        React
      </CategoryButton>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when selected', () => {
    const handleClick = vi.fn();
    render(
      <CategoryButton variant="horizontal" isSelected={true} onClick={handleClick}>
        React
      </CategoryButton>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <CategoryButton variant="horizontal" disabled={true} onClick={handleClick}>
        React
      </CategoryButton>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies disabled styles', () => {
    render(
      <CategoryButton variant="horizontal" disabled={true}>
        React
      </CategoryButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toBeDisabled();
  });

  it('renders horizontal layout bottom border and selection indicator', () => {
    const { container } = render(
      <CategoryButton variant="horizontal" isSelected={true}>
        React
      </CategoryButton>,
    );

    // 하단 구분선 확인
    const borderDiv = container.querySelector('.h-\\[1px\\]');
    expect(borderDiv).toBeInTheDocument();

    // 선택 표시 확인
    const selectedDiv = container.querySelector('.h-\\[3px\\]');
    expect(selectedDiv).toBeInTheDocument();
  });

  it('does not render bottom border for vertical variant', () => {
    const { container } = render(
      <CategoryButton variant="vertical" isSelected={true}>
        React
      </CategoryButton>,
    );

    // 하단 구분선이 없어야 함
    const borderDiv = container.querySelector('.h-\\[1px\\]');
    expect(borderDiv).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <CategoryButton variant="horizontal" className="custom-class">
        React
      </CategoryButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(
      <CategoryButton variant="horizontal" isSelected={false}>
        React
      </CategoryButton>,
    );
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('aria-disabled', 'false');
  });
});
