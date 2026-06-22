import { NextResponse } from 'next/server';

import { SITE_CONFIG, AUTHOR_CONFIG } from '@/constants';
import { getStaticPostList } from '@/libs/staticPostData';

export const dynamic = 'force-static';

/**
 * RSS 2.0 feed.xml 생성
 *
 * AI 크롤러/리더가 신규 글을 자동으로 발견할 수 있도록 RSS feed 제공
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = SITE_CONFIG.url;
  const posts = getStaticPostList();
  const buildDate = new Date().toUTCString();

  const items = posts
    .map(post => {
      const link = `${baseUrl}/blog/${post.slug}/`;
      const pubDate = new Date(post.lastEditedAt || post.createdAt).toUTCString();
      const categories = post.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('');
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(post.description || '')}</description>`,
        `      <author>${escapeXml(AUTHOR_CONFIG.email)} (${escapeXml(AUTHOR_CONFIG.name)})</author>`,
        categories ? `      ${categories}` : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)}</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
