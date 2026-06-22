import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostTemplate } from '@/components/templates/PostTemplate';
import { DEFAULT_POSTS_PER_PAGE } from '@/constants/blog';
import { extractTableOfContentsFromMarkdown } from '@/libs/content';
import type { ContentLinkMaps } from '@/libs/content';
import { generatePostJsonLd, generatePostMetadata, serializeJsonLd } from '@/libs/seo/postMetadata';
import { getPostListWithStaticFallback } from '@/libs/staticPostData';
import type { PostMeta } from '@/types/blog';
import { createBlogPostHref, findPostByEncodedSlug } from '@/utils/blog';
import { getSiteConfig } from '@/utils/config';
import { logError, logWarn } from '@/utils/logger';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'posts');
const LINK_INDEX_PATH = path.join(process.cwd(), 'public', 'data', 'contentLinkIndex.json');

function emptyContentLinkMaps(): ContentLinkMaps {
  return {
    published: {},
    sources: {},
    sourceLabels: {},
  };
}

function readPostMarkdown(slug: string): string | null {
  const postPath = path.join(CONTENT_ROOT, slug, 'index.md');

  if (!fs.existsSync(postPath)) {
    return null;
  }

  const raw = fs.readFileSync(postPath, 'utf8');
  return matter(raw).content;
}

function readContentLinkMaps(): ContentLinkMaps {
  if (!fs.existsSync(LINK_INDEX_PATH)) {
    return emptyContentLinkMaps();
  }

  try {
    return JSON.parse(fs.readFileSync(LINK_INDEX_PATH, 'utf8')) as ContentLinkMaps;
  } catch (error) {
    logWarn('Content link index parse failed', error);
    return emptyContentLinkMaps();
  }
}

/**
 * 정적 경로 생성 (App Router)
 * 빌드 시 정적 데이터에서 포스트 메타데이터를 가져와 모든 포스트 경로를 생성
 */
export async function generateStaticParams() {
  try {
    const posts = await getPostListWithStaticFallback();
    return posts.map((post: PostMeta) => ({
      slug: post.slug,
    }));
  } catch (error) {
    logError('Blog static params generation failed', error);
    return [];
  }
}

/**
 * SEO 메타데이터 생성
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const posts = await getPostListWithStaticFallback();
    const post = findPostByEncodedSlug(posts, slug);

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    const siteConfig = getSiteConfig();

    return generatePostMetadata({
      title: post.title,
      description: post.description || '',
      ogImage: post.cover || undefined,
      canonical: `/blog/${post.slug}`,
      keywords: post.tags,
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt || post.lastEditedAt,
      author: siteConfig.author.name,
    });
  } catch (error) {
    logError('Blog post metadata generation failed', error);
    return {
      title: 'Post Not Found',
    };
  }
}

/**
 * 개별 포스트 페이지
 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const posts = await getPostListWithStaticFallback();
  const post = findPostByEncodedSlug(posts, slug);

  if (!post) {
    notFound();
  }

  const markdown = readPostMarkdown(post.slug);
  if (!markdown) {
    notFound();
  }

  const siteConfig = getSiteConfig();
  const jsonLd = generatePostJsonLd({
    title: post.title,
    description: post.description || '',
    ogImage: post.cover || undefined,
    canonical: `/blog/${post.slug}`,
    keywords: post.tags,
    publishedTime: post.publishedAt || post.createdAt,
    modifiedTime: post.updatedAt || post.lastEditedAt,
    author: siteConfig.author.name,
  });
  const tableOfContents = extractTableOfContentsFromMarkdown(markdown);

  // 이전글/다음글 찾기
  const currentIndex = posts.findIndex((p: PostMeta) => p.id === post.id);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined;

  // 관련 포스트 찾기 (같은 카테고리의 다른 포스트들)
  const relatedPosts = posts
    .filter((p: PostMeta) => p.id !== post.id && p.category.text === post.category.text)
    .map((p: PostMeta) => ({
      id: p.id,
      title: p.title,
      createdAt: p.createdAt,
      href: createBlogPostHref(p),
    }));

  // 관련 포스트 페이지네이션 설정 (5개 이상일 때 활성화)
  const postsPerPage = DEFAULT_POSTS_PER_PAGE;
  const enablePagination = relatedPosts.length > postsPerPage;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <PostTemplate
        post={{
          ...post,
          createdAt: post.createdAt,
        }}
        markdown={markdown}
        linkMaps={readContentLinkMaps()}
        prevPost={
          prevPost
            ? {
                title: prevPost.title,
                href: createBlogPostHref(prevPost),
              }
            : undefined
        }
        nextPost={
          nextPost
            ? {
                title: nextPost.title,
                href: createBlogPostHref(nextPost),
              }
            : undefined
        }
        relatedPosts={relatedPosts}
        showRelatedPosts={relatedPosts.length > 0}
        enableRelatedPostsPagination={enablePagination}
        tableOfContents={tableOfContents}
      />
    </>
  );
}
