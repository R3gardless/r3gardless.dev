import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface LoadMoreButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 텍스트
   * @default '+ 더보기'
   */
  text?: string;

  /**
   * 테마 모드 (light, dark)
   * @default 'light'
   */
  theme?: 'light' | 'dark';

  /**
   * 로딩 상태
   */
  loading?: boolean;

  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * LoadMoreButton 컴포넌트
 * 더보기 기능을 위한 전용 버튼 컴포넌트
 *
 * @example
 * ```tsx
 * <LoadMoreButton onClick={handleLoadMore} />
 *
 * <LoadMoreButton
 *   text="더 많은 태그 보기"
 *   theme="dark"
 *   onClick={handleLoadMore}
 * />
 * ```
 */
export const LoadMoreButton = forwardRef<HTMLButtonElement, LoadMoreButtonProps>(
  (
    { text = '+ 더보기', theme = 'light', loading = false, className = '', disabled, ...props },
    ref,
  ) => {
    // 기본 스타일
    const baseClasses = [
      'inline-flex items-center justify-center gap-2 rounded-sm',
      'font-bold transition-all duration-200',
      'cursor-pointer focus:outline-none focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'px-2.5 py-1.5 h-auto text-sm',
      'bg-transparent shadow-none',
    ].join(' ');

    // 테마별 색상 스타일 - CSS 변수 사용
    const themeClasses = 'text-[var(--color-text)]';

    // 호버 효과
    const hoverClasses = 'hover:bg-[var(--color-primary)] hover:bg-opacity-20 active:bg-opacity-30';

    const isDisabled = disabled ?? loading;

    const allClasses = [baseClasses, themeClasses, hoverClasses, className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={allClasses} disabled={isDisabled} data-theme={theme} {...props}>
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {!loading && <span>{text}</span>}
      </button>
    );
  },
);

LoadMoreButton.displayName = 'LoadMoreButton';
