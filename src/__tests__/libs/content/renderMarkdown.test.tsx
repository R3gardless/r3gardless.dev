import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { extractTableOfContentsFromMarkdown, renderMarkdownToReact } from '@/libs/content';

const linkMaps = {
  published: {
    'second-note': '/blog/second-note',
  },
  sources: {
    'youtube-source': 'https://www.youtube.com/watch?v=fixture',
  },
};

describe('markdown renderer', () => {
  it('renders alerts, GFM tables, task lists, math, code, images, mermaid, and wikilinks', async () => {
    const content = await renderMarkdownToReact(
      `# Render Fixture

See [[second-note|the second note]], [[youtube-source|the source]], and [[private-source]].

> [!TIP]
> Alert body.

| Feature | Status |
| --- | --- |
| Table | OK |

- [x] Done
- [ ] Todo

Inline math $a^2 + b^2 = c^2$.

$$
E = mc^2
$$

\`\`\`typescript
export const answer = 42;
\`\`\`

\`\`\`mermaid
flowchart TD
  A --> B
\`\`\`

![Fixture image](/content/posts/published-note/assets/diagram.svg)
`,
      linkMaps,
    );

    const { container } = render(<>{content}</>);

    expect(screen.getByRole('heading', { name: 'Render Fixture' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'the second note' })).toHaveAttribute(
      'href',
      '/blog/second-note',
    );
    expect(screen.getByRole('link', { name: 'the source' })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=fixture',
    );
    expect(screen.getByText(/private-source/)).toBeInTheDocument();
    expect(container.querySelector('.markdown-alert-tip')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(container.querySelector('input[type="checkbox"][checked]')).toBeInTheDocument();
    expect(container.querySelector('.katex')).toBeInTheDocument();
    expect(container.querySelector('figure .mermaid')).toHaveTextContent('flowchart TD');
    expect(screen.getByAltText('Fixture image')).toBeInTheDocument();

    const code = container.querySelector('pre code');
    expect(code).toHaveTextContent('answer');
  });

  it('extracts a nested table of contents with rehype-slug compatible ids', () => {
    const toc = extractTableOfContentsFromMarkdown(`# Title

## Section One

### Detail

## Section Two
`);

    expect(toc).toEqual([
      {
        id: 'title',
        title: 'Title',
        level: 1,
        children: [
          {
            id: 'section-one',
            title: 'Section One',
            level: 2,
            children: [
              {
                id: 'detail',
                title: 'Detail',
                level: 3,
              },
            ],
          },
          {
            id: 'section-two',
            title: 'Section Two',
            level: 2,
          },
        ],
      },
    ]);
  });

  it('renders local images through the markdown image component', async () => {
    const content = await renderMarkdownToReact(
      '![Fixture image](/content/posts/published-note/assets/diagram.svg)',
      linkMaps,
    );

    render(<>{content}</>);

    const imageWrapper = screen.getByText('Fixture image').closest('.markdown-image');
    expect(imageWrapper).toBeInTheDocument();
    expect(within(imageWrapper as HTMLElement).getByAltText('Fixture image')).toBeInTheDocument();
  });

  it('keeps consecutive h2 and h3 headings as separate blockable elements', async () => {
    const content = await renderMarkdownToReact(`## 3. PQ 논문 정리

### 3.1. 논문 개요
`);

    const { container } = render(<>{content}</>);
    const h2 = screen.getByRole('heading', { level: 2, name: '3. PQ 논문 정리' });
    const h3 = screen.getByRole('heading', { level: 3, name: '3.1. 논문 개요' });

    expect(h2).toBeInTheDocument();
    expect(h3).toBeInTheDocument();
    expect(h2.nextElementSibling).toBe(h3);
    expect(container.querySelector('h2 + h3')).toBe(h3);
  });
});
