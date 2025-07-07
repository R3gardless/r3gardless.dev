import React from 'react';

import { CategoryVerticalList } from '@/components/ui/blog/CategoryVerticalList';
import { TagList } from '@/components/ui/blog/TagList';

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
 * BlogListSidebar 컴포넌트
 *
 * 블로그 목록 페이지의 사이드바 영역으로 카테고리와 태그 필터링 기능을 제공
 * - 카테고리 세로 목록 (CategoryVerticalList)
 * - 태그 목록 (TagList)
 * - 반응형 디자인: 모바일에서는 접을 수 있음
 */
export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  categories,
  selectedCategory,
  tags,
  selectedTags = [],
  showMoreCategories = true,
  showMoreTags = true,
  isHidden = false,
  className = '',
  onCategoryClick,
  onMoreCategoriesClick,
  onTagClick,
  onTagRemove,
  onMoreTagsClick,
  onClearAllTags,
}) => {
  // 사이드바가 숨겨진 상태면 빈 컴포넌트 반환
  if (isHidden) {
    return null;
  }

  return (
    <aside className={`space-y-6 w-full md:w-auto ${className}`} aria-label="블로그 필터">
      {/* 카테고리 목록 */}
      <CategoryVerticalList
        categories={categories}
        selectedCategory={selectedCategory}
        showMore={showMoreCategories}
        onCategoryClick={onCategoryClick}
        onMoreClick={onMoreCategoriesClick}
        className="shadow-sm"
      />

      {/* 태그 목록 */}
      <TagList
        tags={tags}
        selectedTags={selectedTags}
        showMore={showMoreTags}
        showClearAll={true}
        onTagClick={onTagClick}
        onTagRemove={onTagRemove}
        onMoreClick={onMoreTagsClick}
        onClearAll={onClearAllTags}
        className="shadow-sm"
      />
    </aside>
  );
};

export default BlogSidebar;
