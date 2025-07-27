import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Heading, Text } from '@/components/ui/typography';
import { TagButton } from '@/components/ui/buttons/TagButton';
import { LabelButton } from '@/components/ui/buttons/LabelButton';
import { PostMeta } from '@/types/blog';

/**
 * PostCard 컴포넌트 Props
 */
export interface PostCardProps extends PostMeta {
  /**
   * 추가 CSS 클래스
   */
  className?: string;
  /**
   * 포스트 링크 URL (필수)
   */
  href: string;
}

/**
 * PostCard 컴포넌트
 * 블로그 포스트의 썸네일, 제목, 설명, 날짜, 태그를 표시하는 카드형 컴포넌트
 */
export const PostCard = ({
  id,
  title,
  description,
  createdAt,
  category,
  tags,
  cover,
  className = '',
  href,
}: PostCardProps) => {
  /* 반응형 카드 기본 스타일 - sm:640px, md:768px, lg:1024px 기준으로 크기 결정 */
  const baseStyles = 'rounded-2xl transition-all duration-300 ease-in-out relative overflow-hidden';

  // Glassmorphism 스타일 - light/dark 모드 자동 전환
  const backgroundStyles = 'glass-card dark:glass-card-dark';

  const interactiveStyles = 'cursor-pointer hover:scale-[1.02] transition-transform duration-300';

  const coverAlt = `${title} 커버 이미지`;
  // 카드 내용 컴포넌트
  const CardContent = (
    <>
      {/* 커버 이미지 */}
      {cover && (
        <div className="h-[200px] relative">
          {/* 커버 이미지가 있을 때 라벨을 이미지 위에 위치 */}
          {category && (
            <div className="absolute top-3 left-3 z-10">
              <LabelButton text={category.text} color={category.color} />
            </div>
          )}
          <Image src={cover} alt={coverAlt} fill className="object-cover" />
        </div>
      )}

      {/* 카드 내용 영역 - 패딩 적용 */}
      <div className="p-4">
        {/* 커버 이미지가 없을 때만 라벨을 제목 위에 위치 */}
        {!cover && category && (
          <div className="mb-2 text-left">
            <LabelButton text={category.text} color={category.color} />
          </div>
        )}

        {/* 제목 */}
        <div className="mb-2 text-left">
          <Heading level={3} className="truncate">
            {title}
          </Heading>
        </div>

        {/* 날짜 */}
        <div className="mb-3 text-left">
          <Text fontFamily="maruBuri">{createdAt}</Text>
        </div>

        {/* 설명 */}
        <div className="mb-4 text-left">
          <Text className="text-sm line-clamp-2 overflow-hidden text-ellipsis">{description}</Text>
        </div>

        {/* 태그들 - 줄바꿈 가능 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <TagButton key={`${tag}-${index}`} text={tag} />
            ))}
          </div>
        )}
      </div>
    </>
  );

  // href가 항상 존재하므로 Next.js Link로 렌더링
  return (
    <Link
      href={href}
      className={`${baseStyles} ${backgroundStyles} ${interactiveStyles} ${className} block`}
      data-post-id={id}
    >
      {CardContent}
    </Link>
  );
};

export default PostCard;
