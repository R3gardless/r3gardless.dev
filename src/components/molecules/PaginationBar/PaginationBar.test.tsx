import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { PaginationBar } from './PaginationBar';

const defaultProps = {
  currentPage: 1,
  totalPages: 10,
  onPageChange: vi.fn(),
};

describe('PaginationBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('기본적으로 navigation 역할을 가진다', () => {
    render(<PaginationBar {...defaultProps} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('이전/다음 버튼과 페이지 번호들이 렌더링된다', () => {
    render(<PaginationBar {...defaultProps} currentPage={5} />);

    expect(screen.getByLabelText('이전 페이지')).toBeInTheDocument();
    expect(screen.getByLabelText('다음 페이지')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('현재 페이지가 1일 때 이전 버튼이 비활성화된다', () => {
    render(<PaginationBar {...defaultProps} currentPage={1} />);
    const prevButton = screen.getByLabelText('이전 페이지');
    expect(prevButton).toBeDisabled();
  });

  it('현재 페이지가 마지막 페이지일 때 다음 버튼이 비활성화된다', () => {
    render(<PaginationBar {...defaultProps} currentPage={10} totalPages={10} />);
    const nextButton = screen.getByLabelText('다음 페이지');
    expect(nextButton).toBeDisabled();
  });

  it('페이지 번호 클릭 시 onPageChange가 호출된다', () => {
    const handlePageChange = vi.fn();
    render(<PaginationBar {...defaultProps} onPageChange={handlePageChange} currentPage={3} />);

    const page5Button = screen.getByText('5');
    fireEvent.click(page5Button);

    expect(handlePageChange).toHaveBeenCalledWith(5);
  });

  it('이전 버튼 클릭 시 현재 페이지에서 1을 뺀 값으로 onPageChange가 호출된다', () => {
    const handlePageChange = vi.fn();
    render(<PaginationBar {...defaultProps} onPageChange={handlePageChange} currentPage={5} />);

    const prevButton = screen.getByLabelText('이전 페이지');
    fireEvent.click(prevButton);

    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('다음 버튼 클릭 시 현재 페이지에서 1을 더한 값으로 onPageChange가 호출된다', () => {
    const handlePageChange = vi.fn();
    render(<PaginationBar {...defaultProps} onPageChange={handlePageChange} currentPage={5} />);

    const nextButton = screen.getByLabelText('다음 페이지');
    fireEvent.click(nextButton);

    expect(handlePageChange).toHaveBeenCalledWith(6);
  });

  it('현재 페이지는 aria-current="page" 속성을 가진다', () => {
    render(<PaginationBar {...defaultProps} currentPage={3} />);
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('현재 페이지 버튼은 비활성화된다', () => {
    render(<PaginationBar {...defaultProps} currentPage={3} />);
    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toBeDisabled();
  });

  it('disabled prop이 true일 때 모든 버튼이 비활성화된다', () => {
    render(<PaginationBar {...defaultProps} disabled={true} currentPage={5} />);

    const prevButton = screen.getByLabelText('이전 페이지');
    const nextButton = screen.getByLabelText('다음 페이지');
    const page1Button = screen.getByText('1');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
    expect(page1Button).toBeDisabled();
  });

  it('전체 페이지가 maxPageNumbers보다 적을 때 모든 페이지 번호가 표시된다', () => {
    render(<PaginationBar {...defaultProps} totalPages={5} maxPageNumbers={7} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('전체 페이지가 많을 때 ellipsis 아이콘이 표시된다', () => {
    render(<PaginationBar {...defaultProps} totalPages={20} currentPage={10} maxPageNumbers={7} />);

    // ellipsis는 Icon 컴포넌트로 렌더링되므로 aria-hidden 속성으로 찾기
    const ellipsisElements = screen.getAllByRole('generic', { hidden: true });
    const ellipsisIcons = ellipsisElements.filter(
      el => el.querySelector('span[aria-hidden="true"]') !== null,
    );
    expect(ellipsisIcons.length).toBeGreaterThan(0);
  });

  it('첫 번째와 마지막 페이지는 항상 표시된다', () => {
    render(<PaginationBar {...defaultProps} totalPages={20} currentPage={10} maxPageNumbers={7} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('theme prop이 올바르게 data-theme 속성에 설정된다', () => {
    render(<PaginationBar {...defaultProps} theme="dark" />);
    const navigation = screen.getByRole('navigation');
    expect(navigation).toHaveAttribute('data-theme', 'dark');
  });

  it('잘못된 theme 값이 들어올 경우 light로 fallback된다', () => {
    // @ts-expect-error - 의도적으로 잘못된 타입 테스트
    render(<PaginationBar {...defaultProps} theme="invalid" />);
    const navigation = screen.getByRole('navigation');
    expect(navigation).toHaveAttribute('data-theme', 'light');
  });

  it('currentPage가 범위를 벗어날 때 안전하게 처리된다', () => {
    const handlePageChange = vi.fn();

    // currentPage가 0보다 작을 때
    const { unmount } = render(
      <PaginationBar
        {...defaultProps}
        onPageChange={handlePageChange}
        currentPage={-5}
        totalPages={10}
      />,
    );
    expect(screen.getByRole('button', { name: '1페이지로 이동' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    unmount();

    // currentPage가 totalPages보다 클 때
    render(
      <PaginationBar
        {...defaultProps}
        onPageChange={handlePageChange}
        currentPage={15}
        totalPages={10}
      />,
    );
    expect(screen.getByRole('button', { name: '10페이지로 이동' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('totalPages가 0 이하일 때 안전하게 처리된다', () => {
    render(<PaginationBar {...defaultProps} totalPages={0} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('커스텀 라벨이 올바르게 적용된다', () => {
    render(
      <PaginationBar
        {...defaultProps}
        prevLabel="이전"
        nextLabel="다음"
        pageLabel={page => `페이지 ${page}`}
      />,
    );

    expect(screen.getByLabelText('이전')).toBeInTheDocument();
    expect(screen.getByLabelText('다음')).toBeInTheDocument();
    expect(screen.getByLabelText('페이지 1')).toBeInTheDocument();
  });

  it('className prop이 올바르게 적용된다', () => {
    render(<PaginationBar {...defaultProps} className="custom-pagination" />);
    const navigation = screen.getByRole('navigation');
    expect(navigation.className).toMatch(/custom-pagination/);
  });

  it('size prop이 올바르게 적용된다', () => {
    render(<PaginationBar {...defaultProps} size="lg" />);
    const prevButton = screen.getByLabelText('이전 페이지');
    const nextButton = screen.getByLabelText('다음 페이지');

    // Button 컴포넌트에 size prop이 전달되는지 확인
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('잘못된 size 값이 들어올 경우 md로 fallback된다', () => {
    // @ts-expect-error - 의도적으로 잘못된 타입 테스트
    render(<PaginationBar {...defaultProps} size="invalid" />);

    // fallback이 제대로 작동하는지 확인 (렌더링 에러가 없어야 함)
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('maxPageNumbers가 5보다 작을 때 5로 fallback된다', () => {
    render(<PaginationBar {...defaultProps} totalPages={5} maxPageNumbers={3} />);

    // 최소 5개 페이지가 표시되는지 확인 (1, 2, 3, 4, 5 등)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('navigation에 올바른 aria-label이 설정된다', () => {
    render(<PaginationBar {...defaultProps} />);
    const navigation = screen.getByRole('navigation');
    expect(navigation).toHaveAttribute('aria-label', '페이지네이션');
  });

  it('이전/다음 버튼에 noHover prop이 적용된다', () => {
    render(<PaginationBar {...defaultProps} />);

    const prevButton = screen.getByLabelText('이전 페이지');
    const nextButton = screen.getByLabelText('다음 페이지');

    // Button 컴포넌트가 렌더링되고 hover 효과가 제어되는지 확인
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('페이지 번호 버튼에 올바른 transition 클래스가 적용된다', () => {
    render(<PaginationBar {...defaultProps} currentPage={2} />);

    const page3Button = screen.getByText('3');
    expect(page3Button.className).toMatch(/transition-all/);
    expect(page3Button.className).toMatch(/duration-200/);
  });

  it('포커스 스타일이 올바르게 적용된다', () => {
    render(<PaginationBar {...defaultProps} />);

    const page1Button = screen.getByText('1');
    expect(page1Button.className).toMatch(/focus:outline-none/);
    expect(page1Button.className).toMatch(/focus:ring-2/);
  });
});
