import React from 'react';

import { CategoryList } from '@/components/ui/blog/CategoryList';
import { SeriesList } from '@/components/ui/blog/SeriesList';
import { TagList } from '@/components/ui/blog/TagList';
import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang } from '@/types/blog';
import type { SeriesSummary } from '@/utils/blog';

export interface BlogSidebarProps {
  /**
   * 표시할 카테고리 목록
   */
  categories: string[];
  /**
   * 선택된 카테고리
   */
  selectedCategory?: string;
  /**
   * 렌더링 언어 (카테고리/태그 UI 크롬 분기)
   */
  lang?: PostLang;
  /**
   * 표시할 시리즈 목록. 비어 있으면 시리즈 섹션을 표시하지 않습니다.
   */
  series?: SeriesSummary[];
  /**
   * 선택된 시리즈 이름
   */
  selectedSeries?: string;
  /**
   * 표시할 태그 목록
   */
  tags: string[];
  /**
   * 선택된 태그 목록
   */
  selectedTags?: string[];
  /**
   * 카테고리 더보기 표시 여부
   * @default true
   */
  showMoreCategories?: boolean;
  /**
   * 태그 더보기 표시 여부
   * @default true
   */
  showMoreTags?: boolean;
  /**
   * 사이드바 숨김 여부 (모바일 뷰에서 사용)
   * @default false
   */
  isHidden?: boolean;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 카테고리 클릭 이벤트 핸들러
   */
  onCategoryClick?: (category: string) => void;
  /**
   * 카테고리 더보기 클릭 이벤트 핸들러
   */
  onMoreCategoriesClick?: () => void;
  /**
   * 시리즈 클릭 이벤트 핸들러 (선택된 시리즈를 다시 클릭하면 해제)
   */
  onSeriesClick?: (seriesName: string) => void;
  /**
   * 태그 클릭 이벤트 핸들러
   */
  onTagClick?: (tag: string) => void;
  /**
   * 태그 제거 이벤트 핸들러
   */
  onTagRemove?: (tag: string) => void;
  /**
   * 태그 더보기 클릭 이벤트 핸들러
   */
  onMoreTagsClick?: () => void;
  /**
   * 태그 모두 지우기 클릭 이벤트 핸들러
   */
  onClearAllTags?: () => void;
}

/**
 * BlogSidebar 컴포넌트
 *
 * 블로그 목록 페이지의 사이드바 영역으로 카테고리와 태그 필터링 기능을 제공
 * - 카테고리 세로 목록 (CategoryVerticalList)
 * - 태그 목록 (TagList)
 * - 반응형 디자인: 모바일에서는 접을 수 있음
 */
export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  categories,
  selectedCategory,
  series = [],
  selectedSeries,
  tags,
  selectedTags = [],
  lang = DEFAULT_POST_LANG,
  showMoreCategories = true,
  showMoreTags = true,
  isHidden = false,
  className = '',
  onCategoryClick,
  onMoreCategoriesClick,
  onSeriesClick,
  onTagClick,
  onTagRemove,
  onMoreTagsClick,
  onClearAllTags,
}) => {
  const containerStyles = 'w-full md:w-auto space-y-6';

  // 사이드바가 숨겨진 상태면 빈 컴포넌트 반환
  if (isHidden) {
    return null;
  }

  return (
    <aside className={`${containerStyles} ${className}`} aria-label="블로그 필터">
      {/* 카테고리 목록 */}
      <CategoryList
        variant="vertical"
        categories={categories}
        selectedCategory={selectedCategory}
        lang={lang}
        showMore={showMoreCategories}
        onCategoryClick={onCategoryClick}
        onMoreClick={onMoreCategoriesClick}
      />

      {/* 시리즈 목록 - 시리즈가 있을 때만 표시 */}
      {series.length > 0 && (
        <SeriesList
          series={series}
          selectedSeries={selectedSeries}
          lang={lang}
          onSeriesClick={onSeriesClick}
        />
      )}

      {/* 태그 목록 */}
      <TagList
        tags={tags}
        selectedTags={selectedTags}
        lang={lang}
        showMore={showMoreTags}
        showClearAll={true}
        onTagClick={onTagClick}
        onTagRemove={onTagRemove}
        onMoreClick={onMoreTagsClick}
        onClearAll={onClearAllTags}
      />
    </aside>
  );
};

export default BlogSidebar;
