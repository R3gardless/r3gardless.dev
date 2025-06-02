import React, { HTMLAttributes, forwardRef } from 'react';

// ✅ 지원하는 아이콘 타입 정의
const allowedIconTypes = ['dot', 'circle', 'square', 'triangle', 'diamond'] as const;
type IconType = (typeof allowedIconTypes)[number];

// ✅ 지원하는 크기 정의
const allowedSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
type Size = (typeof allowedSizes)[number];

// ✅ 지원하는 variant 정의
const allowedVariants = ['primary', 'secondary', 'ghost', 'outline'] as const;
type Variant = (typeof allowedVariants)[number];

// ✅ 런타임 검증 함수들
function isValidIconType(value: string | undefined): value is IconType {
  return !!value && allowedIconTypes.includes(value as IconType);
}

function isValidSize(value: string | undefined): value is Size {
  return !!value && allowedSizes.includes(value as Size);
}

function isValidVariant(value: string | undefined): value is Variant {
  return !!value && allowedVariants.includes(value as Variant);
}

export interface IconProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * 아이콘의 타입
   */
  type?: 'dot' | 'circle' | 'square' | 'triangle' | 'diamond';

  /**
   * 아이콘의 크기
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * 아이콘의 시각적 스타일 변형
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';

  /**
   * 활성화 상태 (carousel indicator에서 현재 슬라이드 표시용)
   */
  isActive?: boolean;

  /**
   * 비활성화 상태
   */
  disabled?: boolean;

  /**
   * 테마 설정 (다크모드 지원)
   */
  theme?: 'light' | 'dark';
}

/**
 * 범용적으로 사용할 수 있는 Icon 컴포넌트
 * Carousel indicator dot, 상태 표시, 장식 요소 등에 활용 가능
 *
 * @example
 * ```tsx
 * // Carousel indicator dot
 * <Icon type="dot" size="sm" isActive={true} />
 *
 * // 장식용 아이콘
 * <Icon type="circle" variant="outline" size="md" />
 *
 * // 상태 표시
 * <Icon type="square" variant="primary" size="xs" />
 * ```
 */
export const Icon = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      type = 'dot',
      size = 'md',
      variant = 'primary',
      isActive = false,
      disabled = false,
      theme = 'light',
      className = '',
      ...props
    },
    ref,
  ) => {
    // ✅ 안전한 값 검증 및 fallback
    const safeType: IconType = isValidIconType(type) ? type : 'dot';
    const safeSize: Size = isValidSize(size) ? size : 'md';
    const safeVariant: Variant = isValidVariant(variant) ? variant : 'primary';

    // ✅ 기본 스타일
    const baseClasses = [
      'inline-block transition-all duration-300 ease-in-out',
      'cursor-pointer select-none',
      disabled && 'opacity-50 cursor-not-allowed',
    ]
      .filter(Boolean)
      .join(' ');

    // ✅ 크기별 스타일 정의
    const sizeClasses: Record<Size, string> = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
      xl: 'w-6 h-6',
    };

    // ✅ 타입별 모양 스타일
    const typeClasses: Record<IconType, string> = {
      dot: 'rounded-full',
      circle: 'rounded-full border-2',
      square: 'rounded-none',
      triangle: 'triangle-shape', // CSS로 구현된 삼각형
      diamond: 'rotate-45 rounded-sm',
    };

    // ✅ variant와 활성화 상태에 따른 색상 스타일
    const getVariantClasses = (variant: Variant, isActive: boolean): string => {
      const baseColorClasses = {
        primary: {
          active: 'bg-[color:var(--color-primary)] border-[color:var(--color-primary)]',
          inactive: 'bg-[color:var(--color-primary)] opacity-30',
        },
        secondary: {
          active: 'bg-[color:var(--color-secondary)] border-[color:var(--color-secondary)]',
          inactive: 'bg-[color:var(--color-secondary)] opacity-30',
        },
        ghost: {
          active: 'bg-transparent border-[color:var(--color-text)] border-2',
          inactive: 'bg-transparent border-[color:var(--color-text)] border-2 opacity-30',
        },
        outline: {
          active: 'bg-transparent border-[color:var(--color-primary)] border-2',
          inactive: 'bg-transparent border-[color:var(--color-primary)] border-2 opacity-30',
        },
      };

      return baseColorClasses[variant][isActive ? 'active' : 'inactive'];
    };

    // ✅ 호버 효과 (비활성화 상태가 아닐 때만)
    const hoverClasses = !disabled ? 'hover:scale-110 hover:opacity-100' : '';

    // ✅ 모든 클래스 조합
    const allClasses = [
      baseClasses,
      sizeClasses[safeSize],
      typeClasses[safeType],
      getVariantClasses(safeVariant, isActive),
      hoverClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={allClasses}
        data-theme={theme}
        data-active={isActive}
        aria-label={`${safeType} icon ${isActive ? 'active' : 'inactive'}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        {...props}
      />
    );
  },
);

Icon.displayName = 'Icon';
