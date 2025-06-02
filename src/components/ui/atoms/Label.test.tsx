import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Label } from './Label';

describe('Label', () => {
  it('기본 라벨이 렌더링된다', () => {
    render(<Label text="React" color="blue" />);
    const label = screen.getByText('React');
    expect(label).toBeInTheDocument();
  });

  it('모든 색상 옵션이 올바르게 적용된다', () => {
    const colors = [
      'gray',
      'brown',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple',
      'pink',
      'red',
    ] as const;

    colors.forEach(color => {
      const { rerender } = render(<Label text={`${color} label`} color={color} />);
      const label = screen.getByText(`${color} label`);
      expect(label).toHaveStyle({ backgroundColor: `var(--color-label-${color})` });
      rerender(<></>);
    });
  });

  it('라이트 테마가 기본값으로 적용된다', () => {
    render(<Label text="Default theme" color="blue" />);
    const label = screen.getByText('Default theme');
    expect(label).toHaveAttribute('data-theme', 'light');
  });

  it('다크 테마가 올바르게 적용된다', () => {
    render(<Label text="Dark theme" color="blue" theme="dark" />);
    const label = screen.getByText('Dark theme');
    expect(label).toHaveAttribute('data-theme', 'dark');
  });

  it('onClick이 없을 때 span 요소로 렌더링된다', () => {
    render(<Label text="Span element" color="blue" />);
    const label = screen.getByText('Span element');
    expect(label.tagName).toBe('SPAN');
    expect(label).not.toHaveAttribute('type');
  });

  it('onClick이 있을 때 button 요소로 렌더링된다', () => {
    const handleClick = vi.fn();
    render(<Label text="Button element" color="blue" onClick={handleClick} />);
    const label = screen.getByText('Button element');
    expect(label.tagName).toBe('BUTTON');
    expect(label).toHaveAttribute('type', 'button');
  });

  it('클릭 이벤트가 올바르게 처리된다', () => {
    const handleClick = vi.fn();
    render(<Label text="Clickable" color="blue" onClick={handleClick} />);
    const label = screen.getByText('Clickable');

    fireEvent.click(label);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('커스텀 클래스명이 적용된다', () => {
    render(<Label text="Custom class" color="blue" className="custom-class" />);
    const label = screen.getByText('Custom class');
    expect(label).toHaveClass('custom-class');
  });

  it('기본 스타일 클래스들이 적용된다', () => {
    render(<Label text="Styled" color="blue" />);
    const label = screen.getByText('Styled');
    expect(label).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'px-3',
      'py-1',
      'rounded-full',
      'text-sm',
      'font-pretendard',
      'font-normal',
      'leading-tight',
    );
  });

  it('클릭 가능한 라벨에 인터랙티브 스타일이 적용된다', () => {
    const handleClick = vi.fn();
    render(<Label text="Interactive" color="blue" onClick={handleClick} />);
    const label = screen.getByText('Interactive');
    expect(label).toHaveClass('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
  });

  it('클릭 불가능한 라벨에 인터랙티브 스타일이 적용되지 않는다', () => {
    render(<Label text="Non-interactive" color="blue" />);
    const label = screen.getByText('Non-interactive');
    expect(label).not.toHaveClass('cursor-pointer', 'hover:opacity-80', 'transition-opacity');
  });

  it('CSS 변수를 사용한 색상 스타일이 적용된다', () => {
    render(<Label text="Color test" color="green" />);
    const label = screen.getByText('Color test');
    expect(label).toHaveStyle({
      backgroundColor: 'var(--color-label-green)',
      color: 'var(--color-text)',
    });
  });

  it('빈 문자열도 올바르게 렌더링된다', () => {
    const { container } = render(<Label text="" color="blue" />);
    const label = container.querySelector('span');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('');
    expect(label).toHaveStyle({
      backgroundColor: 'var(--color-label-blue)',
      color: 'var(--color-text)',
    });
  });

  it('특수 문자가 포함된 텍스트도 올바르게 렌더링된다', () => {
    render(<Label text="React & Next.js" color="blue" />);
    const label = screen.getByText('React & Next.js');
    expect(label).toBeInTheDocument();
  });

  it('긴 텍스트도 올바르게 렌더링된다', () => {
    const longText = 'This is a very long label text that might overflow';
    render(<Label text={longText} color="blue" />);
    const label = screen.getByText(longText);
    expect(label).toBeInTheDocument();
  });
});
