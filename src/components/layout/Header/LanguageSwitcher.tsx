'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { usePostLangStore } from '@/store/postLangStore';
import { DEFAULT_POST_LANG, POST_LANGUAGES } from '@/types/blog';
import type { PostLang } from '@/types/blog';
import { createBlogListHref, createBlogPostHref } from '@/utils/blog';

export interface LanguageSwitcherProps {
  /** 링크 클릭 시 호출 (모바일 메뉴 닫기 등) */
  onNavigate?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 현재 경로에서 콘텐츠 언어를 파싱합니다. (/en/..., /jp/... 외에는 kr)
 */
export function langFromPathname(pathname: string | null | undefined): PostLang {
  const match = pathname?.match(/^\/(en|jp)(\/|$)/);
  return (match?.[1] as PostLang | undefined) ?? DEFAULT_POST_LANG;
}

/**
 * LanguageSwitcher 컴포넌트
 *
 * KR/EN/JP 콘텐츠 언어 전환 스위처.
 * 포스트 페이지에서는 대상 언어 번역본이 있으면 같은 포스트로,
 * 없으면 해당 언어의 블로그 목록으로 이동합니다.
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  onNavigate,
  className = '',
}) => {
  const pathname = usePathname();
  const currentPost = usePostLangStore(state => state.currentPost);
  const currentLang = langFromPathname(pathname);

  const hrefFor = (lang: PostLang): string =>
    currentPost && currentPost.languages.includes(lang)
      ? createBlogPostHref(currentPost, lang)
      : createBlogListHref(lang);

  return (
    <div
      aria-label="Language switcher"
      className={`
        flex items-center overflow-hidden
        rounded-md border border-[color:var(--color-primary)]
        ${className}
      `}
    >
      {POST_LANGUAGES.map((lang, index) => {
        const isCurrent = currentLang === lang;

        return (
          <Link
            key={lang}
            href={hrefFor(lang)}
            onClick={onNavigate}
            aria-current={isCurrent ? 'page' : undefined}
            className={`
              px-2 py-1 text-xs uppercase tracking-wide
              transition-opacity duration-200 hover:opacity-80
              focus:outline-none focus-visible:outline-none
              ${index > 0 ? 'border-l border-[color:var(--color-primary)]' : ''}
              ${
                isCurrent
                  ? 'font-bold text-[color:var(--color-text)]'
                  : 'font-normal text-[color:var(--color-text)]/55'
              }
            `}
          >
            {lang.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
};
