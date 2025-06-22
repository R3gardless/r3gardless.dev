import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { LabelButton } from '@/components/ui/atoms/LabelButton';
import { TagButton } from '@/components/ui/atoms/TagButton';
import { Heading, DateText } from '@/components/ui/atoms/Typography';

export interface BlogPostRowProps {
  /**
   * 블로그 포스트 ID
   */
  id: string;
  /**
   * 포스트 제목
   */
  title: string;
  /**
   * 포스트 설명
   */
  description: string;
  /**
   * 작성 날짜
   */
  date: string;
  /**
   * 카테고리 정보
   */
  category: {
    text: string;
    color: 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
  };
  /**
   * 태그 목록
   */
  tags: string[];
  /**
   * 썸네일 이미지 URL
   */
  thumbnailUrl?: string;
  /**
   * 테마 모드
   * @default 'light'
   */
  theme?: 'light' | 'dark';
  /**
   * 추가 CSS 클래스
   */
  className?: string;
  /**
   * 포스트 링크 URL (필수)
   */
  href: string;
  /**
   * 카테고리 클릭 핸들러
   */
  onCategoryClick?: (category: string) => void;
  /**
   * 태그 클릭 핸들러
   */
  onTagClick?: (tag: string) => void;
}

/**
 * BlogPostRow 컴포넌트
 * 블로그 포스트 정보를 행 형태로 표시하는 컴포넌트
 */
export const BlogPostRow = ({
  title,
  description,
  date,
  category,
  tags,
  thumbnailUrl,
  theme = 'light',
  className = '',
  href,
  onCategoryClick,
  onTagClick,
}: BlogPostRowProps) => {
  const baseStyles = `
    group relative flex flex-col md:flex-row w-full lg:w-[768px] bg-[color:var(--color-background)] border-b border-[color:var(--color-secondary)] 
    p-3 transition-all duration-200
    hover:bg-[color:var(--color-primary)] hover:shadow-sm
  `;

  return (
    <Link href={href} className={`${baseStyles} ${className}`} data-theme={theme}>
      {/* 왼쪽 콘텐츠 영역 */}
      <div className="flex-1 space-y-3 md:space-y-4">
        {/* 카테고리 라벨 */}
        <div className="flex items-start">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            onClick={e => {
              e.stopPropagation();
              onCategoryClick?.(category.text);
            }}
          >
            <LabelButton
              text={category.text}
              color={category.color}
              theme={theme}
              className="transition-opacity hover:opacity-80"
            />
          </div>
        </div>

        {/* 제목 */}
        <Heading level={1} theme={theme} className="group-hover:opacity-90 transition-opacity mb-0">
          {title}
        </Heading>

        {/* 날짜 */}
        <DateText theme={theme} className="opacity-70">
          {date}
        </DateText>

        {/* 설명 */}
        <div
          className="opacity-80 overflow-hidden font-pretendard font-normal text-base leading-tight text-[color:var(--color-text)] my-2"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
          }}
        >
          {description}
        </div>

        {/* 태그 목록 */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
              key={`${tag}-${index}`}
              onClick={e => {
                e.stopPropagation();
                onTagClick?.(tag);
              }}
            >
              <TagButton text={tag} theme={theme} className="transition-opacity hover:opacity-80" />
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 썸네일 영역 */}
      {thumbnailUrl && (
        <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
          <div className="w-full md:w-[300px] h-[180px] rounded-lg overflow-hidden bg-[color:var(--color-secondary)]">
            <Image
              src={thumbnailUrl}
              alt={`${title} 썸네일`}
              width={300}
              height={180}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              priority={false}
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default BlogPostRow;
