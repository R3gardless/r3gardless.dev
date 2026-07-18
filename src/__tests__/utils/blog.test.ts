import { describe, expect, it } from 'vitest';

import type { PostMeta } from '@/types/blog';

import {
  blogLangPathPrefix,
  createBlogFilterHref,
  createBlogListHref,
  createBlogPostHref,
  convertPostForRendering,
  convertPostsForRendering,
  findPostByEncodedSlug,
  findPostBySlug,
  formatPostDateTimeKST,
  getPostCategories,
  getPostLanguages,
  getPostSeriesList,
  getPostTags,
  getSeriesPosts,
  getTableOfContents,
  isAllPostsCategory,
  localizePostMeta,
} from '../../utils/blog';

const basePost = {
  pageId: '2026-06-21-published-note',
  id: 1,
  title: 'Published Note',
  description: 'Description',
  createdAt: 'Jun 21, 2026',
  category: {
    text: 'wiki',
    color: 'gray',
  },
  tags: ['kb'],
  slug: '2026-06-21-published-note',
  encodedSlug: '2026-06-21-published-note',
} satisfies PostMeta;

describe('Blog Utils', () => {
  describe('post rendering helpers', () => {
    it('PostMeta를 href가 있는 렌더링 데이터로 변환한다', () => {
      const result = convertPostForRendering(basePost);

      expect(result).toMatchObject({
        title: 'Published Note',
        href: '/blog/2026-06-21-published-note',
      });
    });

    it('PostMeta 배열을 렌더링 데이터 배열로 변환한다', () => {
      const result = convertPostsForRendering([basePost]);

      expect(result).toHaveLength(1);
      expect(result[0].href).toBe('/blog/2026-06-21-published-note');
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

  describe('getSeriesPosts', () => {
    const seriesPost = (id: number, createdAt: string, series?: PostMeta['series']): PostMeta => ({
      ...basePost,
      id,
      slug: `post-${id}`,
      encodedSlug: `post-${id}`,
      createdAt,
      series,
    });

    it('같은 시리즈의 포스트만 골라 작성일 오름차순으로 정렬한다', () => {
      const posts = [
        seriesPost(1, '2026-03-01', { name: 'A 시리즈' }),
        seriesPost(2, '2026-01-01', { name: 'A 시리즈' }),
        seriesPost(3, '2026-02-01', { name: 'B 시리즈' }),
        seriesPost(4, '2026-02-01'),
      ];

      expect(getSeriesPosts(posts, 'A 시리즈').map(p => p.id)).toEqual([2, 1]);
    });

    it('series.order가 있으면 order 오름차순을 우선한다', () => {
      const posts = [
        seriesPost(1, '2026-01-01', { name: 'A 시리즈', order: 3 }),
        seriesPost(2, '2026-02-01', { name: 'A 시리즈', order: 1 }),
        seriesPost(3, '2026-03-01', { name: 'A 시리즈', order: 2 }),
      ];

      expect(getSeriesPosts(posts, 'A 시리즈').map(p => p.id)).toEqual([2, 3, 1]);
    });

    it('order가 있는 포스트를 order가 없는 포스트보다 앞에 둔다', () => {
      const posts = [
        seriesPost(1, '2026-01-01', { name: 'A 시리즈' }),
        seriesPost(2, '2026-02-01', { name: 'A 시리즈', order: 1 }),
      ];

      expect(getSeriesPosts(posts, 'A 시리즈').map(p => p.id)).toEqual([2, 1]);
    });

    it('포스트 목록에서 시리즈 요약 목록을 파생한다', () => {
      const posts = [
        seriesPost(1, '2026-01-01', { name: 'A 시리즈' }),
        seriesPost(2, '2026-02-01', { name: 'B 시리즈' }),
        seriesPost(3, '2026-03-01', { name: 'A 시리즈' }),
        seriesPost(4, '2026-04-01'),
      ];

      expect(getPostSeriesList(posts)).toEqual([
        { name: 'A 시리즈', count: 2 },
        { name: 'B 시리즈', count: 1 },
      ]);
    });
  });

  describe('multilingual helpers', () => {
    const translatedPost = {
      ...basePost,
      languages: ['kr', 'en'] as PostMeta['languages'],
      translations: {
        en: { title: 'Published Note (EN)', description: 'English description' },
      },
    } satisfies PostMeta;

    it('언어별 블로그 경로 prefix와 목록 경로를 생성한다', () => {
      expect(blogLangPathPrefix('kr')).toBe('');
      expect(blogLangPathPrefix('en')).toBe('/en');
      expect(blogLangPathPrefix('ja')).toBe('/ja');
      expect(createBlogListHref()).toBe('/blog');
      expect(createBlogListHref('en')).toBe('/en/blog');
      expect(createBlogListHref('ja')).toBe('/ja/blog');
    });

    it('언어별 포스트 href를 생성한다', () => {
      expect(createBlogPostHref(basePost, 'en')).toBe('/en/blog/2026-06-21-published-note');
      expect(createBlogPostHref(basePost, 'ja')).toBe('/ja/blog/2026-06-21-published-note');
      expect(convertPostForRendering(basePost, 'en').href).toBe(
        '/en/blog/2026-06-21-published-note',
      );
    });

    it('languages가 없으면 kr 전용으로 간주한다', () => {
      const krOnlyPost: PostMeta = basePost;

      expect(getPostLanguages(krOnlyPost)).toEqual(['kr']);
      expect(getPostLanguages({ languages: [] })).toEqual(['kr']);
      expect(getPostLanguages(translatedPost)).toEqual(['kr', 'en']);
    });

    it('번역이 있으면 title/description을 치환하고 없으면 kr 원문을 유지한다', () => {
      const localized = localizePostMeta(translatedPost, 'en');

      expect(localized.title).toBe('Published Note (EN)');
      expect(localized.description).toBe('English description');
      expect(localizePostMeta(translatedPost, 'kr')).toBe(translatedPost);
      expect(localizePostMeta(translatedPost, 'ja')).toBe(translatedPost);
      expect(localizePostMeta(basePost, 'en')).toBe(basePost);
    });

    it('번역 seriesName이 있으면 시리즈 표시 이름을 치환한다', () => {
      const seriesPost = {
        ...translatedPost,
        series: { name: 'ANN 논문 리뷰', order: 1 },
        translations: {
          en: {
            title: 'Published Note (EN)',
            seriesName: 'ANN Paper Review',
          },
        },
      } satisfies PostMeta;

      expect(localizePostMeta(seriesPost, 'en').series).toEqual({
        name: 'ANN Paper Review',
        order: 1,
      });
      // seriesName이 없는 번역은 kr 시리즈 이름을 유지한다
      expect(localizePostMeta(translatedPost, 'en').series).toBeUndefined();
      expect(localizePostMeta(seriesPost, 'kr').series).toEqual({
        name: 'ANN 논문 리뷰',
        order: 1,
      });
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
