import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { LoadMoreButton } from './LoadMoreButton';

describe('LoadMoreButton', () => {
  it('기본 텍스트가 정상적으로 렌더링된다', () => {
    render(<LoadMoreButton />);
    expect(screen.getByText('+ 더보기')).toBeInTheDocument();
  });

  it('커스텀 텍스트가 정상적으로 렌더링된다', () => {
    render(<LoadMoreButton text="더 많은 태그 보기" />);
    expect(screen.getByText('더 많은 태그 보기')).toBeInTheDocument();
  });

  it('클릭 이벤트가 정상적으로 작동한다', () => {
    const handleClick = vi.fn();
    render(<LoadMoreButton onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('로딩 상태에서 스피너가 표시된다', () => {
    render(<LoadMoreButton loading />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText('+ 더보기')).not.toBeInTheDocument();
  });

  it('비활성화 상태에서 클릭이 되지 않는다', () => {
    const handleClick = vi.fn();
    render(<LoadMoreButton disabled onClick={handleClick} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('로딩 상태에서 자동으로 비활성화된다', () => {
    render(<LoadMoreButton loading />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('테마 속성이 data-theme으로 설정된다', () => {
    render(<LoadMoreButton theme="dark" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-theme', 'dark');
  });

  it('추가 클래스명이 적용된다', () => {
    render(<LoadMoreButton className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('기본 스타일 클래스들이 적용된다', () => {
    render(<LoadMoreButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    expect(button).toHaveClass('font-bold', 'transition-all', 'duration-200');
    expect(button).toHaveClass('cursor-pointer', 'focus:outline-none');
  });
});
