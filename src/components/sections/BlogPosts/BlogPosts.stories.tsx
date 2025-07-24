import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { BlogPosts, type SortDirection, type SortOption } from './BlogPosts';

const meta: Meta<typeof BlogPosts> = {
  title: 'Sections/BlogPosts',
  component: BlogPosts,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '블로그 포스트 목록을 행 형태로 표시하고 페이지네이션을 제공하는 Sections 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    posts: {
      description: '블로그 포스트 목록',
    },
    currentPage: {
      control: { type: 'number', min: 1 },
      description: '현재 페이지 번호',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: '전체 페이지 수',
    },
    maxPageNumbers: {
      control: { type: 'number', min: 3, max: 10 },
      description: '표시할 페이지 번호의 최대 개수',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: '로딩 상태',
    },
    emptyMessage: {
      control: { type: 'text' },
      description: '빈 상태 메시지',
    },
    paginationDisabled: {
      control: { type: 'boolean' },
      description: '페이지네이션 비활성화 여부',
    },
    showSort: {
      control: { type: 'boolean' },
      description: '정렬 옵션 표시 여부',
    },
    sortBy: {
      control: { type: 'select' },
      options: ['id'],
      description: '현재 정렬 옵션',
    },
    sortDirection: {
      control: { type: 'select' },
      options: ['asc', 'desc'],
      description: '정렬 방향',
    },
    onSortChange: {
      action: 'sort-changed',
      description: '정렬 변경 시 호출되는 함수',
    },
    onPageChange: {
      action: 'page-changed',
      description: '페이지 변경 시 호출되는 함수',
    },
    onCategoryClick: {
      action: 'category-clicked',
      description: '카테고리 클릭 시 호출되는 함수',
    },
    onTagClick: {
      action: 'tag-clicked',
      description: '태그 클릭 시 호출되는 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터
const samplePosts = [
  {
    id: '1',
    title: 'Next.js 14의 새로운 기능들',
    description:
      'Next.js 14에서 추가된 새로운 기능들과 개선사항들을 살펴보고, 실제 프로젝트에 어떻게 적용할 수 있는지 알아봅시다. App Router의 안정화와 Server Components의 개선점들을 중심으로 설명합니다.',
    createdAt: 'Jan 22, 2025',
    category: {
      text: '프론트엔드',
      color: 'blue' as const,
    },
    tags: ['Next.js', 'React', 'JavaScript'],
    slug: 'nextjs-14-features',
    cover: 'https://via.placeholder.com/300x180/4F46E5/FFFFFF?text=Next.js+14',
    href: '/posts/nextjs-14-features',
  },
  {
    id: '2',
    title: 'TypeScript 5.0 마이그레이션 가이드',
    description:
      'TypeScript 5.0으로 업그레이드하면서 겪을 수 있는 Breaking Changes와 해결 방법들을 정리했습니다. 새로운 기능들과 성능 개선사항도 함께 살펴봅시다.',
    createdAt: 'Jan 20, 2025',
    category: {
      text: '개발도구',
      color: 'green' as const,
    },
    tags: ['TypeScript', 'Migration', 'JavaScript'],
    slug: 'typescript-5-migration',
    cover: 'https://via.placeholder.com/300x180/10B981/FFFFFF?text=TypeScript+5.0',
    href: '/posts/typescript-5-migration',
  },
  {
    id: '3',
    title: 'React Query vs SWR 성능 비교',
    description:
      '두 가지 인기 있는 데이터 페칭 라이브러리의 성능을 실제 프로젝트에서 측정하고 비교해봤습니다. 메모리 사용량, 번들 크기, 렌더링 성능 등을 종합적으로 분석합니다.',
    createdAt: 'Jan 18, 2025',
    category: {
      text: '데이터베이스',
      color: 'purple' as const,
    },
    tags: ['React Query', 'SWR', 'Performance'],
    slug: 'react-query-vs-swr',
    href: '/posts/react-query-vs-swr',
  },
  {
    id: '4',
    title: 'Tailwind CSS 커스텀 디자인 시스템',
    description:
      'Tailwind CSS를 기반으로 일관된 디자인 시스템을 구축하는 방법을 알아봅시다. 컴포넌트 라이브러리와 디자인 토큰을 활용한 확장 가능한 시스템 설계법을 다룹니다.',
    createdAt: 'Jan 15, 2025',
    category: {
      text: '디자인',
      color: 'pink' as const,
    },
    tags: ['Tailwind CSS', 'Design System', 'CSS'],
    slug: 'tailwind-design-system',
    cover: 'https://via.placeholder.com/300x180/EC4899/FFFFFF?text=Tailwind+CSS',
    href: '/posts/tailwind-design-system',
  },
  {
    id: '5',
    title: 'Node.js 성능 최적화 실전 가이드',
    description:
      'Node.js 애플리케이션의 성능을 향상시키는 다양한 기법들을 실제 사례와 함께 소개합니다. 메모리 관리, 이벤트 루프 최적화, 캐싱 전략 등을 다룹니다.',
    createdAt: 'Jan 12, 2025',
    category: {
      text: '백엔드',
      color: 'orange' as const,
    },
    tags: ['Node.js', 'Performance', 'Backend'],
    slug: 'nodejs-optimization',
    href: '/posts/nodejs-optimization',
  },
];

/**
 * 기본 상태
 */
export const Default: Story = {
  args: {
    posts: samplePosts,
    currentPage: 1,
    totalPages: 5,
    maxPageNumbers: 6,
    isLoading: false,
    paginationDisabled: false,
    showSort: true,
    sortDirection: 'desc',
  },
};

/**
 * 로딩 상태
 */
export const Loading: Story = {
  args: {
    posts: [],
    isLoading: true,
  },
};

/**
 * 빈 상태
 */
export const Empty: Story = {
  args: {
    posts: [],
    isLoading: false,
    emptyMessage: '아직 작성된 포스트가 없습니다.',
  },
};

// 인터랙티브 정렬 데모용 컴포넌트
const InteractiveSortingDemo = () => {
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // 날짜를 기준으로 정렬하는 함수
  const sortedPosts = [...samplePosts].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sortDirection === 'asc') {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });

  const handleSortChange = (sortBy: SortOption, direction: SortDirection) => {
    setSortDirection(direction);
    setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p>
          <strong>💡 인터랙티브 데모:</strong>
        </p>
        <p>
          • <strong>정렬 버튼</strong>을 클릭해서 오름차순/내림차순으로 포스트를 정렬해보세요
        </p>
        <p>
          • 현재 정렬:{' '}
          <strong>{sortDirection === 'asc' ? '오름차순 (오래된 순)' : '내림차순 (최신 순)'}</strong>
        </p>
        <p>• 선택된 정렬 버튼은 비활성화됩니다 (pointer-events-none + opacity-50)</p>
      </div>

      <BlogPosts
        posts={sortedPosts}
        currentPage={currentPage}
        totalPages={3}
        showSort={true}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

/**
 * 인터랙티브 정렬 데모
 * 실제로 정렬 버튼을 클릭해서 오름차순/내림차순으로 포스트를 정렬할 수 있습니다.
 */
export const InteractiveSorting: Story = {
  render: () => <InteractiveSortingDemo />,
};
