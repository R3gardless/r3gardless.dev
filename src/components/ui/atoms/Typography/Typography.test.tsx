import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Heading, Text, Caption, Italic, DateText } from './Typography';

describe('Typography Components', () => {
  describe('Heading', () => {
    it('기본 H1 제목이 렌더링된다', () => {
      render(<Heading>테스트 제목</Heading>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('테스트 제목');
    });

    it('레벨 2 제목이 올바르게 렌더링된다', () => {
      render(<Heading level={2}>H2 제목</Heading>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('H2 제목');
    });

    it('레벨 3 제목이 올바르게 렌더링된다', () => {
      render(<Heading level={3}>H3 제목</Heading>);
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('H3 제목');
    });

    it('기본 스타일 클래스들이 적용된다', () => {
      render(<Heading>스타일 테스트</Heading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('font-pretendard', 'font-bold', 'leading-tight', 'text-2xl');
    });

    it('레벨별 폰트 크기가 올바르게 적용된다', () => {
      const { rerender } = render(<Heading level={1}>H1</Heading>);
      let heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-2xl');

      rerender(<Heading level={2}>H2</Heading>);
      heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-xl');

      rerender(<Heading level={3}>H3</Heading>);
      heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-lg');
    });

    it('커스텀 클래스명이 적용된다', () => {
      render(<Heading className="custom-heading">커스텀 제목</Heading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('custom-heading');
    });

    it('CSS 변수를 사용한 텍스트 색상이 적용된다', () => {
      render(<Heading>색상 테스트</Heading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-[color:var(--color-text)]');
    });
  });

  describe('Text', () => {
    it('기본 텍스트가 렌더링된다', () => {
      render(<Text>본문 텍스트</Text>);
      const text = screen.getByText('본문 텍스트');
      expect(text).toBeInTheDocument();
      expect(text.tagName).toBe('P');
    });

    it('기본 스타일 클래스들이 적용된다', () => {
      render(<Text>스타일 테스트</Text>);
      const text = screen.getByText('스타일 테스트');
      expect(text).toHaveClass('font-pretendard', 'font-normal', 'text-base', 'leading-tight');
    });

    it('커스텀 클래스명이 적용된다', () => {
      render(<Text className="custom-text">커스텀 텍스트</Text>);
      const text = screen.getByText('커스텀 텍스트');
      expect(text).toHaveClass('custom-text');
    });
  });

  describe('Caption', () => {
    it('기본 캡션이 렌더링된다', () => {
      render(<Caption>캡션 텍스트</Caption>);
      const caption = screen.getByText('캡션 텍스트');
      expect(caption).toBeInTheDocument();
      expect(caption.tagName).toBe('P');
    });

    it('작은 텍스트 크기가 적용된다', () => {
      render(<Caption>작은 텍스트</Caption>);
      const caption = screen.getByText('작은 텍스트');
      expect(caption).toHaveClass('font-pretendard', 'font-normal', 'text-sm', 'leading-tight');
    });

    it('커스텀 클래스명이 적용된다', () => {
      render(<Caption className="custom-caption">커스텀 캡션</Caption>);
      const caption = screen.getByText('커스텀 캡션');
      expect(caption).toHaveClass('custom-caption');
    });
  });

  describe('Italic', () => {
    it('기본 이탤릭 텍스트가 렌더링된다', () => {
      render(<Italic>이탤릭 텍스트</Italic>);
      const italic = screen.getByText('이탤릭 텍스트');
      expect(italic).toBeInTheDocument();
      expect(italic.tagName).toBe('P');
    });

    it('이탤릭 스타일이 적용된다', () => {
      render(<Italic>이탤릭 스타일</Italic>);
      const italic = screen.getByText('이탤릭 스타일');
      expect(italic).toHaveClass(
        'font-pretendard',
        'font-normal',
        'text-sm',
        'italic',
        'leading-tight',
      );
    });

    it('커스텀 클래스명이 적용된다', () => {
      render(<Italic className="custom-italic">커스텀 이탤릭</Italic>);
      const italic = screen.getByText('커스텀 이탤릭');
      expect(italic).toHaveClass('custom-italic');
    });
  });

  describe('DateText', () => {
    it('기본 날짜가 렌더링된다', () => {
      render(<DateText>2024-01-01</DateText>);
      const date = screen.getByText('2024-01-01');
      expect(date).toBeInTheDocument();
      expect(date.tagName).toBe('TIME');
    });

    it('MaruBuri 폰트가 적용된다', () => {
      render(<DateText>2024-01-01</DateText>);
      const date = screen.getByText('2024-01-01');
      expect(date).toHaveClass('font-maruBuri', 'font-normal', 'text-sm', 'leading-normal');
    });

    it('커스텀 클래스명이 적용된다', () => {
      render(<DateText className="custom-date">2024-01-01</DateText>);
      const date = screen.getByText('2024-01-01');
      expect(date).toHaveClass('custom-date');
    });

    it('복잡한 날짜 형식도 올바르게 렌더링된다', () => {
      render(<DateText>2024년 6월 2일</DateText>);
      const date = screen.getByText('2024년 6월 2일');
      expect(date).toBeInTheDocument();
    });
  });

  describe('공통 테스트', () => {
    it('모든 컴포넌트가 CSS 변수를 사용한 텍스트 색상을 적용한다', () => {
      render(
        <div>
          <Heading>제목</Heading>
          <Text>본문</Text>
          <Caption>캡션</Caption>
          <Italic>이탤릭</Italic>
          <DateText>날짜</DateText>
        </div>,
      );

      const heading = screen.getByRole('heading');
      const text = screen.getByText('본문');
      const caption = screen.getByText('캡션');
      const italic = screen.getByText('이탤릭');
      const date = screen.getByText('날짜');

      [heading, text, caption, italic, date].forEach(element => {
        expect(element).toHaveClass('text-[color:var(--color-text)]');
      });
    });
  });
});
