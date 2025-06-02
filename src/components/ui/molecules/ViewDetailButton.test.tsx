import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { ViewDetailButton } from './ViewDetailButton';

describe('ViewDetailButton', () => {
  it('기본 텍스트 "자세히보기"로 렌더링된다', () => {
    render(<ViewDetailButton />);
    expect(screen.getByRole('button', { name: /자세히보기/i })).toBeInTheDocument();
  });

  it('커스텀 텍스트가 올바르게 표시된다', () => {
    render(<ViewDetailButton text="상세 정보 보기" />);
    expect(screen.getByRole('button', { name: /상세 정보 보기/i })).toBeInTheDocument();
  });

  it('화살표 아이콘이 렌더링된다', () => {
    render(<ViewDetailButton />);
    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('animated가 true일 때 애니메이션 클래스가 적용된다', () => {
    render(<ViewDetailButton animated={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('group');
    expect(button).toHaveClass('hover:pr-8');
  });

  it('animated가 false일 때 호버 애니메이션 클래스가 적용되지 않는다', () => {
    render(<ViewDetailButton animated={false} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('group');
    expect(button).not.toHaveClass('hover:pr-8');
  });

  it('variant prop이 올바르게 전달된다', () => {
    render(<ViewDetailButton variant="primary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--color-primary)]');
  });

  it('size prop이 올바르게 전달된다', () => {
    render(<ViewDetailButton size="lg" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3');
  });

  it('disabled 상태가 올바르게 적용된다', () => {
    render(<ViewDetailButton disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
  });

  it('loading 상태가 올바르게 적용된다', () => {
    render(<ViewDetailButton loading />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('fullWidth prop이 올바르게 적용된다', () => {
    render(<ViewDetailButton fullWidth />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('클릭 이벤트가 올바르게 처리된다', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ViewDetailButton onClick={handleClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('추가 className이 올바르게 병합된다', () => {
    render(<ViewDetailButton className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('group');
  });

  it('추가 props가 올바르게 전달된다', () => {
    render(<ViewDetailButton data-testid="view-detail-btn" />);
    expect(screen.getByTestId('view-detail-btn')).toBeInTheDocument();
  });

  it('기본 variant가 text로 설정된다', () => {
    render(<ViewDetailButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('기본 size가 sm으로 설정된다', () => {
    render(<ViewDetailButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('기본적으로 animated가 true로 설정된다', () => {
    render(<ViewDetailButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:pr-8');
  });

  it('Icon 컴포넌트에 올바른 props가 전달된다', () => {
    render(<ViewDetailButton />);
    const button = screen.getByRole('button');
    const icon = button.querySelector('[role="button"]');
    expect(icon).toBeInTheDocument();
  });
});

describe('ViewDetailButton 애니메이션', () => {
  it('animated가 true일 때 화살표에 호버 애니메이션 클래스가 적용된다', () => {
    render(<ViewDetailButton animated={true} />);
    const button = screen.getByRole('button');
    const iconContainer = button.querySelector('svg')?.parentElement;
    expect(iconContainer).toHaveClass('group-hover:translate-x-1');
  });

  it('animated가 false일 때 화살표에 호버 애니메이션 클래스가 적용되지 않는다', () => {
    render(<ViewDetailButton animated={false} />);
    const button = screen.getByRole('button');
    const iconContainer = button.querySelector('svg')?.parentElement;
    expect(iconContainer).not.toHaveClass('group-hover:translate-x-1');
  });
});

describe('ViewDetailButton 접근성', () => {
  it('올바른 role을 가진다', () => {
    render(<ViewDetailButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('disabled 상태에서 탭 접근이 불가능하다', () => {
    render(<ViewDetailButton disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('loading 상태에서 버튼이 비활성화된다', () => {
    render(<ViewDetailButton loading />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
