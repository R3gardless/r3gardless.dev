import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { BlogSidebar } from '.';

const meta = {
  title: 'Sections/BlogSidebar',
  component: BlogSidebar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
BlogSidebar는 블로그 목록 페이지의 사이드바 영역으로 카테고리와 태그 필터링 기능을 제공합니다.

## 주요 특징
- 📂 카테고리 세로 목록 (CategoryVerticalList)
- 🏷️ 태그 목록 (TagList)
- 🔍 블로그 포스트 필터링을 위한 UI
- 📱 반응형 디자인: 모바일에서는 접을 수 있음
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    categories: {
      control: 'object',
      description: '표시할 카테고리 목록',
    },
    selectedCategory: {
      control: 'text',
      description: '선택된 카테고리',
    },
    tags: {
      control: 'object',
      description: '표시할 태그 목록',
    },
    selectedTags: {
      control: 'object',
      description: '선택된 태그 목록',
    },
    showMoreCategories: {
      control: 'boolean',
      description: '카테고리 더보기 표시 여부',
    },
    showMoreTags: {
      control: 'boolean',
      description: '태그 더보기 표시 여부',
    },
    isHidden: {
      control: 'boolean',
      description: '사이드바 숨김 여부 (모바일 뷰에서 사용)',
    },
  },
} satisfies Meta<typeof BlogSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터
const SAMPLE_CATEGORIES = ['전체', 'React', 'JavaScript', 'TypeScript', 'Next.js', 'Node.js'];

const SAMPLE_TAGS = [
  'React',
  'Vue',
  'Angular',
  'Svelte',
  'JavaScript',
  'TypeScript',
  'Next.js',
  'Remix',
  'Node.js',
  'Express',
  'TanStack',
  'Zustand',
];

/**
 * 기본 BlogSidebar
 */
export const Default: Story = {
  args: {
    categories: SAMPLE_CATEGORIES,
    tags: SAMPLE_TAGS,
  },
};

/**
 * 선택된 항목이 있는 BlogSidebar
 */
export const WithSelection: Story = {
  args: {
    categories: SAMPLE_CATEGORIES,
    selectedCategory: 'React',
    tags: SAMPLE_TAGS,
    selectedTags: ['TypeScript', 'Next.js'],
  },
};

/**
 * 더보기 없는 BlogSidebar
 */
export const WithoutShowMore: Story = {
  args: {
    categories: SAMPLE_CATEGORIES.slice(0, 3),
    tags: SAMPLE_TAGS.slice(0, 5),
    showMoreCategories: false,
    showMoreTags: false,
  },
};

/**
 * 모바일 뷰 (숨겨진 상태)
 */
export const Hidden: Story = {
  args: {
    categories: SAMPLE_CATEGORIES,
    tags: SAMPLE_TAGS,
    isHidden: true,
  },
};

/**
 * 인터랙티브 예시
 */
export const Interactive: Story = {
  args: {
    categories: SAMPLE_CATEGORIES,
    tags: SAMPLE_TAGS,
  },
  render: () => <InteractiveBlogSidebar />,
};

// 인터랙티브 예시용 컴포넌트
const InteractiveBlogSidebar = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isHidden, setIsHidden] = useState(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prev => (prev === category ? undefined : category));
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev;
      }
      return [...prev, tag];
    });
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleClearAllTags = () => {
    setSelectedTags([]);
  };

  const toggleSidebar = () => {
    setIsHidden(prev => !prev);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSidebar}
          className="px-4 py-2 bg-[color:var(--color-primary)] text-[color:var(--color-background)] rounded-md text-sm font-medium"
        >
          {isHidden ? '사이드바 표시' : '사이드바 숨기기'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <BlogSidebar
          categories={SAMPLE_CATEGORIES}
          selectedCategory={selectedCategory}
          tags={SAMPLE_TAGS}
          selectedTags={selectedTags}
          isHidden={isHidden}
          onCategoryClick={handleCategoryClick}
          onTagClick={handleTagClick}
          onTagRemove={handleTagRemove}
          onClearAllTags={handleClearAllTags}
        />

        <div className="flex-1 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold mb-2 text-[color:var(--color-text)]">
            현재 선택된 필터:
          </h3>
          <p className="text-[color:var(--color-text)]">
            카테고리: <span className="font-medium">{selectedCategory ?? '(없음)'}</span>
          </p>
          <p className="text-[color:var(--color-text)]">
            태그:{' '}
            <span className="font-medium">
              {selectedTags.length ? selectedTags.join(', ') : '(없음)'}
            </span>
          </p>
        </div>
      </div>

      <div className="text-sm p-4 rounded-lg shadow-sm text-[color:var(--color-text)]/80">
        <p>✨ 카테고리를 클릭하여 선택하거나 취소할 수 있습니다.</p>
        <p>
          ✨ 태그를 클릭하면 선택되고, 선택된 태그의 X를 클릭하거나 &lsquo;모두지우기&rsquo;를
          클릭하여 선택을 취소할 수 있습니다.
        </p>
        <p>✨ &lsquo;사이드바 숨기기/표시&rsquo; 버튼으로 사이드바 표시를 토글할 수 있습니다.</p>
      </div>
    </div>
  );
};
