import { Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { LabelButton } from '@/components/ui/buttons/LabelButton';
import { TagButton } from '@/components/ui/buttons/TagButton';
import { Heading, Text } from '@/components/ui/typography';
import { PostMeta } from '@/types/blog';
import { createBlogFilterHref } from '@/utils/blog';

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

const filterLinkStyles =
  'inline-flex cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus-visible:outline-none';

/**
 * PostHeader 컴포넌트
 * 블로그 포스트 상단 헤더 영역을 담당하는 organism 컴포넌트
 * 커버 이미지, 카테고리, 제목, 날짜, 태그, 설명 등을 포함
 */
export const PostHeader = ({
  title,
  description,
  createdAt,
  readingTime,
  category,
  tags = [],
  cover,
  className = '',
  onCategoryClick,
  onTagClick,
}: PostHeaderProps) => {
  return (
    <article className={className}>
      {/* 커버 이미지 */}
      {cover && (
        <div className="relative w-full h-[18.75rem] md:h-[25rem] mb-6 rounded-xl overflow-hidden bg-[color:var(--color-primary)]">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-fill"
            style={{ objectFit: 'fill' }}
            priority
          />
        </div>
      )}

      {/* 카테고리 라벨 */}
      {category && (
        <div className="mb-4">
          {onCategoryClick ? (
            <LabelButton
              text={category.text}
              color={category.color}
              rgb={category.rgb}
              foregroundRgb={category.foregroundRgb}
              onClick={() => {
                onCategoryClick(category.text);
              }}
            />
          ) : (
            <Link
              href={createBlogFilterHref('category', category.text)}
              className={filterLinkStyles}
            >
              <LabelButton
                text={category.text}
                color={category.color}
                rgb={category.rgb}
                foregroundRgb={category.foregroundRgb}
              />
            </Link>
          )}
        </div>
      )}

      {/* 제목 */}
      <div className="mb-3">
        <Heading level={1}>{title}</Heading>
      </div>

      {/* 날짜 · 읽기 시간 */}
      <div className="mb-6 flex items-center gap-2">
        <Text fontFamily="maruBuri">{createdAt}</Text>
        {readingTime ? (
          <span className="flex items-center gap-1 font-maruBuri text-(--color-text-secondary)">
            <span aria-hidden="true">·</span>
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {`${readingTime} min`}
          </span>
        ) : null}
      </div>

      {/* 태그 목록 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) =>
            onTagClick ? (
              <TagButton
                key={`${tag}-${index}`}
                text={tag}
                onClick={() => {
                  onTagClick(tag);
                }}
              />
            ) : (
              <Link
                key={`${tag}-${index}`}
                href={createBlogFilterHref('tags', tag)}
                className={filterLinkStyles}
              >
                <TagButton text={tag} />
              </Link>
            ),
          )}
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
