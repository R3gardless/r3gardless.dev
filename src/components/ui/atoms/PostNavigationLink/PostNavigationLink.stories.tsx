import type { Meta, StoryObj } from '@storybook/react';

import { PostNavigationLink } from './PostNavigationLink';

const meta: Meta<typeof PostNavigationLink> = {
  title: 'UI/Atoms/PostNavigationLink',
  component: PostNavigationLink,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '블로그 포스트의 이전글/다음글 단일 링크를 제공하는 원자 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['prev', 'next'],
      description: '네비게이션 방향',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '테마 모드',
    },
    post: {
      description: '포스트 정보 객체',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost = {
  title: 'Next.js와 TypeScript로 블로그 만들기',
  href: '/blog/next-js-typescript-blog',
};

const mockLongTitlePost = {
  title:
    'React와 TypeScript를 활용한 대규모 웹 애플리케이션 아키텍처 설계 및 성능 최적화 전략에 대한 심층적인 분석',
  href: '/blog/react-typescript-architecture',
};

export const PrevPost: Story = {
  args: {
    post: mockPost,
    direction: 'prev',
    theme: 'light',
  },
};

export const NextPost: Story = {
  args: {
    post: mockPost,
    direction: 'next',
    theme: 'light',
  },
};

export const PrevPostDark: Story = {
  args: {
    post: mockPost,
    direction: 'prev',
    theme: 'dark',
  },
};

export const NextPostDark: Story = {
  args: {
    post: mockPost,
    direction: 'next',
    theme: 'dark',
  },
};

export const PrevPostLongTitle: Story = {
  args: {
    post: mockLongTitlePost,
    direction: 'prev',
    theme: 'light',
  },
};

export const NextPostLongTitle: Story = {
  args: {
    post: mockLongTitlePost,
    direction: 'next',
    theme: 'light',
  },
};

export const AllDirections: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-4xl md:flex-row md:justify-between">
      <PostNavigationLink post={mockPost} direction="prev" theme="light" />
      <PostNavigationLink post={mockPost} direction="next" theme="light" />
    </div>
  ),
};

export const ResponsiveDemo: Story = {
  render: () => (
    <div className="w-full space-y-6">
      <div className="text-lg font-semibold mb-4">반응형 테스트 (창 크기를 조절해보세요)</div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <PostNavigationLink post={mockLongTitlePost} direction="prev" theme="light" />
        <PostNavigationLink post={mockLongTitlePost} direction="next" theme="light" />
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
