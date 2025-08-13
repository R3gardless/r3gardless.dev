import type { Meta, StoryObj } from '@storybook/react';

import { PostHeader } from './PostHeader';

const meta: Meta<typeof PostHeader> = {
  title: 'UI/Blog/PostHeader',
  component: PostHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '포스트 제목',
    },
    description: {
      control: 'text',
      description: '포스트 설명',
    },
    createdAt: {
      control: 'text',
      description: '게시 날짜',
    },
    category: {
      control: 'object',
      description: '카테고리 정보',
    },
    tags: {
      control: 'object',
      description: '태그 목록',
    },
    cover: {
      control: 'text',
      description: '커버 이미지 URL',
    },
    onCategoryClick: {
      action: 'category-clicked',
      description: '카테고리 클릭 이벤트',
    },
    onTagClick: {
      action: 'tag-clicked',
      description: '태그 클릭 이벤트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PostHeader>;

export const Default: Story = {
  args: {
    title: 'Next.js와 TypeScript로 블로그 만들기',
    description:
      '이 글에서는 Next.js와 TypeScript를 사용하여 현대적인 블로그를 구축하는 방법에 대해 자세히 살펴보겠습니다. 설정부터 배포까지 단계별로 설명합니다.',
    createdAt: 'Jan 22, 2025',
    category: {
      text: '데이터베이스',
      color: 'blue',
    },
    tags: ['Nextjs', 'TypeScript', 'React', 'TailwindCSS'],
    slug: 'nextjs-typescript-blog',
    cover: '/api/placeholder/900/400',
  },
};

export const WithoutThumbnail: Story = {
  args: {
    title: '웹 성능 최적화 완벽 가이드',
    description:
      '웹사이트 성능을 개선하는 다양한 기법들을 소개합니다. 이미지 최적화, 코드 스플리팅, 캐싱 전략 등을 다룹니다.',
    createdAt: 'Jan 20, 2025',
    category: {
      text: 'Frontend',
      color: 'green',
    },
    tags: ['Performance', 'Optimization', 'Web'],
    slug: 'web-performance-optimization-guide',
  },
};

export const WithoutCategory: Story = {
  args: {
    title: 'JavaScript ES2024 새로운 기능들',
    description: 'ES2024의 새로운 기능들과 함께 JavaScript의 최신 문법을 정리해보겠습니다.',
    createdAt: 'Jan 18, 2025',
    tags: ['JavaScript', 'ES2024', 'Syntax'],
    slug: 'javascript-es2024-new-features',
    cover: '/api/placeholder/900/400',
  },
};

export const WithoutDescription: Story = {
  args: {
    title: 'React 18 새로운 기능들',
    createdAt: 'Jan 15, 2025',
    category: {
      text: 'React',
      color: 'purple',
    },
    tags: ['React', 'React18', 'Concurrent', 'Suspense'],
    slug: 'react-18-new-features',
    cover: '/api/placeholder/900/400',
  },
};

export const LongContent: Story = {
  args: {
    title: '매우 긴 제목의 블로그 포스트입니다. 이렇게 긴 제목도 잘 처리되는지 확인해보겠습니다.',
    description:
      '이것은 매우 긴 설명입니다. 블로그 포스트의 설명이 길 때 어떻게 표시되는지 확인하기 위한 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있으며, 읽기 쉽게 포맷팅되어야 합니다. 이탈릭체로 표시되어 본문과 구분됩니다.',
    createdAt: 'Jan 08, 2025',
    category: {
      text: '매우긴카테고리이름',
      color: 'orange',
    },
    tags: [
      'VeryLongTagName',
      'AnotherLongTag',
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'TailwindCSS',
      'Performance',
      'Optimization',
      'WebDevelopment',
    ],
    slug: 'very-long-title-blog-post',
    cover: '/api/placeholder/900/400',
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="space-y-8">
      {[
        { color: 'gray' as const, name: 'Gray Category' },
        { color: 'brown' as const, name: 'Brown Category' },
        { color: 'orange' as const, name: 'Orange Category' },
        { color: 'yellow' as const, name: 'Yellow Category' },
        { color: 'green' as const, name: 'Green Category' },
        { color: 'blue' as const, name: 'Blue Category' },
        { color: 'purple' as const, name: 'Purple Category' },
        { color: 'pink' as const, name: 'Pink Category' },
        { color: 'red' as const, name: 'Red Category' },
      ].map((item, index) => (
        <PostHeader
          id={index + 1}
          pageId={`abcdafdf-1234-5678-90ab-cdef1234567${index}`}
          key={item.color}
          title={`${item.name} 포스트`}
          description={`${item.name} 카테고리의 포스트 예시입니다.`}
          createdAt="Jan 22, 2025"
          category={{
            text: item.name,
            color: item.color,
          }}
          tags={['Tag1', 'Tag2', 'Tag3']}
          slug={`${item.color}-category-post`}
        />
      ))}
    </div>
  ),
};
