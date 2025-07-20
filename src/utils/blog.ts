import { PostMeta } from '@/types/blog';
import { PostCardProps } from '@/components/ui/blog/PostCard';

/**
 * PostMeta 배열에서 고유 카테고리 목록을 추출합니다
 */
export function extractCategories(posts: PostMeta[]): string[] {
  const categories = posts.map(post => post.category.text);
  return ['전체', ...Array.from(new Set(categories))];
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
    href: `/blog/${post.id}`,
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
