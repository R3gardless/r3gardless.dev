import type { Meta, StoryObj } from '@storybook/react';

import { Header } from './Header';

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Header 컴포넌트는 Figma 디자인을 기반으로 구현된 헤더입니다.

## 특징
- 로고 (config에서 가져옴)
- 네비게이션 메뉴 (About, Blog)
- 테마 토글 버튼 (라이트/다크 모드)
- 현재 페이지에 따른 bold 처리
- 반응형 햄버거 메뉴 (모바일)
- MaruBuri 폰트 사용
- CSS 변수를 통한 테마 지원

## 디자인 스펙
- 높이: 100px
- 최대 너비: 1300px
- 좌우 패딩: 70px
- 상하 패딩: 32px
- 로고 폰트: MaruBuri Bold text-3xl (30px)
- 메뉴 폰트: MaruBuri Bold/Normal text-xl (데스크톱), text-lg (모바일)
- 반응형 브레이크포인트: md (768px)
- 모바일 메뉴: 우측 슬라이드 패널 (200px 고정 너비)
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Header
 */
export const Default: Story = {
  args: {},
};

/**
 * 커스텀 클래스가 적용된 Header
 */
export const WithCustomClass: Story = {
  args: {
    className: 'border-b border-gray-200',
  },
};

/**
 * About 페이지에서의 Header (About 메뉴가 bold 처리됨)
 */
export const AboutPage: Story = {
  args: {},
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/about',
      },
    },
  },
};

/**
 * Blog 페이지에서의 Header (Blog 메뉴가 bold 처리됨)
 */
export const BlogPage: Story = {
  args: {},
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/blog',
      },
    },
  },
};
