'use client';

import { useEffect } from 'react';

import { usePostLangStore } from '@/store/postLangStore';
import type { PostLang } from '@/types/blog';

export interface PostLanguagesSyncProps {
  /** 발행 slug */
  slug: string;
  /** URL-safe slug */
  encodedSlug?: string;
  /** 이 포스트가 제공되는 언어 목록 */
  languages: PostLang[];
}

/**
 * 포스트 페이지에서 현재 포스트의 언어 정보를 postLangStore에 동기화합니다.
 * Header 언어 스위처가 같은 포스트의 번역본 링크를 만들 때 사용합니다.
 */
export function PostLanguagesSync({ slug, encodedSlug, languages }: PostLanguagesSyncProps) {
  const setCurrentPost = usePostLangStore(state => state.setCurrentPost);
  const clearCurrentPost = usePostLangStore(state => state.clearCurrentPost);
  const languagesKey = languages.join(',');

  useEffect(() => {
    setCurrentPost({
      slug,
      encodedSlug,
      languages: languagesKey.split(',').filter(Boolean) as PostLang[],
    });

    return () => {
      clearCurrentPost();
    };
  }, [slug, encodedSlug, languagesKey, setCurrentPost, clearCurrentPost]);

  return null;
}
