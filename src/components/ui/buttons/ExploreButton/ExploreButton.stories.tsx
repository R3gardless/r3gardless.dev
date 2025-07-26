import type { Meta, StoryObj } from '@storybook/react';

import { ExploreButton } from './ExploreButton';

const meta = {
  title: 'UI/Buttons/ExploreButton',
  component: ExploreButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '랜딩 페이지의 "둘러보기" 버튼을 위한 전용 컴포넌트입니다. 강조된 스타일로 사용자의 관심을 끌도록 디자인되었습니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: '버튼에 표시될 텍스트',
      defaultValue: '둘러보기',
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태 표시 여부',
      defaultValue: false,
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부',
      defaultValue: false,
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스명',
    },
    onClick: {
      description: '버튼 클릭 이벤트 핸들러',
    },
  },
} satisfies Meta<typeof ExploreButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 둘러보기 버튼
 */
export const Default: Story = {
  args: {
    onClick: () => {
      console.log('explore clicked');
    },
  },
};

/**
 * 커스텀 텍스트
 */
export const CustomText: Story = {
  args: {
    text: '블로그 구경하기',
    onClick: () => {
      console.log('explore clicked');
    },
  },
};

/**
 * 로딩 상태
 */
export const Loading: Story = {
  args: {
    loading: true,
    onClick: () => {
      console.log('explore clicked');
    },
  },
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    onClick: () => {
      console.log('explore clicked');
    },
  },
};

/**
 * 다양한 텍스트 길이
 */
export const VariousTextLengths: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <ExploreButton
        text="구경"
        onClick={() => {
          console.log('short text clicked');
        }}
      />
      <ExploreButton
        text="둘러보기"
        onClick={() => {
          console.log('default text clicked');
        }}
      />
      <ExploreButton
        text="블로그 포스트 둘러보기"
        onClick={() => {
          console.log('long text clicked');
        }}
      />
      <ExploreButton
        text="더 많은 흥미로운 글들을 구경해보세요"
        onClick={() => {
          console.log('very long text clicked');
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 길이의 텍스트에서 버튼이 어떻게 표시되는지 보여줍니다.',
      },
    },
  },
};

/**
 * 상태별 표시
 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <ExploreButton
        text="기본"
        onClick={() => {
          console.log('default clicked');
        }}
      />
      <ExploreButton
        text="로딩 중"
        loading
        onClick={() => {
          console.log('loading clicked');
        }}
      />
      <ExploreButton
        text="비활성화"
        disabled
        onClick={() => {
          console.log('disabled clicked');
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ExploreButton의 모든 상태를 한눈에 볼 수 있습니다.',
      },
    },
  },
};
