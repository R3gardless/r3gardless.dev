import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { CategoryHorizontalList } from './CategoryHorizontalList';

// mock scrollTo for smooth scrolling tests
if (typeof HTMLElement !== 'undefined') {
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    value: vi.fn(),
    writable: true,
  });
}

const mockCategories = ['전체', '데이터베이스', '네트워크', '프로그래밍언어', 'JavaScript'];

describe('CategoryHorizontalList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('카테고리 목록을 렌더링한다', () => {
    render(<CategoryHorizontalList categories={mockCategories} />);

    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('선택된 카테고리에 활성 스타일을 적용한다', () => {
    render(<CategoryHorizontalList categories={mockCategories} selectedCategory="JavaScript" />);

    const selectedButton = screen.getByText('JavaScript');
    /* 선택된 카테고리는 굵은 폰트와 기본 커서를 가져야 함 */
    expect(selectedButton).toHaveClass('font-bold');
    expect(selectedButton).toHaveClass('cursor-default');
    /* aria-pressed가 true이고 disabled 및 aria-disabled가 true이어야 함 */
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
    expect(selectedButton).toBeDisabled();
    expect(selectedButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('카테고리 클릭 시 onCategoryClick 핸들러를 호출한다', () => {
    const mockOnCategoryClick = vi.fn();
    render(
      <CategoryHorizontalList categories={mockCategories} onCategoryClick={mockOnCategoryClick} />,
    );

    const categoryButton = screen.getByText('데이터베이스');
    fireEvent.click(categoryButton);

    expect(mockOnCategoryClick).toHaveBeenCalledWith('데이터베이스');
  });

  it('선택되지 않은 카테고리는 포인터 커서를 가진다', () => {
    render(<CategoryHorizontalList categories={mockCategories} selectedCategory="JavaScript" />);

    const unselectedButton = screen.getByText('데이터베이스');
    expect(unselectedButton).toHaveClass('cursor-pointer');
    expect(unselectedButton).not.toBeDisabled();
  });

  it('선택된 카테고리 클릭 시 핸들러가 호출되지 않는다', () => {
    const mockOnCategoryClick = vi.fn();
    render(
      <CategoryHorizontalList
        categories={mockCategories}
        selectedCategory="JavaScript"
        onCategoryClick={mockOnCategoryClick}
      />,
    );

    const selectedButton = screen.getByText('JavaScript');
    fireEvent.click(selectedButton);

    expect(mockOnCategoryClick).not.toHaveBeenCalled();
  });

  it('추가 클래스명을 적용한다', () => {
    const { container } = render(
      <CategoryHorizontalList categories={mockCategories} className="custom-class" />,
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
  });

  it('스크롤 컨테이너가 올바른 스타일을 가진다', () => {
    const { container } = render(<CategoryHorizontalList categories={mockCategories} />);

    const scrollContainer = container.querySelector('.overflow-x-auto');

    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('scrollbar-hide', 'scroll-smooth', 'relative');
  });

  it('선택된 카테고리에 하단 강조선이 진하게 표시된다', () => {
    render(<CategoryHorizontalList categories={mockCategories} selectedCategory="네트워크" />);

    const selectedButton = screen.getByText('네트워크');
    const underline = selectedButton.querySelector('.h-\\[3px\\]');

    expect(underline).toBeInTheDocument();
    expect(underline).toHaveClass('h-[3px]', 'opacity-100', 'z-10');
  });

  it('선택되지 않은 카테고리에는 하단 강조선이 표시되지 않는다', () => {
    render(<CategoryHorizontalList categories={mockCategories} selectedCategory="네트워크" />);

    const unselectedButton = screen.getByText('JavaScript');
    const highlightUnderline = unselectedButton.querySelector('.h-\\[3px\\]');

    expect(highlightUnderline).not.toBeInTheDocument();
  });

  it('빈 카테고리 배열로도 렌더링된다', () => {
    const { container } = render(<CategoryHorizontalList categories={[]} />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('카테고리 버튼들이 hover 효과를 가진다', () => {
    render(<CategoryHorizontalList categories={mockCategories} />);

    const categoryButton = screen.getByText('전체');
    expect(categoryButton).toHaveClass('hover:opacity-70');
  });

  it('모든 카테고리에 개별 구분선이 표시된다', () => {
    render(<CategoryHorizontalList categories={mockCategories} />);

    mockCategories.forEach(category => {
      const categoryButton = screen.getByText(category);
      const divider = categoryButton.querySelector('.h-\\[1px\\]');

      expect(divider).toBeInTheDocument();
      expect(divider).toHaveClass('h-[1px]', 'opacity-30');
    });
  });

  it('선택된 카테고리의 강조선이 구분선보다 위에 표시된다', () => {
    render(<CategoryHorizontalList categories={mockCategories} selectedCategory="JavaScript" />);

    const selectedButton = screen.getByText('JavaScript');
    const highlightUnderline = selectedButton.querySelector('.h-\\[3px\\]');
    const divider = selectedButton.querySelector('.h-\\[1px\\]');

    expect(highlightUnderline).toHaveClass('z-10');
    expect(divider).toBeInTheDocument();
    expect(highlightUnderline).toBeInTheDocument();
  });
});
