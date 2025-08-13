import { PostMeta } from '@/types/blog';
import { PostCardProps } from '@/components/ui/blog/PostCard';
import { PostRowProps } from '@/components/ui/blog/PostRow';

/**
 * PostMeta를 렌더링 가능한 포스트 데이터로 변환합니다
 * 날짜를 포맷팅하고 URL-safe href를 생성합니다
 */
export function convertPostForRendering<T extends PostCardProps | PostRowProps>(post: PostMeta): T {
  return {
    ...post,
    href: `/blog/${post.slug}`, // 이미 인코딩된 slug 사용
  } as T;
}

/**
 * PostMeta 배열을 렌더링 가능한 포스트 배열로 변환합니다
 */
export function convertPostsForRendering<T extends PostCardProps | PostRowProps>(
  posts: PostMeta[],
): T[] {
  return posts.map(post => convertPostForRendering<T>(post));
}

/**
 * ISO 날짜 문자열을 KST 시간대로 변환하여 전체 날짜와 시간을 포맷팅합니다
 * Notion에서 넘어오는 UTC 시간을 한국 시간으로 변환합니다
 * 예: "Jan 02, 2025"
 */
export function formatPostDateTimeKST(dateString: string): string {
  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return dateString; // 원본 문자열 반환
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  });
}

/**
 * PostMeta 배열에서 slug에 해당하는 포스트를 찾습니다
 */
export function findPostBySlug(posts: PostMeta[], slug: string): PostMeta | null {
  return posts.find(post => post.slug === slug) ?? null;
}

/**
 * PostMeta 배열에서 인코딩된 slug에 해당하는 포스트를 찾습니다
 * 인코딩된 slug는 URL-safe 형태로 저장되어 있음
 */
export function findPostByEncodedSlug(posts: PostMeta[], encodedSlug: string): PostMeta | null {
  return posts.find(post => post.encodedSlug === encodedSlug) ?? null;
}
