import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { PostTemplate } from '@/components/templates/PostTemplate';
import { DEFAULT_POSTS_PER_PAGE } from '@/constants/blog';
import { exportedPostFileName, extractTableOfContentsFromMarkdown } from '@/libs/content';
import type { ContentLinkMaps } from '@/libs/content';
import {
  buildPostLanguageAlternates,
  generatePostJsonLd,
  generatePostMetadata,
  serializeJsonLd,
} from '@/libs/seo/postMetadata';
import { getPostListWithStaticFallback } from '@/libs/staticPostData';
import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang, PostMeta } from '@/types/blog';
import {
  blogLangPathPrefix,
  createBlogPostHref,
  findPostByEncodedSlug,
  getPostLanguages,
  localizePostMeta,
} from '@/utils/blog';
import { getSiteConfig } from '@/utils/config';
import { logError, logWarn } from '@/utils/logger';

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'posts');
const LINK_INDEX_PATH = path.join(process.cwd(), 'public', 'data', 'contentLinkIndex.json');

function emptyContentLinkMaps(): ContentLinkMaps {
  return {
    published: {},
    sources: {},
    sourceLabels: {},
  };
}

function readPostMarkdown(slug: string, lang: PostLang): string | null {
  const postPath = path.join(CONTENT_ROOT, slug, exportedPostFileName(lang));

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
 * 해당 언어로 제공되는 포스트 목록 (postMeta 순서 유지)
 */
async function getPostsForLang(lang: PostLang): Promise<PostMeta[]> {
  const posts = await getPostListWithStaticFallback();

  if (lang === DEFAULT_POST_LANG) {
    return posts;
  }

  return posts.filter(post => getPostLanguages(post).includes(lang));
}

/**
 * 언어별 정적 경로 생성.
 *
 * output: export는 동적 라우트마다 최소 1개의 정적 경로를 요구하므로, en/ja 번역본이
 * 아직 하나도 없어도 빌드가 실패하지 않도록 항상 전체 slug를 생성합니다. 번역본이 없는
 * 경로는 LocalizedPostPage / generateLocalizedPostMetadata에서 notFound()로 404 처리됩니다.
 */
export async function generatePostStaticParams(_lang: PostLang): Promise<Array<{ slug: string }>> {
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
 * 언어별 포스트 SEO 메타데이터 생성 (hreflang alternate 포함)
 */
export async function generateLocalizedPostMetadata(
  slug: string,
  lang: PostLang,
): Promise<Metadata> {
  try {
    const posts = await getPostsForLang(lang);
    const post = findPostByEncodedSlug(posts, slug);

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    const siteConfig = getSiteConfig();
    const localized = localizePostMeta(post, lang);

    return generatePostMetadata({
      title: localized.title,
      description: localized.description || '',
      ogImage: post.cover || undefined,
      canonical: `${blogLangPathPrefix(lang)}/blog/${post.slug}`,
      keywords: post.tags,
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt || post.lastEditedAt,
      author: siteConfig.author.name,
      lang,
      languageAlternates: buildPostLanguageAlternates(post.slug, getPostLanguages(post)),
    });
  } catch (error) {
    logError('Blog post metadata generation failed', error);
    return {
      title: 'Post Not Found',
    };
  }
}

/**
 * 언어별 포스트 페이지 렌더링 (kr 원문 + en/ja 번역 라우트 공용)
 */
export async function LocalizedPostPage({ slug, lang }: { slug: string; lang: PostLang }) {
  const posts = await getPostsForLang(lang);
  const post = findPostByEncodedSlug(posts, slug);

  if (!post) {
    notFound();
  }

  const markdown = readPostMarkdown(post.slug, lang);
  if (!markdown) {
    notFound();
  }

  const siteConfig = getSiteConfig();
  const localized = localizePostMeta(post, lang);
  const jsonLd = generatePostJsonLd({
    title: localized.title,
    description: localized.description || '',
    ogImage: post.cover || undefined,
    canonical: `${blogLangPathPrefix(lang)}/blog/${post.slug}`,
    keywords: post.tags,
    publishedTime: post.publishedAt || post.createdAt,
    modifiedTime: post.updatedAt || post.lastEditedAt,
    author: siteConfig.author.name,
    lang,
  });
  const tableOfContents = extractTableOfContentsFromMarkdown(markdown);

  // 이전글/다음글 찾기 (같은 언어로 제공되는 포스트 기준)
  const currentIndex = posts.findIndex((p: PostMeta) => p.id === post.id);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined;

  // 관련 포스트 찾기 (같은 카테고리의 다른 포스트들)
  const relatedPosts = posts
    .filter((p: PostMeta) => p.id !== post.id && p.category.text === post.category.text)
    .map((p: PostMeta) => ({
      id: p.id,
      title: localizePostMeta(p, lang).title,
      createdAt: p.createdAt,
      href: createBlogPostHref(p, lang),
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
          ...localized,
          createdAt: post.createdAt,
        }}
        markdown={markdown}
        linkMaps={readContentLinkMaps()}
        lang={lang}
        prevPost={
          prevPost
            ? {
                title: localizePostMeta(prevPost, lang).title,
                href: createBlogPostHref(prevPost, lang),
              }
            : undefined
        }
        nextPost={
          nextPost
            ? {
                title: localizePostMeta(nextPost, lang).title,
                href: createBlogPostHref(nextPost, lang),
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
