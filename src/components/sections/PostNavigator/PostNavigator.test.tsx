import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { PostNavigator } from './PostNavigator';

const mockPrevPost = {
  title: 'React와 TypeScript로 현대적인 웹 개발하기',
  href: '/posts/react-typescript-development',
};

const mockNextPost = {
  title: 'Next.js 13 App Router 완벽 가이드',
  href: '/posts/nextjs-13-app-router',
};

describe('PostNavigator', () => {
  it('이전글과 다음글이 모두 있을 때 올바르게 렌더링된다', () => {
    render(<PostNavigator prevPost={mockPrevPost} nextPost={mockNextPost} />);

    // 이전글 확인
    expect(screen.getByText('이전글')).toBeInTheDocument();
    expect(screen.getByText(mockPrevPost.title)).toBeInTheDocument();

    // 다음글 확인
    expect(screen.getByText('다음글')).toBeInTheDocument();
    expect(screen.getByText(mockNextPost.title)).toBeInTheDocument();
  });

  it('이전글만 있을 때 올바르게 렌더링된다', () => {
    render(<PostNavigator prevPost={mockPrevPost} />);

    // 이전글 확인
    expect(screen.getByText('이전글')).toBeInTheDocument();
    expect(screen.getByText(mockPrevPost.title)).toBeInTheDocument();

    // 다음글은 빈 상태로 표시
    expect(screen.queryByText('다음글')).not.toBeInTheDocument();
  });

  it('다음글만 있을 때 올바르게 렌더링된다', () => {
    render(<PostNavigator nextPost={mockNextPost} />);

    // 다음글 확인
    expect(screen.getByText('다음글')).toBeInTheDocument();
    expect(screen.getByText(mockNextPost.title)).toBeInTheDocument();

    // 이전글은 빈 상태로 표시
    expect(screen.queryByText('이전글')).not.toBeInTheDocument();
  });

  it('이전글과 다음글이 모두 없을 때 빈 상태로 렌더링된다', () => {
    render(<PostNavigator />);

    expect(screen.queryByText('이전글')).not.toBeInTheDocument();
    expect(screen.queryByText('다음글')).not.toBeInTheDocument();
  });

  it('이전글 링크가 올바른 href를 가진다', () => {
    render(<PostNavigator prevPost={mockPrevPost} />);

    const prevLink = screen.getByRole('link', { name: /이전글/i });
    expect(prevLink).toHaveAttribute('href', mockPrevPost.href);
  });

  it('다음글 링크가 올바른 href를 가진다', () => {
    render(<PostNavigator nextPost={mockNextPost} />);

    const nextLink = screen.getByRole('link', { name: /다음글/i });
    expect(nextLink).toHaveAttribute('href', mockNextPost.href);
  });

  it('추가 클래스명을 적용한다', () => {
    const { container } = render(
      <PostNavigator prevPost={mockPrevPost} nextPost={mockNextPost} className="custom-class" />,
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
  });

  it('링크들이 올바른 높이를 가진다', () => {
    render(<PostNavigator prevPost={mockPrevPost} nextPost={mockNextPost} />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      const linkContainer = link.querySelector('div');
      expect(linkContainer).toHaveClass('h-24');
    });
  });

  it('이전글 링크에 왼쪽 화살표 아이콘이 표시된다', () => {
    render(<PostNavigator prevPost={mockPrevPost} />);

    const prevLink = screen.getByRole('link', { name: /이전글/i });
    const leftIcon = prevLink.querySelector('svg');

    expect(leftIcon).toBeInTheDocument();
  });

  it('다음글 링크에 오른쪽 화살표 아이콘이 표시된다', () => {
    render(<PostNavigator nextPost={mockNextPost} />);

    const nextLink = screen.getByRole('link', { name: /다음글/i });
    const rightIcon = nextLink.querySelector('svg');

    expect(rightIcon).toBeInTheDocument();
  });

  it('긴 제목이 올바르게 ellipsis 처리된다', () => {
    const longTitlePost = {
      title: '매우 긴 제목이 있는 포스트입니다. 이 제목은 너무 길어서 컨테이너를 넘칠 수 있습니다.',
      href: '/posts/very-long-title-post',
    };

    render(<PostNavigator prevPost={longTitlePost} />);

    const titleElement = screen.getByText(longTitlePost.title);
    expect(titleElement).toHaveClass('truncate');
  });

  it('반응형 레이아웃이 적용된다', () => {
    const { container } = render(<PostNavigator prevPost={mockPrevPost} nextPost={mockNextPost} />);

    // 반응형 플렉스 컨테이너 확인
    const flexContainer = container.querySelector(
      '.flex.flex-col.gap-4.md\\:flex-row.md\\:justify-between',
    );
    expect(flexContainer).toBeInTheDocument();
  });

  it('이전글만 있을 때 좌측에 표시된다', () => {
    render(<PostNavigator prevPost={mockPrevPost} />);

    const prevLink = screen.getByRole('link');
    expect(prevLink).toBeInTheDocument();
    expect(screen.queryByText('다음글')).not.toBeInTheDocument();
  });

  it('다음글만 있을 때 우측에 표시된다', () => {
    render(<PostNavigator nextPost={mockNextPost} />);

    const nextLink = screen.getByRole('link');
    expect(nextLink).toBeInTheDocument();
    expect(screen.queryByText('이전글')).not.toBeInTheDocument();
  });

  it('링크에 배경색과 테두리가 올바르게 적용된다', () => {
    render(<PostNavigator prevPost={mockPrevPost} nextPost={mockNextPost} />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      const linkContainer = link.querySelector('div');
      expect(linkContainer).toHaveClass('border-[color:var(--color-primary)]');
    });
  });

  it('링크에 호버 시 그림자 효과가 적용된다', () => {
    render(<PostNavigator prevPost={mockPrevPost} nextPost={mockNextPost} />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      const linkContainer = link.querySelector('div');
      expect(linkContainer).toHaveClass('hover:shadow-xl');
      expect(linkContainer).toHaveClass('hover:shadow-[color:var(--color-text)]/10');
    });
  });

  it('PostNavigationLink 컴포넌트가 올바른 props로 렌더링된다', () => {
    render(<PostNavigator prevPost={mockPrevPost} nextPost={mockNextPost} />);

    // 이전글과 다음글 링크가 모두 렌더링되는지 확인
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });
});
