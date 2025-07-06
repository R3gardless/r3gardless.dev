import React from 'react';
import Image from 'next/image';

import { LabelButton } from '@/components/ui/atoms/LabelButton';
import { TagButton } from '@/components/ui/atoms/TagButton';
import { Heading, DateText, Italic } from '@/components/ui/typography';

export interface PostHeaderProps {
  /**
   * 포스트 제목
   */
  title: string;
  /**
   * 포스트 설명
   */
  description?: string;
  /**
   * 게시 날짜
   */
  publishedAt: string;
  /**
   * 카테고리 정보
   */
  category?: {
    text: string;
    color: 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
  };
  /**
   * 태그 목록
   */
  tags?: string[];
  /**
   * 썸네일 이미지 URL
   */
  thumbnailUrl?: string;
  /**
   * 썸네일 이미지 alt 텍스트
   */
  thumbnailAlt?: string;
  /**
   * 추가 클래스명
   */
  className?: string;
  /**
   * 카테고리 클릭 이벤트 핸들러
   */
  onCategoryClick?: (category: string) => void;
  /**
   * 태그 클릭 이벤트 핸들러
   */
  onTagClick?: (tag: string) => void;
}

/**
 * PostHeader 컴포넌트
 * 블로그 포스트 상단 헤더 영역을 담당하는 organism 컴포넌트
 * 썸네일 이미지, 카테고리, 제목, 날짜, 태그, 설명 등을 포함
 */
export const PostHeader = ({
  title,
  description,
  publishedAt,
  category,
  tags = [],
  thumbnailUrl,
  thumbnailAlt,
  className = '',
  onCategoryClick,
  onTagClick,
}: PostHeaderProps) => {
  const baseStyles = 'w-full max-w-4xl mx-auto';

  return (
    <article className={`${baseStyles} ${className}`}>
      {/* 썸네일 이미지 */}
      {thumbnailUrl && (
        <div className="w-full h-[400px] mb-6 rounded-xl overflow-hidden bg-[color:var(--color-secondary)]">
          <Image
            src={thumbnailUrl}
            alt={thumbnailAlt || title}
            width={900}
            height={400}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      {/* 카테고리 라벨 */}
      {category && (
        <div className="mb-4">
          <LabelButton
            text={category.text}
            color={category.color}
            onClick={onCategoryClick ? () => onCategoryClick(category.text) : undefined}
          />
        </div>
      )}

      {/* 제목 */}
      <div className="mb-3">
        <Heading level={1} className="text-2xl md:text-3xl lg:text-4xl">
          {title}
        </Heading>
      </div>

      {/* 날짜 */}
      <div className="mb-6">
        <DateText className="text-sm">{publishedAt}</DateText>
      </div>

      {/* 태그 목록 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <TagButton
              key={`${tag}-${index}`}
              text={tag}
              onClick={onTagClick ? () => onTagClick(tag) : undefined}
            />
          ))}
        </div>
      )}

      {/* 설명 박스 */}
      {description && (
        <div className="w-full p-4 rounded-xl border border-[color:var(--color-secondary)] mb-6">
          <Italic className="text-sm leading-relaxed">{description}</Italic>
        </div>
      )}
    </article>
  );
};

export default PostHeader;
