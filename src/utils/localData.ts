import fs from 'fs/promises';
import path from 'path';

import type { PostMeta } from '@/types/blog';

/**
 * 빌드된 포스트 메타데이터를 로컬에서 읽어옵니다
 */
export async function getLocalPostMeta(): Promise<PostMeta[]> {
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'postMeta.json');
    const jsonContent = await fs.readFile(jsonPath, 'utf8');
    return JSON.parse(jsonContent) as PostMeta[];
  } catch (error) {
    console.error('Error reading local post meta:', error);
    return [];
  }
}

/**
 * 클라이언트 사이드에서 포스트 메타데이터를 fetch합니다
 */
export async function fetchPostMeta(): Promise<PostMeta[]> {
  try {
    const response = await fetch('/data/postMeta.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching post meta:', error);
    return [];
  }
}
