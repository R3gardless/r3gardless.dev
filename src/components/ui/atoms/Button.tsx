import React, { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 스타일 변형
   */
  variant?: 'primary' | 'secondary' | 'text' | 'icon';

  /**
   * 버튼의 크기
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 전체 너비 사용 여부
   */
  fullWidth?: boolean;

  /**
   * 로딩 상태
   */
  loading?: boolean;

  /**
   * 버튼 내용
   */
  children: ReactNode;

  /**
   * 아이콘 컴포넌트
   */
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * 기본 Button 컴포넌트
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   둘러보기
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      children,
      icon: Icon,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    // 기본 스타일
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-bold transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ].join(' ');

    // variant별 스타일
    const variantClasses = {
      primary: [
        'bg-[var(--color-primary)] text-[var(--color-text)]',
        'hover:opacity-90 active:scale-95',
      ].join(' '),
      secondary: [
        'bg-[var(--color-secondary)] text-[var(--color-text)]',
        'hover:opacity-90 active:scale-95',
      ].join(' '),
      text: [
        'bg-transparent text-[var(--color-text)]',
        'shadow-none',
        'hover:bg-[var(--color-primary)] hover:bg-opacity-20',
        'active:bg-opacity-30',
      ].join(' '),
      icon: [
        'bg-transparent text-[var(--color-text)]',
        'rounded-full p-2',
        'shadow-none',
        'hover:bg-[var(--color-primary)] hover:bg-opacity-20',
        'active:bg-opacity-30',
      ].join(' '),
    };

    // size별 스타일
    const sizeClasses = {
      sm: variant === 'icon' ? 'w-8 h-8' : 'px-3 py-1.5 text-sm rounded-sm',
      md: variant === 'icon' ? 'w-10 h-10' : 'px-4 py-2 text-sm rounded-sm',
      lg: variant === 'icon' ? 'w-12 h-12' : 'px-6 py-3 text-base rounded',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const isDisabled = disabled ?? loading;

    const allClasses = [
      baseClasses,
      variantClasses[variant as keyof typeof variantClasses],
      sizeClasses[size as keyof typeof sizeClasses],
      widthClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={allClasses} disabled={isDisabled} {...props}>
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {!loading && Icon && <Icon className="flex-shrink-0" />}
        {variant !== 'icon' && <span>{children}</span>}
        {variant === 'icon' && !loading && children}
      </button>
    );
  },
);

Button.displayName = 'Button';
