import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { LabelButton } from '@/components/ui/buttons/LabelButton';
import { TagButton } from '@/components/ui/buttons/TagButton';
import { Heading, DateText, Text } from '@/components/ui/typography';
import { PostMeta } from '@/types/blog';

/**
 * PostRow 컴포넌트 Props
 */
export interface PostRowProps extends PostMeta {
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
export const PostRow = ({
  title,
  description,
  publishedAt,
  category,
  tags,
  thumbnailUrl,
  className = '',
  href,
  onCategoryClick,
  onTagClick,
}: PostRowProps) => {
  const baseStyles = `
    group relative flex flex-col md:flex-row w-full max-w-[768px]
    px-2 py-5 transition-all duration-200
    hover:bg-[color:var(--color-primary)] hover:shadow-sm
  `;

  return (
    <Link href={href} className={`${baseStyles} ${className}`}>
      {/* 왼쪽 콘텐츠 영역 */}
      <div className="flex-1 space-y-3 md:space-y-4">
        {/* 카테고리 라벨 */}
        <div className="flex items-start">
          <LabelButton
            text={category.text}
            color={category.color}
            onClick={e => {
              e?.stopPropagation();
              onCategoryClick?.(category.text);
            }}
            className="transition-opacity hover:opacity-80"
          />
        </div>

        {/* 제목 */}
        <Heading level={2} className="group-hover:opacity-90 transition-opacity mb-0">
          {title}
        </Heading>

        {/* 날짜 */}
        <DateText className="opacity-70">{publishedAt}</DateText>

        {/* 설명 */}
        <Text
          className="opacity-80 text-sm my-3"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}
        >
          {description}
        </Text>

        {/* 태그 목록 */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <TagButton
              key={`${tag}-${index}`}
              text={tag}
              onClick={e => {
                e?.stopPropagation();
                onTagClick?.(tag);
              }}
              className="transition-opacity hover:opacity-80"
            />
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

export default PostRow;
