import React, { useRef, useEffect } from 'react';

import { CategoryButton } from '@/components/ui/atoms/CategoryButton';

export interface CategoryHorizontalListProps {
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
   * 추가 클래스명
   */
  className?: string;
  /**
   * 카테고리 클릭 이벤트 핸들러
   */
  onCategoryClick?: (category: string) => void;
}

/**
 * CategoryHorizontalList 컴포넌트
 * 카테고리 목록을 가로로 표시하는 분자 컴포넌트
 * 1024px 고정 너비, 스크롤 가능하지만 스크롤바 숨김
 * 선택된 카테고리로 부드럽게 스크롤하는 애니메이션 제공
 */
export const CategoryHorizontalList = ({
  categories,
  selectedCategory,
  className = '',
  onCategoryClick,
}: CategoryHorizontalListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // ✅ Map을 사용하여 객체 주입 공격 방지
  const categoryRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  // 선택된 카테고리로 부드럽게 스크롤하는 함수
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

  // 선택된 카테고리가 변경될 때 해당 카테고리로 스크롤
  useEffect(() => {
    if (!selectedCategory) return;

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
  }, [selectedCategory]);

  const handleCategoryClick = (category: string) => {
    onCategoryClick?.(category);
    scrollToCategory(category);
  };

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
        {categories.map(category => {
          const isSelected = selectedCategory === category;

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

export default CategoryHorizontalList;
