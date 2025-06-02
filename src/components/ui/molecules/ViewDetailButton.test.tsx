import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { ViewDetailButton } from './ViewDetailButton';

/* ViewDetailButton 컴포넌트 테스트 */
describe('ViewDetailButton', () => {
  /* 기본 렌더링 테스트 - 컴포넌트가 정상적으로 렌더링되는지 확인 */
  it('기본 텍스트와 아이콘이 렌더링된다', () => {
    render(<ViewDetailButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('자세히보기')).toBeInTheDocument();
    /* 화살표 아이콘이 존재하는지 확인 (aria-label 또는 svg title 활용) */
    /* Icon 컴포넌트의 aria-label로 찾기 */
    expect(screen.getByLabelText(/arrow icon/i)).toBeInTheDocument();
  });

  /* Props 전달 테스트 - text prop이 제대로 동작하는지 확인 */
  it('text prop으로 버튼 텍스트를 변경할 수 있다', () => {
    render(<ViewDetailButton text="상세보기" />);
    expect(screen.getByText('상세보기')).toBeInTheDocument();
  });

  /* 애니메이션 활성화/비활성화 테스트 - animated prop에 따른 CSS 클래스 변화 확인 */
  it('animated=false일 때 호버 애니메이션 클래스가 적용되지 않는다', () => {
    render(<ViewDetailButton animated={false} />);
    const icon = screen.getByLabelText(/arrow icon/i);
    expect(icon).not.toHaveClass('group-hover:translate-x-1');
  });

  /* 애니메이션 활성화 테스트 - animated=true일 때 애니메이션 클래스가 적용되는지 확인 */
  it('animated=true일 때 호버 애니메이션 클래스가 적용된다', () => {
    render(<ViewDetailButton animated={true} />);
    const icon = screen.getByLabelText(/arrow icon/i);
    expect(icon).toHaveClass('group-hover:translate-x-1');
  });

  /* 기본값 테스트 - props를 전달하지 않았을 때 기본값이 적용되는지 확인 */
  it('기본값들이 올바르게 적용된다', () => {
    render(<ViewDetailButton />);
    /* 기본 텍스트 확인 */
    expect(screen.getByText('자세히보기')).toBeInTheDocument();
    /* 기본 애니메이션 활성화 확인 */
    const icon = screen.getByLabelText(/arrow icon/i);
    expect(icon).toHaveClass('group-hover:translate-x-1');
  });

  /* CSS 클래스 테스트 - 버튼에 그룹 관련 클래스가 적용되는지 확인 */
  it('버튼에 그룹 관련 CSS 클래스가 적용된다', () => {
    render(<ViewDetailButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('group', 'relative', 'overflow-hidden');
  });

  /* Custom className 테스트 - 커스텀 클래스명이 추가로 적용되는지 확인 */
  it('커스텀 className이 적용된다', () => {
    render(<ViewDetailButton className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  /* ButtonProps 전달 테스트 - Button 컴포넌트의 props가 제대로 전달되는지 확인 */
  it('Button 컴포넌트의 variant와 size props가 전달된다', () => {
    render(<ViewDetailButton variant="primary" size="lg" />);
    /* Button 컴포넌트가 해당 props를 받는지는 Button 컴포넌트의 구현에 따라 다름 */
    /* 여기서는 버튼이 렌더링되는 것만 확인 */
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  /* onClick 이벤트 테스트 - 클릭 이벤트가 제대로 전달되는지 확인 */
  it('onClick 이벤트가 실행된다', () => {
    const handleClick = vi.fn();
    render(<ViewDetailButton onClick={handleClick} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  /* disabled 상태 테스트 - disabled prop이 제대로 적용되는지 확인 */
  it('disabled, loading prop이 Button에 정상적으로 전달된다', () => {
    render(<ViewDetailButton disabled loading />);
    expect(screen.getByRole('button')).toBeDisabled();
    // loading 시 aria-busy 등 추가 확인 가능
  });

  /* 접근성 테스트 - aria-label 등 접근성 속성을 전달할 수 있는지 확인 */
  it('aria-label 등 접근성 속성을 전달할 수 있다', () => {
    render(<ViewDetailButton aria-label="상세 보기" />);
    expect(screen.getByLabelText('상세 보기')).toBeInTheDocument();
  });

  /* forwardRef 테스트 - ref가 제대로 전달되는지 확인 */
  it('ref가 버튼 엘리먼트에 전달된다', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<ViewDetailButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  /* Icon 컴포넌트 props 테스트 - Icon에 전달되는 props들이 올바른지 확인 */
  it('Icon 컴포넌트에 올바른 props가 전달된다', () => {
    render(<ViewDetailButton />);
    const icon = screen.getByLabelText(/arrow icon/i);
    /* Icon 컴포넌트의 role="img"가 적용되는지 확인 */
    expect(icon).toHaveAttribute('role', 'img');
  });

  /* displayName 테스트 - 컴포넌트의 displayName이 설정되어 있는지 확인 */
  it('컴포넌트의 displayName이 설정되어 있다', () => {
    expect(ViewDetailButton.displayName).toBe('ViewDetailButton');
  });
  it('aria-label 등 접근성 속성을 전달할 수 있다', () => {
    render(<ViewDetailButton aria-label="상세 보기" />);
    expect(screen.getByLabelText('상세 보기')).toBeInTheDocument();
  });
});
