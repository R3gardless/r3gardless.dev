import type { Meta, StoryObj } from '@storybook/react';

import { TableOfContentsItem } from '@/types/blog';

import { TableOfContents } from './TableOfContents';

const meta = {
  title: 'UI/Blog/TableOfContents',
  component: TableOfContents,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: '목차 항목들',
    },
    activeId: {
      description: '현재 활성화된 항목의 ID',
    },
  },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockItems: TableOfContentsItem[] = [
  {
    id: 'section-1',
    title: 'ABCD is good?',
    level: 1,
    children: [
      {
        id: 'section-1-1',
        title: 'why ABCD is good?',
        level: 2,
        children: [
          {
            id: 'section-1-1-1',
            title: 'Reason',
            level: 3,
          },
          {
            id: 'section-1-1-2',
            title: 'Very long title that should be truncated with ellipsis when it overflows',
            level: 3,
          },
        ],
      },
    ],
  },
  {
    id: 'section-2',
    title: 'ABCD is Bad?',
    level: 1,
    children: [
      {
        id: 'section-2-1',
        title: 'why ABCD is bad?',
        level: 2,
        children: [
          {
            id: 'section-2-1-1',
            title: 'Reason',
            level: 3,
          },
        ],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    items: mockItems,
    activeId: 'section-1',
  },
};

export const WithIcons: Story = {
  args: {
    items: mockItems,
    activeId: 'section-1-1',
    onCommentClick: () => alert('댓글 클릭'),
  },
};
