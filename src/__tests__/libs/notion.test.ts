// filepath: /Users/dev_young_uk/r3gardless.dev/src/__tests__/libs/notion.test.ts

/**
 * Notion API 클라이언트 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// Notion Client와 환경변수 모킹
const mockQuery = vi.fn();
const mockRetrieve = vi.fn();

vi.mock('@notionhq/client', () => ({
  Client: vi.fn().mockImplementation(() => ({
    databases: {
      query: mockQuery,
    },
    pages: {
      retrieve: mockRetrieve,
    },
  })),
}));

// 환경 변수 모킹
process.env.NOTION_TOKEN = 'test-token';
process.env.NOTION_DATABASE_ID = 'test-database-id';

describe('Notion API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules(); // 모듈 캐시 초기화
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getPostList', () => {
    it('published된 포스트 목록을 올바른 순서로 반환해야 한다', async () => {
      const { getPostList } = await import('@/libs/notion');

      // Mock 데이터 설정
      const mockResponse = {
        results: [
          {
            id: 'post-1',
            properties: {
              title: {
                type: 'title',
                title: [{ plain_text: '첫 번째 포스트' }],
              },
              description: {
                type: 'rich_text',
                rich_text: [{ plain_text: '첫 번째 포스트 설명' }],
              },
              category: {
                type: 'select',
                select: {
                  name: 'Tech',
                  color: 'blue',
                },
              },
              tag: {
                type: 'multi_select',
                multi_select: [{ name: 'React' }, { name: 'TypeScript' }],
              },
              cover: {
                type: 'files',
                files: [
                  {
                    file: {
                      url: 'https://example.com/cover1.jpg',
                    },
                  },
                ],
              },
              createdAt: {
                type: 'created_time',
                created_time: '2024-01-01T00:00:00.000Z',
              },
              lastEditedAt: {
                type: 'last_edited_time',
                last_edited_time: '2024-01-02T00:00:00.000Z',
              },
            },
            created_time: '2024-01-01T00:00:00.000Z',
            last_edited_time: '2024-01-02T00:00:00.000Z',
            cover: null,
          } as unknown as PageObjectResponse,
          {
            id: 'post-2',
            properties: {
              title: {
                type: 'title',
                title: [{ plain_text: '두 번째 포스트' }],
              },
              description: {
                type: 'rich_text',
                rich_text: [{ plain_text: '두 번째 포스트 설명' }],
              },
              category: {
                type: 'select',
                select: {
                  name: 'Design',
                  color: 'green',
                },
              },
              tags: {
                type: 'multi_select',
                multi_select: [{ name: 'UI/UX' }, { name: 'Figma' }],
              },
              cover: {
                type: 'files',
                files: [],
              },
              createdAt: {
                type: 'created_time',
                created_time: '2024-01-03T00:00:00.000Z',
              },
              lastEditedAt: {
                type: 'last_edited_time',
                last_edited_time: '2024-01-04T00:00:00.000Z',
              },
            },
            created_time: '2024-01-03T00:00:00.000Z',
            last_edited_time: '2024-01-04T00:00:00.000Z',
            cover: {
              file: {
                url: 'https://example.com/cover2.jpg',
              },
            },
          } as unknown as PageObjectResponse,
        ],
      };

      mockQuery.mockResolvedValue(mockResponse);

      const result = await getPostList();

      // 올바른 파라미터로 호출되었는지 확인
      expect(mockQuery).toHaveBeenCalledWith({
        database_id: 'test-database-id',
        filter: {
          property: 'isPublished',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'id',
            direction: 'descending',
          },
        ],
      });

      // 반환된 데이터 검증
      expect(result).toHaveLength(2);

      const firstPost = result[0];
      expect(firstPost).toEqual({
        id: 'post-1',
        slug: '',
        title: '첫 번째 포스트',
        description: '첫 번째 포스트 설명',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastEditedAt: '2024-01-02T00:00:00.000Z',
        category: {
          text: 'Tech',
          color: 'blue',
        },
        tags: ['React', 'TypeScript'],
        cover: 'https://example.com/cover1.jpg',
      });

      const secondPost = result[1];
      expect(secondPost).toEqual({
        id: 'post-2',
        slug: '',
        title: '두 번째 포스트',
        description: '두 번째 포스트 설명',
        createdAt: '2024-01-03T00:00:00.000Z',
        lastEditedAt: '2024-01-04T00:00:00.000Z',
        category: {
          text: 'Design',
          color: 'green',
        },
        tags: ['UI/UX', 'Figma'],
        cover: '',
      });
    });

    it('빈 속성들을 기본값으로 처리해야 한다', async () => {
      const { getPostList } = await import('@/libs/notion');

      const mockResponse = {
        results: [
          {
            id: 'post-empty',
            properties: {
              title: {
                type: 'title',
                title: [],
              },
              description: {
                type: 'rich_text',
                rich_text: [],
              },
              category: {
                type: 'select',
                select: null,
              },
              tag: {
                type: 'multi_select',
                multi_select: [],
              },
              cover: {
                type: 'files',
                files: [],
              },
            },
            created_time: '2024-01-01T00:00:00.000Z',
            last_edited_time: '2024-01-01T00:00:00.000Z',
            cover: null,
          } as unknown as PageObjectResponse,
        ],
      };

      mockQuery.mockResolvedValue(mockResponse);

      const result = await getPostList();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'post-empty',
        slug: '',
        title: '',
        description: '',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastEditedAt: '2024-01-01T00:00:00.000Z',
        category: {
          text: 'Uncategorized',
          color: 'gray',
        },
        tags: [],
        cover: '',
      });
    });

    it('properties가 없는 페이지는 필터링해야 한다', async () => {
      const { getPostList } = await import('@/libs/notion');

      const mockResponse = {
        results: [
          {
            id: 'valid-post',
            properties: {
              title: {
                type: 'title',
                title: [{ plain_text: '유효한 포스트' }],
              },
            },
            created_time: '2024-01-01T00:00:00.000Z',
            last_edited_time: '2024-01-01T00:00:00.000Z',
          } as unknown as PageObjectResponse,
          {
            id: 'invalid-post',
            // properties가 없는 객체
          } as unknown as PageObjectResponse,
        ],
      };

      mockQuery.mockResolvedValue(mockResponse);

      const result = await getPostList();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('valid-post');
    });

    it('fallback 시간을 사용해야 한다', async () => {
      const { getPostList } = await import('@/libs/notion');

      const mockResponse = {
        results: [
          {
            id: 'post-fallback',
            properties: {
              title: {
                type: 'title',
                title: [{ plain_text: 'Fallback 테스트' }],
              },
              // createdAt, lastEditedAt 속성이 없음
            },
            created_time: '2024-01-01T00:00:00.000Z',
            last_edited_time: '2024-01-02T00:00:00.000Z',
          } as unknown as PageObjectResponse,
        ],
      };

      mockQuery.mockResolvedValue(mockResponse);

      const result = await getPostList();

      expect(result[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(result[0].lastEditedAt).toBe('2024-01-02T00:00:00.000Z');
    });
  });

  describe('getPostMeta', () => {
    it('존재하는 포스트의 메타데이터를 반환해야 한다', async () => {
      const { getPostMeta } = await import('@/libs/notion');

      // getPostList가 반환할 샘플 데이터 설정
      const mockResponse = {
        results: [
          {
            id: 'test-post',
            properties: {
              title: {
                type: 'title',
                title: [{ plain_text: '테스트 포스트' }],
              },
              description: {
                type: 'rich_text',
                rich_text: [{ plain_text: '테스트 포스트 설명' }],
              },
              slug: {
                type: 'formula',
                formula: {
                  type: 'string',
                  string: 'test-slug',
                },
              },
              category: {
                type: 'select',
                select: {
                  name: 'Tech',
                  color: 'blue',
                },
              },
              tag: {
                type: 'multi_select',
                multi_select: [{ name: 'React' }],
              },
              cover: {
                type: 'files',
                files: [
                  {
                    file: {
                      url: 'https://example.com/cover.jpg',
                    },
                  },
                ],
              },
              createdAt: {
                type: 'created_time',
                created_time: '2024-01-01T00:00:00.000Z',
              },
              lastEditedAt: {
                type: 'last_edited_time',
                last_edited_time: '2024-01-02T00:00:00.000Z',
              },
            },
            created_time: '2024-01-01T00:00:00.000Z',
            last_edited_time: '2024-01-02T00:00:00.000Z',
            cover: null,
          },
        ],
      };

      mockQuery.mockResolvedValue(mockResponse);

      const result = await getPostMeta('test-post');

      expect(result).toEqual({
        id: 'test-post',
        slug: 'test-slug',
        title: '테스트 포스트',
        description: '테스트 포스트 설명',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastEditedAt: '2024-01-02T00:00:00.000Z',
        category: {
          text: 'Tech',
          color: 'blue',
        },
        tags: ['React'],
        cover: 'https://example.com/cover.jpg',
      });
    });

    it('properties가 없는 페이지에 대해 null을 반환해야 한다', async () => {
      const { getPostMeta } = await import('@/libs/notion');

      // 빈 결과 반환
      const mockResponse = {
        results: [],
      };

      mockQuery.mockResolvedValue(mockResponse);

      const result = await getPostMeta('invalid-post');

      expect(result).toBeNull();
    });

    it('에러 발생시 null을 반환하고 에러를 로깅해야 한다', async () => {
      const { getPostMeta } = await import('@/libs/notion');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Notion API Error');

      mockQuery.mockRejectedValue(error);

      const result = await getPostMeta('error-post');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching post meta:', error);

      consoleErrorSpy.mockRestore();
    });

    it('빈 속성들을 기본값으로 처리해야 한다', async () => {
      const { getPostMeta } = await import('@/libs/notion');

      const mockResponse = {
        results: [
          {
            id: 'empty-post',
            properties: {
              title: {
                type: 'title',
                title: [],
              },
              description: {
                type: 'rich_text',
                rich_text: [],
              },
              slug: {
                type: 'formula',
                formula: { string: '' },
              },
              category: {
                type: 'select',
                select: null,
              },
              tags: {
                type: 'multi_select',
                multi_select: [],
              },
              cover: {
                type: 'files',
                files: [],
              },
            },
            created_time: '2024-01-01T00:00:00.000Z',
            last_edited_time: '2024-01-01T00:00:00.000Z',
            cover: null,
          },
        ],
      };

      mockQuery.mockResolvedValue(mockResponse);

      const result = await getPostMeta('empty-post');

      expect(result).toEqual({
        id: 'empty-post',
        slug: '',
        title: '',
        description: '',
        createdAt: '2024-01-01T00:00:00.000Z',
        lastEditedAt: '2024-01-01T00:00:00.000Z',
        category: {
          text: 'Uncategorized',
          color: 'gray',
        },
        tags: [],
        cover: '',
      });
    });

    it('페이지 커버 이미지를 올바르게 처리해야 한다', async () => {
      const { getPostMeta } = await import('@/libs/notion');

      const mockResponse = {
        results: [
          {
            id: 'cover-test',
            properties: {
              title: {
                type: 'title',
                title: [{ plain_text: '커버 테스트' }],
              },
              slug: {
                type: 'formula',
                formula: { string: 'cover-test' },
              },
              cover: {
                type: 'files',
                files: [], // 속성에는 커버가 없음
              },
            },
            created_time: '2024-01-01T00:00:00.000Z',
            last_edited_time: '2024-01-01T00:00:00.000Z',
            cover: {
              file: {
                url: 'https://example.com/page-cover.jpg',
              },
            },
          },
        ],
      };

      mockQuery.mockResolvedValue(mockResponse);

      const result = await getPostMeta('cover-test');

      expect(result?.cover).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('tag와 tags 속성을 모두 처리해야 한다', async () => {
      const { getPostList } = await import('@/libs/notion');

      const mockResponseWithTag = {
        results: [
          {
            id: 'post-with-tag',
            properties: {
              title: {
                type: 'title',
                title: [{ plain_text: 'Tag 테스트' }],
              },
              tag: {
                type: 'multi_select',
                multi_select: [{ name: 'Tag1' }, { name: 'Tag2' }],
              },
            },
            created_time: '2024-01-01T00:00:00.000Z',
            last_edited_time: '2024-01-01T00:00:00.000Z',
          } as unknown as PageObjectResponse,
        ],
      };

      mockQuery.mockResolvedValue(mockResponseWithTag);

      const result = await getPostList();
      expect(result[0].tags).toEqual(['Tag1', 'Tag2']);
    });

    it('유효하지 않은 색상을 기본값으로 처리해야 한다', async () => {
      const { getPostList } = await import('@/libs/notion');

      const mockResponse = {
        results: [
          {
            id: 'invalid-color',
            properties: {
              title: {
                type: 'title',
                title: [{ plain_text: '잘못된 색상 테스트' }],
              },
              category: {
                type: 'select',
                select: {
                  name: 'Test Category',
                  color: 'invalid-color' as unknown as 'blue',
                },
              },
            },
            created_time: '2024-01-01T00:00:00.000Z',
            last_edited_time: '2024-01-01T00:00:00.000Z',
          } as unknown as PageObjectResponse,
        ],
      };

      mockQuery.mockResolvedValue(mockResponse);

      const result = await getPostList();
      expect(result[0].category.color).toBe('gray');
    });
  });
});
