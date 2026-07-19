'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Album, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { Text } from '@/components/ui/typography';
import { getPostSeriesStrings } from '@/constants/i18n';
import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang } from '@/types/blog';

/**
 * 시리즈 목록에 표시되는 개별 포스트
 */
export interface PostSeriesPost {
  /**
   * 포스트 고유 ID
   */
  id: number;
  /**
   * 포스트 제목
   */
  title: string;
  /**
   * 포스트 링크 URL
   */
  href: string;
}

export interface PostSeriesProps {
  /**
   * 시리즈 이름
   */
  name: string;
  /**
   * 시리즈에 속한 포스트 목록 (시리즈 내 순서대로 정렬된 상태)
   */
  posts: PostSeriesPost[];
  /**
   * 현재 읽고 있는 포스트 ID
   */
  currentPostId: number;
  /**
   * 렌더링 언어 (라벨 문구에 사용)
   */
  lang?: PostLang;
  /**
   * 초기 펼침 여부
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * PostSeries 컴포넌트
 * 포스트가 속한 시리즈(글 묶음)를 표시하는 organism 컴포넌트.
 * 시리즈 이름과 현재 위치(n / m)를 항상 보여주고,
 * 헤더를 클릭하면 시리즈 전체 목록을 펼쳐 다른 편으로 이동할 수 있습니다.
 */
export const PostSeries = ({
  name,
  posts,
  currentPostId,
  lang = DEFAULT_POST_LANG,
  defaultExpanded = false,
  className = '',
}: PostSeriesProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const shouldReduceMotion = useReducedMotion();
  const strings = getPostSeriesStrings(lang);

  const currentIndex = posts.findIndex(post => post.id === currentPostId);
  const currentPosition = currentIndex >= 0 ? currentIndex + 1 : undefined;

  return (
    <section
      className={`rounded-xl bg-[color:var(--color-primary)] text-[color:var(--color-text)] ${className}`}
    >
      {/* 헤더 - 클릭 시 시리즈 목록 펼침/접힘 */}
      <button
        type="button"
        onClick={() => {
          setIsExpanded(prev => !prev);
        }}
        aria-expanded={isExpanded}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
      >
        <div className="min-w-0">
          {/* eyebrow 라벨 */}
          <span className="mb-1.5 flex items-center gap-1.5 text-xs tracking-wide opacity-60">
            <Album aria-hidden="true" className="h-3.5 w-3.5" />
            {strings.seriesLabel}
          </span>
          {/* 시리즈 이름 - 세리프 악센트. 문서 heading 구조(h1->h2...)를 깨지 않도록
              heading 태그 대신 span으로 표시한다 */}
          <span className="block truncate font-maruBuri text-xl font-bold">{name}</span>
        </div>

        <span className="flex flex-shrink-0 items-center gap-3">
          {/* 현재 위치 n / m */}
          <span className="font-maruBuri text-sm opacity-70">
            {currentPosition !== undefined ? `${currentPosition} / ${posts.length}` : posts.length}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`size-5 opacity-70 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {/* 시리즈 포스트 목록 - 펼침/접힘을 높이 애니메이션으로 전환 */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="series-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    height: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] },
                    opacity: { duration: 0.2 },
                  }
            }
            className="overflow-hidden"
          >
            <ol className="space-y-1 px-3 pb-4">
              {posts.map((post, index) => {
                const isCurrent = post.id === currentPostId;
                const rowStyles =
                  'flex items-center gap-3 rounded-md px-3 py-2.5 transition-all duration-200';
                const rowContent = (
                  <>
                    <span
                      className={`w-5 flex-shrink-0 text-right font-maruBuri text-sm ${
                        isCurrent ? 'opacity-90' : 'opacity-50'
                      }`}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <Text
                      className={`min-w-0 flex-1 truncate text-sm ${isCurrent ? 'font-bold' : ''}`}
                    >
                      {post.title}
                    </Text>
                    {isCurrent && (
                      <span className="flex-shrink-0 rounded-sm bg-[color:var(--color-text)] px-2 py-0.5 text-xs text-[color:var(--color-background)]">
                        {strings.currentPost}
                      </span>
                    )}
                  </>
                );

                return (
                  <li key={post.id}>
                    {isCurrent ? (
                      <div
                        className={`${rowStyles} bg-[color:var(--color-background)] shadow-sm`}
                        aria-current="true"
                      >
                        {rowContent}
                      </div>
                    ) : (
                      <Link
                        href={post.href}
                        className={`${rowStyles} cursor-pointer hover:bg-[color:var(--color-secondary)] hover:shadow-sm`}
                      >
                        {rowContent}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PostSeries;
