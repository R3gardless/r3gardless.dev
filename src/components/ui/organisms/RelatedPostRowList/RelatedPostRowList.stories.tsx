import type { Meta, StoryObj } from '@storybook/react';

import type { RelatedPostRowProps } from '@/components/ui/atoms/RelatedPostRow';

import { RelatedPostRowList } from './RelatedPostRowList';

// 페이지 변경 액션 함수
const handlePageChange = (page: number) => {
  console.log('Page changed to:', page);
};

const meta: Meta<typeof RelatedPostRowList> = {
  title: 'Components/Organisms/RelatedPostRowList',
  component: RelatedPostRowList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '관련 포스트 목록을 표시하는 organism 컴포넌트입니다. 페이지네이션 기능을 포함하고 있습니다.',
      },
    },
  },
  argTypes: {
    posts: {
      description: '관련 포스트 목록',
      control: 'object',
    },
    currentPostId: {
      description: '현재 포스트 ID (해당 포스트는 "현재" 표시됨)',
      control: 'text',
    },
    category: {
      description: '카테고리 이름 (제목에 "{category} 주제의 다른 글" 형태로 표시)',
      control: 'text',
    },
    totalPostsCount: {
      description: '전체 포스트 개수 (헤더 우측에 라벨 형태로 "총 N개" 표시)',
      control: 'number',
    },
    enablePagination: {
      description: '페이지네이션 활성화 여부',
      control: 'boolean',
    },
    currentPage: {
      description: '현재 페이지 번호 (1부터 시작)',
      control: 'number',
    },
    totalPages: {
      description: '전체 페이지 수',
      control: 'number',
    },
    postsPerPage: {
      description: '페이지당 포스트 수',
      control: 'number',
    },
    isLoading: {
      description: '로딩 상태',
      control: 'boolean',
    },
    emptyMessage: {
      description: '빈 상태 메시지',
      control: 'text',
    },
    showTitle: {
      description: '제목 표시 여부',
      control: 'boolean',
    },
    paginationSize: {
      description: '페이지네이션 크기',
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RelatedPostRowList>;

// 샘플 데이터
const samplePosts: RelatedPostRowProps[] = [
  {
    id: '1',
    title: 'React 18의 새로운 기능들',
    date: '2024년 1월 15일',
    href: '/posts/react-18-features',
  },
  {
    id: '2',
    title: 'TypeScript 5.0 마이그레이션 가이드',
    date: '2024년 1월 10일',
    href: '/posts/typescript-5-migration',
  },
  {
    id: '3',
    title: 'Next.js App Router 완벽 가이드',
    date: '2024년 1월 5일',
    href: '/posts/nextjs-app-router-guide',
  },
  {
    id: '4',
    title: 'Tailwind CSS 최적화 팁',
    date: '2023년 12월 28일',
    href: '/posts/tailwind-optimization-tips',
  },
  {
    id: '5',
    title: 'Storybook과 함께하는 컴포넌트 개발',
    date: '2023년 12월 20일',
    href: '/posts/storybook-component-development',
  },
];

const largeSamplePosts: RelatedPostRowProps[] = [
  ...samplePosts,
  {
    id: '6',
    title: 'Zustand로 상태 관리하기',
    date: '2023년 12월 15일',
    href: '/posts/zustand-state-management',
  },
  {
    id: '7',
    title: 'TanStack Query 실전 활용법',
    date: '2023년 12월 10일',
    href: '/posts/tanstack-query-usage',
  },
  {
    id: '8',
    title: 'CSS Grid와 Flexbox 마스터하기',
    date: '2023년 12월 5일',
    href: '/posts/css-grid-flexbox-master',
  },
];

export const Default: Story = {
  args: {
    posts: samplePosts,
    currentPostId: '2',
    category: 'React',
    showTitle: true,
  },
};

export const WithPagination: Story = {
  args: {
    posts: largeSamplePosts,
    currentPostId: '3',
    category: 'Frontend',
    enablePagination: true,
    currentPage: 1,
    totalPages: Math.ceil(largeSamplePosts.length / 5), // 8개 포스트 / 5개씩 = 2페이지
    postsPerPage: 5,
    showTitle: true,
    paginationSize: 'md',
    onPageChange: handlePageChange,
  },
};

export const Loading: Story = {
  args: {
    posts: [],
    category: 'React',
    isLoading: true,
    showTitle: true,
    postsPerPage: 5,
  },
};

export const Empty: Story = {
  args: {
    posts: [],
    category: 'TypeScript',
    isLoading: false,
    emptyMessage: '관련 포스트가 없습니다.',
    showTitle: true,
  },
};

export const WithoutTitle: Story = {
  args: {
    posts: samplePosts.slice(0, 3),
    currentPostId: '1',
    category: 'JavaScript',
    showTitle: false,
  },
};

export const SmallPagination: Story = {
  args: {
    posts: largeSamplePosts,
    currentPostId: '4',
    category: 'CSS',
    enablePagination: true,
    currentPage: 1,
    totalPages: Math.ceil(largeSamplePosts.length / 3), // 8개 포스트 / 3개씩 = 3페이지
    postsPerPage: 3,
    showTitle: true,
    paginationSize: 'sm',
    onPageChange: handlePageChange,
  },
};

export const LargePagination: Story = {
  args: {
    posts: largeSamplePosts,
    currentPostId: '5',
    category: 'Node.js',
    enablePagination: true,
    currentPage: 2,
    totalPages: Math.ceil(largeSamplePosts.length / 3), // 8개 포스트 / 3개씩 = 3페이지
    postsPerPage: 3,
    showTitle: true,
    paginationSize: 'lg',
    onPageChange: handlePageChange,
  },
};

export const WithCategory: Story = {
  args: {
    posts: samplePosts,
    currentPostId: '2',
    category: 'React',
    showTitle: true,
  },
};

export const WithCategoryAndCount: Story = {
  args: {
    posts: largeSamplePosts,
    currentPostId: '3',
    category: 'Frontend',
    totalPostsCount: 15,
    showTitle: true,
  },
};
