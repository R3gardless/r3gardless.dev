'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { BlogTemplate } from '@/components/templates/BlogTemplate';
import { extractCategories, convertPostsToRows } from '@/utils/blog';
import type { PostMeta } from '@/types/blog';

/**
 * 블로그 페이지 내부 컴포넌트
 * useSearchParams를 사용하는 실제 로직
 */
function BlogPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터에서 초기값 설정
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    searchParams.get('category') || undefined,
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get('tags')?.split(',').filter(Boolean) || [],
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const postsPerPage = 10;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const fetchedPosts = await response.json();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Failed to load posts:', err);
        setError('포스트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // 필터링 및 정렬된 포스트 목록
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // 검색 필터링
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase().trim();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(query) ||
          (post.description && post.description.toLowerCase().includes(query)) ||
          post.category.text.toLowerCase().includes(query) ||
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
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [posts, searchValue, selectedCategory, selectedTags, sortDirection]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredAndSortedPosts.slice(startIndex, endIndex);
  }, [filteredAndSortedPosts, currentPage, postsPerPage]);

  // URL 파라미터 업데이트 함수
  const updateURL = (params: { search?: string; category?: string; tags?: string[] }) => {
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
    router.push(newURL, { scroll: false });
  };

  // 이벤트 핸들러들
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1); // 검색 시 첫 페이지로
  };

  const handleSearch = async () => {
    setIsSearchLoading(true);
    updateURL({ search: searchValue, category: selectedCategory, tags: selectedTags });
    // 실제 검색 로직은 이미 filteredAndSortedPosts에서 처리됨
    setTimeout(() => setIsSearchLoading(false), 300);
  };

  const handleCategoryClick = (category: string) => {
    const newCategory = category === selectedCategory ? undefined : category;
    setSelectedCategory(newCategory);
    setCurrentPage(1);
    // 카테고리 클릭 시 모든 다른 필터(검색, 태그)를 초기화하고 카테고리로만 필터링
    setSearchValue(''); // 검색어 초기화
    setSelectedTags([]); // 태그 초기화
    updateURL({ search: undefined, category: newCategory, tags: [] });
  };

  // TagList에서 태그 클릭 - 복수 선택 가능 (토글 방식)
  const handleTagClick = (tag: string) => {
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      // 이미 선택된 태그를 클릭하면 해당 태그만 해제
      newTags = selectedTags.filter(t => t !== tag);
    } else {
      // 새로운 태그를 선택하면 기존 태그에 추가
      newTags = [...selectedTags, tag];
    }
    setSelectedTags(newTags);
    setCurrentPage(1);
    updateURL({ search: searchValue, category: selectedCategory, tags: newTags });
  };

  // PostRow에서 태그 클릭 - 기존 태그 조건 모두 지우고 해당 태그만 선택
  const handlePostTagClick = (tag: string) => {
    const newTags = [tag];
    setSelectedTags(newTags);
    setCurrentPage(1);
    // 태그 클릭 시 카테고리는 무시하고 전체에서 태그만 필터링
    updateURL({ search: searchValue, category: undefined, tags: newTags });
    setSelectedCategory(undefined); // 카테고리 선택 초기화
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

  const handleSortChange = (sortBy: 'createdAt', direction: 'asc' | 'desc') => {
    setSortDirection(direction);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
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
          categories: ['전체'],
          tags: [],
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
          emptyMessage: error,
          onPageChange: () => {},
          onSortChange: () => {},
          onCategoryClick: () => {},
          onTagClick: () => {},
        }}
      />
    );
  }

  // 카테고리 목록 추출
  const categories = extractCategories(posts);

  // 모든 태그 추출
  const tags = posts.flatMap((post: PostMeta) => post.tags);
  const uniqueTags = Array.from(new Set(tags));

  // PostRow용으로 변환
  const postRows = convertPostsToRows(paginatedPosts);

  return (
    <BlogTemplate
      header={{
        searchValue,
        selectedCategory,
        selectedTags,
        onSearchChange: handleSearchChange,
        onSearch: handleSearch,
        isSearchLoading,
      }}
      sidebar={{
        categories,
        tags: uniqueTags,
        selectedCategory,
        selectedTags,
        showMoreCategories: true,
        showMoreTags: true,
        isHidden: false,
        onCategoryClick: handleCategoryClick,
        onMoreCategoriesClick: () => {}, // 추후 구현
        onTagClick: handleTagClick,
        onTagRemove: handleTagRemove,
        onMoreTagsClick: () => {}, // 추후 구현
        onClearAllTags: handleClearAllTags,
      }}
      posts={{
        posts: postRows,
        currentPage,
        totalPages,
        showSort: true,
        sortDirection,
        isLoading: loading,
        emptyMessage: loading
          ? '로딩 중...'
          : filteredAndSortedPosts.length === 0
            ? '검색 결과가 없습니다.'
            : '아직 포스트가 없습니다.',
        onPageChange: handlePageChange,
        onSortChange: handleSortChange,
        onCategoryClick: handleCategoryClick,
        onTagClick: handlePostTagClick,
      }}
    />
  );
}

/**
 * 블로그 페이지 (Suspense로 감싼 메인 컴포넌트)
 */
export default function BlogPage() {
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
            categories: ['전체'],
            tags: [],
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
      <BlogPageContent />
    </Suspense>
  );
}
