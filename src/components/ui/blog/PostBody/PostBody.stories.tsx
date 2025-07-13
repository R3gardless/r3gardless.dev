// filepath: /Users/dev_young_uk/r3gardless.dev/src/components/ui/blog/PostBody/PostBody.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import type { ExtendedRecordMap } from 'notion-types';

import { PostBody } from './PostBody';

const meta: Meta<typeof PostBody> = {
  title: 'UI/Blog/PostBody',
  component: PostBody,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '블로그 포스트 본문을 렌더링하는 컴포넌트입니다. Notion 페이지의 블록 데이터를 받아서 HTML로 렌더링합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    recordMap: {
      description: 'Notion 페이지의 블록 데이터',
      control: false,
    },
    postId: {
      description: '블로그 포스트 ID',
      control: 'text',
    },
    className: {
      description: '추가 CSS 클래스',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 간소화된 Mock Notion RecordMap 데이터
const createMockRecordMap = (): ExtendedRecordMap => {
  const pageId = 'sample-page-id';
  const textBlockId = 'sample-text-1';
  const headingBlockId = 'sample-heading-1';
  const codeBlockId = 'sample-code-1';

  return {
    block: {
      [pageId]: {
        role: 'reader',
        value: {
          id: pageId,
          version: 1,
          type: 'page',
          properties: {
            title: [['샘플 블로그 포스트 제목']],
          },
          content: [textBlockId, headingBlockId, codeBlockId],
          format: {
            page_icon: '📝',
            page_cover: '',
            page_cover_position: 0.5,
          },
          permissions: [],
          created_time: 1640995200000,
          last_edited_time: 1640995200000,
          parent_id: 'workspace-id',
          parent_table: 'space',
          alive: true,
          created_by_id: 'user-id',
          created_by_table: 'notion_user',
          last_edited_by_id: 'user-id',
          last_edited_by_table: 'notion_user',
          space_id: 'space-id',
        },
      },
      [textBlockId]: {
        role: 'reader',
        value: {
          id: textBlockId,
          version: 1,
          type: 'text',
          properties: {
            title: [
              [
                '이것은 PostBody 컴포넌트의 샘플 텍스트입니다. Notion의 rich text 블록이 어떻게 렌더링되는지 확인할 수 있습니다. ',
                [['b']],
                '굵은 텍스트',
                [['i']],
                '와 기울임꼴',
                [['c']],
                ' 그리고 코드 스타일도 포함되어 있습니다.',
              ],
            ],
          },
          content: [],
          format: {
            block_color: 'default',
          },
          permissions: [],
          created_time: 1640995200000,
          last_edited_time: 1640995200000,
          parent_id: pageId,
          parent_table: 'block',
          alive: true,
          created_by_id: 'user-id',
          created_by_table: 'notion_user',
          last_edited_by_id: 'user-id',
          last_edited_by_table: 'notion_user',
          space_id: 'space-id',
        },
      },
      [headingBlockId]: {
        role: 'reader',
        value: {
          id: headingBlockId,
          version: 1,
          type: 'header',
          properties: {
            title: [['샘플 제목 (H1)']],
          },
          content: [],
          format: {
            block_color: 'default',
            toggleable: false,
          },
          permissions: [],
          created_time: 1640995200000,
          last_edited_time: 1640995200000,
          parent_id: pageId,
          parent_table: 'block',
          alive: true,
          created_by_id: 'user-id',
          created_by_table: 'notion_user',
          last_edited_by_id: 'user-id',
          last_edited_by_table: 'notion_user',
          space_id: 'space-id',
        },
      },
      [codeBlockId]: {
        role: 'reader',
        value: {
          id: codeBlockId,
          version: 1,
          type: 'code',
          properties: {
            title: [
              [
                'function greet(name) {\n  console.log(`Hello, ${name}!`);\n  return `안녕하세요, ${name}님!`;\n}\n\ngreet("개발자");',
              ],
            ],
            language: [['javascript']],
            caption: [['JavaScript 코드 예시']],
          },
          content: [],
          format: {
            block_color: 'default',
          },
          permissions: [],
          created_time: 1640995200000,
          last_edited_time: 1640995200000,
          parent_id: pageId,
          parent_table: 'block',
          alive: true,
          created_by_id: 'user-id',
          created_by_table: 'notion_user',
          last_edited_by_id: 'user-id',
          last_edited_by_table: 'notion_user',
          space_id: 'space-id',
        },
      },
    },
    notion_user: {
      'user-id': {
        role: 'reader',
        value: {
          id: 'user-id',
          version: 1,
          email: 'user@example.com',
          given_name: 'Sample',
          family_name: 'User',
          profile_photo: '',
          onboarding_completed: true,
          mobile_onboarding_completed: true,
        },
      },
    },
    collection: {},
    collection_view: {},
    signed_urls: {},
  } as unknown as ExtendedRecordMap;
};

// 기본 스토리
export const Default: Story = {
  args: {
    recordMap: createMockRecordMap(),
    postId: 'sample-page-id',
  },
};

// 커스텀 클래스명을 가진 스토리
export const WithCustomClassName: Story = {
  args: {
    recordMap: createMockRecordMap(),
    postId: 'sample-page-id',
    className: 'custom-post-body bg-gray-50 p-6 rounded-lg border',
  },
  parameters: {
    docs: {
      description: {
        story: '커스텀 CSS 클래스를 적용한 PostBody 컴포넌트입니다.',
      },
    },
  },
};

// 텍스트 블록
export const TextBlock: Story = {
  args: {
    recordMap: {
      block: {
        'text-block': {
          role: 'reader',
          value: {
            id: 'text-block',
            type: 'text',
            properties: {
              title: [
                [
                  '이것은 텍스트 블록입니다. ',
                  [['b']],
                  '굵은 텍스트',
                  [['i']],
                  '와 기울임꼴',
                  [['c']],
                  ' 그리고 코드 스타일도 포함.',
                ],
              ],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'text-block',
  },
  parameters: {
    docs: { description: { story: '텍스트 블록 렌더링' } },
  },
};

// 북마크 블록
export const BookmarkBlock: Story = {
  args: {
    recordMap: {
      block: {
        'bookmark-block': {
          role: 'reader',
          value: {
            id: 'bookmark-block',
            type: 'bookmark',
            properties: {
              link: [['https://github.com']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'bookmark-block',
  },
  parameters: {
    docs: { description: { story: '북마크 블록 렌더링' } },
  },
};

// 불릿 리스트 블록
export const BulletedListBlock: Story = {
  args: {
    recordMap: {
      block: {
        'bulleted-list-block': {
          role: 'reader',
          value: {
            id: 'bulleted-list-block',
            type: 'bulleted_list',
            properties: {
              title: [['첫 번째 리스트 아이템']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'bulleted-list-block',
  },
  parameters: {
    docs: { description: { story: '불릿 리스트 블록 렌더링' } },
  },
};

// 넘버드 리스트 블록
export const NumberedListBlock: Story = {
  args: {
    recordMap: {
      block: {
        'numbered-list-block': {
          role: 'reader',
          value: {
            id: 'numbered-list-block',
            type: 'numbered_list',
            properties: {
              title: [['첫 번째 번호 리스트']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'numbered-list-block',
  },
  parameters: {
    docs: { description: { story: '넘버드 리스트 블록 렌더링' } },
  },
};

// 헤딩 1 블록
export const Heading1Block: Story = {
  args: {
    recordMap: {
      block: {
        'heading1-block': {
          role: 'reader',
          value: {
            id: 'heading1-block',
            type: 'header',
            properties: {
              title: [['헤딩 1 블록']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'heading1-block',
  },
  parameters: {
    docs: { description: { story: '헤딩 1 블록 렌더링' } },
  },
};

// 헤딩 2 블록
export const Heading2Block: Story = {
  args: {
    recordMap: {
      block: {
        'heading2-block': {
          role: 'reader',
          value: {
            id: 'heading2-block',
            type: 'sub_header',
            properties: {
              title: [['헤딩 2 블록']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'heading2-block',
  },
  parameters: {
    docs: { description: { story: '헤딩 2 블록 렌더링' } },
  },
};

// 헤딩 3 블록
export const Heading3Block: Story = {
  args: {
    recordMap: {
      block: {
        'heading3-block': {
          role: 'reader',
          value: {
            id: 'heading3-block',
            type: 'sub_sub_header',
            properties: {
              title: [['헤딩 3 블록']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'heading3-block',
  },
  parameters: {
    docs: { description: { story: '헤딩 3 블록 렌더링' } },
  },
};

// 인용구 블록
export const QuoteBlock: Story = {
  args: {
    recordMap: {
      block: {
        'quote-block': {
          role: 'reader',
          value: {
            id: 'quote-block',
            type: 'quote',
            properties: {
              title: [['이것은 인용구 블록입니다.']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'quote-block',
  },
  parameters: {
    docs: { description: { story: '인용구 블록 렌더링' } },
  },
};

// 콜아웃 블록
export const CalloutBlock: Story = {
  args: {
    recordMap: {
      block: {
        'callout-block': {
          role: 'reader',
          value: {
            id: 'callout-block',
            type: 'callout',
            properties: {
              title: [['이것은 콜아웃 블록입니다.']],
            },
            content: [],
            format: { page_icon: '💡' },
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'callout-block',
  },
  parameters: {
    docs: { description: { story: '콜아웃 블록 렌더링' } },
  },
};

// 수식 블록
export const EquationBlock: Story = {
  args: {
    recordMap: {
      block: {
        'equation-block': {
          role: 'reader',
          value: {
            id: 'equation-block',
            type: 'equation',
            properties: {
              title: [['E=mc^2']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'equation-block',
  },
  parameters: {
    docs: { description: { story: '수식 블록 렌더링' } },
  },
};

// 체크박스 블록
export const TodoBlock: Story = {
  args: {
    recordMap: {
      block: {
        'todo-block': {
          role: 'reader',
          value: {
            id: 'todo-block',
            type: 'to_do',
            properties: {
              title: [['체크박스 할 일']],
              checked: [['Yes']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'todo-block',
  },
  parameters: {
    docs: { description: { story: '체크박스 블록 렌더링' } },
  },
};

// TOC 블록
export const TableOfContentsBlock: Story = {
  args: {
    recordMap: {
      block: {
        'toc-block': {
          role: 'reader',
          value: {
            id: 'toc-block',
            type: 'table_of_contents',
            properties: {},
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'toc-block',
  },
  parameters: {
    docs: { description: { story: 'Table Of Contents 블록 렌더링' } },
  },
};

// 토글 블록
export const ToggleBlock: Story = {
  args: {
    recordMap: {
      block: {
        'toggle-block': {
          role: 'reader',
          value: {
            id: 'toggle-block',
            type: 'toggle',
            properties: {
              title: [['토글 블록']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'toggle-block',
  },
  parameters: {
    docs: { description: { story: '토글 블록 렌더링' } },
  },
};

// 이미지 블록
export const ImageBlock: Story = {
  args: {
    recordMap: {
      block: {
        'image-block': {
          role: 'reader',
          value: {
            id: 'image-block',
            type: 'image',
            properties: {
              source: [['https://picsum.photos/1024/512?random=2']],
              caption: [['이미지 블록 예시']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'image-block',
  },
  parameters: {
    docs: { description: { story: '이미지 블록 렌더링' } },
  },
};

// 임베드 블록
export const EmbedBlock: Story = {
  args: {
    recordMap: {
      block: {
        'embed-block': {
          role: 'reader',
          value: {
            id: 'embed-block',
            type: 'embed',
            properties: {
              source: [['https://www.youtube.com/embed/dQw4w9WgXcQ']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'embed-block',
  },
  parameters: {
    docs: { description: { story: '임베드 블록 렌더링' } },
  },
};

// 비디오 블록
export const VideoBlock: Story = {
  args: {
    recordMap: {
      block: {
        'video-block': {
          role: 'reader',
          value: {
            id: 'video-block',
            type: 'video',
            properties: {
              source: [['https://www.w3schools.com/html/mov_bbb.mp4']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'video-block',
  },
  parameters: {
    docs: { description: { story: '비디오 블록 렌더링' } },
  },
};

// 피그마 블록
export const FigmaBlock: Story = {
  args: {
    recordMap: {
      block: {
        'figma-block': {
          role: 'reader',
          value: {
            id: 'figma-block',
            type: 'figma',
            properties: {
              source: [
                [
                  'https://www.figma.com/embed?embed_host=notion&url=https://www.figma.com/file/xyz/abc',
                ],
              ],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'figma-block',
  },
  parameters: {
    docs: { description: { story: '피그마 블록 렌더링' } },
  },
};

// 구글맵 블록
export const GoogleMapsBlock: Story = {
  args: {
    recordMap: {
      block: {
        'maps-block': {
          role: 'reader',
          value: {
            id: 'maps-block',
            type: 'maps',
            properties: {
              source: [['https://www.google.com/maps/embed?...']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'maps-block',
  },
  parameters: {
    docs: { description: { story: '구글맵 블록 렌더링' } },
  },
};

// 외부 링크 블록
export const ExternalLinkBlock: Story = {
  args: {
    recordMap: {
      block: {
        'external-link-block': {
          role: 'reader',
          value: {
            id: 'external-link-block',
            type: 'text',
            properties: {
              title: [['외부 링크 ', ['a', 'https://github.com']]],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'external-link-block',
  },
  parameters: {
    docs: { description: { story: '외부 링크 블록 렌더링' } },
  },
};

// 페이지 링크 블록
export const PageLinkBlock: Story = {
  args: {
    recordMap: {
      block: {
        'page-link-block': {
          role: 'reader',
          value: {
            id: 'page-link-block',
            type: 'page',
            properties: {
              title: [['페이지 링크 블록']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'page-link-block',
  },
  parameters: {
    docs: { description: { story: '페이지 링크 블록 렌더링' } },
  },
};

// 코드 블록
export const CodeBlock: Story = {
  args: {
    recordMap: {
      block: {
        'code-block': {
          role: 'reader',
          value: {
            id: 'code-block',
            type: 'code',
            properties: {
              title: [['console.log("Hello, Notion!");\nconsole.log("Hello, Notion!");']],
              language: [['javascript']],
              caption: [['코드 블록 예시']],
            },
            content: [],
            format: {},
            alive: true,
          },
        },
      },
      notion_user: {},
      collection: {},
      collection_view: {},
      signed_urls: {},
    } as unknown as ExtendedRecordMap,
    postId: 'code-block',
  },
  parameters: {
    docs: { description: { story: '코드 블록 렌더링' } },
  },
};
