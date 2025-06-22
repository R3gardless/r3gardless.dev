import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { TagButton } from './TagButton';

const meta = {
  title: 'Components/Atoms/TagButton',
  component: TagButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TagButton>;

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
 *
export const Dark: Story = {
  args: {
    text: 'React',
    theme: 'dark',
  },
};

/**
 * 라이트 테마 클릭된 태그 (X 아이콘 포함)
 */
export const LightClicked: Story = {
  args: {
    text: 'Nextjs',
    theme: 'light',
    isClicked: true,
    onRemove: () => {
      console.log('Tag removed');
    },
  },
};

/**
 * 다크 테마 클릭된 태그 (X 아이콘 포함)
 */
export const DarkClicked: Story = {
  args: {
    text: 'React',
    theme: 'dark',
    isClicked: true,
    onRemove: () => {
      console.log('Tag removed');
    },
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
 * 여러 태그 모음 예시 (일반 + 클릭된 상태)
 */
export const MultipleTags: Story = {
  render: args => (
    <div className="flex flex-wrap gap-2">
      <TagButton {...args} text="Nextjs" />
      <TagButton
        {...args}
        text="React"
        isClicked={true}
        onRemove={() => {
          console.log('React tag removed');
        }}
      />
      <TagButton {...args} text="TypeScript" />
      <TagButton
        {...args}
        text="Tailwind"
        isClicked={true}
        onRemove={() => {
          console.log('Tailwind tag removed');
        }}
      />
      <TagButton {...args} text="CSS" />
    </div>
  ),
  args: {
    theme: 'light',
    text: 'Nextjs', // 기본값으로 text 추가 (render에서 개별적으로 덮어씀)
  },
};

/**
 * 인터랙티브 태그 예시 - 클릭하면 상태가 토글됩니다
 */
export const Interactive: Story = {
  render: function InteractiveTag(args) {
    const [isClicked, setIsClicked] = React.useState(false);

    return (
      <TagButton
        {...args}
        isClicked={isClicked}
        onClick={() => {
          setIsClicked(!isClicked);
        }}
        onRemove={() => {
          setIsClicked(false);
          console.log('Tag removed');
        }}
      />
    );
  },
  args: {
    text: 'Interactive',
    theme: 'light',
  },
};
