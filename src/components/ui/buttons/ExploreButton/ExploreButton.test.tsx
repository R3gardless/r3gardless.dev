import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { ExploreButton } from './ExploreButton';

describe('ExploreButton', () => {
  it('기본 텍스트로 렌더링됨', () => {
    render(<ExploreButton />);
    expect(screen.getByRole('button', { name: '둘러보기' })).toBeInTheDocument();
  });

  it('커스텀 텍스트로 렌더링됨', () => {
    render(<ExploreButton text="블로그 구경하기" />);
    expect(screen.getByRole('button', { name: '블로그 구경하기' })).toBeInTheDocument();
  });

  it('클릭 이벤트가 올바르게 호출됨', () => {
    const handleClick = vi.fn();
    render(<ExploreButton onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('로딩 상태일 때 로딩 스피너가 표시됨', () => {
    render(<ExploreButton loading />);

    const button = screen.getByRole('button');
    const spinner = button.querySelector('.animate-spin');

    expect(spinner).toBeInTheDocument();
    expect(button).not.toHaveTextContent('둘러보기');
  });

  it('로딩 상태일 때 버튼이 비활성화됨', () => {
    render(<ExploreButton loading />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('disabled prop이 true일 때 버튼이 비활성화됨', () => {
    render(<ExploreButton disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('disabled 상태에서 클릭 이벤트가 호출되지 않음', () => {
    const handleClick = vi.fn();
    render(<ExploreButton disabled onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('추가 className이 적용됨', () => {
    render(<ExploreButton className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('기본 스타일 클래스들이 적용됨', () => {
    render(<ExploreButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('justify-center');
    expect(button).toHaveClass('font-bold');
    expect(button).toHaveClass('rounded-xl');
    expect(button).toHaveClass('backdrop-blur-md');
    expect(button).toHaveClass('border');
  });

  it('HTML button 속성들이 전달됨', () => {
    render(<ExploreButton type="submit" data-testid="explore-btn" />);

    const button = screen.getByTestId('explore-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('forwardRef가 올바르게 작동함', () => {
    const ref = vi.fn();
    render(<ExploreButton ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('displayName이 설정됨', () => {
    expect(ExploreButton.displayName).toBe('ExploreButton');
  });

  describe('접근성', () => {
    it('키보드로 포커스 가능함', () => {
      render(<ExploreButton />);

      const button = screen.getByRole('button');
      button.focus();

      expect(button).toHaveFocus();
    });

    it('로딩 상태에서도 스크린 리더가 버튼으로 인식함', () => {
      render(<ExploreButton loading />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('비활성화 상태에서도 버튼 역할 유지함', () => {
      render(<ExploreButton disabled />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('시각적 상태', () => {
    it('기본 상태에서 텍스트가 표시됨', () => {
      render(<ExploreButton text="테스트 텍스트" />);

      expect(screen.getByText('테스트 텍스트')).toBeInTheDocument();
    });

    it('로딩 상태에서 텍스트가 숨겨지고 스피너만 표시됨', () => {
      render(<ExploreButton text="테스트 텍스트" loading />);

      const button = screen.getByRole('button');
      const spinner = button.querySelector('.animate-spin');

      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText('테스트 텍스트')).not.toBeInTheDocument();
    });
  });
});
