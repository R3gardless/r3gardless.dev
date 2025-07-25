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
  const containerStyles = 'mx-auto';

  const isOnlyNext = !prevPost && nextPost;

  return (
    <div className={`${containerStyles} ${className}`}>
      <div className="flex flex-col gap-4 md:flex-row">
        {prevPost && (
          <div className="md:flex-1 md:min-w-0">
            <PostNavigationLink post={prevPost} direction="prev" />
          </div>
        )}
        {isOnlyNext && <div className="hidden md:block md:flex-1"></div>}
        {nextPost && (
          <div className="md:flex-1 md:min-w-0">
            <PostNavigationLink post={nextPost} direction="next" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostNavigator;
