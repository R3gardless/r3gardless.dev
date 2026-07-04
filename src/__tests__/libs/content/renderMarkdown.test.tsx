import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { extractTableOfContentsFromMarkdown, renderMarkdownToReact } from '@/libs/content';

const linkMaps = {
  published: {
    'second-note': '/blog/2026-06-20-second-note',
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
      '/blog/2026-06-20-second-note',
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

  it('prefers same-language routes when rendering translated markdown', async () => {
    const localizedMaps = {
      ...linkMaps,
      publishedByLang: {
        en: {
          'second-note': '/en/blog/2026-06-20-second-note',
        },
      },
    };

    const enContent = await renderMarkdownToReact(
      'See [[second-note|the second note]].',
      localizedMaps,
      'en',
    );
    render(<>{enContent}</>);
    expect(screen.getByRole('link', { name: 'the second note' })).toHaveAttribute(
      'href',
      '/en/blog/2026-06-20-second-note',
    );
  });

  it('falls back to kr routes when a translation is missing for the render language', async () => {
    const localizedMaps = {
      ...linkMaps,
      publishedByLang: {
        en: {
          'second-note': '/en/blog/2026-06-20-second-note',
        },
      },
    };

    const jaContent = await renderMarkdownToReact(
      'See [[second-note|the second note]].',
      localizedMaps,
      'ja',
    );
    render(<>{jaContent}</>);
    expect(screen.getByRole('link', { name: 'the second note' })).toHaveAttribute(
      'href',
      '/blog/2026-06-20-second-note',
    );
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

  it('opens markdown images in a lightbox when clicked', async () => {
    const content = await renderMarkdownToReact(
      '![Zoomable image](/content/posts/published-note/assets/diagram.svg)',
      linkMaps,
    );

    render(<>{content}</>);

    const trigger = screen.getByRole('button', { name: '이미지 확대: Zoomable image' });
    expect(trigger).toHaveClass('markdown-image-trigger');

    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: '이미지 확대: Zoomable image' });
    expect(dialog).toHaveClass('markdown-image-lightbox');
    const lightboxImage = within(dialog).getByAltText('Zoomable image');
    expect(lightboxImage).toBeInTheDocument();
    expect(lightboxImage).toHaveClass('markdown-image-lightbox-image');
    expect(lightboxImage).toHaveStyle({
      '--markdown-image-aspect-ratio': String(720 / 405),
    });

    fireEvent.click(within(dialog).getAllByRole('button', { name: '이미지 확대 닫기' })[1]);
    expect(
      screen.queryByRole('dialog', { name: '이미지 확대: Zoomable image' }),
    ).not.toBeInTheDocument();
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

  it('wraps code blocks with a language label and copy button', async () => {
    const content = await renderMarkdownToReact(
      `\`\`\`yaml
name: Contents Sync
on:
  push:
    branches:
      - main
\`\`\`
`,
    );

    const { container } = render(<>{content}</>);
    const codeBlock = container.querySelector('.code-block');

    expect(codeBlock).toBeInTheDocument();
    expect(codeBlock).toHaveAttribute('data-language', 'yaml');
    expect(container.querySelector('.code-block-language')).toHaveTextContent('YAML');
    expect(container.querySelector('.code-block-copy')).toBeInTheDocument();
    expect(container.querySelector('.code-block-content pre code')).toHaveTextContent(
      'Contents Sync',
    );
    // 짧은 블록은 접기 토글을 노출하지 않습니다.
    expect(container.querySelector('.code-block-toggle')).not.toBeInTheDocument();
  });

  it('shows a collapse toggle for long code blocks and copies the source', async () => {
    const lines = Array.from({ length: 24 }, (_, index) => `const line${index} = ${index};`);
    const content = await renderMarkdownToReact(`\`\`\`ts\n${lines.join('\n')}\n\`\`\`\n`);

    const { container } = render(<>{content}</>);

    expect(container.querySelector('.code-block-language')).toHaveTextContent('TypeScript');
    const toggle = container.querySelector('.code-block-toggle');
    expect(toggle).toBeInTheDocument();
    expect(container.querySelector('.code-block-content')).toHaveAttribute(
      'data-collapsed',
      'true',
    );

    fireEvent.click(toggle as Element);
    expect(container.querySelector('.code-block-content')).not.toHaveAttribute('data-collapsed');

    const originalClipboard = navigator.clipboard;
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    try {
      fireEvent.click(container.querySelector('.code-block-copy') as Element);
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining('const line0 = 0;'));
    } finally {
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        configurable: true,
      });
    }
  });

  it('renders inline markdown emphasis inside image captions', async () => {
    const content = await renderMarkdownToReact(
      `![*italic* and **bold** caption](/content/posts/published-note/assets/diagram.svg)
`,
    );

    const { container } = render(<>{content}</>);
    const caption = container.querySelector('.markdown-image > span:last-of-type');

    expect(caption?.querySelector('em')).toHaveTextContent('italic');
    expect(caption?.querySelector('strong')).toHaveTextContent('bold');
    // 원본 마크다운 별표가 캡션에 그대로 노출되면 안 됩니다.
    expect(caption?.textContent).not.toContain('*');
  });

  it('renders composite inline formatting across contexts', async () => {
    const content = await renderMarkdownToReact(
      `Nested ***bolditalic***, **bold _inner_**, _italic **inner**_, *\`italic code\`*, **\`bold code\`**, ~~**bold del**~~.

Links **[bold link](https://a.com)**, *[italic link](https://a.com)*, **[[second-note|bold wiki]]**.

> Quote with **bold**, *italic*, \`code\`, ~~del~~ and [link](https://a.com).

| \`code\` | *italic* | **bold** |
| --- | --- | --- |
| a | ~~del~~ | ***bi*** |
`,
      linkMaps,
    );

    const { container } = render(<>{content}</>);

    // 중첩 강조
    expect(container.querySelector('em > strong')).toHaveTextContent('bolditalic');
    expect(container.querySelector('strong > em')).toBeInTheDocument();
    expect(container.querySelector('em > code')).toHaveTextContent('italic code');
    expect(container.querySelector('strong > code')).toHaveTextContent('bold code');
    expect(container.querySelector('del > strong')).toHaveTextContent('bold del');

    // 링크/위키링크 강조
    expect(container.querySelector('strong > a[href="https://a.com"]')).toHaveTextContent(
      'bold link',
    );
    expect(container.querySelector('em > a[href="https://a.com"]')).toHaveTextContent(
      'italic link',
    );
    expect(container.querySelector('strong > a.wiki-link')).toHaveTextContent('bold wiki');

    // blockquote 내부 강조가 실제로 렌더됨 (CSS로 죽지 않도록 DOM 존재 보장)
    const blockquote = container.querySelector('blockquote');
    expect(blockquote?.querySelector('em')).toHaveTextContent('italic');
    expect(blockquote?.querySelector('strong')).toHaveTextContent('bold');
    expect(blockquote?.querySelector('del')).toHaveTextContent('del');
    expect(blockquote?.querySelector('code')).toHaveTextContent('code');

    // 표 셀 강조
    const cells = container.querySelectorAll('tbody td');
    expect(cells[1].querySelector('del')).toHaveTextContent('del');
    expect(cells[2].querySelector('em > strong')).toHaveTextContent('bi');
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

  it('renders markdown details blocks while still preserving markdown inside', async () => {
    const content = await renderMarkdownToReact(`<details>
<summary>IVFADC 인덱싱 의사코드 보기</summary>

\`\`\`text
Index_IVFADC(database)
\`\`\`

</details>
`);

    const { container } = render(<>{content}</>);
    const details = container.querySelector('details.markdown-details');
    const summary = screen.getByText('IVFADC 인덱싱 의사코드 보기');

    expect(details).toBeInTheDocument();
    expect(summary.tagName).toBe('SUMMARY');
    expect(summary).toHaveClass('markdown-details-summary');
    expect(container.querySelector('.markdown-details-content')).toBeInTheDocument();
    expect(container.querySelector('pre code')).toHaveTextContent('Index_IVFADC');
  });

  it('does not render details summaries that contain raw HTML', async () => {
    const content = await renderMarkdownToReact(`<details>
<summary><script>alert(1)</script></summary>

Unsafe summary body.

</details>
`);

    const { container } = render(<>{content}</>);

    expect(container.querySelector('details')).not.toBeInTheDocument();
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent('alert(1)');
  });

  it('renders bold source wikilinks without leaking escaped emphasis markers', async () => {
    const content = await renderMarkdownToReact(
      'PostgreSQL 은 GitHub 가 아닌 **[[youtube-source|PostgreSQL 자체 Git 저장소]]**를 이용해야 합니다.',
      linkMaps,
    );

    const { container } = render(<>{content}</>);
    const link = screen.getByRole('link', { name: 'PostgreSQL 자체 Git 저장소' });

    expect(link).toHaveAttribute('href', 'https://www.youtube.com/watch?v=fixture');
    expect(link.closest('strong')).toBeInTheDocument();
    expect(container).not.toHaveTextContent('**');
  });

  it('renders bold markdown links followed by Korean particles without leaking emphasis markers', async () => {
    const content = await renderMarkdownToReact(
      'PostgreSQL 은 GitHub 가 아닌 **[PostgreSQL 자체 Git 저장소](https://git.postgresql.org/git/postgresql.git)**를 이용해야 합니다.',
      linkMaps,
    );

    const { container } = render(<>{content}</>);
    const link = screen.getByRole('link', { name: 'PostgreSQL 자체 Git 저장소' });

    expect(link).toHaveAttribute('href', 'https://git.postgresql.org/git/postgresql.git');
    expect(link.closest('strong')).toBeInTheDocument();
    expect(container).not.toHaveTextContent('**');
  });

  it('renders wikilink aliases with inline emphasis as markdown inside the link label', async () => {
    const content = await renderMarkdownToReact(
      'PQ는 [[youtube-source|*Product Quantization for Nearest Neighbor Search* 논문]]\\(Jégou, Douze, Schmid, 2011)입니다.',
      linkMaps,
    );

    const { container } = render(<>{content}</>);
    const link = screen.getByRole('link', {
      name: 'Product Quantization for Nearest Neighbor Search 논문',
    });

    expect(link).toHaveAttribute('href', 'https://www.youtube.com/watch?v=fixture');
    expect(within(link).getByText('Product Quantization for Nearest Neighbor Search').tagName).toBe(
      'EM',
    );
    expect(container).not.toHaveTextContent('*Product Quantization for Nearest Neighbor Search*');
  });

  it('renders emphasized markdown links followed by Korean particles without leaking markers', async () => {
    const content = await renderMarkdownToReact(
      'PostgreSQL 은 GitHub 가 아닌 *[PostgreSQL 자체 Git 저장소](https://git.postgresql.org/git/postgresql.git)*를 이용해야 합니다.',
      linkMaps,
    );

    const { container } = render(<>{content}</>);
    const link = screen.getByRole('link', { name: 'PostgreSQL 자체 Git 저장소' });

    expect(link).toHaveAttribute('href', 'https://git.postgresql.org/git/postgresql.git');
    expect(link.closest('em')).toBeInTheDocument();
    expect(container).not.toHaveTextContent('*PostgreSQL 자체 Git 저장소*');
  });

  it('renders emphasized source wikilinks followed by Korean particles without leaking markers', async () => {
    const content = await renderMarkdownToReact(
      'PostgreSQL 은 GitHub 가 아닌 *[[youtube-source|PostgreSQL 자체 Git 저장소]]*를 이용해야 합니다.',
      linkMaps,
    );

    const { container } = render(<>{content}</>);
    const link = screen.getByRole('link', { name: 'PostgreSQL 자체 Git 저장소' });

    expect(link).toHaveAttribute('href', 'https://www.youtube.com/watch?v=fixture');
    expect(link.closest('em')).toBeInTheDocument();
    expect(container).not.toHaveTextContent('*PostgreSQL 자체 Git 저장소*');
  });

  it('renders links in reference sections as compact bookmark cards only there', async () => {
    const content = await renderMarkdownToReact(`# Reference Card Fixture

Normal link to [Product Quantization](https://doi.org/10.1109/TPAMI.2010.57).

# Sources

- [Product Quantization for Nearest Neighbor Search](https://doi.org/10.1109/TPAMI.2010.57)
- [Internal Note](/blog/2026-06-20-second-note)
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
    expect(referenceCards[1]).toHaveAttribute('href', '/blog/2026-06-20-second-note');
    expect(referenceCards[1]).toHaveTextContent('r3gardless.dev');
    expect(container.querySelector('.reference-card-list')).toBeInTheDocument();
    expect(container.querySelectorAll('.reference-card-list-item')).toHaveLength(2);
  });

  it('collapses duplicate original links in reference sections to one bookmark card', async () => {
    const content = await renderMarkdownToReact(`# Reference Dedup Fixture

# 참고문헌

- [YouTube Source](https://www.youtube.com/watch?v=fixture) — [원문](https://www.youtube.com/watch?v=fixture)
`);

    const { container } = render(<>{content}</>);
    const referenceCards = container.querySelectorAll('.reference-card');

    expect(referenceCards).toHaveLength(1);
    expect(referenceCards[0]).toHaveAttribute('href', 'https://www.youtube.com/watch?v=fixture');
    expect(referenceCards[0]).toHaveTextContent('YouTube Source');
    expect(referenceCards[0]).not.toHaveTextContent('원문');
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
