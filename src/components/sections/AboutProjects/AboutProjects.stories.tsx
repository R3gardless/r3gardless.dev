import type { Meta, StoryObj } from '@storybook/react';

import { AboutProjects } from './AboutProjects';

const meta = {
  title: 'Sections/AboutProjects',
  component: AboutProjects,
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
      description: '프로젝트 아이템 목록',
    },
    className: {
      control: 'text',
      description: '추가 CSS 클래스',
    },
  },
} satisfies Meta<typeof AboutProjects>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Projects 섹션
 */
export const Default: Story = {
  args: {
    title: 'Project',
    items: [
      {
        id: 'pyodide',
        name: 'Pyodide',
        summary: 'Opensource Contribution',
        period: 'Oct 2023',
        description: '기여 내역 설명',
        githubUrl: 'https://github.com/pyodide/pyodide',
      },
      {
        id: 'enlistpedia',
        name: 'Enlistpedia',
        summary: 'Project',
        period: 'Oct 2021 ~ Nov 2021',
        description: '대충 사용한 기술 스택 설명 및 역할 설명 수상 내용도 자랑하기',
        githubUrl: 'https://github.com/osamhack2021/WEB_Enlistpedia_Ajoupo',
        presentationUrl: 'https://example.com/presentation',
        blogUrl: 'https://example.com/blog',
        awards: [
          { prize: 'Top 30' },
          { prize: 'Talent Pool Invitation (Samsung Electronics)', link: 'https://example.com' },
        ],
      },
    ],
  },
};

/**
 * 단일 프로젝트 아이템
 */
export const SingleItem: Story = {
  args: {
    title: 'Project',
    items: [
      {
        id: 'single',
        name: 'Sample Project',
        summary: 'Personal Project',
        period: 'Jan 2024 ~ Mar 2024',
        description: 'A sample project description',
        githubUrl: 'https://github.com/example/project',
      },
    ],
  },
};

/**
 * GitHub URL 없는 프로젝트
 */
export const WithoutGithubUrl: Story = {
  args: {
    title: 'Project',
    items: [
      {
        id: 'no-github',
        name: 'Private Project',
        summary: 'Company Project',
        period: 'Jun 2023 ~ Dec 2023',
        description: 'This is a private project without public repository',
      },
    ],
  },
};
