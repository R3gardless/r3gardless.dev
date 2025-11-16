'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * ScrollToTop Component
 *
 * 페이지 경로가 변경될 때마다 스크롤을 맨 위로 이동시킵니다.
 * Next.js App Router에서 페이지 전환 시 스크롤이 유지되는 문제를 해결합니다.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 페이지 경로가 변경되면 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}
