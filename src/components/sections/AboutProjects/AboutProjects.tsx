import { BarChart3, FileText, Trophy } from 'lucide-react';
import Link from 'next/link';
import React, { forwardRef, HTMLAttributes } from 'react';
import { SiGithub } from 'react-icons/si';

import { Heading, Text } from '@/components/ui/typography';

export interface AwardItem {
  /**
   * 수상 내역 이름
   */
  prize: string;

  /**
   * 수상 관련 링크 (선택사항)
   */
  link?: string;
}

export interface ProjectItemProps {
  /**
   * 고유 ID
   */
  id: string;

  /**
   * 프로젝트 이름
   */
  name: string;

  /**
   * 프로젝트 요약
   */
  summary: string;

  /**
   * 프로젝트 진행 기간 (선택사항)
   */
  period?: string;

  /**
   * 프로젝트 설명
   */
  description: string;

  /**
   * GitHub URL (선택사항)
   */
  githubUrl?: string;

  /**
   * 발표자료 URL (선택사항)
   */
  presentationUrl?: string;

  /**
   * 블로그 URL (선택사항)
   */
  blogUrl?: string;

  /**
   * 수상 내역 목록 (선택사항)
   */
  awards?: readonly AwardItem[];
}

export interface AboutProjectsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * 섹션 제목
   */
  title: string;

  /**
   * 프로젝트 아이템 목록
   */
  items: readonly ProjectItemProps[];

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * AboutProjects 컴포넌트
 * About 페이지의 Project 섹션을 표시하는 organism 컴포넌트
 */
export const AboutProjects = forwardRef<HTMLElement, AboutProjectsProps>(
  ({ title, items, className = '', ...props }, ref) => {
    return (
      <section ref={ref} className={`w-full py-10 md:py-12 ${className}`} {...props}>
        {/* 섹션 제목 */}
        <div className="mb-8 md:mb-10">
          <Heading level={3} fontFamily="maruBuri" className="leading-tight">
            {title}
          </Heading>
        </div>

        {/* 프로젝트 목록 */}
        <div className="space-y-8">
          {items.map(item => (
            <div key={item.id} className="grid gap-3 md:grid-cols-[1fr_11rem] md:gap-8">
              <div className="flex flex-col border-l-2 border-[var(--color-primary)] pl-4 md:pl-5">
                {/* Top Row: Project Name + Period */}
                <div className="flex flex-col">
                  <Heading fontFamily="maruBuri" level={4}>
                    {item.name}
                  </Heading>
                </div>

                {/* Content Container */}
                <div className="mt-3">
                  {/* 요약 */}
                  <Heading
                    level={5}
                    className="text-base leading-6 text-[color:var(--color-text)]/78"
                  >
                    {item.summary}
                  </Heading>

                  {/* 설명 */}
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li className="font-pretendard leading-7 text-[color:var(--color-text)]/72">
                      {item.description}
                    </li>
                  </ul>

                  {/* 링크 및 수상 배지 */}
                  {(item.awards?.length ||
                    item.githubUrl ||
                    item.presentationUrl ||
                    item.blogUrl) && (
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                      {/* 수상 내역 */}
                      {item.awards?.map((award, index) =>
                        award.link ? (
                          <Link
                            key={index}
                            href={award.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-pretendard highlight-underline highlight-underline-yellow"
                          >
                            <Trophy className="size-5" strokeWidth={2.5} />
                            {award.prize}
                          </Link>
                        ) : (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 text-sm font-pretendard highlight-underline-yellow"
                          >
                            <Trophy className="size-5" strokeWidth={2.5} />
                            {award.prize}
                          </span>
                        ),
                      )}

                      {/* GitHub 링크 */}
                      {item.githubUrl && (
                        <Link
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-pretendard highlight-underline highlight-underline-purple"
                        >
                          <SiGithub className="size-5" aria-hidden="true" />
                          GitHub
                        </Link>
                      )}

                      {/* Presentation 링크 */}
                      {item.presentationUrl && (
                        <Link
                          href={item.presentationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-pretendard highlight-underline highlight-underline-green"
                        >
                          <BarChart3 className="size-5" strokeWidth={2.5} />
                          Presentation
                        </Link>
                      )}

                      {/* Blog 링크 */}
                      {item.blogUrl && (
                        <Link
                          href={item.blogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-pretendard highlight-underline highlight-underline-blue"
                        >
                          <FileText className="size-5" strokeWidth={2.5} />
                          Blog
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {item.period && (
                <Text className="pl-6 text-sm leading-6 text-[color:var(--color-text)]/58 md:pl-0 md:text-right">
                  {item.period}
                </Text>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  },
);

AboutProjects.displayName = 'AboutProjects';
