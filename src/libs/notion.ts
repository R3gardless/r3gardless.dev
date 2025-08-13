/**
 * 공식 Notion SDK를 사용한 API 클라이언트
 * Database 쿼리 및 메타데이터 조회용
 */
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { PostMeta } from '@/types/blog';
import { validateNotionColor } from '@/types/notion';
import { formatPostDate } from '@/utils/blog';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 환경 변수 검증
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
if (!NOTION_DATABASE_ID) {
  throw new Error('NOTION_DATABASE_ID environment variable is required');
}

// 검증된 환경 변수를 string 타입으로 단언
const databaseId: string = NOTION_DATABASE_ID;

/**
 * Notion Database에서 포스트 목록을 가져옵니다
 */
export async function getPostList(): Promise<PostMeta[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
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

  const posts = response.results
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

      const getSlug = () => {
        const slugProp = properties.slug;
        if (slugProp && slugProp.type === 'formula' && slugProp.formula.type === 'string') {
          const rawSlug = slugProp.formula.string || '';
          return rawSlug;
        }
        return '';
      };

      const getCover = () => {
        // 페이지 레벨의 cover 속성 확인 (이게 메인)
        if (page.cover) {
          if (page.cover.type === 'external') {
            return page.cover.external?.url || '';
          }
          if (page.cover.type === 'file') {
            return page.cover.file?.url || '';
          }
        }

        // properties의 cover 속성도 확인 (백업)
        const coverProp = properties.cover;
        if (coverProp && coverProp.type === 'files' && coverProp.files[0]) {
          const file = coverProp.files[0];
          if ('file' in file) {
            return file.file.url || '';
          }
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

      const getId = () => {
        const idProp = properties.id;
        if (idProp && idProp.type === 'unique_id' && idProp.unique_id) {
          return idProp.unique_id.number || -1;
        }
        return 0;
      };

      return {
        pageId: page.id,
        id: getId(),
        title: getTitle(),
        description: getDescription(),
        createdAt: formatPostDate(getCreatedAt()), // 날짜 포맷 자동 변환
        lastEditedAt: formatPostDate(getLastEditedAt()), // 날짜 포맷 자동 변환
        category: getCategory(),
        tags: getTags(),
        slug: getSlug(),
        cover: getCover(),
      } satisfies PostMeta;
    });

  return posts;
}

/**
 * 특정 포스트의 메타데이터를 가져옵니다
 */
export async function getPostMeta(pageId: string): Promise<PostMeta | null> {
  try {
    const allPosts = await getPostList();
    return allPosts.find(post => post.pageId === pageId) || null;
  } catch (error) {
    console.error('Error fetching post meta:', error);
    return null;
  }
}

export { notion };
