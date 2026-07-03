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
 * jp 번역본이 있는 포스트만 정적 생성하고, 나머지 경로는 404 처리합니다.
 * (번역본이 하나도 없어도 output: export 빌드가 실패하지 않도록 함)
 */
export const dynamicParams = false;

/**
 * 정적 경로 생성 - jp 번역본이 있는 포스트만 생성
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
