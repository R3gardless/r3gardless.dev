import React, { forwardRef } from 'react';

import { Button, ButtonProps } from '../atoms/Button';

export interface ReadMoreButtonProps extends Omit<ButtonProps, 'children' | 'icon'> {
  /**
   * 버튼 텍스트
   */
  text?: string;
}

/**
 * 더보기 버튼 컴포넌트
 *
 * @example
 * ```tsx
 * <ReadMoreButton text="더보기" variant="text" size="sm" />
 * ```
 */
export const ReadMoreButton = forwardRef<HTMLButtonElement, ReadMoreButtonProps>(
  ({ text = '+ 더보기', variant = 'text', size = 'sm', ...props }, ref) => {
    return (
      <Button ref={ref} variant={variant} size={size} {...props}>
        {text}
      </Button>
    );
  },
);

ReadMoreButton.displayName = 'ReadMoreButton';
