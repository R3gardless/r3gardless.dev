/**
 * 사이트 UI 크롬(네비게이션/사이드바 등)의 라벨.
 *
 * 선택된 라우트 언어(kr/en/ja)에 맞춰 분기하는 문구는 다음으로 한정합니다.
 * - 헤더 네비게이션(About/Blog)
 * - 카테고리 제목(Category) / "전체"(All) 라벨
 * - 태그 제목(Tags)
 * - 정렬 라벨(Sort)
 * 그 외 보조 문구(더보기/모두 지우기/정렬 aria 등)와 "둘러보기" 버튼은 항상 영어로 표시합니다.
 */
import { ALL_POSTS_CATEGORY } from '@/constants/blog';
import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang } from '@/types/blog';

/**
 * 블로그 목록 UI(사이드바/정렬 등)의 라벨.
 */
export interface BlogUiStrings {
  /** 카테고리 섹션 제목 */
  categoryHeading: string;
  /** "전체" 카테고리 표시 라벨 */
  allCategory: string;
  /** 태그 섹션 제목 */
  tagHeading: string;
  /** 표시할 태그가 없을 때 문구 */
  noTags: string;
  /** 선택 태그 모두 지우기 */
  clearAll: string;
  /** 더보기 버튼 */
  loadMore: string;
  /** 정렬 라벨 */
  sort: string;
  /** 오름차순 정렬 aria-label */
  sortAscending: string;
  /** 내림차순 정렬 aria-label */
  sortDescending: string;
}

/** 언어별로 분기하는 라벨(카테고리/태그/정렬 제목). */
type LocalizedBlogUiStrings = Pick<BlogUiStrings, 'categoryHeading' | 'tagHeading' | 'sort'>;

const LOCALIZED_BLOG_UI_STRINGS: Record<PostLang, LocalizedBlogUiStrings> = {
  kr: { categoryHeading: '카테고리', tagHeading: '태그', sort: '정렬' },
  en: { categoryHeading: 'Category', tagHeading: 'Tags', sort: 'Sort' },
  ja: { categoryHeading: 'カテゴリー', tagHeading: 'タグ', sort: '並び替え' },
};

/**
 * 언어와 무관하게 항상 영어로 표시하는 문구.
 * "전체"는 번역하지 않고 항상 'All'로 통일합니다.
 */
const ENGLISH_BLOG_UI_STRINGS: Omit<BlogUiStrings, keyof LocalizedBlogUiStrings> = {
  allCategory: 'All',
  noTags: 'No tags yet',
  clearAll: 'Clear all',
  loadMore: '+ More',
  sortAscending: 'Sort ascending',
  sortDescending: 'Sort descending',
};

/**
 * 블로그 UI 크롬 라벨을 반환합니다.
 * 카테고리/태그/정렬 제목만 선택 언어를 따르고 나머지("전체"=All 포함)는 영어로 고정됩니다.
 */
export function getBlogUiStrings(lang: PostLang = DEFAULT_POST_LANG): BlogUiStrings {
  return {
    ...ENGLISH_BLOG_UI_STRINGS,
    ...(LOCALIZED_BLOG_UI_STRINGS[lang] ?? LOCALIZED_BLOG_UI_STRINGS[DEFAULT_POST_LANG]),
  };
}

/**
 * 랜딩 페이지 "둘러보기" 버튼 라벨. (언어와 무관하게 항상 영어)
 */
export function getExplorePostsLabel(selectedCategory?: string): string {
  const isAll = !selectedCategory || selectedCategory === ALL_POSTS_CATEGORY;
  return isAll ? 'Browse all posts' : `Browse ${selectedCategory} posts`;
}

/**
 * 헤더 네비게이션 라벨(About/Blog, 언어별).
 */
export interface HeaderNavStrings {
  about: string;
  blog: string;
}

const HEADER_NAV_STRINGS: Record<PostLang, HeaderNavStrings> = {
  kr: { about: '소개', blog: '블로그' },
  en: { about: 'About', blog: 'Blog' },
  ja: { about: '自己紹介', blog: 'ブログ' },
};

/**
 * 현재 언어에 맞는 헤더 네비게이션 라벨을 반환합니다.
 */
export function getHeaderNavStrings(lang: PostLang = DEFAULT_POST_LANG): HeaderNavStrings {
  return HEADER_NAV_STRINGS[lang] ?? HEADER_NAV_STRINGS[DEFAULT_POST_LANG];
}
