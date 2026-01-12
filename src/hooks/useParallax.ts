'use client';

import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, RefObject } from 'react';

type ScrollOffset = 'start' | 'end' | 'center' | `${number}`;
type OffsetValue = `${ScrollOffset} ${ScrollOffset}`;

export interface UseParallaxOptions {
  /**
   * 패럴랙스 속도 배율 (양수: 아래로, 음수: 위로)
   * 기본값: 0.5
   */
  speed?: number;
  /**
   * 스크롤 범위 시작점 ('start start', 'start end' 등)
   * 기본값: 'start end'
   */
  offsetStart?: OffsetValue;
  /**
   * 스크롤 범위 끝점
   * 기본값: 'end start'
   */
  offsetEnd?: OffsetValue;
}

export interface UseParallaxReturn<T extends HTMLElement> {
  ref: RefObject<T | null>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
}

/**
 * 패럴랙스 스크롤 효과를 위한 커스텀 훅
 *
 * @example
 * ```tsx
 * const { ref, y, opacity } = useParallax<HTMLDivElement>({ speed: 0.3 });
 *
 * return (
 *   <motion.div ref={ref} style={{ y, opacity }}>
 *     콘텐츠
 *   </motion.div>
 * );
 * ```
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: UseParallaxOptions = {},
): UseParallaxReturn<T> {
  const {
    speed = 0.5,
    offsetStart = 'start end' as OffsetValue,
    offsetEnd = 'end start' as OffsetValue,
  } = options;

  const ref = useRef<T>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [offsetStart, offsetEnd],
  });

  // Y축 이동 (속도에 따른 패럴랙스)
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  // 불투명도 (중앙에서 가장 진하게)
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  // 스케일 (미세한 확대/축소)
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return { ref, y, opacity, scale, scrollYProgress };
}

/**
 * 배경 레이어용 패럴랙스 (느리게 움직임)
 */
export function useBackgroundParallax<T extends HTMLElement = HTMLDivElement>() {
  return useParallax<T>({ speed: 0.2 });
}

/**
 * 전경 레이어용 패럴랙스 (빠르게 움직임)
 */
export function useForegroundParallax<T extends HTMLElement = HTMLDivElement>() {
  return useParallax<T>({ speed: -0.3 });
}

/**
 * 부드러운 페이드인 패럴랙스
 */
export function useFadeParallax<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return { ref, y, opacity, scale, scrollYProgress };
}
