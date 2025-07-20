import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';

import type { ExtendedRecordMap } from 'notion-types';

/**
 * 이미지를 다운로드하고 로컬에 저장합니다
 */
export async function downloadImage(
  imageUrl: string,
  targetDir: string,
  fileName?: string,
): Promise<string> {
  try {
    // URL에서 이미지 다운로드
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // 파일명 생성 (제공되지 않으면 URL 해시 사용)
    let finalFileName = fileName;
    if (!finalFileName) {
      const urlHash = createHash('md5').update(imageUrl).digest('hex');
      const urlObj = new URL(imageUrl);
      const extension = path.extname(urlObj.pathname) || '.jpg';
      finalFileName = `${urlHash}${extension}`;
    }

    // 디렉토리 생성
    await fs.mkdir(targetDir, { recursive: true });

    // 파일 저장
    const filePath = path.join(targetDir, finalFileName);
    await fs.writeFile(filePath, uint8Array);

    // public 디렉토리 기준 상대 경로 반환
    const publicPath = filePath.replace(path.join(process.cwd(), 'public'), '');
    return publicPath.startsWith('/') ? publicPath : `/${publicPath}`;
  } catch (error) {
    console.error(`Error downloading image from ${imageUrl}:`, error);
    // 다운로드 실패 시 원본 URL 반환
    return imageUrl;
  }
}

/**
 * Notion 이미지 URL에서 이미지를 다운로드합니다
 */
export async function downloadNotionImage(
  imageUrl: string,
  type: 'cover' | 'content',
  postId?: string,
): Promise<string> {
  if (!imageUrl || !imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  const targetDir = path.join(
    process.cwd(),
    'public',
    'images',
    'blog',
    type === 'cover' ? 'covers' : 'content',
  );

  let fileName: string | undefined;
  if (type === 'cover' && postId) {
    const urlObj = new URL(imageUrl);
    const extension = path.extname(urlObj.pathname) || '.jpg';
    fileName = `${postId}${extension}`;
  }

  return downloadImage(imageUrl, targetDir, fileName);
}

/**
 * Notion RecordMap에서 이미지 URL들을 추출하고 로컬로 다운로드합니다
 */
export async function processNotionRecordMapImages(
  recordMap: ExtendedRecordMap,
  postId: string,
): Promise<ExtendedRecordMap> {
  if (!recordMap || !recordMap.block) {
    return recordMap;
  }

  const processedRecordMap = JSON.parse(JSON.stringify(recordMap)); // Deep clone

  // 블록들을 순회하면서 이미지 URL 처리
  for (const blockId in processedRecordMap.block) {
    const block = processedRecordMap.block[blockId];

    if (block?.value?.type === 'image' && block.value.properties?.source) {
      const imageUrl = block.value.properties.source[0][0];

      if (imageUrl && imageUrl.startsWith('https://')) {
        try {
          const localPath = await downloadNotionImage(imageUrl, 'content', postId);
          // 로컬 경로로 교체
          block.value.properties.source[0][0] = localPath;
        } catch (error) {
          console.error(`Failed to download image ${imageUrl}:`, error);
          // 다운로드 실패 시 원본 URL 유지
        }
      }
    }

    // 다른 타입의 블록에서도 이미지가 있을 수 있음 (예: 페이지 커버)
    if (block?.value?.format?.page_cover && block.value.format.page_cover.startsWith('https://')) {
      try {
        const localPath = await downloadNotionImage(
          block.value.format.page_cover,
          'content',
          postId,
        );
        block.value.format.page_cover = localPath;
      } catch (error) {
        console.error(`Failed to download cover image:`, error);
      }
    }
  }

  return processedRecordMap;
}
