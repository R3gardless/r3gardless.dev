import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import type { RelatedPostRowProps } from '@/components/ui/blog/RelatedPostRow';

import { RelatedPosts } from './RelatedPosts';

// 샘플 데이터
const samplePosts: RelatedPostRowProps[] = [
  {
    id: 1,
    title: 'React 18의 새로운 기능들',
    createdAt: '2024년 1월 15일',
    href: '/posts/react-18-features',
  },
  {
    id: 2,
    title: 'TypeScript 5.0 마이그레이션 가이드',
    createdAt: '2024년 1월 10일',
    href: '/posts/typescript-5-migration',
  },
  {
    id: 3,
    title: 'Next.js App Router 완벽 가이드',
    createdAt: '2024년 1월 5일',
    href: '/posts/nextjs-app-router-guide',
  },
];

describe('RelatedPosts', () => {
  it('포스트 목록을 올바르게 렌더링한다', () => {
    render(<RelatedPosts posts={samplePosts} category="React" />);

    // 모든 포스트가 렌더링되는지 확인
    expect(screen.getByText('React 18의 새로운 기능들')).toBeInTheDocument();
    expect(screen.getByText('TypeScript 5.0 마이그레이션 가이드')).toBeInTheDocument();
    expect(screen.getByText('Next.js App Router 완벽 가이드')).toBeInTheDocument();
  });

  it('카테고리 제목을 표시한다', () => {
    render(<RelatedPosts posts={samplePosts} category="React" showTitle={true} />);
    expect(screen.getByText('React 주제의 다른 글')).toBeInTheDocument();
  });

  it('제목을 숨길 수 있다', () => {
    render(<RelatedPosts posts={samplePosts} category="React" showTitle={false} />);
    expect(screen.queryByText('React 주제의 다른 글')).not.toBeInTheDocument();
  });

  it('현재 포스트를 올바르게 표시한다', () => {
    render(<RelatedPosts posts={samplePosts} category="React" currentPostId={2} />);
    expect(screen.getByText('현재')).toBeInTheDocument();
  });

  it('로딩 상태를 올바르게 표시한다', () => {
    render(<RelatedPosts posts={[]} category="React" isLoading={true} postsPerPage={3} />);

    // 로딩 스켈레톤이 표시되는지 확인
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements).toHaveLength(3);
  });

  it('빈 상태를 올바르게 표시한다', () => {
    render(<RelatedPosts posts={[]} category="React" isLoading={false} />);
    expect(screen.getByText('관련 포스트가 없습니다.')).toBeInTheDocument();
  });

  it('커스텀 빈 상태 메시지를 표시한다', () => {
    render(
      <RelatedPosts
        posts={[]}
        category="React"
        isLoading={false}
        emptyMessage="포스트를 찾을 수 없습니다."
      />,
    );
    expect(screen.getByText('포스트를 찾을 수 없습니다.')).toBeInTheDocument();
  });

  it('카테고리명을 포함한 제목을 표시한다', () => {
    render(<RelatedPosts posts={samplePosts} category="React" showTitle={true} />);
    expect(screen.getByText('React 주제의 다른 글')).toBeInTheDocument();
  });

  it('카테고리와 총 개수를 포함한 제목을 표시한다', () => {
    render(
      <RelatedPosts
        posts={samplePosts}
        category="Frontend"
        totalPostsCount={15}
        showTitle={true}
      />,
    );
    expect(screen.getByText('Frontend 주제의 다른 글')).toBeInTheDocument();
    expect(screen.getByText('15개')).toBeInTheDocument();
  });

  it('페이지네이션이 활성화될 때 PaginationBar를 렌더링한다', () => {
    const onPageChange = vi.fn();
    render(
      <RelatedPosts
        posts={samplePosts}
        category="React"
        enablePagination={true}
        currentPage={1}
        totalPages={2}
        onPageChange={onPageChange}
      />,
    );

    // 페이지네이션이 렌더링되는지 확인
    expect(screen.getByRole('navigation', { name: '페이지네이션' })).toBeInTheDocument();
  });

  it('페이지네이션이 비활성화될 때 PaginationBar를 렌더링하지 않는다', () => {
    render(<RelatedPosts posts={samplePosts} category="React" enablePagination={false} />);

    // 페이지네이션이 렌더링되지 않는지 확인
    expect(screen.queryByRole('navigation', { name: '페이지네이션' })).not.toBeInTheDocument();
  });

  it('페이지가 1개일 때 페이지네이션을 표시하지 않는다', () => {
    const onPageChange = vi.fn();
    render(
      <RelatedPosts
        posts={samplePosts}
        category="React"
        enablePagination={true}
        currentPage={1}
        totalPages={1}
        onPageChange={onPageChange}
      />,
    );

    // 페이지네이션이 렌더링되지 않는지 확인
    expect(screen.queryByRole('navigation', { name: '페이지네이션' })).not.toBeInTheDocument();
  });

  it('페이지당 포스트 수에 따라 올바른 포스트를 표시한다', () => {
    const largePosts: RelatedPostRowProps[] = [
      ...samplePosts,
      {
        id: 4,
        title: '네 번째 포스트',
        createdAt: '2024년 1월 1일',
        href: '/posts/fourth-post',
      },
      {
        id: 5,
        title: '다섯 번째 포스트',
        createdAt: '2023년 12월 30일',
        href: '/posts/fifth-post',
      },
    ];

    render(
      <RelatedPosts
        posts={largePosts}
        category="React"
        enablePagination={true}
        currentPage={1}
        totalPages={2}
        postsPerPage={3}
        onPageChange={vi.fn()}
      />,
    );

    // 첫 번째 페이지에는 처음 3개 포스트만 표시되어야 함
    expect(screen.getByText('React 18의 새로운 기능들')).toBeInTheDocument();
    expect(screen.getByText('TypeScript 5.0 마이그레이션 가이드')).toBeInTheDocument();
    expect(screen.getByText('Next.js App Router 완벽 가이드')).toBeInTheDocument();
    expect(screen.queryByText('네 번째 포스트')).not.toBeInTheDocument();
    expect(screen.queryByText('다섯 번째 포스트')).not.toBeInTheDocument();
  });
});
