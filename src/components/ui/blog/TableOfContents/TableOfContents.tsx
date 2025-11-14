'use client';

import { MessagesSquare, Undo2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import useScrollSpy from '@/hooks/useScrollSpy';
import { TableOfContentsItem } from '@/types/blog';

import { Heading } from '../../typography';

export interface TableOfContentsProps {
  items: TableOfContentsItem[];
  activeId?: string;
  className?: string;
  onCommentClick?: () => void;
}

export function TableOfContents({
  items,
  activeId,
  className = '',
  onCommentClick,
}: TableOfContentsProps) {
  // framer-motion 기반 스크롤 추적
  const currentActiveId = useScrollSpy({ items });

  const renderItem = (item: TableOfContentsItem) => {
    // 스크롤 기반 activeId 우선, 없으면 props로 받은 activeId 사용
    const effectiveActiveId = currentActiveId || activeId || '';
    const isActive = effectiveActiveId === item.id;

    // 레벨별 스타일링
    const getItemStyles = (level: 1 | 2 | 3, isActive: boolean) => {
      const baseStyles =
        'mb-2 block cursor-pointer transition-colors duration-200 opacity-80 hover:opacity-100 focus:outline-none focus-visible:outline-none w-full text-left truncate break-words';

      // 활성 상태일 때 font-bold와 opacity-100 적용
      const fontWeight = isActive ? 'font-bold opacity-100' : 'xl:font-light xl:dark:font-light';

      switch (level) {
        case 1:
          return `${baseStyles} ${fontWeight}`;
        case 2:
          return `${baseStyles} ${fontWeight} pl-4 text-sm`;
        case 3:
          return `${baseStyles} ${fontWeight} pl-8 text-sm`;
        default:
          return baseStyles;
      }
    };

    return (
      <div key={item.id}>
        <a href={`#${item.id}`} className={getItemStyles(item.level, isActive)} title={item.title}>
          {item.title}
        </a>
        {item.children?.map(renderItem)}
      </div>
    );
  };

  // 반응형 구조 (모바일/데스크톱 통합)
  return (
    <aside
      className={`
        w-full xl:w-[256px]
        xl:pl-4 py-4
        ${className}
      `}
    >
      <Heading level={3} fontFamily="maruBuri" className="mb-6">
        Contents
      </Heading>

      {/* xl 이하에서만 hr 표시 */}
      <hr className="border-2 border-[var(--color-text)] mb-6 xl:hidden" />

      <nav className="space-y-2 pl-2">{items.map(renderItem)}</nav>

      {/* xl 이상에서만 아이콘 표시 */}
      <div className="hidden xl:flex justify-center items-center gap-10">
        <Link
          href="/blog"
          className="p-1 text-[var(--color-text)] hover:opacity-70 transition-opacity cursor-pointer focus:outline-none focus-visible:outline-none"
          title="back"
        >
          <Undo2 size={24} />
        </Link>

        <button
          onClick={onCommentClick}
          className="p-1 text-[var(--color-text)] hover:opacity-70 transition-opacity cursor-pointer focus:outline-none focus-visible:outline-none"
          title="comments"
        >
          <MessagesSquare size={24} />
        </button>
      </div>
    </aside>
  );
}
