import type { Meta, StoryObj } from '@storybook/react';

import { PostNavigator } from './PostNavigator';

const meta: Meta<typeof PostNavigator> = {
  title: 'Components/Molecules/PostNavigator',
  component: PostNavigator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '블로그 포스트의 이전글/다음글 네비게이션을 제공하는 컴포넌트입니다.',
      },
    },
  },
  argTypes: {
    prevPost: {
      control: 'object',
      description: '이전글 정보',
    },
    nextPost: {
      control: 'object',
      description: '다음글 정보',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    prevPost: {
      title: 'React와 TypeScript로 현대적인 웹 개발하기',
      href: '/posts/react-typescript-modern-web-development',
    },
    nextPost: {
      title: 'Next.js 13 App Router 완벽 가이드',
      href: '/posts/nextjs-13-app-router-guide',
    },
  },
};

// 이전글만 있는 경우
export const PrevOnly: Story = {
  args: {
    prevPost: {
      title: 'JavaScript ES2024 새로운 기능들',
      href: '/posts/javascript-es2024-features',
    },
  },
};

// 다음글만 있는 경우
export const NextOnly: Story = {
  args: {
    nextPost: {
      title: 'CSS Grid와 Flexbox 마스터하기',
      href: '/posts/css-grid-flexbox-master',
    },
  },
};

// 긴 제목
export const LongTitles: Story = {
  args: {
    prevPost: {
      title: 'React Query와 Zustand를 활용한 상태 관리 패턴과 최적화 전략에 대한 심화 연구',
      href: '/posts/react-query-zustand-state-management',
    },
    nextPost: {
      title: 'TypeScript 고급 타입 시스템을 활용한 안전하고 확장 가능한 애플리케이션 아키텍처 설계',
      href: '/posts/typescript-advanced-types-architecture',
    },
  },
};

// 다크 테마
export const DarkTheme: Story = {
  args: {
    prevPost: {
      title: 'React와 TypeScript로 현대적인 웹 개발하기',
      href: '/posts/react-typescript-modern-web-development',
    },
    nextPost: {
      title: 'Next.js 13 App Router 완벽 가이드',
      href: '/posts/nextjs-13-app-router-guide',
    },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#08031b',
        },
      ],
    },
  },
};

// 빈 상태 (이전글/다음글 모두 없음)
export const Empty: Story = {
  args: {},
};

// 반응형 테스트
export const Responsive: Story = {
  args: {
    prevPost: {
      title: 'React Hook 최적화 가이드',
      href: '/posts/react-hook-optimization',
    },
    nextPost: {
      title: 'Web Performance 최적화',
      href: '/posts/web-performance-optimization',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
