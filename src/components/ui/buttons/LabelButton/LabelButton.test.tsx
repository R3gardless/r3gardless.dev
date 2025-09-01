import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { LabelButton } from './LabelButton';

describe('LabelButton', () => {
  it('기본 라벨이 렌더링된다', () => {
    render(<LabelButton text="React" color="blue" />);
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
      render(<LabelButton text={`${color} label`} color={color} />);
      const label = screen.getByText(`${color} label`);
      expect(label).toBeInTheDocument();
      expect(label).toHaveStyle(`background-color: var(--color-${color})`);
    });
  });

  it('onClick이 없으면 span 요소로 렌더링된다', () => {
    render(<LabelButton text="Span element" color="blue" />);
    const label = screen.getByText('Span element');
    expect(label.tagName).toBe('SPAN');
    expect(label).not.toHaveAttribute('type');
  });

  it('onClick이 있으면 button 요소로 렌더링된다', () => {
    const handleClick = vi.fn();
    render(<LabelButton text="Button element" color="blue" onClick={handleClick} />);
    const button = screen.getByText('Button element');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('클릭 이벤트가 올바르게 처리된다', () => {
    const handleClick = vi.fn();
    render(<LabelButton text="Clickable" color="blue" onClick={handleClick} />);
    const button = screen.getByText('Clickable');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('커스텀 className이 적용된다', () => {
    render(<LabelButton text="Custom class" color="blue" className="custom-class" />);
    const label = screen.getByText('Custom class');
    expect(label).toHaveClass('custom-class');
  });

  it('기본 스타일 클래스가 적용된다', () => {
    render(<LabelButton text="Styled" color="blue" />);
    const label = screen.getByText('Styled');
    expect(label).toHaveClass('inline-flex');
    expect(label).toHaveClass('items-center');
    expect(label).toHaveClass('justify-center');
    expect(label).toHaveClass('px-3');
    expect(label).toHaveClass('py-1');
    expect(label).toHaveClass('rounded-lg');
    expect(label).toHaveClass('text-sm');
  });

  it('클릭 가능한 라벨에 인터랙티브 스타일이 적용된다', () => {
    const handleClick = vi.fn();
    render(<LabelButton text="Interactive" color="blue" onClick={handleClick} />);
    const button = screen.getByText('Interactive');
    expect(button).toHaveClass('cursor-pointer');
    expect(button).toHaveClass('hover:opacity-80');
    expect(button).toHaveClass('transition-opacity');
  });

  it('클릭할 수 없는 라벨에는 인터랙티브 스타일이 적용되지 않는다', () => {
    render(<LabelButton text="Non-interactive" color="blue" />);
    const span = screen.getByText('Non-interactive');
    expect(span).not.toHaveClass('cursor-pointer');
    expect(span).not.toHaveClass('hover:opacity-80');
    expect(span).not.toHaveClass('transition-opacity');
  });

  it('CSS 변수를 통해 색상이 설정된다', () => {
    render(<LabelButton text="Color test" color="green" />);
    const label = screen.getByText('Color test');
    expect(label).toHaveStyle('background-color: var(--color-green)');
    expect(label).toHaveStyle('color: var(--color-text)');
  });

  it('빈 텍스트도 렌더링된다', () => {
    const { container } = render(<LabelButton text="" color="blue" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('특수 문자가 포함된 텍스트를 렌더링한다', () => {
    render(<LabelButton text="React & Next.js" color="blue" />);
    const label = screen.getByText('React & Next.js');
    expect(label).toBeInTheDocument();
  });

  it('긴 텍스트를 렌더링한다', () => {
    const longText = 'This is a very long label text that might wrap to multiple lines';
    render(<LabelButton text={longText} color="blue" />);
    const label = screen.getByText(longText);
    expect(label).toBeInTheDocument();
  });
});
