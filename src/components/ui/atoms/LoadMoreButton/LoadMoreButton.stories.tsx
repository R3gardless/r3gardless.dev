import type { Meta, StoryObj } from '@storybook/react';

import { LoadMoreButton } from './LoadMoreButton';

const meta: Meta<typeof LoadMoreButton> = {
  title: 'Components/Atoms/LoadMoreButton',
  component: LoadMoreButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: '버튼에 표시될 텍스트',
    },
    theme: {
      control: 'radio',
      options: ['light', 'dark'],
      description: '테마 모드',
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 더보기 버튼
 */
export const Default: Story = {
  args: {
    text: '+ 더보기',
    theme: 'light',
    loading: false,
    disabled: false,
  },
};

/**
 * 커스텀 텍스트
 */
export const CustomText: Story = {
  args: {
    text: '더 많은 태그 보기',
    theme: 'light',
  },
};

/**
 * 다크 테마
 */
export const DarkTheme: Story = {
  args: {
    text: '+ 더보기',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * 로딩 상태
 */
export const Loading: Story = {
  args: {
    text: '+ 더보기',
    theme: 'light',
    loading: true,
  },
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    text: '+ 더보기',
    theme: 'light',
    disabled: true,
  },
};

/**
 * 다양한 텍스트 길이
 */
export const VariousTextLengths: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <LoadMoreButton text="+" />
      <LoadMoreButton text="더보기" />
      <LoadMoreButton text="+ 더보기" />
      <LoadMoreButton text="더 많은 콘텐츠 보기" />
      <LoadMoreButton text="Load More Content" />
    </div>
  ),
};
