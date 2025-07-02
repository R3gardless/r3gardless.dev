import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { DateText, Heading } from '@/components/ui/atoms/Typography';

export interface RelatedPostRowProps {
  /**
   * 포스트 고유 ID
   */
  id: string;
  /**
   * 포스트 제목
   */
  title: string;
  /**
   * 게시 날짜
   */
  date: string;
  /**
   * 포스트 링크 URL
   */
  href: string;
  /**
   * 현재 포스트 여부
   */
  isCurrent?: boolean;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * RelatedPostRow 컴포넌트
 * 관련 포스트 목록에서 개별 포스트를 표시하는 원자 컴포넌트
 * Figma 디자인을 기반으로 구현되었습니다.
 */
export const RelatedPostRow: React.FC<RelatedPostRowProps> = ({
  id,
  title,
  date,
  href,
  isCurrent = false,
  className = '',
}) => {
  // 기본 스타일
  const baseStyles = `
    flex items-center justify-between w-full h-[85px] px-3 py-5 rounded-md 
    transition-all duration-200 group
  `;

  // 현재 포스트와 일반 포스트의 스타일 차이
  const variantStyles = isCurrent
    ? `
      bg-[color:var(--color-primary)] border border-[color:var(--color-secondary)]
      text-[color:var(--color-text)]
    `
    : `
      bg-[color:var(--color-background)] border border-transparent
      hover:bg-[color:var(--color-primary)] hover:shadow-sm
      text-[color:var(--color-text)]
    `;

  const content = (
    <>
      {/* 왼쪽 텍스트 영역 */}
      <div className="flex-1 min-w-0 pr-3">
        <div className="flex items-center gap-2 mb-1">
          <Heading level={3} className=" leading-tight truncate text-ellipsis overflow-hidden">
            {title}
          </Heading>
          {isCurrent && (
            <span className="text-xs px-2 py-1 bg-[color:var(--color-text)] text-[color:var(--color-background)] rounded-sm flex-shrink-0">
              현재
            </span>
          )}
        </div>
        <DateText className="opacity-70 leading-tight truncate text-ellipsis overflow-hidden">
          {date}
        </DateText>
      </div>

      {/* 오른쪽 아이콘 */}
      <ChevronRight
        className={`size-6 flex-shrink-0 text-[color:var(--color-text)] opacity-70 transition-all duration-200 ${
          !isCurrent ? 'group-hover:opacity-100 group-hover:translate-x-1' : ''
        }`}
      />
    </>
  );

  // 현재 포스트는 링크 없이 표시
  if (isCurrent) {
    return (
      <div id={id} className={`${baseStyles} ${variantStyles} ${className}`}>
        {content}
      </div>
    );
  }

  // 일반 포스트는 링크로 표시
  return (
    <Link href={href} className={`${baseStyles} ${variantStyles} ${className} cursor-pointer`}>
      {content}
    </Link>
  );
};

export default RelatedPostRow;
