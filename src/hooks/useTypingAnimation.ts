'use client';

import { useEffect, useState } from 'react';

interface UseTypingAnimationOptions {
  /** 타이핑 속도 (ms per character) */
  speed?: number;
  /** 시작 지연 시간 (ms) */
  delay?: number;
  /** 애니메이션 활성화 여부 */
  enabled?: boolean;
}

/**
 * 타이핑 애니메이션 효과를 제공하는 훅
 * 책에 글을 쓰는 듯한 느낌을 연출
 */
export function useTypingAnimation(
  text: string,
  options: UseTypingAnimationOptions = {},
): { displayedText: string; isComplete: boolean } {
  const { speed = 30, delay = 0, enabled = true } = options;
  const [displayedText, setDisplayedText] = useState(enabled ? '' : text);
  const [isComplete, setIsComplete] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isCancelled = false;

    const startTimeout = setTimeout(() => {
      // cleanup이 이미 호출되었으면 interval 시작하지 않음
      if (isCancelled) return;

      let currentIndex = 0;

      intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          setIsComplete(true);
        }
      }, speed);
    }, delay);

    return () => {
      isCancelled = true;
      clearTimeout(startTimeout);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [text, speed, delay, enabled]);

  return { displayedText, isComplete };
}
