import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { TagList } from './TagList';

describe('TagList', () => {
  afterEach(() => {
    cleanup();
  });

  it('기본 TagList가 렌더링된다', () => {
    render(<TagList tags={['React', 'TypeScript']} />);

    expect(screen.getByText('태그')).toBeInTheDocument();
    expect(screen.getByText('#React')).toBeInTheDocument();
    expect(screen.getByText('#TypeScript')).toBeInTheDocument();
  });

  it('+ 더보기 버튼이 기본으로 표시된다', () => {
    render(<TagList tags={['React']} />);

    expect(screen.getByText('+ 더보기')).toBeInTheDocument();
  });

  it('showMore가 false일 때 더보기 버튼이 표시되지 않는다', () => {
    render(<TagList tags={['React']} showMore={false} />);

    expect(screen.queryByText('+ 더보기')).not.toBeInTheDocument();
  });

  it('선택된 태그가 없을 때 구분선과 모두지우기가 표시되지 않는다', () => {
    render(<TagList tags={['React']} selectedTags={[]} />);

    expect(screen.queryByText('모두지우기')).not.toBeInTheDocument();
  });

  it('선택된 태그가 있을 때 구분선과 모두지우기가 표시된다', () => {
    render(<TagList tags={['React', 'TypeScript']} selectedTags={['TypeScript']} />);

    // 선택된 태그가 그 자리에서 클릭된 상태로 표시됨
    expect(screen.getByText('#TypeScript')).toBeInTheDocument();
    expect(screen.getByText('모두지우기')).toBeInTheDocument();
  });

  it('showClearAll이 false일 때 모두지우기 버튼이 표시되지 않는다', () => {
    render(<TagList tags={['React']} selectedTags={['TypeScript']} showClearAll={false} />);

    expect(screen.queryByText('모두지우기')).not.toBeInTheDocument();
  });

  it('커스텀 클래스명이 적용된다', () => {
    const { container } = render(<TagList tags={['React']} className="custom-class" />);
    const tagList = container.firstChild as Element;

    expect(tagList).toHaveClass('custom-class');
  });

  describe('이벤트 핸들링', () => {
    it('태그 클릭 시 onTagClick이 호출된다', () => {
      const handleTagClick = vi.fn();
      render(<TagList tags={['React']} onTagClick={handleTagClick} />);

      const tag = screen.getByText('#React');
      fireEvent.click(tag);

      expect(handleTagClick).toHaveBeenCalledWith('React');
    });

    it('선택된 태그의 X 아이콘 클릭 시 onTagRemove가 호출된다', () => {
      const handleTagRemove = vi.fn();
      render(
        <TagList
          tags={['React', 'TypeScript']}
          selectedTags={['TypeScript']}
          onTagRemove={handleTagRemove}
        />,
      );

      const removeButton = screen.getByLabelText('태그 제거');
      fireEvent.click(removeButton);

      expect(handleTagRemove).toHaveBeenCalledWith('TypeScript');
    });

    it('더보기 클릭 시 onMoreClick이 호출된다', () => {
      const handleMoreClick = vi.fn();
      render(<TagList tags={['React']} onMoreClick={handleMoreClick} />);

      const moreButton = screen.getByText('+ 더보기');
      fireEvent.click(moreButton);

      expect(handleMoreClick).toHaveBeenCalledTimes(1);
    });

    it('모두지우기 클릭 시 onClearAll이 호출된다', () => {
      const handleClearAll = vi.fn();
      render(
        <TagList tags={['React']} selectedTags={['TypeScript']} onClearAll={handleClearAll} />,
      );

      const clearAllButton = screen.getByText('모두지우기');
      fireEvent.click(clearAllButton);

      expect(handleClearAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('선택된 태그 기능', () => {
    it('선택된 태그에는 X 아이콘이 표시된다', () => {
      render(<TagList tags={['React', 'TypeScript']} selectedTags={['TypeScript']} />);

      expect(screen.getByLabelText('태그 제거')).toBeInTheDocument();
    });

    it('선택된 태그와 일반 태그가 함께 표시된다', () => {
      render(
        <TagList
          tags={['React', 'JavaScript', 'TypeScript', 'Next.js']}
          selectedTags={['TypeScript', 'Next.js']}
        />,
      );

      // 모든 태그들이 표시됨
      expect(screen.getByText('#React')).toBeInTheDocument();
      expect(screen.getByText('#JavaScript')).toBeInTheDocument();
      expect(screen.getByText('#TypeScript')).toBeInTheDocument();
      expect(screen.getByText('#Next.js')).toBeInTheDocument();

      // 선택된 태그들에는 X 아이콘이 있음
      expect(screen.getAllByLabelText('태그 제거')).toHaveLength(2);
    });
  });

  describe('접근성', () => {
    it('제목이 올바른 헤딩 레벨로 렌더링된다', () => {
      render(<TagList tags={['React']} />);

      const heading = screen.getByRole('heading', { name: '태그' });
      expect(heading.tagName).toBe('H3');
    });

    it('버튼들이 올바른 role을 가진다', () => {
      render(<TagList tags={['React']} selectedTags={['TypeScript']} />);

      const moreButton = screen.getByRole('button', { name: '+ 더보기' });
      const clearAllButton = screen.getByRole('button', { name: '모두지우기' });

      expect(moreButton).toBeInTheDocument();
      expect(clearAllButton).toBeInTheDocument();
    });
  });

  describe('엣지 케이스', () => {
    it('빈 태그 배열이 전달되어도 렌더링된다', () => {
      render(<TagList tags={[]} />);

      expect(screen.getByText('태그')).toBeInTheDocument();
    });

    it('모든 이벤트 핸들러가 undefined여도 렌더링된다', () => {
      render(
        <TagList
          tags={['React']}
          selectedTags={['TypeScript']}
          onTagClick={undefined}
          onTagRemove={undefined}
          onMoreClick={undefined}
          onClearAll={undefined}
        />,
      );

      expect(screen.getByText('태그')).toBeInTheDocument();
    });
  });

  describe('레이아웃', () => {
    it('기본 스타일 클래스들이 적용된다', () => {
      const { container } = render(<TagList tags={['React']} />);
      const tagList = container.firstChild as Element;

      expect(tagList).toHaveClass(
        'w-full',
        'max-w-[768px]',
        'lg:w-[246px]',
        'lg:max-w-none',
        'p-3',
        'rounded-lg',
        'bg-[color:var(--color-background)]',
        'text-[color:var(--color-text)]',
      );
    });

    it('태그들이 flex-wrap 레이아웃으로 배치된다', () => {
      const { container } = render(<TagList tags={['React', 'TypeScript']} />);

      const tagContainer = container.querySelector('.flex.flex-wrap.gap-2');
      expect(tagContainer).toBeInTheDocument();
      expect(tagContainer).toHaveClass('flex', 'flex-wrap', 'gap-2', 'mb-3');
    });

    it('헤더에 제목과 모두지우기가 좌우 정렬된다', () => {
      render(<TagList tags={['React']} selectedTags={['TypeScript']} />);

      const header = screen.getByText('태그').parentElement;
      expect(header).toHaveClass('flex', 'justify-between', 'items-center');

      expect(screen.getByText('태그')).toBeInTheDocument();
      expect(screen.getByText('모두지우기')).toBeInTheDocument();
    });

    it('선택된 태그가 없을 때 헤더에 제목만 표시된다', () => {
      render(<TagList tags={['React']} selectedTags={[]} />);

      expect(screen.getByText('태그')).toBeInTheDocument();
      expect(screen.queryByText('모두지우기')).not.toBeInTheDocument();
    });
  });
});
