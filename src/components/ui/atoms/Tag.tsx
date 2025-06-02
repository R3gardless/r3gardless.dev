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
}

/**
 * 기본 태그 컴포넌트
 * 테마 변수를 사용하여 색상 적용
 */
export const Tag = ({ text, theme = 'light', className = '' }: TagProps) => {
  // 기본 스타일
  const baseStyles = 'inline-block rounded-full px-3 py-1 text-sm';

  // 테마에 따른 스타일 적용 (CSS 변수 사용)
  // --color-secondary: 태그 배경색
  // --color-text: 태그 텍스트 색상
  const themeStyles =
    theme === 'light'
      ? 'bg-[color:var(--color-secondary)] text-[color:var(--color-text)]'
      : 'bg-[color:var(--color-secondary)] text-[color:var(--color-text)]';

  return (
    <div className={`${baseStyles} ${themeStyles} ${className}`} data-theme={theme}>
      {text.startsWith('#') ? text : `#${text}`}
    </div>
  );
};

export default Tag;
