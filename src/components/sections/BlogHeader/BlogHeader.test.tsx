import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { BlogHeader } from '.';

describe('BlogHeader', () => {
  describe('기본 렌더링', () => {
    it('BlogHeader가 렌더링된다', () => {
      render(<BlogHeader />);

      // 블로그 제목이 표시되는지 확인 (영문 'Blog'로 변경됨)
      expect(screen.getByText('Blog')).toBeInTheDocument();

      // 설명 텍스트가 표시되는지 확인
      expect(
        screen.getByText('From experiments to insights — my tech journey'),
      ).toBeInTheDocument();

      // SearchBar가 렌더링되는지 확인 (placeholder가 'Search...'로 변경됨)
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('중앙 정렬되어 표시된다', () => {
      const { container } = render(<BlogHeader />);

      // 중앙 정렬 클래스가 적용되었는지 확인
      const centerDiv = container.querySelector('.text-center');
      expect(centerDiv).toBeInTheDocument();
    });
  });

  describe('검색 기능', () => {
    it('검색어 입력 시 변경 이벤트가 발생한다', async () => {
      const handleSearchChange = vi.fn();
      const user = userEvent.setup();

      render(<BlogHeader onSearchChange={handleSearchChange} />);

      const input = screen.getByPlaceholderText('Search...');
      await user.clear(input);
      await user.type(input, 'React');

      // 각 문자가 입력될 때마다 호출되므로 호출 횟수 확인
      expect(handleSearchChange).toHaveBeenCalledTimes(5);
      // 각 문자가 개별적으로 호출되는 것을 확인
      expect(handleSearchChange).toHaveBeenCalledWith('R');
      expect(handleSearchChange).toHaveBeenCalledWith('e');
      expect(handleSearchChange).toHaveBeenCalledWith('a');
      expect(handleSearchChange).toHaveBeenCalledWith('c');
      expect(handleSearchChange).toHaveBeenCalledWith('t');
    });

    it('검색어 입력 후 엔터 키 입력 시 검색 이벤트가 발생한다', async () => {
      const handleSearch = vi.fn();
      const user = userEvent.setup();

      render(<BlogHeader searchValue="TypeScript" onSearch={handleSearch} />);

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, '{enter}');

      expect(handleSearch).toHaveBeenCalledWith('TypeScript');
    });

    it('로딩 상태일 때 검색이 비활성화된다', async () => {
      const handleSearch = vi.fn();
      const user = userEvent.setup();

      render(
        <BlogHeader searchValue="TypeScript" onSearch={handleSearch} isSearchLoading={true} />,
      );

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, '{enter}');

      expect(handleSearch).not.toHaveBeenCalled();
    });

    it('데스크탑 화면에서 SearchBar 컨테이너 너비가 768px로 설정되어 있다', () => {
      const { container } = render(<BlogHeader />);

      // 중간 사이즈 컨테이너의 클래스 확인
      const mediumContainer = container.querySelector('.md\\:w-\\[768px\\]');
      expect(mediumContainer).toBeInTheDocument();

      // 전체 너비 클래스도 적용되어 있는지 확인 (작은 화면)
      expect(mediumContainer).toHaveClass('w-full');
    });
  });

  describe('검색 결과 표시', () => {
    it('검색어가 있을 때만 검색 결과 메시지가 표시된다', () => {
      const { rerender } = render(<BlogHeader />);

      // 검색어가 없을 때는 메시지가 표시되지 않음
      expect(screen.queryByText(/Search results for/)).not.toBeInTheDocument();

      // 검색어가 있을 때는 메시지가 표시됨
      rerender(<BlogHeader searchValue="React" />);
      expect(screen.getByText(/Search results for/)).toBeInTheDocument();
      expect(screen.getByText(/React/)).toBeInTheDocument();
    });

    it('선택된 카테고리와 태그가 검색 결과에 표시된다', () => {
      const { rerender } = render(<BlogHeader searchValue="React" />);

      // 검색어만 있을 때
      expect(screen.getByText(/Search results for/)).toBeInTheDocument();
      expect(screen.getByText(/React/)).toBeInTheDocument();

      // 카테고리가 선택된 경우
      rerender(<BlogHeader searchValue="React" selectedCategory="JavaScript" />);
      expect(screen.getByText(/Category:/)).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();

      // 태그가 선택된 경우
      rerender(<BlogHeader searchValue="React" selectedTags={['Frontend', 'Web']} />);
      expect(screen.getByText(/Tags:/)).toBeInTheDocument();
      expect(screen.getByText('Frontend, Web')).toBeInTheDocument();

      // 카테고리와 태그가 모두 선택된 경우
      rerender(
        <BlogHeader
          searchValue="React"
          selectedCategory="JavaScript"
          selectedTags={['Frontend', 'Web']}
        />,
      );
      expect(screen.getByText(/Category:/)).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText(/Tags:/)).toBeInTheDocument();
      expect(screen.getByText('Frontend, Web')).toBeInTheDocument();
    });
  });

  describe('스타일', () => {
    it('추가 클래스가 적용된다', () => {
      const { container } = render(<BlogHeader className="test-class" />);

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass('test-class');
    });
  });
});
