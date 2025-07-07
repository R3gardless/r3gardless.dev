import type { Meta, StoryObj } from '@storybook/react';

import { PaginationNumberButton } from './PaginationNumberButton';

const meta: Meta<typeof PaginationNumberButton> = {
  title: 'Components/Atoms/PaginationNumberButton',
  component: PaginationNumberButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1, max: 100 },
      description: '현재 페이지 번호 (1부터 시작)',
    },
    totalPages: {
      control: { type: 'number', min: 1, max: 100 },
      description: '전체 페이지 수',
    },
    maxPageNumbers: {
      control: { type: 'number', min: 5, max: 15 },
      description: '표시할 페이지 번호의 최대 개수',
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '크기 설정',
    },
    onPageChange: {
      action: 'pageChanged',
      description: '페이지 변경 시 호출되는 콜백 함수',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    maxPageNumbers: 7,
    disabled: false,
    size: 'md',
  },
};

export const SmallSize: Story = {
  args: {
    currentPage: 3,
    totalPages: 8,
    maxPageNumbers: 7,
    disabled: false,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    currentPage: 4,
    totalPages: 12,
    maxPageNumbers: 7,
    disabled: false,
    size: 'lg',
  },
};

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 20,
    maxPageNumbers: 7,
    disabled: false,
    size: 'md',
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    maxPageNumbers: 7,
    disabled: false,
    size: 'md',
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 20,
    totalPages: 20,
    maxPageNumbers: 7,
    disabled: false,
    size: 'md',
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 2,
    totalPages: 5,
    maxPageNumbers: 7,
    disabled: false,
    size: 'md',
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    maxPageNumbers: 7,
    disabled: false,
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    maxPageNumbers: 7,
    disabled: true,
    size: 'md',
  },
};

export const MaxPageNumbers5: Story = {
  args: {
    currentPage: 8,
    totalPages: 20,
    maxPageNumbers: 5,
    disabled: false,
    size: 'md',
  },
};

export const MaxPageNumbers11: Story = {
  args: {
    currentPage: 10,
    totalPages: 30,
    maxPageNumbers: 11,
    disabled: false,
    size: 'md',
  },
};
