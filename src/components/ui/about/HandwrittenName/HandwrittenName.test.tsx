import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HandwrittenName } from './HandwrittenName';

// framer-motion mock
vi.mock('framer-motion', () => ({
  motion: {
    path: ({
      d,
      fill,
      stroke,
      strokeWidth,
      ...props
    }: {
      d: string;
      fill?: string;
      stroke?: string;
      strokeWidth?: string;
      initial?: object;
      animate?: object;
      transition?: object;
    }) => <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} {...props} />,
  },
  useInView: () => true,
}));

describe('HandwrittenName', () => {
  describe('기본 렌더링', () => {
    it('SVG 요소를 렌더링한다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      expect(svg).toBeInTheDocument();
      expect(svg.tagName.toLowerCase()).toBe('svg');
    });

    it('올바른 aria-label을 가진다', () => {
      render(<HandwrittenName />);

      expect(screen.getByLabelText('YoungUk Song')).toBeInTheDocument();
    });

    it('올바른 viewBox를 가진다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      expect(svg).toHaveAttribute('viewBox', '0 0 209 41');
    });
  });

  describe('스타일링', () => {
    it('기본 클래스가 적용된다', () => {
      const { container } = render(<HandwrittenName />);

      expect(container.firstChild).toHaveClass('relative', 'inline-block');
    });

    it('className prop이 적용된다', () => {
      const { container } = render(<HandwrittenName className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('추가 className이 기본 클래스와 함께 적용된다', () => {
      const { container } = render(<HandwrittenName className="mt-4" />);

      expect(container.firstChild).toHaveClass('relative', 'inline-block', 'mt-4');
    });
  });

  describe('SVG 구조', () => {
    it('stroke path들을 렌더링한다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      const paths = svg.querySelectorAll('path');

      // 11개의 서명 path * 2 (stroke + fill) = 22개
      expect(paths.length).toBe(22);
    });

    it('stroke path가 올바른 속성을 가진다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      // stroke="var(--color-text)"를 가진 path만 선택
      const strokePaths = svg.querySelectorAll('path[stroke="var(--color-text)"]');

      expect(strokePaths.length).toBe(11);
      strokePaths.forEach(path => {
        expect(path).toHaveAttribute('stroke', 'var(--color-text)');
        expect(path).toHaveAttribute('stroke-width', '0.8');
      });
    });

    it('fill path가 올바른 속성을 가진다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      const fillPaths = svg.querySelectorAll('path[fill="var(--color-text)"]');

      expect(fillPaths.length).toBeGreaterThan(0);
    });
  });

  describe('반응형 스타일', () => {
    it('SVG가 반응형 width 클래스를 가진다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      expect(svg).toHaveClass('w-[180px]', 'md:w-[250px]');
    });

    it('SVG가 auto height를 가진다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      expect(svg).toHaveClass('h-auto');
    });
  });

  describe('접근성', () => {
    it('aria-label이 있다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      expect(svg).toHaveAttribute('aria-label', 'YoungUk Song');
    });

    it('스크린 리더에서 접근 가능하다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      expect(svg.tagName.toLowerCase()).toBe('svg');
    });
  });
});

describe('HandwrittenName 애니메이션', () => {
  describe('useInView 연동', () => {
    it('view에 들어오면 애니메이션이 시작된다', () => {
      // useInView가 true를 반환하도록 mock되어 있음
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('path 순서', () => {
    it('11개의 서명 세그먼트가 있다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      const strokePaths = svg.querySelectorAll('path[stroke="var(--color-text)"]');

      expect(strokePaths.length).toBe(11);
    });

    it('각 세그먼트에 대해 stroke와 fill 레이어가 있다', () => {
      render(<HandwrittenName />);

      const svg = screen.getByLabelText('YoungUk Song');
      const allPaths = svg.querySelectorAll('path');

      // 11 stroke + 11 fill = 22
      expect(allPaths.length).toBe(22);
    });
  });
});
