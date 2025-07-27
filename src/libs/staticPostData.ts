/**
 * 정적 빌드 시 생성된 포스트 메타데이터를 읽는 함수들
 */
import fs from 'node:fs';
import path from 'node:path';

import type { PostMeta } from '@/types/blog';

// 빌드 시 생성된 postMeta.json 파일 경로
const POST_META_PATH = path.join(process.cwd(), 'public', 'data', 'postMeta.json');

/**
 * 정적으로 생성된 포스트 메타데이터를 읽어옵니다
 * 빌드 시 생성된 postMeta.json 파일을 사용
 */
export function getStaticPostList(): PostMeta[] {
  try {
    if (!fs.existsSync(POST_META_PATH)) {
      console.warn('⚠️ postMeta.json not found. Please run build script first.');
      return [];
    }

    const fileContent = fs.readFileSync(POST_META_PATH, 'utf8');
    const posts: PostMeta[] = JSON.parse(fileContent);

    return posts;
  } catch (error) {
    console.error('❌ Error reading static post list:', error);
    return [];
  }
}

/**
 * 특정 포스트의 메타데이터를 가져옵니다 (정적 데이터에서)
 */
export function getStaticPostMeta(pageId: string): PostMeta | null {
  try {
    const allPosts = getStaticPostList();
    return allPosts.find(post => post.id === pageId) || null;
  } catch (error) {
    console.error('❌ Error fetching static post meta:', error);
    return null;
  }
}

/**
 * 포스트 목록을 가져옵니다 (정적 우선, API 폴백)
 * 1. 먼저 정적으로 생성된 데이터(postMeta.json)를 확인
 * 2. 정적 데이터가 없으면 Notion API 호출 (개발 환경에서만)
 */
export async function getPostListWithStaticFallback(): Promise<PostMeta[]> {
  // 먼저 정적으로 생성된 데이터가 있는지 확인
  const staticPosts = getStaticPostList();
  if (staticPosts.length > 0) {
    return staticPosts;
  }

  // 정적 데이터가 없고 개발 환경인 경우에만 Notion API 호출
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log('📡 No static data found, fetching from Notion API...');
      const { getPostList: getPostListFromNotion } = await import('@/libs/notion');
      return await getPostListFromNotion();
    } catch {
      console.warn('⚠️ Failed to fetch from Notion API');
      return [];
    }
  }

  // 프로덕션에서 정적 데이터가 없으면 빈 배열 반환
  console.error('❌ No static data found in production. Build process may have failed.');
  return [];
}
