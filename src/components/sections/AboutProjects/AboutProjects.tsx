import { BarChart3, FileText, Github, Trophy } from 'lucide-react';
import React, { forwardRef, HTMLAttributes } from 'react';

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
      <section
        ref={ref}
        className={`w-full max-w-screen-lg mx-auto py-6 px-4 md:py-10 md:px-7 ${className}`}
        {...props}
      >
        {/* 섹션 제목 */}
        <h2 className="mb-6 md:mb-8 text-3xl md:text-4xl font-bold font-maruBuri leading-tight text-[var(--color-text)]">
          {title}
        </h2>

        {/* 프로젝트 목록 */}
        <div className="space-y-6 md:space-y-8">
          {items.map(item => (
            <div
              key={item.id}
              className="flex border-l-4 border-[var(--color-secondary)] pl-4 md:pl-6"
            >
              <div className="flex-1 flex flex-col">
                {/* Top Row: Project Name + Period */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <h3 className="text-xl md:text-2xl font-semibold font-maruBuri leading-tight text-[var(--color-text)]">
                    {item.name}
                  </h3>
                  {item.period && (
                    <span className="mt-1 md:mt-0 text-base md:text-lg italic font-maruBuri leading-tight text-[var(--color-text)]">
                      {item.period}
                    </span>
                  )}
                </div>

                {/* Content Container */}
                <div className="mt-3 md:mt-4">
                  {/* 요약 */}
                  <p className="text-base md:text-lg font-maruBuri leading-relaxed text-[var(--color-text)]">
                    {item.summary}
                  </p>

                  {/* 설명 */}
                  <ul className="mt-2 md:mt-3 list-disc list-inside space-y-1">
                    <li className="text-sm md:text-base font-maruBuri leading-relaxed text-[var(--color-text)]">
                      {item.description}
                    </li>
                  </ul>

                  {/* 링크 및 수상 배지 */}
                  {(item.awards?.length ||
                    item.githubUrl ||
                    item.presentationUrl ||
                    item.blogUrl) && (
                    <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 md:gap-x-4">
                      {/* 수상 내역 */}
                      {item.awards?.map((award, index) =>
                        award.link ? (
                          <a
                            key={index}
                            href={award.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs md:text-sm font-maruBuri text-[var(--color-text)] highlight-underline highlight-underline-yellow"
                          >
                            <Trophy className="size-3 md:size-3.5" strokeWidth={2} />
                            {award.prize}
                          </a>
                        ) : (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 text-xs md:text-sm font-maruBuri text-[var(--color-text)] highlight-underline-yellow"
                          >
                            <Trophy className="size-3 md:size-3.5" strokeWidth={2} />
                            {award.prize}
                          </span>
                        ),
                      )}

                      {/* GitHub 링크 */}
                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs md:text-sm font-maruBuri text-[var(--color-text)] highlight-underline highlight-underline-purple"
                        >
                          <Github className="size-3 md:size-3.5" strokeWidth={2} />
                          GitHub
                        </a>
                      )}

                      {/* Presentation 링크 */}
                      {item.presentationUrl && (
                        <a
                          href={item.presentationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs md:text-sm font-maruBuri text-[var(--color-text)] highlight-underline highlight-underline-green"
                        >
                          <BarChart3 className="size-3 md:size-3.5" strokeWidth={2} />
                          Presentation
                        </a>
                      )}

                      {/* Blog 링크 */}
                      {item.blogUrl && (
                        <a
                          href={item.blogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs md:text-sm font-maruBuri text-[var(--color-text)] highlight-underline highlight-underline-blue"
                        >
                          <FileText className="size-3 md:size-3.5" strokeWidth={2} />
                          Blog
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  },
);

AboutProjects.displayName = 'AboutProjects';
