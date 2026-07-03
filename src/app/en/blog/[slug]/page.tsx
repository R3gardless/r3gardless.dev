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
 * 정적 경로 생성 - en 번역본이 없는 slug는 페이지에서 404 처리
 */
export async function generateStaticParams() {
  return generatePostStaticParams('en');
}

/**
 * SEO 메타데이터 생성 (en)
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generateLocalizedPostMetadata(slug, 'en');
}

/**
 * 개별 포스트 페이지 (en 번역)
 */
export default async function EnPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  return <LocalizedPostPage slug={slug} lang="en" />;
}
