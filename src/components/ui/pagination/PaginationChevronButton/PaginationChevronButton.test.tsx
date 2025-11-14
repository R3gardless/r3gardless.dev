import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { PaginationChevronButton } from './PaginationChevronButton';

describe('PaginationChevronButton', () => {
  it('기본적으로 렌더링된다', () => {
    render(<PaginationChevronButton direction="left" aria-label="이전 페이지" />);

    const button = screen.getByRole('button', { name: '이전 페이지' });
    expect(button).toBeInTheDocument();
  });

  it('left 방향 아이콘을 올바르게 렌더링한다', () => {
    render(<PaginationChevronButton direction="left" aria-label="이전 페이지" />);

    const button = screen.getByRole('button', { name: '이전 페이지' });
    const svg = button.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide');
  });

  it('right 방향 아이콘을 올바르게 렌더링한다', () => {
    render(<PaginationChevronButton direction="right" aria-label="다음 페이지" />);

    const button = screen.getByRole('button', { name: '다음 페이지' });
    const svg = button.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('lucide');
  });

  it('크기에 따라 올바른 클래스가 적용된다', () => {
    const { rerender } = render(
      <PaginationChevronButton direction="left" size="sm" aria-label="작은 버튼" />,
    );

    let button = screen.getByRole('button', { name: '작은 버튼' });
    expect(button).toHaveClass('w-7', 'h-7', 'p-1');

    rerender(<PaginationChevronButton direction="left" size="md" aria-label="중간 버튼" />);
    button = screen.getByRole('button', { name: '중간 버튼' });
    expect(button).toHaveClass('w-8', 'h-8', 'p-1.5');

    rerender(<PaginationChevronButton direction="left" size="lg" aria-label="큰 버튼" />);
    button = screen.getByRole('button', { name: '큰 버튼' });
    expect(button).toHaveClass('w-9', 'h-9', 'p-2');
  });

  it('크기에 따라 SVG 아이콘 크기가 올바르게 설정된다', () => {
    const { rerender } = render(
      <PaginationChevronButton direction="left" size="sm" aria-label="작은 버튼" />,
    );

    let svg = screen.getByRole('button', { name: '작은 버튼' }).querySelector('svg');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');

    rerender(<PaginationChevronButton direction="left" size="md" aria-label="중간 버튼" />);
    svg = screen.getByRole('button', { name: '중간 버튼' }).querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');

    rerender(<PaginationChevronButton direction="left" size="lg" aria-label="큰 버튼" />);
    svg = screen.getByRole('button', { name: '큰 버튼' }).querySelector('svg');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('비활성화 상태에서 올바른 클래스가 적용된다', () => {
    render(<PaginationChevronButton direction="left" disabled aria-label="비활성화된 버튼" />);

    const button = screen.getByRole('button', { name: '비활성화된 버튼' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  it('활성화 상태에서 올바른 클래스가 적용된다', () => {
    render(<PaginationChevronButton direction="left" aria-label="활성화된 버튼" />);

    const button = screen.getByRole('button', { name: '활성화된 버튼' });
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass('cursor-pointer');
  });

  it('클릭 이벤트가 올바르게 작동한다', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <PaginationChevronButton
        direction="left"
        onClick={handleClick}
        aria-label="클릭 가능한 버튼"
      />,
    );

    const button = screen.getByRole('button', { name: '클릭 가능한 버튼' });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('비활성화된 상태에서는 클릭 이벤트가 발생하지 않는다', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <PaginationChevronButton
        direction="left"
        disabled
        onClick={handleClick}
        aria-label="비활성화된 클릭 버튼"
      />,
    );

    const button = screen.getByRole('button', { name: '비활성화된 클릭 버튼' });
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('잘못된 direction 값이 전달되면 기본값 left를 사용한다', () => {
    // @ts-expect-error - 잘못된 direction 값 테스트
    render(<PaginationChevronButton direction="invalid" aria-label="잘못된 방향" />);

    const button = screen.getByRole('button', { name: '잘못된 방향' });
    const svg = button.querySelector('svg');
    const path = svg?.querySelector('path');

    expect(path).toHaveAttribute('d', 'm15 18-6-6 6-6'); // left 아이콘
  });

  it('잘못된 size 값이 전달되면 기본값 md를 사용한다', () => {
    // @ts-expect-error - 잘못된 size 값 테스트
    render(<PaginationChevronButton direction="left" size="invalid" aria-label="잘못된 크기" />);

    const button = screen.getByRole('button', { name: '잘못된 크기' });
    expect(button).toHaveClass('w-8', 'h-8', 'p-1.5'); // md 크기
  });

  it('추가적인 className이 올바르게 적용된다', () => {
    render(
      <PaginationChevronButton
        direction="left"
        className="custom-class"
        aria-label="커스텀 클래스 버튼"
      />,
    );

    const button = screen.getByRole('button', { name: '커스텀 클래스 버튼' });
    expect(button).toHaveClass('custom-class');
  });

  it('추가적인 HTML 속성들이 올바르게 전달된다', () => {
    render(
      <PaginationChevronButton
        direction="left"
        data-testid="test-button"
        title="테스트 버튼"
        aria-label="속성 테스트 버튼"
      />,
    );

    const button = screen.getByRole('button', { name: '속성 테스트 버튼' });
    expect(button).toHaveAttribute('data-testid', 'test-button');
    expect(button).toHaveAttribute('title', '테스트 버튼');
  });

  it('displayName이 올바르게 설정되어 있다', () => {
    expect(PaginationChevronButton.displayName).toBe('PaginationChevronButton');
  });
});
