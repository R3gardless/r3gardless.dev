import React, { type CSSProperties } from 'react';

export interface LabelButtonProps {
  /**
   * 라벨에 표시할 텍스트
   */
  text: string;
  /**
   * 라벨 색상
   */
  color: 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
  /**
   * 라벨 배경 RGB triplet. 있으면 color 팔레트보다 우선합니다.
   */
  rgb?: string;
  /**
   * 라벨 텍스트 RGB triplet.
   */
  foregroundRgb?: string;
  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: (event?: React.MouseEvent) => void;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * LabelButton 컴포넌트
 * 다양한 색상으로 표시되는 태그형 라벨 버튼
 */
export const LabelButton = ({
  text,
  color,
  rgb,
  foregroundRgb,
  onClick,
  className = '',
}: LabelButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center px-3 py-1 rounded-lg text-sm font-pretendard font-normal leading-tight focus:outline-none focus-visible:outline-none';
  const interactiveStyles = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  const colorStyle = rgb
    ? ({
        '--label-bg-rgb': rgb,
        '--label-text-rgb': foregroundRgb || '24 24 23',
        backgroundColor: 'rgb(var(--label-bg-rgb))',
        color: 'rgb(var(--label-text-rgb))',
      } as CSSProperties)
    : {
        backgroundColor: `var(--color-${color})`,
        color: 'var(--color-text)',
      };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      style={colorStyle}
      onClick={onClick}
      type={onClick ? 'button' : undefined} // onClick이 있으면 button 요소로, 없으면 span 요소로 렌더링
    >
      {text}
    </Component>
  );
};
