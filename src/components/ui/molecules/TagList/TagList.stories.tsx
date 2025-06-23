import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { TagList } from './TagList';

const meta: Meta<typeof TagList> = {
  title: 'Components/Molecules/TagList',
  component: TagList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '태그 목록과 선택된 태그를 표시하는 분자 컴포넌트입니다.',
      },
    },
  },
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
    showClearAll: {
      description: '모두지우기 표시 여부',
      control: 'boolean',
    },
    onTagClick: { action: 'onTagClick' },
    onTagRemove: { action: 'onTagRemove' },
    onMoreClick: { action: 'onMoreClick' },
    onClearAll: { action: 'onClearAll' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TagList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 라이트 테마
export const Light: Story = {
  args: {
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    selectedTags: ['Next.js'],
    showMore: true,
    showClearAll: true,
  },
};

// 다크 테마
export const Dark: Story = {
  args: {
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    selectedTags: ['Next.js'],
    showMore: true,
    showClearAll: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

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

// 많은 태그가 있는 경우
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
    ],
    selectedTags: ['React', 'TypeScript', 'Tailwind'],
    showMore: true,
    showClearAll: true,
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
