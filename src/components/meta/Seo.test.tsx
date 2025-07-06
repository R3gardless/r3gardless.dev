import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';

import { Seo } from './Seo';

// Next.js Head 컴포넌트 모킹
const mockHeadChildren: React.ReactNode[] = [];

vi.mock('next/head', () => ({
  default: ({ children }: { children: React.ReactNode }) => {
    // children을 배열에 저장하고 실제 DOM에 추가
    mockHeadChildren.length = 0; // 기존 children 초기화
    React.Children.forEach(children, child => {
      mockHeadChildren.push(child);
      if (React.isValidElement(child)) {
        // title 태그 특별 처리
        if (child.type === 'title') {
          const props = child.props as { children?: string };
          document.title = props.children ?? '';
        } else {
          const element = document.createElement(child.type as string);

          // props를 element attributes로 복사
          Object.entries(child.props as Record<string, unknown>).forEach(([key, value]) => {
            if (key === 'children' && typeof value === 'string') {
              element.textContent = value;
            } else if (key !== 'children' && value !== undefined) {
              element.setAttribute(key === 'charSet' ? 'charset' : key, String(value));
            }
          });

          document.head.appendChild(element);
        }
      }
    });

    return null;
  },
}));

describe('Seo', () => {
  beforeEach(() => {
    // 각 테스트 전에 head 내용 초기화
    document.head.innerHTML = '';
    document.title = '';
  });

  afterEach(() => {
    // 각 테스트 후에 head 내용 초기화
    document.head.innerHTML = '';
    document.title = '';
  });
  const defaultProps = {
    title: 'Test Blog Post',
    description: 'This is a test blog post description',
  };

  it('기본 메타 태그가 올바르게 렌더링된다', () => {
    render(<Seo {...defaultProps} />);

    // title 태그 확인
    expect(document.title).toBe('Test Blog Post');

    // description 메타 태그 확인
    const descriptionMeta = document.querySelector('meta[name="description"]');
    expect(descriptionMeta).toHaveAttribute('content', 'This is a test blog post description');
  });

  it('키워드 배열이 올바르게 문자열로 변환된다', () => {
    const keywords = ['React', 'TypeScript', 'Next.js', 'SEO'];
    render(<Seo {...defaultProps} keywords={keywords} />);

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    expect(keywordsMeta).toHaveAttribute('content', 'React, TypeScript, Next.js, SEO');
  });

  it('키워드가 빈 배열일 때 키워드 메타 태그가 렌더링되지 않는다', () => {
    render(<Seo {...defaultProps} keywords={[]} />);

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    expect(keywordsMeta).toBeNull();
  });

  it('키워드가 없을 때 키워드 메타 태그가 렌더링되지 않는다', () => {
    render(<Seo {...defaultProps} />);

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    expect(keywordsMeta).toBeNull();
  });

  it('Open Graph 메타 태그가 올바르게 렌더링된다', () => {
    const props = {
      ...defaultProps,
      ogImage: 'https://example.com/image.jpg',
      canonical: 'https://example.com/post',
    };

    render(<Seo {...props} />);

    // Open Graph 메타 태그들 확인
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Test Blog Post',
    );
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute(
      'content',
      'This is a test blog post description',
    );
    expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'article',
    );
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://example.com/image.jpg',
    );
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://example.com/post',
    );
  });

  it('Twitter Card 메타 태그가 올바르게 렌더링된다', () => {
    const props = {
      ...defaultProps,
      ogImage: 'https://example.com/image.jpg',
    };

    render(<Seo {...props} />);

    // Twitter Card 메타 태그들 확인
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      'Test Blog Post',
    );
    expect(document.querySelector('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      'This is a test blog post description',
    );
    expect(document.querySelector('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      'https://example.com/image.jpg',
    );
  });

  it('블로그 포스트 전용 메타데이터가 올바르게 렌더링된다', () => {
    const props = {
      ...defaultProps,
      publishedTime: '2025-07-06T10:00:00Z',
      modifiedTime: '2025-07-06T15:00:00Z',
    };

    render(<Seo {...props} />);

    // Article 메타 태그들 확인
    expect(document.querySelector('meta[property="article:published_time"]')).toHaveAttribute(
      'content',
      '2025-07-06T10:00:00Z',
    );
    expect(document.querySelector('meta[property="article:modified_time"]')).toHaveAttribute(
      'content',
      '2025-07-06T15:00:00Z',
    );
  });

  it('발행 시간만 있을 때 수정 시간 메타 태그가 렌더링되지 않는다', () => {
    const props = {
      ...defaultProps,
      publishedTime: '2025-07-06T10:00:00Z',
    };

    render(<Seo {...props} />);

    expect(document.querySelector('meta[property="article:published_time"]')).toHaveAttribute(
      'content',
      '2025-07-06T10:00:00Z',
    );
    expect(document.querySelector('meta[property="article:modified_time"]')).toBeNull();
  });

  it('canonical URL이 올바르게 렌더링된다', () => {
    const props = {
      ...defaultProps,
      canonical: 'https://example.com/canonical-url',
    };

    render(<Seo {...props} />);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute('href', 'https://example.com/canonical-url');
  });

  it('canonical URL이 없을 때 canonical 링크가 렌더링되지 않는다', () => {
    render(<Seo {...defaultProps} />);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toBeNull();
  });

  it('기본 SEO 설정이 올바르게 렌더링된다', () => {
    render(<Seo {...defaultProps} />);

    // 기본 SEO 메타 태그들 확인
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'index, follow',
    );
    expect(document.querySelector('meta[name="viewport"]')).toHaveAttribute(
      'content',
      'width=device-width, initial-scale=1',
    );
    expect(document.querySelector('meta[charset="utf-8"]')).toBeInTheDocument();
  });

  it('ogImage가 없을 때 이미지 관련 메타 태그가 렌더링되지 않는다', () => {
    render(<Seo {...defaultProps} />);

    expect(document.querySelector('meta[property="og:image"]')).toBeNull();
    expect(document.querySelector('meta[name="twitter:image"]')).toBeNull();
  });

  it('모든 옵션이 포함된 완전한 SEO 데이터가 올바르게 렌더링된다', () => {
    const fullProps = {
      title: 'Complete SEO Test',
      description: 'Complete SEO test description',
      ogImage: 'https://example.com/complete-image.jpg',
      canonical: 'https://example.com/complete-url',
      keywords: ['Complete', 'SEO', 'Test'],
      publishedTime: '2025-07-06T10:00:00Z',
      modifiedTime: '2025-07-06T15:00:00Z',
    };

    render(<Seo {...fullProps} />);

    // 모든 메타 태그가 올바르게 설정되었는지 확인
    expect(document.title).toBe('Complete SEO Test');
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Complete SEO test description',
    );
    expect(document.querySelector('meta[name="keywords"]')).toHaveAttribute(
      'content',
      'Complete, SEO, Test',
    );
    expect(document.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://example.com/complete-image.jpg',
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://example.com/complete-url',
    );
    expect(document.querySelector('meta[property="article:published_time"]')).toHaveAttribute(
      'content',
      '2025-07-06T10:00:00Z',
    );
    expect(document.querySelector('meta[property="article:modified_time"]')).toHaveAttribute(
      'content',
      '2025-07-06T15:00:00Z',
    );
  });
});
