import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import { Tag } from './Tag';

describe('Tag', () => {
  // 헬퍼 함수: parentElement를 안전하게 가져오기
  const getParentElement = (element: Element): Element => {
    const parent = element.parentElement;
    expect(parent).not.toBeNull();
    return parent!;
  };

  afterEach(() => {
    cleanup();
  });
  it('기본 태그가 렌더링된다', () => {
    render(<Tag text="react" />);
    const tag = screen.getByText('#react');
    expect(tag).toBeInTheDocument();
  });

  it('# 접두사가 없는 텍스트에 자동으로 # 접두사가 추가된다', () => {
    render(<Tag text="javascript" />);
    const tag = screen.getByText('#javascript');
    expect(tag).toBeInTheDocument();
  });

  it('이미 # 접두사가 있는 텍스트는 중복 추가되지 않는다', () => {
    render(<Tag text="#typescript" />);
    const tag = screen.getByText('#typescript');
    expect(tag).toBeInTheDocument();
    expect(screen.queryByText('##typescript')).not.toBeInTheDocument();
  });

  it('라이트 테마가 기본값으로 적용된다', () => {
    render(<Tag text="nextjs" />);
    const tag = getParentElement(screen.getByText('#nextjs'));
    expect(tag).toHaveAttribute('data-theme', 'light');
  });

  it('다크 테마가 올바르게 적용된다', () => {
    render(<Tag text="tailwind" theme="dark" />);
    const tag = getParentElement(screen.getByText('#tailwind'));
    expect(tag).toHaveAttribute('data-theme', 'dark');
  });

  it('커스텀 클래스명이 적용된다', () => {
    render(<Tag text="custom" className="custom-class" />);
    const tag = getParentElement(screen.getByText('#custom'));
    expect(tag).toHaveClass('custom-class');
  });

  it('기본 스타일 클래스들이 적용된다', () => {
    render(<Tag text="styled" />);
    const tag = getParentElement(screen.getByText('#styled'));
    expect(tag).toHaveClass(
      'inline-flex',
      'items-center',
      'gap-1',
      'rounded-full',
      'px-3',
      'py-1',
      'text-xs',
      'transition-all',
      'duration-200',
    );
  });

  it('CSS 변수를 사용한 색상 클래스가 적용된다', () => {
    render(<Tag text="colored" />);
    const tag = getParentElement(screen.getByText('#colored'));
    expect(tag).toHaveClass('bg-[color:var(--color-secondary)]', 'text-[color:var(--color-text)]');
  });

  it('라이트 테마와 다크 테마가 동일한 CSS 변수를 사용한다', () => {
    const { rerender } = render(<Tag text="theme-test" theme="light" />);
    const lightTag = getParentElement(screen.getByText('#theme-test'));
    expect(lightTag).toHaveAttribute('data-theme', 'light');
    expect(lightTag).toHaveClass(
      'bg-[color:var(--color-secondary)]',
      'text-[color:var(--color-text)]',
    );

    rerender(<Tag text="theme-test" theme="dark" />);
    const darkTag = getParentElement(screen.getByText('#theme-test'));
    expect(darkTag).toHaveClass(
      'bg-[color:var(--color-secondary)]',
      'text-[color:var(--color-text)]',
    );
  });

  it('빈 문자열도 # 접두사가 추가된다', () => {
    render(<Tag text="" />);
    const tag = screen.getByText('#');
    expect(tag).toBeInTheDocument();
  });

  it('특수 문자가 포함된 텍스트도 올바르게 렌더링된다', () => {
    render(<Tag text="react-hooks" />);
    const tag = screen.getByText('#react-hooks');
    expect(tag).toBeInTheDocument();
  });

  describe('클릭 기능', () => {
    it('onClick이 없을 때 span 엘리먼트로 렌더링된다', () => {
      render(<Tag text="non-clickable" />);
      const tag = screen.getByText('#non-clickable');
      expect(tag.tagName).toBe('SPAN');
      expect(tag).not.toHaveAttribute('type');
    });

    it('onClick이 있을 때 button 엘리먼트로 렌더링된다', () => {
      const handleClick = vi.fn();
      render(<Tag text="clickable" onClick={handleClick} />);
      const tag = getParentElement(screen.getByText('#clickable'));
      expect(tag.tagName).toBe('BUTTON');
      expect(tag).toHaveAttribute('type', 'button');
    });

    it('클릭 이벤트가 올바르게 호출된다', () => {
      const handleClick = vi.fn();
      render(<Tag text="clickable" onClick={handleClick} />);
      const tag = screen.getByText('#clickable');

      fireEvent.click(tag);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('여러 번 클릭해도 이벤트가 올바르게 호출된다', () => {
      const handleClick = vi.fn();
      render(<Tag text="multi-click" onClick={handleClick} />);
      const tag = screen.getByText('#multi-click');

      fireEvent.click(tag);
      fireEvent.click(tag);
      fireEvent.click(tag);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('엣지 케이스', () => {
    it('공백만 있는 텍스트도 # 접두사가 추가된다', () => {
      const { container } = render(<Tag text="   " />);
      const tag = container.querySelector('span');
      expect(tag).toHaveTextContent('#');
      expect(tag).toBeInTheDocument();
    });

    it('여러 개의 # 문자로 시작하는 텍스트는 중복 추가되지 않는다', () => {
      render(<Tag text="##double-hash" />);
      const tag = screen.getByText('##double-hash');
      expect(tag).toBeInTheDocument();
      expect(screen.queryByText('###double-hash')).not.toBeInTheDocument();
    });

    it('단일 # 문자만 있는 텍스트도 올바르게 렌더링된다', () => {
      render(<Tag text="#" />);
      const tag = screen.getByText('#');
      expect(tag).toBeInTheDocument();
    });

    it('숫자로 시작하는 텍스트도 올바르게 렌더링된다', () => {
      render(<Tag text="2024년" />);
      const tag = screen.getByText('#2024년');
      expect(tag).toBeInTheDocument();
    });

    it('특수문자로만 이루어진 텍스트도 올바르게 렌더링된다', () => {
      render(<Tag text="@#$%^&*()" />);
      const tag = screen.getByText('#@#$%^&*()');
      expect(tag).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('클릭 가능한 태그는 button role을 가진다', () => {
      const handleClick = vi.fn();
      render(<Tag text="accessible" onClick={handleClick} />);
      const tag = screen.getByRole('button');
      expect(tag).toHaveTextContent('#accessible');
    });

    it('클릭 불가능한 태그는 button role을 가지지 않는다', () => {
      render(<Tag text="non-accessible" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('스타일 조합', () => {
    it('모든 props가 함께 사용될 때 올바르게 렌더링된다', () => {
      const handleClick = vi.fn();
      render(<Tag text="full-props" theme="dark" className="extra-class" onClick={handleClick} />);
      const tag = getParentElement(screen.getByText('#full-props'));

      expect(tag.tagName).toBe('BUTTON');
      expect(tag).toHaveAttribute('data-theme', 'dark');
      expect(tag).toHaveClass('extra-class');
      expect(tag).toHaveAttribute('type', 'button');
    });

    it('className이 undefined일 때도 올바르게 렌더링된다', () => {
      render(<Tag text="no-class" className={undefined} />);
      const tag = screen.getByText('#no-class');
      expect(tag).toBeInTheDocument();
    });

    it('빈 className일 때도 올바르게 렌더링된다', () => {
      render(<Tag text="empty-class" className="" />);
      const tag = screen.getByText('#empty-class');
      expect(tag).toBeInTheDocument();
    });
  });

  describe('컴포넌트 선택 로직', () => {
    it('onClick이 정의되지 않으면 Component는 span이다', () => {
      render(<Tag text="test" />);
      const tag = screen.getByText('#test');
      expect(tag.tagName).toBe('SPAN');
    });

    it('onClick이 null이면 Component는 span이다', () => {
      render(<Tag text="test" onClick={null as unknown as () => void} />);
      const tag = screen.getByText('#test');
      expect(tag.tagName).toBe('SPAN');
    });

    it('onClick이 undefined이면 Component는 span이다', () => {
      render(<Tag text="test" onClick={undefined} />);
      const tag = screen.getByText('#test');
      expect(tag.tagName).toBe('SPAN');
    });

    it('onClick이 함수이면 Component는 button이다', () => {
      const handleClick = vi.fn();
      render(<Tag text="test" onClick={handleClick} />);
      const tag = getParentElement(screen.getByText('#test'));
      expect(tag.tagName).toBe('BUTTON');
    });
  });

  describe('type 속성 설정', () => {
    it('onClick이 없을 때 type 속성이 설정되지 않는다', () => {
      render(<Tag text="test" />);
      const tag = getParentElement(screen.getByText('#test'));
      expect(tag).not.toHaveAttribute('type');
    });

    it('onClick이 있을 때 type이 button으로 설정된다', () => {
      const handleClick = vi.fn();
      render(<Tag text="test" onClick={handleClick} />);
      const tag = getParentElement(screen.getByText('#test'));
      expect(tag).toHaveAttribute('type', 'button');
    });
  });

  describe('텍스트 처리 로직', () => {
    it('text.startsWith("#")가 true일 때 # 접두사가 추가되지 않는다', () => {
      render(<Tag text="#already-has-hash" />);
      const tag = screen.getByText('#already-has-hash');
      expect(tag).toBeInTheDocument();
      expect(screen.queryByText('##already-has-hash')).not.toBeInTheDocument();
    });

    it('text.startsWith("#")가 false일 때 # 접두사가 추가된다', () => {
      render(<Tag text="no-hash" />);
      const tag = screen.getByText('#no-hash');
      expect(tag).toBeInTheDocument();
    });
  });

  describe('삼항 연산자 분기 테스트', () => {
    it('onClick이 truthy할 때 button으로 렌더링', () => {
      const mockFn = vi.fn();
      render(<Tag text="test" onClick={mockFn} />);
      const tag = getParentElement(screen.getByText('#test'));
      expect(tag.tagName).toBe('BUTTON');
    });

    it('onClick이 falsy할 때 span으로 렌더링', () => {
      render(<Tag text="test" onClick={undefined} />);
      const tag = getParentElement(screen.getByText('#test'));
      expect(tag.tagName).toBe('SPAN');
    });

    it('type 속성 - onClick이 truthy할 때 button', () => {
      const mockFn = vi.fn();
      render(<Tag text="test" onClick={mockFn} />);
      const tag = getParentElement(screen.getByText('#test'));
      expect(tag).toHaveAttribute('type', 'button');
    });

    it('type 속성 - onClick이 falsy할 때 undefined', () => {
      render(<Tag text="test" />);
      const tag = getParentElement(screen.getByText('#test'));
      expect(tag).not.toHaveAttribute('type');
    });
  });

  describe('CSS 클래스 조합', () => {
    it('baseStyles, themeStyles, className이 모두 조합된다', () => {
      render(<Tag text="test" className="custom-class" />);
      const tag = getParentElement(screen.getByText('#test'));

      // baseStyles
      expect(tag).toHaveClass(
        'inline-flex',
        'items-center',
        'gap-1',
        'rounded-full',
        'px-3',
        'py-1',
        'text-xs',
        'transition-all',
        'duration-200',
      );
      // themeStyles
      expect(tag).toHaveClass(
        'bg-[color:var(--color-secondary)]',
        'text-[color:var(--color-text)]',
      );
      // className
      expect(tag).toHaveClass('custom-class');
    });

    it('className이 빈 문자열일 때도 조합된다', () => {
      render(<Tag text="test" className="" />);
      const tag = getParentElement(screen.getByText('#test'));
      expect(tag).toHaveClass(
        'inline-flex',
        'items-center',
        'gap-1',
        'rounded-full',
        'px-3',
        'py-1',
        'text-xs',
        'transition-all',
        'duration-200',
      );
    });
  });

  describe('추가 브랜치 커버리지 테스트', () => {
    it('다양한 falsy 값들로 onClick을 테스트', () => {
      // onClick이 false인 경우
      render(<Tag text="test-false" onClick={false as unknown as () => void} />);
      const tagFalse = getParentElement(screen.getByText('#test-false'));
      expect(tagFalse.tagName).toBe('SPAN');

      cleanup();

      // onClick이 0인 경우
      render(<Tag text="test-zero" onClick={0 as unknown as () => void} />);
      const tagZero = getParentElement(screen.getByText('#test-zero'));
      expect(tagZero.tagName).toBe('SPAN');

      cleanup();

      // onClick이 빈 문자열인 경우
      render(<Tag text="test-empty" onClick={'' as unknown as () => void} />);
      const tagEmpty = getParentElement(screen.getByText('#test-empty'));
      expect(tagEmpty.tagName).toBe('SPAN');
    });

    it('다양한 truthy 값들로 onClick을 테스트', () => {
      const mockFn = vi.fn();

      // onClick이 일반 함수인 경우
      render(<Tag text="test-fn" onClick={mockFn} />);
      const tagFn = getParentElement(screen.getByText('#test-fn'));
      expect(tagFn.tagName).toBe('BUTTON');
      expect(tagFn).toHaveAttribute('type', 'button');

      cleanup();

      // onClick이 화살표 함수인 경우
      render(<Tag text="test-arrow" onClick={() => {}} />);
      const tagArrow = getParentElement(screen.getByText('#test-arrow'));
      expect(tagArrow.tagName).toBe('BUTTON');
      expect(tagArrow).toHaveAttribute('type', 'button');
    });

    it('모든 가능한 theme 값들을 테스트', () => {
      // 명시적으로 light 테마
      render(<Tag text="light-explicit" theme="light" />);
      const lightTag = getParentElement(screen.getByText('#light-explicit'));
      expect(lightTag).toHaveAttribute('data-theme', 'light');

      cleanup();

      // 명시적으로 dark 테마
      render(<Tag text="dark-explicit" theme="dark" />);
      const darkTag = getParentElement(screen.getByText('#dark-explicit'));
      expect(darkTag).toHaveAttribute('data-theme', 'dark');

      cleanup();

      // theme이 undefined인 경우 (기본값 사용)
      render(<Tag text="default-theme" theme={undefined} />);
      const defaultTag = getParentElement(screen.getByText('#default-theme'));
      expect(defaultTag).toHaveAttribute('data-theme', 'light');
    });

    it('text 처리의 모든 브랜치를 테스트', () => {
      // 정확히 '#'으로 시작하는 경우
      render(<Tag text="#starts-with-hash" />);
      const hashTag = getParentElement(screen.getByText('#starts-with-hash'));
      expect(hashTag).toBeInTheDocument();

      cleanup();

      // '#'으로 시작하지 않는 경우
      render(<Tag text="no-hash" />);
      const noHashTag = getParentElement(screen.getByText('#no-hash'));
      expect(noHashTag).toBeInTheDocument();

      cleanup();

      // 특수한 경우: '#'이 중간에 있는 경우
      render(<Tag text="has#middle" />);
      const middleHashTag = getParentElement(screen.getByText('#has#middle'));
      expect(middleHashTag).toBeInTheDocument();
    });

    it('className 처리의 모든 브랜치를 테스트', () => {
      // className이 정의된 경우
      render(<Tag text="with-class" className="test-class" />);
      const withClassTag = getParentElement(screen.getByText('#with-class'));
      expect(withClassTag).toHaveClass('test-class');

      cleanup();

      // className이 빈 문자열인 경우
      render(<Tag text="empty-class" className="" />);
      const emptyClassTag = getParentElement(screen.getByText('#empty-class'));
      expect(emptyClassTag).toBeInTheDocument();

      cleanup();

      // className이 undefined인 경우
      render(<Tag text="no-class" className={undefined} />);
      const noClassTag = getParentElement(screen.getByText('#no-class'));
      expect(noClassTag).toBeInTheDocument();

      cleanup();

      // className이 여러 클래스인 경우
      render(<Tag text="multi-class" className="class1 class2 class3" />);
      const multiClassTag = getParentElement(screen.getByText('#multi-class'));
      expect(multiClassTag).toHaveClass('class1', 'class2', 'class3');
    });

    it('이벤트 핸들링의 모든 브랜치를 테스트', () => {
      const mockFn = vi.fn();

      // 클릭 가능한 태그
      render(<Tag text="clickable" onClick={mockFn} />);
      const clickableTag = getParentElement(screen.getByText('#clickable'));

      // 이벤트 발생 전 상태 확인
      expect(mockFn).not.toHaveBeenCalled();

      // 클릭 이벤트 발생
      fireEvent.click(clickableTag);
      expect(mockFn).toHaveBeenCalledTimes(1);

      // 여러 번 클릭
      fireEvent.click(clickableTag);
      fireEvent.click(clickableTag);
      expect(mockFn).toHaveBeenCalledTimes(3);

      cleanup();

      // 클릭 불가능한 태그 (onClick이 없음)
      render(<Tag text="non-clickable" />);
      const nonClickableTag = screen.getByText('#non-clickable');

      // span 요소는 클릭 이벤트가 있어도 특별한 동작 없음
      fireEvent.click(nonClickableTag);
      expect(mockFn).toHaveBeenCalledTimes(3); // 이전 테스트의 호출 횟수와 동일
    });

    it('props 조합의 모든 경우를 테스트', () => {
      // 최소 props
      render(<Tag text="minimal" />);
      const minimalTag = getParentElement(screen.getByText('#minimal'));
      expect(minimalTag.tagName).toBe('SPAN');
      expect(minimalTag).toHaveAttribute('data-theme', 'light');

      cleanup();

      // 최대 props
      const maxHandler = vi.fn();
      render(<Tag text="maximal" theme="dark" className="max-class" onClick={maxHandler} />);
      const maximalTag = getParentElement(screen.getByText('#maximal'));
      expect(maximalTag.tagName).toBe('BUTTON');
      expect(maximalTag).toHaveAttribute('data-theme', 'dark');
      expect(maximalTag).toHaveClass('max-class');
      expect(maximalTag).toHaveAttribute('type', 'button');
    });
  });

  describe('isClicked 상태 테스트', () => {
    it('isClicked가 false일 때 기본 스타일이 적용된다', () => {
      render(<Tag text="normal" isClicked={false} />);
      const tag = getParentElement(screen.getByText('#normal'));
      expect(tag).toHaveClass(
        'bg-[color:var(--color-secondary)]',
        'text-[color:var(--color-text)]',
      );
    });

    it('isClicked가 true일 때 클릭된 상태 스타일이 적용된다', () => {
      render(<Tag text="clicked" isClicked={true} />);
      const tag = getParentElement(screen.getByText('#clicked'));
      expect(tag).toHaveClass(
        'bg-[color:var(--color-secondary-clicked)]',
        'text-[color:var(--color-text-clicked)]',
      );
    });

    it('isClicked가 undefined일 때 기본값 false로 동작한다', () => {
      render(<Tag text="default" isClicked={undefined} />);
      const tag = getParentElement(screen.getByText('#default'));
      expect(tag).toHaveClass(
        'bg-[color:var(--color-secondary)]',
        'text-[color:var(--color-text)]',
      );
    });

    it('isClicked 상태와 테마가 함께 작동한다', () => {
      render(<Tag text="clicked-dark" theme="dark" isClicked={true} />);
      const tag = getParentElement(screen.getByText('#clicked-dark'));
      expect(tag).toHaveAttribute('data-theme', 'dark');
      expect(tag).toHaveClass(
        'bg-[color:var(--color-secondary-clicked)]',
        'text-[color:var(--color-text-clicked)]',
      );
    });
  });

  describe('onRemove 기능 테스트', () => {
    it('isClicked가 false이고 onRemove가 있어도 X 아이콘이 표시되지 않는다', () => {
      const handleRemove = vi.fn();
      render(<Tag text="no-x" isClicked={false} onRemove={handleRemove} />);

      expect(screen.queryByLabelText('태그 제거')).not.toBeInTheDocument();
    });

    it('isClicked가 true이고 onRemove가 없으면 X 아이콘이 표시되지 않는다', () => {
      render(<Tag text="no-remove" isClicked={true} />);

      expect(screen.queryByLabelText('태그 제거')).not.toBeInTheDocument();
    });

    it('isClicked가 true이고 onRemove가 있으면 X 아이콘이 표시된다', () => {
      const handleRemove = vi.fn();
      render(<Tag text="with-x" isClicked={true} onRemove={handleRemove} />);

      /* X 아이콘이 표시되는지 확인 */
      const removeButton = screen.getByLabelText('태그 제거');
      expect(removeButton).toBeInTheDocument();
      /* X 아이콘은 svg 요소이므로 type 속성이 없음 */
      expect(removeButton.tagName).toBe('svg');
    });

    it('X 아이콘 클릭 시 onRemove가 호출된다', () => {
      const handleRemove = vi.fn();
      render(<Tag text="removable" isClicked={true} onRemove={handleRemove} />);

      const removeButton = screen.getByLabelText('태그 제거');
      fireEvent.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('X 아이콘 클릭 시 이벤트 전파가 중단된다', () => {
      const handleClick = vi.fn();
      const handleRemove = vi.fn();
      render(
        <Tag text="event-test" isClicked={true} onClick={handleClick} onRemove={handleRemove} />,
      );

      const removeButton = screen.getByLabelText('태그 제거');
      fireEvent.click(removeButton);

      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('태그 본체 클릭 시에는 onClick만 호출되고 onRemove는 호출되지 않는다', () => {
      const handleClick = vi.fn();
      const handleRemove = vi.fn();
      render(
        <Tag text="tag-click" isClicked={true} onClick={handleClick} onRemove={handleRemove} />,
      );

      const tag = screen.getByText('#tag-click');
      fireEvent.click(tag);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleRemove).not.toHaveBeenCalled();
    });

    it('X 아이콘에 올바른 스타일이 적용된다', () => {
      const handleRemove = vi.fn();
      render(<Tag text="styled-x" isClicked={true} onRemove={handleRemove} />);

      const removeButton = screen.getByLabelText('태그 제거');
      expect(removeButton).toHaveClass(
        'ml-1',
        'cursor-pointer',
        'hover:opacity-110',
        'opacity-70',
        'transition-opacity',
      );
    });
  });

  describe('호버 스타일 테스트', () => {
    it('onClick이 있을 때 호버 스타일이 적용된다', () => {
      const handleClick = vi.fn();
      render(<Tag text="hoverable" onClick={handleClick} />);
      const tag = getParentElement(screen.getByText('#hoverable'));

      expect(tag).toHaveClass('hover:opacity-80', 'cursor-pointer');
    });

    it('onClick이 없을 때 호버 스타일이 적용되지 않는다', () => {
      render(<Tag text="non-hoverable" />);
      const tag = getParentElement(screen.getByText('#non-hoverable'));

      expect(tag).not.toHaveClass('hover:opacity-80', 'cursor-pointer');
    });
  });

  describe('전체 기능 통합 테스트', () => {
    it('모든 props가 함께 사용될 때 올바르게 작동한다', () => {
      const handleClick = vi.fn(); /* 태그 클릭 핸들러 모의 함수 */
      const handleRemove = vi.fn(); /* 태그 제거 핸들러 모의 함수 */

      render(
        <Tag
          text="full-featured" /* 태그 텍스트 */
          theme="dark" /* 다크 테마 적용 */
          isClicked={true} /* 클릭된 상태로 설정 */
          className="custom-style" /* 커스텀 CSS 클래스 */
          onClick={handleClick} /* 클릭 이벤트 핸들러 */
          onRemove={handleRemove} /* 제거 이벤트 핸들러 */
        />,
      );

      /* 메인 태그 버튼을 텍스트로 찾은 후 부모 요소 가져오기 */
      const tag = getParentElement(screen.getByText('#full-featured'));
      const removeButton = screen.getByLabelText('태그 제거'); /* X 아이콘 버튼 요소 */

      // 기본 속성 확인
      expect(tag.tagName).toBe('BUTTON');
      expect(tag).toHaveAttribute('data-theme', 'dark');
      expect(tag).toHaveClass('custom-style');
      expect(tag).toHaveAttribute('type', 'button');

      // 클릭된 상태 스타일 확인 (실제 컴포넌트의 CSS 변수와 일치하도록 수정)
      expect(tag).toHaveClass(
        'bg-[color:var(--color-secondary-clicked)]',
        'text-[color:var(--color-text-clicked)]',
      );

      // 호버 스타일 확인
      expect(tag).toHaveClass('hover:opacity-80', 'cursor-pointer');

      // X 아이콘 존재 확인
      expect(removeButton).toBeInTheDocument();

      // 태그 클릭 테스트 - null 체크를 통해 안전하게 접근
      if (tag) {
        fireEvent.click(tag);
        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleRemove).not.toHaveBeenCalled();
      }

      // X 아이콘 클릭 테스트
      fireEvent.click(removeButton);
      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledTimes(1); // 이전 호출에서 증가되지 않음
    });
  });

  describe('기본 스타일 클래스 정정 테스트', () => {
    it('기본 스타일 클래스들이 올바르게 적용된다 (inline-flex 포함)', () => {
      render(<Tag text="styled" />);
      const tag = getParentElement(screen.getByText('#styled'));
      expect(tag).toHaveClass(
        'inline-flex',
        'items-center',
        'gap-1',
        'rounded-full',
        'px-3',
        'py-1',
        'text-xs',
        'transition-all',
        'duration-200',
      );
    });
  });
});
