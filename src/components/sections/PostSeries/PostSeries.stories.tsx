import type { Meta, StoryObj } from '@storybook/react';

import { PostSeries } from './PostSeries';
import type { PostSeriesPost } from './PostSeries';

const samplePosts: PostSeriesPost[] = [
  {
    id: 1,
    title: 'Notion CMS 블로그 만들기 1편 - 왜 Notion인가',
    href: '/blog/notion-cms-blog-1',
  },
  {
    id: 2,
    title: 'Notion CMS 블로그 만들기 2편 - 콘텐츠 파이프라인 설계',
    href: '/blog/notion-cms-blog-2',
  },
  {
    id: 3,
    title: 'Notion CMS 블로그 만들기 3편 - Markdown 렌더링',
    href: '/blog/notion-cms-blog-3',
  },
  {
    id: 4,
    title: 'Notion CMS 블로그 만들기 4편 - 4개월 회고',
    href: '/blog/notion-cms-blog-4',
  },
];

const meta: Meta<typeof PostSeries> = {
  title: 'Sections/PostSeries',
  component: PostSeries,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '포스트가 속한 시리즈(글 묶음)를 표시하는 organism 컴포넌트입니다. 시리즈 이름과 현재 위치(n / m)를 항상 보여주고, 헤더 클릭 시 시리즈 전체 목록을 펼칠 수 있습니다.',
      },
    },
  },
  argTypes: {
    name: {
      description: '시리즈 이름',
      control: 'text',
    },
    posts: {
      description: '시리즈에 속한 포스트 목록 (시리즈 순서대로 정렬된 상태)',
      control: 'object',
    },
    currentPostId: {
      description: '현재 읽고 있는 포스트 ID',
      control: 'number',
    },
    lang: {
      description: '렌더링 언어',
      control: 'select',
      options: ['kr', 'en', 'ja'],
    },
    defaultExpanded: {
      description: '초기 펼침 여부',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PostSeries>;

/**
 * 기본 상태 (접힌 상태)
 */
export const Default: Story = {
  args: {
    name: 'Notion CMS 블로그 만들기',
    posts: samplePosts,
    currentPostId: 2,
  },
};

/**
 * 펼친 상태 - 현재 글 강조와 다른 편으로의 이동 링크
 */
export const Expanded: Story = {
  args: {
    ...Default.args,
    defaultExpanded: true,
  },
};

/**
 * 첫 번째 글을 읽는 중
 */
export const FirstPost: Story = {
  args: {
    ...Default.args,
    currentPostId: 1,
    defaultExpanded: true,
  },
};

/**
 * 영어 라벨
 */
export const English: Story = {
  args: {
    ...Default.args,
    lang: 'en',
    defaultExpanded: true,
  },
};

/**
 * 일본어 라벨
 */
export const Japanese: Story = {
  args: {
    ...Default.args,
    lang: 'ja',
    defaultExpanded: true,
  },
};

/**
 * 긴 시리즈 이름과 긴 포스트 제목 (truncate 확인)
 */
export const LongTitles: Story = {
  args: {
    name: '아주 길고 장황한 시리즈 이름이 들어갔을 때 말줄임이 잘 동작하는지 확인하기 위한 시리즈',
    posts: [
      {
        id: 1,
        title:
          '아주 길고 장황한 포스트 제목이 들어갔을 때 말줄임이 잘 동작하는지 확인하기 위한 첫 번째 포스트입니다',
        href: '/blog/long-title-1',
      },
      ...samplePosts.slice(1),
    ],
    currentPostId: 1,
    defaultExpanded: true,
  },
};
