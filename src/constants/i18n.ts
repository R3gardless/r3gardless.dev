/**
 * 블로그 목록 UI(사이드바/정렬 등)의 라벨.
 *
 * 카테고리/태그/정렬 같은 UI 크롬 문구는 언어(kr/en/ja)와 무관하게 항상 영어로 표시합니다.
 * (포스트 제목·본문은 번역본을 사용하지만, UI 크롬은 번역하지 않습니다.)
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

/**
 * 블로그 UI 크롬 라벨(모든 언어 공통, 영어 고정).
 */
export const BLOG_UI_STRINGS: BlogUiStrings = {
  categoryHeading: 'Category',
  allCategory: 'All',
  tagHeading: 'Tags',
  noTags: 'No tags yet',
  clearAll: 'Clear all',
  loadMore: '+ More',
  sort: 'Sort',
  sortAscending: 'Sort ascending',
  sortDescending: 'Sort descending',
};

/**
 * 블로그 UI 크롬 라벨을 반환합니다. (언어 무관, 항상 영어)
 */
export function getBlogUiStrings(): BlogUiStrings {
  return BLOG_UI_STRINGS;
}
