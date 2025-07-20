import type { Meta, StoryObj } from '@storybook/react';
import type { ExtendedRecordMap } from 'notion-types';

import { PostBody } from './PostBody';

/**
 * PostBody Storybook Stories
 *
 * Notion 페이지의 다양한 블록 타입들을 렌더링하는 PostBody 컴포넌트의 스토리들을 정의합니다.
 * 각 스토리는 특정 Notion 블록 타입(텍스트, 이미지, 코드, 헤더 등)의 렌더링을 시연합니다.
 */

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

/**
 * Mock 데이터 생성 함수
 *
 * 기본적인 Notion RecordMap 구조를 생성하는 헬퍼 함수입니다.
 * 페이지, 텍스트 블록, 헤딩 블록, 코드 블록을 포함한 샘플 데이터를 제공합니다.
 */
// 간소화된 Mock Notion RecordMap 데이터
const createMockRecordMap = (): ExtendedRecordMap => {
  const pageId = 'sample-page-id';
  const textBlockId = 'sample-text-1';
  const headingBlockId = 'sample-heading-1';
  const codeBlockId = 'sample-code-1';

  return {
    block: {
      // 메인 페이지 블록
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
      // 텍스트 블록 (rich text 포맷팅 예시)
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
      // 헤딩 블록 (H1 태그)
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
      // 코드 블록 (JavaScript 예시)
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
    // 사용자 정보 (작성자 정보)
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
    // 컬렉션 관련 데이터 (데이터베이스)
    collection: {},
    collection_view: {},
    // 서명된 URL (이미지, 파일 등)
    signed_urls: {},
  } as unknown as ExtendedRecordMap;
};

/**
 * 기본 PostBody 스토리
 *
 * 기본적인 PostBody 렌더링을 보여주는 스토리입니다.
 * 텍스트, 헤딩, 코드 블록을 포함한 샘플 콘텐츠를 렌더링합니다.
 */
// 기본 스토리
export const Default: Story = {
  args: {
    recordMap: createMockRecordMap(),
    postId: 'sample-page-id',
  },
};

/**
 * 커스텀 스타일링 예시
 *
 * PostBody 컴포넌트에 커스텀 CSS 클래스를 적용한 예시입니다.
 * 배경색, 패딩, 테두리 등의 스타일을 추가할 수 있습니다.
 */
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

/**
 * === Notion 블록 타입별 렌더링 예시 ===
 *
 * 아래의 스토리들은 각각 다른 Notion 블록 타입의 렌더링을 보여줍니다.
 * 실제 Notion API에서 받아오는 데이터 구조를 모방하여 작성되었습니다.
 */

/**
 * 텍스트 블록 렌더링 예시
 *
 * 기본적인 텍스트 블록을 렌더링합니다.
 * 굵은 텍스트(bold), 기울임꼴(italic), 코드 스타일 등의 서식을 포함합니다.
 */
export const TextBlock: Story = {
  args: {
    recordMap: {
      block: {
        // 텍스트 블록 (Rich Text 포맷팅 포함)
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

/**
 * 북마크 블록 렌더링 예시
 *
 * 외부 URL을 북마크로 표시하는 블록을 렌더링합니다.
 * 링크 정보와 함께 프리뷰 카드 형태로 표시됩니다.
 */
export const BookmarkBlock: Story = {
  args: {
    recordMap: {
      block: {
        // 북마크 블록 (외부 URL 링크)
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

/**
 * 불릿 리스트 블록 렌더링 예시
 *
 * 불릿 포인트(•)가 표시되는 리스트 아이템을 렌더링합니다.
 * 중첩된 리스트 구조도 지원합니다.
 */
export const BulletedListBlock: Story = {
  args: {
    recordMap: {
      block: {
        // 불릿 리스트 블록 (• 포인터)
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

/**
 * 넘버드 리스트 블록 렌더링 예시
 *
 * 숫자가 자동으로 매겨지는 정렬된 리스트를 렌더링합니다.
 * 순서가 중요한 항목들을 나열할 때 사용됩니다.
 */
export const NumberedListBlock: Story = {
  args: {
    recordMap: {
      block: {
        // 번호 매김 리스트 블록 (1. 2. 3.)
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

/**
 * 헤딩 1 블록 렌더링 예시
 *
 * 가장 큰 크기의 제목(h1 태그)을 렌더링합니다.
 * 문서의 주요 섹션 제목으로 사용됩니다.
 */
export const Heading1Block: Story = {
  args: {
    recordMap: {
      block: {
        // H1 헤딩 블록 (header 타입)
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

/**
 * 헤딩 2 블록 렌더링 예시
 *
 * 중간 크기의 제목(h2 태그)을 렌더링합니다.
 * 주요 섹션 내의 하위 섹션 제목으로 사용됩니다.
 */
export const Heading2Block: Story = {
  args: {
    recordMap: {
      block: {
        // H2 헤딩 블록 (sub_header 타입)
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

/**
 * 헤딩 3 블록 렌더링 예시
 *
 * 작은 크기의 제목(h3 태그)을 렌더링합니다.
 * 세부 항목이나 소제목으로 사용됩니다.
 */
export const Heading3Block: Story = {
  args: {
    recordMap: {
      block: {
        // H3 헤딩 블록 (sub_sub_header 타입)
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

/**
 * 인용구 블록 렌더링 예시
 *
 * 인용문이나 강조하고 싶은 텍스트를 blockquote 형태로 렌더링합니다.
 * 왼쪽 테두리와 함께 들여쓰기되어 표시됩니다.
 */
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

/**
 * 콜아웃 블록 렌더링 예시
 *
 * 아이콘과 함께 강조된 텍스트 박스를 렌더링합니다.
 * 주의사항, 팁, 경고 등의 중요한 정보를 표시할 때 사용됩니다.
 */
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

/**
 * 수식 블록 렌더링 예시
 *
 * LaTeX 문법으로 작성된 수학 공식을 렌더링합니다.
 * KaTeX 또는 MathJax를 사용하여 수식을 화면에 표시합니다.
 */
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

/**
 * 체크박스 블록 렌더링 예시
 *
 * 할 일 목록이나 체크리스트를 렌더링합니다.
 * 체크 상태에 따라 완료/미완료 표시가 변경됩니다.
 */
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

/**
 * 목차(TOC) 블록 렌더링 예시
 *
 * 페이지 내의 헤딩 블록들을 자동으로 찾아 목차를 생성합니다.
 * 각 헤딩으로 바로 이동할 수 있는 링크가 제공됩니다.
 */
export const TableOfContentsBlock: Story = {
  args: {
    recordMap: {
      block: {
        // TOC 블록
        'toc-block': {
          role: 'reader',
          value: {
            id: 'toc-block',
            version: 1,
            type: 'table_of_contents',
            properties: {},
            content: [],
            format: {
              block_color: 'default',
            },
            permissions: [],
            created_time: 1640995200000,
            last_edited_time: 1640995200000,
            parent_id: 'parent-id',
            parent_table: 'block',
            alive: true,
            created_by_id: 'user-id',
            created_by_table: 'notion_user',
            last_edited_by_id: 'user-id',
            last_edited_by_table: 'notion_user',
            space_id: 'space-id',
          },
        },
        // TOC가 참조할 헤더 블록들 추가
        header1: {
          role: 'reader',
          value: {
            id: 'header1',
            version: 1,
            type: 'header',
            properties: {
              title: [['첫 번째 헤딩']],
            },
            content: [],
            format: {},
            permissions: [],
            created_time: 1640995200000,
            last_edited_time: 1640995200000,
            parent_id: 'parent-id',
            parent_table: 'block',
            alive: true,
            created_by_id: 'user-id',
            created_by_table: 'notion_user',
            last_edited_by_id: 'user-id',
            last_edited_by_table: 'notion_user',
            space_id: 'space-id',
          },
        },
        header2: {
          role: 'reader',
          value: {
            id: 'header2',
            version: 1,
            type: 'sub_header',
            properties: {
              title: [['두 번째 헤딩']],
            },
            content: [],
            format: {},
            permissions: [],
            created_time: 1640995200000,
            last_edited_time: 1640995200000,
            parent_id: 'parent-id',
            parent_table: 'block',
            alive: true,
            created_by_id: 'user-id',
            created_by_table: 'notion_user',
            last_edited_by_id: 'user-id',
            last_edited_by_table: 'notion_user',
            space_id: 'space-id',
          },
        },
        header3: {
          role: 'reader',
          value: {
            id: 'header3',
            version: 1,
            type: 'sub_sub_header',
            properties: {
              title: [['세 번째 헤딩']],
            },
            content: [],
            format: {},
            permissions: [],
            created_time: 1640995200000,
            last_edited_time: 1640995200000,
            parent_id: 'parent-id',
            parent_table: 'block',
            alive: true,
            created_by_id: 'user-id',
            created_by_table: 'notion_user',
            last_edited_by_id: 'user-id',
            last_edited_by_table: 'notion_user',
            space_id: 'space-id',
          },
        },
        // 부모 페이지 블록
        'parent-id': {
          role: 'reader',
          value: {
            id: 'parent-id',
            version: 1,
            type: 'page',
            properties: {
              title: [['TOC 테스트 페이지']],
            },
            content: ['toc-block', 'header1', 'header2', 'header3'],
            format: {},
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
      },
      notion_user: {
        'user-id': {
          role: 'reader',
          value: {
            id: 'user-id',
            version: 1,
            email: 'user@example.com',
            given_name: 'Test',
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
    } as unknown as ExtendedRecordMap,
    postId: 'parent-id',
  },
  parameters: {
    docs: { description: { story: 'Table Of Contents 블록 렌더링 - 헤더 블록들과 함께' } },
  },
};

/**
 * 토글 블록 렌더링 예시
 *
 * 클릭하여 내용을 접거나 펼칠 수 있는 토글 블록을 렌더링합니다.
 * 상세 정보나 선택적 내용을 숨기는 데 유용합니다.
 */
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

/**
 * 이미지 블록 렌더링 예시
 *
 * 이미지 파일을 렌더링하며 캡션 정보도 함께 표시합니다.
 * 다양한 이미지 포맷과 크기 조절을 지원합니다.
 */
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

/**
 * 비디오 블록 렌더링 예시
 *
 * 비디오 파일이나 스트리밍 URL을 렌더링합니다.
 * HTML5 video 태그를 사용하여 재생 컨트롤을 제공합니다.
 */
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

/**
 * 페이지 링크 블록 렌더링 예시
 *
 * 텍스트 내에 포함된 링크를 렌더링합니다.
 * 내부 페이지나 외부 URL로의 이동을 지원합니다.
 */
export const PageLinkBlock: Story = {
  args: {
    recordMap: {
      block: {
        'page-link-block': {
          role: 'reader',
          value: {
            id: 'page-link-block',
            type: 'text',
            properties: {
              title: [['페이지 링크: ', [['a', '/blog/sample-post']], '샘플 포스트로 이동']],
            },
            content: [],
            format: {},
            alive: true,
            version: 1,
            created_time: 1640995200000,
            last_edited_time: 1640995200000,
            parent_id: 'parent-id',
            parent_table: 'block',
            created_by_id: 'user-id',
            created_by_table: 'notion_user',
            last_edited_by_id: 'user-id',
            last_edited_by_table: 'notion_user',
            space_id: 'space-id',
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

/**
 * 코드 블록 렌더링 예시
 *
 * 프로그래밍 언어별 구문 강조가 적용된 코드 블록을 렌더링합니다.
 * 언어 타입과 캡션 정보를 포함할 수 있습니다.
 */
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

/**
 * 페이지 참조 블록 렌더링 예시 (Alias 타입)
 *
 * 다른 페이지를 참조하는 블록을 렌더링합니다.
 * alias 타입을 사용하여 참조된 페이지의 내용을 미리보기로 표시합니다.
 * 페이지 제목, 아이콘, 커버 이미지 등의 메타데이터가 포함됩니다.
 */
export const PageReferenceBlock: Story = {
  args: {
    recordMap: {
      block: {
        // 메인 페이지
        'main-page': {
          role: 'reader',
          value: {
            id: 'main-page',
            version: 1,
            type: 'page',
            properties: {
              title: [['메인 페이지']],
            },
            content: ['page-ref-block'],
            format: {},
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
        // 페이지 참조 블록 (alias)
        'page-ref-block': {
          role: 'reader',
          value: {
            id: 'page-ref-block',
            version: 1,
            type: 'alias',
            format: {
              alias_pointer: {
                id: 'referenced-page',
                table: 'block',
                spaceId: 'space-id',
              },
            },
            content: [],
            permissions: [],
            created_time: 1640995200000,
            last_edited_time: 1640995200000,
            parent_id: 'main-page',
            parent_table: 'block',
            alive: true,
            created_by_id: 'user-id',
            created_by_table: 'notion_user',
            last_edited_by_id: 'user-id',
            last_edited_by_table: 'notion_user',
            space_id: 'space-id',
          },
        },
        // 참조되는 페이지
        'referenced-page': {
          role: 'reader',
          value: {
            id: 'referenced-page',
            version: 1,
            type: 'page',
            properties: {
              title: [['참조된 페이지 제목']],
            },
            content: ['text-in-ref-page'],
            format: {
              page_icon: '📄',
              page_cover: 'https://picsum.photos/1200/400?random=ref',
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
        // 참조된 페이지 내의 텍스트
        'text-in-ref-page': {
          role: 'reader',
          value: {
            id: 'text-in-ref-page',
            version: 1,
            type: 'text',
            properties: {
              title: [['이것은 참조된 페이지의 내용입니다.']],
            },
            content: [],
            format: {},
            permissions: [],
            created_time: 1640995200000,
            last_edited_time: 1640995200000,
            parent_id: 'referenced-page',
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
            given_name: 'Test',
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
    } as unknown as ExtendedRecordMap,
    postId: 'main-page',
  },
  parameters: {
    docs: { description: { story: '페이지 참조 블록 렌더링 (alias 타입으로 다른 페이지를 참조)' } },
  },
};

/**
 * 인라인 페이지 참조 블록 렌더링 예시
 *
 * 텍스트 내에서 다른 페이지를 참조하는 인라인 링크를 렌더링합니다.
 * 'p' 타입의 포맷팅을 사용하여 페이지 ID를 참조합니다.
 * 클릭 시 해당 페이지로 이동할 수 있는 링크가 생성됩니다.
 */
export const InlinePageReferenceBlock: Story = {
  args: {
    recordMap: {
      block: {
        // 메인 페이지
        'main-page': {
          role: 'reader',
          value: {
            id: 'main-page',
            version: 1,
            type: 'page',
            properties: {
              title: [['메인 페이지']],
            },
            content: ['text-with-page-ref'],
            format: {},
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
        // 페이지 참조가 포함된 텍스트 블록
        'text-with-page-ref': {
          role: 'reader',
          value: {
            id: 'text-with-page-ref',
            version: 1,
            type: 'text',
            properties: {
              title: [
                [
                  '이 텍스트는 ',
                  [['p', 'referenced-page']],
                  ' 페이지를 참조합니다. 클릭하여 이동할 수 있습니다.',
                ],
              ],
            },
            content: [],
            format: {},
            permissions: [],
            created_time: 1640995200000,
            last_edited_time: 1640995200000,
            parent_id: 'main-page',
            parent_table: 'block',
            alive: true,
            created_by_id: 'user-id',
            created_by_table: 'notion_user',
            last_edited_by_id: 'user-id',
            last_edited_by_table: 'notion_user',
            space_id: 'space-id',
          },
        },
        // 참조되는 페이지
        'referenced-page': {
          role: 'reader',
          value: {
            id: 'referenced-page',
            version: 1,
            type: 'page',
            properties: {
              title: [['참조되는 다른 페이지']],
            },
            content: [],
            format: {
              page_icon: '🔗',
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
      },
      notion_user: {
        'user-id': {
          role: 'reader',
          value: {
            id: 'user-id',
            version: 1,
            email: 'user@example.com',
            given_name: 'Test',
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
    } as unknown as ExtendedRecordMap,
    postId: 'main-page',
  },
  parameters: {
    docs: {
      description: {
        story: '인라인 페이지 참조 블록 렌더링 (텍스트 내에서 다른 페이지를 참조하는 링크)',
      },
    },
  },
};
