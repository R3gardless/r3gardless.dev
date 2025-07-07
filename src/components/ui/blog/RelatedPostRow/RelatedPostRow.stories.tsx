import type { Meta, StoryObj } from '@storybook/react';

import { RelatedPostRow } from './RelatedPostRow';

const meta: Meta<typeof RelatedPostRow> = {
  title: 'UI/Blog/RelatedPostRow',
  component: RelatedPostRow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '관련 포스트 목록에서 개별 포스트를 표시하는 원자 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: '포스트 고유 ID',
    },
    title: {
      control: 'text',
      description: '포스트 제목',
    },
    date: {
      control: 'text',
      description: '게시 날짜',
    },
    href: {
      control: 'text',
      description: '포스트 링크 URL',
    },
    isCurrent: {
      control: 'boolean',
      description: '현재 포스트 여부',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
  decorators: [
    Story => (
      <div className="w-[840px] p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost = {
  id: 'post-1',
  title: '1번 글 제목',
  date: '2024.12.26',
  href: '/blog/sample-post',
};

const mockCurrentPost = {
  id: 'current-post',
  title: '1번 글 제목',
  date: '2024.12.26',
  href: '/blog/current-post',
};

// 기본 스토리 (일반 포스트)
export const Default: Story = {
  args: {
    ...mockPost,
    isCurrent: false,
  },
};

// 현재 포스트
export const CurrentPost: Story = {
  args: {
    ...mockCurrentPost,
    isCurrent: true,
  },
};

// 긴 제목
export const LongTitle: Story = {
  args: {
    id: 'long-title',
    title:
      'React와 TypeScript를 활용한 대규모 웹 애플리케이션 아키텍처 설계 및 성능 최적화 전략에 대한 심층적인 분석',
    date: '2024.12.26',
    href: '/blog/long-title-post',
    isCurrent: false,
  },
};

// 긴 제목 + 현재 포스트
export const LongTitleCurrent: Story = {
  args: {
    id: 'long-title-current',
    title:
      'React와 TypeScript를 활용한 대규모 웹 애플리케이션 아키텍처 설계 및 성능 최적화 전략에 대한 심층적인 분석',
    date: '2024.12.26',
    href: '/blog/long-title-current-post',
    isCurrent: true,
  },
};

// 모든 상태 조합
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 w-[840px]">
      <div className="text-lg font-semibold mb-4">관련 포스트 목록 예시</div>

      <RelatedPostRow
        id="prev-post"
        title="이전 포스트 제목"
        date="2024.12.24"
        href="/blog/prev-post"
        isCurrent={false}
      />

      <RelatedPostRow
        id="current-post"
        title="현재 포스트 제목"
        date="2024.12.25"
        href="/blog/current-post"
        isCurrent={true}
      />

      <RelatedPostRow
        id="next-post"
        title="다음 포스트 제목"
        date="2024.12.26"
        href="/blog/next-post"
        isCurrent={false}
      />

      <RelatedPostRow
        id="long-title-post"
        title="매우 긴 제목을 가진 포스트의 예시입니다 - React와 TypeScript를 활용한 개발"
        date="2024.12.27"
        href="/blog/long-title-post"
        isCurrent={false}
      />
    </div>
  ),
};
