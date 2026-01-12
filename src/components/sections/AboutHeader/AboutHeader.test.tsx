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
    expect(section).toHaveClass('w-full', 'transition-colors', 'duration-300');
  });

  it('uses MaruBuri font family', () => {
    const { container } = render(<AboutHeader />);
    // Text 컴포넌트는 p 태그를 사용
    const heading = container.querySelector('p');
    expect(heading).toHaveClass('font-maruBuri');
  });
});
