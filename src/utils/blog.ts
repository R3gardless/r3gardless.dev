import { PostMeta } from '@/types/blog';
import { PostCardProps } from '@/components/ui/blog/PostCard';
import { PostRowProps } from '@/components/ui/blog/PostRow';

/**
 * PostMeta를 PostCardProps로 변환합니다
 */
export function convertPostMetaToPostCard(post: PostMeta): PostCardProps {
  return {
    ...post,
    createdAt: formatPostDate(post.createdAt), // 날짜 포맷 자동 변환
    href: `/blog/${post.slug}`,
  };
}

/**
 * PostMeta 배열을 PostCardProps 배열로 변환합니다
 */
export function convertPostsToCards(posts: PostMeta[]): PostCardProps[] {
  return posts.map(convertPostMetaToPostCard);
}

/**
 * ISO 날짜 문자열을 "Jan 02, 2025" 형식으로 변환합니다 (일은 두 자리 숫자)
 */
export function formatPostDate(dateString: string): string {
  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return dateString; // 원본 문자열 반환
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

/**
 * ISO 날짜 문자열을 상대적 시간으로 변환합니다 (예: "2 days ago")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

/**
 * 날짜를 한국어 형식으로 변환합니다 ("2025년 7월 22일")
 */
export function formatKoreanDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * PostMeta를 PostRowProps로 변환합니다
 */
export function convertPostMetaToPostRow(post: PostMeta): PostRowProps {
  return {
    ...post,
    createdAt: formatPostDate(post.createdAt), // 날짜 포맷 자동 변환
    href: `/blog/${post.slug}`,
  };
}

/**
 * PostMeta 배열을 PostRowProps 배열로 변환합니다
 */
export function convertPostsToRows(posts: PostMeta[]): PostRowProps[] {
  return posts.map(convertPostMetaToPostRow);
}

/**
 * PostMeta 배열에서 slug에 해당하는 포스트를 찾습니다
 */
export function findPostBySlug(posts: PostMeta[], slug: string): PostMeta | null {
  return posts.find(post => post.slug === slug) ?? null;
}
