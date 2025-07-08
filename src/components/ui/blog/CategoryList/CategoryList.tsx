import React, { useRef, useEffect } from 'react';

import { LoadMoreButton } from '@/components/ui/buttons/LoadMoreButton';
import { Heading } from '@/components/ui/typography';
import { CategoryButton } from '@/components/ui/buttons/CategoryButton';

export interface CategoryListProps {
  /**
   * 표시할 카테고리 목록
   */
  categories: string[];
  /**
   * 선택된 카테고리
   * 제공되지 않으면 "전체" 카테고리가 기본 선택됨
   */
  selectedCategory?: string;
  /**
   * 레이아웃 방향
   * vertical: 세로 레이아웃 (사이드바용)
   * horizontal: 가로 레이아웃 (상단 필터용)
   */
  variant: 'vertical' | 'horizontal';
  /**
   * 더보기 표시 여부 (vertical에서만 유효)
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
   * 더보기 클릭 이벤트 핸들러 (vertical에서만 유효)
   */
  onMoreClick?: () => void;
}

/**
 * CategoryList 컴포넌트
 * 카테고리 목록을 세로 또는 가로로 표시하는 분자 컴포넌트
 * variant에 따라 다른 레이아웃과 기능을 제공
 * selectedCategory가 없을 때 "전체" 카테고리가 기본 선택됨
 */
export const CategoryList = ({
  categories,
  selectedCategory,
  variant,
  showMore = true,
  className = '',
  onCategoryClick,
  onMoreClick,
}: CategoryListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // ✅ Map을 사용하여 객체 주입 공격 방지
  const categoryRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  // 선택된 카테고리로 부드럽게 스크롤하는 함수 (horizontal에서만 사용)
  const scrollToCategory = (category: string) => {
    const categoryElement = categoryRefs.current.get(category);
    const scrollContainer = scrollContainerRef.current;

    if (categoryElement && scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const categoryRect = categoryElement.getBoundingClientRect();

      // 카테고리 버튼이 컨테이너 중앙에 오도록 계산
      const scrollLeft =
        categoryElement.offsetLeft - containerRect.width / 2 + categoryRect.width / 2;

      // scrollTo 메서드가 존재하는지 확인 (테스트 환경 대응)
      if (typeof scrollContainer.scrollTo === 'function') {
        scrollContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      } else {
        // fallback: scrollLeft 속성 직접 설정
        scrollContainer.scrollLeft = scrollLeft;
      }
    }
  };

  // 선택된 카테고리가 변경될 때 해당 카테고리로 스크롤 (horizontal에서만 실행)
  useEffect(() => {
    if (variant !== 'horizontal' || !selectedCategory) return;

    const scrollContainer = scrollContainerRef.current;

    // 부드러운 애니메이션을 위한 지연 시간 (CSS transition duration과 동기화)
    let delay = 150; // fallback: 300ms CSS transition의 절반 시간

    if (scrollContainer) {
      const computedStyle = window.getComputedStyle(scrollContainer);
      const durationInSec = parseFloat(computedStyle.transitionDuration); // e.g., "0.3"
      if (!isNaN(durationInSec)) {
        delay = (durationInSec * 1000) / 2;
      }
    }

    const timeoutId = window.setTimeout(() => {
      scrollToCategory(selectedCategory);
    }, delay);

    return () => {
      // ❗ 컴포넌트가 언마운트되거나 selectedCategory가 바뀌기 전에 timeout 정리
      clearTimeout(timeoutId);
    };
  }, [selectedCategory, variant]);

  const handleCategoryClick = (category: string) => {
    onCategoryClick?.(category);

    // horizontal에서만 스크롤 실행
    if (variant === 'horizontal') {
      scrollToCategory(category);
    }
  };

  // Vertical 레이아웃 (기존 CategoryVerticalList)
  if (variant === 'vertical') {
    // 기본 스타일
    // lg 이상에서는 246px 고정, lg 이하에서는 최대 768px 너비
    const baseStyles = 'w-full max-w-[768px] lg:w-[246px] lg:max-w-none p-3 rounded-lg';

    // 테마에 따른 배경색 - CSS 변수 사용
    const themeStyles = 'bg-[color:var(--color-background)] text-[color:var(--color-text)]';

    // 구분선 스타일
    const dividerStyles = 'border-[color:var(--color-text)] opacity-15';

    return (
      <div className={`${baseStyles} ${themeStyles} ${className}`}>
        {/* 상단 헤더 - 제목 */}
        <div className="flex justify-between items-center mb-4">
          <Heading level={3} className="my-1 text-lg md:text-base font-bold">
            카테고리
          </Heading>
        </div>

        {/* 구분선 - 헤더 바로 아래 표시 */}
        <hr className={`border-t-[0.5px] ${dividerStyles} mb-5 mt-0`} />

        {/* 카테고리 목록 */}
        <div className="flex flex-col space-y-1 mb-3">
          {categories.map(category => {
            // selectedCategory가 없거나 빈 값일 때 "전체"를 기본 선택으로 처리
            const isSelected =
              selectedCategory === category || (!selectedCategory && category === '전체');

            return (
              <CategoryButton
                key={category}
                variant="vertical"
                isSelected={isSelected}
                onClick={() => {
                  handleCategoryClick(category);
                }}
              >
                {category}
              </CategoryButton>
            );
          })}
        </div>

        {/* 더보기 링크 */}
        {showMore && <LoadMoreButton text="+ 더보기" onClick={onMoreClick} />}
      </div>
    );
  }

  // Horizontal 레이아웃 (기존 CategoryHorizontalList)
  // 기본 스타일 - 1024px 고정 너비
  const baseStyles = 'w-full max-w-[1024px] mx-auto';

  // 테마에 따른 배경색 및 텍스트 색상
  const themeStyles = 'bg-[color:var(--color-background)]';

  return (
    <div className={`${baseStyles} ${themeStyles} ${className}`}>
      {/* 카테고리 스크롤 컨테이너 */}
      <div
        ref={scrollContainerRef}
        className="flex items-center pt-3 pb-0 overflow-x-auto scrollbar-hide scroll-smooth relative"
      >
        {' '}
        {categories.map(category => {
          // selectedCategory가 없거나 빈 값일 때 "전체"를 기본 선택으로 처리
          const isSelected =
            selectedCategory === category || (!selectedCategory && category === '전체');

          return (
            <CategoryButton
              key={category}
              ref={(el: HTMLButtonElement | null) => {
                // ✅ Map.set() 사용으로 안전한 참조 저장
                categoryRefs.current.set(category, el);
              }}
              variant="horizontal"
              isSelected={isSelected}
              onClick={() => {
                if (!isSelected) {
                  handleCategoryClick(category);
                }
              }}
            >
              {category}
            </CategoryButton>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
