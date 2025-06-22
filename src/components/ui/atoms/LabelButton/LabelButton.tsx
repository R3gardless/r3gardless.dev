import React from 'react';

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
   * 테마 모드 (light, dark)
   * @default 'light'
   */
  theme?: 'light' | 'dark';
  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: () => void;
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
  theme = 'light',
  onClick,
  className = '',
}: LabelButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center px-3 py-1 rounded-lg text-sm font-pretendard font-normal leading-tight';
  const interactiveStyles = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  // CSS 변수를 사용한 배경색 스타일
  const colorStyle = {
    backgroundColor: `var(--color-label-${color})`,
    color: 'var(--color-text)',
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={`${baseStyles} ${interactiveStyles} ${className}`}
      style={colorStyle}
      onClick={onClick}
      data-theme={theme}
      type={onClick ? 'button' : undefined} // onClick이 있으면 button 요소로, 없으면 span 요소로 렌더링
    >
      {text}
    </Component>
  );
};
