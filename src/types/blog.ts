/**
 * KB Markdown frontmatter에서 생성되는 블로그 포스트 메타데이터
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
