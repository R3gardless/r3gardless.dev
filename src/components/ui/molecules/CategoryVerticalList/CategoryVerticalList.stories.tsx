import type { Meta, StoryObj } from '@storybook/react';

import { CategoryVerticalList } from './CategoryVerticalList';

const meta = {
  title: 'Components/Molecules/CategoryVerticalList',
  component: CategoryVerticalList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '카테고리 목록을 세로로 표시하는 분자 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    categories: {
      description: '표시할 카테고리 목록',
      control: { type: 'object' },
    },
    selectedCategory: {
      description: '선택된 카테고리',
      control: { type: 'text' },
    },
    showMore: {
      description: '더보기 표시 여부',
      control: { type: 'boolean' },
    },
    onCategoryClick: { action: 'category clicked' },
    onMoreClick: { action: 'more clicked' },
  },
} satisfies Meta<typeof CategoryVerticalList>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultCategories = ['전체', '네트워크', '데이터베이스', '프로그래밍언어'];

export const Default: Story = {
  args: {
    categories: defaultCategories,
    selectedCategory: '전체',
    showMore: true,
  },
};

export const LightMode: Story = {
  args: {
    categories: defaultCategories,
    selectedCategory: '전체',
    showMore: true,
  },
  parameters: {
    docs: {
      description: {
        story: '라이트 모드의 CategoryVerticalList입니다.',
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    categories: defaultCategories,
    selectedCategory: '전체',
    showMore: true,
  },
  parameters: {
    docs: {
      description: {
        story: '다크 모드의 CategoryVerticalList입니다.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};

export const SelectedNetworkCategory: Story = {
  args: {
    categories: defaultCategories,
    selectedCategory: '네트워크',
    showMore: true,
  },
  parameters: {
    docs: {
      description: {
        story: '네트워크 카테고리가 선택된 상태입니다.',
      },
    },
  },
};

export const WithoutMore: Story = {
  args: {
    categories: defaultCategories,
    selectedCategory: '전체',
    showMore: false,
  },
  parameters: {
    docs: {
      description: {
        story: '더보기 버튼이 없는 CategoryVerticalList입니다.',
      },
    },
  },
};

export const LongCategoryList: Story = {
  args: {
    categories: [
      '전체',
      '네트워크',
      '데이터베이스',
      '프로그래밍언어',
      '웹개발',
      '모바일개발',
      '데브옵스',
      '머신러닝',
      '인공지능',
    ],
    selectedCategory: '웹개발',
    showMore: true,
  },
  parameters: {
    docs: {
      description: {
        story: '많은 카테고리가 있는 CategoryVerticalList입니다.',
      },
    },
  },
};
