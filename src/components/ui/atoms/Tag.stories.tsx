import type { Meta, StoryObj } from '@storybook/react';

import { Tag } from './Tag';

const meta = {
  title: 'UI/Atoms/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * 라이트 테마 태그 (기본값)
 */
export const Light: Story = {
  args: {
    text: 'Nextjs',
    theme: 'light',
  },
};

/**
 * 다크 테마 태그
 */
export const Dark: Story = {
  args: {
    text: 'React',
    theme: 'dark',
  },
};

/**
 * 해시태그(#) 미리 포함된 텍스트
 */
export const WithHash: Story = {
  args: {
    text: '#TypeScript',
    theme: 'light',
  },
};

/**
 * 여러 태그 모음 예시
 */
export const MultipleTags: Story = {
  render: args => (
    <div className="flex flex-wrap gap-2">
      <Tag {...args} text="Nextjs" />
      <Tag {...args} text="React" />
      <Tag {...args} text="TypeScript" />
      <Tag {...args} text="Tailwind" />
      <Tag {...args} text="CSS" />
    </div>
  ),
  args: {
    theme: 'light',
    text: 'Nextjs', // 기본값으로 text 추가 (render에서 개별적으로 덮어씀)
  },
};
