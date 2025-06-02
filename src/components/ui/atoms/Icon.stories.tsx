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
  },
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
  render: () => (
    <div className="flex gap-2 items-center">
      {/* 활성화된 첫 번째 indicator */}
      <Icon type="dot" size="sm" variant="primary" isActive={true} />
      {/* 비활성화된 나머지 indicators */}
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

/* 다양한 타입 showcase (circle 제거됨) */
export const Types: Story = {
  name: 'Different Types',
  render: () => (
    <div className="flex gap-4 items-center">
      <Icon type="dot" size="lg" variant="primary" isActive={true} />
      <Icon type="square" size="lg" variant="primary" isActive={true} />
      <Icon type="triangle" size="lg" variant="primary" isActive={true} />
      <Icon type="diamond" size="lg" variant="primary" isActive={true} />
      <Icon type="arrow" size="lg" variant="primary" direction="right" />
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

/* 다양한 variant showcase */
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

/* 다크 테마 showcase - 더 눈에 띄는 배경색 적용 */
export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: () => (
    <div className="bg-slate-900 border border-slate-700 p-8 rounded-xl">
      <div className="flex gap-6 items-center">
        <div className="flex flex-col items-center gap-2">
          <span className="text-slate-300 text-sm">Dot</span>
          <Icon type="dot" size="xl" variant="text" isActive={true} theme="dark" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-slate-300 text-sm">Square</span>
          <Icon type="square" size="xl" variant="text" isActive={true} theme="dark" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-slate-300 text-sm">Triangle</span>
          <Icon type="triangle" size="xl" variant="text" isActive={true} theme="dark" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-slate-300 text-sm">Diamond</span>
          <Icon type="diamond" size="xl" variant="text" isActive={true} theme="dark" />
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
  render: () => (
    <div className="grid grid-cols-2 gap-6 items-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Right</span>
        <Icon type="arrow" size="lg" variant="primary" direction="right" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Left</span>
        <Icon type="arrow" size="lg" variant="primary" direction="left" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Up</span>
        <Icon type="arrow" size="lg" variant="primary" direction="up" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm">Down</span>
        <Icon type="arrow" size="lg" variant="primary" direction="down" />
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
  render: () => (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs">xs</span>
        <Icon type="arrow" size="xs" variant="primary" direction="right" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs">sm</span>
        <Icon type="arrow" size="sm" variant="primary" direction="right" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs">md</span>
        <Icon type="arrow" size="md" variant="primary" direction="right" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs">lg</span>
        <Icon type="arrow" size="lg" variant="primary" direction="right" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs">xl</span>
        <Icon type="arrow" size="xl" variant="primary" direction="right" />
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
  render: function InteractiveCarouselStory() {
    /* React Hook을 사용하여 활성 상태 관리 */
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
