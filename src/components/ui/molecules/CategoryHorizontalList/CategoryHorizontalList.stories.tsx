import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { CategoryHorizontalList } from './CategoryHorizontalList';

const meta: Meta<typeof CategoryHorizontalList> = {
  title: 'Components/Molecules/CategoryHorizontalList',
  component: CategoryHorizontalList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '카테고리 목록을 가로로 표시하는 분자 컴포넌트입니다. 1024px 고정 너비를 유지하며, 스크롤이 가능하지만 스크롤바는 숨겨집니다. 선택된 카테고리로 부드럽게 스크롤하는 애니메이션을 제공하며, 선택된 카테고리는 하단에 진한 강조선으로 표시됩니다.',
      },
    },
  },
  argTypes: {
    categories: {
      description: '표시할 카테고리 목록',
      control: { type: 'object' },
    },
    selectedCategory: {
      description: '선택된 카테고리',
      control: { type: 'text' },
    },
    className: {
      description: '추가 클래스명',
      control: { type: 'text' },
    },
    onCategoryClick: {
      description: '카테고리 클릭 이벤트 핸들러',
      action: 'category-clicked',
    },
  },
  args: {
    categories: [
      '전체',
      '데이터베이스',
      '네트워크',
      '프로그래밍언어',
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'Java',
      'Spring',
      'DevOps',
      'AWS',
      'Docker',
    ],
    selectedCategory: '전체',
  },
};

export default meta;

type Story = StoryObj<typeof CategoryHorizontalList>;

export const Default: Story = {
  args: {},
};

export const LightTheme: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    Story => (
      <div style={{ backgroundColor: '#08031b', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const WithManyCategories: Story = {
  args: {
    categories: [
      '전체',
      '데이터베이스',
      '네트워크',
      '프로그래밍언어',
      'JavaScript',
      'TypeScript',
      'React',
      'Vue.js',
      'Angular',
      'Node.js',
      'Python',
      'Java',
      'Spring',
      'DevOps',
      'AWS',
      'Docker',
      'Kubernetes',
      '머신러닝',
      '인공지능',
      '블록체인',
      '보안',
      '알고리즘',
      '자료구조',
      '운영체제',
      '컴퓨터구조',
    ],
    selectedCategory: '머신러닝',
  },
};

export const WithSelectedCategory: Story = {
  args: {
    selectedCategory: 'React',
  },
};

export const WithoutSelection: Story = {
  args: {
    selectedCategory: undefined,
  },
};

const InteractiveWrapper = (args: React.ComponentProps<typeof CategoryHorizontalList>) => {
  /* 선택된 카테고리 상태 관리 */
  const [selectedCategory, setSelectedCategory] = useState(args.selectedCategory ?? '전체');

  return (
    <CategoryHorizontalList
      {...args}
      selectedCategory={selectedCategory}
      onCategoryClick={category => {
        setSelectedCategory(category);
        args.onCategoryClick?.(category);
      }}
    />
  );
};

export const Interactive: Story = {
  render: args => <InteractiveWrapper {...args} />,
  args: {
    categories: [
      '전체',
      '데이터베이스',
      '네트워크',
      '프로그래밍언어',
      'JavaScript',
      'TypeScript',
      'React',
      'Vue.js',
      'Angular',
      'Node.js',
      'Python',
      'Java',
      'Spring',
      'DevOps',
      'AWS',
      'Docker',
      'Kubernetes',
      '머신러닝',
      '인공지능',
      '블록체인',
    ],
    selectedCategory: '전체',
  },
  parameters: {
    docs: {
      description: {
        story:
          '카테고리를 클릭하여 선택할 수 있는 인터랙티브 버전입니다. 선택된 카테고리로 자동 스크롤되며, 하단에 강조선이 표시됩니다. 선택된 카테고리는 비활성화되어 클릭할 수 없습니다.',
      },
    },
  },
};
