/**
 * 공식 Notion SDK를 사용한 API 클라이언트
 * Database 쿼리 및 메타데이터 조회용
 */
import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { UNTITLED_FALLBACK_TITLE } from '@/constants';
import { PostMeta } from '@/types/blog';
import { validateNotionColor } from '@/types/notion';
import { formatPostDateTimeKST } from '@/utils/blog';

// 환경 변수 검증
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY environment variable is required');
}

if (!NOTION_DATABASE_ID) {
  throw new Error('NOTION_DATABASE_ID environment variable is required');
}

// Notion Client 초기화 (API v5 - 2025-09-03)
const notion = new Client({
  auth: NOTION_API_KEY,
  notionVersion: '2025-09-03', // API v5 버전 명시
});

// 검증된 환경 변수를 string 타입으로 단언
const databaseId: string = NOTION_DATABASE_ID;

// 데이터소스 ID 캐시 (API v5에서 필요)
let cachedDataSourceId: string | null = null;

/**
 * Notion API v5에서 필요한 data_source_id를 가져옵니다.
 *
 * **배경:**
 * - API v5부터 하나의 database가 여러 개의 data source를 가질 수 있음 (multi-source databases)
 * - database = 데이터 컨테이너, data source = 실제 데이터가 저장된 공간
 * - 쿼리 시 "어떤 database의 어느 data source"인지 명시 필요
 *
 * **동작:**
 * 1. 환경변수의 NOTION_DATABASE_ID로 database 정보 조회
 * 2. database에 속한 data_sources 배열에서 첫 번째 항목의 ID 추출
 * 3. 추출한 data_source_id를 캐싱하여 재사용 (성능 최적화)
 *
 * **호환성:**
 * - 기존 코드는 NOTION_DATABASE_ID만 사용하고 있음
 * - 이 함수가 내부적으로 database_id → data_source_id 변환 처리
 * - 다른 코드 수정 없이 API v5 스펙 준수 가능
 *
 * @returns {Promise<string>} 첫 번째 data source의 ID
 * @throws {Error} data source를 찾을 수 없거나 API 호출 실패 시
 */
async function getDataSourceId(): Promise<string> {
  if (cachedDataSourceId) {
    return cachedDataSourceId;
  }

  try {
    // API v5: GET /v1/databases/:database_id로 data_sources 목록 조회
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });

    // v5에서는 data_sources 배열이 반환됨
    if ('data_sources' in response && Array.isArray(response.data_sources)) {
      const dataSources = response.data_sources as Array<{ id: string; name: string }>;
      if (dataSources.length > 0) {
        cachedDataSourceId = dataSources[0].id;
        return cachedDataSourceId;
      }
    }

    throw new Error('No data sources found for the database');
  } catch (error) {
    console.error('Failed to get data source ID:', error);
    throw error;
  }
}

/**
 * Notion Database에서 포스트 목록을 가져옵니다
 * API v5: dataSources.query 사용
 */
export async function getPostList(): Promise<PostMeta[]> {
  // API v5에서는 data_source_id가 필요함
  const dataSourceId = await getDataSourceId();

  // API v5: /v1/data_sources/:data_source_id/query
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
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
          return titleProp.title[0].plain_text.trim() || UNTITLED_FALLBACK_TITLE; // 제목이 없으면 기본값 사용
        }
        return UNTITLED_FALLBACK_TITLE; // 제목이 없으면 기본값 사용
      };

      const getDescription = () => {
        const descProp = properties.description;
        if (descProp && descProp.type === 'rich_text' && descProp.rich_text[0]) {
          return descProp.rich_text[0].plain_text.trim() || '';
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
        createdAt: formatPostDateTimeKST(getCreatedAt()), // 날짜 포맷 자동 변환
        lastEditedAt: formatPostDateTimeKST(getLastEditedAt()), // 날짜 포맷 자동 변환
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
