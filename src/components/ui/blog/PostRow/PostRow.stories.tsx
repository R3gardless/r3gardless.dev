import type { Meta, StoryObj } from '@storybook/react';

import { PostRow } from './PostRow';

const meta: Meta<typeof PostRow> = {
  title: 'UI/Blog/PostRow',
  component: PostRow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '블로그 포스트 정보를 행 형태로 표시하는 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    category: {
      description: '카테고리 정보',
    },
    tags: {
      description: '태그 목록',
    },
    href: {
      control: { type: 'text' },
      description: '포스트 링크 URL',
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
  decorators: [
    Story => (
      <div className="w-full lg:w-[768px] mx-auto p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    id: 1,
    pageId: 'abcdafdf-1234-5678-90ab-cdef12345678',
    title: '제목',
    description:
      '설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명..',
    createdAt: 'Jan 22, 2025',
    category: {
      text: '데이터베이스',
      color: 'blue',
    },
    tags: ['Nextjs', 'React', 'TypeScript'],
    slug: 'example-post',
    cover: 'https://picsum.photos/300/180?random=1',
    href: '/blog/example-post',
  },
};

// 썸네일 없는 버전
export const WithoutThumbnail: Story = {
  args: {
    ...Default.args,
    cover: undefined,
  },
};

// 긴 제목과 설명
export const LongContent: Story = {
  args: {
    ...Default.args,
    title: '매우 긴 제목입니다 매우 긴 제목입니다 매우 긴 제목입니다 매우 긴 제목입니다',
    description:
      '매우 긴 설명입니다. 이 설명은 여러 줄에 걸쳐 작성되었으며, 실제 블로그 포스트에서 사용될 수 있는 형태의 긴 설명입니다. 이런 긴 설명이 어떻게 표시되는지 확인해보세요.',
    cover: 'https://picsum.photos/300/180?random=2',
    href: '/blog/long-content-post',
  },
};

// 많은 태그
export const ManyTags: Story = {
  args: {
    ...Default.args,
    tags: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind',
      'Storybook',
      'Vitest',
      'ESLint',
      'Prettier',
    ],
    cover: 'https://picsum.photos/300/180?random=3',
    href: '/blog/many-tags-post',
  },
};

// 다양한 카테고리 색상
export const DifferentCategories: Story = {
  render: () => (
    <div className="space-y-4">
      <PostRow
        id={1}
        pageId="abcdafdf-1234-5678-90ab-cdef12345670"
        title="데이터베이스 관련 포스트"
        description="데이터베이스에 대한 설명입니다."
        createdAt="Jan 22, 2025"
        category={{ text: '데이터베이스', color: 'blue' }}
        tags={['SQL', 'Database']}
        slug="database-post"
        cover="https://picsum.photos/300/180?random=4"
        href="/blog/database-post"
      />
      <PostRow
        id={2}
        pageId="abcdafdf-1234-5678-90ab-cdef123245678"
        title="프론트엔드 개발 포스트"
        description="프론트엔드 개발에 대한 설명입니다."
        createdAt="Jan 21, 2025"
        category={{ text: '프론트엔드', color: 'green' }}
        tags={['React', 'JavaScript']}
        slug="frontend-post"
        cover="https://picsum.photos/300/180?random=5"
        href="/blog/frontend-post"
      />
      <PostRow
        id={3}
        pageId="abcdafdf-1234-5678-90ab-cdef12345678"
        title="백엔드 개발 포스트"
        description="백엔드 개발에 대한 설명입니다."
        createdAt="Jan 20, 2025"
        category={{ text: '백엔드', color: 'purple' }}
        tags={['Node.js', 'API']}
        slug="backend-post"
        cover="https://picsum.photos/300/180?random=6"
        href="/blog/backend-post"
      />
    </div>
  ),
};
