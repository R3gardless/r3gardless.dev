import { Ellipsis } from 'lucide-react';
import React, { forwardRef, HTMLAttributes } from 'react';

// ✅ 허용되는 크기 값 정의
const allowedSizes = ['sm', 'md', 'lg'] as const;
type Size = (typeof allowedSizes)[number];

// ✅ 런타임 검증 함수
function isValidSize(value: string | undefined): value is Size {
  return !!value && allowedSizes.includes(value as Size);
}

export interface PaginationNumberButtonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
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
   * 버튼 비활성화 여부
   */
  disabled?: boolean;

  /**
   * 크기 설정
   */
  size?: Size;

  /**
   * 페이지 번호 버튼 라벨 템플릿 (접근성용)
   */
  pageLabel?: (page: number) => string;
}

/**
 * 페이지네이션 숫자 버튼 컴포넌트
 * 페이지 번호들과 ellipsis를 관리하는 컴포넌트
 *
 * @example
 * ```tsx
 * <PaginationNumberButton
 *   currentPage={3}
 *   totalPages={10}
 *   onPageChange={(page) => console.log('Page changed to:', page)}
 *   maxPageNumbers={7}
 *   size="md"
 * />
 * ```
 */
export const PaginationNumberButton = forwardRef<HTMLDivElement, PaginationNumberButtonProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      maxPageNumbers = 7,
      disabled = false,
      size = 'md',
      pageLabel = (page: number) => `${page}페이지로 이동`,
      className = '',
      ...props
    },
    ref,
  ) => {
    // ✅ 안전한 값 검증 및 fallback
    const safeSize: Size = isValidSize(size) ? size : 'md';

    // ✅ 입력값 검증
    const safeTotalPages = Math.max(1, totalPages);
    const safeCurrentPage = Math.max(1, Math.min(currentPage, safeTotalPages));
    const safeMaxPageNumbers = Math.max(5, maxPageNumbers); // 최소 5개는 표시

    // ✅ 전체 페이지가 최대 표시 개수보다 적을 때 모든 페이지 번호 생성
    const getAllPages = (): number[] => {
      const pages: number[] = [];
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
      return pages;
    };

    // ✅ 현재 페이지가 앞쪽에 있을 때의 페이지 번호 생성: [1, 2, 3, 4, 5, ..., last]
    const getStartPages = (): (number | 'ellipsis')[] => {
      const pages: (number | 'ellipsis')[] = [1];

      // 첫 페이지 다음부터 연속된 페이지들 추가
      for (let i = 2; i <= Math.min(safeMaxPageNumbers - 2, safeTotalPages - 1); i++) {
        pages.push(i);
      }

      // 생략 기호 추가 (필요한 경우)
      if (safeTotalPages > safeMaxPageNumbers - 1) {
        pages.push('ellipsis');
      }

      return pages;
    };

    // ✅ 현재 페이지가 뒤쪽에 있을 때의 페이지 번호 생성: [1, ..., 6, 7, 8, 9, 10]
    const getEndPages = (): (number | 'ellipsis')[] => {
      const pages: (number | 'ellipsis')[] = [1];

      // 생략 기호 추가 (필요한 경우)
      if (safeTotalPages > safeMaxPageNumbers - 1) {
        pages.push('ellipsis');
      }

      // 마지막 페이지 앞의 연속된 페이지들 추가
      for (
        let i = Math.max(safeTotalPages - safeMaxPageNumbers + 3, 2);
        i <= safeTotalPages - 1;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    };

    // ✅ 현재 페이지가 중간에 있을 때의 페이지 번호 생성: [1, ..., 4, 5, 6, ..., last]
    const getMiddlePages = (half: number): (number | 'ellipsis')[] => {
      const pages: (number | 'ellipsis')[] = [1];

      // 첫 번째 생략 기호 추가
      pages.push('ellipsis');

      // 현재 페이지를 중심으로 한 페이지들 추가
      for (let i = safeCurrentPage - half; i <= safeCurrentPage + half; i++) {
        pages.push(i);
      }

      // 두 번째 생략 기호 추가
      pages.push('ellipsis');

      return pages;
    };

    // ✅ 페이지 번호 배열 생성 로직 (메인 함수)
    const getPageNumbers = (): (number | 'ellipsis')[] => {
      // 전체 페이지가 최대 표시 개수보다 적으면 모든 페이지 표시
      if (safeTotalPages <= safeMaxPageNumbers) {
        return getAllPages();
      }

      /**
       * 현재 페이지를 중심으로 대칭적으로 배치할 페이지 번호 개수의 절반을 계산
       * 3을 빼는 이유: 첫 페이지(1), 마지막 페이지(n), 그리고 최소 하나의 생략 기호(...) 공간 확보
       * 이를 통해 경계값(첫/마지막 페이지)을 항상 표시하면서도 중간 페이지 번호들을 위한 공간을 보장
       */
      const half = Math.floor((safeMaxPageNumbers - 3) / 2); // 첫 페이지, 마지막 페이지, ellipsis 제외
      let pages: (number | 'ellipsis')[] = [];

      // 현재 페이지 위치에 따른 페이지 번호 배열 생성
      if (safeCurrentPage <= half + 2) {
        pages = getStartPages();
      } else if (safeCurrentPage >= safeTotalPages - half - 1) {
        pages = getEndPages();
      } else {
        pages = getMiddlePages(half);
      }

      // 마지막 페이지 추가 (항상 표시)
      if (safeTotalPages > 1) {
        pages.push(safeTotalPages);
      }

      return pages;
    };

    // ✅ 이벤트 핸들러
    const handlePageClick = (page: number) => {
      if (!disabled && page !== safeCurrentPage) {
        onPageChange(page);
      }
    };

    // ✅ 크기별 스타일 정의
    const sizeClasses: Record<Size, { button: string; ellipsis: string }> = {
      sm: {
        button: 'w-[28px] h-7 px-1 py-1 text-xs',
        ellipsis: 'min-w-[28px] h-7 text-xs',
      },
      md: {
        button: 'w-[32px] h-8 px-2 py-1 text-sm',
        ellipsis: 'min-w-[32px] h-8 text-sm',
      },
      lg: {
        button: 'w-[36px] h-9 px-2 py-1 text-base',
        ellipsis: 'min-w-[36px] h-9 text-base',
      },
    };

    // ✅ 페이지 번호 버튼 스타일 생성 함수
    const getPageButtonClasses = (isCurrentPage: boolean, size: Size): string => {
      const baseClasses = [
        'inline-flex items-center justify-center',
        'font-bold transition-all duration-200 rounded-sm',
        'cursor-pointer focus:outline-none focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
      ].join(' ');

      const variantClasses = isCurrentPage
        ? 'bg-[var(--color-primary)] text-[var(--color-text)]'
        : 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:bg-opacity-20 active:bg-opacity-30';

      const sizeClass = sizeClasses[size].button;

      return [baseClasses, variantClasses, sizeClass].filter(Boolean).join(' ');
    };

    const pageNumbers = getPageNumbers();

    return (
      <div
        ref={ref}
        className={`flex items-center gap-1 ${className}`}
        role="group"
        aria-label="페이지 번호"
        {...props}
      >
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className={`text-[color:var(--color-text)] opacity-80 font-bold select-none flex items-center justify-center cursor-default ${sizeClasses[safeSize].ellipsis}`}
                aria-hidden="true"
              >
                <Ellipsis size={16} strokeWidth={2.5} />
              </span>
            );
          }

          const isCurrentPage = page === safeCurrentPage;

          return (
            <button
              key={page}
              type="button"
              className={getPageButtonClasses(isCurrentPage, safeSize)}
              onClick={() => {
                handlePageClick(page);
              }}
              disabled={disabled || isCurrentPage}
              aria-label={pageLabel(page)}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>
    );
  },
);

PaginationNumberButton.displayName = 'PaginationNumberButton';
