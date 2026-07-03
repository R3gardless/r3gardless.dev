import type { Metadata } from 'next';

import {
  LocalizedPostPage,
  generateLocalizedPostMetadata,
  generatePostStaticParams,
} from '@/libs/blogPages';

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
  return generatePostStaticParams('kr');
}

/**
 * SEO 메타데이터 생성
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateLocalizedPostMetadata(slug, 'kr');
}

/**
 * 개별 포스트 페이지 (kr 원문)
 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  return <LocalizedPostPage slug={slug} lang="kr" />;
}
