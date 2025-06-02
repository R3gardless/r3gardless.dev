import React, { ReactNode, ElementType } from 'react';

export interface TypographyProps {
  /**
   * 컴포넌트 내부 콘텐츠
   */
  children: ReactNode;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
  /**
   * 테마 모드 (light, dark)
   * @default 'light'
   */
  theme?: 'light' | 'dark';
}

export interface HeadingProps extends TypographyProps {
  /**
   * 제목 레벨 (1-3)
   * @default 1
   */
  level?: 1 | 2 | 3;
}

/**
 * 제목(H1, H2, H3) 컴포넌트
 * 레벨에 따라 다른 스타일 적용
 */
export const Heading = ({ children, className = '', level = 1, theme = 'light' }: HeadingProps) => {
  // 레벨에 따른 폰트 크기 및 스타일 적용
  const baseStyles = 'font-pretendard font-bold leading-tight';
  const levelStyles: Record<1 | 2 | 3, string> = {
    1: 'text-2xl', // 약 24px에 해당하는 Tailwind 크기
    2: 'text-xl', // 약 20px에 해당하는 Tailwind 크기
    3: 'text-lg', // 약 18px에 해당하는 Tailwind 크기
  };

  // HTML 태그 결정
  const Component = `h${level}` as ElementType;

  // 안전한 키 접근
  const levelStyle = levelStyles[level] || levelStyles[1];

  return (
    <Component
      className={`${baseStyles} ${levelStyle} text-[color:var(--color-text)] ${className}`}
      data-theme={theme}
    >
      {children}
    </Component>
  );
};

/**
 * 본문 텍스트 컴포넌트
 */
export const Text = ({ children, className = '', theme = 'light' }: TypographyProps) => {
  return (
    <p
      className={`font-pretendard font-normal text-base leading-tight text-[color:var(--color-text)] ${className}`}
      data-theme={theme}
    >
      {children}
    </p>
  );
};

/**
 * 설명 텍스트 컴포넌트 (작은 크기)
 */
export const Caption = ({ children, className = '', theme = 'light' }: TypographyProps) => {
  return (
    <p
      className={`font-pretendard font-normal text-sm leading-tight text-[color:var(--color-text)] ${className}`}
      data-theme={theme}
    >
      {children}
    </p>
  );
};

/**
 * 이탈릭체 설명 텍스트 컴포넌트
 */
export const Italic = ({ children, className = '', theme = 'light' }: TypographyProps) => {
  return (
    <p
      className={`font-pretendard font-normal text-sm italic leading-tight text-[color:var(--color-text)] ${className}`}
      data-theme={theme}
    >
      {children}
    </p>
  );
};

/**
 * 날짜 표시용 텍스트 컴포넌트 (MaruBuri 폰트 사용)
 */
export const DateText = ({ children, className = '', theme = 'light' }: TypographyProps) => {
  return (
    <time
      className={`font-maruBuri font-normal text-sm leading-normal text-[color:var(--color-text)] ${className}`}
      data-theme={theme}
    >
      {children}
    </time>
  );
};
