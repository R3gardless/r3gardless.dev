import React, { forwardRef, HTMLAttributes } from 'react';

import { PaginationChevronButton } from '@/components/ui/atoms/PaginationChevronButton';
import { PaginationNumberButton } from '@/components/ui/atoms/PaginationNumberButton';

// ✅ 허용되는 테마 값 정의
const allowedThemes = ['light', 'dark'] as const;
type Theme = (typeof allowedThemes)[number];

// ✅ 허용되는 크기 값 정의
const allowedSizes = ['sm', 'md', 'lg'] as const;
type Size = (typeof allowedSizes)[number];

// ✅ 런타임 검증 함수들
function isValidTheme(value: string | undefined): value is Theme {
  return !!value && allowedThemes.includes(value as Theme);
}

function isValidSize(value: string | undefined): value is Size {
  return !!value && allowedSizes.includes(value as Size);
}

export interface PaginationBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * 현재 페이지 번호 (1부터 시작)
   */
  currentPage: number;

  /**
   * 전체 페이지 수
   */
  totalPages: number;

  /**
   * 페이지 변경 시 호출되는 콜백 함수
   */
  onPageChange: (page: number) => void;

  /**
   * 표시할 페이지 번호의 최대 개수 (기본값: 7)
   * 예: maxPageNumbers=7일 때 [1, 2, 3, 4, 5, ..., 10] 형태로 표시
   */
  maxPageNumbers?: number;

  /**
   * 이전/다음 버튼 비활성화 여부
   */
  disabled?: boolean;

  /**
   * 테마 설정
   */
  theme?: 'light' | 'dark';

  /**
   * 크기 설정
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 이전 페이지 버튼 라벨 (접근성용)
   */
  prevLabel?: string;

  /**
   * 다음 페이지 버튼 라벨 (접근성용)
   */
  nextLabel?: string;

  /**
   * 페이지 번호 버튼 라벨 템플릿 (접근성용)
   */
  pageLabel?: (page: number) => string;
}

/**
 * 페이지네이션 바 컴포넌트
 *
 * @example
 * ```tsx
 * <PaginationBar
 *   currentPage={3}
 *   totalPages={10}
 *   onPageChange={(page) => console.log('Page changed to:', page)}
 *   maxPageNumbers={7}
 *   theme="light"
 * />
 * ```
 */
export const PaginationBar = forwardRef<HTMLDivElement, PaginationBarProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      maxPageNumbers = 7,
      disabled = false,
      theme = 'light',
      size = 'md',
      prevLabel = '이전 페이지',
      nextLabel = '다음 페이지',
      pageLabel = (page: number) => `${page}페이지로 이동`,
      className = '',
      ...props
    },
    ref,
  ) => {
    // ✅ 안전한 값 검증 및 fallback
    const safeTheme: Theme = isValidTheme(theme) ? theme : 'light';
    const safeSize: Size = isValidSize(size) ? size : 'md';

    // ✅ 입력값 검증
    const safeTotalPages = Math.max(1, totalPages);
    const safeCurrentPage = Math.max(1, Math.min(currentPage, safeTotalPages));

    // ✅ 이벤트 핸들러들
    const handlePrevPage = () => {
      if (!disabled && safeCurrentPage > 1) {
        onPageChange(safeCurrentPage - 1);
      }
    };

    const handleNextPage = () => {
      if (!disabled && safeCurrentPage < safeTotalPages) {
        onPageChange(safeCurrentPage + 1);
      }
    };

    // ✅ 스타일 클래스들
    const containerClasses = [
      'flex items-center justify-center gap-2',
      'bg-[color:var(--color-background)]',
      'p-2 rounded-lg',
      'transition-opacity duration-200',
      disabled && 'opacity-50 pointer-events-none',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={`${containerClasses} ${className}`}
        data-theme={safeTheme}
        aria-label="페이지네이션"
        role="navigation"
        {...props}
      >
        {/* 이전 페이지 버튼 */}
        <PaginationChevronButton
          direction="left"
          size={safeSize}
          onClick={handlePrevPage}
          disabled={disabled || safeCurrentPage <= 1}
          aria-label={prevLabel}
        />

        {/* 페이지 번호들 */}
        <PaginationNumberButton
          currentPage={safeCurrentPage}
          totalPages={safeTotalPages}
          onPageChange={onPageChange}
          maxPageNumbers={maxPageNumbers}
          disabled={disabled}
          size={safeSize}
          pageLabel={pageLabel}
        />

        {/* 다음 페이지 버튼 */}
        <PaginationChevronButton
          direction="right"
          size={safeSize}
          onClick={handleNextPage}
          disabled={disabled || safeCurrentPage >= safeTotalPages}
          aria-label={nextLabel}
        />
      </div>
    );
  },
);

PaginationBar.displayName = 'PaginationBar';
