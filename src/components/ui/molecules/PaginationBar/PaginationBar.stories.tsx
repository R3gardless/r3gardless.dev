import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { PaginationBar } from './PaginationBar';

const meta = {
  title: 'Components/Molecules/PaginationBar',
  component: PaginationBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '페이지네이션 바 컴포넌트입니다. 여러 페이지로 구성된 콘텐츠에서 페이지 간 이동을 도와줍니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: '현재 페이지 번호 (1부터 시작)',
    },
    totalPages: {
      control: { type: 'number', min: 1, max: 100 },
      description: '전체 페이지 수',
    },
    onPageChange: {
      action: 'page-changed',
      description: '페이지 변경 시 호출되는 콜백 함수',
    },
    maxPageNumbers: {
      control: { type: 'number', min: 5, max: 15 },
      description: '표시할 페이지 번호의 최대 개수',
    },
    disabled: {
      control: 'boolean',
      description: '전체 컴포넌트 비활성화 여부',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: '크기 설정',
    },
    prevLabel: {
      control: 'text',
      description: '이전 페이지 버튼 라벨 (접근성용)',
    },
    nextLabel: {
      control: 'text',
      description: '다음 페이지 버튼 라벨 (접근성용)',
    },
  },
} satisfies Meta<typeof PaginationBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ✅ 기본 스토리
export const Default: Story = {
  args: {
    currentPage: 3,
    totalPages: 10,
    onPageChange: action('page-changed'),
    maxPageNumbers: 7,
    size: 'md',
  },
};

// ✅ 첫 번째 페이지
export const FirstPage: Story = {
  args: {
    ...Default.args,
    currentPage: 1,
  },
  parameters: {
    docs: {
      description: {
        story: '첫 번째 페이지일 때의 상태입니다. 이전 버튼이 비활성화됩니다.',
      },
    },
  },
};

// ✅ 마지막 페이지
export const LastPage: Story = {
  args: {
    ...Default.args,
    currentPage: 10,
    totalPages: 10,
  },
  parameters: {
    docs: {
      description: {
        story: '마지막 페이지일 때의 상태입니다. 다음 버튼이 비활성화됩니다.',
      },
    },
  },
};

// ✅ 페이지가 적을 때
export const FewPages: Story = {
  args: {
    ...Default.args,
    currentPage: 2,
    totalPages: 5,
    maxPageNumbers: 7,
  },
  parameters: {
    docs: {
      description: {
        story: '전체 페이지 수가 적을 때의 상태입니다. 모든 페이지 번호가 표시됩니다.',
      },
    },
  },
};

// ✅ 페이지가 많을 때 (중간 페이지)
export const ManyPagesMiddle: Story = {
  args: {
    ...Default.args,
    currentPage: 15,
    totalPages: 30,
    maxPageNumbers: 7,
  },
  parameters: {
    docs: {
      description: {
        story:
          '페이지가 많고 현재 페이지가 중간에 있을 때입니다. 양쪽에 ellipsis(...)가 표시됩니다.',
      },
    },
  },
};

// ✅ 페이지가 많을 때 (앞쪽 페이지)
export const ManyPagesStart: Story = {
  args: {
    ...Default.args,
    currentPage: 3,
    totalPages: 30,
    maxPageNumbers: 7,
  },
  parameters: {
    docs: {
      description: {
        story:
          '페이지가 많고 현재 페이지가 앞쪽에 있을 때입니다. 뒤쪽에만 ellipsis(...)가 표시됩니다.',
      },
    },
  },
};

// ✅ 페이지가 많을 때 (뒤쪽 페이지)
export const ManyPagesEnd: Story = {
  args: {
    ...Default.args,
    currentPage: 28,
    totalPages: 30,
    maxPageNumbers: 7,
  },
  parameters: {
    docs: {
      description: {
        story:
          '페이지가 많고 현재 페이지가 뒤쪽에 있을 때입니다. 앞쪽에만 ellipsis(...)가 표시됩니다.',
      },
    },
  },
};

// ✅ 작은 크기
export const SmallSize: Story = {
  args: {
    ...Default.args,
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: '작은 크기의 페이지네이션 바입니다.',
      },
    },
  },
};

// ✅ 큰 크기
export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: '큰 크기의 페이지네이션 바입니다.',
      },
    },
  },
};

// ✅ 비활성화 상태
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 페이지네이션 바입니다. 모든 버튼이 클릭할 수 없는 상태입니다.',
      },
    },
  },
};

// ✅ 커스텀 라벨
export const CustomLabels: Story = {
  args: {
    ...Default.args,
    prevLabel: '이전',
    nextLabel: '다음',
    pageLabel: (page: number) => `페이지 ${page}번으로 이동`,
  },
  parameters: {
    docs: {
      description: {
        story:
          '커스텀 라벨을 사용한 페이지네이션 바입니다. 접근성을 위해 라벨을 커스터마이징할 수 있습니다.',
      },
    },
  },
};

// ✅ 최대 페이지 번호 표시 개수 변경
export const CustomMaxPageNumbers: Story = {
  args: {
    ...Default.args,
    currentPage: 10,
    totalPages: 50,
    maxPageNumbers: 5,
  },
  parameters: {
    docs: {
      description: {
        story: '표시할 최대 페이지 번호 개수를 5개로 제한한 페이지네이션 바입니다.',
      },
    },
  },
};

// ✅ 단일 페이지
export const SinglePage: Story = {
  args: {
    ...Default.args,
    currentPage: 1,
    totalPages: 1,
  },
  parameters: {
    docs: {
      description: {
        story: '페이지가 하나뿐일 때의 상태입니다. 이전/다음 버튼이 모두 비활성화됩니다.',
      },
    },
  },
};

// ✅ 인터랙티브 예제
export const Interactive: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    docs: {
      description: {
        story:
          '실제로 페이지를 변경해볼 수 있는 인터랙티브 예제입니다. Actions 탭에서 이벤트를 확인할 수 있습니다.',
      },
    },
  },
};
