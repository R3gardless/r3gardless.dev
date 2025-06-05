import React, { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

// ✅ 안전한 variant 값 정의
const allowedVariants = ['primary', 'secondary', 'text', 'icon'] as const;
type Variant = (typeof allowedVariants)[number];

// ✅ 안전한 size 값 정의
const allowedSizes = ['sm', 'md', 'lg'] as const;
type Size = (typeof allowedSizes)[number];

// ✅ 런타임 체크 함수
function isValidVariant(value: string | undefined): value is Variant {
  return !!value && allowedVariants.includes(value as Variant);
}

function isValidSize(value: string | undefined): value is Size {
  return !!value && allowedSizes.includes(value as Size);
}

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
   * 호버 시 스타일 효과를 제거합니다.
   * 기본값은 `false`이며, 일반적인 버튼에는 호버 효과가 적용됩니다.
   *
   * 예: 모바일에서 hover 효과를 방지하거나, 정적인 버튼 UI가 필요할 때 사용하세요.
   */
  noHover?: boolean;

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
      noHover = false,
      children,
      icon: Icon,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    // ✅ 잘못된 값이 들어올 경우 fallback
    const safeVariant: Variant = isValidVariant(variant) ? variant : 'primary';
    const safeSize: Size = isValidSize(size) ? size : 'md';

    // ✅ 기본 스타일
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-bold transition-all duration-200',
      'focus:outline-none focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ].join(' ');

    // ✅ variant별 스타일 정의 (hover 효과 포함)
    const getVariantClasses = (variant: Variant, noHover: boolean): string => {
      const baseStyles = {
        primary: 'bg-[var(--color-primary)] text-[var(--color-text)]',
        secondary: 'bg-[var(--color-secondary)] text-[var(--color-text)]',
        text: 'bg-transparent text-[var(--color-text)] shadow-none',
        icon: 'bg-transparent text-[var(--color-text)] rounded-full p-2 shadow-none',
      };

      const hoverStyles = {
        primary: 'hover:opacity-90 active:scale-95',
        secondary: 'hover:opacity-90 active:scale-95',
        text: 'hover:bg-[var(--color-primary)] hover:bg-opacity-20 active:bg-opacity-30',
        icon: 'hover:bg-[var(--color-primary)] hover:bg-opacity-20 active:bg-opacity-30',
      };

      return noHover ? baseStyles[variant] : `${baseStyles[variant]} ${hoverStyles[variant]}`;
    };

    // ✅ size별 스타일 정의
    const sizeClasses: Record<Size, string> = {
      sm: safeVariant === 'icon' ? 'w-8 h-8' : 'px-3 py-1.5 text-sm rounded-sm',
      md: safeVariant === 'icon' ? 'w-10 h-10' : 'px-4 py-2 text-sm rounded-sm',
      lg: safeVariant === 'icon' ? 'w-12 h-12' : 'px-6 py-3 text-base rounded',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const isDisabled = disabled ?? loading;

    const allClasses = [
      baseClasses,
      getVariantClasses(safeVariant, noHover),
      sizeClasses[safeSize],
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
        {safeVariant !== 'icon' && <span>{children}</span>}
        {safeVariant === 'icon' && !loading && children}
      </button>
    );
  },
);

Button.displayName = 'Button';
