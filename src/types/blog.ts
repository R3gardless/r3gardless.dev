/**
 * 블로그 콘텐츠 언어. kr이 canonical 원문이고 en/ja는 LLM 번역본입니다.
 */
export const POST_LANGUAGES = ['kr', 'en', 'ja'] as const;
export type PostLang = (typeof POST_LANGUAGES)[number];

/**
 * kr 원문에서 번역되는 언어 목록
 */
export const TRANSLATED_POST_LANGUAGES = ['en', 'ja'] as const;
export type TranslatedPostLang = (typeof TRANSLATED_POST_LANGUAGES)[number];

// 리터럴 타입('kr')을 유지해 `lang === DEFAULT_POST_LANG` 비교 시 유니온이 좁혀지도록 합니다.
export const DEFAULT_POST_LANG = 'kr' satisfies PostLang;

/**
 * 언어별 경로 prefix (라우팅/SEO/콘텐츠 파이프라인 공용 단일 소스).
 * 기본 언어(kr)는 prefix가 없고, 번역본은 `/en`·`/ja`를 사용합니다.
 */
export function langPathPrefix(lang: PostLang): string {
  return lang === DEFAULT_POST_LANG ? '' : `/${lang}`;
}

/**
 * 번역본에서 리스트/네비게이션 렌더링에 필요한 최소 메타데이터
 */
export interface PostTranslationMeta {
  title: string;
  description?: string;
}

/**
 * KNOWLEDGE_BASE Markdown frontmatter에서 생성되는 블로그 포스트 메타데이터
 */
export interface PostMeta {
  /**
   * 콘텐츠 원본 식별자. Markdown 전환 이후에는 slug와 동일하게 채웁니다.
   */
  pageId: string;
  /**
   * 블로그 포스트 ID
   */
  id: number;
  /**
   * 포스트 제목
   */
  title: string;
  /**
   * 포스트 설명
   */
  description?: string;
  /**
   * 작성 날짜
   */
  createdAt: string;
  /**
   * 마지막 수정 날짜
   */
  lastEditedAt?: string;
  /**
   * 최초 발행일. SEO/RSS/sitemap에서 사용하는 ISO 8601 날짜입니다.
   */
  publishedAt?: string;
  /**
   * 마지막 수정일. SEO/RSS/sitemap에서 사용하는 ISO 8601 날짜입니다.
   */
  updatedAt?: string;
  /**
   * 예상 읽기 시간(분). frontmatter의 reading_time에서 옵니다.
   */
  readingTime?: number;
  /**
   * 카테고리 정보
   */
  category: {
    text: string;
    color: 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
    /**
     * Category text에서 안정적으로 생성한 RGB triplet. 예: "180 204 235"
     */
    rgb?: string;
    /**
     * category.rgb 위에서 읽기 좋은 전경 RGB triplet.
     */
    foregroundRgb?: string;
  };
  /**
   * 태그 목록
   */
  tags: string[];
  /**
   * 포스트 슬러그 (URL 경로)
   */
  slug: string;
  /**
   * 인코딩된 슬러그 (URL 인코딩)
   */
  encodedSlug?: string;
  /**
   * 커버 이미지 URL
   */
  cover?: string;
  /**
   * 이 포스트가 제공되는 언어 목록. 항상 kr을 포함하며 생략 시 kr 전용입니다.
   */
  languages?: PostLang[];
  /**
   * 언어별 번역 메타데이터. 최상위 title/description은 kr 원문 값을 유지합니다.
   */
  translations?: Partial<Record<TranslatedPostLang, PostTranslationMeta>>;
}

/**
 * 목차 항목 타입
 */
export interface TableOfContentsItem {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  children?: TableOfContentsItem[];
}
