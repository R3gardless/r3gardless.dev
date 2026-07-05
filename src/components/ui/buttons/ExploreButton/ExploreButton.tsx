import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ExploreButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 텍스트 (언어와 무관하게 영어 고정)
   * @default 'Browse all posts'
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
 * 랜딩 페이지의 "둘러보기"(Browse all posts) 버튼.
 * 라이트/다크 공통으로 채워진 반전 스타일(사각 rounded-md)을 사용합니다.
 */
export const ExploreButton = forwardRef<HTMLButtonElement, ExploreButtonProps>(
  ({ text = 'Browse all posts', loading = false, className = '', disabled, ...props }, ref) => {
    // 채워진 반전 버튼 — 배경은 본문 색, 글씨는 반전 색 / 사각(rounded-md)
    // 호버 시 크기 변화 없이 그림자만 생김
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'rounded-md px-6 py-2.5',
      'font-pretendard font-semibold text-sm',
      'bg-[color:var(--color-text)] text-[color:var(--color-text-clicked)]',
      'transition-shadow duration-300 ease-out',
      // 그림자 색은 본문 토큰(var(--color-text))만 사용 — 라이트=검정/다크=흰색으로 자동 대비
      'shadow-none hover:shadow-lg hover:shadow-[color:var(--color-text)]/25',
      'cursor-pointer focus:outline-none focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ].join(' ');

    const isDisabled = disabled ?? loading;

    const allClasses = [baseClasses, className].filter(Boolean).join(' ');

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
