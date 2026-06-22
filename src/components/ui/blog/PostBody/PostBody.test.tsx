import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PostBody } from './PostBody';

describe('PostBody', () => {
  it('renders markdown content', async () => {
    const element = await PostBody({
      markdown: '# Heading\n\nBody with **bold** text.',
    });

    render(element);

    expect(screen.getByRole('heading', { name: 'Heading' })).toBeInTheDocument();
    expect(screen.getByText(/Body with/)).toBeInTheDocument();
    expect(screen.getByText('bold')).toBeInTheDocument();
  });

  it('applies custom className with the post-body class', async () => {
    const element = await PostBody({
      markdown: 'Content',
      className: 'custom-test-class',
    });

    const { container } = render(element);

    expect(container.firstChild).toHaveClass('post-body');
    expect(container.firstChild).toHaveClass('custom-test-class');
  });

  it('renders an empty-state message when markdown is blank', async () => {
    const element = await PostBody({
      markdown: '   ',
      className: 'empty-test-class',
    });

    const { container } = render(element);

    expect(screen.getByText('콘텐츠를 불러올 수 없습니다.')).toBeInTheDocument();
    expect(screen.getByText('콘텐츠를 불러올 수 없습니다.')).toHaveClass(
      'text-[color:var(--color-text-secondary)]',
    );
    expect(container.firstChild).toHaveClass('empty-test-class');
  });
});
