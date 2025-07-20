import React from 'react';

import { TagButton } from '@/components/ui/buttons/TagButton';
import { LoadMoreButton } from '@/components/ui/buttons/LoadMoreButton';
import { ClearFilterButton } from '@/components/ui/buttons/ClearFilterButton';
import { Heading } from '@/components/ui/typography';

export interface TagListProps {
  /**
   * 표시할 태그 목록
   */
  tags: string[];
  /**
   * 클릭된(선택된) 태그 목록
   */
  selectedTags?: string[];
  /**
   * 더보기 표시 여부
   * @default true
   */
  showMore?: boolean;
  /**
   * 모두지우기 표시 여부
   * @default true
   */
  showClearAll?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 태그 클릭 이벤트 핸들러
   */
  onTagClick?: (tag: string) => void;
  /**
   * 태그 제거 이벤트 핸들러
   */
  onTagRemove?: (tag: string) => void;
  /**
   * 더보기 클릭 이벤트 핸들러
   */
  onMoreClick?: () => void;
  /**
   * 모두지우기 클릭 이벤트 핸들러
   */
  onClearAll?: () => void;
}

/**
 * TagList 컴포넌트
 * 태그 목록과 선택된 태그를 표시하는 분자 컴포넌트
 */
export const TagList = ({
  tags,
  selectedTags = [],
  showMore = true,
  showClearAll = true,
  className = '',
  onTagClick,
  onTagRemove,
  onMoreClick,
  onClearAll,
}: TagListProps) => {
  // 기본 스타일
  // lg 이상에서는 246px 고정, lg 이하에서는 최대 768px 너비
  const baseStyles = 'w-full max-w-[768px] lg:w-[246px] lg:max-w-none p-3 rounded-lg';

  // 구분선 스타일
  const dividerStyles = 'border-[color:var(--color-text)] opacity-15';

  return (
    <div className={`${baseStyles} ${className}`}>
      {/* 상단 헤더 - 제목과 모두지우기 */}
      <div className="flex justify-between items-center mb-4">
        <Heading level={3} className="my-1 text-lg md:text-base font-bold">
          태그
        </Heading>

        {/* 모두지우기 링크 - 선택된 태그가 있을 때만 표시 */}
        {showClearAll && selectedTags.length > 0 && (
          <ClearFilterButton text="모두지우기" onClick={onClearAll} />
        )}
      </div>

      {/* 구분선 - 헤더 바로 아래 표시 */}
      <hr className={`border-t-[0.5px] ${dividerStyles} mb-5 mt-0`} />

      {/* 태그들 - 동적 flex 배치 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.length > 0 ? (
          tags.map(tag => {
            const isSelected = selectedTags.includes(tag);
            return (
              <TagButton
                key={tag}
                text={tag}
                isClicked={isSelected}
                onClick={() => onTagClick?.(tag)}
                onRemove={isSelected ? () => onTagRemove?.(tag) : undefined}
              />
            );
          })
        ) : (
          <div className="w-full text-center py-4">
            <div className="text-2xl mb-2">🏷️</div>
            <p className="text-sm text-[var(--color-text)] opacity-60">아직 태그가 없어요</p>
          </div>
        )}
      </div>

      {/* 더보기 링크 - 태그가 20개를 초과할 때만 표시 */}
      {showMore && tags.length > 20 && <LoadMoreButton text="+ 더보기" onClick={onMoreClick} />}
    </div>
  );
};

export default TagList;
