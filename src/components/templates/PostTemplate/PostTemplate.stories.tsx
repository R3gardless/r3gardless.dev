import type { Meta, StoryObj } from '@storybook/react';
import { ExtendedRecordMap } from 'notion-types';

import { PostTemplate } from './PostTemplate';

const meta: Meta<typeof PostTemplate> = {
  title: 'Templates/PostTemplate',
  component: PostTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
블로그 포스트 페이지의 전체 레이아웃을 담당하는 template 컴포넌트입니다.
PostHeader, PostBody, PostNavigator 섹션으로 구성됩니다.

**주요 기능:**
- PostHeader 섹션 (썸네일, 카테고리, 제목, 날짜, 태그, 설명)
- PostBody 섹션 (Notion 콘텐츠 렌더링)
- PostNavigator 섹션 (이전글/다음글 네비게이션)
- 1024px 최대 너비 제한
- 반응형 레이아웃 지원

**Figma 디자인:**
- 모바일: 단일 열 레이아웃, 4px 패딩
- 데스크톱: 1024px 고정 너비, 8px 패딩
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    post: {
      control: 'object',
      description: '포스트 메타데이터 정보',
    },
    recordMap: {
      control: 'object',
      description: 'Notion 페이지의 블록 데이터',
    },
    prevPost: {
      control: 'object',
      description: '이전글 정보',
    },
    nextPost: {
      control: 'object',
      description: '다음글 정보',
    },
    onCategoryClick: {
      action: 'category-clicked',
      description: '카테고리 클릭 이벤트 핸들러',
    },
    onTagClick: {
      action: 'tag-clicked',
      description: '태그 클릭 이벤트 핸들러',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock Notion recordMap 데이터
const mockRecordMap: ExtendedRecordMap = {
  block: {
    'test-block-1': {
      role: 'reader',
      value: {
        id: 'test-block-1',
        type: 'text',
        properties: {
          title: [
            [
              '샘플 포스트 콘텐츠입니다. 이 부분은 Notion에서 렌더링되는 본문 내용을 시뮬레이션합니다.',
            ],
          ],
        },
        content: [],
        format: {
          block_color: 'gray',
        },
        created_time: Date.now(),
        last_edited_time: Date.now(),
        parent_id: 'test-page',
        parent_table: 'block',
        alive: true,
        space_id: 'test-space',
        version: 1,
        created_by_table: 'notion_user',
        created_by_id: 'test-user',
        last_edited_by_table: 'notion_user',
        last_edited_by_id: 'test-user',
      } as unknown,
    },
    'test-block-2': {
      role: 'reader',
      value: {
        id: 'test-block-2',
        type: 'header',
        properties: {
          title: [['소제목 예시']],
        },
        content: [],
        format: {},
        created_time: Date.now(),
        last_edited_time: Date.now(),
        parent_id: 'test-page',
        parent_table: 'block',
        alive: true,
        space_id: 'test-space',
        version: 1,
        created_by_table: 'notion_user',
        created_by_id: 'test-user',
        last_edited_by_table: 'notion_user',
        last_edited_by_id: 'test-user',
      } as unknown,
    },
  },
  collection: {},
  collection_view: {},
  signed_urls: {},
  preview_images: {},
  notion_user: {},
  collection_query: {},
} as unknown as ExtendedRecordMap;

// 기본 포스트 메타데이터
const samplePost = {
  id: 'sample-post-1',
  title: 'Next.js 14와 TypeScript로 현대적인 블로그 플랫폼 구축하기',
  description:
    '이 포스트에서는 Next.js 14의 최신 기능과 TypeScript를 활용하여 확장 가능하고 유지보수가 쉬운 블로그 플랫폼을 구축하는 방법을 상세히 알아보겠습니다. Atomic Design, Tailwind CSS, Zustand 등 현대적인 기술 스택을 함께 사용하는 방법도 다룹니다.',
  createdAt: 'Jan 22, 2025',
  category: {
    text: '프론트엔드',
    color: 'blue' as const,
  },
  tags: ['Next.js', 'TypeScript', 'React', 'TailwindCSS', 'Atomic Design'],
  cover: '/api/placeholder/900/400',
};

// 기본 스토리
export const Default: Story = {
  args: {
    post: samplePost,
    recordMap: mockRecordMap,
    prevPost: {
      title: 'React 18 Concurrent Features 완벽 가이드',
      href: '/posts/react-18-concurrent-features',
    },
    nextPost: {
      title: 'TypeScript 5.0 새로운 기능 살펴보기',
      href: '/posts/typescript-5-new-features',
    },
  },
};

// 커버 이미지 없는 버전
export const WithoutCover: Story = {
  args: {
    post: {
      ...samplePost,
      cover: undefined,
      title: '커버 이미지가 없는 포스트 예시',
    },
    recordMap: mockRecordMap,
    prevPost: {
      title: 'React 18 Concurrent Features 완벽 가이드',
      href: '/posts/react-18-concurrent-features',
    },
    nextPost: {
      title: 'TypeScript 5.0 새로운 기능 살펴보기',
      href: '/posts/typescript-5-new-features',
    },
  },
};

// 설명 없는 버전
export const WithoutDescription: Story = {
  args: {
    post: {
      ...samplePost,
      description: undefined,
      title: '설명이 없는 간단한 포스트',
    },
    recordMap: mockRecordMap,
    prevPost: {
      title: 'React 18 Concurrent Features 완벽 가이드',
      href: '/posts/react-18-concurrent-features',
    },
    nextPost: {
      title: 'TypeScript 5.0 새로운 기능 살펴보기',
      href: '/posts/typescript-5-new-features',
    },
  },
};

// 카테고리 없는 버전
export const WithoutCategory: Story = {
  args: {
    post: {
      ...samplePost,
      title: '카테고리가 없는 포스트',
    },
    recordMap: mockRecordMap,
    prevPost: {
      title: 'React 18 Concurrent Features 완벽 가이드',
      href: '/posts/react-18-concurrent-features',
    },
    nextPost: {
      title: 'TypeScript 5.0 새로운 기능 살펴보기',
      href: '/posts/typescript-5-new-features',
    },
  },
};

// 태그 없는 버전
export const WithoutTags: Story = {
  args: {
    post: {
      ...samplePost,
      tags: [],
      title: '태그가 없는 포스트',
    },
    recordMap: mockRecordMap,
    prevPost: {
      title: 'React 18 Concurrent Features 완벽 가이드',
      href: '/posts/react-18-concurrent-features',
    },
    nextPost: {
      title: 'TypeScript 5.0 새로운 기능 살펴보기',
      href: '/posts/typescript-5-new-features',
    },
  },
};

// 이전글만 있는 버전
export const PrevPostOnly: Story = {
  args: {
    post: samplePost,
    recordMap: mockRecordMap,
    prevPost: {
      title: 'React 18 Concurrent Features 완벽 가이드',
      href: '/posts/react-18-concurrent-features',
    },
  },
};

// 다음글만 있는 버전
export const NextPostOnly: Story = {
  args: {
    post: samplePost,
    recordMap: mockRecordMap,
    nextPost: {
      title: 'TypeScript 5.0 새로운 기능 살펴보기',
      href: '/posts/typescript-5-new-features',
    },
  },
};

// 네비게이션 없는 버전
export const WithoutNavigation: Story = {
  args: {
    post: samplePost,
    recordMap: mockRecordMap,
  },
};

// 긴 제목과 많은 태그
export const LongContentExample: Story = {
  args: {
    post: {
      id: 'long-post-1',
      title:
        'React, Next.js, TypeScript, Tailwind CSS, Zustand, Storybook, Vitest를 활용한 대규모 프론트엔드 애플리케이션 아키텍처 설계 및 구현 가이드',
      description:
        '이 포스트는 매우 긴 설명을 가지고 있습니다. 현대적인 프론트엔드 개발에서 필요한 다양한 기술 스택들을 어떻게 효과적으로 조합하여 확장 가능하고 유지보수가 쉬운 대규모 애플리케이션을 구축할 수 있는지에 대한 심화 가이드입니다. Atomic Design 패턴, 상태 관리, 테스팅 전략, 성능 최적화, 접근성, SEO 등 실무에서 꼭 필요한 모든 주제를 다룹니다.',
      createdAt: 'Jan 22, 2025',
      category: {
        text: '아키텍처',
        color: 'purple' as const,
      },
      tags: [
        'React',
        'Next.js',
        'TypeScript',
        'TailwindCSS',
        'Zustand',
        'Storybook',
        'Vitest',
        'Architecture',
        'Frontend',
        'Performance',
        'Accessibility',
        'SEO',
        'Testing',
      ],
      cover: '/api/placeholder/900/400',
    },
    recordMap: mockRecordMap,
    prevPost: {
      title:
        '매우 긴 이전글 제목 예시 - React와 TypeScript를 활용한 컴포넌트 설계 패턴과 최적화 전략',
      href: '/posts/react-typescript-component-patterns',
    },
    nextPost: {
      title: '매우 긴 다음글 제목 예시 - 웹 성능 최적화를 위한 Next.js 고급 기법과 모니터링 방법',
      href: '/posts/nextjs-performance-optimization',
    },
  },
};

// 모든 색상 카테고리 테스트
export const AllCategoryColors: Story = {
  render: () => (
    <div className="space-y-8">
      {[
        { color: 'gray' as const, name: '일반' },
        { color: 'brown' as const, name: '백엔드' },
        { color: 'orange' as const, name: '데브옵스' },
        { color: 'yellow' as const, name: '디자인' },
        { color: 'green' as const, name: '데이터베이스' },
        { color: 'blue' as const, name: '프론트엔드' },
        { color: 'purple' as const, name: '아키텍처' },
        { color: 'pink' as const, name: '모바일' },
        { color: 'red' as const, name: '보안' },
      ].map(item => (
        <PostTemplate
          key={item.color}
          post={{
            ...samplePost,
            id: `post-${item.color}`,
            title: `${item.name} 카테고리 포스트 예시`,
            category: {
              text: item.name,
              color: item.color,
            },
          }}
          recordMap={mockRecordMap}
          prevPost={{
            title: '이전글 예시',
            href: '/posts/prev-example',
          }}
          nextPost={{
            title: '다음글 예시',
            href: '/posts/next-example',
          }}
        />
      ))}
    </div>
  ),
};
