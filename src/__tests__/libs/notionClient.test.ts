/**
 * Notion Client 테스트
 * 비공식 Notion API 클라이언트 기능 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// notion-client 모킹
const mockGetPage = vi.fn();

vi.mock('notion-client', () => ({
  NotionAPI: vi.fn().mockImplementation(() => ({
    getPage: mockGetPage,
  })),
}));

// 환경 변수 모킹
const originalEnv = process.env;

// 간단한 RecordMap 타입 정의 (테스트용)
interface TestRecordMap {
  block: Record<string, unknown>;
  collection: Record<string, unknown>;
  collection_view: Record<string, unknown>;
  notion_user: Record<string, unknown>;
}

describe('NotionClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 환경변수 설정
    process.env = {
      ...originalEnv,
      NOTION_ACTIVE_USER: 'test-active-user',
      NOTION_TOKEN_V2: 'test-token-v2',
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    process.env = originalEnv;
  });

  describe('getPageBlocks', () => {
    it('성공적으로 페이지 블록 데이터를 반환해야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      // Mock 데이터 설정 (간단한 구조)
      const mockRecordMap: TestRecordMap = {
        block: {
          'test-page-id': {
            role: 'reader',
            value: {
              id: 'test-page-id',
              type: 'page',
              properties: {
                title: [['Test Page Title']],
              },
              content: ['block-1', 'block-2'],
              created_time: 1640995200000,
              last_edited_time: 1641081600000,
              parent_id: 'parent-id',
              parent_table: 'space',
              alive: true,
              space_id: 'space-id',
              version: 1,
            },
          },
          'block-1': {
            role: 'reader',
            value: {
              id: 'block-1',
              type: 'text',
              properties: {
                title: [['First text block']],
              },
              content: [],
            },
          },
          'block-2': {
            role: 'reader',
            value: {
              id: 'block-2',
              type: 'header',
              properties: {
                title: [['Header Block']],
              },
              content: [],
            },
          },
        },
        collection: {},
        collection_view: {},
        notion_user: {},
      };

      mockGetPage.mockResolvedValue(mockRecordMap);

      const result = await getPageBlocks('test-page-id');

      // 올바른 페이지 ID로 호출되었는지 확인
      expect(mockGetPage).toHaveBeenCalledWith('test-page-id');
      expect(mockGetPage).toHaveBeenCalledTimes(1);

      // 반환된 데이터 검증
      expect(result).toEqual(mockRecordMap);
      expect(result).toBeTruthy();
      expect(result?.block).toHaveProperty('test-page-id');
      expect(result?.block).toHaveProperty('block-1');
      expect(result?.block).toHaveProperty('block-2');
    });

    it('빈 recordMap을 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const emptyRecordMap: TestRecordMap = {
        block: {},
        collection: {},
        collection_view: {},
        notion_user: {},
      };

      mockGetPage.mockResolvedValue(emptyRecordMap);

      const result = await getPageBlocks('empty-page');

      expect(mockGetPage).toHaveBeenCalledWith('empty-page');
      expect(result).toEqual(emptyRecordMap);
      expect(Object.keys(result?.block || {})).toHaveLength(0);
    });

    it('복잡한 블록 구조를 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const complexRecordMap: TestRecordMap = {
        block: {
          'root-page': {
            role: 'reader',
            value: {
              id: 'root-page',
              type: 'page',
              properties: {
                title: [['Complex Page']],
              },
              content: ['text-block', 'code-block', 'image-block'],
            },
          },
          'text-block': {
            role: 'reader',
            value: {
              id: 'text-block',
              type: 'text',
              properties: {
                title: [['This is a text block']],
              },
              content: [],
            },
          },
          'code-block': {
            role: 'reader',
            value: {
              id: 'code-block',
              type: 'code',
              properties: {
                title: [['console.log("Hello World");']],
                language: [['JavaScript']],
                caption: [['Code example']],
              },
              content: [],
            },
          },
          'image-block': {
            role: 'reader',
            value: {
              id: 'image-block',
              type: 'image',
              properties: {
                source: [['https://example.com/image.jpg']],
                caption: [['Image caption']],
              },
              content: [],
            },
          },
        },
        collection: {},
        collection_view: {},
        notion_user: {},
      };

      mockGetPage.mockResolvedValue(complexRecordMap);

      const result = await getPageBlocks('complex-page');

      expect(result?.block).toHaveProperty('root-page');
      expect(result?.block).toHaveProperty('text-block');
      expect(result?.block).toHaveProperty('code-block');
      expect(result?.block).toHaveProperty('image-block');
    });

    it('컬렉션 데이터를 포함한 recordMap을 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const recordMapWithCollection: TestRecordMap = {
        block: {
          'page-with-collection': {
            role: 'reader',
            value: {
              id: 'page-with-collection',
              type: 'page',
              properties: {
                title: [['Page with Collection']],
              },
              content: ['collection-view-block'],
            },
          },
          'collection-view-block': {
            role: 'reader',
            value: {
              id: 'collection-view-block',
              type: 'collection_view',
              collection_id: 'test-collection-id',
              view_ids: ['test-view-id'],
              properties: {},
            },
          },
        },
        collection: {
          'test-collection-id': {
            role: 'reader',
            value: {
              id: 'test-collection-id',
              name: [['Test Collection']],
              schema: {
                title: {
                  name: 'Title',
                  type: 'title',
                },
                tags: {
                  name: 'Tags',
                  type: 'multi_select',
                  options: [
                    {
                      id: 'tag-1',
                      color: 'blue',
                      value: 'React',
                    },
                    {
                      id: 'tag-2',
                      color: 'gray',
                      value: 'TypeScript',
                    },
                  ],
                },
              },
              version: 1,
            },
          },
        },
        collection_view: {
          'test-view-id': {
            role: 'reader',
            value: {
              id: 'test-view-id',
              name: 'Table View',
              type: 'table',
              collection_id: 'test-collection-id',
              format: {
                table_properties: [
                  {
                    property: 'title',
                    visible: true,
                    width: 200,
                  },
                  {
                    property: 'tags',
                    visible: true,
                    width: 150,
                  },
                ],
              },
              query2: {
                filter: {
                  operator: 'and',
                  filters: [],
                },
                group_by: '',
              },
              version: 1,
            },
          },
        },
        notion_user: {},
      };

      mockGetPage.mockResolvedValue(recordMapWithCollection);

      const result = await getPageBlocks('collection-page');

      expect(result?.collection).toHaveProperty('test-collection-id');
      expect(result?.collection_view).toHaveProperty('test-view-id');
    });

    it('에러 발생시 null을 반환하고 에러를 로깅해야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Notion API Error');

      mockGetPage.mockRejectedValue(error);

      const result = await getPageBlocks('error-page');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching page blocks:', error);
      expect(mockGetPage).toHaveBeenCalledWith('error-page');

      consoleErrorSpy.mockRestore();
    });

    it('네트워크 오류를 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const networkError = new Error('Network Error: Connection timeout');

      mockGetPage.mockRejectedValue(networkError);

      const result = await getPageBlocks('network-error-page');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching page blocks:', networkError);

      consoleErrorSpy.mockRestore();
    });

    it('인증 오류를 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const authError = new Error('Unauthorized: Invalid token');

      mockGetPage.mockRejectedValue(authError);

      const result = await getPageBlocks('auth-error-page');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching page blocks:', authError);

      consoleErrorSpy.mockRestore();
    });

    it('유효하지 않은 페이지 ID에 대한 에러를 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const invalidPageError = new Error('Page not found');

      mockGetPage.mockRejectedValue(invalidPageError);

      const result = await getPageBlocks('invalid-page-id');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching page blocks:', invalidPageError);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('notionClient', () => {
    it('NotionAPI 인스턴스가 올바른 설정으로 생성되어야 한다', async () => {
      // 모듈 캐시 클리어하여 새로 생성되도록 함
      vi.resetModules();

      const { NotionAPI } = await import('notion-client');

      // 모듈을 다시 import하여 클라이언트 생성
      await import('@/libs/notionClient');

      expect(NotionAPI).toHaveBeenCalledWith({
        activeUser: 'test-active-user',
        authToken: 'test-token-v2',
      });
    });

    it('환경변수가 없을 때도 NotionAPI가 생성되어야 한다', async () => {
      // 환경변수 제거
      process.env.NOTION_ACTIVE_USER = undefined;
      process.env.NOTION_TOKEN_V2 = undefined;

      // 모듈 캐시 클리어를 위해 새로운 import
      vi.resetModules();

      const { NotionAPI } = await import('notion-client');
      await import('@/libs/notionClient');

      expect(NotionAPI).toHaveBeenCalledWith({
        activeUser: undefined,
        authToken: undefined,
      });
    });

    it('notionClient가 올바르게 export되어야 한다', async () => {
      const { notionClient } = await import('@/libs/notionClient');

      expect(notionClient).toBeDefined();
      expect(typeof notionClient).toBe('object');
    });
  });

  describe('Edge Cases', () => {
    it('매우 긴 페이지 ID를 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const longPageId = 'a'.repeat(100);
      const mockRecordMap: TestRecordMap = {
        block: {
          [longPageId]: {
            role: 'reader',
            value: {
              id: longPageId,
              type: 'page',
              properties: {
                title: [['Long ID Page']],
              },
              content: [],
            },
          },
        },
        collection: {},
        collection_view: {},
        notion_user: {},
      };

      mockGetPage.mockResolvedValue(mockRecordMap);

      const result = await getPageBlocks(longPageId);

      expect(mockGetPage).toHaveBeenCalledWith(longPageId);
      expect(result?.block).toHaveProperty(longPageId);
    });

    it('UUID 형식의 페이지 ID를 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const uuidPageId = '550e8400-e29b-41d4-a716-446655440000';
      const mockRecordMap: TestRecordMap = {
        block: {
          [uuidPageId]: {
            role: 'reader',
            value: {
              id: uuidPageId,
              type: 'page',
              properties: {
                title: [['UUID Page']],
              },
              content: [],
            },
          },
        },
        collection: {},
        collection_view: {},
        notion_user: {},
      };

      mockGetPage.mockResolvedValue(mockRecordMap);

      const result = await getPageBlocks(uuidPageId);

      expect(mockGetPage).toHaveBeenCalledWith(uuidPageId);
      expect(result?.block).toHaveProperty(uuidPageId);
    });

    it('빈 문자열 페이지 ID를 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const emptyIdError = new Error('Invalid page ID');

      mockGetPage.mockRejectedValue(emptyIdError);

      const result = await getPageBlocks('');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching page blocks:', emptyIdError);

      consoleErrorSpy.mockRestore();
    });

    it('특수 문자가 포함된 페이지 ID를 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const specialPageId = 'page-with-special-chars-123_ABC';
      const mockRecordMap: TestRecordMap = {
        block: {
          [specialPageId]: {
            role: 'reader',
            value: {
              id: specialPageId,
              type: 'page',
              properties: {
                title: [['Special Chars Page']],
              },
              content: [],
            },
          },
        },
        collection: {},
        collection_view: {},
        notion_user: {},
      };

      mockGetPage.mockResolvedValue(mockRecordMap);

      const result = await getPageBlocks(specialPageId);

      expect(mockGetPage).toHaveBeenCalledWith(specialPageId);
      expect(result?.block).toHaveProperty(specialPageId);
    });

    it('null 또는 undefined 응답을 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      mockGetPage.mockResolvedValue(null);

      const result = await getPageBlocks('null-response-page');

      expect(result).toBeNull();
      expect(mockGetPage).toHaveBeenCalledWith('null-response-page');
    });

    it('타임아웃 에러를 처리할 수 있어야 한다', async () => {
      const { getPageBlocks } = await import('@/libs/notionClient');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const timeoutError = new Error('Request timeout');

      mockGetPage.mockRejectedValue(timeoutError);

      const result = await getPageBlocks('timeout-page');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching page blocks:', timeoutError);

      consoleErrorSpy.mockRestore();
    });
  });
});
