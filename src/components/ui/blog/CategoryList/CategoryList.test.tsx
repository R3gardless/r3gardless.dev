import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { CategoryList } from './CategoryList';

// 테스트용 카테고리 목록
const sampleCategories = ['전체', 'React', 'TypeScript', 'Next.js', 'JavaScript'];

describe('CategoryList', () => {
  describe('vertical variant', () => {
    it('세로 레이아웃이 정상적으로 렌더링된다', () => {
      render(
        <CategoryList variant="vertical" categories={sampleCategories} selectedCategory="React" />,
      );

      expect(screen.getByText('카테고리')).toBeInTheDocument();
      sampleCategories.forEach(category => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it('선택된 카테고리가 올바르게 표시된다', () => {
      render(
        <CategoryList variant="vertical" categories={sampleCategories} selectedCategory="React" />,
      );

      const selectedButton = screen.getByRole('button', { name: 'React' });
      expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
      expect(selectedButton).toBeDisabled();
    });

    it('더보기 버튼이 표시된다', () => {
      render(<CategoryList variant="vertical" categories={sampleCategories} showMore={true} />);

      expect(screen.getByText('+ 더보기')).toBeInTheDocument();
    });

    it('더보기 버튼이 숨겨진다', () => {
      render(<CategoryList variant="vertical" categories={sampleCategories} showMore={false} />);

      expect(screen.queryByText('+ 더보기')).not.toBeInTheDocument();
    });

    it('카테고리 클릭 이벤트가 정상적으로 작동한다', () => {
      const handleCategoryClick = vi.fn();

      render(
        <CategoryList
          variant="vertical"
          categories={sampleCategories}
          onCategoryClick={handleCategoryClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'TypeScript' }));
      expect(handleCategoryClick).toHaveBeenCalledWith('TypeScript');
    });

    it('더보기 클릭 이벤트가 정상적으로 작동한다', () => {
      const handleMoreClick = vi.fn();

      render(
        <CategoryList
          variant="vertical"
          categories={sampleCategories}
          showMore={true}
          onMoreClick={handleMoreClick}
        />,
      );

      fireEvent.click(screen.getByText('+ 더보기'));
      expect(handleMoreClick).toHaveBeenCalled();
    });

    it('selectedCategory가 없을 때 "전체" 카테고리가 기본 선택된다', () => {
      render(
        <CategoryList
          variant="vertical"
          categories={sampleCategories}
          selectedCategory={undefined}
        />,
      );

      const defaultButton = screen.getByRole('button', { name: '전체' });
      expect(defaultButton).toHaveAttribute('aria-pressed', 'true');
      expect(defaultButton).toBeDisabled();
    });

    it('selectedCategory가 빈 문자열일 때 "전체" 카테고리가 기본 선택된다', () => {
      render(<CategoryList variant="vertical" categories={sampleCategories} selectedCategory="" />);

      const defaultButton = screen.getByRole('button', { name: '전체' });
      expect(defaultButton).toHaveAttribute('aria-pressed', 'true');
      expect(defaultButton).toBeDisabled();
    });
  });

  describe('horizontal variant', () => {
    it('가로 레이아웃이 정상적으로 렌더링된다', () => {
      render(
        <CategoryList
          variant="horizontal"
          categories={sampleCategories}
          selectedCategory="React"
        />,
      );

      sampleCategories.forEach(category => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });

      // 카테고리 제목이 없어야 함
      expect(screen.queryByText('카테고리')).not.toBeInTheDocument();
    });

    it('선택된 카테고리가 올바르게 표시된다', () => {
      render(
        <CategoryList
          variant="horizontal"
          categories={sampleCategories}
          selectedCategory="React"
        />,
      );

      const selectedButton = screen.getByRole('button', { name: 'React' });
      expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
      expect(selectedButton).toBeDisabled();
    });

    it('더보기 버튼이 표시되지 않는다', () => {
      render(<CategoryList variant="horizontal" categories={sampleCategories} showMore={true} />);

      expect(screen.queryByText('+ 더보기')).not.toBeInTheDocument();
    });

    it('카테고리 클릭 이벤트가 정상적으로 작동한다', () => {
      const handleCategoryClick = vi.fn();

      render(
        <CategoryList
          variant="horizontal"
          categories={sampleCategories}
          onCategoryClick={handleCategoryClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'TypeScript' }));
      expect(handleCategoryClick).toHaveBeenCalledWith('TypeScript');
    });

    it('선택된 카테고리를 클릭해도 이벤트가 발생하지 않는다', () => {
      const handleCategoryClick = vi.fn();

      render(
        <CategoryList
          variant="horizontal"
          categories={sampleCategories}
          selectedCategory="React"
          onCategoryClick={handleCategoryClick}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'React' }));
      expect(handleCategoryClick).not.toHaveBeenCalled();
    });

    it('selectedCategory가 없을 때 "전체" 카테고리가 기본 선택된다', () => {
      render(
        <CategoryList
          variant="horizontal"
          categories={sampleCategories}
          selectedCategory={undefined}
        />,
      );

      const defaultButton = screen.getByRole('button', { name: '전체' });
      expect(defaultButton).toHaveAttribute('aria-pressed', 'true');
      expect(defaultButton).toBeDisabled();
    });

    it('selectedCategory가 빈 문자열일 때 "전체" 카테고리가 기본 선택된다', () => {
      render(
        <CategoryList variant="horizontal" categories={sampleCategories} selectedCategory="" />,
      );

      const defaultButton = screen.getByRole('button', { name: '전체' });
      expect(defaultButton).toHaveAttribute('aria-pressed', 'true');
      expect(defaultButton).toBeDisabled();
    });
  });

  describe('공통 기능', () => {
    it('커스텀 클래스명이 적용된다', () => {
      const { container } = render(
        <CategoryList variant="vertical" categories={sampleCategories} className="custom-class" />,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('카테고리가 없을 때도 정상적으로 렌더링된다', () => {
      render(<CategoryList variant="vertical" categories={[]} />);

      expect(screen.getByText('카테고리')).toBeInTheDocument();
    });

    it('선택된 카테고리가 없을 때 "전체"가 기본 선택되어 렌더링된다', () => {
      render(<CategoryList variant="horizontal" categories={sampleCategories} />);

      // "전체" 카테고리는 선택된 상태
      const defaultButton = screen.getByRole('button', { name: '전체' });
      expect(defaultButton).toHaveAttribute('aria-pressed', 'true');
      expect(defaultButton).toBeDisabled();

      // 나머지 카테고리들은 선택되지 않은 상태
      sampleCategories.slice(1).forEach(category => {
        const button = screen.getByRole('button', { name: category });
        expect(button).toHaveAttribute('aria-pressed', 'false');
        expect(button).not.toBeDisabled();
      });
    });
  });
});
