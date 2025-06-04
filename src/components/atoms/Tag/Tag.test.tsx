import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Tag } from './Tag';

describe('Tag', () => {
  it('기본 태그가 렌더링된다', () => {
    render(<Tag text="react" />);
    const tag = screen.getByText('#react');
    expect(tag).toBeInTheDocument();
  });

  it('# 접두사가 없는 텍스트에 자동으로 # 접두사가 추가된다', () => {
    render(<Tag text="javascript" />);
    const tag = screen.getByText('#javascript');
    expect(tag).toBeInTheDocument();
  });

  it('이미 # 접두사가 있는 텍스트는 중복 추가되지 않는다', () => {
    render(<Tag text="#typescript" />);
    const tag = screen.getByText('#typescript');
    expect(tag).toBeInTheDocument();
    expect(screen.queryByText('##typescript')).not.toBeInTheDocument();
  });

  it('라이트 테마가 기본값으로 적용된다', () => {
    render(<Tag text="nextjs" />);
    const tag = screen.getByText('#nextjs');
    expect(tag).toHaveAttribute('data-theme', 'light');
  });

  it('다크 테마가 올바르게 적용된다', () => {
    render(<Tag text="tailwind" theme="dark" />);
    const tag = screen.getByText('#tailwind');
    expect(tag).toHaveAttribute('data-theme', 'dark');
  });

  it('커스텀 클래스명이 적용된다', () => {
    render(<Tag text="custom" className="custom-class" />);
    const tag = screen.getByText('#custom');
    expect(tag).toHaveClass('custom-class');
  });

  it('기본 스타일 클래스들이 적용된다', () => {
    render(<Tag text="styled" />);
    const tag = screen.getByText('#styled');
    expect(tag).toHaveClass('inline-block', 'rounded-full', 'px-3', 'py-1', 'text-sm');
  });

  it('CSS 변수를 사용한 색상 클래스가 적용된다', () => {
    render(<Tag text="colored" />);
    const tag = screen.getByText('#colored');
    expect(tag).toHaveClass('bg-[color:var(--color-secondary)]', 'text-[color:var(--color-text)]');
  });

  it('라이트 테마와 다크 테마가 동일한 CSS 변수를 사용한다', () => {
    const { rerender } = render(<Tag text="theme-test" theme="light" />);
    const lightTag = screen.getByText('#theme-test');
    expect(lightTag).toHaveClass(
      'bg-[color:var(--color-secondary)]',
      'text-[color:var(--color-text)]',
    );

    rerender(<Tag text="theme-test" theme="dark" />);
    const darkTag = screen.getByText('#theme-test');
    expect(darkTag).toHaveClass(
      'bg-[color:var(--color-secondary)]',
      'text-[color:var(--color-text)]',
    );
  });

  it('빈 문자열도 # 접두사가 추가된다', () => {
    render(<Tag text="" />);
    const tag = screen.getByText('#');
    expect(tag).toBeInTheDocument();
  });

  it('특수 문자가 포함된 텍스트도 올바르게 렌더링된다', () => {
    render(<Tag text="react-hooks" />);
    const tag = screen.getByText('#react-hooks');
    expect(tag).toBeInTheDocument();
  });
});
