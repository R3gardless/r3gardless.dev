import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { BlogListHeader } from '.';

const meta = {
  title: 'Components/Organisms/BlogListHeader',
  component: BlogListHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
BlogListHeader는 블로그 목록 페이지 상단에 위치하는 헤더 컴포넌트입니다.

## 주요 특징
- 📝 블로그 타이틀 표시
- 🔢 포스트 개수 표시
- 🔍 검색 기능 내장
- 📱 모바일/데스크톱 반응형 디자인
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    searchValue: {
      control: 'text',
      description: '검색어 값',
    },
    onSearchChange: {
      description: '검색어 변경 이벤트 핸들러',
    },
    onSearch: {
      description: '검색 실행 이벤트 핸들러',
    },
    isSearchLoading: {
      control: 'boolean',
      description: '검색 로딩 상태',
    },
    selectedCategory: {
      control: 'text',
      description: '선택된 카테고리',
    },
    selectedTags: {
      control: 'object',
      description: '선택된 태그 목록',
    },
    className: {
      control: 'text',
      description: '추가 클래스명',
    },
  },
} satisfies Meta<typeof BlogListHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 BlogListHeader
 */
export const Default: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

/**
 * 검색어가 입력된 상태
 */
export const WithSearch: Story = {
  args: {
    searchValue: 'React',
  },
};

/**
 * 선택된 카테고리와 함께 표시
 */
export const WithCategory: Story = {
  args: {
    searchValue: 'Next.js',
    selectedCategory: 'JavaScript',
  },
};

/**
 * 선택된 태그와 함께 표시
 */
export const WithTags: Story = {
  args: {
    searchValue: 'State Management',
    selectedTags: ['React', 'Frontend', 'Hooks'],
  },
};

/**
 * 모든 필터가 적용된 상태
 */
export const WithAllFilters: Story = {
  args: {
    searchValue: 'GraphQL',
    selectedCategory: 'API',
    selectedTags: ['Backend', 'Query Language', 'Data'],
  },
};

/**
 * 검색 로딩 상태
 */
export const SearchLoading: Story = {
  args: {
    searchValue: 'TypeScript',
    isSearchLoading: true,
  },
};

/**
 * 모바일 뷰
 */
export const Mobile: Story = {
  args: {
    searchValue: 'React',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * 인터랙티브 예시
 */
export const Interactive: Story = {
  render: () => <InteractiveBlogListHeader />,
};

// 인터랙티브 예시용 컴포넌트
const InteractiveBlogListHeader = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  // 카테고리 목록 (예시)
  const categories = ['JavaScript', 'React', 'TypeScript', 'CSS', 'Next.js'];

  // 태그 목록 (예시)
  const tags = ['Frontend', 'Backend', 'UI/UX', 'Performance', 'Testing'];

  const handleSearch = async (value: string) => {
    setIsSearching(true);

    // 검색 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSearching(false);

    // 검색어에 따라 랜덤하게 카테고리 선택 (데모용)
    if (value && !selectedCategory) {
      const randomIndex = Math.floor(Math.random() * categories.length);
      setSelectedCategory(categories[randomIndex]);
    }
  };

  // 태그 토글 (데모용)
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <BlogListHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearch={handleSearch}
        isSearchLoading={isSearching}
        selectedCategory={selectedCategory}
        selectedTags={selectedTags}
      />

      <div className="text-sm bg-[color:var(--color-background)] p-4 rounded border border-[color:var(--color-primary)]">
        <p className="text-[color:var(--color-text)]/80">
          ✨ 검색어를 입력하고 Enter를 눌러보세요.
        </p>
        <p className="text-[color:var(--color-text)]/80">
          🔍 검색 시 랜덤하게 카테고리가 선택됩니다.
        </p>
        <div className="mt-3">
          <p className="font-medium text-[color:var(--color-text)]">태그 선택:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-[color:var(--color-primary)] text-[color:var(--color-background)]'
                    : 'bg-[color:var(--color-secondary)] text-[color:var(--color-text)]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(undefined)}
            className="mt-3 text-[color:var(--color-primary)] underline"
          >
            카테고리 초기화
          </button>
        )}
      </div>
    </div>
  );
};
