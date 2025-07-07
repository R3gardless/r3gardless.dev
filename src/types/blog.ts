/**
 * 블로그 포스트 관련 타입 정의
 * API 연동 시 사용될 인터페이스들
 */
export interface PostMeta {
  /**
   * 블로그 포스트 ID
   */
  id: string;
  /**
   * 포스트 제목
   */
  title: string;
  /**
   * 포스트 설명
   */
  description: string;
  /**
   * 작성 날짜
   */
  publishedAt: string;
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
   * 썸네일 이미지 URL
   */
  thumbnailUrl?: string;
  /**
   * 썸네일 이미지 alt 텍스트
   */
  thumbnailAlt?: string;
}
