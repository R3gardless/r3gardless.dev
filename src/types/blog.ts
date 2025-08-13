/**
 * 노션 Database 연동을 위한 타입 정의
 * API 연동 시 사용될 인터페이스들
 */
export interface PostMeta {
  /**
   * Notion 페이지 ID
   * @example '1234567890abcdef1234567890abcdef'
   */
  pageId: string;
  /**
   * 블로그 포스트 ID (incremental ID)
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
