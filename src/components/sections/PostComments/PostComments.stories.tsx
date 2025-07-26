import type { Meta, StoryObj } from '@storybook/react';

import { PostComments } from './PostComments';

const meta: Meta<typeof PostComments> = {
  title: 'Sections/PostComments',
  component: PostComments,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Giscus를 사용한 댓글 시스템 컴포넌트입니다.

## 주요 기능
- GitHub Discussions 기반 댓글 시스템
- 다크/라이트 모드 자동 연동
- 반응형 디자인 지원
- 한국어 인터페이스

## 사용법
\`\`\`tsx
<PostComments 
  identifier="blog-post-slug"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    identifier: {
      control: 'text',
      description: '댓글을 구분하기 위한 고유 식별자 (포스트 slug 등)',
    },
    className: {
      control: 'text',
      description: '추가적인 CSS 클래스명',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 댓글 섹션
 */
export const Default: Story = {
  args: {},
};

/**
 * 특정 식별자를 가진 댓글 섹션
 */
export const WithIdentifier: Story = {
  args: {
    identifier: 'sample-blog-post',
  },
};

/**
 * 커스텀 스타일이 적용된 댓글 섹션
 */
export const CustomStyling: Story = {
  args: {
    className: 'border border-gray-200 dark:border-gray-700 rounded-lg p-6',
  },
};
