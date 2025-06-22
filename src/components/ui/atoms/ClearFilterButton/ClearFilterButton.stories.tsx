import type { Meta, StoryObj } from '@storybook/react';

import { ClearFilterButton } from './ClearFilterButton';

const meta: Meta<typeof ClearFilterButton> = {
  title: 'Components/Atoms/ClearFilterButton',
  component: ClearFilterButton,
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
 * 기본 모두지우기 버튼
 */
export const Default: Story = {
  args: {
    text: '모두지우기',
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
    text: '모든 선택 해제',
    theme: 'light',
  },
};

/**
 * 다크 테마
 */
export const DarkTheme: Story = {
  args: {
    text: '모두지우기',
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
    text: '모두지우기',
    theme: 'light',
    loading: true,
  },
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    text: '모두지우기',
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
      <ClearFilterButton text="지우기" />
      <ClearFilterButton text="모두지우기" />
      <ClearFilterButton text="모든 선택 해제" />
      <ClearFilterButton text="Clear All Filters" />
      <ClearFilterButton text="Reset All" />
    </div>
  ),
};

/**
 * 사용 시나리오 - 선택된 항목이 있을 때만 표시
 */
export const ConditionalDisplay: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">선택된 태그: 3개</span>
        <ClearFilterButton text="모두지우기" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">적용된 필터: 없음</span>
        <span className="text-xs text-gray-400">(버튼 숨김)</span>
      </div>
    </div>
  ),
};
