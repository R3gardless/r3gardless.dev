import { readFile } from 'fs/promises';
import { join } from 'path';

import { NextResponse } from 'next/server';

/**
 * 빌드 시 생성된 포스트 메타데이터를 반환하는 API 엔드포인트
 */
export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'postMeta.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const posts = JSON.parse(fileContent);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to read post metadata:', error);
    return NextResponse.json({ error: 'Failed to load posts' }, { status: 500 });
  }
}
