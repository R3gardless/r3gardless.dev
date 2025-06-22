import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { BlogPostCard, type BlogPostCardProps } from './BlogPostCard';

const defaultProps: BlogPostCardProps = {
  title: 'Test Title',
  description: 'Test description',
  date: '2025-06-02',
  tags: ['React', 'Next.js'],
  href: '/blog/test-post',
  postId: 'post-1',
  label: { text: 'Label', color: 'blue' },
};

describe('BlogPostCard', () => {
  it('제목, 설명, 날짜, 태그가 렌더링된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('2025-06-02')).toBeInTheDocument();
    expect(screen.getByText('#React')).toBeInTheDocument();
    expect(screen.getByText('#Next.js')).toBeInTheDocument();
  });

  it('기본적으로 Link로 렌더링되고 올바른 href가 설정된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('Link 컴포넌트로 렌더링되고 클릭 가능하다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('기본 스타일과 배경 클래스가 적용된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const card = screen.getByRole('link');
    expect(card.className).toMatch(/rounded-2xl/);
    expect(card.className).toMatch(/bg-\[color:var\(--color-background\)\]/);
  });

  it('반응형 너비 클래스가 올바르게 적용된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const card = screen.getByRole('link');
    // sm: 100% (w-full)
    expect(card.className).toMatch(/w-full/);
    // md: 380px
    expect(card.className).toMatch(/md:w-\[380px\]/);
    // lg: 330px
    expect(card.className).toMatch(/lg:w-\[330px\]/);
  });

  it('imageUrl이 있을 때 라벨이 썸네일 위에 표시된다', () => {
    render(<BlogPostCard {...defaultProps} imageUrl="/test.png" />);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('imageUrl이 없을 때 라벨이 제목 위에 표시된다', () => {
    render(<BlogPostCard {...defaultProps} imageUrl={undefined} />);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('label prop이 없으면 라벨이 렌더링되지 않는다', () => {
    render(<BlogPostCard {...defaultProps} label={undefined} />);
    expect(screen.queryByText('Label')).not.toBeInTheDocument();
  });

  it('태그가 올바른 클래스와 함께 렌더링된다', () => {
    render(<BlogPostCard {...defaultProps} />);
    const tag = screen.getByText('#React').parentElement;
    expect(tag).toHaveClass('text-xs');
  });

  it('tags가 비어 있으면 태그 영역이 렌더링되지 않는다', () => {
    render(<BlogPostCard {...defaultProps} tags={[]} />);
    expect(screen.queryByText('#React')).not.toBeInTheDocument();
  });

  it('imageUrl이 있으면 이미지가 렌더링된다', () => {
    render(<BlogPostCard {...defaultProps} imageUrl="/test.png" imageAlt="alt text" />);
    const img = screen.getByAltText('alt text');
    expect(img).toBeInTheDocument();
  });

  it('imageAlt가 없으면 기본 alt로 이미지가 렌더링된다', () => {
    render(<BlogPostCard {...defaultProps} imageUrl="/test.png" imageAlt={undefined} />);
    const img = screen.getByAltText('Blog post thumbnail');
    expect(img).toBeInTheDocument();
  });

  it('className이 정상적으로 적용된다', () => {
    render(<BlogPostCard {...defaultProps} className="custom-class" />);
    const card = screen.getByRole('link');
    expect(card.className).toMatch(/custom-class/);
  });

  it('data-theme, data-post-id 속성이 올바르게 적용된다', () => {
    render(<BlogPostCard {...defaultProps} theme="dark" postId="pid" />);
    const card = screen.getByRole('link');
    expect(card).toHaveAttribute('data-theme', 'dark');
    expect(card).toHaveAttribute('data-post-id', 'pid');
  });
});
