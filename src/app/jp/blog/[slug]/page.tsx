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
 * 정적 경로 생성 - jp 번역본이 없는 slug는 페이지에서 404 처리
 */
export async function generateStaticParams() {
  return generatePostStaticParams('jp');
}

/**
 * SEO 메타데이터 생성 (jp)
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateLocalizedPostMetadata(slug, 'jp');
}

/**
 * 개별 포스트 페이지 (jp 번역)
 */
export default async function JpPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  return <LocalizedPostPage slug={slug} lang="jp" />;
}
