import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { CategoryVerticalList } from './CategoryVerticalList';

const mockCategories = ['전체', '네트워크', '데이터베이스', '프로그래밍언어'];

describe('CategoryVerticalList', () => {
  it('renders with default props', () => {
    render(<CategoryVerticalList categories={mockCategories} />);

    expect(screen.getByText('카테고리')).toBeInTheDocument();
    expect(screen.getByText('+ 더보기')).toBeInTheDocument();
    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('highlights selected category', () => {
    render(<CategoryVerticalList categories={mockCategories} selectedCategory="네트워크" />);

    const selectedButton = screen.getByRole('button', { name: '네트워크' });
    expect(selectedButton).toHaveClass('font-bold');
  });

  it('calls onCategoryClick when category is clicked', () => {
    const handleCategoryClick = vi.fn();
    render(
      <CategoryVerticalList categories={mockCategories} onCategoryClick={handleCategoryClick} />,
    );

    fireEvent.click(screen.getByRole('button', { name: '네트워크' }));
    expect(handleCategoryClick).toHaveBeenCalledWith('네트워크');
  });

  it('calls onMoreClick when more button is clicked', () => {
    const handleMoreClick = vi.fn();
    render(<CategoryVerticalList categories={mockCategories} onMoreClick={handleMoreClick} />);

    fireEvent.click(screen.getByText('+ 더보기'));
    expect(handleMoreClick).toHaveBeenCalled();
  });

  it('hides more button when showMore is false', () => {
    render(<CategoryVerticalList categories={mockCategories} showMore={false} />);

    expect(screen.queryByText('+ 더보기')).not.toBeInTheDocument();
  });

  it('applies theme attribute correctly', () => {
    const { container } = render(<CategoryVerticalList categories={mockCategories} theme="dark" />);

    const categoryList = container.firstChild as HTMLElement;
    expect(categoryList).toHaveAttribute('data-theme', 'dark');
  });

  it('applies custom className', () => {
    const { container } = render(
      <CategoryVerticalList categories={mockCategories} className="custom-class" />,
    );

    const categoryList = container.firstChild as HTMLElement;
    expect(categoryList).toHaveClass('custom-class');
  });

  it('has no selected category when selectedCategory is not provided', () => {
    render(<CategoryVerticalList categories={mockCategories} />);

    mockCategories.forEach(category => {
      const button = screen.getByRole('button', { name: category });
      expect(button).toHaveClass('font-normal');
      expect(button).not.toHaveClass('font-bold');
    });
  });
});
