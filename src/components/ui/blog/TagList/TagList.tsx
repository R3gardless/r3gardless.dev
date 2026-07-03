import React, { useState } from 'react';

import { ClearFilterButton } from '@/components/ui/buttons/ClearFilterButton';
import { LoadMoreButton } from '@/components/ui/buttons/LoadMoreButton';
import { TagButton } from '@/components/ui/buttons/TagButton';
import { Heading } from '@/components/ui/typography';
import { getBlogUiStrings } from '@/constants/i18n';

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
   * 초기에 보여줄 태그 개수
   * @default 20
   */
  initialDisplayCount?: number;
  /**
   * 더보기 클릭 시 추가로 보여줄 태그 개수
   * @default 10
   */
  loadMoreCount?: number;
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
  initialDisplayCount = 20,
  loadMoreCount = 10,
  showClearAll = true,
  className = '',
  onTagClick,
  onTagRemove,
  onMoreClick,
  onClearAll,
}: TagListProps) => {
  const strings = getBlogUiStrings();

  // 현재까지 표시할 태그 개수 상태 관리
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);

  // 표시할 태그 목록 결정
  const displayedTags = tags.slice(0, displayCount);

  // 더보기 버튼 표시 여부 (전체 태그 개수가 현재 표시 개수보다 많을 때만)
  const shouldShowMoreButton = showMore && tags.length > displayCount;

  // 더보기 클릭 핸들러
  const handleMoreClick = () => {
    const newDisplayCount = displayCount + loadMoreCount;
    setDisplayCount(newDisplayCount);
    onMoreClick?.();
  };
  // 기본 스타일
  // lg 이상에서는 15.375rem 고정, lg 이하에서는 최대 48rem 너비
  const baseStyles = 'w-full max-w-[48rem] lg:w-[15.375rem] lg:max-w-none p-3 rounded-lg';

  // 구분선 스타일
  const dividerStyles = 'border-[color:var(--color-text)] opacity-15';

  return (
    <div className={`${baseStyles} ${className}`}>
      {/* 상단 헤더 - 제목과 모두지우기 */}
      <div className="flex justify-between items-center mb-4">
        <Heading level={3} fontFamily="maruBuri" className="my-1 text-2xl md:text-xl font-bold">
          {strings.tagHeading}
        </Heading>

        {/* 모두지우기 링크 - 선택된 태그가 있을 때만 표시 */}
        {showClearAll && selectedTags.length > 0 && (
          <ClearFilterButton text={strings.clearAll} onClick={onClearAll} />
        )}
      </div>

      {/* 구분선 - 헤더 바로 아래 표시 */}
      <hr className={`border-t-[0.03125rem] ${dividerStyles} mb-5 mt-0`} />

      {/* 태그들 - 동적 flex 배치 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {displayedTags.length > 0 ? (
          displayedTags.map(tag => {
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
            <p className="text-sm text-[var(--color-text)] opacity-60">{strings.noTags}</p>
          </div>
        )}
      </div>

      {/* 더보기 링크 - 전체 태그가 현재 표시 개수보다 많을 때만 표시 */}
      {shouldShowMoreButton && (
        <LoadMoreButton
          text={strings.loadMore}
          className="font-maruBuri"
          onClick={handleMoreClick}
        />
      )}
    </div>
  );
};

export default TagList;
