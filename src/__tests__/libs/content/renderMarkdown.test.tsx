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
  sourceLabels: {
    'youtube-source': 'YouTube Source',
  },
};

describe('markdown renderer', () => {
  it('renders alerts, GFM tables, task lists, math, code, images, mermaid, and wikilinks', async () => {
    const content = await renderMarkdownToReact(
      `# Render Fixture

See [[second-note|the second note]], [[youtube-source|the source]], [[youtube-source]], and [[private-source]].

> [!TIP]
> Alert body.

| Feature | Status |
| --- | --- |
| Table | OK |

- [x] Done
- [ ] Todo

Inline math $a^2 + b^2 = c^2$.

Unicode prime math $k’$.

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
    expect(screen.getByText('YouTube Source').closest('a')).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=fixture',
    );
    expect(screen.getByText(/private-source/)).toBeInTheDocument();
    expect(container.querySelector('.markdown-alert-tip')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(container.querySelector('input[type="checkbox"][checked]')).toBeInTheDocument();
    expect(container.querySelector('.katex')).toBeInTheDocument();
    expect(container.querySelector('annotation[encoding="application/x-tex"]')).toHaveTextContent(
      'a^2 + b^2 = c^2',
    );
    expect(
      [...container.querySelectorAll('annotation[encoding="application/x-tex"]')].map(
        node => node.textContent,
      ),
    ).toContain("k'");
    expect(container.querySelector('figure .mermaid')).toHaveTextContent('flowchart TD');
    expect(screen.getByAltText('Fixture image')).toBeInTheDocument();

    const code = container.querySelector('pre code');
    expect(code).toHaveTextContent('answer');
    expect(code).toHaveAttribute('data-theme', 'github-light github-dark');
    expect(container.querySelector('[style*="--shiki-light"]')).toBeInTheDocument();
  });

  it('extracts a nested table of contents with rehype-slug compatible h1~h2 ids only', () => {
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
    const image = within(imageWrapper as HTMLElement).getByAltText('Fixture image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('width', '720');
    expect(image).toHaveAttribute('height', '405');
  });

  it('applies supported markdown image size hints without leaking syntax into captions', async () => {
    const content = await renderMarkdownToReact(
      `![Alt sized|320x180](/content/posts/published-note/assets/diagram.svg)

![Title sized](/content/posts/published-note/assets/diagram.svg "240x135")

![Attribute sized](/content/posts/published-note/assets/diagram.svg){width=160 height=90}

![Extra sized](/content/posts/published-note/assets/diagram.svg =480x270)

![Oversized](/content/posts/published-note/assets/diagram.svg "1200x675")
`,
      linkMaps,
    );

    const { container } = render(<>{content}</>);
    const altSized = screen.getByAltText('Alt sized');
    const titleSized = screen.getByAltText('Title sized');
    const attributeSized = screen.getByAltText('Attribute sized');
    const extraSized = screen.getByAltText('Extra sized');
    const oversized = screen.getByAltText('Oversized');

    expect(altSized).toHaveAttribute('width', '320');
    expect(altSized).toHaveAttribute('height', '180');
    expect(altSized).toHaveStyle({ width: '20rem', height: '11.25rem' });
    expect(titleSized).toHaveAttribute('width', '240');
    expect(titleSized).toHaveAttribute('height', '135');
    expect(titleSized).toHaveStyle({ width: '15rem', height: '8.4375rem' });
    expect(attributeSized).toHaveAttribute('width', '160');
    expect(attributeSized).toHaveAttribute('height', '90');
    expect(attributeSized).toHaveStyle({ width: '10rem', height: '5.625rem' });
    expect(extraSized).toHaveAttribute('width', '480');
    expect(extraSized).toHaveAttribute('height', '270');
    expect(extraSized).toHaveStyle({ width: '30rem', height: '16.875rem' });
    expect(oversized).toHaveAttribute('width', '720');
    expect(oversized).toHaveAttribute('height', '405');
    expect(oversized).toHaveStyle({ width: '45rem', height: '25.3125rem' });
    expect(container.querySelectorAll('.markdown-image[data-sized="true"]')).toHaveLength(5);
    expect(screen.queryByText(/320x180|width=160|480x270|1200x675/)).not.toBeInTheDocument();
  });

  it('renders only safe link schemes and strips raw HTML', async () => {
    const content =
      await renderMarkdownToReact(`Contact [email](mailto:hello@example.com), [phone](tel:+821012345678), [site](https://example.com), and [bad](javascript:alert(1)).

<div onclick="alert(1)">Raw HTML</div>
<script>alert('x')</script>
`);

    const { container } = render(<>{content}</>);

    expect(screen.getByRole('link', { name: 'email' })).toHaveAttribute(
      'href',
      'mailto:hello@example.com',
    );
    expect(screen.getByRole('link', { name: 'phone' })).toHaveAttribute(
      'href',
      'tel:+821012345678',
    );
    expect(screen.getByRole('link', { name: 'site' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
    expect(screen.queryByRole('link', { name: 'bad' })).not.toBeInTheDocument();
    expect(screen.getByText('bad')).toBeInTheDocument();
    expect(screen.queryByText('Raw HTML')).not.toBeInTheDocument();
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container.querySelector('[onclick]')).not.toBeInTheDocument();
  });

  it('renders links in reference sections as compact bookmark cards only there', async () => {
    const content = await renderMarkdownToReact(`# Reference Card Fixture

Normal link to [Product Quantization](https://doi.org/10.1109/TPAMI.2010.57).

# Sources

- [Product Quantization for Nearest Neighbor Search](https://doi.org/10.1109/TPAMI.2010.57)
- [Internal Note](/blog/second-note)
`);

    const { container } = render(<>{content}</>);
    const normalLink = screen.getByRole('link', { name: 'Product Quantization' });
    const referenceCards = container.querySelectorAll('.reference-card');

    expect(normalLink).not.toHaveClass('reference-card');
    expect(referenceCards).toHaveLength(2);
    expect(referenceCards[0]).toHaveAttribute('href', 'https://doi.org/10.1109/TPAMI.2010.57');
    expect(referenceCards[0]).toHaveAttribute('target', '_blank');
    expect(referenceCards[0]).toHaveTextContent('Product Quantization for Nearest Neighbor Search');
    expect(referenceCards[0]).toHaveTextContent('doi.org');
    expect(referenceCards[1]).toHaveAttribute('href', '/blog/second-note');
    expect(referenceCards[1]).toHaveTextContent('r3gardless.dev');
    expect(container.querySelector('.reference-card-list')).toBeInTheDocument();
    expect(container.querySelectorAll('.reference-card-list-item')).toHaveLength(2);
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
