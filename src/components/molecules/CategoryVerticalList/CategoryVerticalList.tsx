import React from 'react';

import { Button } from '../../atoms/Button';
import { Heading } from '../../atoms/Typography';

export interface CategoryVerticalListProps {
  /**
   * 표시할 카테고리 목록
   */
  categories: string[];
  /**
   * 선택된 카테고리
   * 제공되지 않으면 선택된 카테고리가 없음
   */
  selectedCategory?: string;
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
   * 추가 클래스명
   */
  className?: string;
  /**
   * 카테고리 클릭 이벤트 핸들러
   */
  onCategoryClick?: (category: string) => void;
  /**
   * 더보기 클릭 이벤트 핸들러
   */
  onMoreClick?: () => void;
}

/**
 * CategoryVerticalList 컴포넌트
 * 카테고리 목록을 세로로 표시하는 분자 컴포넌트
 */
export const CategoryVerticalList = ({
  categories,
  selectedCategory,
  theme = 'light',
  showMore = true,
  className = '',
  onCategoryClick,
  onMoreClick,
}: CategoryVerticalListProps) => {
  // 기본 스타일
  // lg 이상에서는 246px 고정, lg 이하에서는 100% 너비
  const baseStyles = 'w-full lg:w-[246px] p-3 rounded-lg';

  // 테마에 따른 배경색 - CSS 변수 사용
  const themeStyles = 'bg-[color:var(--color-background)] text-[color:var(--color-text)]';

  // 구분선 스타일
  const dividerStyles = 'border-[color:var(--color-text)] opacity-70';

  return (
    <div className={`${baseStyles} ${themeStyles} ${className}`} data-theme={theme}>
      {/* 상단 헤더 - 제목 */}
      <div className="flex justify-between items-center mb-4">
        <Heading level={3} theme={theme} className="my-1 text-lg md:text-base font-bold">
          카테고리
        </Heading>
      </div>

      {/* 구분선 - 헤더 바로 아래 표시 */}
      <hr className={`border-t-[0.5px] ${dividerStyles} mb-5 mt-0`} />

      {/* 카테고리 목록 */}
      <div className="flex flex-col space-y-1 mb-3">
        {categories.map(category => {
          const isSelected = selectedCategory === category;

          return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div
              key={category}
              role="button"
              tabIndex={isSelected ? -1 : 0}
              onClick={() => onCategoryClick?.(category)}
              className={`
                px-2.5 py-1.5 text-left text-sm rounded w-full cursor-pointer
                transition-all duration-200 flex items-center
                ${
                  isSelected
                    ? 'bg-[color:var(--color-primary)] text-[color:var(--color-text)] font-bold'
                    : 'bg-transparent text-[color:var(--color-text)] font-normal hover:bg-[color:var(--color-primary)] hover:bg-opacity-50'
                }
              `}
            >
              {category}
            </div>
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

export default CategoryVerticalList;
