import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface LoadMoreButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 텍스트
   * @default '+ 더보기'
   */
  text?: string;

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
  ({ text = '+ 더보기', loading = false, className = '', disabled, ...props }, ref) => {
    // 미니멀리즘 기본 스타일
    const baseClasses = [
      'inline-flex items-center justify-center gap-2 rounded-lg',
      'font-bold transition-all duration-200',
      'cursor-pointer focus:outline-none focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'px-6 py-3 text-sm border',
      'bg-transparent',
    ].join(' ');

    // 미니멀리즘 테마 색상 - 얇은 테두리와 subtle 호버
    const themeClasses = 'text-[var(--color-text)] border-[var(--color-text)]/20';

    // 미니멀리즘 호버 효과 - 배경색 대신 테두리 강조
    const hoverClasses =
      'hover:border-[var(--color-text)]/40 hover:bg-[var(--color-text)]/5 active:bg-[var(--color-text)]/10';

    const isDisabled = disabled ?? loading;

    const allClasses = [baseClasses, themeClasses, hoverClasses, className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={allClasses} disabled={isDisabled} {...props}>
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {!loading && <span>{text}</span>}
      </button>
    );
  },
);

LoadMoreButton.displayName = 'LoadMoreButton';
