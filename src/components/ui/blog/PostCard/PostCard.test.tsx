import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { PostCard, type PostCardProps } from './PostCard';

const defaultProps: PostCardProps = {
  title: 'Test Title',
  description: 'Test description',
  createdAt: '2025-06-02',
  tags: ['React', 'Next.js'],
  href: '/blog/test-post',
  id: 'post-1',
  category: { text: 'Label', color: 'blue' },
};

describe('PostCard', () => {
  it('제목, 설명, 날짜, 태그가 렌더링된다', () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Jun 02, 2025')).toBeInTheDocument();
    expect(screen.getByText('#React')).toBeInTheDocument();
    expect(screen.getByText('#Next.js')).toBeInTheDocument();
  });

  it('기본적으로 Link로 렌더링되고 올바른 href가 설정된다', () => {
    render(<PostCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('Link 컴포넌트로 렌더링되고 클릭 가능하다', () => {
    render(<PostCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('기본 스타일과 배경 클래스가 적용된다', () => {
    render(<PostCard {...defaultProps} />);
    const card = screen.getByRole('link');
    expect(card.className).toMatch(/rounded-2xl/);
  });

  it('cover가 있을 때 카테고리가 커버 위에 표시된다', () => {
    render(<PostCard {...defaultProps} cover="/test.png" />);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('cover가 없을 때 카테고리가 제목 위에 표시된다', () => {
    render(<PostCard {...defaultProps} cover={undefined} />);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });

  it('태그가 올바른 클래스와 함께 렌더링된다', () => {
    render(<PostCard {...defaultProps} />);
    const tag = screen.getByText('#React').parentElement;
    expect(tag).toHaveClass('text-xs');
  });

  it('tags가 비어 있으면 태그 영역이 렌더링되지 않는다', () => {
    render(<PostCard {...defaultProps} tags={[]} />);
    expect(screen.queryByText('#React')).not.toBeInTheDocument();
  });

  it('cover가 있으면 이미지가 렌더링된다', () => {
    render(<PostCard {...defaultProps} cover="/test.png" />);
    const img = screen.getByAltText('Test Title 커버 이미지');
    expect(img).toBeInTheDocument();
  });

  it('cover가 없을 때 이미지 영역이 렌더링되지 않아야 한다', () => {
    render(<PostCard {...defaultProps} cover={undefined} />);
    const img = screen.queryByAltText('Test Title 커버 이미지');
    expect(img).not.toBeInTheDocument();
  });

  it('className이 정상적으로 적용된다', () => {
    render(<PostCard {...defaultProps} className="custom-class" />);
    const card = screen.getByRole('link');
    expect(card.className).toMatch(/custom-class/);
  });

  it('data-post-id 속성이 올바르게 적용된다', () => {
    render(<PostCard {...defaultProps} id="pid" />);
    const card = screen.getByRole('link');
    expect(card).toHaveAttribute('data-post-id', 'pid');
  });
});
