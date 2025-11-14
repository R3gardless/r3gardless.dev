'use client';

import React, { useState } from 'react';

import { SearchBar } from '@/components/ui/search/SearchBar';
import { Heading, Text } from '@/components/ui/typography';

export interface BlogHeaderProps {
  /**
   * 검색어 값
   */
  searchValue?: string;
  /**
   * 검색어 변경 핸들러
   */
  onSearchChange?: (value: string) => void;
  /**
   * 검색 실행 핸들러
   */
  onSearch?: (value: string) => void;
  /**
   * 검색 로딩 상태
   * @default false
   */
  isSearchLoading?: boolean;
  /**
   * 선택된 카테고리
   */
  selectedCategory?: string;
  /**
   * 선택된 태그 목록
   */
  selectedTags?: string[];
  /**
   * 추가 클래스명
   */
  className?: string;
}

/**
 * BlogHeader 컴포넌트
 *
 * 블로그 목록 페이지 상단에 위치하는 헤더 컴포넌트
 * - 제목 표시
 * - 포스트 개수 표시
 * - 검색 기능 제공
 */
export const BlogHeader: React.FC<BlogHeaderProps> = ({
  searchValue = '',
  onSearchChange,
  onSearch,
  isSearchLoading = false,
  selectedCategory,
  selectedTags = [],
  className = '',
}) => {
  const [isMobile, setIsMobile] = useState(false);

  const containerStyles = 'w-full space-y-6';

  // 화면 크기에 따른 반응형 처리
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className={`${containerStyles} ${className}`}>
      <div className="items-center">
        <div className="text-center mb-10">
          <Heading level={1} fontFamily="maruBuri" className="text-5xl mb-10">
            Blog
          </Heading>
          <Text fontFamily="maruBuri">From experiments to insights — my tech journey</Text>
        </div>

        {/* SearchBar - 세로 배치, 중앙 정렬 */}
        <div className="w-full flex justify-center">
          <div className="w-full md:w-[768px]">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              onSearch={onSearch}
              loading={isSearchLoading}
              placeholder="Search..."
              showShortcut={!isMobile} // 모바일에서는 단축키 표시 안함
            />
          </div>
        </div>
      </div>

      {/* 검색어가 있는 경우 결과 표시 */}
      {searchValue && (
        <div className="px-4 py-2 bg-[color:var(--color-secondary)] rounded-lg text-sm text-center">
          <p className="text-[color:var(--color-text)]">
            Search results for <span className="font-bold">&ldquo;{searchValue}&rdquo;</span>
            {selectedCategory && (
              <span>
                {' '}
                (Category: <span className="font-bold">{selectedCategory}</span>)
              </span>
            )}
            {selectedTags.length > 0 && (
              <span>
                {' '}
                (Tags: <span className="font-bold">{selectedTags.join(', ')}</span>)
              </span>
            )}
          </p>
        </div>
      )}
    </header>
  );
};
