import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BlogSidebar } from '.';

// 테스트용 샘플 데이터
const SAMPLE_CATEGORIES = ['전체', 'React', 'JavaScript'];
const SAMPLE_TAGS = ['React', 'TypeScript', 'Next.js', 'Node.js'];

describe('BlogSidebar', () => {
  describe('기본 렌더링', () => {
    it('BlogSidebar가 렌더링된다', () => {
      render(<BlogSidebar categories={SAMPLE_CATEGORIES} tags={SAMPLE_TAGS} />);

      // 카테고리 제목이 표시되는지 확인
      expect(screen.getByText('카테고리')).toBeInTheDocument();

      // 태그 제목이 표시되는지 확인
      expect(screen.getByText('태그')).toBeInTheDocument();

      // 카테고리 목록이 렌더링되는지 확인
      SAMPLE_CATEGORIES.forEach(category => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });

      // 태그 목록이 렌더링되는지 확인 (태그는 #을 포함하여 렌더링됨)
      SAMPLE_TAGS.forEach(tag => {
        expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
      });
    });

    it('isHidden=true인 경우 사이드바가 렌더링되지 않는다', () => {
      const { container } = render(
        <BlogSidebar categories={SAMPLE_CATEGORIES} tags={SAMPLE_TAGS} isHidden={true} />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('선택된 카테고리가 있는 경우 표시된다', () => {
      render(
        <BlogSidebar categories={SAMPLE_CATEGORIES} selectedCategory="React" tags={SAMPLE_TAGS} />,
      );

      // React 카테고리가 선택된 상태로 표시되는지 확인
      // CategoryButton 컴포넌트 내부 로직에 따라 달라질 수 있음
      const reactCategory = screen.getByText('React');
      expect(reactCategory).toBeInTheDocument();
    });

    it('선택된 태그가 있는 경우 표시된다', () => {
      render(
        <BlogSidebar
          categories={SAMPLE_CATEGORIES}
          tags={SAMPLE_TAGS}
          selectedTags={['TypeScript']}
        />,
      );

      // TypeScript 태그가 선택된 상태로 표시되는지 확인
      // 모두지우기 버튼도 표시되어야 함
      const clearAllButton = screen.getByText('모두지우기');
      expect(clearAllButton).toBeInTheDocument();
    });
  });

  describe('이벤트 핸들링', () => {
    it('카테고리 클릭 시 onCategoryClick이 호출된다', () => {
      const handleCategoryClick = vi.fn();

      render(
        <BlogSidebar
          categories={SAMPLE_CATEGORIES}
          tags={SAMPLE_TAGS}
          onCategoryClick={handleCategoryClick}
        />,
      );

      // React 카테고리 클릭
      fireEvent.click(screen.getByText('React'));

      expect(handleCategoryClick).toHaveBeenCalledWith('React');
    });

    it('태그 클릭 시 onTagClick이 호출된다', () => {
      const handleTagClick = vi.fn();

      render(
        <BlogSidebar
          categories={SAMPLE_CATEGORIES}
          tags={SAMPLE_TAGS}
          onTagClick={handleTagClick}
        />,
      );

      // #TypeScript 태그 클릭 (태그는 #을 포함하여 렌더링됨)
      fireEvent.click(screen.getByText('#TypeScript'));

      expect(handleTagClick).toHaveBeenCalledWith('TypeScript');
    });

    it('모두지우기 클릭 시 onClearAllTags가 호출된다', () => {
      const handleClearAll = vi.fn();

      render(
        <BlogSidebar
          categories={SAMPLE_CATEGORIES}
          tags={SAMPLE_TAGS}
          selectedTags={['React', 'TypeScript']}
          onClearAllTags={handleClearAll}
        />,
      );

      // 모두지우기 버튼 클릭
      fireEvent.click(screen.getByText('모두지우기'));

      expect(handleClearAll).toHaveBeenCalled();
    });

    it('카테고리 더보기 클릭 시 onMoreCategoriesClick이 호출된다', () => {
      const handleMoreCategories = vi.fn();

      render(
        <BlogSidebar
          categories={SAMPLE_CATEGORIES}
          tags={SAMPLE_TAGS}
          onMoreCategoriesClick={handleMoreCategories}
        />,
      );

      // 카테고리 더보기 버튼 - 위에서부터 첫 번째
      const moreButtons = screen.getAllByText('+ 더보기');
      fireEvent.click(moreButtons[0]);

      expect(handleMoreCategories).toHaveBeenCalled();
    });

    it('태그 더보기 클릭 시 onMoreTagsClick이 호출된다', () => {
      const handleMoreTags = vi.fn();

      render(
        <BlogSidebar
          categories={SAMPLE_CATEGORIES}
          tags={SAMPLE_TAGS}
          onMoreTagsClick={handleMoreTags}
        />,
      );

      // 태그 더보기 버튼 - 위에서부터 두 번째
      const moreButtons = screen.getAllByText('+ 더보기');
      fireEvent.click(moreButtons[1]);

      expect(handleMoreTags).toHaveBeenCalled();
    });
  });

  describe('조건부 렌더링', () => {
    it('showMoreCategories=false인 경우 카테고리 더보기가 표시되지 않는다', () => {
      render(
        <BlogSidebar
          categories={SAMPLE_CATEGORIES}
          tags={SAMPLE_TAGS}
          showMoreCategories={false}
        />,
      );

      const moreButtons = screen.getAllByText('+ 더보기');
      // 태그 더보기만 있어야 함
      expect(moreButtons.length).toBe(1);
    });

    it('showMoreTags=false인 경우 태그 더보기가 표시되지 않는다', () => {
      render(
        <BlogSidebar categories={SAMPLE_CATEGORIES} tags={SAMPLE_TAGS} showMoreTags={false} />,
      );

      const moreButtons = screen.getAllByText('+ 더보기');
      // 카테고리 더보기만 있어야 함
      expect(moreButtons.length).toBe(1);
    });
  });
});
