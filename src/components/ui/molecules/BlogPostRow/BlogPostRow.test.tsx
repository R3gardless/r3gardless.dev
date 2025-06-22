import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BlogPostRow } from './BlogPostRow';

const defaultProps = {
  id: '1',
  title: '테스트 제목',
  description: '테스트 설명',
  date: 'Jan 22, 2025',
  category: {
    text: '데이터베이스',
    color: 'blue' as const,
  },
  tags: ['React', 'TypeScript'],
  thumbnailUrl: '/test-image.jpg',
  href: '/blog/test-post',
};

describe('BlogPostRow', () => {
  it('기본 정보를 올바르게 렌더링해야 한다', () => {
    render(<BlogPostRow {...defaultProps} />);

    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
    expect(screen.getByText('테스트 설명')).toBeInTheDocument();
    expect(screen.getByText('Jan 22, 2025')).toBeInTheDocument();
    expect(screen.getByText('데이터베이스')).toBeInTheDocument();
    expect(screen.getByText('#React')).toBeInTheDocument();
    expect(screen.getByText('#TypeScript')).toBeInTheDocument();
  });

  it('썸네일 이미지가 있을 때 올바르게 렌더링해야 한다', () => {
    render(<BlogPostRow {...defaultProps} />);

    const image = screen.getByAltText('테스트 제목 썸네일');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });

  it('썸네일 이미지가 없을 때 이미지 영역이 렌더링되지 않아야 한다', () => {
    render(<BlogPostRow {...defaultProps} thumbnailUrl={undefined} />);

    const image = screen.queryByAltText('테스트 제목 썸네일');
    expect(image).not.toBeInTheDocument();
  });

  it('Link 컴포넌트가 올바른 href를 가져야 한다', () => {
    render(<BlogPostRow {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('카테고리 클릭 시 onCategoryClick 콜백이 호출되어야 한다', () => {
    const handleCategoryClick = vi.fn();
    render(<BlogPostRow {...defaultProps} onCategoryClick={handleCategoryClick} />);

    const category = screen.getByText('데이터베이스');
    fireEvent.click(category);

    expect(handleCategoryClick).toHaveBeenCalledWith('데이터베이스');
  });

  it('태그 클릭 시 onTagClick 콜백이 호출되어야 한다', () => {
    const handleTagClick = vi.fn();
    render(<BlogPostRow {...defaultProps} onTagClick={handleTagClick} />);

    const tag = screen.getByText('#React');
    fireEvent.click(tag);

    expect(handleTagClick).toHaveBeenCalledWith('React');
  });

  it('다크 테마가 적용되어야 한다', () => {
    render(<BlogPostRow {...defaultProps} theme="dark" />);

    const postRow = screen.getByRole('link');
    expect(postRow).toHaveAttribute('data-theme', 'dark');
  });

  it('추가 클래스명이 적용되어야 한다', () => {
    render(<BlogPostRow {...defaultProps} className="custom-class" />);

    const postRow = screen.getByRole('link');
    expect(postRow).toHaveClass('custom-class');
  });

  it('이벤트 전파가 올바르게 처리되어야 한다', () => {
    const handleCategoryClick = vi.fn();
    const handleTagClick = vi.fn();

    render(
      <BlogPostRow
        {...defaultProps}
        onCategoryClick={handleCategoryClick}
        onTagClick={handleTagClick}
      />,
    );

    // 카테고리 클릭 테스트
    const category = screen.getByText('데이터베이스');
    fireEvent.click(category);
    expect(handleCategoryClick).toHaveBeenCalledWith('데이터베이스');

    // 태그 클릭 테스트
    const tag = screen.getByText('#React');
    fireEvent.click(tag);
    expect(handleTagClick).toHaveBeenCalledWith('React');
  });
});
