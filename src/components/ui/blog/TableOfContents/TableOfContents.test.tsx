import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { TableOfContentsItem } from '@/types/blog';
import useScrollSpy from '@/hooks/useScrollSpy';

// Mock useScrollSpy hook
vi.mock('@/hooks/useScrollSpy', () => ({
  default: vi.fn(() => ''),
}));

// Mock Next.js Link component
interface MockLinkProps {
  children: React.ReactNode;
  href: string;
  [key: string]: unknown;
}

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: MockLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { TableOfContents } from './TableOfContents';

const mockItems: TableOfContentsItem[] = [
  {
    id: 'section-1',
    title: 'ABCD is good?',
    level: 1,
    children: [
      {
        id: 'section-1-1',
        title: 'why ABCD is good?',
        level: 2,
        children: [
          {
            id: 'section-1-1-1',
            title: 'Reason',
            level: 3,
          },
        ],
      },
    ],
  },
  {
    id: 'section-2',
    title: 'ABCD is Bad?',
    level: 1,
  },
];

describe('TableOfContents', () => {
  const mockUseScrollSpy = vi.mocked(useScrollSpy);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseScrollSpy.mockReturnValue('');
  });

  it('반응형 구조를 렌더링한다', () => {
    render(<TableOfContents items={mockItems} />);

    expect(screen.getByText('Contents')).toBeInTheDocument();
    expect(screen.getByText('ABCD is good?')).toBeInTheDocument();
    expect(screen.getByText('why ABCD is good?')).toBeInTheDocument();
    expect(screen.getByText('Reason')).toBeInTheDocument();
    expect(screen.getByText('ABCD is Bad?')).toBeInTheDocument();
  });

  it('활성화된 항목을 하이라이트한다', () => {
    render(<TableOfContents items={mockItems} activeId="section-1" />);

    const activeItem = screen.getByText('ABCD is good?');
    expect(activeItem).toHaveClass('font-bold');
    expect(activeItem).toHaveClass('opacity-100');
  });

  it('비활성화된 항목은 opacity가 60%이다', () => {
    render(<TableOfContents items={mockItems} activeId="section-1" />);

    const inactiveItem = screen.getByText('ABCD is Bad?');
    expect(inactiveItem).toHaveClass('opacity-80');
    expect(inactiveItem).toHaveClass('xl:font-light');
  });

  it('앵커 링크가 올바르게 설정된다', () => {
    render(<TableOfContents items={mockItems} />);

    const firstLink = screen.getByText('ABCD is good?').closest('a');
    expect(firstLink).toHaveAttribute('href', '#section-1');

    const secondLink = screen.getByText('why ABCD is good?').closest('a');
    expect(secondLink).toHaveAttribute('href', '#section-1-1');
  });

  it('레벨별 스타일링이 적용된다', () => {
    render(<TableOfContents items={mockItems} />);

    const level2Item = screen.getByText('why ABCD is good?');
    const level3Item = screen.getByText('Reason');

    // 레벨 2는 pl-4 적용
    expect(level2Item).toHaveClass('pl-4', 'text-sm');
    // 레벨 3은 pl-8 적용
    expect(level3Item).toHaveClass('pl-8', 'text-sm');
  });

  it('댓글 버튼을 렌더링하고 클릭 이벤트를 처리한다', () => {
    const onCommentClick = vi.fn();
    render(<TableOfContents items={mockItems} onCommentClick={onCommentClick} />);

    const commentButton = screen.getByTitle('comments');
    expect(commentButton).toBeInTheDocument();

    fireEvent.click(commentButton);
    expect(onCommentClick).toHaveBeenCalled();
  });

  it('뒤로가기 링크를 렌더링한다', () => {
    render(<TableOfContents items={mockItems} />);

    const backLink = screen.getByTitle('back');
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/blog');
  });

  it('모든 항목에 적절한 기본 스타일이 적용된다', () => {
    render(<TableOfContents items={mockItems} />);

    const items = screen
      .getAllByRole('link')
      .filter(link => link.getAttribute('href')?.startsWith('#'));

    items.forEach(item => {
      expect(item).toHaveClass('truncate');
      expect(item).toHaveClass('break-words');
      expect(item).toHaveClass('cursor-pointer');
      expect(item).toHaveClass('transition-colors');
      expect(item).toHaveClass('focus:outline-none');
      expect(item).toHaveClass('focus-visible:outline-none');
    });
  });

  it('스크롤 스파이로부터 activeId를 받으면 우선 적용한다', () => {
    mockUseScrollSpy.mockReturnValue('section-2');

    render(<TableOfContents items={mockItems} activeId="section-1" />);

    // 스크롤 스파이의 activeId가 우선됨
    const scrollActiveItem = screen.getByText('ABCD is Bad?');
    expect(scrollActiveItem).toHaveClass('font-bold');
    expect(scrollActiveItem).toHaveClass('opacity-100');

    // props의 activeId는 무시됨
    const propsActiveItem = screen.getByText('ABCD is good?');
    expect(propsActiveItem).toHaveClass('xl:font-light');
    expect(propsActiveItem).toHaveClass('opacity-80');
  });

  it('xl 이하에서는 hr이 표시된다', () => {
    render(<TableOfContents items={mockItems} />);

    const hr = screen.getByRole('separator');
    expect(hr).toHaveClass('xl:hidden');
  });

  it('xl 이상에서만 아이콘들이 표시된다', () => {
    render(<TableOfContents items={mockItems} onCommentClick={vi.fn()} />);

    const iconContainer = screen.getByTitle('back').parentElement;
    expect(iconContainer).toHaveClass('hidden', 'xl:flex');
  });
});
