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
 * 기본 태그
 */
export const Default: Story = {
  args: {
    text: 'Nextjs',
  },
};

/**
 * 클릭된 태그 (X 아이콘 포함)
 */
export const Clicked: Story = {
  args: {
    text: 'React',
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
  },
};

/**
 * 여러 태그 모음 예시 (일반 + 클릭된 상태)
 */
export const MultipleTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TagButton text="Nextjs" />
      <TagButton
        text="React"
        isClicked={true}
        onRemove={() => {
          console.log('React tag removed');
        }}
      />
      <TagButton text="TypeScript" />
      <TagButton
        text="Tailwind"
        isClicked={true}
        onRemove={() => {
          console.log('Tailwind tag removed');
        }}
      />
      <TagButton text="CSS" />
    </div>
  ),
  args: {
    text: 'Default',
  },
};

/**
 * 인터랙티브 태그 예시 - 클릭하면 상태가 토글됩니다
 */
export const Interactive: Story = {
  render: function InteractiveTag() {
    const [isClicked, setIsClicked] = React.useState(false);

    return (
      <TagButton
        text="Interactive"
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
  },
};
