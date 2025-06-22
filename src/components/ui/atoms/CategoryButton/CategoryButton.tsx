import React, { forwardRef } from 'react';

export interface CategoryButtonProps {
  /**
   * 카테고리 버튼 텍스트
   */
  children: React.ReactNode;
  /**
   * 버튼이 선택된 상태인지 여부
   */
  isSelected?: boolean;
  /**
   * 버튼 레이아웃 방향
   * horizontal: 수평 레이아웃 (하단 선 표시)
   * vertical: 수직 레이아웃 (배경색 변경)
   */
  variant: 'horizontal' | 'vertical';
  /**
   * 테마 모드 (light, dark)
   * @default 'light'
   */
  theme?: 'light' | 'dark';
  /**
   * 비활성화 상태
   * @default false
   */
  disabled?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: () => void;
}

/**
 * CategoryButton 컴포넌트
 * 카테고리 선택 버튼을 위한 원자 컴포넌트
 * horizontal과 vertical 두 가지 레이아웃을 지원
 */
export const CategoryButton = forwardRef<HTMLButtonElement, CategoryButtonProps>(
  (
    {
      children,
      isSelected = false,
      variant,
      theme = 'light',
      disabled = false,
      className = '',
      onClick,
    },
    ref,
  ) => {
    // 공통 기본 스타일
    const baseStyles =
      'transition-all duration-200 flex items-center focus:outline-none focus-visible:outline-none';

    // Horizontal 레이아웃 스타일
    const horizontalStyles = `
    relative whitespace-nowrap px-4 py-4 text-sm duration-300 ease-in-out
    flex-shrink-0 min-w-fit
    ${
      isSelected
        ? 'text-[color:var(--color-text)] font-bold cursor-default'
        : 'text-[color:var(--color-text)] font-normal hover:opacity-70 cursor-pointer'
    }
  `;

    // Vertical 레이아웃 스타일
    const verticalStyles = `
    px-2.5 py-1.5 text-left text-sm rounded w-full cursor-pointer
    ${
      isSelected
        ? 'bg-[color:var(--color-primary)] text-[color:var(--color-text)] font-bold'
        : 'bg-transparent text-[color:var(--color-text)] font-normal hover:bg-[color:var(--color-primary)] hover:bg-opacity-50'
    }
  `;

    // 비활성화 스타일
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const buttonStyles = variant === 'horizontal' ? horizontalStyles : verticalStyles;

    return (
      <button
        ref={ref}
        type="button"
        onClick={!disabled && !isSelected ? onClick : undefined}
        disabled={disabled || isSelected}
        data-theme={theme}
        className={`${baseStyles} ${buttonStyles} ${disabledStyles} ${className}`}
        aria-pressed={isSelected}
        aria-disabled={disabled || isSelected}
      >
        {children}

        {/* Horizontal 레이아웃의 하단 구분선과 선택 표시 */}
        {variant === 'horizontal' && (
          <>
            {/* 개별 카테고리 하단 구분선 - 얇은 선으로 표시 */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[color:var(--color-text)] opacity-30" />

            {/* 선택된 카테고리 하단 강조 선 - 구분선과 동일한 위치 */}
            {isSelected && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[color:var(--color-text)] transition-all duration-300 opacity-100 z-10" />
            )}
          </>
        )}
      </button>
    );
  },
);

CategoryButton.displayName = 'CategoryButton';

export default CategoryButton;
