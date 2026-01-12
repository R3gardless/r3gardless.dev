'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useMemo, Suspense, useEffect } from 'react';

import { BlogTemplate } from '@/components/templates/BlogTemplate';
import type { PostRowProps } from '@/components/ui/blog/PostRow';
import type { PostMeta } from '@/types/blog';
import { convertPostsForRendering } from '@/utils/blog';

interface BlogPageClientProps {
  initialPosts: PostMeta[];
  initialCategories: string[];
  initialTags: string[];
}

/**
 * 블로그 페이지 클라이언트 컴포넌트
 * 정적 데이터를 받아서 클라이언트에서 필터링/검색 수행
 */
function BlogPageContent({ initialPosts, initialCategories, initialTags }: BlogPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 상태 관리 - 서버 초기 렌더링과 클라이언트 hydration 시 URL 파라미터 차이로 인한
  // hydration 불일치를 막기 위해, 초기값은 항상 빈 값으로 두고 useEffect에서 URL 기반으로 갱신
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);

  const postsPerPage = 6;

  // Hydration 완료 후 URL 파라미터에서 초기값 설정
  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';
    const urlCategory = searchParams.get('category') ?? undefined;
    const urlTags = searchParams.get('tags')?.split(',').filter(Boolean) ?? [];

    setSearchValue(urlSearch);
    setSelectedCategory(urlCategory);
    setSelectedTags(urlTags);
    setIsHydrated(true);
  }, [searchParams]);

  // 필터링 및 정렬된 포스트 목록
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = initialPosts;

    // 검색 필터링
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase().trim();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(query) ??
          (post.description && post.description.toLowerCase().includes(query)) ??
          post.category.text.toLowerCase().includes(query) ??
          post.tags.some(tag => tag.toLowerCase().includes(query)),
      );
    }

    // 카테고리 필터링
    if (selectedCategory && selectedCategory !== '전체') {
      filtered = filtered.filter(post => post.category.text === selectedCategory);
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
  }, [initialPosts, searchValue, selectedCategory, selectedTags, sortDirection]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredAndSortedPosts.slice(startIndex, endIndex);
  }, [filteredAndSortedPosts, currentPage, postsPerPage]);

  // URL 업데이트 함수
  const updateURL = (params: { search?: string; category?: string; tags?: string[] }) => {
    if (!isHydrated) return;

    const newParams = new URLSearchParams();

    if (params.search) {
      newParams.set('search', params.search);
    }

    if (params.category && params.category !== '전체') {
      newParams.set('category', params.category);
    }

    if (params.tags && params.tags.length > 0) {
      newParams.set('tags', params.tags.join(','));
    }

    const newURL = `/blog${newParams.toString() ? '?' + newParams.toString() : ''}`;
    router.replace(newURL, { scroll: false });
  };

  // 이벤트 핸들러들
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    updateURL({ search: searchValue, category: selectedCategory, tags: selectedTags });
  };

  const handleCategoryClick = (category: string) => {
    const newCategory = category === selectedCategory ? undefined : category;
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    setSearchValue('');
    setSelectedTags([]);
    updateURL({ search: undefined, category: newCategory, tags: [] });
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
    updateURL({ search: searchValue, category: selectedCategory, tags: newTags });
  };

  const handlePostTagClick = (tag: string) => {
    const newTags = [tag];
    setSelectedTags(newTags);
    setCurrentPage(1);
    updateURL({ search: searchValue, category: undefined, tags: newTags });
    setSelectedCategory(undefined);
  };

  const handleTagRemove = (tag: string) => {
    const newTags = selectedTags.filter(t => t !== tag);
    setSelectedTags(newTags);
    updateURL({ search: searchValue, category: selectedCategory, tags: newTags });
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
    updateURL({ search: searchValue, category: selectedCategory, tags: [] });
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
          tags: initialTags,
          selectedCategory: undefined,
          selectedTags: [],
          showMoreCategories: true,
          showMoreTags: true,
          isHidden: false,
          onCategoryClick: () => {},
          onMoreCategoriesClick: () => {},
          onTagClick: () => {},
          onTagRemove: () => {},
          onMoreTagsClick: () => {},
          onClearAllTags: () => {},
        }}
        posts={{
          posts: convertPostsForRendering<PostRowProps>(initialPosts.slice(0, postsPerPage)),
          currentPage: 1,
          totalPages: Math.ceil(initialPosts.length / postsPerPage),
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
  const postRows = convertPostsForRendering<PostRowProps>(paginatedPosts);

  return (
    <BlogTemplate
      header={{
        searchValue,
        selectedCategory,
        selectedTags,
        onSearchChange: handleSearchChange,
        onSearch: handleSearch,
        isSearchLoading: false,
      }}
      sidebar={{
        categories: initialCategories,
        tags: initialTags,
        selectedCategory,
        selectedTags,
        showMoreCategories: true,
        showMoreTags: true,
        isHidden: false,
        onCategoryClick: handleCategoryClick,
        onMoreCategoriesClick: () => {},
        onTagClick: handleTagClick,
        onTagRemove: handleTagRemove,
        onMoreTagsClick: () => {},
        onClearAllTags: handleClearAllTags,
      }}
      posts={{
        posts: postRows,
        currentPage,
        totalPages,
        showSort: true,
        sortDirection,
        isLoading: false,
        emptyMessage:
          filteredAndSortedPosts.length === 0 ? '검색 결과가 없습니다.' : '아직 포스트가 없습니다.',
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
  initialTags,
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
            tags: initialTags,
            selectedCategory: undefined,
            selectedTags: [],
            showMoreCategories: false,
            showMoreTags: false,
            isHidden: false,
            onCategoryClick: () => {},
            onMoreCategoriesClick: () => {},
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
        initialTags={initialTags}
      />
    </Suspense>
  );
}
