import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Heading, Text, DateText } from '@/components/ui/atoms/Typography';
import { TagButton } from '@/components/ui/atoms/TagButton';
import { LabelButton } from '@/components/ui/atoms/LabelButton';

/**
 * BlogPostCard 컴포넌트 Props
 */
export interface BlogPostCardProps {
  /**
   * 블로그 포스트 제목
   */
  title: string;
  /**
   * 블로그 포스트 설명
   */
  description: string;
  /**
   * 게시 날짜 (표시용 문자열)
   */
  date: string;
  /**
   * 태그 목록
   */
  tags: string[];
  /**
   * 썸네일 이미지 URL
   */
  imageUrl?: string;
  /**
   * 이미지 alt 텍스트
   */
  imageAlt?: string;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
  /**
   * 포스트 ID (라우팅용)
   */
  postId?: string;
  /**
   * 포스트 URL 경로 (href)
   */
  href: string;
  /**
   * 카테고리
   */
  category?: string;
  /**
   * 좌상단 라벨 정보
   */
  label?: {
    text: string;
    color: 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
  };
}

/**
 * BlogPostCard 컴포넌트
 * 블로그 포스트의 썸네일, 제목, 설명, 날짜, 태그를 표시하는 카드형 컴포넌트
 */
export const BlogPostCard = ({
  title,
  description,
  date,
  tags,
  imageUrl,
  imageAlt = 'Blog post thumbnail',
  className = '',
  postId,
  href,
  label,
}: BlogPostCardProps) => {
  /* 반응형 카드 기본 스타일 - sm:640px, md:768px, lg:1024px 기준으로 크기 결정 */
  const baseStyles =
    'rounded-2xl transition-all duration-300 ease-in-out w-full md:w-[380px] lg:w-[330px] relative overflow-hidden';

  // CSS 변수를 사용한 배경 스타일 (globals.css의 --color-background 참조)
  const backgroundStyles =
    'shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] dark:shadow-[0px_4px_4px_0px_rgba(255,255,255,0.25)]';

  const interactiveStyles = 'cursor-pointer hover:scale-[1.02] hover:shadow-lg';

  // 카드 내용 컴포넌트
  const CardContent = (
    <>
      {/* 썸네일 이미지 */}
      {imageUrl && (
        <div className="w-full h-[200px] relative">
          {/* 썸네일이 있을 때 라벨을 이미지 위에 위치 */}
          {label && (
            <div className="absolute top-3 left-3 z-10">
              <LabelButton text={label.text} color={label.color} />
            </div>
          )}
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* 카드 내용 영역 - 패딩 적용 */}
      <div className="p-4">
        {/* 썸네일이 없을 때만 라벨을 제목 위에 위치 */}
        {!imageUrl && label && (
          <div className="mb-2 text-left">
            <LabelButton text={label.text} color={label.color} />
          </div>
        )}

        {/* 제목 */}
        <div className="mb-2 text-left">
          <Heading level={3} className="text-lg sm:text-xl md:text-xl lg:text-2xl truncate">
            {title}
          </Heading>
        </div>

        {/* 날짜 */}
        <div className="mb-3 text-left">
          <DateText className="text-xs sm:text-sm">{date}</DateText>
        </div>

        {/* 설명 */}
        <div className="mb-4 text-left">
          <Text className="text-xs sm:text-sm md:text-sm line-clamp-2 overflow-hidden text-ellipsis">
            {description}
          </Text>
        </div>

        {/* 태그들 - 줄바꿈 가능 */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2">
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
      data-post-id={postId}
    >
      {CardContent}
    </Link>
  );
};

export default BlogPostCard;
