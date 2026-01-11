import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import AboutHeader from './AboutHeader';

describe('AboutHeader', () => {
  it('renders the main heading', () => {
    render(<AboutHeader />);
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<AboutHeader />);
    expect(
      screen.getByText('Developer who believes in clean code and continuous growth'),
    ).toBeInTheDocument();
  });

  it('applies correct CSS classes for layout', () => {
    const { container } = render(<AboutHeader />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('w-full', 'py-12');
  });

  it('uses MaruBuri font family', () => {
    const { container } = render(<AboutHeader />);
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('font-maruBuri');
  });
});
