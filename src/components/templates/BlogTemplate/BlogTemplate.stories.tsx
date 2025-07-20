import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { BlogTemplate } from './BlogTemplate';

const meta: Meta<typeof BlogTemplate> = {
  title: 'Templates/BlogTemplate',
  component: BlogTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
BlogTemplate은 블로그 목록 페이지의 전체 레이아웃을 담당하는 template 컴포넌트입니다.

## 주요 특징
- 📱 반응형 레이아웃 (1024px 미만에서는 중앙 정렬된 세로 배치, 최대 768px)
- 📝 상단: BlogHeader (전체 1024px 너비)
- 🎯 하단 좌측: BlogSidebar (246px 너비)
- 📚 하단 우측: BlogPosts (768px 너비)
- 🎨 Figma 디자인을 기반으로 한 레이아웃
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    header: {
      description: 'BlogHeader 컴포넌트에 전달될 props',
    },
    sidebar: {
      description: 'BlogSidebar 컴포넌트에 전달될 props',
    },
    posts: {
      description: 'BlogPosts 컴포넌트에 전달될 props',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BlogTemplate>;

// 샘플 데이터
const SAMPLE_CATEGORIES = ['전체', 'React', 'JavaScript', 'TypeScript', 'Next.js', 'Node.js'];

const SAMPLE_TAGS = [
  'React',
  'Vue',
  'Angular',
  'Svelte',
  'JavaScript',
  'TypeScript',
  'Next.js',
  'Remix',
  'Node.js',
  'Express',
  'TanStack',
  'Zustand',
];

const SAMPLE_POSTS = [
  {
    id: '1',
    title: 'Next.js와 TypeScript로 블로그 만들기',
    description:
      '이 글에서는 Next.js와 TypeScript를 사용하여 현대적인 블로그를 구축하는 방법에 대해 자세히 살펴보겠습니다.',
    createdAt: 'Jan 22, 2025',
    category: { text: '웹개발', color: 'blue' as const },
    tags: ['Next.js', 'TypeScript', 'React'],
    cover: 'https://picsum.photos/300/180?random=1',
    href: '/blog/nextjs-typescript-blog',
  },
  {
    id: '2',
    title: 'React Hooks 완벽 가이드',
    description: 'useState, useEffect부터 커스텀 훅까지, React Hooks의 모든 것을 다룹니다.',
    createdAt: 'Jan 20, 2025',
    category: { text: 'React', color: 'green' as const },
    tags: ['React', 'Hooks', 'JavaScript'],
    cover: 'https://picsum.photos/300/180?random=2',
    href: '/blog/react-hooks-guide',
  },
  {
    id: '3',
    title: 'Tailwind CSS 실무 활용법',
    description: '실제 프로젝트에서 Tailwind CSS를 효과적으로 사용하는 방법과 팁들을 공유합니다.',
    createdAt: 'Jan 18, 2025',
    category: { text: 'CSS', color: 'purple' as const },
    tags: ['CSS', 'Tailwind', 'Design'],
    cover: 'https://picsum.photos/300/180?random=3',
    href: '/blog/tailwind-css-tips',
  },
  {
    id: '4',
    title: 'Node.js 성능 최적화 가이드',
    description: 'Node.js 애플리케이션의 성능을 향상시키는 다양한 기법들을 소개합니다.',
    createdAt: 'Jan 15, 2025',
    category: { text: 'Backend', color: 'orange' as const },
    tags: ['Node.js', 'Performance', 'JavaScript'],
    cover: 'https://picsum.photos/300/180?random=4',
    href: '/blog/nodejs-performance',
  },
  {
    id: '5',
    title: 'TypeScript 고급 타입 시스템',
    description:
      'TypeScript의 고급 타입 기능들을 활용하여 더 안전한 코드를 작성하는 방법을 알아봅니다.',
    createdAt: 'Jan 12, 2025',
    category: { text: 'TypeScript', color: 'blue' as const },
    tags: ['TypeScript', 'Types', 'JavaScript'],
    cover: 'https://picsum.photos/300/180?random=5',
    href: '/blog/typescript-advanced-types',
  },
];

/**
 * 기본 BlogTemplate
 */
export const Default: Story = {
  args: {
    header: {
      searchValue: '',
      onSearchChange: (value: string) => {
        console.log('검색어 변경:', value);
      },
      onSearch: (searchValue: string) => {
        console.log('검색 실행:', searchValue);
      },
      isSearchLoading: false,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: undefined,
      selectedTags: [],
      onCategoryClick: (category: string) => {
        console.log('카테고리 클릭:', category);
      },
      onTagClick: (tag: string) => {
        console.log('태그 클릭:', tag);
      },
      onTagRemove: (tag: string) => {
        console.log('태그 제거:', tag);
      },
      onClearAllTags: () => {
        console.log('모든 태그 제거');
      },
    },
    posts: {
      posts: SAMPLE_POSTS,
      currentPage: 1,
      totalPages: 3,
      onPageChange: (page: number) => {
        console.log('페이지 변경:', page);
      },
      showSort: true,
      sortDirection: 'desc',
      onSortChange: (sortBy: string, direction: 'asc' | 'desc') => {
        console.log('정렬 변경:', sortBy, direction);
      },
      onCategoryClick: (category: string) => {
        console.log('포스트에서 카테고리 클릭:', category);
      },
      onTagClick: (tag: string) => {
        console.log('포스트에서 태그 클릭:', tag);
      },
    },
  },
};

/**
 * 검색어가 있는 상태
 */
export const WithSearchQuery: Story = {
  args: {
    header: {
      searchValue: 'React',
      selectedCategory: 'React',
      selectedTags: ['React', 'TypeScript'],
      onSearchChange: (value: string) => {
        console.log('검색어 변경:', value);
      },
      onSearch: (searchValue: string) => {
        console.log('검색 실행:', searchValue);
      },
      isSearchLoading: false,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: 'React',
      selectedTags: ['React', 'TypeScript'],
      onCategoryClick: (category: string) => {
        console.log('카테고리 클릭:', category);
      },
      onTagClick: (tag: string) => {
        console.log('태그 클릭:', tag);
      },
      onTagRemove: (tag: string) => {
        console.log('태그 제거:', tag);
      },
      onClearAllTags: () => {
        console.log('모든 태그 제거');
      },
    },
    posts: {
      posts: SAMPLE_POSTS.slice(0, 2), // React 관련 포스트만
      currentPage: 1,
      totalPages: 1,
      onPageChange: (page: number) => {
        console.log('페이지 변경:', page);
      },
      showSort: true,
      sortDirection: 'desc',
      onSortChange: (sortBy: string, direction: 'asc' | 'desc') => {
        console.log('정렬 변경:', sortBy, direction);
      },
      onCategoryClick: (category: string) => {
        console.log('포스트에서 카테고리 클릭:', category);
      },
      onTagClick: (tag: string) => {
        console.log('포스트에서 태그 클릭:', tag);
      },
    },
  },
};

/**
 * 로딩 상태
 */
export const Loading: Story = {
  args: {
    header: {
      searchValue: '',
      onSearchChange: (value: string) => {
        console.log('검색어 변경:', value);
      },
      onSearch: (searchValue: string) => {
        console.log('검색 실행:', searchValue);
      },
      isSearchLoading: true,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: undefined,
      selectedTags: [],
      onCategoryClick: (category: string) => {
        console.log('카테고리 클릭:', category);
      },
      onTagClick: (tag: string) => {
        console.log('태그 클릭:', tag);
      },
      onTagRemove: (tag: string) => {
        console.log('태그 제거:', tag);
      },
      onClearAllTags: () => {
        console.log('모든 태그 제거');
      },
    },
    posts: {
      posts: [],
      currentPage: 1,
      totalPages: 1,
      isLoading: true,
      onPageChange: (page: number) => {
        console.log('페이지 변경:', page);
      },
      showSort: true,
      sortDirection: 'desc',
      onSortChange: (sortBy: string, direction: 'asc' | 'desc') => {
        console.log('정렬 변경:', sortBy, direction);
      },
      onCategoryClick: (category: string) => {
        console.log('포스트에서 카테고리 클릭:', category);
      },
      onTagClick: (tag: string) => {
        console.log('포스트에서 태그 클릭:', tag);
      },
    },
  },
};

/**
 * 빈 상태 (포스트 없음)
 */
export const Empty: Story = {
  args: {
    header: {
      searchValue: 'NonexistentTopic',
      onSearchChange: (value: string) => {
        console.log('검색어 변경:', value);
      },
      onSearch: (searchValue: string) => {
        console.log('검색 실행:', searchValue);
      },
      isSearchLoading: false,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: undefined,
      selectedTags: [],
      onCategoryClick: (category: string) => {
        console.log('카테고리 클릭:', category);
      },
      onTagClick: (tag: string) => {
        console.log('태그 클릭:', tag);
      },
      onTagRemove: (tag: string) => {
        console.log('태그 제거:', tag);
      },
      onClearAllTags: () => {
        console.log('모든 태그 제거');
      },
    },
    posts: {
      posts: [],
      currentPage: 1,
      totalPages: 1,
      emptyMessage: '검색 결과가 없습니다.',
      onPageChange: (page: number) => {
        console.log('페이지 변경:', page);
      },
      showSort: true,
      sortDirection: 'desc',
      onSortChange: (sortBy: string, direction: 'asc' | 'desc') => {
        console.log('정렬 변경:', sortBy, direction);
      },
      onCategoryClick: (category: string) => {
        console.log('포스트에서 카테고리 클릭:', category);
      },
      onTagClick: (tag: string) => {
        console.log('포스트에서 태그 클릭:', tag);
      },
    },
  },
};

/**
 * 페이지네이션이 있는 상태
 */
export const WithPagination: Story = {
  args: {
    header: {
      searchValue: '',
      onSearchChange: (value: string) => {
        console.log('검색어 변경:', value);
      },
      onSearch: (searchValue: string) => {
        console.log('검색 실행:', searchValue);
      },
      isSearchLoading: false,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: undefined,
      selectedTags: [],
      onCategoryClick: (category: string) => {
        console.log('카테고리 클릭:', category);
      },
      onTagClick: (tag: string) => {
        console.log('태그 클릭:', tag);
      },
      onTagRemove: (tag: string) => {
        console.log('태그 제거:', tag);
      },
      onClearAllTags: () => {
        console.log('모든 태그 제거');
      },
    },
    posts: {
      posts: SAMPLE_POSTS,
      currentPage: 2,
      totalPages: 8,
      onPageChange: (page: number) => {
        console.log('페이지 변경:', page);
      },
      showSort: true,
      sortDirection: 'desc',
      onSortChange: (sortBy: string, direction: 'asc' | 'desc') => {
        console.log('정렬 변경:', sortBy, direction);
      },
      onCategoryClick: (category: string) => {
        console.log('포스트에서 카테고리 클릭:', category);
      },
      onTagClick: (tag: string) => {
        console.log('포스트에서 태그 클릭:', tag);
      },
    },
  },
};

/**
 * 인터랙티브 데모 스토리용 컴포넌트
 */
const InteractiveBlogTemplate: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [isSearchLoading, setIsSearchLoading] = React.useState(false);

  // 필터링된 포스트 계산
  const filteredPosts = React.useMemo(() => {
    let filtered = SAMPLE_POSTS;

    // 검색어로 필터링
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.description.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower)),
      );
    }

    // 카테고리로 필터링
    if (selectedCategory && selectedCategory !== '전체') {
      filtered = filtered.filter(post => post.category.text === selectedCategory);
    }

    // 태그로 필터링
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.every(selectedTag => post.tags.includes(selectedTag)),
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [searchValue, selectedCategory, selectedTags, sortDirection]);

  // 페이지네이션 계산
  const postsPerPage = 3;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // 검색 함수
  const handleSearch = React.useCallback(async (value: string) => {
    setIsSearchLoading(true);
    setSearchValue(value);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동

    // 검색 로딩 시뮬레이션
    setTimeout(() => {
      setIsSearchLoading(false);
    }, 800);
  }, []);

  const handleSearchChange = React.useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  // 카테고리 클릭
  const handleCategoryClick = React.useCallback(
    (category: string) => {
      if (category === selectedCategory) {
        setSelectedCategory(undefined); // 같은 카테고리 클릭 시 해제
      } else {
        setSelectedCategory(category);
      }
      setCurrentPage(1); // 필터링 시 첫 페이지로 이동
    },
    [selectedCategory],
  );

  // 태그 클릭
  const handleTagClick = React.useCallback((tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag); // 태그 해제
      } else {
        return [...prev, tag]; // 태그 추가
      }
    });
    setCurrentPage(1); // 필터링 시 첫 페이지로 이동
  }, []);

  // 태그 제거
  const handleTagRemove = React.useCallback((tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
    setCurrentPage(1);
  }, []);

  // 모든 태그 제거
  const handleClearAllTags = React.useCallback(() => {
    setSelectedTags([]);
    setCurrentPage(1);
  }, []);

  // 페이지 변경
  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 상단으로 이동하는 것을 시뮬레이션
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // 정렬 변경
  const handleSortChange = React.useCallback((sortBy: string, direction: 'asc' | 'desc') => {
    setSortDirection(direction);
    setCurrentPage(1);
  }, []);

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
        categories: SAMPLE_CATEGORIES,
        tags: SAMPLE_TAGS,
        selectedCategory,
        selectedTags,
        onCategoryClick: handleCategoryClick,
        onTagClick: handleTagClick,
        onTagRemove: handleTagRemove,
        onClearAllTags: handleClearAllTags,
      }}
      posts={{
        posts: currentPosts,
        currentPage,
        totalPages,
        onPageChange: handlePageChange,
        showSort: true,
        sortDirection,
        onSortChange: handleSortChange,
        onCategoryClick: handleCategoryClick,
        onTagClick: handleTagClick,
        isLoading: isSearchLoading,
        emptyMessage:
          searchValue || selectedCategory || selectedTags.length > 0
            ? `"${searchValue || selectedCategory || selectedTags.join(', ')}"에 대한 검색 결과가 없습니다.`
            : '포스트가 없습니다.',
      }}
    />
  );
};

/**
 * 인터랙티브 데모 스토리
 *
 * 실제 사용자 인터랙션을 시뮬레이션하는 완전히 기능하는 블로그 템플릿입니다.
 * 검색, 필터링, 페이지네이션, 정렬 등 모든 기능이 실제로 동작합니다.
 *
 * ## 기능
 * - 🔍 실시간 검색 및 필터링
 * - 🏷️ 카테고리/태그 선택 및 해제
 * - 📄 페이지네이션
 * - 🔄 정렬 기능 (최신순/오래된순)
 * - 📱 반응형 레이아웃
 *
 * ## 사용법
 * - 상단 검색바에 키워드를 입력해보세요
 * - 좌측 사이드바에서 카테고리나 태그를 클릭해보세요
 * - 정렬 버튼으로 최신순/오래된순을 변경해보세요
 * - 하단 페이지네이션으로 페이지를 이동해보세요
 */
export const Interactive: Story = {
  render: () => <InteractiveBlogTemplate />,
  parameters: {
    docs: {
      description: {
        story:
          '모든 기능이 실제로 동작하는 인터랙티브 블로그 템플릿입니다. 검색, 필터링, 페이지네이션 등을 직접 사용해보세요.',
      },
    },
    controls: { disable: true }, // Interactive story는 컨트롤을 비활성화
  },
};
