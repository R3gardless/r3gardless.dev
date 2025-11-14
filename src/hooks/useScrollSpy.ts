import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';

import { DEFAULT_HEADER_HEIGHT, SCROLL_OFFSET } from '@/constants';
import { TableOfContentsItem } from '@/types/blog';

interface HElementPositionRefType {
  id: string;
  top: number;
  bottom: number;
}

interface UseScrollSpyProps {
  items: TableOfContentsItem[];
  isEnabled?: boolean;
}

const useScrollSpy = ({ items, isEnabled = true }: UseScrollSpyProps) => {
  const [activeId, setActiveId] = useState('');
  const { scrollY } = useScroll();

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

  useMotionValueEvent(scrollY, 'change', latest => {
    if (!isEnabled || items.length === 0) return;

    const currentScroll = latest;
    const allIds = getAllIds(items);
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : DEFAULT_HEADER_HEIGHT;

    const currentPositions: HElementPositionRefType[] = [];

    allIds.forEach(id => {
      let element = document.querySelector(
        `h1[data-id="${id}"], h2[data-id="${id}"], h3[data-id="${id}"], h4[data-id="${id}"]`,
      ) as HTMLElement;

      if (!element) {
        element = document.getElementById(id) as HTMLElement;
      }

      if (!element) {
        element = document.querySelector(`[data-id="${id}"]`) as HTMLElement;
      }

      if (element) {
        let absoluteTop = 0;
        let currentElement: HTMLElement | null = element;

        while (currentElement) {
          absoluteTop += currentElement.offsetTop;
          currentElement = currentElement.offsetParent as HTMLElement;
        }

        const triggerPosition = absoluteTop - headerHeight - SCROLL_OFFSET;

        currentPositions.push({
          id,
          top: triggerPosition,
          bottom: Number.MAX_SAFE_INTEGER,
        });
      }
    });

    currentPositions.sort((a, b) => a.top - b.top);
    currentPositions.forEach((position, index) => {
      const nextPosition = currentPositions[index + 1];
      position.bottom = nextPosition ? nextPosition.top : Number.MAX_SAFE_INTEGER;
    });

    let newActiveId = '';

    for (const position of currentPositions) {
      if (currentScroll >= position.top && currentScroll < position.bottom) {
        newActiveId = position.id;
        break;
      }
    }

    if (!newActiveId && currentPositions.length > 0) {
      if (currentScroll < currentPositions[0].top) {
        newActiveId = currentPositions[0].id;
      } else {
        newActiveId = currentPositions[currentPositions.length - 1].id;
      }
    }

    if (activeId !== newActiveId) {
      setActiveId(newActiveId);
    }
  });

  return activeId;
};

export default useScrollSpy;
