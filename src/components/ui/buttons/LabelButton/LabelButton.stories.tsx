import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { LabelButton } from './LabelButton';

const meta: Meta<typeof LabelButton> = {
  title: 'UI/Buttons/LabelButton',
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
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <LabelButton text="회색" color="gray" />
      <LabelButton text="갈색" color="brown" />
      <LabelButton text="주황색" color="orange" />
      <LabelButton text="노란색" color="yellow" />
      <LabelButton text="초록색" color="green" />
      <LabelButton text="파란색" color="blue" />
      <LabelButton text="보라색" color="purple" />
      <LabelButton text="분홍색" color="pink" />
      <LabelButton text="빨간색" color="red" />
    </div>
  ),
};

export const Clickable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <LabelButton
        text="JavaScript"
        color="yellow"
        onClick={() => {
          alert('JavaScript clicked!');
        }}
      />
      <LabelButton
        text="TypeScript"
        color="blue"
        onClick={() => {
          alert('TypeScript clicked!');
        }}
      />
      <LabelButton
        text="React"
        color="blue"
        onClick={() => {
          alert('React clicked!');
        }}
      />
      <LabelButton
        text="Next.js"
        color="gray"
        onClick={() => {
          alert('Next.js clicked!');
        }}
      />
      <LabelButton
        text="Tailwind"
        color="green"
        onClick={() => {
          alert('Tailwind clicked!');
        }}
      />
      <LabelButton
        text="Node.js"
        color="green"
        onClick={() => {
          alert('Node.js clicked!');
        }}
      />
    </div>
  ),
};

export const BlogPost: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <LabelButton text="JavaScript" color="yellow" />
      <LabelButton text="TypeScript" color="blue" />
      <LabelButton text="React" color="blue" />
      <LabelButton text="Next.js" color="gray" />
      <LabelButton text="Tailwind CSS" color="green" />
      <LabelButton text="Node.js" color="green" />
      <LabelButton text="Database" color="red" />
      <LabelButton text="Backend" color="purple" />
      <LabelButton text="Frontend" color="pink" />
      <LabelButton text="Full Stack" color="orange" />
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    text: 'Custom Style',
    color: 'blue',
    className: 'border-2 border-dashed',
  },
};
