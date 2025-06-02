import type { Meta, StoryObj } from '@storybook/react-vite';

import { ReadMoreButton } from './ReadMoreButton';

const meta: Meta<typeof ReadMoreButton> = {
  title: 'UI/Molecules/ReadMoreButton',
  component: ReadMoreButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '+ 더보기 액션을 위한 간단한 버튼 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: '버튼에 표시될 텍스트',
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
type Story = StoryObj<typeof ReadMoreButton>;

export const Default: Story = {
  args: {
    text: '+ 더보기',
    variant: 'text',
    size: 'sm',
  },
};

export const Primary: Story = {
  args: {
    text: '+ 더보기',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    text: '+ 더보기',
    variant: 'secondary',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    text: '+ 더보기',
    variant: 'primary',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    text: '+ 더보기',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    text: '+ 더보기',
    variant: 'primary',
    size: 'md',
    loading: true,
  },
};

export const FullWidth: Story = {
  args: {
    text: '+ 더보기',
    variant: 'primary',
    size: 'md',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const CustomText: Story = {
  args: {
    text: '더 많은 글 보기',
    variant: 'secondary',
    size: 'md',
  },
};
