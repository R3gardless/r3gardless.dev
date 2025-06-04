import React from 'react';

export interface TagProps {
  /**
   * 태그 텍스트 내용
   */
  text: string;
  /**
   * 테마 모드 (light, dark)
   * @default 'light'
   */
  theme?: 'light' | 'dark';
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 클릭 이벤트 핸들러
   */
  onClick?: () => void;
}

/**
 * 기본 태그 컴포넌트
 * 테마 변수를 사용하여 색상 적용
 */
export const Tag = ({ text, theme = 'light', className = '', onClick }: TagProps) => {
  // 기본 스타일
  const baseStyles = 'inline-block rounded-full px-3 py-1 text-sm';

  // 테마에 따른 스타일 적용 (CSS 변수 사용)
  // --color-secondary: 태그 배경색
  // --color-text: 태그 텍스트 색상
  const themeStyles = 'bg-[color:var(--color-secondary)] text-[color:var(--color-text)]';

  /* 클릭 가능한 경우 button, 그렇지 않은 경우 span 사용하여 시맨틱 마크업 향상 */
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={`${baseStyles} ${themeStyles} ${className}`}
      data-theme={theme}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {text.startsWith('#') ? text : `#${text}`}
    </Component>
  );
};

export default Tag;
