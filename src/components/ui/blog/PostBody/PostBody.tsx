/**
 * 블로그 포스트 본문을 렌더링하는 컴포넌트
 * Markdown 콘텐츠를 React 트리로 렌더링
 */

import { renderMarkdownToReact } from '@/libs/content';
import type { ContentLinkMaps } from '@/libs/content';

import '@/styles/markdown.css';
import '@/styles/prism-theme.css';
import 'katex/dist/katex.min.css';

export interface PostBodyProps {
  /**
   * Markdown 본문
   */
  markdown: string;
  /**
   * 위키링크 해석용 맵
   */
  linkMaps?: ContentLinkMaps;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * PostBody 컴포넌트
 *
 * Markdown 콘텐츠를 렌더링하는 메인 컴포넌트
 */
export async function PostBody({ markdown, linkMaps, className = '' }: PostBodyProps) {
  if (!markdown.trim()) {
    return (
      <div className={className}>
        <p className="text-gray-500 text-center py-8">콘텐츠를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const content = await renderMarkdownToReact(markdown, linkMaps);

  return <div className={`post-body ${className}`}>{content}</div>;
}
