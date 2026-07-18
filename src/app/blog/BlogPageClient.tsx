'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useMemo, Suspense, useEffect, startTransition } from 'react';

import { BlogTemplate } from '@/components/templates/BlogTemplate';
import type { PostRowProps } from '@/components/ui/blog/PostRow';
import { BLOG_POSTS_PER_PAGE } from '@/constants/blog';
import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang, PostMeta } from '@/types/blog';
import { convertPostsForRendering, createBlogListHref, isAllPostsCategory } from '@/utils/blog';
import type { SeriesSummary } from '@/utils/blog';
import { filterPostsBySearch } from '@/utils/search';

interface BlogPageClientProps {
  initialPosts: PostMeta[];
  initialCategories: string[];
  /** 사이드바에 표시할 시리즈 목록. 비어 있으면 시리즈 섹션을 숨깁니다. */
  initialSeries?: SeriesSummary[];
  initialTags: string[];
  /** 목록 언어. en/ja이면 포스트 링크와 URL 갱신이 언어 라우트를 사용합니다. */
  lang?: PostLang;
}

/**
 * 블로그 페이지 클라이언트 컴포넌트
 * 정적 데이터를 받아서 클라이언트에서 필터링/검색 수행
 */
function BlogPageContent({
  initialPosts,
  initialCategories,
  initialSeries = [],
  initialTags,
  lang = DEFAULT_POST_LANG,
}: BlogPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 상태 관리 - 서버 초기 렌더링과 클라이언트 hydration 시 URL 파라미터 차이로 인한
  // hydration 불일치를 막기 위해, 초기값은 항상 빈 값으로 두고 useEffect에서 URL 기반으로 갱신
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedSeries, setSelectedSeries] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);

  const postsPerPage = BLOG_POSTS_PER_PAGE;

  // Hydration 완료 후 URL 파라미터에서 초기값 설정
  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';
    const urlCategory = searchParams.get('category') ?? undefined;
    const urlSeries = searchParams.get('series') ?? undefined;
    const urlTags = searchParams.get('tags')?.split(',').filter(Boolean) ?? [];

    startTransition(() => {
      setSearchValue(urlSearch);
      setSelectedCategory(urlCategory);
      setSelectedSeries(urlSeries);
      setSelectedTags(urlTags);
      setIsHydrated(true);
    });
  }, [searchParams]);

  // 필터링 및 정렬된 포스트 목록
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = initialPosts;

    // 검색 필터링
    if (searchValue.trim()) {
      filtered = filterPostsBySearch(filtered, searchValue);
    }

    // 카테고리 필터링
    if (!isAllPostsCategory(selectedCategory)) {
      filtered = filtered.filter(post => post.category.text === selectedCategory);
    }

    // 시리즈 필터링
    if (selectedSeries) {
      filtered = filtered.filter(post => post.series?.name === selectedSeries);
    }

    // 태그 필터링
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(selectedTag => post.tags.includes(selectedTag)),
      );
    }

    // 정렬
    filtered = [...filtered].sort((a, b) => {
      const idA = a.id;
      const idB = b.id;
      return sortDirection === 'desc' ? idB - idA : idA - idB;
    });

    return filtered;
  }, [initialPosts, searchValue, selectedCategory, selectedSeries, selectedTags, sortDirection]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredAndSortedPosts.slice(startIndex, endIndex);
  }, [filteredAndSortedPosts, currentPage, postsPerPage]);

  // URL 업데이트 함수
  const updateURL = (params: {
    search?: string;
    category?: string;
    series?: string;
    tags?: string[];
  }) => {
    if (!isHydrated) return;

    const newParams = new URLSearchParams();

    if (params.search) {
      newParams.set('search', params.search);
    }

    const category = params.category;
    if (category && !isAllPostsCategory(category)) {
      newParams.set('category', category);
    }

    if (params.series) {
      newParams.set('series', params.series);
    }

    if (params.tags && params.tags.length > 0) {
      newParams.set('tags', params.tags.join(','));
    }

    const queryString = newParams.toString();
    const newURL = `${createBlogListHref(lang)}${queryString ? '?' + queryString : ''}`;
    router.replace(newURL, { scroll: false });
  };

  // 이벤트 핸들러들
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    updateURL({
      search: searchValue,
      category: selectedCategory,
      series: selectedSeries,
      tags: selectedTags,
    });
  };

  const handleCategoryClick = (category: string) => {
    const newCategory = category === selectedCategory ? undefined : category;
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    setSearchValue('');
    setSelectedSeries(undefined);
    setSelectedTags([]);
    updateURL({ search: undefined, category: newCategory, tags: [] });
  };

  const handleSeriesClick = (seriesName: string) => {
    // 선택된 시리즈를 다시 클릭하면 해제
    const newSeries = seriesName === selectedSeries ? undefined : seriesName;
    setSelectedSeries(newSeries);
    setCurrentPage(1);
    setSearchValue('');
    setSelectedCategory(undefined);
    setSelectedTags([]);
    updateURL({ search: undefined, series: newSeries, tags: [] });
  };

  const handleTagClick = (tag: string) => {
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter(t => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    setSelectedTags(newTags);
    setCurrentPage(1);
    updateURL({
      search: searchValue,
      category: selectedCategory,
      series: selectedSeries,
      tags: newTags,
    });
  };

  const handlePostTagClick = (tag: string) => {
    const newTags = [tag];
    setSelectedTags(newTags);
    setCurrentPage(1);
    updateURL({ search: searchValue, category: undefined, tags: newTags });
    setSelectedCategory(undefined);
    setSelectedSeries(undefined);
  };

  const handleTagRemove = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    updateURL({
      search: searchValue,
      category: selectedCategory,
      series: selectedSeries,
      tags: newTags,
    });
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
    updateURL({
      search: searchValue,
      category: selectedCategory,
      series: selectedSeries,
      tags: [],
    });
  };

  const handleSortChange = (sortBy: 'id', direction: 'asc' | 'desc') => {
    setSortDirection(direction);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Hydration 전에는 기본 상태로 렌더링
  if (!isHydrated) {
    return (
      <BlogTemplate
        header={{
          searchValue: '',
          selectedCategory: undefined,
          selectedTags: [],
          onSearchChange: () => {},
          onSearch: () => {},
          isSearchLoading: false,
        }}
        sidebar={{
          categories: initialCategories,
          series: initialSeries,
          tags: initialTags,
          selectedCategory: undefined,
          selectedSeries: undefined,
          selectedTags: [],
          lang,
          showMoreCategories: true,
          showMoreTags: true,
          isHidden: false,
          onCategoryClick: () => {},
          onMoreCategoriesClick: () => {},
          onSeriesClick: () => {},
          onTagClick: () => {},
          onTagRemove: () => {},
          onMoreTagsClick: () => {},
          onClearAllTags: () => {},
        }}
        posts={{
          posts: convertPostsForRendering<PostRowProps>(initialPosts.slice(0, postsPerPage), lang),
          currentPage: 1,
          totalPages: Math.ceil(initialPosts.length / postsPerPage),
          lang,
          showSort: true,
          sortDirection: 'desc',
          isLoading: false,
          emptyMessage: '',
          onPageChange: () => {},
          onSortChange: () => {},
          onCategoryClick: () => {},
          onTagClick: () => {},
        }}
      />
    );
  }

  // PostRow용으로 변환
  const postRows = convertPostsForRendering<PostRowProps>(paginatedPosts, lang);

  return (
    <BlogTemplate
      header={{
        searchValue,
        selectedCategory,
        selectedSeries,
        selectedTags,
        onSearchChange: handleSearchChange,
        onSearch: handleSearch,
        isSearchLoading: false,
      }}
      sidebar={{
        categories: initialCategories,
        series: initialSeries,
        tags: initialTags,
        selectedCategory,
        selectedSeries,
        selectedTags,
        lang,
        showMoreCategories: true,
        showMoreTags: true,
        isHidden: false,
        onCategoryClick: handleCategoryClick,
        onMoreCategoriesClick: () => {},
        onSeriesClick: handleSeriesClick,
        onTagClick: handleTagClick,
        onTagRemove: handleTagRemove,
        onMoreTagsClick: () => {},
        onClearAllTags: handleClearAllTags,
      }}
      posts={{
        posts: postRows,
        currentPage,
        totalPages,
        lang,
        showSort: true,
        sortDirection,
        isLoading: false,
        emptyMessage:
          lang === DEFAULT_POST_LANG
            ? filteredAndSortedPosts.length === 0
              ? '검색 결과가 없습니다.'
              : '아직 포스트가 없습니다.'
            : filteredAndSortedPosts.length === 0
              ? 'No results found.'
              : 'No posts yet.',
        onPageChange: handlePageChange,
        onSortChange: handleSortChange,
        onCategoryClick: handleCategoryClick,
        onTagClick: handlePostTagClick,
      }}
    />
  );
}

/**
 * 블로그 페이지 클라이언트 컴포넌트 (Suspense 래퍼)
 */
export default function BlogPageClient({
  initialPosts,
  initialCategories,
  initialSeries = [],
  initialTags,
  lang = DEFAULT_POST_LANG,
}: BlogPageClientProps) {
  return (
    <Suspense
      fallback={
        <BlogTemplate
          header={{
            searchValue: '',
            selectedCategory: undefined,
            selectedTags: [],
            onSearchChange: () => {},
            onSearch: () => {},
            isSearchLoading: false,
          }}
          sidebar={{
            categories: initialCategories,
            series: initialSeries,
            tags: initialTags,
            selectedCategory: undefined,
            selectedSeries: undefined,
            selectedTags: [],
            showMoreCategories: false,
            showMoreTags: false,
            isHidden: false,
            onCategoryClick: () => {},
            onMoreCategoriesClick: () => {},
            onSeriesClick: () => {},
            onTagClick: () => {},
            onTagRemove: () => {},
            onMoreTagsClick: () => {},
            onClearAllTags: () => {},
          }}
          posts={{
            posts: [],
            currentPage: 1,
            totalPages: 1,
            showSort: true,
            sortDirection: 'desc',
            isLoading: true,
            emptyMessage: '로딩 중...',
            onPageChange: () => {},
            onSortChange: () => {},
            onCategoryClick: () => {},
            onTagClick: () => {},
          }}
        />
      }
    >
      <BlogPageContent
        initialPosts={initialPosts}
        initialCategories={initialCategories}
        initialSeries={initialSeries}
        initialTags={initialTags}
        lang={lang}
      />
    </Suspense>
  );
}
