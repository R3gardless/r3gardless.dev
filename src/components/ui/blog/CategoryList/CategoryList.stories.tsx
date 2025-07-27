import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { CategoryList } from './CategoryList';

const meta: Meta<typeof CategoryList> = {
  title: 'UI/Blog/CategoryList',
  component: CategoryList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: '레이아웃 방향',
    },
    categories: {
      control: 'object',
      description: '표시할 카테고리 목록',
    },
    selectedCategory: {
      control: 'text',
      description: '선택된 카테고리',
    },
    showMore: {
      control: 'boolean',
      description: '더보기 표시 여부 (vertical에서만 유효)',
    },
    initialDisplayCount: {
      control: 'number',
      description: '초기에 보여줄 카테고리 개수 (vertical에서만 유효)',
    },
    loadMoreCount: {
      control: 'number',
      description: '더보기 클릭 시 추가로 보여줄 카테고리 개수 (vertical에서만 유효)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCategories = [
  '전체',
  'React',
  'TypeScript',
  'Next.js',
  'JavaScript',
  'CSS',
  'HTML',
  'Node.js',
  'Database',
  'DevOps',
  'Algorithm',
  'Data Structure',
];

// 인터랙티브 세로 레이아웃을 위한 컴포넌트
const InteractiveVerticalDemo = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined);
  const [showAllCategories, setShowAllCategories] = React.useState(false);

  const displayCategories = showAllCategories ? sampleCategories : sampleCategories.slice(0, 6);

  return (
    <div className="max-w-xs">
      <CategoryList
        variant="vertical"
        categories={displayCategories}
        selectedCategory={selectedCategory}
        showMore={!showAllCategories}
        onCategoryClick={category => {
          setSelectedCategory(category);
          console.log('카테고리 선택:', category);
        }}
        onMoreClick={() => {
          setShowAllCategories(true);
          console.log('더보기 클릭');
        }}
      />
      <div className="mt-4 p-3 rounded text-sm">
        <strong>선택된 카테고리:</strong> {selectedCategory || '전체 (기본값)'}
      </div>
    </div>
  );
};

// 인터랙티브 가로 레이아웃을 위한 컴포넌트
const InteractiveHorizontalDemo = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined);

  return (
    <div className="w-full">
      <CategoryList
        variant="horizontal"
        categories={sampleCategories}
        selectedCategory={selectedCategory}
        onCategoryClick={category => {
          setSelectedCategory(category);
          console.log('카테고리 선택:', category);
        }}
      />
      <div className="mt-4 p-3 rounded text-sm text-center">
        <strong>선택된 카테고리:</strong> {selectedCategory || '전체 (기본값)'}
      </div>
    </div>
  );
};

/**
 * 세로 레이아웃 - 기본 ("전체" 선택됨)
 */
export const Vertical: Story = {
  args: {
    variant: 'vertical',
    categories: sampleCategories.slice(0, 6),
    selectedCategory: undefined, // "전체"가 기본 선택됨
    showMore: true,
    initialDisplayCount: 10,
    loadMoreCount: 5,
  },
};

/**
 * 세로 레이아웃 - 많은 카테고리 (더보기 기능 테스트)
 */
export const VerticalManyCategories: Story = {
  args: {
    variant: 'vertical',
    categories: [
      '전체',
      'React',
      'TypeScript',
      'Next.js',
      'JavaScript',
      'CSS',
      'HTML',
      'Node.js',
      'Database',
      'DevOps',
      'Algorithm',
      'Data Structure',
      'Machine Learning',
      'AI',
      'Cloud',
      'Security',
      'Mobile',
      'iOS',
      'Android',
      'Flutter',
      'React Native',
    ],
    selectedCategory: 'React',
    showMore: true,
    initialDisplayCount: 10,
    loadMoreCount: 5,
  },
};

/**
 * 세로 레이아웃 - 더보기 없음
 */
export const VerticalWithoutMore: Story = {
  args: {
    variant: 'vertical',
    categories: sampleCategories.slice(0, 6),
    selectedCategory: 'TypeScript',
    showMore: false,
    initialDisplayCount: 10,
    loadMoreCount: 5,
  },
};

/**
 * 가로 레이아웃 - 기본 ("전체" 선택됨)
 */
export const Horizontal: Story = {
  args: {
    variant: 'horizontal',
    categories: sampleCategories,
    selectedCategory: undefined, // "전체"가 기본 선택됨
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * 가로 레이아웃 - 긴 카테고리 목록
 */
export const HorizontalLongList: Story = {
  args: {
    variant: 'horizontal',
    categories: [
      ...sampleCategories,
      'Machine Learning',
      'Artificial Intelligence',
      'Data Science',
      'Cloud Computing',
      'Microservices',
      'GraphQL',
      'WebAssembly',
      'Progressive Web Apps',
    ],
    selectedCategory: 'Machine Learning',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * 인터랙티브 세로 레이아웃
 * 카테고리 선택과 더보기 기능을 직접 체험할 수 있습니다.
 */
export const InteractiveVertical: Story = {
  render: () => <InteractiveVerticalDemo />,
};

/**
 * 인터랙티브 가로 레이아웃
 * 카테고리 선택과 스크롤 기능을 직접 체험할 수 있습니다.
 */
export const InteractiveHorizontal: Story = {
  render: () => <InteractiveHorizontalDemo />,
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * 사용 예시 비교
 */
export const Comparison: Story = {
  render: () => (
    <div className="space-y-8 w-full">
      {/* Horizontal 레이아웃 */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Horizontal Layout</h3>
        <CategoryList variant="horizontal" categories={sampleCategories} selectedCategory="React" />
      </div>

      {/* Vertical 레이아웃 */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Vertical Layout</h3>
        <div className="max-w-xs">
          <CategoryList
            variant="vertical"
            categories={sampleCategories.slice(0, 8)}
            selectedCategory="TypeScript"
            showMore={true}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
