import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { LabelButton } from './LabelButton';

const meta: Meta<typeof LabelButton> = {
  title: 'Components/Atoms/LabelButton',
  component: LabelButton,
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
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof LabelButton>;

export const Default: Story = {
  args: {
    text: 'Label',
    color: 'blue',
    theme: 'light',
  },
};

export const AllColors: Story = {
  args: {
    theme: 'light',
  },
  render: args => (
    <div className="flex flex-wrap gap-2">
      <LabelButton text="회색" color="gray" theme={args.theme} />
      <LabelButton text="갈색" color="brown" theme={args.theme} />
      <LabelButton text="주황색" color="orange" theme={args.theme} />
      <LabelButton text="노란색" color="yellow" theme={args.theme} />
      <LabelButton text="초록색" color="green" theme={args.theme} />
      <LabelButton text="파란색" color="blue" theme={args.theme} />
      <LabelButton text="보라색" color="purple" theme={args.theme} />
      <LabelButton text="분홍색" color="pink" theme={args.theme} />
      <LabelButton text="빨간색" color="red" theme={args.theme} />
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    text: 'Clickable Label',
    color: 'blue',
    theme: 'light',
    onClick: () => {
      alert('Label clicked!');
    },
  },
  render: args => (
    <div className="flex flex-wrap gap-2">
      <LabelButton
        text="JavaScript"
        color="yellow"
        theme={args.theme}
        onClick={() => {
          alert('JavaScript clicked!');
        }}
      />
      <LabelButton
        text="TypeScript"
        color="blue"
        theme={args.theme}
        onClick={() => {
          alert('TypeScript clicked!');
        }}
      />
      <LabelButton
        text="React"
        color="blue"
        theme={args.theme}
        onClick={() => {
          alert('React clicked!');
        }}
      />
      <LabelButton
        text="Next.js"
        color="gray"
        theme={args.theme}
        onClick={() => {
          alert('Next.js clicked!');
        }}
      />
      <LabelButton
        text="Tailwind"
        color="green"
        theme={args.theme}
        onClick={() => {
          alert('Tailwind clicked!');
        }}
      />
      <LabelButton
        text="Node.js"
        color="green"
        theme={args.theme}
        onClick={() => {
          alert('Node.js clicked!');
        }}
      />
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    text: 'Dark Mode Label',
    color: 'blue',
    theme: 'dark',
  },
  render: args => (
    <div className="flex flex-wrap gap-2">
      <LabelButton text="회색" color="gray" theme={args.theme} />
      <LabelButton text="갈색" color="brown" theme={args.theme} />
      <LabelButton text="주황색" color="orange" theme={args.theme} />
      <LabelButton text="노란색" color="yellow" theme={args.theme} />
      <LabelButton text="초록색" color="green" theme={args.theme} />
      <LabelButton text="파란색" color="blue" theme={args.theme} />
      <LabelButton text="보라색" color="purple" theme={args.theme} />
      <LabelButton text="분홍색" color="pink" theme={args.theme} />
      <LabelButton text="빨간색" color="red" theme={args.theme} />
    </div>
  ),
};

export const LightAndDarkComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Light Theme</h3>
        <div className="flex flex-wrap gap-2">
          <LabelButton text="네트워크" color="blue" theme="light" />
          <LabelButton text="데이터베이스" color="red" theme="light" />
          <LabelButton text="전체" color="gray" theme="light" />
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold">Dark Theme</h3>
        <div className="flex flex-wrap gap-2">
          <LabelButton text="네트워크" color="blue" theme="dark" />
          <LabelButton text="데이터베이스" color="red" theme="dark" />
          <LabelButton text="전체" color="gray" theme="dark" />
        </div>
      </div>
    </div>
  ),
};

export const BlogPost: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <LabelButton text="JavaScript" color="yellow" theme="light" />
      <LabelButton text="TypeScript" color="blue" theme="light" />
      <LabelButton text="React" color="blue" theme="light" />
      <LabelButton text="Next.js" color="gray" theme="light" />
      <LabelButton text="Tailwind CSS" color="green" theme="light" />
      <LabelButton text="Node.js" color="green" theme="light" />
      <LabelButton text="Database" color="red" theme="light" />
      <LabelButton text="Backend" color="purple" theme="light" />
      <LabelButton text="Frontend" color="pink" theme="light" />
      <LabelButton text="Full Stack" color="orange" theme="light" />
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    text: 'Custom Style',
    color: 'blue',
    theme: 'light',
    className: 'border-2 border-dashed',
  },
};
