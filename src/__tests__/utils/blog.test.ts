import { describe, it, expect, vi } from 'vitest';

import { formatPostDateTimeKST, getTableOfContents } from '../../utils/blog';

// Mock notion-utils
vi.mock('notion-utils', () => ({
  getTextContent: vi.fn(textArray => {
    if (!textArray || !Array.isArray(textArray) || textArray.length === 0) {
      return '';
    }
    return textArray
      .map(item => {
        if (typeof item === 'string') return item;
        if (Array.isArray(item) && item.length > 0) return item[0];
        return '';
      })
      .join('');
  }),
}));

describe('Blog Utils', () => {
  describe('formatPostDateTimeKST', () => {
    it('UTC 날짜를 KST로 변환하여 올바른 형식으로 포맷팅한다', () => {
      const utcDate = '2025-08-09T16:22:00.000Z';
      const formatted = formatPostDateTimeKST(utcDate);

      // "Aug 10, 2025" 형식 확인
      expect(formatted).toMatch(/^[A-Za-z]{3} \d{2}, \d{4}$/);
    });

    it('잘못된 날짜는 원본 문자열을 반환한다', () => {
      const invalidDate = 'invalid-date';
      const formatted = formatPostDateTimeKST(invalidDate);

      expect(formatted).toBe(invalidDate);
    });

    it('UTC 시간이 다음날로 넘어가는 경우 올바르게 변환한다', () => {
      // UTC 16:22는 KST 01:22 (다음날)
      const utcDate = '2025-08-09T16:22:00.000Z';
      const formatted = formatPostDateTimeKST(utcDate);

      // 날짜가 Aug 10으로 변경되는지 확인
      expect(formatted).toContain('Aug 10, 2025');
    });
  });

  describe('getTableOfContents', () => {
    it('헤더 블록들을 올바르게 추출한다', () => {
      const mockPageBlock = {
        id: 'page-id',
        type: 'page',
        content: ['header1', 'text-1', 'subheader1', 'text-2', 'subsubheader1'],
      } as unknown as Parameters<typeof getTableOfContents>[0];

      const mockRecordMap = {
        block: {
          'page-id': {
            role: 'reader',
            value: mockPageBlock,
          },
          header1: {
            role: 'reader',
            value: {
              id: 'header1',
              type: 'header',
              properties: {
                title: [['첫 번째 헤더']],
              },
            },
          },
          'text-1': {
            role: 'reader',
            value: {
              id: 'text-1',
              type: 'text',
              properties: {
                title: [['일반 텍스트']],
              },
            },
          },
          subheader1: {
            role: 'reader',
            value: {
              id: 'subheader1',
              type: 'sub_header',
              properties: {
                title: [['두 번째 헤더']],
              },
            },
          },
          'text-2': {
            role: 'reader',
            value: {
              id: 'text-2',
              type: 'text',
              properties: {
                title: [['또 다른 텍스트']],
              },
            },
          },
          subsubheader1: {
            role: 'reader',
            value: {
              id: 'subsubheader1',
              type: 'sub_sub_header',
              properties: {
                title: [['세 번째 헤더']],
              },
            },
          },
        },
        collection: {},
        collection_view: {},
        notion_user: {},
        collection_query: {},
        signed_urls: {},
      } as unknown as Parameters<typeof getTableOfContents>[1];

      const result = getTableOfContents(mockPageBlock, mockRecordMap);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'header1',
        title: '첫 번째 헤더',
        level: 1,
        children: [
          {
            id: 'subheader1',
            title: '두 번째 헤더',
            level: 2,
            children: [
              {
                id: 'subsubheader1',
                title: '세 번째 헤더',
                level: 3,
              },
            ],
          },
        ],
      });
    });

    it('헤더가 없는 경우 빈 배열을 반환한다', () => {
      const emptyPageBlock = {
        id: 'empty-page',
        type: 'page',
        content: ['text-only'],
      } as unknown as Parameters<typeof getTableOfContents>[0];

      const emptyRecordMap = {
        block: {
          'empty-page': {
            role: 'reader',
            value: emptyPageBlock,
          },
          'text-only': {
            role: 'reader',
            value: {
              id: 'text-only',
              type: 'text',
              properties: {
                title: [['텍스트만 있음']],
              },
            },
          },
        },
        collection: {},
        collection_view: {},
        notion_user: {},
        collection_query: {},
        signed_urls: {},
      } as unknown as Parameters<typeof getTableOfContents>[1];

      const result = getTableOfContents(emptyPageBlock, emptyRecordMap);

      expect(result).toEqual([]);
    });

    it('content가 없는 페이지는 빈 배열을 반환한다', () => {
      const pageWithoutContent = {
        id: 'no-content-page',
        type: 'page',
      } as unknown as Parameters<typeof getTableOfContents>[0];

      const mockRecordMap = {
        block: {},
        collection: {},
        collection_view: {},
        notion_user: {},
        collection_query: {},
        signed_urls: {},
      } as unknown as Parameters<typeof getTableOfContents>[1];

      const result = getTableOfContents(pageWithoutContent, mockRecordMap);

      expect(result).toEqual([]);
    });

    it('단일 레벨 헤더들을 처리한다', () => {
      const singleLevelPage = {
        id: 'single-level',
        type: 'page',
        content: ['headera', 'headerb', 'headerc'],
      } as unknown as Parameters<typeof getTableOfContents>[0];

      const singleLevelRecordMap = {
        block: {
          'single-level': {
            role: 'reader',
            value: singleLevelPage,
          },
          headera: {
            role: 'reader',
            value: {
              id: 'headera',
              type: 'header',
              properties: {
                title: [['헤더 A']],
              },
            },
          },
          headerb: {
            role: 'reader',
            value: {
              id: 'headerb',
              type: 'header',
              properties: {
                title: [['헤더 B']],
              },
            },
          },
          headerc: {
            role: 'reader',
            value: {
              id: 'headerc',
              type: 'header',
              properties: {
                title: [['헤더 C']],
              },
            },
          },
        },
        collection: {},
        collection_view: {},
        notion_user: {},
        collection_query: {},
        signed_urls: {},
      } as unknown as Parameters<typeof getTableOfContents>[1];

      const result = getTableOfContents(singleLevelPage, singleLevelRecordMap);

      expect(result).toEqual([
        {
          id: 'headera',
          title: '헤더 A',
          level: 1,
        },
        {
          id: 'headerb',
          title: '헤더 B',
          level: 1,
        },
        {
          id: 'headerc',
          title: '헤더 C',
          level: 1,
        },
      ]);
    });
  });
});
