/**
 * 공식 Notion SDK를 사용한 API 클라이언트
 * Database 쿼리 및 메타데이터 조회용
 */
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { PostMeta } from '@/types/blog';
import { validateNotionColor } from '@/types/notion';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error(
    'Environment variable NOTION_DATABASE_ID is not defined. Please set it in your environment.',
  );
}
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

/**
 * Notion Database에서 포스트 목록을 가져옵니다
 */
export async function getPostList(): Promise<PostMeta[]> {
  const response = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
    filter: {
      property: 'isPublished',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'createdAt',
        direction: 'descending',
      },
    ],
  });

  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(page => {
      const properties = page.properties;

      // 안전한 타입 접근을 위한 헬퍼 함수들
      const getTitle = () => {
        const titleProp = properties.title;
        if (titleProp && titleProp.type === 'title' && titleProp.title[0]) {
          return titleProp.title[0].plain_text || '';
        }
        return '';
      };

      const getDescription = () => {
        const descProp = properties.description;
        if (descProp && descProp.type === 'rich_text' && descProp.rich_text[0]) {
          return descProp.rich_text[0].plain_text || '';
        }
        return '';
      };

      const getCategory = () => {
        const catProp = properties.category;
        if (catProp && catProp.type === 'select' && catProp.select) {
          return {
            text: catProp.select.name,
            color: validateNotionColor(catProp.select.color),
          };
        }
        return { text: 'Uncategorized', color: validateNotionColor(undefined) };
      };

      const getTags = () => {
        // 'tag' 또는 'tags' 속성 확인
        const tagProp = properties.tag || properties.tags;
        if (tagProp && tagProp.type === 'multi_select') {
          return tagProp.multi_select.map(tag => tag.name);
        }
        return [];
      };

      const getCover = () => {
        const coverProp = properties.cover;
        if (coverProp && coverProp.type === 'files' && coverProp.files[0]) {
          const file = coverProp.files[0];
          if ('file' in file) {
            return file.file.url || '';
          }
        }
        if (page.cover && 'file' in page.cover) {
          return page.cover.file?.url || '';
        }
        return '';
      };

      const getCreatedAt = () => {
        const createdProp = properties.createdAt;
        if (createdProp && createdProp.type === 'created_time') {
          return createdProp.created_time;
        }
        return page.created_time;
      };

      const getLastEditedAt = () => {
        const editedProp = properties.lastEditedAt;
        if (editedProp && editedProp.type === 'last_edited_time') {
          return editedProp.last_edited_time;
        }
        return page.last_edited_time;
      };

      return {
        id: page.id,
        title: getTitle(),
        description: getDescription(),
        createdAt: getCreatedAt(),
        lastEditedAt: getLastEditedAt(),
        category: getCategory(),
        tags: getTags(),
        cover: getCover(),
      } satisfies PostMeta;
    });
}

/**
 * 특정 포스트의 메타데이터를 가져옵니다
 */
export async function getPostMeta(pageId: string): Promise<PostMeta | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });

    if (!('properties' in page)) {
      return null;
    }

    const properties = page.properties;

    // 안전한 타입 접근을 위한 헬퍼 함수들
    const getTitle = () => {
      const titleProp = properties.title;
      if (titleProp && titleProp.type === 'title' && titleProp.title[0]) {
        return titleProp.title[0].plain_text || '';
      }
      return '';
    };

    const getDescription = () => {
      const descProp = properties.description;
      if (descProp && descProp.type === 'rich_text' && descProp.rich_text[0]) {
        return descProp.rich_text[0].plain_text || '';
      }
      return '';
    };

    const getCategory = () => {
      const catProp = properties.category;
      if (catProp && catProp.type === 'select' && catProp.select) {
        return {
          text: catProp.select.name,
          color: validateNotionColor(catProp.select.color),
        };
      }
      return { text: 'Uncategorized', color: validateNotionColor(undefined) };
    };

    const getTags = () => {
      const tagProp = properties.tag || properties.tags;
      if (tagProp && tagProp.type === 'multi_select') {
        return tagProp.multi_select.map(tag => tag.name);
      }
      return [];
    };

    const getCover = () => {
      const coverProp = properties.cover;
      if (coverProp && coverProp.type === 'files' && coverProp.files[0]) {
        const file = coverProp.files[0];
        if ('file' in file) {
          return file.file.url || '';
        }
      }
      if (page.cover && 'file' in page.cover) {
        return page.cover.file?.url || '';
      }
      return '';
    };

    const getCreatedAt = () => {
      const createdProp = properties.createdAt;
      if (createdProp && createdProp.type === 'created_time') {
        return createdProp.created_time;
      }
      return page.created_time;
    };

    const getLastEditedAt = () => {
      const editedProp = properties.lastEditedAt;
      if (editedProp && editedProp.type === 'last_edited_time') {
        return editedProp.last_edited_time;
      }
      return page.last_edited_time;
    };

    return {
      id: page.id,
      title: getTitle(),
      description: getDescription(),
      createdAt: getCreatedAt(),
      lastEditedAt: getLastEditedAt(),
      category: getCategory(),
      tags: getTags(),
      cover: getCover(),
    } satisfies PostMeta;
  } catch (error) {
    console.error('Error fetching post meta:', error);
    return null;
  }
}

export { notion };
