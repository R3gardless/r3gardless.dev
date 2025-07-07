import type { Meta, StoryObj } from '@storybook/react';

import { LandingHero } from './LandingHero';

const meta = {
  title: 'Sections/LandingHero',
  component: LandingHero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof LandingHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Default LandingHero component with typewriter animation and rotating interests from config.',
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
        story: 'LandingHero with custom background styling.',
      },
    },
  },
};
