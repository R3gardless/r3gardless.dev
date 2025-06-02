import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta = {
  title: 'UI/Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text', 'icon'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Primary 버튼
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '둘러보기',
  },
};

/**
 * Secondary 버튼
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '취소',
  },
};

/**
 * Text 버튼 (+ 더보기 스타일)
 */
export const Text: Story = {
  args: {
    variant: 'text',
    children: '+ 더보기',
  },
};

/**
 * 아이콘 버튼
 */
export const Icon: Story = {
  args: {
    variant: 'icon',
    children: '🔍',
  },
};

/**
 * 로딩 상태 버튼
 */
export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: '로딩중...',
  },
};

/**
 * 비활성화 버튼
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: '비활성화',
  },
};

/**
 * 전체 너비 버튼
 */
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    fullWidth: true,
    children: '전체 너비 버튼',
  },
  decorators: [
    Story => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 다양한 크기 버튼들
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="primary" size="sm">
        Small
      </Button>
      <Button variant="primary" size="md">
        Medium
      </Button>
      <Button variant="primary" size="lg">
        Large
      </Button>
    </div>
  ),
};

/**
 * 다크 테마 버튼들
 */
export const DarkTheme: Story = {
  render: () => (
    <div
      data-theme="dark"
      className="p-6 rounded-lg space-y-4"
      style={{ backgroundColor: '#08031b' }}
    >
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="text">+ 더보기</Button>
        <Button variant="icon">🔍</Button>
      </div>
    </div>
  ),
};

/**
 * 모든 버튼 변형들
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="text">+ 더보기</Button>
        <Button variant="icon">🔍</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="primary" loading>
          Loading
        </Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </div>
    </div>
  ),
};
