/**
 * PostBody 컴포넌트 테스트
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ExtendedRecordMap } from 'notion-types';

import { PostBody } from './PostBody';

// react-notion-x 모킹
vi.mock('react-notion-x', () => ({
  NotionRenderer: ({
    recordMap,
    disableHeader,
    fullPage,
    ...props
  }: {
    recordMap: ExtendedRecordMap;
    disableHeader?: boolean;
    fullPage?: boolean;
    [key: string]: unknown;
  }) => {
    if (!recordMap || Object.keys(recordMap.block || {}).length === 0) {
      return <div data-testid="notion-renderer-empty">Empty content</div>;
    }
    return (
      <div
        data-testid="notion-renderer"
        data-props={JSON.stringify({ recordMap, disableHeader, fullPage, ...props })}
      >
        Mocked Notion Content
      </div>
    );
  },
}));

// Next.js dynamic import 모킹 - 항상 즉시 로드되도록 설정
vi.mock('next/dynamic', () => ({
  default: (
    importFunc: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
  ) => {
    const DynamicComponent = (props: Record<string, unknown>) => {
      if (importFunc.toString().includes('react-notion-x')) {
        // NotionRenderer 모킹
        if (
          !props.recordMap ||
          Object.keys((props.recordMap as ExtendedRecordMap).block || {}).length === 0
        ) {
          return <div data-testid="notion-renderer-empty">Empty content</div>;
        }
        return (
          <div data-testid="notion-renderer" data-props={JSON.stringify(props)}>
            Mocked Notion Content
          </div>
        );
      }
      // 다른 third-party 컴포넌트들
      if (importFunc.toString().includes('code')) {
        return <div data-testid="code-component">Code Component</div>;
      }
      if (importFunc.toString().includes('equation')) {
        return <div data-testid="equation-component">Equation Component</div>;
      }
      if (importFunc.toString().includes('pdf')) {
        return <div data-testid="pdf-component">PDF Component</div>;
      }
      return <div>Dynamic Component</div>;
    };
    return DynamicComponent;
  },
}));

// Third-party 컴포넌트 모킹
vi.mock('react-notion-x/build/third-party/code', () => ({
  Code: () => <div data-testid="code-component">Code Component</div>,
}));

vi.mock('react-notion-x/build/third-party/collection', () => ({
  Collection: () => <div data-testid="collection-component">Collection Component</div>,
}));

vi.mock('react-notion-x/build/third-party/equation', () => ({
  Equation: () => <div data-testid="equation-component">Equation Component</div>,
}));

vi.mock('react-notion-x/build/third-party/modal', () => ({
  Modal: () => <div data-testid="modal-component">Modal Component</div>,
}));

vi.mock('react-notion-x/build/third-party/pdf', () => ({
  Pdf: () => <div data-testid="pdf-component">PDF Component</div>,
}));

describe('PostBody', () => {
  const mockRecordMap: ExtendedRecordMap = {
    block: {
      'test-block-1': {
        role: 'reader',
        value: {
          id: 'test-block-1',
          type: 'text',
          properties: {
            title: [['Sample Text']],
          },
          content: [],
          format: {
            block_color: 'gray',
          },
          created_time: Date.now(),
          last_edited_time: Date.now(),
          parent_id: 'test-page',
          parent_table: 'block',
          alive: true,
          space_id: 'test-space',
          version: 1,
          created_by_table: 'notion_user',
          created_by_id: 'test-user',
          last_edited_by_table: 'notion_user',
          last_edited_by_id: 'test-user',
        } as unknown,
      },
    },
    collection: {},
    collection_view: {},
    signed_urls: {},
    preview_images: {},
    notion_user: {},
    collection_query: {},
  } as unknown as ExtendedRecordMap;

  const emptyRecordMap: ExtendedRecordMap = {
    block: {},
    collection: {},
    collection_view: {},
    signed_urls: {},
    preview_images: {},
    notion_user: {},
    collection_query: {},
  };

  it('정상적인 recordMap과 함께 렌더링된다', () => {
    render(<PostBody recordMap={mockRecordMap} />);

    expect(screen.getByTestId('notion-renderer')).toBeInTheDocument();
    expect(screen.getByText('Mocked Notion Content')).toBeInTheDocument();
  });

  it('커스텀 className이 적용된다', () => {
    const customClass = 'custom-test-class';
    const { container } = render(<PostBody recordMap={mockRecordMap} className={customClass} />);

    expect(container.firstChild).toHaveClass(customClass);
  });

  it('recordMap이 null일 때 에러 메시지를 표시한다', () => {
    render(<PostBody recordMap={null as unknown as ExtendedRecordMap} />);

    expect(screen.getByText('콘텐츠를 불러올 수 없습니다.')).toBeInTheDocument();
  });

  it('recordMap이 undefined일 때 에러 메시지를 표시한다', () => {
    render(<PostBody recordMap={undefined as unknown as ExtendedRecordMap} />);

    expect(screen.getByText('콘텐츠를 불러올 수 없습니다.')).toBeInTheDocument();
  });

  it('빈 recordMap일 때 에러 메시지를 표시한다', () => {
    render(<PostBody recordMap={emptyRecordMap} />);

    expect(screen.getByTestId('notion-renderer-empty')).toBeInTheDocument();
  });

  it('NotionRenderer에 올바른 props가 전달된다', () => {
    render(<PostBody recordMap={mockRecordMap} />);

    const notionRenderer = screen.getByTestId('notion-renderer');
    const props = JSON.parse(notionRenderer.getAttribute('data-props') ?? '{}');

    expect(props).toMatchObject({
      disableHeader: true,
      fullPage: true,
    });
    expect(props.recordMap).toBeDefined();
  });

  it('기본 className이 적용된다', () => {
    const { container } = render(<PostBody recordMap={mockRecordMap} />);

    expect(container.firstChild).toBeInTheDocument();
    // className이 비어있을 때는 class 속성이 빈 문자열이어야 함
    expect(container.firstChild).toHaveAttribute('class', '');
  });

  it('에러 상태에서 올바른 클래스가 적용된다', () => {
    const customClass = 'error-test-class';
    const { container } = render(
      <PostBody recordMap={null as unknown as ExtendedRecordMap} className={customClass} />,
    );

    expect(container.firstChild).toHaveClass(customClass);
  });
});
