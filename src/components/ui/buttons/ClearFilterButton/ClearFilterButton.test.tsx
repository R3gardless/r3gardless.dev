import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { ClearFilterButton } from './ClearFilterButton';

describe('ClearFilterButton', () => {
  it('기본 텍스트가 정상적으로 렌더링된다', () => {
    render(<ClearFilterButton />);
    expect(screen.getByText('모두지우기')).toBeInTheDocument();
  });

  it('커스텀 텍스트가 정상적으로 렌더링된다', () => {
    render(<ClearFilterButton text="모든 선택 해제" />);
    expect(screen.getByText('모든 선택 해제')).toBeInTheDocument();
  });

  it('클릭 이벤트가 정상적으로 작동한다', () => {
    const handleClick = vi.fn();
    render(<ClearFilterButton onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('로딩 상태에서 스피너가 표시된다', () => {
    render(<ClearFilterButton loading />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText('모두지우기')).not.toBeInTheDocument();
  });

  it('비활성화 상태에서 클릭이 되지 않는다', () => {
    const handleClick = vi.fn();
    render(<ClearFilterButton disabled onClick={handleClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('로딩 상태에서 자동으로 비활성화된다', () => {
    render(<ClearFilterButton loading />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('추가 클래스명이 적용된다', () => {
    render(<ClearFilterButton className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('기본 스타일 클래스들이 적용된다', () => {
    render(<ClearFilterButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    expect(button).toHaveClass('font-bold', 'transition-all', 'duration-200');
    expect(button).toHaveClass('cursor-pointer', 'focus:outline-none');
  });

  it('작은 크기의 스피너가 로딩 시 표시된다', () => {
    render(<ClearFilterButton loading />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-3', 'w-3');
  });

  it('텍스트 크기가 xs로 설정된다', () => {
    render(<ClearFilterButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-xs');
  });
});
