import React from 'react';

import { Tag } from '../../atoms/Tag';
import { Button } from '../../atoms/Button';
import { Heading } from '../../atoms/Typography';

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
   * 테마 모드 (light, dark)
   * @default 'light'
   */
  theme?: 'light' | 'dark';
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
  theme = 'light',
  showMore = true,
  showClearAll = true,
  className = '',
  onTagClick,
  onTagRemove,
  onMoreClick,
  onClearAll,
}: TagListProps) => {
  // 기본 스타일
  const baseStyles = 'w-full min-w-[200px] max-w-[300px] p-4 rounded-lg';

  // 테마에 따른 배경색 - 피그마 디자인에 맞게 조정
  const themeStyles = 'bg-[color:var(--color-background)] text-[color:var(--color-text)]';
  // 구분선 스타일
  const dividerStyles = 'border-[color:var(--color-text)] opacity-70';

  return (
    <div className={`${baseStyles} ${themeStyles} ${className}`} data-theme={theme}>
      {/* 상단 헤더 - 제목과 모두지우기 */}
      <div className="flex justify-between items-center mb-4">
        <Heading level={3} theme={theme} className="my-1 text-lg md:text-base font-bold">
          태그
        </Heading>

        {/* 모두지우기 링크 - 선택된 태그가 있을 때만 표시 */}
        {showClearAll && selectedTags.length > 0 && (
          <Button
            variant="text"
            size="sm"
            onClick={onClearAll}
            className="p-0 h-auto text-xs font-bold hover:opacity-70"
          >
            모두지우기
          </Button>
        )}
      </div>

      {/* 구분선 - 헤더 바로 아래 표시 */}
      <hr className={`border-t-[0.5px] ${dividerStyles} mb-5 mt-0`} />

      {/* 태그들 - 동적 flex 배치 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map(tag => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Tag
              key={tag}
              text={tag}
              theme={theme}
              isClicked={isSelected}
              onClick={() => onTagClick?.(tag)}
              onRemove={isSelected ? () => onTagRemove?.(tag) : undefined}
            />
          );
        })}
      </div>

      {/* 더보기 링크 */}
      {showMore && (
        <Button
          variant="text"
          size="sm"
          onClick={onMoreClick}
          className="p-0 h-auto text-sm font-bold hover:opacity-70"
        >
          + 더보기
        </Button>
      )}
    </div>
  );
};

export default TagList;
