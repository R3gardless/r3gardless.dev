import { describe, expect, it } from 'vitest';

import type { PostMeta } from '@/types/blog';

import {
  createBlogFilterHref,
  createBlogPostHref,
  convertPostForRendering,
  convertPostsForRendering,
  findPostByEncodedSlug,
  findPostBySlug,
  formatPostDateTimeKST,
  getPostCategories,
  getPostTags,
  getTableOfContents,
  isAllPostsCategory,
} from '../../utils/blog';

const basePost = {
  pageId: 'published-note',
  id: 1,
  title: 'Published Note',
  description: 'Description',
  createdAt: 'Jun 21, 2026',
  category: {
    text: 'wiki',
    color: 'gray',
  },
  tags: ['kb'],
  slug: 'published-note',
  encodedSlug: 'published-note',
} satisfies PostMeta;

describe('Blog Utils', () => {
  describe('post rendering helpers', () => {
    it('PostMeta를 href가 있는 렌더링 데이터로 변환한다', () => {
      const result = convertPostForRendering(basePost);

      expect(result).toMatchObject({
        title: 'Published Note',
        href: '/blog/published-note',
      });
    });

    it('PostMeta 배열을 렌더링 데이터 배열로 변환한다', () => {
      const result = convertPostsForRendering([basePost]);

      expect(result).toHaveLength(1);
      expect(result[0].href).toBe('/blog/published-note');
    });

    it('slug와 encodedSlug로 포스트를 찾는다', () => {
      const encodedPost = {
        ...basePost,
        slug: '한글-제목',
        encodedSlug: '%ED%95%9C%EA%B8%80-%EC%A0%9C%EB%AA%A9',
      };

      expect(findPostBySlug([encodedPost], '한글-제목')).toBe(encodedPost);
      expect(findPostByEncodedSlug([encodedPost], encodedPost.encodedSlug)).toBe(encodedPost);
      expect(findPostByEncodedSlug([encodedPost], 'missing')).toBeNull();
    });

    it('블로그 포스트와 필터 URL을 기존 경로 형식으로 생성한다', () => {
      expect(createBlogPostHref({ slug: 'plain-slug' })).toBe('/blog/plain-slug');
      expect(createBlogPostHref({ slug: '한글-제목', encodedSlug: '%ED%95%9C%EA%B8%80' })).toBe(
        '/blog/%ED%95%9C%EA%B8%80',
      );
      expect(createBlogFilterHref('category', 'Vector Search')).toBe(
        '/blog/?category=Vector+Search',
      );
      expect(createBlogFilterHref('tags', 'Paper Review')).toBe('/blog/?tags=Paper+Review');
    });

    it('포스트 목록에서 전체 카테고리와 태그 필터 값을 파생한다', () => {
      const posts = [
        basePost,
        {
          ...basePost,
          id: 2,
          category: { text: 'report', color: 'blue' as const },
          tags: ['kb', 'report'],
        },
      ];

      expect(getPostCategories(posts)).toEqual(['전체', 'wiki', 'report']);
      expect(getPostTags(posts)).toEqual(['kb', 'report']);
      expect(isAllPostsCategory(undefined)).toBe(true);
      expect(isAllPostsCategory('전체')).toBe(true);
      expect(isAllPostsCategory('wiki')).toBe(false);
    });
  });

  describe('formatPostDateTimeKST', () => {
    it('UTC 날짜를 KST로 변환하여 올바른 형식으로 포맷팅한다', () => {
      const formatted = formatPostDateTimeKST('2025-08-09T16:22:00.000Z');

      expect(formatted).toBe('Aug 10, 2025');
    });

    it('잘못된 날짜는 원본 문자열을 반환한다', () => {
      const invalidDate = 'invalid-date';

      expect(formatPostDateTimeKST(invalidDate)).toBe(invalidDate);
    });
  });

  describe('getTableOfContents', () => {
    it('마크다운 h1~h2 heading만 계층형 목차로 추출한다', () => {
      const result = getTableOfContents(`# 첫 번째 헤더

본문

## 두 번째 헤더

### 세 번째 헤더

#### 제외되는 네 번째 헤더

## 두 번째 헤더
`);

      expect(result).toEqual([
        {
          id: '첫-번째-헤더',
          title: '첫 번째 헤더',
          level: 1,
          children: [
            {
              id: '두-번째-헤더',
              title: '두 번째 헤더',
              level: 2,
            },
            {
              id: '두-번째-헤더-1',
              title: '두 번째 헤더',
              level: 2,
            },
          ],
        },
      ]);
    });

    it('heading이 없으면 빈 배열을 반환한다', () => {
      expect(getTableOfContents('본문만 있는 문서입니다.')).toEqual([]);
    });
  });
});
