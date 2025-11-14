import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { TagList } from './TagList';

const meta: Meta<typeof TagList> = {
  title: 'UI/Blog/TagList',
  component: TagList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '태그 목록과 선택된 태그를 표시하는 분자 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tags: {
      description: '표시할 태그 목록',
      control: 'object',
    },
    selectedTags: {
      description: '클릭된(선택된) 태그 목록',
      control: 'object',
    },
    showMore: {
      description: '더보기 표시 여부',
      control: 'boolean',
    },
    initialDisplayCount: {
      description: '초기에 보여줄 태그 개수',
      control: 'number',
    },
    loadMoreCount: {
      description: '더보기 클릭 시 추가로 보여줄 태그 개수',
      control: 'number',
    },
    showClearAll: {
      description: '모두지우기 표시 여부',
      control: 'boolean',
    },
    onTagClick: { action: 'onTagClick' },
    onTagRemove: { action: 'onTagRemove' },
    onMoreClick: { action: 'onMoreClick' },
    onClearAll: { action: 'onClearAll' },
  },
} satisfies Meta<typeof TagList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 선택된 태그가 없는 경우
export const NoSelectedTags: Story = {
  args: {
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'JavaScript'],
    selectedTags: [],
    showMore: true,
    showClearAll: true,
  },
};

// 더보기와 모두지우기가 없는 경우
export const MinimalOptions: Story = {
  args: {
    tags: ['React', 'Next.js'],
    selectedTags: ['React'],
    showMore: false,
    showClearAll: false,
  },
};

// 많은 태그가 있는 경우 (더보기 기능 테스트)
export const ManyTags: Story = {
  args: {
    tags: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Tailwind',
      'CSS',
      'HTML',
      'Node.js',
      'Express',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'AWS',
      'Git',
      'GitHub',
      'Webpack',
      'Vite',
      'Jest',
      'Cypress',
      'Storybook',
      'GraphQL',
      'Apollo',
      'Redux',
      'Zustand',
      'Prisma',
      'Python',
      'Django',
      'FastAPI',
      'Machine Learning',
      'AI',
    ],
    selectedTags: ['React', 'TypeScript', 'Tailwind'],
    showMore: true,
    showClearAll: true,
    initialDisplayCount: 20,
    loadMoreCount: 10,
  },
};

// 인터랙티브 예제
export const Interactive: Story = {
  args: {
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    selectedTags: ['React'],
    showMore: true,
    showClearAll: true,
  },
  render: function InteractiveTagList(args) {
    const [selectedTags, setSelectedTags] = React.useState(args.selectedTags || []);

    const handleTagClick = (tag: string) => {
      if (selectedTags.includes(tag)) {
        setSelectedTags(selectedTags.filter(t => t !== tag));
      } else {
        setSelectedTags([...selectedTags, tag]);
      }
    };

    const handleTagRemove = (tag: string) => {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    const handleClearAll = () => {
      setSelectedTags([]);
    };

    return (
      <TagList
        {...args}
        selectedTags={selectedTags}
        onTagClick={handleTagClick}
        onTagRemove={handleTagRemove}
        onClearAll={handleClearAll}
      />
    );
  },
};

// 반응형 너비 테스트
export const ResponsiveWidth: Story = {
  args: {
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'JavaScript'],
    selectedTags: ['React', 'TypeScript'],
    showMore: true,
    showClearAll: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'lg 이상에서는 246px 고정 너비, lg 이하에서는 100% 너비를 사용합니다.',
      },
    },
  },
};
