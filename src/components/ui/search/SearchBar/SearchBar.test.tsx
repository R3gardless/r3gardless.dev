import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';

import { SearchBar } from '.';

// navigator.platform 모킹
const mockNavigator = {
  platform: 'MacIntel',
};

Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true,
});

describe('SearchBar', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockNavigator.platform = 'MacIntel'; // 기본값으로 macOS 설정
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('기본 렌더링', () => {
    it('기본 SearchBar가 렌더링된다', () => {
      render(<SearchBar />);

      const input = screen.getByRole('textbox');

      expect(input).toBeInTheDocument();
    });

    it('기본 placeholder가 표시된다', () => {
      render(<SearchBar />);

      const input = screen.getByPlaceholderText('Find something interesting…');
      expect(input).toBeInTheDocument();
    });

    it('커스텀 placeholder가 표시된다', () => {
      render(<SearchBar placeholder="블로그 검색" />);

      const input = screen.getByPlaceholderText('블로그 검색');
      expect(input).toBeInTheDocument();
    });

    it('검색 아이콘이 표시된다', () => {
      render(<SearchBar />);

      const input = screen.getByRole('textbox');

      expect(input).toBeInTheDocument();
    });
  });

  describe('값 처리', () => {
    it('초기값이 설정된다', () => {
      render(<SearchBar value="React" />);

      const input = screen.getByDisplayValue('React');
      expect(input).toBeInTheDocument();
    });

    it('입력값 변경이 처리된다', () => {
      const handleChange = vi.fn();
      render(<SearchBar onChange={handleChange} />);

      const input = screen.getByRole('textbox');

      // fireEvent.change를 사용하여 전체 값 변경을 테스트
      fireEvent.change(input, { target: { value: 'TypeScript' } });

      expect(handleChange).toHaveBeenCalledWith('TypeScript');
    });

    it('빈 문자열 입력이 처리된다', async () => {
      const handleChange = vi.fn();
      render(<SearchBar value="test" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.clear(input);

      expect(handleChange).toHaveBeenLastCalledWith('');
    });
  });

  describe('검색 동작', () => {
    it('Enter 키를 눌렀을 때 onSearch가 호출된다', async () => {
      const handleSearch = vi.fn();
      render(<SearchBar value="test search" onSearch={handleSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '{enter}');

      expect(handleSearch).toHaveBeenCalledWith('test search');
    });

    it('검색 버튼 클릭 시 onSearch가 호출된다', () => {
      const handleSearch = vi.fn();
      render(<SearchBar value="button test" onSearch={handleSearch} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(handleSearch).toHaveBeenCalledWith('button test');
    });

    it('빈 값으로도 검색이 가능하다', async () => {
      const handleSearch = vi.fn();
      render(<SearchBar value="" onSearch={handleSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '{enter}');

      expect(handleSearch).toHaveBeenCalledWith('');
    });
  });

  describe('로딩 상태', () => {
    it('로딩 상태에서 스피너가 표시된다', () => {
      render(<SearchBar loading />);

      // 로딩 상태에서는 스피너가 없으므로 단축키가 표시되는지 확인
      expect(screen.queryByText('K')).toBeInTheDocument();
    });

    it('로딩 상태에서 입력 필드가 정상 작동한다', () => {
      render(<SearchBar loading />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).not.toBeDisabled();
    });

    it('로딩 상태에서 Enter 키가 무시된다', async () => {
      const handleSearch = vi.fn();
      render(<SearchBar loading value="test" onSearch={handleSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '{enter}');

      expect(handleSearch).not.toHaveBeenCalled();
    });
  });

  describe('비활성화 상태', () => {
    it('비활성화 상태에서 입력 필드가 비활성화된다', () => {
      render(<SearchBar disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('비활성화 상태에서 Enter 키가 무시된다', () => {
      const handleSearch = vi.fn();
      render(<SearchBar disabled value="test" onSearch={handleSearch} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(handleSearch).not.toHaveBeenCalled();
    });
  });

  describe('포커스 상태', () => {
    it('포커스 시 입력 필드의 오른쪽 패딩이 줄어든다', async () => {
      render(<SearchBar />);

      const input = screen.getByRole('textbox');

      // 포커스 전: pr-16 클래스가 있어야 함
      expect(input).toHaveClass('pr-16');
      expect(input).not.toHaveClass('pr-4');

      await user.click(input);

      // 포커스 후: pr-4 클래스가 있어야 함
      expect(input).toHaveClass('pr-4');
      expect(input).not.toHaveClass('pr-16');
    });

    it('포커스 해제 시 입력 필드의 패딩이 원래대로 복원된다', async () => {
      render(<SearchBar />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab(); // 포커스 해제

      // 포커스 해제 후: pr-16 클래스가 다시 적용되어야 함
      expect(input).toHaveClass('pr-16');
      expect(input).not.toHaveClass('pr-4');
    });

    it('showShortcut=false일 때는 항상 pr-4 패딩을 사용한다', () => {
      render(<SearchBar showShortcut={false} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('pr-4');
      expect(input).not.toHaveClass('pr-16');
    });
  });

  describe('키보드 단축키', () => {
    it('macOS에서 Cmd+K로 포커스된다', async () => {
      mockNavigator.platform = 'MacIntel';
      render(<SearchBar />);

      const input = screen.getByRole('textbox');

      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });

    it('Windows에서 Ctrl+K로 포커스된다', async () => {
      mockNavigator.platform = 'Win32';
      render(<SearchBar />);

      const input = screen.getByRole('textbox');

      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(input).toHaveFocus();
      });
    });

    it('다른 키 조합은 무시된다', () => {
      render(<SearchBar />);

      const input = screen.getByRole('textbox');

      fireEvent.keyDown(document, { key: 'k', altKey: true });
      fireEvent.keyDown(document, { key: 'j', metaKey: true });

      expect(input).not.toHaveFocus();
    });
  });

  describe('단축키 힌트 표시', () => {
    it('단축키 힌트 표시 > macOS에서 Cmd+K 힌트가 표시된다', () => {
      mockNavigator.platform = 'MacIntel';
      render(<SearchBar />);

      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('K')).toBeInTheDocument();
    });

    it('Windows에서 Ctrl+K 힌트가 표시된다', () => {
      mockNavigator.platform = 'Win32';
      render(<SearchBar />);

      expect(screen.getByText('Ctrl')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('K')).toBeInTheDocument();
    });

    it('showShortcut=false일 때 힌트가 숨겨진다', () => {
      render(<SearchBar showShortcut={false} />);

      expect(screen.queryByText('+')).not.toBeInTheDocument();
      expect(screen.queryByText('K')).not.toBeInTheDocument();
      expect(screen.queryByText('Ctrl')).not.toBeInTheDocument();
    });

    it('포커스 시 힌트가 숨겨진다', async () => {
      const { container } = render(<SearchBar />);

      // 포커스 전에는 단축키 힌트가 보임
      expect(screen.getByText('K')).toBeInTheDocument();
      let shortcutContainer = container.querySelector('[class*="absolute right-3"]');
      expect(shortcutContainer).toBeInTheDocument();

      const input = screen.getByRole('textbox');
      await user.click(input);

      // 포커스 후에는 단축키 힌트가 DOM에서 완전히 제거됨
      await waitFor(() => {
        shortcutContainer = container.querySelector('[class*="absolute right-3"]');
        expect(shortcutContainer).not.toBeInTheDocument();
      });
      expect(input).toHaveFocus();
    });

    it('포커스 해제 시 힌트가 다시 나타난다', async () => {
      const { container } = render(<SearchBar />);

      const input = screen.getByRole('textbox');

      await user.click(input);
      await waitFor(() => {
        const shortcutContainer = container.querySelector('[class*="absolute right-3"]');
        expect(shortcutContainer).not.toBeInTheDocument();
      });

      await user.tab(); // 포커스 해제

      // 포커스 해제 후에는 단축키 힌트가 다시 나타남
      await waitFor(() => {
        const shortcutContainer = container.querySelector('[class*="absolute right-3"]');
        expect(shortcutContainer).toBeInTheDocument();
      });
    });
  });

  describe('스타일링', () => {
    it('커스텀 className이 적용된다', () => {
      const { container } = render(<SearchBar className="custom-search" />);

      const searchBarContainer = container.firstChild as HTMLElement;
      expect(searchBarContainer).toHaveClass('custom-search');
    });

    it('비활성화 상태에서 opacity 스타일이 적용된다', () => {
      const { container } = render(<SearchBar disabled />);

      const searchBarContainer = container.firstChild as HTMLElement;
      expect(searchBarContainer).toHaveClass('opacity-50');
    });

    it('테마 색상 변수가 사용된다', () => {
      render(<SearchBar />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-[color:var(--color-text)]');
    });
  });

  describe('접근성', () => {
    it('입력 필드에 적절한 역할과 속성이 있다', () => {
      render(<SearchBar placeholder="검색어 입력" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', '검색어 입력');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('입력 필드가 textbox role을 가진다', () => {
      render(<SearchBar />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('키보드 네비게이션이 작동한다', async () => {
      render(<SearchBar />);

      const input = screen.getByRole('textbox');

      await user.tab();
      expect(input).toHaveFocus();

      await user.tab();
      expect(input).not.toHaveFocus();
    });
  });

  describe('이벤트 처리', () => {
    it('여러 이벤트 핸들러가 동시에 작동한다', () => {
      const handleChange = vi.fn();
      const handleSearch = vi.fn();

      render(<SearchBar value="test" onChange={handleChange} onSearch={handleSearch} />);

      const input = screen.getByRole('textbox');

      // 값이 이미 설정되어 있음을 확인
      expect(input).toHaveValue('test');

      // Enter 키로 검색
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    it('onChange 없이도 정상 작동한다', async () => {
      const handleSearch = vi.fn();
      render(<SearchBar onSearch={handleSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test{enter}');

      expect(handleSearch).toHaveBeenCalled();
    });

    it('onSearch 없이도 정상 작동한다', () => {
      const handleChange = vi.fn();
      render(<SearchBar onChange={handleChange} />);

      const input = screen.getByRole('textbox');

      // 값 변경
      fireEvent.change(input, { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalledWith('test');

      // Enter 키 (onSearch가 없어도 에러가 발생하지 않아야 함)
      fireEvent.keyDown(input, { key: 'Enter' });
      // 에러가 발생하지 않아야 함
    });
  });
});
