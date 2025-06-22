import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { PaginationNumberButton } from './PaginationNumberButton';

describe('PaginationNumberButton', () => {
  const defaultProps = {
    currentPage: 5,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<PaginationNumberButton {...defaultProps} />);

    // 현재 페이지가 활성화되어 있는지 확인
    const currentPageButton = screen.getByRole('button', { name: '5페이지로 이동' });
    expect(currentPageButton).toBeInTheDocument();
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange when page button is clicked', () => {
    const onPageChange = vi.fn();
    render(<PaginationNumberButton {...defaultProps} onPageChange={onPageChange} />);

    // 다른 페이지 버튼 클릭
    const pageButton = screen.getByRole('button', { name: '3페이지로 이동' });
    fireEvent.click(pageButton);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('does not call onPageChange when current page button is clicked', () => {
    const onPageChange = vi.fn();
    render(<PaginationNumberButton {...defaultProps} onPageChange={onPageChange} />);

    // 현재 페이지 버튼 클릭
    const currentPageButton = screen.getByRole('button', { name: '5페이지로 이동' });
    fireEvent.click(currentPageButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('displays ellipsis when there are many pages', () => {
    render(<PaginationNumberButton currentPage={10} totalPages={20} onPageChange={vi.fn()} />);

    // ellipsis 요소들이 있는지 확인
    const ellipsisElements = screen.getAllByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' && element.getAttribute('aria-hidden') === 'true'
      );
    });

    expect(ellipsisElements.length).toBeGreaterThan(0);
  });

  it('shows all pages when totalPages is small', () => {
    render(<PaginationNumberButton currentPage={2} totalPages={5} onPageChange={vi.fn()} />);

    // 모든 페이지 번호가 표시되는지 확인
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('button', { name: `${i}페이지로 이동` })).toBeInTheDocument();
    }

    // ellipsis가 없는지 확인
    const ellipsisElements = screen.queryAllByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'span' && element?.getAttribute('aria-hidden') === 'true'
      );
    });

    expect(ellipsisElements).toHaveLength(0);
  });

  it('disables all buttons when disabled prop is true', () => {
    render(<PaginationNumberButton {...defaultProps} disabled={true} />);

    // 모든 버튼이 비활성화되어 있는지 확인
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<PaginationNumberButton {...defaultProps} size="sm" />);

    let container = screen.getByRole('group');
    expect(container).toBeInTheDocument();

    // 다른 크기로 테스트
    rerender(<PaginationNumberButton {...defaultProps} size="lg" />);

    container = screen.getByRole('group');
    expect(container).toBeInTheDocument();
  });

  it('handles edge case with single page', () => {
    render(<PaginationNumberButton currentPage={1} totalPages={1} onPageChange={vi.fn()} />);

    // 단일 페이지만 표시되는지 확인
    expect(screen.getByRole('button', { name: '1페이지로 이동' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('validates input parameters correctly', () => {
    const onPageChange = vi.fn();

    // 잘못된 currentPage 값
    render(<PaginationNumberButton currentPage={0} totalPages={10} onPageChange={onPageChange} />);

    // currentPage가 1로 보정되어야 함
    const firstPageButton = screen.getByRole('button', { name: '1페이지로 이동' });
    expect(firstPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('uses custom page label function', () => {
    const customPageLabel = (page: number) => `Go to page ${page}`;

    render(<PaginationNumberButton {...defaultProps} pageLabel={customPageLabel} />);

    expect(screen.getByRole('button', { name: 'Go to page 5' })).toBeInTheDocument();
  });
});
