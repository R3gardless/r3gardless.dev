import { PostMeta } from '@/types/blog';
import { PostCardProps } from '@/components/ui/blog/PostCard';

/**
 * PostMeta 배열에서 고유 카테고리 목록을 추출합니다
 */
export function extractCategories(posts: PostMeta[]): string[] {
  const categories = posts.map(post => post.category.text);
  const uniqueCategories = Array.from(new Set(categories));

  // "전체"가 실제 카테고리에 없을 때만 앞에 추가
  if (!uniqueCategories.includes('전체')) {
    return ['전체', ...uniqueCategories];
  }

  return uniqueCategories;
}

/**
 * PostMeta 배열에서 고유 태그 목록을 추출합니다
 */
export function extractTags(posts: PostMeta[]): string[] {
  const tags = posts.flatMap(post => post.tags);
  return Array.from(new Set(tags));
}

/**
 * PostMeta를 PostCardProps로 변환합니다
 */
export function convertPostMetaToPostCard(post: PostMeta): PostCardProps {
  return {
    ...post,
    createdAt: formatPostDate(post.createdAt), // 날짜 포맷 자동 변환
    href: `/blog/${generatePostSlug(post)}`,
  };
}

/**
 * PostMeta 배열을 PostCardProps 배열로 변환합니다
 */
export function convertPostsToCards(posts: PostMeta[]): PostCardProps[] {
  return posts.map(convertPostMetaToPostCard);
}

/**
 * 카테고리별로 포스트를 필터링합니다
 */
export function filterPostsByCategory(posts: PostMeta[], category?: string): PostMeta[] {
  if (!category || category === '전체') {
    return posts;
  }
  return posts.filter(post => post.category.text === category);
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
export function convertPostMetaToPostRow(
  post: PostMeta,
): import('@/components/ui/blog/PostRow').PostRowProps {
  return {
    ...post,
    createdAt: formatPostDate(post.createdAt), // 날짜 포맷 자동 변환
    href: `/blog/${generatePostSlug(post)}`,
  };
}

/**
 * PostMeta 배열을 PostRowProps 배열로 변환합니다
 */
export function convertPostsToRows(
  posts: PostMeta[],
): import('@/components/ui/blog/PostRow').PostRowProps[] {
  return posts.map(convertPostMetaToPostRow);
}

/**
 * 제목을 URL-safe한 형식으로 변환합니다 (UTF-8 한글 지원)
 */
function slugifyTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      // 한글, 영문, 숫자, 하이픈, 언더스코어만 유지
      .replace(/[^\w\s가-힣-]/g, '')
      // 공백을 하이픈으로 변환
      .replace(/\s+/g, '-')
      // 연속된 하이픈을 하나로 변환
      .replace(/-+/g, '-')
      // 앞뒤 하이픈 제거
      .replace(/^-+|-+$/g, '')
  );
}

/**
 * PostMeta에서 slug를 생성합니다 ({unique_id}-{title} 형식)
 */
export function generatePostSlug(post: PostMeta): string {
  const titleSlug = slugifyTitle(post.title);
  return `${post.id}-${titleSlug}`;
}

/**
 * slug에서 post ID를 추출합니다 ({unique_id}-{title} 형식에서 unique_id 부분 추출)
 */
export function extractPostIdFromSlug(slug: string): string {
  const firstHyphenIndex = slug.indexOf('-');
  if (firstHyphenIndex === -1) {
    // 하이픈이 없으면 전체 slug를 ID로 간주 (하위 호환성)
    return slug;
  }
  return slug.substring(0, firstHyphenIndex);
}

/**
 * PostMeta 배열에서 slug에 해당하는 포스트를 찾습니다
 */
export function findPostBySlug(posts: PostMeta[], slug: string): PostMeta | null {
  const postId = extractPostIdFromSlug(slug);
  return posts.find(post => post.id === postId) || null;
}
