import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Heading, Text } from './Typography';

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
      expect(heading).toHaveClass('font-pretendard', 'font-bold', 'text-4xl');
    });

    it('레벨별 폰트 크기가 올바르게 적용된다', () => {
      const { rerender } = render(<Heading level={1}>H1</Heading>);
      let heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-4xl');

      rerender(<Heading level={2}>H2</Heading>);
      heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-3xl');

      rerender(<Heading level={3}>H3</Heading>);
      heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-2xl');

      rerender(<Heading level={4}>H4</Heading>);
      heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-xl');

      rerender(<Heading level={5}>H5</Heading>);
      heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-lg');
    });

    it('커스텀 클래스명이 적용된다', () => {
      render(<Heading className="custom-heading">커스텀 제목</Heading>);
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('custom-heading');
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
      expect(text).toHaveClass('font-pretendard');
    });

    it('커스텀 클래스명이 적용된다', () => {
      render(<Text className="custom-text">커스텀 텍스트</Text>);
      const text = screen.getByText('커스텀 텍스트');
      expect(text).toHaveClass('custom-text');
    });
  });
});
