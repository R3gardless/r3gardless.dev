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
      options: ['dot', 'square', 'triangle', 'diamond', 'arrow'] /* circle 타입 제거됨 */,
      description: '아이콘의 모양을 결정합니다',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
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
    direction: {
      control: 'select',
      options: ['right', 'left', 'up', 'down'],
      description: '화살표 방향 (arrow 타입일 때만 적용)',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/* 기본 스토리 */
export const Default: Story = {
  args: {
    type: 'dot',
    size: 'md',
    variant: 'primary',
    isActive: true,
    theme: 'light',
  },
  render: args => (
    <div
      data-theme={args.theme}
      className="p-4 rounded-lg"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <Icon {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 Icon 컴포넌트입니다.',
      },
    },
  },
};

/* Carousel Indicator 용도 스토리 */
export const CarouselIndicator: Story = {
  name: 'Carousel Indicator',
  args: {
    type: 'dot',
    size: 'sm',
    variant: 'primary',
    theme: 'light',
  },
  render: args => (
    <div
      data-theme={args.theme}
      className="p-6 rounded-lg"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex gap-2 items-center">
        {/* 활성화된 첫 번째 indicator */}
        <Icon {...args} isActive={true} />
        {/* 비활성화된 나머지 indicators */}
        <Icon {...args} isActive={false} />
        <Icon {...args} isActive={false} />
        <Icon {...args} isActive={false} />
      </div>
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

/* 다양한 타입 showcase (circle 제거됨) */
export const Types: Story = {
  name: 'Different Types',
  args: {
    size: 'lg',
    variant: 'primary',
    isActive: true,
    theme: 'light',
  },
  render: args => (
    <div
      data-theme={args.theme}
      className="p-6 rounded-lg"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex gap-4 items-center">
        <Icon {...args} type="dot" />
        <Icon {...args} type="square" />
        <Icon {...args} type="triangle" />
        <Icon {...args} type="diamond" />
        <Icon {...args} type="arrow" direction="right" />
      </div>
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

/* 다양한 크기 showcase */
export const Sizes: Story = {
  name: 'Different Sizes',
  args: {
    type: 'dot',
    variant: 'primary',
    isActive: true,
    theme: 'light',
  },
  render: args => (
    <div
      data-theme={args.theme}
      className="p-6 rounded-lg"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex gap-4 items-center">
        <Icon {...args} size="xs" />
        <Icon {...args} size="sm" />
        <Icon {...args} size="md" />
        <Icon {...args} size="lg" />
        <Icon {...args} size="xl" />
      </div>
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

/* 다양한 variant showcase */
export const Variants: Story = {
  name: 'Different Variants',
  args: {
    type: 'dot',
    size: 'md',
    isActive: true,
    theme: 'light',
  },
  render: args => (
    <div
      data-theme={args.theme}
      className="p-6 rounded-lg"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Primary</span>
          <Icon {...args} variant="primary" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Secondary</span>
          <Icon {...args} variant="secondary" />
        </div>
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

/* 활성화/비활성화 상태 showcase */
export const ActiveStates: Story = {
  name: 'Active vs Inactive',
  args: {
    type: 'dot',
    size: 'lg',
    variant: 'primary',
    theme: 'light',
  },
  render: args => (
    <div
      data-theme={args.theme}
      className="p-6 rounded-lg"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex gap-6 items-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Active</span>
          <Icon {...args} isActive={true} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Inactive</span>
          <Icon {...args} isActive={false} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Disabled</span>
          <Icon {...args} isActive={true} disabled={true} />
        </div>
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

/* 다크 테마 showcase - 더 눈에 띄는 배경색 적용 */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  args: {
    size: 'xl',
    variant: 'text',
    isActive: true,
    theme: 'dark',
  },
  render: args => (
    <div
      data-theme="dark"
      className="p-8 rounded-xl border"
      style={{
        backgroundColor: 'var(--color-background)',
        borderColor: 'var(--color-primary)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex gap-6 items-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Dot</span>
          <Icon {...args} type="dot" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Square</span>
          <Icon {...args} type="square" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Triangle</span>
          <Icon {...args} type="triangle" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Diamond</span>
          <Icon {...args} type="diamond" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '다크 테마에서의 아이콘 표시를 보여줍니다. 더 진한 배경으로 아이콘이 잘 보이도록 처리되었습니다.',
      },
    },
  },
};

/* 다양한 방향의 arrow 아이콘 showcase */
export const ArrowDirections: Story = {
  name: 'Arrow Directions',
  args: {
    type: 'arrow',
    size: 'lg',
    variant: 'primary',
    theme: 'light',
  },
  render: args => (
    <div
      data-theme={args.theme}
      className="p-6 rounded-lg"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="grid grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Right</span>
          <Icon {...args} direction="right" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Left</span>
          <Icon {...args} direction="left" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Up</span>
          <Icon {...args} direction="up" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm opacity-70">Down</span>
          <Icon {...args} direction="down" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '화살표 아이콘의 4가지 방향(right, left, up, down)을 보여줍니다.',
      },
    },
  },
};

/* arrow 아이콘의 다양한 크기 showcase */
export const ArrowSizes: Story = {
  name: 'Arrow Sizes',
  args: {
    type: 'arrow',
    variant: 'primary',
    direction: 'right',
    theme: 'light',
  },
  render: args => (
    <div
      data-theme={args.theme}
      className="p-6 rounded-lg"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
      }}
    >
      <div className="flex gap-4 items-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs opacity-70">xs</span>
          <Icon {...args} size="xs" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs opacity-70">sm</span>
          <Icon {...args} size="sm" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs opacity-70">md</span>
          <Icon {...args} size="md" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs opacity-70">lg</span>
          <Icon {...args} size="lg" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs opacity-70">xl</span>
          <Icon {...args} size="xl" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '화살표 아이콘의 다양한 크기를 보여줍니다.',
      },
    },
  },
};

/* 상호작용이 있는 carousel indicator 시뮬레이션 */
export const InteractiveCarousel: Story = {
  name: 'Interactive Carousel Indicator',
  args: {
    type: 'dot',
    size: 'sm',
    variant: 'primary',
    theme: 'light',
  },
  render: function InteractiveCarouselStory(args) {
    /* React Hook을 사용하여 활성 상태 관리 */
    const [activeIndex, setActiveIndex] = React.useState(0);
    const indicators = [0, 1, 2, 3, 4];

    return (
      <div
        data-theme={args.theme}
        className="p-6 rounded-lg"
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text)',
        }}
      >
        <div className="flex gap-2 items-center">
          {indicators.map(index => (
            <Icon
              key={index}
              {...args}
              isActive={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className="cursor-pointer"
            />
          ))}
        </div>
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
