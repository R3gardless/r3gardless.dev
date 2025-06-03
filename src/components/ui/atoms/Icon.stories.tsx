import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon, LucideIconName } from './Icon';

// ✅ 지원하는 8개 아이콘들
const supportedIcons: LucideIconName[] = [
  'Search',
  'ChevronUp',
  'ChevronDown',
  'ChevronLeft',
  'ChevronRight',
  'Ellipsis',
  'ArrowDownRight',
  'CircleX',
];

const meta = {
  title: 'UI/Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Lucide React 아이콘을 기반으로 한 범용 Icon 컴포넌트입니다. ' +
          '8개의 필수 아이콘(Search, Chevron 방향, Ellipsis, ArrowDownRight, CircleX)을 지원합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: supportedIcons,
      description: 'Lucide 아이콘 이름을 선택합니다',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '아이콘의 크기를 결정합니다',
    },
    variant: {
      control: 'select',
      options: ['text', 'primary', 'secondary'],
      description: '아이콘의 시각적 스타일을 결정합니다',
    },
    isActive: {
      control: 'boolean',
      description: '활성화 상태 (carousel indicator에서 현재 슬라이드 표시용)',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '다크모드 테마 설정',
    },
    strokeWidth: {
      control: { type: 'range', min: 0.5, max: 4, step: 0.5 },
      description: 'Lucide 아이콘의 선 굵기',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// ✅ 기본 스토리 - args를 통해 iconName 변경 가능
export const Default: Story = {
  args: {
    name: 'Search',
    size: 'md',
    variant: 'text',
    isActive: false,
    disabled: false,
    theme: 'light',
    strokeWidth: 2,
  },
};

// ✅ 크기 비교 스토리
export const Sizes: Story = {
  args: {
    name: 'Ellipsis',
    variant: 'text',
    isActive: true,
  },
  render: args => (
    <div
      className="flex gap-4 items-center p-4"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} size="sm" />
        <span className="text-xs opacity-70">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} size="md" />
        <span className="text-xs opacity-70">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} size="lg" />
        <span className="text-xs opacity-70">lg</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} size="xl" />
        <span className="text-xs opacity-70">xl</span>
      </div>
    </div>
  ),
};

// ✅ Variant 비교 스토리
export const Variants: Story = {
  args: {
    name: 'ChevronRight',
    size: 'lg',
    isActive: true,
  },
  parameters: {
    docs: {
      description: {
        story: '다양한 variant showcase',
      },
    },
  },
  render: args => (
    <div
      className="flex gap-6 items-center p-4"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} variant="text" />
        <span className="text-xs opacity-70">text</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} variant="primary" />
        <span className="text-xs opacity-70">primary</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} variant="secondary" />
        <span className="text-xs opacity-70">secondary</span>
      </div>
    </div>
  ),
};

// ✅ 화살표 및 방향 아이콘들
export const DirectionalIcons: Story = {
  args: {
    size: 'md',
    variant: 'text',
    isActive: true,
  },
  render: args => (
    <div
      className="flex gap-4 items-center p-4"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} name="ChevronUp" />
        <span className="text-xs opacity-70">ChevronUp</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} name="ChevronRight" />
        <span className="text-xs opacity-70">ChevronRight</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} name="ChevronDown" />
        <span className="text-xs opacity-70">ChevronDown</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} name="ChevronLeft" />
        <span className="text-xs opacity-70">ChevronLeft</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} name="ArrowDownRight" />
        <span className="text-xs opacity-70">ArrowDownRight</span>
      </div>
    </div>
  ),
};

// ✅ 지원하는 아이콘들 쇼케이스
export const SupportedIcons: Story = {
  args: {
    size: 'md',
    variant: 'text',
    isActive: true,
  },
  render: args => (
    <div
      className="grid grid-cols-4 gap-4 p-4"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      {supportedIcons.map(iconName => (
        <div key={iconName} className="flex flex-col items-center gap-2">
          <Icon {...args} name={iconName} />
          <span className="text-xs opacity-70 text-center">{iconName}</span>
        </div>
      ))}
    </div>
  ),
};

// ✅ 활성 상태 비교
export const ActiveStates: Story = {
  args: {
    name: 'Search',
    size: 'md',
    variant: 'text',
  },
  render: args => (
    <div
      className="flex gap-6 items-center p-4"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} isActive={false} />
        <span className="text-xs opacity-70">Inactive</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} isActive={true} />
        <span className="text-xs opacity-70">Active</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} disabled={true} />
        <span className="text-xs opacity-70">Disabled</span>
      </div>
    </div>
  ),
};

// ✅ Stroke Width 비교
export const StrokeWidths: Story = {
  args: {
    name: 'Ellipsis',
    size: 'lg',
    variant: 'text',
    isActive: true,
  },
  render: args => (
    <div
      className="flex gap-6 items-center p-4"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} strokeWidth={0.5} />
        <span className="text-xs opacity-70">0.5</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} strokeWidth={1} />
        <span className="text-xs opacity-70">1</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} strokeWidth={1.5} />
        <span className="text-xs opacity-70">1.5</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} strokeWidth={2} />
        <span className="text-xs opacity-70">2</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icon {...args} strokeWidth={3} />
        <span className="text-xs opacity-70">3</span>
      </div>
    </div>
  ),
};

// ✅ 다크 테마
export const DarkTheme: Story = {
  args: {
    name: 'Search',
    size: 'lg',
    variant: 'text',
    isActive: true,
    theme: 'dark',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  render: args => (
    <div
      data-theme="dark"
      className="flex gap-4 items-center p-6 rounded-lg"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <Icon {...args} name="Search" />
      <Icon {...args} name="ChevronUp" />
      <Icon {...args} name="Ellipsis" />
      <Icon {...args} name="ArrowDownRight" />
      <Icon {...args} name="CircleX" />
    </div>
  ),
};
