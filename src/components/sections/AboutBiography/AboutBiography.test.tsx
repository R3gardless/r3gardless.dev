import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi, describe, it, expect } from 'vitest';

// Mock HandwrittenName 컴포넌트
vi.mock('../../ui/about/HandwrittenName', () => ({
  HandwrittenName: ({ className }: { className?: string }) => (
    <span className={className}>YoungUk Song</span>
  ),
}));

import { AboutBiography } from './AboutBiography';

describe('AboutBiography', () => {
  it('renders biography information correctly', () => {
    render(<AboutBiography />);

    expect(screen.getByText('YoungUk Song')).toBeInTheDocument();
    expect(screen.getByText('Database Engineer')).toBeInTheDocument();
  });

  it('renders profile image with correct attributes', () => {
    render(<AboutBiography />);

    const image = screen.getByAltText('YoungUk Song Profile');
    expect(image).toBeInTheDocument();
  });

  it('renders all social links', () => {
    render(<AboutBiography />);

    const githubLink = screen.getByLabelText('GitHub');
    const linkedinLink = screen.getByLabelText('LinkedIn');
    const emailLink = screen.getByLabelText('Email');

    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/r3gardless');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/younguk-song-3b82801a0/',
    );

    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:pidaoh@g.skku.edu');
  });
});
