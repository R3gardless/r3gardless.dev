import type { Meta, StoryObj } from '@storybook/react';

import { PostBody } from './PostBody';

const sampleMarkdown = `# Markdown Post

> [!TIP]
> GitHub alerts are rendered as callouts.

This body includes **bold text**, a wiki link to [[second-note|another post]], inline math $a^2 + b^2 = c^2$, and a table.

| Feature | Status |
| --- | --- |
| GFM table | Supported |
| KaTeX | Supported |

\`\`\`typescript
export const answer = 42;
\`\`\`

\`\`\`mermaid
flowchart TD
  KNOWLEDGE_BASE --> Blog
\`\`\`
`;

const meta: Meta<typeof PostBody> = {
  title: 'UI/Blog/PostBody',
  component: PostBody,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '블로그 포스트 Markdown 본문을 렌더링하는 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    markdown: {
      description: 'Markdown 본문',
      control: 'text',
    },
    linkMaps: {
      description: '위키링크 해석용 맵',
      control: false,
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    markdown: sampleMarkdown,
    linkMaps: {
      published: {
        'second-note': '/blog/second-note',
      },
      sources: {},
    },
  },
};

export const Empty: Story = {
  args: {
    markdown: '',
  },
};
