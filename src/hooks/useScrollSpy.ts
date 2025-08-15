import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

import { TableOfContentsItem } from '@/types/blog';

interface HElementPositionRefType {
  id: string;
  top: number;
}

interface UseScrollSpyProps {
  items: TableOfContentsItem[];
  isEnabled?: boolean;
}

const useScrollSpy = ({ items, isEnabled = true }: UseScrollSpyProps) => {
  const hElementPositions = useRef<HElementPositionRefType[]>([]);
  const [activeId, setActiveId] = useState('');
  const { scrollY } = useScroll();

  // 초기 위치 계산 (한 번만)
  useEffect(() => {
    if (!isEnabled || items.length === 0) return;

    const getAllIds = (items: TableOfContentsItem[]): string[] => {
      let ids: string[] = [];
      items.forEach(item => {
        ids.push(item.id);
        if (item.children) {
          ids = ids.concat(getAllIds(item.children));
        }
      });
      return ids;
    };

    const calculatePositions = () => {
      const allIds = getAllIds(items);
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 100;

      const positions: HElementPositionRefType[] = allIds
        .map(id => {
          // 1. data-id가 있는 h1, h2, h3, h4 헤딩 요소만 찾기
          let element = document.querySelector(
            `h1[data-id="${id}"], h2[data-id="${id}"], h3[data-id="${id}"], h4[data-id="${id}"]`,
          ) as HTMLElement;

          // 2. 헤딩을 못 찾으면 일반적인 방법으로 찾기
          if (!element) {
            element = document.getElementById(id) as HTMLElement;
          }

          // 3. 그래도 못 찾으면 data-id로 다시 찾기
          if (!element) {
            element = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
          }

          if (element) {
            // 헤더와 가까운 섹션이 강조되도록 오프셋을 크게 설정 (헤더 높이 + 400px)
            const calculatedTop = element.offsetTop - headerHeight + 400;
            return {
              id,
              top: calculatedTop,
            };
          }
          return null;
        })
        .filter((item): item is HElementPositionRefType => item !== null)
        .sort((a, b) => a.top - b.top);

      hElementPositions.current = positions;
    };

    // DOM이 충분히 준비된 후 위치 계산 + 요소 존재 확인
    const tryCalculatePositions = () => {
      const allIds = getAllIds(items);

      // 첫 번째 요소가 존재하는지 확인
      const firstElement =
        document.getElementById(allIds[0]) || document.querySelector(`[data-id="${allIds[0]}"]`);

      if (!firstElement) {
        // 요소가 없으면 좀 더 기다렸다가 재시도
        setTimeout(tryCalculatePositions, 500);
        return;
      }

      calculatePositions();
    };

    // 다양한 시점에서 계산 시도
    const timer1 = setTimeout(tryCalculatePositions, 100);
    const timer2 = setTimeout(tryCalculatePositions, 1000);
    const timer3 = setTimeout(tryCalculatePositions, 2000);

    // 추가로 윈도우 로드 이벤트에서도 한 번 더 계산
    const handleLoad = () => {
      setTimeout(tryCalculatePositions, 500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('load', handleLoad);
    };
  }, [items, isEnabled]);

  useMotionValueEvent(scrollY, 'change', latest => {
    if (!isEnabled || hElementPositions.current.length === 0) return;

    let headingId = hElementPositions.current[0].id; // 기본값을 첫 번째 요소로

    // 현재 스크롤 위치에 가장 가까운 섹션 찾기
    for (let i = hElementPositions.current.length - 1; i >= 0; i--) {
      const position = hElementPositions.current[i];

      if (latest >= position.top) {
        headingId = position.id;
        break;
      }
    }

    if (activeId !== headingId) {
      setActiveId(headingId);
    }
  });

  return activeId;
};

export default useScrollSpy;
