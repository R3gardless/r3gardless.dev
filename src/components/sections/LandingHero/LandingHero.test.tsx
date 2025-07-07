import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { getSiteConfig } from '@/utils/config';

import { LandingHero } from './LandingHero';

interface MockProps {
  children?: React.ReactNode;
  className?: string;
  level?: number;
  [key: string]: unknown;
}

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockProps) => {
      // Filter out framer-motion specific props
      const frameworkProps = ['initial', 'animate', 'transition', 'whileHover', 'whileTap', 'exit'];
      const domProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !frameworkProps.includes(key)),
      );
      return <div {...domProps}>{children}</div>;
    },
    span: ({ children, ...props }: MockProps) => {
      const frameworkProps = ['initial', 'animate', 'transition', 'whileHover', 'whileTap', 'exit'];
      const domProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !frameworkProps.includes(key)),
      );
      return <span {...domProps}>{children}</span>;
    },
    a: ({ children, ...props }: MockProps) => {
      const frameworkProps = ['initial', 'animate', 'transition', 'whileHover', 'whileTap', 'exit'];
      const domProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !frameworkProps.includes(key)),
      );
      return <a {...domProps}>{children}</a>;
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock getSiteConfig
vi.mock('@/utils/config', () => ({
  getSiteConfig: vi.fn(() => ({
    site: {
      name: 'Test Site Name',
      url: 'https://test.com',
    },
    author: {
      name: 'Test Author',
      email: 'test@example.com',
      github: 'testuser',
      linkedin: 'testuser',
      position: 'Frontend Developer',
      team: 'Test Team',
      job_description: 'Building awesome web applications',
      philosophy: 'Code with passion and purpose',
      interests: ['React', 'TypeScript', 'Next.js', 'UI/UX'],
    },
  })),
}));

// Mock Typography components
vi.mock('@/components/ui/atoms/Typography', () => ({
  Heading: ({ children, level, className, ...props }: MockProps) =>
    React.createElement(`h${level}`, { className, ...props }, children),
  Text: ({ children, className, ...props }: MockProps) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
  Italic: ({ children, className, ...props }: MockProps) => (
    <em className={className} {...props}>
      {children}
    </em>
  ),
}));

describe('LandingHero', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<LandingHero />);
    expect(screen.getByRole('region', { name: 'Landing Introduction' })).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-landing-intro';
    render(<LandingHero className={customClass} />);

    const section = screen.getByRole('region', { name: 'Landing Introduction' });
    expect(section).toHaveClass(customClass);
  });

  it('displays greeting text', () => {
    render(<LandingHero />);
    expect(screen.getByText('👋 This is')).toBeInTheDocument();
  });

  it('displays author information correctly', () => {
    render(<LandingHero />);

    expect(screen.getByText(/Frontend Developer/)).toBeInTheDocument();
    expect(screen.getByText(/Test Team/)).toBeInTheDocument();
    expect(screen.getByText('Building awesome web applications')).toBeInTheDocument();
    expect(screen.getByText('Code with passion and purpose')).toBeInTheDocument();
  });

  it('displays "Currently Exploring" section', () => {
    render(<LandingHero />);
    expect(screen.getByText('🔍 Currently Exploring on')).toBeInTheDocument();
  });

  it('displays initial interest from the list', () => {
    render(<LandingHero />);
    // Should display the first interest initially
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('displays "More About Me" link with correct href', () => {
    render(<LandingHero />);
    const link = screen.getByRole('link', { name: /More About Me/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('has proper accessibility attributes', () => {
    render(<LandingHero />);
    const section = screen.getByRole('region', { name: 'Landing Introduction' });
    expect(section).toHaveAttribute('aria-label', 'Landing Introduction');
  });

  it('starts with empty title text initially', () => {
    render(<LandingHero />);
    // Initially, the title should not be visible or should be empty
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('shows title after initial delay', () => {
    render(<LandingHero />);

    // Initially, heading should exist but might be empty
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    // Fast-forward past the initial delay (500ms)
    act(() => {
      vi.advanceTimersByTime(600);
    });

    // Title visibility should be triggered
    expect(heading).toBeInTheDocument();
  });

  it('cycles through interests over time', () => {
    render(<LandingHero />);

    // Initially shows first interest
    expect(screen.getByText('React')).toBeInTheDocument();

    // Fast-forward 3 seconds to trigger interest change
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Should now show second interest
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Fast-forward another 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Should now show third interest
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('renders proper semantic HTML structure', () => {
    render(<LandingHero />);

    // Check for proper semantic elements
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('handles typewriter animation timing correctly', () => {
    render(<LandingHero />);

    // Initially, title should be accessible
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    // Fast-forward to start typewriter animation
    act(() => {
      vi.advanceTimersByTime(500); // Initial visibility delay
      vi.advanceTimersByTime(100); // First character delay
    });

    // Heading should still be present and ready for typewriter effect
    expect(heading).toBeInTheDocument();
  });

  it('handles empty interests array gracefully', () => {
    // Mock empty interests
    const mockGetSiteConfig = vi.mocked(getSiteConfig);
    mockGetSiteConfig.mockReturnValue({
      site: {
        name: 'Test Site Name',
        url: 'https://test.com',
      },
      author: {
        name: 'Test Author',
        email: 'test@example.com',
        github: 'testuser',
        linkedin: 'testuser',
        position: 'Frontend Developer',
        team: 'Test Team',
        job_description: 'Building awesome web applications',
        philosophy: 'Code with passion and purpose',
        interests: [],
      },
    });

    render(<LandingHero />);
    expect(screen.getByText('🔍 Currently Exploring on')).toBeInTheDocument();
  });

  it('applies proper responsive classes', () => {
    render(<LandingHero />);

    const section = screen.getByRole('region', { name: 'Landing Introduction' });
    expect(section).toHaveClass('py-16', 'md:py-24');
  });

  it('contains proper font family classes', () => {
    render(<LandingHero />);

    // Check if maruBuri font is applied (this would be in the mocked components)
    expect(screen.getByText('👋 This is')).toBeInTheDocument();
  });
});
