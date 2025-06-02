import React, { forwardRef } from 'react';

import { Button, ButtonProps } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

export interface ViewDetailButtonProps extends Omit<ButtonProps, 'children' | 'icon'> {
  /**
   * 버튼 텍스트
   */
  text?: string;

  /**
   * 화살표 애니메이션 활성화 여부
   */
  animated?: boolean;
}

/**
 * 자세히보기 버튼 컴포넌트 (화살표 아이콘 포함)
 *
 * @example
 * ```tsx
 * <ViewDetailButton text="자세히보기" animated={true} variant="text" />
 * ```
 */
export const ViewDetailButton = forwardRef<HTMLButtonElement, ViewDetailButtonProps>(
  (
    {
      text = '자세히보기',
      animated = true,
      variant = 'text',
      size = 'sm',
      className = '',
      ...props
    },
    ref,
  ) => {
    const buttonClasses = ['group relative overflow-hidden', className].filter(Boolean).join(' ');

    return (
      <Button ref={ref} variant={variant} size={size} className={buttonClasses} {...props}>
        <span className="flex items-center gap-2">
          {text}
          <Icon
            type="arrow"
            direction="right"
            size="xl"
            variant="text"
            isActive={true}
            className={`
              transition-transform duration-200 ease-out
              ${animated ? 'group-hover:translate-x-1' : ''}
            `}
          />
        </span>
      </Button>
    );
  },
);

ViewDetailButton.displayName = 'ViewDetailButton';
