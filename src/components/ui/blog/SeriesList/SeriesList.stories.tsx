import type { Meta, StoryObj } from '@storybook/react';

import { SeriesList } from './SeriesList';

const sampleSeries = [
  { name: 'Notion CMS 블로그 만들기', count: 4 },
  { name: 'Vector Search 파헤치기', count: 3 },
  { name: 'Next.js 정적 블로그 운영기', count: 2 },
];

const meta: Meta<typeof SeriesList> = {
  title: 'UI/Blog/SeriesList',
  component: SeriesList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '블로그 사이드바에서 시리즈(글 묶음) 목록을 표시하는 분자 컴포넌트입니다. 시리즈 이름과 포스트 개수를 보여주고, 선택된 시리즈를 다시 클릭하면 해제됩니다.',
      },
    },
  },
  argTypes: {
    series: {
      description: '표시할 시리즈 목록 (이름과 포스트 개수)',
      control: 'object',
    },
    selectedSeries: {
      description: '선택된 시리즈 이름',
      control: 'text',
    },
    lang: {
      description: '렌더링 언어',
      control: 'select',
      options: ['kr', 'en', 'ja'],
    },
    showMore: {
      description: '더보기 표시 여부',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SeriesList>;

/**
 * 기본 상태
 */
export const Default: Story = {
  args: {
    series: sampleSeries,
  },
};

/**
 * 시리즈가 선택된 상태
 */
export const Selected: Story = {
  args: {
    series: sampleSeries,
    selectedSeries: 'Vector Search 파헤치기',
  },
};

/**
 * 영어 라벨
 */
export const English: Story = {
  args: {
    series: sampleSeries,
    lang: 'en',
  },
};

/**
 * 더보기 버튼 표시 (초기 표시 개수 초과)
 */
export const WithLoadMore: Story = {
  args: {
    series: [
      ...sampleSeries,
      { name: 'Kubernetes 삽질기', count: 5 },
      { name: 'Rust로 CLI 만들기', count: 2 },
      { name: 'LLM 블로그 자동화', count: 6 },
    ],
    initialDisplayCount: 5,
  },
};
