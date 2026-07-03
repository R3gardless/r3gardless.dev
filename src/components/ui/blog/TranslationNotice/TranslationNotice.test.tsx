import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { TranslationNotice } from './TranslationNotice';

// Next.js Link 컴포넌트 모킹
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('TranslationNotice', () => {
  it('영어 번역 고지와 원문 링크를 렌더링한다', () => {
    render(<TranslationNotice lang="en" originalHref="/blog/2026-06-21-published-note" />);

    expect(
      screen.getByText(
        'This post was translated from the Korean original using an LLM. Some nuances may differ.',
      ),
    ).toBeInTheDocument();

    const link = screen.getByText('Read the original');
    expect(link.closest('a')).toHaveAttribute('href', '/blog/2026-06-21-published-note');
  });

  it('일본어 번역 고지와 원문 링크를 렌더링한다', () => {
    render(<TranslationNotice lang="jp" originalHref="/blog/2026-06-21-published-note" />);

    expect(
      screen.getByText(
        'この記事は韓国語の原文をLLMで翻訳したものです。ニュアンスが原文と異なる場合があります。',
      ),
    ).toBeInTheDocument();

    const link = screen.getByText('原文を読む');
    expect(link.closest('a')).toHaveAttribute('href', '/blog/2026-06-21-published-note');
  });

  it('translation-notice 클래스와 lang 데이터 속성을 가진다', () => {
    const { container } = render(<TranslationNotice lang="en" originalHref="/blog/some-post" />);
    const notice = container.querySelector('aside');

    expect(notice).toHaveClass('translation-notice');
    expect(notice).toHaveAttribute('data-lang', 'en');
  });
});
