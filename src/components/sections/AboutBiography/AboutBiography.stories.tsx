import type { Meta, StoryObj } from '@storybook/react';

import { AboutBiography } from './AboutBiography';

const meta = {
  title: 'Sections/AboutBiography',
  component: AboutBiography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'About 페이지의 Biography 섹션 컴포넌트입니다. 프로필 이미지, 이름, 직책, 소개 텍스트 및 소셜 링크를 표시합니다. CSS variables를 사용하여 테마가 자동으로 전환됩니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutBiography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
