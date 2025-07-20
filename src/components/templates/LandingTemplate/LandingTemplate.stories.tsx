import type { Meta, StoryObj } from '@storybook/react';

import { PostMeta } from '@/types/blog';

import { LandingTemplate } from './LandingTemplate';

const meta = {
  title: 'Templates/LandingTemplate',
  component: LandingTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
메인 랜딩 페이지의 콘텐츠 레이아웃을 담당하는 template 컴포넌트입니다.
LandingHero와 RecentPosts 섹션으로 구성됩니다.
Header와 Footer는 Next.js layout.tsx에서 처리됩니다.

**주요 기능:**
- LandingHero 섹션 표시
- RecentPosts 섹션 (카테고리 필터링, 포스트 그리드, 더보기 버튼)
- 반응형 레이아웃 지원
- 로딩 상태 및 빈 상태 처리
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
    },
    isLoading: {
      control: 'boolean',
    },
    showMoreButton: {
      control: 'boolean',
    },
    moreButtonText: {
      control: 'text',
    },
    emptyMessage: {
      control: 'text',
    },
  },
} satisfies Meta<typeof LandingTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 포스트 데이터
const samplePosts: PostMeta[] = [
  {
    id: '1',
    title: 'PostgreSQL Performance Optimization Guide',
    description:
      'Learn how to optimize PostgreSQL performance with advanced indexing strategies and query optimization techniques.',
    createdAt: '2025-01-22T12:52:00.000Z',
    category: { text: '데이터베이스', color: 'blue' },
    tags: ['PostgreSQL', 'Performance', 'Database'],
    cover: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400',
  },
  {
    id: '2',
    title: 'Understanding Database Internals',
    description:
      'Deep dive into how modern databases work under the hood, from storage engines to query execution.',
    createdAt: '2025-01-20T12:52:00.000Z',
    category: { text: '데이터베이스', color: 'blue' },
    tags: ['Database', 'Internals', 'Architecture'],
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
  },
  {
    id: '3',
    title: 'Next.js 15 New Features Overview',
    description:
      'Explore the latest features in Next.js 15 including improved performance and developer experience.',
    createdAt: '2025-01-18T12:52:00.000Z',
    category: { text: '프로그래밍언어', color: 'green' },
    tags: ['Next.js', 'React', 'JavaScript'],
    cover: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400',
  },
  {
    id: '4',
    title: 'Building Scalable Network Architectures',
    description:
      'Learn about designing and implementing scalable network architectures for modern applications.',
    createdAt: '2025-01-15T12:52:00.000Z',
    category: { text: '네트워크', color: 'purple' },
    tags: ['Network', 'Architecture', 'Scalability'],
    cover: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
  },
  {
    id: '5',
    title: 'TypeScript Advanced Patterns',
    description:
      'Master advanced TypeScript patterns for better type safety and code organization.',
    createdAt: '2025-01-12T12:52:00.000Z',
    category: { text: '프로그래밍언어', color: 'green' },
    tags: ['TypeScript', 'Programming', 'Patterns'],
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
  },
  {
    id: '6',
    title: 'Database Security Best Practices',
    description:
      'Essential security practices for protecting your database from common threats and vulnerabilities.',
    createdAt: '2025-01-10T12:52:00.000Z',
    category: { text: '데이터베이스', color: 'blue' },
    tags: ['Security', 'Database', 'Best Practices'],
    cover: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400',
  },
];

const sampleCategories = ['전체', '데이터베이스', '네트워크', '프로그래밍언어'];

/**
 * 기본 LandingTemplate
 */
export const Default: Story = {
  args: {
    posts: samplePosts,
    categories: sampleCategories,
    selectedCategory: '전체',
    showMoreButton: true,
    moreButtonText: '둘러보기',
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default LandingTemplate with LandingHero and RecentPosts sections. Shows the main content layout for the landing page.',
      },
    },
  },
};

/**
 * 로딩 상태의 LandingTemplate
 */
export const Loading: Story = {
  args: {
    posts: [],
    categories: sampleCategories,
    isLoading: true,
    showMoreButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'LandingTemplate in loading state with skeleton components.',
      },
    },
  },
};

/**
 * 빈 상태의 LandingTemplate
 */
export const Empty: Story = {
  args: {
    posts: [],
    categories: sampleCategories,
    selectedCategory: '전체',
    isLoading: false,
    emptyMessage: '아직 포스트가 없습니다.',
    showMoreButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'LandingTemplate with empty state when no posts are available.',
      },
    },
  },
};

/**
 * 특정 카테고리가 선택된 LandingTemplate
 */
export const WithSelectedCategory: Story = {
  args: {
    posts: samplePosts.filter(post => post.category.text === '데이터베이스'),
    categories: sampleCategories,
    selectedCategory: '데이터베이스',
    showMoreButton: true,
    moreButtonText: '더 많은 데이터베이스 포스트 보기',
  },
  parameters: {
    docs: {
      description: {
        story: 'LandingTemplate with a specific category selected, showing filtered posts.',
      },
    },
  },
};

/**
 * 인터랙티브 LandingTemplate - 실제 카테고리 필터링 동작 확인
 */
export const Interactive: Story = {
  args: {
    posts: samplePosts,
    categories: sampleCategories,
    selectedCategory: '전체',
    showMoreButton: true,
    moreButtonText: '둘러보기',
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          '실제로 카테고리를 클릭해서 필터링 동작을 확인할 수 있는 인터랙티브 스토리입니다. ' +
          '카테고리 버튼을 클릭하면 해당 카테고리의 포스트만 표시됩니다.',
      },
    },
  },
  play: async ({ _canvasElement }) => {
    // Storybook Actions 탭에서 클릭 이벤트 확인 가능
    console.log('Interactive story loaded. Try clicking category buttons!');
  },
};

/**
 * 더보기 버튼이 없는 LandingTemplate
 */
export const WithoutMoreButton: Story = {
  args: {
    posts: samplePosts.slice(0, 3),
    categories: sampleCategories,
    selectedCategory: '전체',
    showMoreButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'LandingTemplate without the "More" button.',
      },
    },
  },
};

/**
 * 커스텀 스타일이 적용된 LandingTemplate
 */
export const WithCustomClass: Story = {
  args: {
    posts: samplePosts,
    categories: sampleCategories,
    selectedCategory: '전체',
    showMoreButton: true,
    className: 'border-t-4 border-blue-500',
  },
  parameters: {
    docs: {
      description: {
        story: 'LandingTemplate with custom styling applied.',
      },
    },
  },
};
