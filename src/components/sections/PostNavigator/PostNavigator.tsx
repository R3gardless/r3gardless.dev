import React from 'react';

import { PostNavigationLink } from '@/components/ui/blog/PostNavigationLink';

export interface PostNavigatorProps {
  /**
   * 이전글 정보
   */
  prevPost?: {
    title: string;
    href: string;
  };
  /**
   * 다음글 정보
   */
  nextPost?: {
    title: string;
    href: string;
  };
  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * PostNavigator 컴포넌트
 * 블로그 포스트의 이전글/다음글 네비게이션을 제공하는 분자 컴포넌트
 * Figma 디자인을 기반으로 구현되었습니다.
 */
export const PostNavigator = ({ prevPost, nextPost, className = '' }: PostNavigatorProps) => {
  return (
    <div className={`w-full bg-[color:var(--color-background)] ${className}`}>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        {prevPost && <PostNavigationLink post={prevPost} direction="prev" />}
        {nextPost && <PostNavigationLink post={nextPost} direction="next" />}
      </div>
    </div>
  );
};

export default PostNavigator;
