import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { generatePostMetadata } from '@/libs/seo/postMetadata';
import { getPageBlocks } from '@/libs/notionClient';
import { getPostListWithStaticFallback } from '@/libs/staticPostData';
import type { PostMeta } from '@/types/blog';
import { findPostByEncodedSlug, formatPostDate } from '@/utils/blog';
import { getSiteConfig } from '@/utils/config';

import { PostPageContent } from './PostPageContent';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * 정적 경로 생성 (App Router)
 * 빌드 시 정적 데이터에서 포스트 메타데이터를 가져와 모든 포스트 경로를 생성
 */
export async function generateStaticParams() {
  try {
    const posts = await getPostListWithStaticFallback();
    return posts.map((post: PostMeta) => ({
      slug: post.slug, // 인코딩된 slug 우선 사용
    }));
  } catch (error) {
    console.error('❌ [generateStaticParams] Error generating static params:', error);
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

    console.log('Retrieving metadata for slug:', slug);

    const post = findPostByEncodedSlug(posts, slug);

    console.log('Post found:', post ? post.title : 'Not found');

    if (!post) {
      return {
        title: 'Post Not Found',
      };
    }

    const siteConfig = getSiteConfig();

    return generatePostMetadata({
      title: post.title,
      description: post.description || '',
      ogImage: post.cover || undefined, // 커버가 없으면 undefined로 전달하여 기본값 사용
      canonical: `/blog/${post.slug}`, // 이미 인코딩된 slug 사용
      keywords: post.tags,
      publishedTime: post.createdAt,
      modifiedTime: post.lastEditedAt,
      author: siteConfig.author.name,
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Post Not Found',
    };
  }
}

/**
 * 개별 포스트 페이지
 */
export default async function PostPage({ params }: PostPageProps) {
  try {
    const { slug } = await params;

    const posts = await getPostListWithStaticFallback();

    const post = findPostByEncodedSlug(posts, slug);
    if (!post) {
      notFound();
    }

    // Notion 페이지 블록 데이터 가져오기
    const recordMap = await getPageBlocks(post.id);

    if (!recordMap) {
      notFound();
    }

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
        createdAt: formatPostDate(p.createdAt),
        href: `/blog/${p.encodedSlug || p.slug}`, // 인코딩된 slug 우선 사용
      }));

    // 관련 포스트 페이지네이션 설정 (5개 이상일 때 활성화)
    const postsPerPage = 5;
    const enablePagination = relatedPosts.length > postsPerPage;

    return (
      <PostPageContent
        post={{
          ...post,
          createdAt: formatPostDate(post.createdAt),
        }}
        recordMap={recordMap}
        prevPost={
          prevPost
            ? {
                title: prevPost.title,
                href: `/blog/${prevPost.encodedSlug || prevPost.slug}`, // 인코딩된 slug 우선 사용
              }
            : undefined
        }
        nextPost={
          nextPost
            ? {
                title: nextPost.title,
                href: `/blog/${nextPost.encodedSlug || nextPost.slug}`, // 인코딩된 slug 우선 사용
              }
            : undefined
        }
        relatedPosts={relatedPosts}
        showRelatedPosts={relatedPosts.length > 0}
        enableRelatedPostsPagination={enablePagination}
      />
    );
  } catch (error) {
    console.error('Error rendering post page:', error);
    notFound();
  }
}
