/**
 * 비공식 Notion 클라이언트를 사용한 페이지 콘텐츠 조회
 * 실제 페이지 블록 데이터 가져오기용
 */
import { NotionAPI } from 'notion-client';

const notionClient = new NotionAPI({
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_TOKEN_V2,
});

/**
 * 특정 페이지의 모든 블록 데이터를 가져옵니다
 */
export async function getPageBlocks(pageId: string) {
  try {
    const recordMap = await notionClient.getPage(pageId);
    return recordMap;
  } catch (error) {
    console.error('Error fetching page blocks:', error);
    return null;
  }
}

export { notionClient };
