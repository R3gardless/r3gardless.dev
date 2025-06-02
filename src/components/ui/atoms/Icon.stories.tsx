import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Icon } from './Icon';

const meta = {
  title: 'UI/Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '범용적으로 사용할 수 있는 Icon 컴포넌트입니다. ' +
          'Carousel indicator dot, 상태 표시, 장식 요소 등에 활용 가능합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['dot', 'circle', 'square', 'triangle', 'diamond'],
      description: '아이콘의 모양을 결정합니다',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '아이콘의 크기를 결정합니다',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'outline'],
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
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// ✅ 기본 스토리
export const Default: Story = {
  args: {
    type: 'dot',
    size: 'md',
    variant: 'primary',
    isActive: false,
  },
};

// ✅ Carousel Indicator 용도
export const CarouselIndicator: Story = {
  name: 'Carousel Indicator',
  render: () => (
    <div className="flex gap-2 items-center">
      <Icon type="dot" size="sm" variant="primary" isActive={true} />
      <Icon type="dot" size="sm" variant="primary" isActive={false} />
      <Icon type="dot" size="sm" variant="primary" isActive={false} />
      <Icon type="dot" size="sm" variant="primary" isActive={false} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Carousel에서 현재 슬라이드를 표시하는 indicator로 사용하는 예시입니다.',
      },
    },
  },
};

// ✅ 다양한 타입 showcase
export const Types: Story = {
  name: 'Different Types',
  render: () => (
    <div className="flex gap-4 items-center">
      <Icon type="dot" size="lg" variant="primary" isActive={true} />
      <Icon type="circle" size="lg" variant="primary" isActive={true} />
      <Icon type="square" size="lg" variant="primary" isActive={true} />
      <Icon type="triangle" size="lg" variant="primary" isActive={true} />
      <Icon type="diamond" size="lg" variant="primary" isActive={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '지원하는 모든 아이콘 타입을 보여줍니다.',
      },
    },
  },
};

// ✅ 다양한 크기 showcase
export const Sizes: Story = {
  name: 'Different Sizes',
  render: () => (
    <div className="flex gap-4 items-center">
      <Icon type="dot" size="xs" variant="primary" isActive={true} />
      <Icon type="dot" size="sm" variant="primary" isActive={true} />
      <Icon type="dot" size="md" variant="primary" isActive={true} />
      <Icon type="dot" size="lg" variant="primary" isActive={true} />
      <Icon type="dot" size="xl" variant="primary" isActive={true} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '지원하는 모든 크기를 보여줍니다.',
      },
    },
  },
};

// ✅ 다양한 variant showcase
export const Variants: Story = {
  name: 'Different Variants',
  render: () => (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Primary</span>
        <Icon type="dot" size="md" variant="primary" isActive={true} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Secondary</span>
        <Icon type="dot" size="md" variant="secondary" isActive={true} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Ghost</span>
        <Icon type="circle" size="md" variant="ghost" isActive={true} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Outline</span>
        <Icon type="circle" size="md" variant="outline" isActive={true} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '지원하는 모든 variant를 보여줍니다.',
      },
    },
  },
};

// ✅ 활성화/비활성화 상태
export const ActiveStates: Story = {
  name: 'Active vs Inactive',
  render: () => (
    <div className="flex gap-6 items-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Active</span>
        <Icon type="dot" size="lg" variant="primary" isActive={true} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Inactive</span>
        <Icon type="dot" size="lg" variant="primary" isActive={false} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Disabled</span>
        <Icon type="dot" size="lg" variant="primary" isActive={true} disabled={true} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '활성화, 비활성화, 그리고 disabled 상태를 보여줍니다.',
      },
    },
  },
};

// ✅ 다크 테마
export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: () => (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="flex gap-4 items-center">
        <Icon type="dot" size="md" variant="primary" isActive={true} theme="dark" />
        <Icon type="dot" size="md" variant="primary" isActive={false} theme="dark" />
        <Icon type="circle" size="md" variant="ghost" isActive={true} theme="dark" />
        <Icon type="square" size="md" variant="outline" isActive={true} theme="dark" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다크 테마에서의 아이콘 표시를 보여줍니다.',
      },
    },
  },
};

// ✅ 상호작용이 있는 carousel indicator 시뮬레이션
export const InteractiveCarousel: Story = {
  name: 'Interactive Carousel Indicator',
  render: function InteractiveCarouselStory() {
    // React Hook은 컴포넌트 함수 내에서만 사용 가능
    const [activeIndex, setActiveIndex] = React.useState(0);
    const indicators = [0, 1, 2, 3, 4];

    return (
      <div className="flex gap-2 items-center">
        {indicators.map(index => (
          <Icon
            key={index}
            type="dot"
            size="sm"
            variant="primary"
            isActive={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            className="cursor-pointer"
          />
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '클릭 가능한 carousel indicator의 예시입니다.',
      },
    },
  },
};
