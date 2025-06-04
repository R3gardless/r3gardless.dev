import React, { HTMLAttributes, forwardRef } from 'react';
import * as LucideIcons from 'lucide-react';

// ✅ Lucide 아이콘 이름 추출 (자동 타입화)
export type LucideIconName = keyof typeof LucideIcons;

// ✅ 지원하는 크기 정의
const allowedSizes = ['sm', 'md', 'lg', 'xl'] as const;
type Size = (typeof allowedSizes)[number];

// ✅ 지원하는 variant 정의
const allowedVariants = ['text', 'primary', 'secondary'] as const;
type Variant = (typeof allowedVariants)[number];

// ✅ 런타임 검증 함수들
function isValidSize(value: string | undefined): value is Size {
  return !!value && allowedSizes.includes(value as Size);
}

function isValidVariant(value: string | undefined): value is Variant {
  return !!value && allowedVariants.includes(value as Variant);
}

export interface IconProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Lucide 아이콘 이름
   */
  name?: LucideIconName;

  /**
   * 아이콘의 크기
   */
  size?: Size;

  /**
   * 아이콘의 시각적 스타일 변형
   */
  variant?: Variant;

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

  /**
   * 스트로크 두께 (Lucide 아이콘의 선 굵기)
   */
  strokeWidth?: number;
}

/**
 * Lucide React 아이콘을 기반으로 한 범용 Icon 컴포넌트
 * 다양한 크기, 색상 변형, 상태를 지원합니다.
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * <Icon name="Search" size="md" variant="primary" />
 *
 * // 검색 아이콘
 * <Icon name="Search" size="sm" variant="text" />
 *
 * // 활성 상태 표시 (Carousel indicator 등)
 * <Icon name="Ellipsis" size="sm" isActive={true} />
 *
 * // 화살표 아이콘
 * <Icon name="ArrowDownRight" size="lg" />
 * ```
 */
export const Icon = forwardRef<HTMLDivElement, IconProps>(
  (
    {
      name = 'CircleX',
      size = 'md',
      variant = 'text',
      isActive = false,
      disabled = false,
      theme = 'light',
      strokeWidth = 2.5,
      className = '',
      ...props
    },
    ref,
  ) => {
    // ✅ 안전한 값 fallback
    const safeSize: Size = isValidSize(size) ? size : 'md';
    const safeVariant: Variant = isValidVariant(variant) ? variant : 'text';

    // ✅ Lucide 아이콘 컴포넌트 동적 가져오기
    const iconName = name;

    const LucideIcon = (LucideIcons[iconName] ?? LucideIcons['CircleX']) as React.ComponentType<{
      size: number;
      strokeWidth: number;
    }>;

    // ✅ 실제 렌더링되는 아이콘 이름 (fallback 고려)
    const actualIconName: string = LucideIcons[iconName] ? String(iconName) : 'CircleX';

    // ✅ 기본 스타일
    const baseClasses = [
      'inline-flex items-center justify-center transition-all duration-300 ease-in-out',
      'select-none',
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    ]
      .filter(Boolean)
      .join(' ');

    // ✅ 크기별 스타일 정의 (아이콘과 컨테이너 크기)
    const sizeClasses: Record<Size, { container: string; icon: number }> = {
      sm: { container: 'w-5 h-5', icon: 16 },
      md: { container: 'w-6 h-6', icon: 20 },
      lg: { container: 'w-8 h-8', icon: 24 },
      xl: { container: 'w-10 h-10', icon: 28 },
    };

    // ✅ variant에 따른 색상 스타일
    const getVariantClasses = (variant: Variant, isActive: boolean): string => {
      const baseColor = {
        text: 'text-[color:var(--color-text)]',
        primary: 'text-[color:var(--color-primary)]',
        secondary: 'text-[color:var(--color-secondary)]',
      };

      const opacity = isActive ? 'opacity-100' : 'opacity-50';
      return `${baseColor[variant]} ${opacity}`;
    };

    // ✅ 호버 효과
    const hoverClasses = disabled ? '' : 'hover:scale-110 hover:opacity-100';

    // ✅ 모든 클래스 조합
    const combinedClasses = [
      baseClasses,
      sizeClasses[safeSize].container,
      getVariantClasses(safeVariant, isActive),
      hoverClasses,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        ref={ref}
        className={combinedClasses}
        data-theme={theme}
        data-active={isActive}
        data-disabled={disabled}
        aria-label={`${actualIconName} icon ${isActive ? 'active' : 'inactive'}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        <LucideIcon size={sizeClasses[safeSize].icon} strokeWidth={strokeWidth} />
      </div>
    );
  },
);

Icon.displayName = 'Icon';
