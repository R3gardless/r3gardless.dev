import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Caption } from '@/components/ui/typography';

export interface PostNavigationLinkProps {
  /**
   * 포스트 정보
   */
  post: {
    title: string;
    href: string;
  };
  /**
   * 네비게이션 방향
   */
  direction: 'prev' | 'next';
  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * PostNavigationLink 컴포넌트
 * 블로그 포스트의 이전글/다음글 단일 링크를 제공하는 원자 컴포넌트
 * PostNavigator에서 사용되는 개별 링크 요소입니다.
 */
export const PostNavigationLink = ({
  post,
  direction,
  className = '',
}: PostNavigationLinkProps) => {
  const isPrev = direction === 'prev';
  const label = isPrev ? '이전글' : '다음글';
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  const justifyClass = isPrev ? 'justify-start' : 'justify-end';
  const alignClass = isPrev ? 'items-start' : 'items-end';
  const textAlignClass = isPrev ? 'text-left' : 'text-right';

  return (
    <Link href={post.href} className={`flex ${justifyClass} ${className}`}>
      <div
        className="h-24 p-4 w-full max-w-80 border border-[color:var(--color-primary)] rounded-md cursor-pointer
                   hover:shadow-xl hover:shadow-[color:var(--color-text)]/10
                   transition-all duration-200 flex items-center
                   md:w-80"
      >
        <div className={`flex items-center gap-3 w-full ${isPrev ? '' : 'flex-row-reverse'}`}>
          <Icon className="size-6 flex-shrink-0 text-[color:var(--color-text)]" />
          <div className={`flex flex-col ${alignClass} min-w-0 flex-1`}>
            <Caption className={`${textAlignClass} opacity-70 mb-1`}>{label}</Caption>
            <div
              className={`${textAlignClass} font-bold text-sm leading-tight w-full text-[color:var(--color-text)] truncate`}
              title={post.title}
            >
              {post.title}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostNavigationLink;
