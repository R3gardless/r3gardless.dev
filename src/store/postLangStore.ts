/**
 * @fileoverview 현재 보고 있는 포스트의 언어 정보 전역 상태 관리
 *
 * Header의 언어 스위처가 포스트 페이지에서 같은 포스트의 번역본으로
 * 이동할 수 있도록, 포스트 페이지가 mount 시 현재 slug와 제공 언어를
 * 이 스토어에 기록합니다. 포스트 페이지가 아니면 currentPost는 null입니다.
 */

import { create } from 'zustand';

import type { PostLang } from '@/types/blog';

/**
 * 현재 포스트 페이지의 언어 스위칭에 필요한 최소 정보
 */
export interface CurrentPostLanguages {
  /** 발행 slug (모든 언어 변형이 공유) */
  slug: string;
  /** URL-safe slug */
  encodedSlug?: string;
  /** 이 포스트가 제공되는 언어 목록 (항상 kr 포함) */
  languages: PostLang[];
}

interface PostLangStore {
  /** 현재 포스트 페이지 정보. 포스트 페이지가 아니면 null */
  currentPost: CurrentPostLanguages | null;
  /** 포스트 페이지 진입 시 현재 포스트 정보 설정 */
  setCurrentPost: (post: CurrentPostLanguages) => void;
  /** 포스트 페이지 이탈 시 정보 제거 */
  clearCurrentPost: () => void;
}

export const usePostLangStore = create<PostLangStore>(set => ({
  currentPost: null,
  setCurrentPost: currentPost => set({ currentPost }),
  clearCurrentPost: () => set({ currentPost: null }),
}));
