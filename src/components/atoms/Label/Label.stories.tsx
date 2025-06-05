import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Components/Atoms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div className="p-5">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    text: { control: 'text' },
    color: {
      control: 'select',
      options: ['gray', 'brown', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'],
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

/**
 * 기본 라벨 예시입니다.
 */
export const Light: Story = {
  args: {
    text: '라벨',
    color: 'gray',
  },
};

/**
 * 다크 테마 라벨 예시입니다.
 */
export const Dark: Story = {
  args: {
    text: '라벨',
    color: 'green',
    theme: 'dark',
  },
  decorators: [
    Story => (
      <div
        data-theme="dark"
        className="p-5 min-h-24 rounded-lg"
        style={{ backgroundColor: '#08031b' }}
      >
        <Story />
      </div>
    ),
  ],
};

/**
 * 클릭 이벤트를 가진 라벨 예시입니다.
 */
export const Clickable: Story = {
  args: {
    text: '클릭 가능',
    color: 'blue',
    onClick: () => {
      alert('라벨이 클릭되었습니다!');
    },
  },
};

/**
 * 모든 색상 옵션을 보여주는 예시입니다
 */
export const AllColors: Story = {
  render: args => (
    <div className="flex flex-wrap gap-3 p-4 m-5">
      <Label text="회색" color="gray" theme={args.theme} />
      <Label text="갈색" color="brown" theme={args.theme} />
      <Label text="주황색" color="orange" theme={args.theme} />
      <Label text="노란색" color="yellow" theme={args.theme} />
      <Label text="초록색" color="green" theme={args.theme} />
      <Label text="파란색" color="blue" theme={args.theme} />
      <Label text="보라색" color="purple" theme={args.theme} />
      <Label text="분홍색" color="pink" theme={args.theme} />
      <Label text="빨간색" color="red" theme={args.theme} />
    </div>
  ),
  args: {
    theme: 'light',
  },
};

/**
 * 클릭 가능한 모든 색상 라벨 예시입니다.
 */
export const AllClickable: Story = {
  render: args => (
    <div className="flex flex-wrap gap-3 p-4 m-5">
      <Label
        theme={args.theme}
        text="회색"
        color="gray"
        onClick={() => {
          console.log('gray clicked');
        }}
      />
      <Label
        theme={args.theme}
        text="갈색"
        color="brown"
        onClick={() => {
          console.log('brown clicked');
        }}
      />
      <Label
        theme={args.theme}
        text="주황색"
        color="orange"
        onClick={() => {
          console.log('orange clicked');
        }}
      />
      <Label
        theme={args.theme}
        text="노란색"
        color="yellow"
        onClick={() => {
          console.log('yellow clicked');
        }}
      />
      <Label
        theme={args.theme}
        text="초록색"
        color="green"
        onClick={() => {
          console.log('green clicked');
        }}
      />
      <Label
        theme={args.theme}
        text="파란색"
        color="blue"
        onClick={() => {
          console.log('blue clicked');
        }}
      />
      <Label
        theme={args.theme}
        text="보라색"
        color="purple"
        onClick={() => {
          console.log('purple clicked');
        }}
      />
      <Label
        theme={args.theme}
        text="분홍색"
        color="pink"
        onClick={() => {
          console.log('pink clicked');
        }}
      />
      <Label
        theme={args.theme}
        text="빨간색"
        color="red"
        onClick={() => {
          console.log('red clicked');
        }}
      />
    </div>
  ),
  args: {
    theme: 'light',
  },
};

/**
 * 라이트와 다크 테마 비교 예시입니다.
 */
export const ThemeComparison: Story = {
  render: () => (
    <div className="m-5 flex flex-col gap-6">
      {/* Light Theme */}
      <div>
        <h3 className="mb-3 text-black">Light Theme</h3>
        <div
          className="flex flex-wrap gap-3 p-4 rounded-lg border border-gray-300"
          style={{ backgroundColor: '#fafaf8' }}
        >
          <Label text="네트워크" color="blue" theme="light" />
          <Label text="데이터베이스" color="red" theme="light" />
          <Label text="전체" color="gray" theme="light" />
        </div>
      </div>

      {/* Dark Theme */}
      <div>
        <h3 className="mb-3 text-white">Dark Theme</h3>
        <div
          data-theme="dark"
          className="flex flex-wrap gap-3 p-4 rounded-lg border border-gray-600"
          style={{ backgroundColor: '#08031b' }}
        >
          <Label text="네트워크" color="blue" theme="dark" />
          <Label text="데이터베이스" color="red" theme="dark" />
          <Label text="전체" color="gray" theme="dark" />
        </div>
      </div>
    </div>
  ),
};
