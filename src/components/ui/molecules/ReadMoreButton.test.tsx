import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { ReadMoreButton } from './ReadMoreButton';

describe('ReadMoreButton', () => {
  it('기본 텍스트 "더보기"로 렌더링된다', () => {
    render(<ReadMoreButton />);
    expect(screen.getByRole('button', { name: '더보기' })).toBeInTheDocument();
  });

  it('커스텀 텍스트가 올바르게 표시된다', () => {
    render(<ReadMoreButton text="더 많은 글 보기" />);
    expect(screen.getByRole('button', { name: '더 많은 글 보기' })).toBeInTheDocument();
  });

  it('variant prop이 올바르게 전달된다', () => {
    render(<ReadMoreButton variant="primary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--color-primary)]');
  });

  it('size prop이 올바르게 전달된다', () => {
    render(<ReadMoreButton size="lg" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3');
  });

  it('disabled 상태가 올바르게 적용된다', () => {
    render(<ReadMoreButton disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
  });

  it('loading 상태가 올바르게 적용된다', () => {
    render(<ReadMoreButton loading />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('fullWidth prop이 올바르게 적용된다', () => {
    render(<ReadMoreButton fullWidth />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('클릭 이벤트가 올바르게 처리된다', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ReadMoreButton onClick={handleClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('추가 props가 올바르게 전달된다', () => {
    render(<ReadMoreButton data-testid="read-more-btn" />);
    expect(screen.getByTestId('read-more-btn')).toBeInTheDocument();
  });

  it('기본 variant가 text로 설정된다', () => {
    render(<ReadMoreButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('기본 size가 sm으로 설정된다', () => {
    render(<ReadMoreButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });
});

describe('ReadMoreButton 접근성', () => {
  it('올바른 role을 가진다', () => {
    render(<ReadMoreButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('disabled 상태에서 탭 접근이 불가능하다', () => {
    render(<ReadMoreButton disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('loading 상태에서 버튼이 비활성화된다', () => {
    render(<ReadMoreButton loading />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
