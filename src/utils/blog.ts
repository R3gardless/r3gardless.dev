import { getTextContent } from 'notion-utils';
import { ExtendedRecordMap, PageBlock } from 'notion-types';

import { PostMeta, TableOfContentsItem } from '@/types/blog';
import { PostCardProps } from '@/components/ui/blog/PostCard';
import { PostRowProps } from '@/components/ui/blog/PostRow';

/**
 * PostMeta를 렌더링 가능한 포스트 데이터로 변환합니다
 * 날짜를 포맷팅하고 URL-safe href를 생성합니다
 */
export function convertPostForRendering<T extends PostCardProps | PostRowProps>(post: PostMeta): T {
  return {
    ...post,
    href: `/blog/${post.slug}`, // 이미 인코딩된 slug 사용
  } as T;
}

/**
 * PostMeta 배열을 렌더링 가능한 포스트 배열로 변환합니다
 */
export function convertPostsForRendering<T extends PostCardProps | PostRowProps>(
  posts: PostMeta[],
): T[] {
  return posts.map(post => convertPostForRendering<T>(post));
}

/**
 * ISO 날짜 문자열을 KST 시간대로 변환하여 전체 날짜와 시간을 포맷팅합니다
 * Notion에서 넘어오는 UTC 시간을 한국 시간으로 변환합니다
 * 예: "Jan 02, 2025"
 */
export function formatPostDateTimeKST(dateString: string): string {
  const date = new Date(dateString);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return dateString; // 원본 문자열 반환
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  });
}

/**
 * PostMeta 배열에서 slug에 해당하는 포스트를 찾습니다
 */
export function findPostBySlug(posts: PostMeta[], slug: string): PostMeta | null {
  return posts.find(post => post.slug === slug) ?? null;
}

/**
 * PostMeta 배열에서 인코딩된 slug에 해당하는 포스트를 찾습니다
 * 인코딩된 slug는 URL-safe 형태로 저장되어 있음
 */
export function findPostByEncodedSlug(posts: PostMeta[], encodedSlug: string): PostMeta | null {
  return posts.find(post => post.encodedSlug === encodedSlug) ?? null;
}

/**
 * Notion 페이지에서 목차를 생성합니다
 * H1(header), H2(sub_header), H3(sub_sub_header) 블록을 파싱하여 계층 구조를 생성합니다
 */
export function getTableOfContents(
  page: PageBlock,
  recordMap: ExtendedRecordMap,
): TableOfContentsItem[] {
  // 헤더 타입별 레벨 매핑
  const indentLevels = {
    header: 1,
    sub_header: 2,
    sub_sub_header: 3,
  } as const;

  type MapResult = { id: string; title: string; level: 1 | 2 | 3 } | null | MapResult[];

  // content 배열을 목차 항목으로 변환
  function mapContentToEntries(content?: string[]): MapResult[] {
    return (content ?? []).map((blockId: string) => {
      const block = recordMap.block[blockId]?.value;

      if (block) {
        const { type } = block;

        if (type === 'header' || type === 'sub_header' || type === 'sub_sub_header') {
          return {
            id: blockId.replace(/-/g, ''), // Notion 렌더링에서 하이픈이 제거되므로 ToC ID도 하이픈 제거
            title: getTextContent(block.properties?.title) || 'Untitled',
            level: indentLevels[type],
          };
        }

        // transclusion_container (동기화된 블록)도 처리
        if (type === 'transclusion_container') {
          return mapContentToEntries(block.content);
        }
      }

      return null;
    });
  }

  // 플랫 구조로 헤더들을 추출
  const flatHeaders = mapContentToEntries(page.content).flat().filter(Boolean) as Array<{
    id: string;
    title: string;
    level: 1 | 2 | 3;
  }>;

  // 계층 구조로 변환
  const buildHierarchy = (
    headers: Array<{ id: string; title: string; level: 1 | 2 | 3 }>,
    startIndex = 0,
    parentLevel = 0,
  ): TableOfContentsItem[] => {
    const result: TableOfContentsItem[] = [];
    let i = startIndex;

    while (i < headers.length) {
      const header = headers[i];

      if (header.level <= parentLevel) {
        // 상위 레벨이면 재귀 종료
        break;
      }

      const item: TableOfContentsItem = {
        id: header.id,
        title: header.title,
        level: header.level,
      };

      // 다음 헤더들 중에서 현재 헤더의 자식들을 찾기
      const nextIndex = i + 1;
      if (nextIndex < headers.length && headers[nextIndex].level > header.level) {
        const { children, nextSiblingIndex } = buildHierarchyHelper(
          headers,
          nextIndex,
          header.level,
        );
        if (children.length > 0) {
          item.children = children;
        }
        i = nextSiblingIndex;
      } else {
        i++;
      }

      result.push(item);
    }

    return result;
  };

  // 자식 노드들과 다음 형제 노드의 인덱스를 반환하는 헬퍼 함수
  function buildHierarchyHelper(
    headers: Array<{ id: string; title: string; level: 1 | 2 | 3 }>,
    startIndex: number,
    parentLevel: number,
  ): { children: TableOfContentsItem[]; nextSiblingIndex: number } {
    const children: TableOfContentsItem[] = [];
    let i = startIndex;

    while (i < headers.length) {
      const header = headers[i];

      if (header.level <= parentLevel) {
        // 상위 레벨이면 중단
        break;
      }

      if (header.level === parentLevel + 1) {
        // 직접 자식
        const item: TableOfContentsItem = {
          id: header.id,
          title: header.title,
          level: header.level,
        };

        // 손자 노드들 확인
        const nextIndex = i + 1;
        if (nextIndex < headers.length && headers[nextIndex].level > header.level) {
          const { children: grandchildren, nextSiblingIndex } = buildHierarchyHelper(
            headers,
            nextIndex,
            header.level,
          );
          if (grandchildren.length > 0) {
            item.children = grandchildren;
          }
          i = nextSiblingIndex;
        } else {
          i++;
        }

        children.push(item);
      } else {
        // 레벨이 건너뛰었거나 더 깊은 경우 다음으로
        i++;
      }
    }

    return { children, nextSiblingIndex: i };
  }

  return buildHierarchy(flatHeaders);
}
