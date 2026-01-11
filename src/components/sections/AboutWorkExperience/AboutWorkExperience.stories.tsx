import type { Meta, StoryObj } from '@storybook/react';

import { AboutWorkExperience } from './AboutWorkExperience';

const meta = {
  title: 'Sections/AboutWorkExperience',
  component: AboutWorkExperience,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '섹션 제목',
    },
    items: {
      control: 'object',
      description: '경력 아이템 목록',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
} satisfies Meta<typeof AboutWorkExperience>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Work Experience 섹션
 */
export const Default: Story = {
  args: {
    title: 'Work Experience',
    items: [
      {
        id: 'kakao-distributed-db',
        company: 'Kakao Corp',
        position: 'Distributed Database',
        period: 'Aug 2024 ~ Present',
        description: [
          'Manage PostgreSQL Cluster trouble shooting',
          'Develop PostgreSQL installation module, automation using Github Actions',
        ],
      },
      {
        id: 'kakao-database-eng',
        company: 'Kakao Corp',
        position: 'Database Engineering',
        period: 'Jan 2024 ~ Mar 2024',
        description: [
          'Implement DDL adoptable sink connector with Java. (Debezium)',
          'Consider Kafka Topic could be empty and make DDL can be sync same time.',
        ],
      },
      {
        id: 'vldb-lab',
        company: 'VLDB Lab Research Intern',
        position: 'Lab intern',
        period: 'Jul 2023 ~ Jan 2024',
        description: [
          'Publish SQL MNIST paper at KDBC.',
          'Implement Machine Learning Algorithm using SQL which is tuning complete. Check performance comparison with postgresql, numpy and HyPer.',
        ],
      },
    ],
  },
};

/**
 * 단일 경력 아이템
 */
export const SingleItem: Story = {
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'Work Experience',
    items: [
      {
        id: 'single',
        company: 'Example Company',
        position: 'Software Engineer',
        period: 'Jan 2023 ~ Present',
        description: ['Develop web applications', 'Collaborate with team members'],
      },
    ],
  },
};

/**
 * 많은 경력 아이템
 */
export const ManyItems: Story = {
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'Work Experience',
    items: [
      {
        id: 'job1',
        company: 'Company A',
        position: 'Senior Engineer',
        period: 'Jan 2024 ~ Present',
        description: ['Lead development team', 'Design system architecture'],
      },
      {
        id: 'job2',
        company: 'Company B',
        position: 'Engineer',
        period: 'Jan 2023 ~ Dec 2023',
        description: ['Backend development', 'API design and implementation'],
      },
      {
        id: 'job3',
        company: 'Company C',
        position: 'Junior Engineer',
        period: 'Jan 2022 ~ Dec 2022',
        description: ['Frontend development', 'UI/UX implementation'],
      },
      {
        id: 'job4',
        company: 'Company D',
        position: 'Intern',
        period: 'Jul 2021 ~ Dec 2021',
        description: ['Learning and assisting team', 'Bug fixes and testing'],
      },
    ],
  },
};
