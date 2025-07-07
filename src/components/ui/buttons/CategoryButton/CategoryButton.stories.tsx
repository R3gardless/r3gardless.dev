import type { Meta, StoryObj } from '@storybook/react';

import { CategoryButton } from './CategoryButton';

const meta: Meta<typeof CategoryButton> = {
  title: 'UI/Buttons/CategoryButton',
  component: CategoryButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: '버튼 레이아웃 방향',
    },
    isSelected: {
      control: { type: 'boolean' },
      description: '버튼이 선택된 상태인지 여부',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    children: {
      control: { type: 'text' },
      description: '카테고리 버튼 텍스트',
    },
  },
  args: {
    children: 'React',
    isSelected: false,
    variant: 'horizontal',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof CategoryButton>;

// 기본 스토리
export const Default: Story = {};

// Horizontal 레이아웃
export const Horizontal: Story = {
  args: {
    variant: 'horizontal',
  },
};

export const HorizontalSelected: Story = {
  args: {
    variant: 'horizontal',
    isSelected: true,
  },
};

// Vertical 레이아웃
export const Vertical: Story = {
  args: {
    variant: 'vertical',
  },
};

export const VerticalSelected: Story = {
  args: {
    variant: 'vertical',
    isSelected: true,
  },
};

// 비활성화 상태
export const Disabled: Story = {
  args: {
    disabled: true,
    variant: 'horizontal',
  },
};

// 다양한 카테고리 예시
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Horizontal 레이아웃 예시 */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Horizontal Layout</h3>
        <div className="flex space-x-2 border rounded-lg p-4">
          <CategoryButton variant="horizontal" isSelected={false}>
            JavaScript
          </CategoryButton>
          <CategoryButton variant="horizontal" isSelected={true}>
            React
          </CategoryButton>
          <CategoryButton variant="horizontal" isSelected={false}>
            TypeScript
          </CategoryButton>
          <CategoryButton variant="horizontal" disabled>
            Vue.js
          </CategoryButton>
        </div>
      </div>

      {/* Vertical 레이아웃 예시 */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Vertical Layout</h3>
        <div className="w-48 border rounded-lg p-4 space-y-2">
          <CategoryButton variant="vertical" isSelected={false}>
            JavaScript
          </CategoryButton>
          <CategoryButton variant="vertical" isSelected={true}>
            React
          </CategoryButton>
          <CategoryButton variant="vertical" isSelected={false}>
            TypeScript
          </CategoryButton>
          <CategoryButton variant="vertical" disabled>
            Vue.js
          </CategoryButton>
        </div>
      </div>
    </div>
  ),
};
