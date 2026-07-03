import GithubSlugger from 'github-slugger';

import { PostCardProps } from '@/components/ui/blog/PostCard';
import { PostRowProps } from '@/components/ui/blog/PostRow';
import { ALL_POSTS_CATEGORY } from '@/constants/blog';
import {
  DEFAULT_POST_LANG,
  PostLang,
  PostMeta,
  TableOfContentsItem,
  TranslatedPostLang,
} from '@/types/blog';

/**
 * 언어별 블로그 경로 prefix. kr은 기존 URL을 유지하기 위해 prefix가 없습니다.
 */
export function blogLangPathPrefix(lang: PostLang): string {
  return lang === DEFAULT_POST_LANG ? '' : `/${lang}`;
}

/**
 * 언어별 블로그 목록 경로 (/blog, /en/blog, /jp/blog)
 */
export function createBlogListHref(lang: PostLang = DEFAULT_POST_LANG): string {
  return `${blogLangPathPrefix(lang)}/blog`;
}

/**
 * 포스트가 제공되는 언어 목록. languages가 없으면 kr 전용으로 간주합니다.
 */
export function getPostLanguages(post: Pick<PostMeta, 'languages'>): PostLang[] {
  return post.languages && post.languages.length > 0 ? post.languages : [DEFAULT_POST_LANG];
}

/**
 * PostMeta의 title/description을 요청 언어 번역 값으로 치환합니다.
 * 번역이 없으면 kr 원문 값을 유지합니다.
 */
export function localizePostMeta(post: PostMeta, lang: PostLang): PostMeta {
  if (lang === DEFAULT_POST_LANG) {
    return post;
  }

  const translation = post.translations?.[lang as TranslatedPostLang];
  if (!translation) {
    return post;
  }

  return {
    ...post,
    title: translation.title || post.title,
    description: translation.description ?? post.description,
  };
}

/**
 * PostMeta를 렌더링 가능한 포스트 데이터로 변환합니다
 * 날짜를 포맷팅하고 URL-safe href를 생성합니다
 */
export function convertPostForRendering<T extends PostCardProps | PostRowProps>(
  post: PostMeta,
  lang: PostLang = DEFAULT_POST_LANG,
): T {
  return {
    ...post,
    href: `${blogLangPathPrefix(lang)}/blog/${post.slug}`,
  } as T;
}

/**
 * PostMeta 배열을 렌더링 가능한 포스트 배열로 변환합니다
 */
export function convertPostsForRendering<T extends PostCardProps | PostRowProps>(
  posts: PostMeta[],
  lang: PostLang = DEFAULT_POST_LANG,
): T[] {
  return posts.map(post => convertPostForRendering<T>(post, lang));
}

export function createBlogPostHref(
  post: Pick<PostMeta, 'slug' | 'encodedSlug'>,
  lang: PostLang = DEFAULT_POST_LANG,
): string {
  return `${blogLangPathPrefix(lang)}/blog/${post.encodedSlug || post.slug}`;
}

export function createBlogFilterHref(type: 'category' | 'tags', value: string): string {
  const params = new URLSearchParams({ [type]: value });
  return `/blog/?${params.toString()}`;
}

export function isAllPostsCategory(category: string | undefined): boolean {
  return !category || category === ALL_POSTS_CATEGORY;
}

export function getPostCategories(posts: PostMeta[]): string[] {
  return [ALL_POSTS_CATEGORY, ...Array.from(new Set(posts.map(post => post.category.text)))];
}

export function getPostTags(posts: PostMeta[]): string[] {
  return Array.from(new Set(posts.flatMap(post => post.tags)));
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
