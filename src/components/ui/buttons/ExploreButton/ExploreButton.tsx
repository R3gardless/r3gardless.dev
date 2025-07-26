import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ExploreButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 텍스트
   * @default '둘러보기'
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
 * ExploreButton 컴포넌트
 * 랜딩 페이지의 "둘러보기" 버튼을 위한 전용 컴포넌트
 * Glassmorphism과 미니멀 디자인 적용
 */
export const ExploreButton = forwardRef<HTMLButtonElement, ExploreButtonProps>(
  ({ text = '둘러보기', loading = false, className = '', disabled, ...props }, ref) => {
    // Glassmorphism + 미니멀 스타일
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-bold transition-all duration-300 ease-out',
      'cursor-pointer focus:outline-none focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'px-6 py-3 text-sm rounded-xl',
      'backdrop-blur-md bg-white/10 dark:bg-black/10',
      'border border-white/20 dark:border-white/10',
      'text-[color:var(--color-text)]',
      'shadow-lg shadow-black/5 dark:shadow-black/20',
    ].join(' ');

    // Glassmorphism 호버 효과
    const hoverClasses = [
      'hover:bg-white/20 dark:hover:bg-white/5',
      'hover:border-white/30 dark:hover:border-white/20',
      'hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30',
      'hover:scale-[1.02]',
      'active:scale-[0.98]',
      'transform',
    ].join(' ');

    const isDisabled = disabled ?? loading;

    const allClasses = [baseClasses, hoverClasses, className].filter(Boolean).join(' ');

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

ExploreButton.displayName = 'ExploreButton';
