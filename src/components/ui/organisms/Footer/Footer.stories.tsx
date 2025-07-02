import type { Meta, StoryObj } from '@storybook/react';

import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Organisms/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '웹사이트 하단 푸터 컴포넌트입니다. 사이트 정보, 연락처, 저작권 정보를 표시합니다.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
    lastUpdate: {
      control: 'text',
      description: '마지막 업데이트 날짜',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {},
};

export const WithCustomUpdate: Story = {
  args: {
    lastUpdate: 'Jul 2, 2025',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 업데이트 날짜를 표시하는 푸터입니다.',
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'border-t-2',
  },
  parameters: {
    docs: {
      description: {
        story: '추가 CSS 클래스가 적용된 푸터입니다.',
      },
    },
  },
};
