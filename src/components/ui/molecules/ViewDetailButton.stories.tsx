import type { Meta, StoryObj } from '@storybook/react';

import { ViewDetailButton } from './ViewDetailButton';

const meta: Meta<typeof ViewDetailButton> = {
  title: 'UI/Molecules/ViewDetailButton',
  component: ViewDetailButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '화살표 아이콘과 애니메이션이 포함된 자세히보기 버튼 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: '버튼에 표시될 텍스트',
    },
    animated: {
      control: 'boolean',
      description: '화살표 애니메이션 활성화 여부',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text', 'icon'],
      description: '버튼의 시각적 스타일',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '버튼의 크기',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ViewDetailButton>;

export const Default: Story = {
  args: {
    text: '자세히보기',
    variant: 'text',
    size: 'sm',
    animated: true,
  },
};

export const Primary: Story = {
  args: {
    text: '자세히보기',
    variant: 'primary',
    size: 'md',
    animated: true,
  },
};

export const Secondary: Story = {
  args: {
    text: '자세히보기',
    variant: 'secondary',
    size: 'md',
    animated: true,
  },
};

export const Large: Story = {
  args: {
    text: '자세히보기',
    variant: 'primary',
    size: 'lg',
    animated: true,
  },
};

export const WithoutAnimation: Story = {
  args: {
    text: '자세히보기',
    variant: 'text',
    size: 'sm',
    animated: false,
  },
};

export const Disabled: Story = {
  args: {
    text: '자세히보기',
    variant: 'primary',
    size: 'md',
    animated: true,
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    text: '자세히보기',
    variant: 'primary',
    size: 'md',
    animated: true,
    loading: true,
  },
};

export const FullWidth: Story = {
  args: {
    text: '자세히보기',
    variant: 'primary',
    size: 'md',
    animated: true,
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const CustomText: Story = {
  args: {
    text: '상세 정보 보기',
    variant: 'secondary',
    size: 'md',
    animated: true,
  },
};

export const InteractiveDemo: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold mb-2">호버해서 애니메이션을 확인해보세요</h3>
      </div>
      <div className="flex gap-4 items-center justify-center">
        <ViewDetailButton text="자세히보기" variant="text" animated={true} />
        <ViewDetailButton text="자세히보기" variant="primary" animated={true} />
        <ViewDetailButton text="자세히보기" variant="secondary" animated={true} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 variants의 애니메이션 효과를 한번에 확인할 수 있습니다.',
      },
    },
  },
};
