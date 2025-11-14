import Image from 'next/image';
import React from 'react';

import { LabelButton } from '@/components/ui/buttons/LabelButton';
import { TagButton } from '@/components/ui/buttons/TagButton';
import { Heading, Text } from '@/components/ui/typography';
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
  return (
    <article className={className}>
      {/* 썸네일 이미지 */}
      {cover && (
        <div className="relative w-full h-[300px] md:h-[400px] mb-6 rounded-xl overflow-hidden bg-[color:var(--color-primary)]">
          <Image src={cover} alt={title} fill className="object-cover" priority />
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
        <Text fontFamily="maruBuri">{createdAt}</Text>
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
        <div className="w-full p-4 rounded-xl bg-[color:var(--color-primary)] flex items-start gap-3">
          <div className="flex-shrink-0">💬</div>
          <div className="flex-1">
            <Text>{description}</Text>
          </div>
        </div>
      )}
    </article>
  );
};

export default PostHeader;
