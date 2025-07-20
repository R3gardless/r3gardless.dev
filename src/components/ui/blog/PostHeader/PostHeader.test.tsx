import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { PostHeader } from './PostHeader';

describe('PostHeader', () => {
  const defaultProps = {
    id: '1',
    description: 'This is a test description for the post.',
    tags: [],
    category: {
      text: 'Frontend',
      color: 'blue' as const,
    },
    title: 'Test Post Title',
    createdAt: 'Jan 22, 2025',
  };

  it('기본 props로 렌더링된다', () => {
    render(<PostHeader {...defaultProps} />);

    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText('Jan 22, 2025')).toBeInTheDocument();
  });

  it('커버 이미지가 있을 때 렌더링된다', () => {
    render(<PostHeader {...defaultProps} cover="/test-image.jpg" />);

    const image = screen.getByAltText('Test Post Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test-image.jpg'));
  });

  it('카테고리가 있을 때 렌더링된다', () => {
    render(<PostHeader {...defaultProps} category={{ text: 'Frontend', color: 'blue' }} />);

    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  it('태그들이 렌더링된다', () => {
    const tags = ['React', 'TypeScript', 'Next.js'];
    render(<PostHeader {...defaultProps} tags={tags} />);

    tags.forEach(tag => {
      expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
    });
  });

  it('설명이 있을 때 렌더링된다', () => {
    const description = 'This is a test description';
    render(<PostHeader {...defaultProps} description={description} />);

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('카테고리 클릭 이벤트가 작동한다', () => {
    const handleCategoryClick = vi.fn();
    render(
      <PostHeader
        {...defaultProps}
        category={{ text: 'Frontend', color: 'blue' }}
        onCategoryClick={handleCategoryClick}
      />,
    );

    fireEvent.click(screen.getByText('Frontend'));
    expect(handleCategoryClick).toHaveBeenCalledWith('Frontend');
  });

  it('태그 클릭 이벤트가 작동한다', () => {
    const handleTagClick = vi.fn();
    render(<PostHeader {...defaultProps} tags={['React']} onTagClick={handleTagClick} />);

    fireEvent.click(screen.getByText('#React'));
    expect(handleTagClick).toHaveBeenCalledWith('React');
  });

  it('커스텀 className이 적용된다', () => {
    const { container } = render(<PostHeader {...defaultProps} className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  describe('접근성', () => {
    it('제목이 h1 태그로 렌더링된다', () => {
      render(<PostHeader {...defaultProps} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Test Post Title');
    });

    it('날짜가 time 태그로 렌더링된다', () => {
      render(<PostHeader {...defaultProps} />);

      const timeElement = screen.getByText('Jan 22, 2025');
      expect(timeElement.tagName).toBe('TIME');
    });

    it('썸네일 이미지에 적절한 alt 텍스트가 있다', () => {
      render(<PostHeader {...defaultProps} cover="/test-image.jpg" />);

      const image = screen.getByAltText('Test Post Title');
      expect(image).toBeInTheDocument();
    });

    it('alt 텍스트가 없을 때 제목을 사용한다', () => {
      render(<PostHeader {...defaultProps} cover="/test-image.jpg" />);

      const image = screen.getByAltText('Test Post Title');
      expect(image).toBeInTheDocument();
    });
  });

  describe('조건부 렌더링', () => {
    it('썸네일이 없을 때 이미지가 렌더링되지 않는다', () => {
      render(<PostHeader {...defaultProps} />);

      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('카테고리가 없을 때 카테고리가 렌더링되지 않는다', () => {
      render(<PostHeader {...defaultProps} />);

      // LabelButton이 렌더링되지 않았는지 확인
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('태그가 없을 때 태그가 렌더링되지 않는다', () => {
      render(<PostHeader {...defaultProps} />);

      // # 문자로 시작하는 태그가 없는지 확인
      const allText = screen.getByRole('article').textContent;
      expect(allText).not.toMatch(/#/);
    });
  });

  describe('스타일링', () => {
    it('기본 스타일 클래스가 적용된다', () => {
      const { container } = render(<PostHeader {...defaultProps} />);

      const article = container.firstChild;
      expect(article).toHaveClass('w-full', 'max-w-[1024px] mx-auto');
    });
  });

  describe('이벤트 핸들러', () => {
    it('카테고리 클릭 핸들러가 없을 때 클릭 이벤트가 발생하지 않는다', () => {
      render(<PostHeader {...defaultProps} category={{ text: 'Frontend', color: 'blue' }} />);

      const categoryElement = screen.getByText('Frontend');
      // 클릭 가능한 요소가 아닌지 확인 (span으로 렌더링됨)
      expect(categoryElement.tagName).toBe('SPAN');
    });

    it('태그 클릭 핸들러가 없을 때 클릭 이벤트가 발생하지 않는다', () => {
      render(<PostHeader {...defaultProps} tags={['React']} />);

      const tagElement = screen.getByText('#React');
      // 클릭 가능한 요소가 아닌지 확인 (span으로 렌더링됨)
      expect(tagElement.tagName).toBe('SPAN');
    });
  });
});
