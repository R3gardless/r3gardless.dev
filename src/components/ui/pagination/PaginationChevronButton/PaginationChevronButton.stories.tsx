import type { Meta, StoryObj } from '@storybook/react';

import { PaginationChevronButton } from './PaginationChevronButton';

const meta: Meta<typeof PaginationChevronButton> = {
  title: 'Components/Atoms/PaginationChevronButton',
  component: PaginationChevronButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '페이지네이션용 chevron 버튼 컴포넌트입니다. 이전/다음 페이지로 이동할 때 사용됩니다.',
      },
    },
  },
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: '화살표 방향',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '크기 설정',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    onClick: {
      action: 'clicked',
      description: '클릭 이벤트 핸들러',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    direction: 'left',
    size: 'md',
    disabled: false,
    'aria-label': '이전 페이지',
  },
};

export const Left: Story = {
  args: {
    direction: 'left',
    size: 'md',
    disabled: false,
    'aria-label': '이전 페이지',
  },
};

export const Right: Story = {
  args: {
    direction: 'right',
    size: 'md',
    disabled: false,
    'aria-label': '다음 페이지',
  },
};

export const Small: Story = {
  args: {
    direction: 'left',
    size: 'sm',
    disabled: false,
    'aria-label': '이전 페이지',
  },
};

export const Medium: Story = {
  args: {
    direction: 'right',
    size: 'md',
    disabled: false,
    'aria-label': '다음 페이지',
  },
};

export const Large: Story = {
  args: {
    direction: 'left',
    size: 'lg',
    disabled: false,
    'aria-label': '이전 페이지',
  },
};

export const Disabled: Story = {
  args: {
    direction: 'left',
    size: 'md',
    disabled: true,
    'aria-label': '이전 페이지 (비활성화됨)',
  },
};

export const DisabledRight: Story = {
  args: {
    direction: 'right',
    size: 'md',
    disabled: true,
    'aria-label': '다음 페이지 (비활성화됨)',
  },
};

// ✅ 모든 크기와 방향 조합
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">Small</span>
        <div className="flex gap-2">
          <PaginationChevronButton
            direction="left"
            size="sm"
            aria-label="이전 페이지 (작은 크기)"
          />
          <PaginationChevronButton
            direction="right"
            size="sm"
            aria-label="다음 페이지 (작은 크기)"
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">Medium</span>
        <div className="flex gap-2">
          <PaginationChevronButton
            direction="left"
            size="md"
            aria-label="이전 페이지 (중간 크기)"
          />
          <PaginationChevronButton
            direction="right"
            size="md"
            aria-label="다음 페이지 (중간 크기)"
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">Large</span>
        <div className="flex gap-2">
          <PaginationChevronButton direction="left" size="lg" aria-label="이전 페이지 (큰 크기)" />
          <PaginationChevronButton direction="right" size="lg" aria-label="다음 페이지 (큰 크기)" />
        </div>
      </div>
    </div>
  ),
};

// ✅ 활성화/비활성화 상태 비교
export const States: Story = {
  render: () => (
    <div className="flex items-center gap-8 p-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">활성화</span>
        <div className="flex gap-2">
          <PaginationChevronButton direction="left" size="md" aria-label="이전 페이지" />
          <PaginationChevronButton direction="right" size="md" aria-label="다음 페이지" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm font-medium">비활성화</span>
        <div className="flex gap-2">
          <PaginationChevronButton
            direction="left"
            size="md"
            disabled
            aria-label="이전 페이지 (비활성화됨)"
          />
          <PaginationChevronButton
            direction="right"
            size="md"
            disabled
            aria-label="다음 페이지 (비활성화됨)"
          />
        </div>
      </div>
    </div>
  ),
};
