'use client';

import React, { useState } from 'react';

import { LoadMoreButton } from '@/components/ui/buttons/LoadMoreButton';
import { Heading } from '@/components/ui/typography';
import { getBlogUiStrings } from '@/constants/i18n';
import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang } from '@/types/blog';
import type { SeriesSummary } from '@/utils/blog';

export interface SeriesListProps {
  /**
   * 표시할 시리즈 목록 (이름과 포스트 개수)
   */
  series: SeriesSummary[];
  /**
   * 선택된 시리즈 이름
   */
  selectedSeries?: string;
  /**
   * 렌더링 언어 (섹션 제목 분기)
   */
  lang?: PostLang;
  /**
   * 더보기 표시 여부
   * @default true
   */
  showMore?: boolean;
  /**
   * 초기에 보여줄 시리즈 개수
   * @default 5
   */
  initialDisplayCount?: number;
  /**
   * 더보기 클릭 시 추가로 보여줄 시리즈 개수
   * @default 5
   */
  loadMoreCount?: number;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 시리즈 클릭 이벤트 핸들러 (선택된 시리즈를 다시 클릭하면 해제)
   */
  onSeriesClick?: (seriesName: string) => void;
}

/**
 * SeriesList 컴포넌트
 * 블로그 사이드바에서 시리즈(글 묶음) 목록을 표시하는 분자 컴포넌트.
 * CategoryList vertical 레이아웃과 같은 톤으로, 시리즈 이름과 포스트 개수를 보여줍니다.
 * 카테고리와 달리 "전체" 항목이 없으므로 선택된 시리즈를 다시 클릭해 해제할 수 있습니다.
 */
export const SeriesList = ({
  series,
  selectedSeries,
  lang = DEFAULT_POST_LANG,
  showMore = true,
  initialDisplayCount = 5,
  loadMoreCount = 5,
  className = '',
  onSeriesClick,
}: SeriesListProps) => {
  const strings = getBlogUiStrings(lang);
  const [displayCount, setDisplayCount] = useState(initialDisplayCount);

  // 표시할 시리즈가 없으면 섹션 자체를 렌더링하지 않는다
  if (series.length === 0) {
    return null;
  }

  // CategoryList vertical과 동일한 컨테이너/구분선 스타일
  const containerStyles = 'w-full max-w-[48rem] lg:w-[15.375rem] lg:max-w-none p-3 rounded-lg';
  const dividerStyles = 'border-[color:var(--color-text)] opacity-15';

  const displayedSeries = series.slice(0, displayCount);
  const shouldShowMoreButton = showMore && series.length > displayCount;

  return (
    <div className={`${containerStyles} ${className}`}>
      {/* 상단 헤더 - 제목 */}
      <div className="flex justify-between items-center mb-4">
        <Heading level={3} fontFamily="maruBuri" className="my-1 text-2xl md:text-xl font-bold">
          {strings.seriesHeading}
        </Heading>
      </div>

      {/* 구분선 - 헤더 바로 아래 표시 */}
      <hr className={`border-t-[0.03125rem] ${dividerStyles} mb-5 mt-0`} />

      {/* 시리즈 목록 */}
      <div className="flex flex-col space-y-1 mb-3">
        {displayedSeries.map(item => {
          const isSelected = selectedSeries === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onSeriesClick?.(item.name)}
              aria-pressed={isSelected}
              className={`
                transition-all duration-200 flex items-center justify-between gap-2
                focus:outline-none focus-visible:outline-none
                px-2.5 py-1.5 text-left text-sm rounded w-full cursor-pointer
                text-[color:var(--color-text)]
                ${
                  isSelected
                    ? 'bg-[color:var(--color-primary)] font-bold'
                    : 'bg-transparent font-normal hover:bg-[color:var(--color-primary)] hover:bg-opacity-50'
                }
              `}
            >
              <span className="min-w-0 truncate">{item.name}</span>
              <span className="flex-shrink-0 font-maruBuri text-xs opacity-60">{item.count}</span>
            </button>
          );
        })}
      </div>

      {/* 더보기 링크 - 전체 시리즈가 현재 표시 개수보다 많을 때만 표시 */}
      {shouldShowMoreButton && (
        <LoadMoreButton
          text={strings.loadMore}
          className="font-maruBuri"
          onClick={() => {
            setDisplayCount(displayCount + loadMoreCount);
          }}
        />
      )}
    </div>
  );
};

export default SeriesList;
