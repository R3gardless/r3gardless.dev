import React, { forwardRef, HTMLAttributes } from 'react';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

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
    const safeMaxPageNumbers = Math.max(5, maxPageNumbers); // 최소 5개는 표시

    // ✅ 페이지 번호 배열 생성 로직
    const getPageNumbers = (): (number | 'ellipsis')[] => {
      const pages: (number | 'ellipsis')[] = [];

      if (safeTotalPages <= safeMaxPageNumbers) {
        // 전체 페이지가 최대 표시 개수보다 적으면 모든 페이지 표시
        for (let i = 1; i <= safeTotalPages; i++) {
          pages.push(i);
        }
      } else {
        // 복잡한 로직: 현재 페이지 기준으로 적절히 배치
        const half = Math.floor((safeMaxPageNumbers - 3) / 2); // 첫 페이지, 마지막 페이지, ellipsis 제외

        pages.push(1); // 항상 첫 페이지 표시

        if (safeCurrentPage <= half + 2) {
          // 현재 페이지가 앞쪽에 있을 때: [1, 2, 3, 4, 5, ..., last]
          for (let i = 2; i <= Math.min(safeMaxPageNumbers - 2, safeTotalPages - 1); i++) {
            pages.push(i);
          }
          if (safeTotalPages > safeMaxPageNumbers - 1) {
            pages.push('ellipsis');
          }
        } else if (safeCurrentPage >= safeTotalPages - half - 1) {
          // 현재 페이지가 뒤쪽에 있을 때: [1, ..., 6, 7, 8, 9, 10]
          if (safeTotalPages > safeMaxPageNumbers - 1) {
            pages.push('ellipsis');
          }
          for (
            let i = Math.max(safeTotalPages - safeMaxPageNumbers + 3, 2);
            i <= safeTotalPages - 1;
            i++
          ) {
            pages.push(i);
          }
        } else {
          // 현재 페이지가 중간에 있을 때: [1, ..., 4, 5, 6, ..., last]
          pages.push('ellipsis');
          for (let i = safeCurrentPage - half; i <= safeCurrentPage + half; i++) {
            pages.push(i);
          }
          pages.push('ellipsis');
        }

        if (safeTotalPages > 1) {
          pages.push(safeTotalPages); // 항상 마지막 페이지 표시
        }
      }

      return pages;
    };

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

    const handlePageClick = (page: number) => {
      if (!disabled && page !== safeCurrentPage) {
        onPageChange(page);
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

    const pageNumbers = getPageNumbers();

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
        <Button
          variant="icon"
          size={safeSize}
          onClick={handlePrevPage}
          disabled={disabled || safeCurrentPage <= 1}
          aria-label={prevLabel}
          noHover={true}
          className="hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          <Icon
            name="ChevronLeft"
            variant="text"
            size="md"
            isActive={!disabled && safeCurrentPage > 1}
            disabled={disabled || safeCurrentPage <= 1}
          />
        </Button>

        {/* 페이지 번호들 */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="text-[color:var(--color-text)] opacity-60 px-2 py-1 text-sm font-bold select-none flex items-center justify-center min-w-[32px] h-8 cursor-default"
                  aria-hidden="true"
                >
                  <Icon name="Ellipsis" variant="text" size="sm" isActive={true} disabled={true} />
                </span>
              );
            }

            const isCurrentPage = page === safeCurrentPage;

            return (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                disabled={disabled || isCurrentPage}
                aria-label={pageLabel(page)}
                aria-current={isCurrentPage ? 'page' : undefined}
                className={[
                  'min-w-[32px] h-8 px-2 py-1',
                  'text-sm font-bold rounded transition-all duration-200',
                  'flex items-center justify-center',
                  'focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] focus:ring-offset-1',

                  // 현재 페이지 스타일
                  isCurrentPage
                    ? [
                        'bg-[color:var(--color-primary)] text-[color:var(--color-text)]',
                        'shadow-sm cursor-default',
                        'hover:opacity-70 hover:cursor-not-allowed',
                      ].join(' ')
                    : [
                        'bg-transparent text-[color:var(--color-text)]',
                        'hover:bg-[color:var(--color-primary)] hover:bg-opacity-20',
                        'active:bg-[color:var(--color-primary)] active:bg-opacity-30',
                        'hover:scale-110 active:scale-95',
                        'cursor-pointer',
                      ].join(' '),

                  disabled && 'cursor-not-allowed',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* 다음 페이지 버튼 */}
        <Button
          variant="icon"
          size={safeSize}
          onClick={handleNextPage}
          disabled={disabled || safeCurrentPage >= safeTotalPages}
          aria-label={nextLabel}
          noHover={true}
          className="hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          <Icon
            name="ChevronRight"
            variant="text"
            size="md"
            isActive={!disabled && safeCurrentPage < safeTotalPages}
            disabled={disabled || safeCurrentPage >= safeTotalPages}
          />
        </Button>
      </div>
    );
  },
);

PaginationBar.displayName = 'PaginationBar';
