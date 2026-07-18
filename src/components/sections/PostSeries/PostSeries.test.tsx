import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

import { PostSeries } from './PostSeries';
import type { PostSeriesPost } from './PostSeries';

const samplePosts: PostSeriesPost[] = [
  { id: 1, title: '시리즈 1편', href: '/blog/series-1' },
  { id: 2, title: '시리즈 2편', href: '/blog/series-2' },
  { id: 3, title: '시리즈 3편', href: '/blog/series-3' },
];

describe('PostSeries', () => {
  it('시리즈 이름과 라벨을 표시한다', () => {
    render(<PostSeries name="테스트 시리즈" posts={samplePosts} currentPostId={2} />);

    expect(screen.getByText('시리즈')).toBeInTheDocument();
    expect(screen.getByText('테스트 시리즈')).toBeInTheDocument();
  });

  it('현재 위치를 n / m 형태로 표시한다', () => {
    render(<PostSeries name="테스트 시리즈" posts={samplePosts} currentPostId={2} />);

    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('기본 상태에서는 목록이 접혀 있다', () => {
    render(<PostSeries name="테스트 시리즈" posts={samplePosts} currentPostId={2} />);

    expect(screen.queryByText('시리즈 1편')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('헤더 클릭 시 목록이 펼쳐진다', () => {
    render(<PostSeries name="테스트 시리즈" posts={samplePosts} currentPostId={2} />);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('시리즈 1편')).toBeInTheDocument();
    expect(screen.getByText('시리즈 3편')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('defaultExpanded로 펼친 상태로 시작할 수 있다', () => {
    render(
      <PostSeries name="테스트 시리즈" posts={samplePosts} currentPostId={2} defaultExpanded />,
    );

    expect(screen.getByText('시리즈 1편')).toBeInTheDocument();
  });

  it('현재 포스트는 링크가 아닌 강조 표시로 렌더링한다', () => {
    render(
      <PostSeries name="테스트 시리즈" posts={samplePosts} currentPostId={2} defaultExpanded />,
    );

    expect(screen.getByText('현재')).toBeInTheDocument();
    // 현재 글(2편)은 링크가 없어야 한다
    expect(screen.getByText('시리즈 2편').closest('a')).toBeNull();
    // 다른 글은 링크로 이동할 수 있어야 한다
    expect(screen.getByText('시리즈 1편').closest('a')).toHaveAttribute('href', '/blog/series-1');
  });

  it('언어에 맞는 라벨을 표시한다', () => {
    render(
      <PostSeries
        name="Test Series"
        posts={samplePosts}
        currentPostId={2}
        lang="en"
        defaultExpanded
      />,
    );

    expect(screen.getByText('Series')).toBeInTheDocument();
    expect(screen.getByText('Now')).toBeInTheDocument();
  });
});
