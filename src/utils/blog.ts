import GithubSlugger from 'github-slugger';

import { PostCardProps } from '@/components/ui/blog/PostCard';
import { PostRowProps } from '@/components/ui/blog/PostRow';
import { PostMeta, TableOfContentsItem } from '@/types/blog';

/**
 * PostMeta를 렌더링 가능한 포스트 데이터로 변환합니다
 * 날짜를 포맷팅하고 URL-safe href를 생성합니다
 */
export function convertPostForRendering<T extends PostCardProps | PostRowProps>(post: PostMeta): T {
  return {
    ...post,
    href: `/blog/${post.slug}`,
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
 * 예: "Jan 02, 2025"
 */
export function formatPostDateTimeKST(dateString: string): string {
  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return dateString;
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
  return posts.find(post => post.slug === encodedSlug || post.encodedSlug === encodedSlug) ?? null;
}

/**
 * Markdown 본문에서 목차를 생성합니다.
 * rehype-slug와 같은 github-slugger 규칙으로 h1~h2 heading id를 만듭니다.
 */
export function getTableOfContents(markdown: string): TableOfContentsItem[] {
  const slugger = new GithubSlugger();
  const headings: TableOfContentsItem[] = [];
  let isInFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      isInFence = !isInFence;
      continue;
    }

    if (isInFence) {
      continue;
    }

    const match = /^(#{1,2})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      continue;
    }

    const title = stripInlineMarkdown(match[2]);
    if (!title) {
      continue;
    }

    headings.push({
      id: slugger.slug(title),
      title,
      level: match[1].length as 1 | 2,
    });
  }

  return buildTableOfContentsHierarchy(headings);
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/[*_`~]/g, '')
    .trim();
}

function buildTableOfContentsHierarchy(headings: TableOfContentsItem[]): TableOfContentsItem[] {
  const roots: TableOfContentsItem[] = [];
  const stack: TableOfContentsItem[] = [];

  for (const heading of headings) {
    const item: TableOfContentsItem = { ...heading };

    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    const parent = stack.at(-1);
    if (parent) {
      parent.children = parent.children ? [...parent.children, item] : [item];
    } else {
      roots.push(item);
    }

    stack.push(item);
  }

  return roots;
}
