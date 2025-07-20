import React from 'react';
import Image from 'next/image';

import { LabelButton } from '@/components/ui/buttons/LabelButton';
import { TagButton } from '@/components/ui/buttons/TagButton';
import { Heading, DateText, Italic } from '@/components/ui/typography';
import { PostMeta } from '@/types/blog';

export interface PostHeaderProps extends Omit<PostMeta, 'href'> {
  /**
   * 추가 CSS 클래스
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
  createdAt,
  category,
  tags = [],
  cover,
  className = '',
  onCategoryClick,
  onTagClick,
}: PostHeaderProps) => {
  const baseStyles = 'w-full max-w-[1024px] mx-auto';

  return (
    <article className={`${baseStyles} ${className}`}>
      {/* 썸네일 이미지 */}
      {cover && (
        <div className="w-full h-[400px] mb-6 rounded-xl overflow-hidden bg-[color:var(--color-secondary)]">
          <Image
            src={cover}
            alt={title}
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
            onClick={
              onCategoryClick
                ? () => {
                    onCategoryClick(category.text);
                  }
                : undefined
            }
          />
        </div>
      )}

      {/* 제목 */}
      <div className="mb-3">
        <Heading level={1}>{title}</Heading>
      </div>

      {/* 날짜 */}
      <div className="mb-6">
        <DateText>{createdAt}</DateText>
      </div>

      {/* 태그 목록 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <TagButton
              key={`${tag}-${index}`}
              text={tag}
              onClick={
                onTagClick
                  ? () => {
                      onTagClick(tag);
                    }
                  : undefined
              }
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
