import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import * as LucideIcons from 'lucide-react';

// ✅ 허용되는 크기 값 정의
const allowedSizes = ['sm', 'md', 'lg'] as const;
type Size = (typeof allowedSizes)[number];

// ✅ 허용되는 방향 값 정의
const allowedDirections = ['left', 'right'] as const;
type Direction = (typeof allowedDirections)[number];

// ✅ 런타임 검증 함수
function isValidSize(value: string | undefined): value is Size {
  return !!value && allowedSizes.includes(value as Size);
}

function isValidDirection(value: string | undefined): value is Direction {
  return !!value && allowedDirections.includes(value as Direction);
}

export interface PaginationChevronButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 화살표 방향
   */
  direction: 'left' | 'right';

  /**
   * 크기 설정
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 비활성화 상태
   */
  disabled?: boolean;
}

/**
 * 페이지네이션용 chevron 버튼 컴포넌트
 *
 * @example
 * ```tsx
 * <PaginationChevronButton
 *   direction="left"
 *   size="md"
 *   onClick={() => console.log('Previous page')}
 *   aria-label="이전 페이지"
 * />
 * ```
 */
export const PaginationChevronButton = forwardRef<HTMLButtonElement, PaginationChevronButtonProps>(
  ({ direction, size = 'md', disabled = false, className = '', children, ...props }, ref) => {
    // ✅ 안전한 값 검증 및 fallback
    const safeSize: Size = isValidSize(size) ? size : 'md';
    const safeDirection: Direction = isValidDirection(direction) ? direction : 'left';

    // ✅ 크기별 스타일 클래스
    const sizeClasses = {
      sm: 'w-7 h-7 p-1',
      md: 'w-8 h-8 p-1.5',
      lg: 'w-9 h-9 p-2',
    };

    // ✅ 기본 버튼 스타일 클래스
    const baseClasses = [
      'inline-flex items-center justify-center',
      'rounded-md',
      'border border-transparent',
      'focus:outline-none focus-visible:outline-none',
      'transition-all duration-200',
      'select-none',
      'text-[color:var(--color-text)]',
      sizeClasses[safeSize],
    ];

    // ✅ 상태별 스타일 클래스
    const stateClasses = disabled
      ? ['cursor-not-allowed', 'opacity-50']
      : [
          'hover:scale-110',
          'active:scale-95',
          'transition-transform',
          'duration-200',
          'cursor-pointer',
        ];

    const allClasses = [...baseClasses, ...stateClasses].join(' ');

    // ✅ 크기별 아이콘 크기 매핑
    const iconSizes = {
      sm: 16,
      md: 20,
      lg: 24,
    };

    // ✅ Lucide 아이콘 컴포넌트 선택
    const ChevronLeftIcon = LucideIcons.ChevronLeft;
    const ChevronRightIcon = LucideIcons.ChevronRight;
    const IconComponent = safeDirection === 'left' ? ChevronLeftIcon : ChevronRightIcon;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={`${allClasses} ${className}`}
        {...props}
      >
        <IconComponent size={iconSizes[safeSize]} strokeWidth={2.5} className="shrink-0" />
        {children}
      </button>
    );
  },
);

PaginationChevronButton.displayName = 'PaginationChevronButton';
