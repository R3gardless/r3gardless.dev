import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { RecentPosts } from './RecentPosts';

const meta: Meta<typeof RecentPosts> = {
  title: 'Sections/RecentPosts',
  component: RecentPosts,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '카테고리 가로 목록과 블로그 포스트 카드들을 Masonry 형태로 표시하는 organism 컴포넌트입니다. react-masonry-css 라이브러리를 활용하여 반응형 Masonry 레이아웃으로 구성됩니다 (모바일: 1열, 태블릿: 2열, 데스크톱: 3열).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    posts: {
      description: '블로그 포스트 카드 목록',
    },
    categories: {
      description: '카테고리 목록',
    },
    selectedCategory: {
      control: { type: 'text' },
      description: '선택된 카테고리',
    },
    showMoreButton: {
      control: { type: 'boolean' },
      description: '더보기 버튼 표시 여부',
    },
    moreButtonText: {
      control: { type: 'text' },
      description: '더보기 버튼 텍스트',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: '로딩 상태',
    },
    emptyMessage: {
      control: { type: 'text' },
      description: '빈 상태 메시지',
    },
    onCategoryClick: {
      action: 'category-clicked',
      description: '카테고리 클릭 시 호출되는 함수',
    },
    onMoreButtonClick: {
      action: 'more-button-clicked',
      description: '더보기 버튼 클릭 시 호출되는 함수',
    },
  },
  decorators: [
    Story => (
      <div className="min-h-screen p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터
const sampleCategories = [
  '전체',
  '데이터베이스',
  '네트워크',
  '프로그래밍언어',
  '프론트엔드',
  '백엔드',
];

const samplePosts = [
  {
    title: 'Next.js 14의 새로운 기능들',
    description: '짧음',
    createdAt: 'Jan 22, 2025',
    tags: ['Next.js', 'React', 'JavaScript'],
    cover: 'https://picsum.photos/330/200?random=1',
    href: '/posts/nextjs-14-features',
    id: '1',
    category: {
      text: '프론트엔드',
      color: 'blue' as const,
    },
  },
  {
    title: 'React 18의 Concurrent Features 활용하기',
    description:
      'React 18에서 소개된 동시성 기능들을 실제 프로젝트에서 어떻게 활용할 수 있는지 예제와 함께 살펴봅시다.',
    createdAt: 'Jan 20, 2025',
    tags: ['React', 'JavaScript', 'Performance'],
    cover: 'https://picsum.photos/330/200?random=2',
    href: '/posts/react-18-concurrent',
    id: '2',
    category: {
      text: '프론트엔드',
      color: 'green' as const,
    },
  },
  {
    title: 'TypeScript 고급 타입 시스템 마스터하기',
    description:
      'TypeScript의 고급 타입 시스템을 이해하고 실무에서 효과적으로 활용하는 방법을 알아봅시다.',
    createdAt: 'Jan 18, 2025',
    tags: ['TypeScript', 'JavaScript', 'Types'],
    cover: 'https://picsum.photos/330/200?random=3',
    href: '/posts/typescript-advanced-types',
    id: '3',
    category: {
      text: '프로그래밍언어',
      color: 'purple' as const,
    },
  },
  {
    title: 'Node.js 성능 최적화 전략',
    description:
      'Node.js 애플리케이션의 성능을 최적화하는 다양한 전략과 기법들을 실제 사례와 함께 소개합니다.',
    createdAt: 'Jan 16, 2025',
    tags: ['Node.js', 'Performance', 'Backend'],
    cover: 'https://picsum.photos/330/200?random=4',
    href: '/posts/nodejs-performance',
    id: '4',
    category: {
      text: '백엔드',
      color: 'orange' as const,
    },
  },
  {
    title: 'PostgreSQL 쿼리 최적화 가이드',
    description: '짧음2',
    createdAt: 'Jan 14, 2025',
    tags: ['PostgreSQL', 'Database', 'SQL'],
    cover: 'https://picsum.photos/330/200?random=5',
    href: '/posts/postgresql-optimization',
    id: '5',
    category: {
      text: '데이터베이스',
      color: 'red' as const,
    },
  },
  {
    title: 'TCP/IP 네트워크 프로토콜 이해하기',
    description: 'TCP/IP 프로토콜 스택의 동작 원리와 네트워크 통신 과정을 상세히 설명합니다.',
    createdAt: 'Jan 12, 2025',
    tags: ['TCP/IP', 'Network', 'Protocol'],
    cover: 'https://picsum.photos/330/200?random=6',
    href: '/posts/tcpip-protocol',
    id: '6',
    category: {
      text: '네트워크',
      color: 'yellow' as const,
    },
  },
  {
    title: 'CSS Grid와 Flexbox 마스터하기',
    description:
      'CSS Grid와 Flexbox를 활용한 현대적인 레이아웃 설계 방법을 실제 예제와 함께 알아봅시다.',
    createdAt: 'Jan 10, 2025',
    tags: ['CSS', 'Layout', 'Frontend'],
    cover: 'https://picsum.photos/330/200?random=7',
    href: '/posts/css-grid-flexbox',
    id: '7',
    category: {
      text: '프론트엔드',
      color: 'pink' as const,
    },
  },
  {
    title: 'Docker 컨테이너 최적화 팁',
    description: '짧음3',
    createdAt: 'Jan 8, 2025',
    tags: ['Docker', 'DevOps', 'Container'],
    cover: 'https://picsum.photos/330/200?random=8',
    href: '/posts/docker-optimization',
    id: '8',
    category: {
      text: '백엔드',
      color: 'blue' as const,
    },
  },
  {
    title: 'MongoDB 집계 파이프라인 활용법',
    description:
      'MongoDB의 집계 파이프라인을 활용하여 복잡한 데이터 처리 작업을 효율적으로 수행하는 방법을 다룹니다.',
    createdAt: 'Jan 6, 2025',
    tags: ['MongoDB', 'NoSQL', 'Database'],
    cover: 'https://picsum.photos/330/200?random=9',
    href: '/posts/mongodb-aggregation',
    id: '9',
    category: {
      text: '데이터베이스',
      color: 'green' as const,
    },
  },
];

// 기본 스토리
export const Default: Story = {
  args: {
    posts: samplePosts,
    categories: sampleCategories,
    selectedCategory: '전체',
    showMoreButton: true,
    moreButtonText: '둘러보기',
    isLoading: false,
    emptyMessage: '포스트가 없습니다.',
  },
};

// 인터랙티브 스토리를 위한 컴포넌트
const InteractiveStoryComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 선택된 카테고리에 따라 포스트 필터링
  const filteredPosts =
    selectedCategory === '전체'
      ? samplePosts
      : samplePosts.filter(
          post =>
            post.category.text === selectedCategory ||
            post.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase())),
        );

  return (
    <RecentPosts
      posts={filteredPosts}
      categories={sampleCategories}
      selectedCategory={selectedCategory}
      showMoreButton={true}
      moreButtonText="둘러보기"
      onCategoryClick={setSelectedCategory}
      onMoreButtonClick={() => {
        console.log('더보기 클릭!');
      }}
    />
  );
};

// 인터랙티브 스토리 (카테고리 선택 기능)
export const Interactive: Story = {
  render: () => <InteractiveStoryComponent />,
};

// 로딩 상태
export const Loading: Story = {
  args: {
    posts: [],
    categories: sampleCategories,
    selectedCategory: '전체',
    isLoading: true,
    showMoreButton: true,
  },
};

// 빈 상태
export const Empty: Story = {
  args: {
    posts: [],
    categories: sampleCategories,
    selectedCategory: '데이터베이스',
    isLoading: false,
    emptyMessage: '선택한 카테고리에 포스트가 없습니다.',
    showMoreButton: false,
  },
};

// 적은 수의 포스트
export const FewPosts: Story = {
  args: {
    posts: samplePosts.slice(0, 3),
    categories: sampleCategories,
    selectedCategory: '전체',
    showMoreButton: true,
    moreButtonText: '더 보기',
  },
};

// 더보기 버튼 없음
export const WithoutMoreButton: Story = {
  args: {
    posts: samplePosts,
    categories: sampleCategories,
    selectedCategory: '전체',
    showMoreButton: false,
  },
};

// Masonry 레이아웃 테스트용 - 다양한 높이의 포스트들
export const MasonryLayout: Story = {
  args: {
    posts: [
      ...samplePosts,
      {
        id: '10',
        title: 'CSS Masonry 레이아웃 구현하기',
        description:
          'CSS columns를 활용하여 Pinterest 스타일의 Masonry 레이아웃을 구현하는 방법을 단계별로 알아보겠습니다. Grid와의 차이점과 각각의 장단점을 비교해보며, 실제 프로젝트에서 적용할 수 있는 팁들을 공유합니다. 반응형 디자인에서의 고려사항과 성능 최적화 방법까지 포함하여 완전한 가이드를 제공합니다.',
        createdAt: 'Jan 20, 2025',
        tags: ['CSS', 'Layout', 'Responsive'],
        cover: 'https://picsum.photos/320/400?random=7',
        href: '/posts/css-masonry-layout',
        category: {
          text: 'CSS',
          color: 'blue' as const,
        },
      },
      {
        id: '11',
        title: 'React 18의 새로운 기능들',
        description:
          'React 18에서 새롭게 추가된 Concurrent Features, Suspense, Automatic Batching 등의 기능들을 살펴봅니다.',
        createdAt: 'Jan 18, 2025',
        tags: ['React', 'Concurrent', 'Suspense'],
        cover: 'https://picsum.photos/320/200?random=8',
        href: '/posts/react-18-features',
        category: {
          text: 'React',
          color: 'green' as const,
        },
      },
      {
        id: '12',
        title: '웹 성능 최적화를 위한 이미지 처리 전략',
        description:
          'Next.js Image 컴포넌트를 활용한 이미지 최적화부터 WebP, AVIF 포맷 활용, lazy loading 구현까지 웹 성능 향상을 위한 종합적인 이미지 처리 전략을 다룹니다. 실제 성능 측정 결과와 함께 Before/After를 비교해보겠습니다. 또한 CDN 활용 방법과 이미지 압축 기법, 반응형 이미지 처리까지 실무에서 바로 활용할 수 있는 노하우를 제공합니다.',
        createdAt: 'Jan 16, 2025',
        tags: ['Performance', 'Next.js', 'WebP'],
        cover: 'https://picsum.photos/320/350?random=9',
        href: '/posts/web-image-optimization',
        category: {
          text: '성능최적화',
          color: 'orange' as const,
        },
      },
      {
        id: '13',
        title: 'TypeScript 유틸리티 타입 활용법',
        description:
          'Pick, Omit, Partial 등 TypeScript 내장 유틸리티 타입들의 실무 활용 방법을 예제와 함께 소개합니다.',
        createdAt: 'Jan 14, 2025',
        tags: ['TypeScript', 'Utility Types'],
        cover: 'https://picsum.photos/320/250?random=10',
        href: '/posts/typescript-utility-types',
        category: {
          text: 'TypeScript',
          color: 'purple' as const,
        },
      },
    ],
    categories: sampleCategories,
    selectedCategory: '전체',
    showMoreButton: true,
    moreButtonText: '더 많은 포스트 보기',
  },
};
