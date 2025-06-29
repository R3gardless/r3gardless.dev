import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { SearchBar } from '.';

const meta = {
  title: 'Components/Molecules/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
SearchBar는 검색 기능을 위한 입력창 컴포넌트입니다.

## 주요 특징
- 🔍 검색 아이콘 포함
- ⌨️ Cmd+K (macOS) 또는 Ctrl+K (Windows/Linux) 단축키 지원
- 💡 키보드 단축키 힌트 표시 (포커스 시 자동 숨김)
- 📱 포커스 시 텍스트 입력 공간 자동 확장
- 🔄 로딩 상태 지원
- ♿ 접근성 고려된 설계
- 🎨 테마 변수 사용으로 다크모드 지원

## 사용법
\`\`\`tsx
<SearchBar
  value={searchValue}
  onChange={setSearchValue}
  onSearch={handleSearch}
  placeholder="검색어를 입력하세요..."
/>
\`\`\`

## UX 개선사항
- 포커스 시 단축키 힌트가 부드럽게 사라지면서 입력 공간이 확장됩니다
- 긴 검색어 입력 시에도 텍스트가 잘리지 않습니다
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '검색어 입력 값',
    },
    placeholder: {
      control: 'text',
      description: 'placeholder 텍스트',
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    showShortcut: {
      control: 'boolean',
      description: '키보드 단축키 표시 여부',
    },
    onChange: {
      description: '검색어 변경 이벤트 핸들러',
    },
    onSearch: {
      description: 'Enter 키 입력 시 호출되는 핸들러',
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 SearchBar
 */
export const Default: Story = {
  args: {
    placeholder: 'Find something interesting…',
  },
};

/**
 * 초기값이 있는 SearchBar
 */
export const WithValue: Story = {
  args: {
    value: 'TypeScript',
    placeholder: 'Find something interesting…',
  },
};

/**
 * 로딩 상태의 SearchBar
 */
export const Loading: Story = {
  args: {
    loading: true,
    placeholder: 'Find something interesting…',
  },
};

/**
 * 비활성화된 SearchBar
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Find something interesting…',
  },
};

/**
 * 단축키 힌트가 숨겨진 SearchBar
 */
export const WithoutShortcut: Story = {
  args: {
    showShortcut: false,
    placeholder: 'Find something interesting…',
  },
};

/**
 * 커스텀 placeholder가 있는 SearchBar
 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: '블로그 포스트를 검색해보세요 📝',
  },
};

/**
 * 다양한 상태들을 보여주는 예시
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[color:var(--color-text)]">기본 상태</h3>
        <SearchBar placeholder="Find something interesting…" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[color:var(--color-text)]">값이 있는 상태</h3>
        <SearchBar value="React" placeholder="Find something interesting…" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[color:var(--color-text)]">로딩 상태</h3>
        <SearchBar loading={true} placeholder="Find something interesting…" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[color:var(--color-text)]">비활성화 상태</h3>
        <SearchBar disabled={true} placeholder="Find something interesting…" />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[color:var(--color-text)]">단축키 힌트 없음</h3>
        <SearchBar showShortcut={false} placeholder="Find something interesting…" />
      </div>
    </div>
  ),
};

// 인터랙티브 컴포넌트 정의
const InteractiveSearchBar = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = async (value: string) => {
    if (!value.trim()) return;

    setIsLoading(true);
    // 실제 검색 API 호출을 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    alert(`"${value}"로 검색했습니다!`);
  };

  return (
    <div className="space-y-4">
      <SearchBar
        value={searchValue}
        loading={isLoading}
        placeholder="Type something and press Enter to search…"
        onChange={setSearchValue}
        // handleSearch 함수가 Promise를 반환하므로, onSearch에서 void를 반환하도록 래핑
        onSearch={value => {
          // handleSearch가 Promise를 반환하므로, await하지 않고 명시적으로 무시
          void handleSearch(value);
        }}
      />

      <div className="text-sm text-[color:var(--color-text)]/70 space-y-1">
        <p>
          💡 <strong>Cmd+K</strong> (macOS) 또는 <strong>Ctrl+K</strong> (Windows/Linux)를 눌러서
          검색창에 포커스할 수 있습니다
        </p>
        <p>🔍 검색어를 입력하고 Enter를 누르거나 검색창을 클릭해보세요</p>
        <p>✨ 포커스 시 단축키 힌트가 사라지며 입력 공간이 확장됩니다</p>
        <p>
          현재 검색어: <strong>{searchValue || '(없음)'}</strong>
        </p>
      </div>
    </div>
  );
};

/**
 * 실제 검색 동작을 보여주는 인터랙티브 예시
 */
export const Interactive: Story = {
  render: () => <InteractiveSearchBar />,
};

/**
 * 반응형 레이아웃에서의 SearchBar
 */
export const Responsive: Story = {
  render: () => (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[color:var(--color-text)]">모바일 (전체 너비)</h3>
        <div className="w-full max-w-sm">
          <SearchBar placeholder="Find something on mobile…" className="w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-[color:var(--color-text)]">태블릿/데스크톱</h3>
        <div className="w-full max-w-md">
          <SearchBar placeholder="Find something on desktop…" className="w-full" />
        </div>
      </div>
    </div>
  ),
};
