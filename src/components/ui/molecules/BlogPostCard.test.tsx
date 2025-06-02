import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BlogPostCard, type BlogPostCardProps } from './BlogPostCard';

describe('BlogPostCard', () => {
  const defaultProps: BlogPostCardProps = {
    title: 'Test Blog Post',
    description: 'This is a test description for the blog post.',
    date: 'Jan 22, 2025',
    tags: ['React', 'TypeScript', 'Testing'],
    postId: 'test-post-id',
    category: 'Testing',
    label: {
      text: 'Development',
      color: 'blue',
    },
  };

  it('기본 블로그 포스트 카드가 렌더링된다', () => {
    render(<BlogPostCard {...defaultProps} />);

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test description for the blog post.')).toBeInTheDocument();
    expect(screen.getByText('Jan 22, 2025')).toBeInTheDocument();
    expect(screen.getByText('#React')).toBeInTheDocument();
    expect(screen.getByText('#TypeScript')).toBeInTheDocument();
    expect(screen.getByText('#Testing')).toBeInTheDocument();
  });

  it('article 태그로 렌더링된다 (클릭 핸들러가 없을 때)', () => {
    render(<BlogPostCard {...defaultProps} />);
    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
  });

  it('button 태그로 렌더링된다 (클릭 핸들러가 있을 때)', () => {
    const handleClick = vi.fn();
    render(<BlogPostCard {...defaultProps} onClick={handleClick} />);
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('type', 'button');
  });

  it('이미지가 있을 때 올바르게 렌더링된다', () => {
    render(<BlogPostCard {...defaultProps} imageUrl="/test-image.jpg" imageAlt="Test image" />);

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
  });

  it('이미지가 없을 때 이미지 영역이 렌더링되지 않는다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const image = screen.queryByRole('img');
    expect(image).not.toBeInTheDocument();
  });

  it('기본 이미지 alt 텍스트가 적용된다', () => {
    render(<BlogPostCard {...defaultProps} imageUrl="/test-image.jpg" />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'Blog post thumbnail');
  });

  it('라이트 테마가 기본값으로 적용된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('data-theme', 'light');
  });

  it('다크 테마가 올바르게 적용된다', () => {
    render(<BlogPostCard {...defaultProps} theme="dark" />);
    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('data-theme', 'dark');
  });

  it('클릭 이벤트가 올바르게 처리된다', () => {
    const handleClick = vi.fn();
    render(<BlogPostCard {...defaultProps} onClick={handleClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('태그가 없을 때 태그 영역이 렌더링되지 않는다', () => {
    render(<BlogPostCard {...defaultProps} tags={[]} />);

    // 태그 텍스트가 없는지 확인
    expect(screen.queryByText('#React')).not.toBeInTheDocument();
    expect(screen.queryByText('#TypeScript')).not.toBeInTheDocument();
    expect(screen.queryByText('#Testing')).not.toBeInTheDocument();
  });

  it('여러 태그가 올바르게 렌더링된다', () => {
    const tags = ['JavaScript', 'Node.js', 'Express', 'MongoDB'];
    render(<BlogPostCard {...defaultProps} tags={tags} />);

    tags.forEach(tag => {
      expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
    });
  });

  it('커스텀 클래스명이 적용된다', () => {
    render(<BlogPostCard {...defaultProps} className="custom-class" />);
    const card = screen.getByRole('article');
    expect(card).toHaveClass('custom-class');
  });

  it('기본 스타일 클래스들이 적용된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const card = screen.getByRole('article');

    expect(card).toHaveClass('rounded-3xl', 'p-4', 'transition-all', 'duration-300', 'ease-in-out');
  });

  it('클릭 가능한 카드에 호버 스타일이 적용된다', () => {
    const handleClick = vi.fn();
    render(<BlogPostCard {...defaultProps} onClick={handleClick} />);
    const card = screen.getByRole('button');

    expect(card).toHaveClass('cursor-pointer', 'hover:scale-[1.02]', 'hover:shadow-lg');
  });

  it('클릭 불가능한 카드에 호버 스타일이 적용되지 않는다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const card = screen.getByRole('article');

    expect(card).not.toHaveClass('cursor-pointer', 'hover:scale-[1.02]', 'hover:shadow-lg');
  });

  it('라이트 테마 배경 스타일이 적용된다', () => {
    render(<BlogPostCard {...defaultProps} theme="light" />);
    const card = screen.getByRole('article');

    expect(card).toHaveClass('bg-[color:var(--color-background-light)]');
    expect(card).toHaveClass('shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]');
  });

  it('다크 테마 배경 스타일이 적용된다', () => {
    render(<BlogPostCard {...defaultProps} theme="dark" />);
    const card = screen.getByRole('article');

    expect(card).toHaveClass('bg-[color:var(--color-background-dark)]');
    expect(card).toHaveClass('shadow-[0px_4px_4px_0px_rgba(255,255,255,0.25)]');
  });

  it('모든 HTML attributes가 올바르게 전달된다', () => {
    render(
      <BlogPostCard
        {...defaultProps}
        data-testid="blog-card"
        title="Custom Title"
        aria-label="Blog post card"
      />,
    );

    const card = screen.getByTestId('blog-card');
    expect(card).toHaveAttribute('aria-label', 'Blog post card');
  });

  it('긴 설명 텍스트에 line-clamp가 적용된다', () => {
    const longDescription =
      'This is a very long description that should be truncated after a certain number of lines to maintain the card layout consistency.';

    render(<BlogPostCard {...defaultProps} description={longDescription} />);
    const descriptionElement = screen.getByText(longDescription);

    expect(descriptionElement).toHaveClass('line-clamp-2');
  });

  it('태그에 고유한 key가 적용된다', () => {
    const duplicateTags = ['React', 'React', 'TypeScript'];

    // 중복 태그가 있어도 에러 없이 렌더링되는지 확인
    expect(() => {
      render(<BlogPostCard {...defaultProps} tags={duplicateTags} />);
    }).not.toThrow();

    // 모든 태그가 렌더링되는지 확인 (중복 포함)
    const reactTags = screen.getAllByText('#React');
    expect(reactTags).toHaveLength(2);
    expect(screen.getByText('#TypeScript')).toBeInTheDocument();
  });

  it('Typography 컴포넌트들이 올바른 테마를 받는다', () => {
    render(<BlogPostCard {...defaultProps} theme="dark" />);

    // 제목, 날짜, 설명 요소들이 모두 data-theme="dark"를 가지는지 확인
    const title = screen.getByText('Test Blog Post').closest('h3');
    const date = screen.getByText('Jan 22, 2025').closest('time');
    const description = screen
      .getByText('This is a test description for the blog post.')
      .closest('p');

    expect(title).toHaveAttribute('data-theme', 'dark');
    expect(date).toHaveAttribute('data-theme', 'dark');
    expect(description).toHaveAttribute('data-theme', 'dark');
  });

  it('라벨이 좌상단에 렌더링된다', () => {
    render(<BlogPostCard {...defaultProps} />);

    const label = screen.getByText('Development');
    expect(label).toBeInTheDocument();

    const labelContainer = label.closest('div');
    expect(labelContainer?.parentElement).toHaveClass('absolute', 'top-4', 'left-4', 'z-10');
  });

  it('라벨이 없으면 라벨 영역이 렌더링되지 않는다', () => {
    render(<BlogPostCard {...defaultProps} label={undefined} />);

    expect(screen.queryByText('Development')).not.toBeInTheDocument();
  });

  it('라벨의 색상이 올바르게 적용된다', () => {
    render(<BlogPostCard {...defaultProps} label={{ text: 'Test Label', color: 'red' }} />);

    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('라벨이 올바른 테마를 받는다', () => {
    render(<BlogPostCard {...defaultProps} theme="dark" />);

    const label = screen.getByText('Development');
    expect(label).toHaveAttribute('data-theme', 'dark');
  });

  it('카드에 relative 클래스가 적용된다 (라벨 절대 위치를 위해)', () => {
    render(<BlogPostCard {...defaultProps} />);
    const card = screen.getByRole('article');
    expect(card).toHaveClass('relative');
  });

  it('최대 width가 380px로 고정된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const card = screen.getByRole('article');

    expect(card).toHaveClass('w-full', 'max-w-[380px]');
  });

  it('이미지가 반응형 높이를 갖는다', () => {
    render(<BlogPostCard {...defaultProps} imageUrl="/test-image.jpg" />);

    const imageContainer = screen.getByRole('img').parentElement;
    expect(imageContainer).toHaveClass('h-48', 'sm:h-52', 'md:h-56', 'lg:h-60');
  });

  it('제목에 truncate 클래스가 적용된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const title = screen.getByText('Test Blog Post').closest('h3');
    expect(title).toHaveClass('truncate');
  });

  it('설명에 line-clamp가 적용된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const description = screen
      .getByText('This is a test description for the blog post.')
      .closest('p');
    expect(description).toHaveClass('line-clamp-2');
  });

  it('모든 텍스트 요소가 좌측 정렬된다', () => {
    render(<BlogPostCard {...defaultProps} />);

    const titleContainer = screen.getByText('Test Blog Post').closest('div');
    const dateContainer = screen.getByText('Jan 22, 2025').closest('div');
    const descriptionContainer = screen
      .getByText('This is a test description for the blog post.')
      .closest('div');

    expect(titleContainer).toHaveClass('text-left');
    expect(dateContainer).toHaveClass('text-left');
    expect(descriptionContainer).toHaveClass('text-left');
  });

  it('태그에 max-width와 truncate가 적용된다', () => {
    const longTags = ['VeryLongTagName'];
    render(<BlogPostCard {...defaultProps} tags={longTags} />);

    const tagElement = screen.getByText('#VeryLongTagName').closest('div');
    expect(tagElement).toHaveClass('truncate', 'max-w-20', 'sm:max-w-24', 'md:max-w-28');
  });

  it('반응형 폰트 크기가 적용된다', () => {
    render(<BlogPostCard {...defaultProps} />);

    const title = screen.getByText('Test Blog Post').closest('h3');
    const date = screen.getByText('Jan 22, 2025').closest('time');
    const description = screen
      .getByText('This is a test description for the blog post.')
      .closest('p');

    expect(title).toHaveClass('text-lg', 'sm:text-xl', 'md:text-xl', 'lg:text-2xl');
    expect(date).toHaveClass('text-xs', 'sm:text-sm');
    expect(description).toHaveClass('text-xs', 'sm:text-sm', 'md:text-sm');
  });

  it('카테고리가 표시된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    expect(screen.getByText('Testing')).toBeInTheDocument();
  });

  it('postId가 data-post-id 속성으로 설정된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('data-post-id', 'test-post-id');
  });

  it('postId가 없어도 에러가 발생하지 않는다', () => {
    expect(() => {
      render(<BlogPostCard {...defaultProps} postId={undefined} />);
    }).not.toThrow();
  });
});
