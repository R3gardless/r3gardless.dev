'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef, ReactNode } from 'react';

export interface ParallaxSectionProps {
  children: ReactNode;
  /**
   * 패럴랙스 속도 (-1 ~ 1)
   * 양수: 스크롤보다 느리게 (배경 효과)
   * 음수: 스크롤보다 빠르게 (전경 효과)
   */
  speed?: number;
  /**
   * 추가 CSS 클래스
   */
  className?: string;
  /**
   * 페이드 효과 적용 여부
   */
  withFade?: boolean;
  /**
   * 스케일 효과 적용 여부
   */
  withScale?: boolean;
  /**
   * 배경 레이어 (패럴랙스 적용)
   */
  backgroundElement?: ReactNode;
  /**
   * 배경 속도 (기본값: 0.3)
   */
  backgroundSpeed?: number;
}

/**
 * 패럴랙스 스크롤 효과가 적용된 섹션 컴포넌트
 *
 * @example
 * ```tsx
 * <ParallaxSection speed={0.5} withFade>
 *   <h2>섹션 제목</h2>
 *   <p>섹션 내용</p>
 * </ParallaxSection>
 * ```
 */
export function ParallaxSection({
  children,
  speed = 0.3,
  className = '',
  withFade = true,
  withScale = false,
  backgroundElement,
  backgroundSpeed = 0.15,
}: ParallaxSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // 콘텐츠 패럴랙스
  const contentY = useTransform(scrollYProgress, [0, 1], [speed * 80, speed * -80]);

  // 배경 패럴랙스 (더 느리게)
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    [backgroundSpeed * 100, backgroundSpeed * -100],
  );

  // 페이드 효과
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    withFade ? [0.2, 1, 1, 0.2] : [1, 1, 1, 1],
  );

  // 스케일 효과
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], withScale ? [0.92, 1, 0.92] : [1, 1, 1]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* 배경 레이어 (더 느린 패럴랙스) */}
      {backgroundElement && (
        <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: backgroundY }}>
          {backgroundElement}
        </motion.div>
      )}

      {/* 콘텐츠 레이어 */}
      <motion.div className="relative z-10" style={{ y: contentY, opacity, scale }}>
        {children}
      </motion.div>
    </div>
  );
}

/**
 * 다층 패럴랙스 효과를 위한 레이어 컴포넌트
 */
export interface ParallaxLayerProps {
  children: ReactNode;
  /**
   * 레이어 깊이 (0: 가장 앞, 1: 가장 뒤)
   */
  depth?: number;
  className?: string;
}

export function ParallaxLayer({ children, depth = 0.5, className = '' }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 깊이에 따른 이동 거리 (깊을수록 느리게)
  const y = useTransform(scrollYProgress, [0, 1], [depth * 50, depth * -50]);

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

export default ParallaxSection;
