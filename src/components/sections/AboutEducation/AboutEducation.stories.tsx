import type { Meta, StoryObj } from '@storybook/react';

import { AboutEducation } from './AboutEducation';

const meta = {
  title: 'Sections/AboutEducation',
  component: AboutEducation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: '섹션 제목',
    },
    items: {
      control: 'object',
      description: '교육 기관 목록',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
} satisfies Meta<typeof AboutEducation>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 교육 섹션 표시
 */
export const Default: Story = {
  args: {
    title: 'Education',
    items: [
      {
        id: 'skku',
        icon: 'graduation-cap',
        institution: 'SungKyunKwan Univ.',
        degree: 'BS @ Computer Science and Engineering',
        period: 'Mar 2018 ~ Aug 2024',
        details: [
          'GPA : 4.14/4.5',
          'SystemConsultantGroup',
          'TA & mentoring program',
          'scholarship',
        ],
      },
      {
        id: 'cnsh',
        icon: 'school',
        institution: 'Chungnam Science High School',
        period: 'Mar 2016 ~ Feb 2018',
      },
    ],
  },
};

/**
 * 단일 교육 기관만 표시
 */
export const SingleItem: Story = {
  args: {
    title: 'Education',
    items: [
      {
        id: 'skku',
        icon: 'graduation-cap',
        institution: 'SungKyunKwan Univ.',
        degree: 'BS @ Computer Science and Engineering',
        period: 'Mar 2018 ~ Aug 2024',
        details: [
          'GPA : 4.14/4.5',
          'SystemConsultantGroup',
          'TA & mentoring program',
          'scholarship',
        ],
      },
    ],
  },
};

/**
 * 세부 정보 없는 교육 기관
 */
export const WithoutDetails: Story = {
  args: {
    title: 'Education',
    items: [
      {
        id: 'skku',
        icon: 'graduation-cap',
        institution: 'SungKyunKwan Univ.',
        degree: 'BS @ Computer Science and Engineering',
        period: 'Mar 2018 ~ Aug 2024',
      },
      {
        id: 'cnsh',
        icon: 'school',
        institution: 'Chungnam Science High School',
        period: 'Mar 2016 ~ Feb 2018',
      },
    ],
  },
};

/**
 * 학위 정보 없는 교육 기관
 */
export const WithoutDegree: Story = {
  args: {
    title: 'Education',
    items: [
      {
        id: 'cnsh',
        icon: 'school',
        institution: 'Chungnam Science High School',
        period: 'Mar 2016 ~ Feb 2018',
      },
    ],
  },
};

/**
 * 여러 교육 기관
 */
export const MultipleItems: Story = {
  args: {
    title: 'Education',
    items: [
      {
        id: 'skku',
        icon: 'graduation-cap',
        institution: 'SungKyunKwan Univ.',
        degree: 'BS @ Computer Science and Engineering',
        period: 'Mar 2018 ~ Aug 2024',
        details: [
          'GPA : 4.14/4.5',
          'SystemConsultantGroup',
          'TA & mentoring program',
          'scholarship',
        ],
      },
      {
        id: 'cnsh',
        icon: 'school',
        institution: 'Chungnam Science High School',
        period: 'Mar 2016 ~ Feb 2018',
      },
      {
        id: 'example',
        icon: 'graduation-cap',
        institution: 'Example University',
        degree: 'MS @ Data Science',
        period: 'Sep 2024 ~ Present',
        details: ['Machine Learning Research', 'Full Scholarship'],
      },
    ],
  },
};
