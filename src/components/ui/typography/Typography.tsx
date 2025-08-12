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
   * 인라인 스타일
   */
  style?: React.CSSProperties;
  /**
   * 폰트 패밀리
   * @default 'pretendard'
   */
  fontFamily?: 'pretendard' | 'maruBuri';
}

export interface HeadingProps extends TypographyProps {
  /**
   * 제목 레벨 (1-5)
   * @default 1
   */
  level?: 1 | 2 | 3 | 4 | 5;
}

/**
 * 제목(H1, H2, H3) 컴포넌트
 * 레벨에 따라 다른 스타일 적용
 */
export const Heading = ({
  children,
  className = '',
  style,
  level = 1,
  fontFamily = 'pretendard',
}: HeadingProps) => {
  // 폰트 패밀리 스타일 헬퍼 함수
  const getFontFamilyStyles = (fontFamily: 'pretendard' | 'maruBuri') =>
    fontFamily === 'maruBuri' ? 'font-maruBuri' : 'font-pretendard';

  const fontFamilyStyles = getFontFamilyStyles(fontFamily);
  // 레벨에 따른 폰트 크기 및 스타일 적용
  const baseStyles = `${fontFamilyStyles} font-bold font-weight-700`;
  const levelStyles: Record<1 | 2 | 3 | 4 | 5, string> = {
    1: 'text-4xl', // 약 30px에 해당하는 Tailwind 크기
    2: 'text-3xl', // 약 24px에 해당하는 Tailwind 크기
    3: 'text-2xl', // 약 20px에 해당하는 Tailwind 크기
    4: 'text-xl', // 약 18px에 해당하는 Tailwind 크기
    5: 'text-lg', // 약 16px에 해당하는 Tailwind 크기
  };

  // HTML 태그 결정
  const Component = `h${level}` as ElementType;

  // 안전한 키 접근
  const levelStyle = levelStyles[level] || levelStyles[1];

  return (
    <Component className={`${baseStyles} ${levelStyle} ${className}`} style={style}>
      {children}
    </Component>
  );
};

/**
 * 본문 텍스트 컴포넌트
 */
export const Text = ({
  children,
  className = '',
  style,
  fontFamily = 'pretendard',
}: TypographyProps) => {
  // 폰트 패밀리 스타일
  const fontFamilyStyles = fontFamily === 'maruBuri' ? 'font-maruBuri' : 'font-pretendard';

  return (
    <p className={`${fontFamilyStyles} ${className}`} style={style}>
      {children}
    </p>
  );
};
