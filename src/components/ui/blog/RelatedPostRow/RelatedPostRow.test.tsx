import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { RelatedPostRow } from './RelatedPostRow';

const defaultProps = {
  id: 'test-post',
  title: '테스트 제목',
  createdAt: '2024.12.26',
  href: '/blog/test-post',
  isCurrent: false,
};

describe('RelatedPostRow', () => {
  it('기본 정보를 올바르게 렌더링해야 한다', () => {
    render(<RelatedPostRow {...defaultProps} />);

    expect(screen.getByText('테스트 제목')).toBeInTheDocument();
    expect(screen.getByText('2024.12.26')).toBeInTheDocument();
  });

  it('현재 포스트일 때 "현재" 라벨이 표시되어야 한다', () => {
    render(<RelatedPostRow {...defaultProps} isCurrent={true} />);

    expect(screen.getByText('현재')).toBeInTheDocument();
  });

  it('현재 포스트가 아닐 때 "현재" 라벨이 표시되지 않아야 한다', () => {
    render(<RelatedPostRow {...defaultProps} isCurrent={false} />);

    expect(screen.queryByText('현재')).not.toBeInTheDocument();
  });

  it('일반 포스트일 때 링크로 렌더링되어야 한다', () => {
    render(<RelatedPostRow {...defaultProps} isCurrent={false} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('현재 포스트일 때 링크가 아닌 div로 렌더링되어야 한다', () => {
    render(<RelatedPostRow {...defaultProps} isCurrent={true} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('추가 클래스명이 적용되어야 한다', () => {
    const { container } = render(<RelatedPostRow {...defaultProps} className="custom-class" />);

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('custom-class');
  });

  it('긴 제목이 올바르게 ellipsis 처리되어야 한다', () => {
    const longTitle =
      'React와 TypeScript를 활용한 대규모 웹 애플리케이션 아키텍처 설계 및 성능 최적화 전략에 대한 심층적인 분석';

    render(<RelatedPostRow {...defaultProps} title={longTitle} />);

    const titleElement = screen.getByRole('heading', { level: 5 });
    expect(titleElement).toHaveClass('truncate');
    expect(titleElement).toHaveClass('text-ellipsis');
    expect(titleElement).toHaveClass('overflow-hidden');
  });

  it('날짜 텍스트가 올바르게 ellipsis 처리되어야 한다', () => {
    render(<RelatedPostRow {...defaultProps} />);

    const dateElement = screen.getByText('2024.12.26');
    expect(dateElement).toHaveClass('truncate');
    expect(dateElement).toHaveClass('text-ellipsis');
    expect(dateElement).toHaveClass('overflow-hidden');
  });

  it('현재 포스트가 아닐 때 chevron에 hover 애니메이션이 적용되어야 한다', () => {
    const { container } = render(<RelatedPostRow {...defaultProps} isCurrent={false} />);

    const chevronIcon = container.querySelector('svg');
    expect(chevronIcon).toHaveClass('group-hover:translate-x-1');
  });

  it('현재 포스트일 때 chevron에 hover 애니메이션이 적용되지 않아야 한다', () => {
    const { container } = render(<RelatedPostRow {...defaultProps} isCurrent={true} />);

    const chevronIcon = container.querySelector('svg');
    expect(chevronIcon).not.toHaveClass('group-hover:translate-x-1');
  });
});
