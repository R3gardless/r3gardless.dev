import type { Meta, StoryObj } from '@storybook/react';

import AboutHeader from './AboutHeader';

const meta = {
  title: 'Sections/AboutHeader',
  component: AboutHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
AboutHeader는 About 페이지 상단에 위치하는 헤더 컴포넌트입니다.

## 주요 특징
- 📝 About 타이틀 표시
- ✍️ 개발자 소개 문구 표시
- 🎨 MaruBuri 폰트 사용
- 🌓 자동 다크모드 지원
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AboutHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 AboutHeader
 */
export const Default: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

/**
 * 모바일 뷰
 */
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
