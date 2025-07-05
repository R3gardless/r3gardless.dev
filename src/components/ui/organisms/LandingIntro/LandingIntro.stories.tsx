import type { Meta, StoryObj } from '@storybook/react';

import { LandingIntro } from './LandingIntro';

const meta = {
  title: 'Components/Organisms/LandingIntro',
  component: LandingIntro,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof LandingIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Default LandingIntro component with typewriter animation and rotating interests from config.',
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'bg-gray-50 dark:bg-gray-900',
  },
  parameters: {
    docs: {
      description: {
        story: 'LandingIntro with custom background styling.',
      },
    },
  },
};
