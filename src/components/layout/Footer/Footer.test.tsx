import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { Footer } from './Footer';

describe('Footer', () => {
  beforeEach(() => {
    // 일관된 테스트를 위해 현재 날짜를 고정
    const mockDate = new Date('2025-07-20T12:00:00.000Z');
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    // 테스트 후 시간 복원
    vi.useRealTimers();
  });

  it('사이트 이름이 렌더링된다', () => {
    render(<Footer />);
    expect(screen.getByText('R3gardless.dev')).toBeInTheDocument();
  });

  it('빌드 시점 업데이트 날짜가 렌더링된다', () => {
    render(<Footer />);
    expect(screen.getByText('Last Update is Jul 20, 2025')).toBeInTheDocument();
  });

  it('저작권 정보가 렌더링된다', () => {
    render(<Footer />);

    // span 내부의 텍스트들을 확인
    expect(screen.getByText('R3gardless')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('Contact 제목이 렌더링된다', () => {
    render(<Footer />);
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('소셜 링크들이 렌더링된다', () => {
    render(<Footer />);

    const linkedinLink = screen.getByLabelText('LinkedIn 프로필');
    const githubLink = screen.getByLabelText('GitHub 프로필');
    const emailLink = screen.getByLabelText('이메일 보내기');

    expect(linkedinLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
    expect(emailLink).toBeInTheDocument();
  });

  it('소셜 링크들이 올바른 href를 가진다', () => {
    render(<Footer />);

    const linkedinLink = screen.getByLabelText('LinkedIn 프로필');
    const githubLink = screen.getByLabelText('GitHub 프로필');
    const emailLink = screen.getByLabelText('이메일 보내기');

    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/r3gardless');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/r3gardless');
    expect(emailLink).toHaveAttribute('href', 'mailto:pidaoh@g.skku.edu');
  });

  it('외부 링크들이 올바른 속성을 가진다', () => {
    render(<Footer />);

    const linkedinLink = screen.getByLabelText('LinkedIn 프로필');
    const githubLink = screen.getByLabelText('GitHub 프로필');

    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('커스텀 클래스가 적용된다', () => {
    render(<Footer className="custom-class" />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('custom-class');
  });
});
