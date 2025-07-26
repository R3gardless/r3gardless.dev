/**
 * 비공식 Notion 클라이언트를 사용한 페이지 콘텐츠 조회
 * 실제 페이지 블록 데이터 가져오기용
 */
import { NotionAPI } from 'notion-client';
import type { ExtendedRecordMap } from 'notion-types';

const notionClient = new NotionAPI();

/**
 * 특정 페이지의 모든 블록 데이터를 가져옵니다
 * 빌드 시 타임아웃을 방지하기 위해 30초 제한 추가
 */
export async function getPageBlocks(pageId: string): Promise<ExtendedRecordMap | null> {
  try {
    // 30초 타임아웃 설정
    const timeoutPromise = new Promise((_resolve, reject) => {
      setTimeout(() => reject(new Error('Notion API timeout after 30 seconds')), 30000);
    });

    const recordMap = (await Promise.race([
      notionClient.getPage(pageId),
      timeoutPromise,
    ])) as ExtendedRecordMap;

    return recordMap;
  } catch (error) {
    console.error(`❌ [NotionClient] Error fetching page blocks for ${pageId}:`, error);
    return null;
  }
}

export { notionClient };
