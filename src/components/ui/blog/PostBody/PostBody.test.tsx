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
    ...props
  }: {
    recordMap: ExtendedRecordMap;
    [key: string]: unknown;
  }) => {
    if (!recordMap || Object.keys(recordMap.block || {}).length === 0) {
      return <div data-testid="notion-renderer-empty">Empty content</div>;
    }
    return (
      <div data-testid="notion-renderer" data-props={JSON.stringify(props)}>
        Mocked Notion Content
      </div>
    );
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
    render(<PostBody recordMap={mockRecordMap} postId="test-page" />);

    expect(screen.getByTestId('notion-renderer')).toBeInTheDocument();
    expect(screen.getByText('Mocked Notion Content')).toBeInTheDocument();
  });

  it('커스텀 className이 적용된다', () => {
    const customClass = 'custom-test-class';
    const { container } = render(
      <PostBody recordMap={mockRecordMap} postId="test-page" className={customClass} />,
    );

    expect(container.firstChild).toHaveClass('notion-body', customClass);
  });

  it('recordMap이 null일 때 에러 메시지를 표시한다', () => {
    render(<PostBody recordMap={null as unknown as ExtendedRecordMap} postId="test-page" />);

    expect(screen.getByText('콘텐츠를 불러올 수 없습니다.')).toBeInTheDocument();
  });

  it('recordMap이 undefined일 때 에러 메시지를 표시한다', () => {
    render(<PostBody recordMap={undefined as unknown as ExtendedRecordMap} postId="test-page" />);

    expect(screen.getByText('콘텐츠를 불러올 수 없습니다.')).toBeInTheDocument();
  });

  it('빈 recordMap일 때 에러 메시지를 표시한다', () => {
    render(<PostBody recordMap={emptyRecordMap} postId="test-page" />);

    expect(screen.getByTestId('notion-renderer-empty')).toBeInTheDocument();
  });

  it('postId가 전달된다', () => {
    const postId = 'test-post-id';
    render(<PostBody recordMap={mockRecordMap} postId={postId} />);

    const notionRenderer = screen.getByTestId('notion-renderer');
    const props = JSON.parse(notionRenderer.getAttribute('data-props') || '{}');
    expect(props.rootPageId).toBe(postId);
  });

  it('NotionRenderer에 올바른 props가 전달된다', () => {
    render(<PostBody recordMap={mockRecordMap} postId="test-page" />);

    const notionRenderer = screen.getByTestId('notion-renderer');
    const props = JSON.parse(notionRenderer.getAttribute('data-props') || '{}');

    expect(props).toMatchObject({
      fullPage: false,
      darkMode: false,
      rootPageId: 'test-page',
      previewImages: true,
      showCollectionViewDropdown: false,
      showTableOfContents: false,
      minTableOfContentsItems: 3,
      defaultPageIcon: '📄',
      defaultPageCover: '',
      defaultPageCoverPosition: 0.5,
    });
  });

  it('기본 className "notion-body"가 항상 적용된다', () => {
    const { container } = render(<PostBody recordMap={mockRecordMap} />);

    expect(container.firstChild).toHaveClass('notion-body');
  });

  it('postId 없이도 렌더링된다', () => {
    render(<PostBody recordMap={mockRecordMap} />);

    expect(screen.getByTestId('notion-renderer')).toBeInTheDocument();
  });

  it('에러 상태에서 올바른 클래스가 적용된다', () => {
    const customClass = 'error-test-class';
    const { container } = render(
      <PostBody recordMap={null as unknown as ExtendedRecordMap} className={customClass} />,
    );

    expect(container.firstChild).toHaveClass('notion-body', customClass);
  });
});
