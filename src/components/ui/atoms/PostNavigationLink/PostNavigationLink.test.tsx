import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { PostNavigationLink } from './PostNavigationLink';

const mockPost = {
  title: 'Test Post Title',
  href: '/blog/test-post',
};

describe('PostNavigationLink', () => {
  it('renders previous post link correctly', () => {
    render(<PostNavigationLink post={mockPost} direction="prev" />);

    expect(screen.getByText('이전글')).toBeInTheDocument();
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/test-post');
  });

  it('renders next post link correctly', () => {
    render(<PostNavigationLink post={mockPost} direction="next" />);

    expect(screen.getByText('다음글')).toBeInTheDocument();
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/test-post');
  });

  it('applies correct theme data attribute', () => {
    render(<PostNavigationLink post={mockPost} direction="prev" theme="dark" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-theme', 'dark');
  });

  it('applies custom className', () => {
    render(<PostNavigationLink post={mockPost} direction="prev" className="custom-class" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });

  it('has correct title attribute for accessibility', () => {
    render(<PostNavigationLink post={mockPost} direction="prev" />);

    const titleElement = screen.getByTitle('Test Post Title');
    expect(titleElement).toBeInTheDocument();
  });

  it('renders ChevronLeft icon for previous post', () => {
    const { container } = render(<PostNavigationLink post={mockPost} direction="prev" />);

    // ChevronLeft 아이콘이 렌더링되었는지 확인 (lucide-react 아이콘은 svg로 렌더링됨)
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders ChevronRight icon for next post', () => {
    const { container } = render(<PostNavigationLink post={mockPost} direction="next" />);

    // ChevronRight 아이콘이 렌더링되었는지 확인
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies correct text alignment for previous post', () => {
    render(<PostNavigationLink post={mockPost} direction="prev" />);

    const titleElement = screen.getByTitle('Test Post Title');
    expect(titleElement).toHaveClass('text-left');
  });

  it('applies correct text alignment for next post', () => {
    render(<PostNavigationLink post={mockPost} direction="next" />);

    const titleElement = screen.getByTitle('Test Post Title');
    expect(titleElement).toHaveClass('text-right');
  });
});
