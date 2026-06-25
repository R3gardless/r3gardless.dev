import { NextResponse } from 'next/server';

import { SITE_CONFIG, AUTHOR_CONFIG } from '@/constants';
import { getStaticPostList } from '@/libs/staticPostData';

export const dynamic = 'force-static';

function escapeMarkdownLinkText(value: string): string {
  return value.replace(/([\\[\]])/g, '\\$1');
}

function formatPostContext(post: ReturnType<typeof getStaticPostList>[number]): string {
  const parts = [
    post.publishedAt ? `published ${post.publishedAt}` : '',
    post.updatedAt ? `updated ${post.updatedAt}` : '',
    post.category?.text ? `category ${post.category.text}` : '',
    post.tags.length > 0 ? `tags ${post.tags.join(', ')}` : '',
  ].filter(Boolean);

  return parts.length > 0 ? ` (${parts.join('; ')})` : '';
}

/**
 * llms.txt 생성 (llmstxt.org 표준)
 *
 * AI 크롤러가 사이트를 효율적으로 인덱싱하도록 핵심 메타데이터와
 * 우선 순위가 높은 콘텐츠 목록을 평문 마크다운으로 제공
 */
export async function GET() {
  const baseUrl = SITE_CONFIG.url;
  const posts = getStaticPostList();

  const postLines = posts
    .map(post => {
      const url = `${baseUrl}/blog/${post.slug}/`;
      const title = escapeMarkdownLinkText(post.title);
      const description = post.description?.replace(/\s+/g, ' ').trim() || post.title;
      return `- [${title}](${url})${formatPostContext(post)}: ${description}`;
    })
    .join('\n');

  const body = `# ${SITE_CONFIG.name}

> ${SITE_CONFIG.description} 저자 ${AUTHOR_CONFIG.name} (${AUTHOR_CONFIG.position}, ${AUTHOR_CONFIG.team}).

## About

- [About](${baseUrl}/about/): 저자 소개와 관심 주제
- [Blog](${baseUrl}/blog/): 모든 블로그 포스트 목록
- [Sitemap](${baseUrl}/sitemap.xml): 전체 URL 목록
- [Feed](${baseUrl}/feed.xml): RSS 2.0 피드
- [Robots](${baseUrl}/robots.txt): crawler access policy

## Posts

${postLines}
`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
