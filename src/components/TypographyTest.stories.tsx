import type { Meta, StoryObj } from '@storybook/react';

import TypographyTest from './TypographyTest';

const meta: Meta<typeof TypographyTest> = {
  title: 'Test/TypographyTest',
  component: TypographyTest,
  tags: ['autodocs'],
  args: {
    theme: 'light', // 기본값을 light로 설정
  },
  argTypes: {
    theme: {
      control: { type: 'radio' },
      options: ['light', 'dark'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof TypographyTest>;

export const Light: Story = {
  args: {
    theme: 'light',
  },
};

export const Dark: Story = {
  args: {
    theme: 'dark',
  },
};
