/**
 * 블로그 포스트 관련 타입 정의
 * API 연동 시 사용될 인터페이스들
 */

/**
 * 블로그 포스트 기본 정보
 */
export interface BlogPost {
  /**
   * 포스트 고유 ID
   */
  id: string;
  /**
   * 포스트 제목
   */
  title: string;
  /**
   * 포스트 요약/설명
   */
  description: string;
  /**
   * 포스트 내용 (마크다운)
   */
  content?: string;
  /**
   * 작성일자 (ISO 8601 형식)
   */
  createdAt: string;
  /**
   * 수정일자 (ISO 8601 형식)
   */
  updatedAt: string;
  /**
   * 게시일자 (ISO 8601 형식)
   */
  publishedAt?: string;
  /**
   * 게시 상태
   */
  status: 'draft' | 'published' | 'archived';
  /**
   * 썸네일 이미지 URL
   */
  thumbnailUrl?: string;
  /**
   * 썸네일 이미지 alt 텍스트
   */
  thumbnailAlt?: string;
  /**
   * 태그 목록
   */
  tags: string[];
  /**
   * 카테고리
   */
  category?: string;
  /**
   * 작성자 정보
   */
  author?: Author;
  /**
   * SEO 메타데이터
   */
  seo?: SeoMetadata;
  /**
   * 조회수
   */
  viewCount?: number;
  /**
   * 좋아요 수
   */
  likeCount?: number;
}

/**
 * 작성자 정보
 */
export interface Author {
  /**
   * 작성자 ID
   */
  id: string;
  /**
   * 작성자 이름
   */
  name: string;
  /**
   * 작성자 이메일
   */
  email?: string;
  /**
   * 프로필 이미지 URL
   */
  avatarUrl?: string;
  /**
   * 작성자 소개
   */
  bio?: string;
}

/**
 * SEO 메타데이터
 */
export interface SeoMetadata {
  /**
   * 메타 제목
   */
  title?: string;
  /**
   * 메타 설명
   */
  description?: string;
  /**
   * 메타 키워드
   */
  keywords?: string[];
  /**
   * Open Graph 이미지 URL
   */
  ogImageUrl?: string;
}

/**
 * BlogPost를 BlogPostCardProps로 변환하는 유틸리티 타입
 */
export type BlogPostToCardProps = Pick<
  BlogPost,
  'title' | 'description' | 'tags' | 'thumbnailUrl' | 'thumbnailAlt'
> & {
  date: string; // publishedAt을 포맷된 문자열로 변환
  postId: string; // id를 postId로 매핑
  category?: string;
  viewCount?: number;
};

/**
 * API 응답 타입들
 */
export interface BlogPostListResponse {
  posts: BlogPost[];
  totalCount: number;
  hasNextPage: boolean;
  nextCursor?: string;
}

export interface BlogPostDetailResponse {
  post: BlogPost;
}

/**
 * API 요청 파라미터 타입들
 */
export interface BlogPostListParams {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string[];
  status?: BlogPost['status'];
  cursor?: string;
  search?: string;
}

export interface BlogPostDetailParams {
  id: string;
}
