import React from 'react';

import { PostNavigationLink } from '@/components/ui/atoms/PostNavigationLink';

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
 * PostNavigator 컴포넌트
 * 블로그 포스트의 이전글/다음글 네비게이션을 제공하는 분자 컴포넌트
 * Figma 디자인을 기반으로 구현되었습니다.
 */
export const PostNavigator = ({
  prevPost,
  nextPost,
  theme = 'light',
  className = '',
}: PostNavigatorProps) => {
  return (
    <div className={`w-full bg-[color:var(--color-background)] ${className}`} data-theme={theme}>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        {prevPost && <PostNavigationLink post={prevPost} direction="prev" theme={theme} />}
        {nextPost && <PostNavigationLink post={nextPost} direction="next" theme={theme} />}
      </div>
    </div>
  );
};

export default PostNavigator;
