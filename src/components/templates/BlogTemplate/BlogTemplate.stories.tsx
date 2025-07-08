import type { Meta, StoryObj } from '@storybook/react';

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
      onSearchChange: () => {},
      onSearch: () => {},
      isSearchLoading: false,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: undefined,
      selectedTags: [],
      onCategoryClick: () => {},
      onTagClick: () => {},
      onTagRemove: () => {},
      onClearAllTags: () => {},
    },
    posts: {
      posts: SAMPLE_POSTS,
      currentPage: 1,
      totalPages: 3,
      onPageChange: () => {},
      showSort: true,
      sortDirection: 'desc',
      onSortChange: () => {},
      onCategoryClick: () => {},
      onTagClick: () => {},
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
      onSearchChange: () => {},
      onSearch: () => {},
      isSearchLoading: false,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: 'React',
      selectedTags: ['React', 'TypeScript'],
      onCategoryClick: () => {},
      onTagClick: () => {},
      onTagRemove: () => {},
      onClearAllTags: () => {},
    },
    posts: {
      posts: SAMPLE_POSTS.slice(0, 2), // React 관련 포스트만
      currentPage: 1,
      totalPages: 1,
      onPageChange: () => {},
      showSort: true,
      sortDirection: 'desc',
      onSortChange: () => {},
      onCategoryClick: () => {},
      onTagClick: () => {},
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
      onSearchChange: () => {},
      onSearch: () => {},
      isSearchLoading: true,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: undefined,
      selectedTags: [],
      onCategoryClick: () => {},
      onTagClick: () => {},
      onTagRemove: () => {},
      onClearAllTags: () => {},
    },
    posts: {
      posts: [],
      currentPage: 1,
      totalPages: 1,
      isLoading: true,
      onPageChange: () => {},
      showSort: true,
      sortDirection: 'desc',
      onSortChange: () => {},
      onCategoryClick: () => {},
      onTagClick: () => {},
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
      onSearchChange: () => {},
      onSearch: () => {},
      isSearchLoading: false,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: undefined,
      selectedTags: [],
      onCategoryClick: () => {},
      onTagClick: () => {},
      onTagRemove: () => {},
      onClearAllTags: () => {},
    },
    posts: {
      posts: [],
      currentPage: 1,
      totalPages: 1,
      emptyMessage: '검색 결과가 없습니다.',
      onPageChange: () => {},
      showSort: true,
      sortDirection: 'desc',
      onSortChange: () => {},
      onCategoryClick: () => {},
      onTagClick: () => {},
    },
  },
};

/**
 * 모바일 뷰
 */
export const Mobile: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * 사이드바 숨김 상태 (모바일에서 활용)
 */
export const HiddenSidebar: Story = {
  args: {
    header: {
      searchValue: '',
      onSearchChange: () => {},
      onSearch: () => {},
      isSearchLoading: false,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: undefined,
      selectedTags: [],
      isHidden: true,
      onCategoryClick: () => {},
      onTagClick: () => {},
      onTagRemove: () => {},
      onClearAllTags: () => {},
    },
    posts: {
      posts: SAMPLE_POSTS,
      currentPage: 1,
      totalPages: 3,
      onPageChange: () => {},
      showSort: true,
      sortDirection: 'desc',
      onSortChange: () => {},
      onCategoryClick: () => {},
      onTagClick: () => {},
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
      onSearchChange: () => {},
      onSearch: () => {},
      isSearchLoading: false,
    },
    sidebar: {
      categories: SAMPLE_CATEGORIES,
      tags: SAMPLE_TAGS,
      selectedCategory: undefined,
      selectedTags: [],
      onCategoryClick: () => {},
      onTagClick: () => {},
      onTagRemove: () => {},
      onClearAllTags: () => {},
    },
    posts: {
      posts: SAMPLE_POSTS,
      currentPage: 2,
      totalPages: 8,
      onPageChange: () => {},
      showSort: true,
      sortDirection: 'desc',
      onSortChange: () => {},
      onCategoryClick: () => {},
      onTagClick: () => {},
    },
  },
};
