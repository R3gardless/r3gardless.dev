import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ReadMoreButton } from './ReadMoreButton';

describe('ReadMoreButton', () => {
  it('기본 텍스트가 렌더링된다', () => {
    render(<ReadMoreButton />);
    expect(screen.getByRole('button')).toHaveTextContent('+ 더보기');
  });

  it('text prop으로 텍스트를 변경할 수 있다', () => {
    render(<ReadMoreButton text="모두 보기" />);
    expect(screen.getByRole('button')).toHaveTextContent('모두 보기');
  });

  it('variant, size prop이 정상적으로 전달된다', () => {
    render(<ReadMoreButton variant="primary" size="lg" />);
    const button = screen.getByRole('button');
    // primary variant의 주요 스타일 클래스가 포함되어 있는지 확인
    expect(button.className).toMatch(/bg-\[var\(--color-primary\)\]/);
    expect(button.className).toMatch(/text-\[var\(--color-text\)\]/);
    // lg size의 주요 스타일 클래스가 포함되어 있는지 확인
    expect(button.className).toMatch(/px-6/);
    expect(button.className).toMatch(/py-3/);
    expect(button.className).toMatch(/text-base/);
    expect(button.className).toMatch(/rounded/);
  });

  it('추가 props(className 등)가 정상적으로 전달된다', () => {
    render(<ReadMoreButton className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
