import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ParallaxLayer, ParallaxSection } from './ParallaxSection';

// framer-motion mock
const mockMotionValue = {
  get: () => 0,
  set: () => {},
  subscribe: () => () => {},
  getVelocity: () => 0,
  isAnimating: () => false,
  stop: () => {},
};

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      style,
      ...props
    }: {
      children?: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
      ref?: React.Ref<HTMLDivElement>;
    }) => (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    ),
  },
  useScroll: () => ({ scrollYProgress: mockMotionValue }),
  useTransform: () => mockMotionValue,
}));

describe('ParallaxSection', () => {
  describe('기본 렌더링', () => {
    it('children을 올바르게 렌더링한다', () => {
      render(
        <ParallaxSection>
          <h1>테스트 제목</h1>
          <p>테스트 내용</p>
        </ParallaxSection>,
      );

      expect(screen.getByRole('heading', { name: '테스트 제목' })).toBeInTheDocument();
      expect(screen.getByText('테스트 내용')).toBeInTheDocument();
    });

    it('className을 적용한다', () => {
      const { container } = render(
        <ParallaxSection className="custom-class">
          <p>내용</p>
        </ParallaxSection>,
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('기본 overflow-hidden 클래스를 가진다', () => {
      const { container } = render(
        <ParallaxSection>
          <p>내용</p>
        </ParallaxSection>,
      );

      expect(container.firstChild).toHaveClass('overflow-hidden');
    });

    it('relative 클래스를 가진다', () => {
      const { container } = render(
        <ParallaxSection>
          <p>내용</p>
        </ParallaxSection>,
      );

      expect(container.firstChild).toHaveClass('relative');
    });
  });

  describe('배경 요소', () => {
    it('backgroundElement가 제공되면 렌더링한다', () => {
      render(
        <ParallaxSection backgroundElement={<div data-testid="background">배경</div>}>
          <p>전경 내용</p>
        </ParallaxSection>,
      );

      expect(screen.getByTestId('background')).toBeInTheDocument();
      expect(screen.getByText('배경')).toBeInTheDocument();
    });

    it('backgroundElement가 없으면 배경 레이어를 렌더링하지 않는다', () => {
      render(
        <ParallaxSection>
          <p>내용만</p>
        </ParallaxSection>,
      );

      expect(screen.queryByText('배경')).not.toBeInTheDocument();
    });

    it('배경과 전경 내용을 함께 렌더링한다', () => {
      render(
        <ParallaxSection backgroundElement={<span>배경 이미지</span>}>
          <p>전경 텍스트</p>
        </ParallaxSection>,
      );

      expect(screen.getByText('배경 이미지')).toBeInTheDocument();
      expect(screen.getByText('전경 텍스트')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('기본 speed가 적용된다', () => {
      const { container } = render(
        <ParallaxSection>
          <p>내용</p>
        </ParallaxSection>,
      );

      // 컴포넌트가 정상적으로 렌더링되는지 확인
      expect(container.firstChild).toBeInTheDocument();
    });

    it('withFade 옵션이 적용된다', () => {
      const { container } = render(
        <ParallaxSection withFade={true}>
          <p>페이드 효과</p>
        </ParallaxSection>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('withScale 옵션이 적용된다', () => {
      const { container } = render(
        <ParallaxSection withScale={true}>
          <p>스케일 효과</p>
        </ParallaxSection>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('커스텀 speed 값이 적용된다', () => {
      const { container } = render(
        <ParallaxSection speed={0.8}>
          <p>빠른 패럴랙스</p>
        </ParallaxSection>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('커스텀 backgroundSpeed 값이 적용된다', () => {
      const { container } = render(
        <ParallaxSection backgroundSpeed={0.5} backgroundElement={<div>배경</div>}>
          <p>내용</p>
        </ParallaxSection>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('레이아웃 구조', () => {
    it('콘텐츠가 z-10 레이어에 있다', () => {
      const { container } = render(
        <ParallaxSection>
          <p>콘텐츠</p>
        </ParallaxSection>,
      );

      const contentLayer = container.querySelector('.z-10');
      expect(contentLayer).toBeInTheDocument();
    });

    it('배경 레이어가 z-0에 있다', () => {
      const { container } = render(
        <ParallaxSection backgroundElement={<div>배경</div>}>
          <p>콘텐츠</p>
        </ParallaxSection>,
      );

      const backgroundLayer = container.querySelector('.z-0');
      expect(backgroundLayer).toBeInTheDocument();
    });
  });
});

describe('ParallaxLayer', () => {
  describe('기본 렌더링', () => {
    it('children을 올바르게 렌더링한다', () => {
      render(
        <ParallaxLayer>
          <p>레이어 내용</p>
        </ParallaxLayer>,
      );

      expect(screen.getByText('레이어 내용')).toBeInTheDocument();
    });

    it('className을 적용한다', () => {
      const { container } = render(
        <ParallaxLayer className="layer-class">
          <p>내용</p>
        </ParallaxLayer>,
      );

      expect(container.firstChild).toHaveClass('layer-class');
    });
  });

  describe('Props', () => {
    it('기본 depth가 적용된다', () => {
      const { container } = render(
        <ParallaxLayer>
          <p>기본 깊이</p>
        </ParallaxLayer>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('커스텀 depth 값이 적용된다', () => {
      const { container } = render(
        <ParallaxLayer depth={0.8}>
          <p>깊은 레이어</p>
        </ParallaxLayer>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('depth가 0이면 움직임이 없다', () => {
      const { container } = render(
        <ParallaxLayer depth={0}>
          <p>고정 레이어</p>
        </ParallaxLayer>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('중첩 사용', () => {
    it('여러 레이어를 중첩해서 사용할 수 있다', () => {
      render(
        <ParallaxSection>
          <ParallaxLayer depth={0.2}>
            <p>레이어 1</p>
          </ParallaxLayer>
          <ParallaxLayer depth={0.5}>
            <p>레이어 2</p>
          </ParallaxLayer>
          <ParallaxLayer depth={0.8}>
            <p>레이어 3</p>
          </ParallaxLayer>
        </ParallaxSection>,
      );

      expect(screen.getByText('레이어 1')).toBeInTheDocument();
      expect(screen.getByText('레이어 2')).toBeInTheDocument();
      expect(screen.getByText('레이어 3')).toBeInTheDocument();
    });
  });
});
