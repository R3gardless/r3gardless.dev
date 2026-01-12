import { Building2, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import React, { forwardRef, HTMLAttributes } from 'react';

import { Heading } from '@/components/ui/typography';

export interface WorkExperienceItemProps {
  /**
   * 고유 ID
   */
  id: string;

  /**
   * 회사명
   */
  company: string;

  /**
   * 회사 링크 (선택사항)
   */
  link?: string;

  /**
   * 직책/포지션
   */
  position: string;

  /**
   * 근무 기간
   */
  period: string;

  /**
   * 업무 설명 (여러 줄)
   */
  description: readonly string[];

  /**
   * 경력 타입 (work: 일반 직장, research: 연구)
   * @default 'work'
   */
  type?: 'work' | 'research';
}

export interface AboutWorkExperienceProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * 섹션 제목
   */
  title: string;

  /**
   * 경력 아이템 목록
   */
  items: readonly WorkExperienceItemProps[];

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * AboutWorkExperience 컴포넌트
 * About 페이지의 Work Experience 섹션을 표시하는 organism 컴포넌트
 */
export const AboutWorkExperience = forwardRef<HTMLElement, AboutWorkExperienceProps>(
  ({ title, items, className = '', ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={`w-full max-w-screen-lg mx-auto py-6 px-6 md:px-8 ${className}`}
        {...props}
      >
        {/* 섹션 제목 */}
        <div className="mb-8 md:mb-10">
          <Heading level={3} fontFamily="maruBuri" className="leading-tight">
            {title}
          </Heading>
        </div>

        {/* 경력 목록 with Timeline */}
        <div className="space-y-8 md:space-y-10">
          {items.map(item => {
            const Icon = item.type === 'research' ? FlaskConical : Building2;
            const isCurrentJob = item.period.toLowerCase().includes('present');
            return (
              <div key={item.id} className="relative flex gap-4 md:gap-5">
                {/* Timeline: 점과 선 */}
                <div className="relative flex flex-col items-center">
                  {/* 점 - 현재 진행 중이면 pulse 애니메이션 */}
                  <div
                    className={`size-2.5 rounded-full flex-shrink-0 mt-2 ${isCurrentJob ? 'bg-green-500 animate-pulse' : 'bg-[var(--color-text)]'}`}
                  />
                  {/* 선 - 모든 항목에 표시 */}
                  <div className="w-0.5 flex-1 bg-[var(--color-primary)]" />
                </div>

                {/* 콘텐츠 */}
                <div className="flex-1 min-w-0">
                  {/* Top Row: Icon + Company + Period */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="size-6" strokeWidth={2.5} />
                      </div>
                      <Heading level={4} fontFamily="maruBuri">
                        {item.link ? (
                          <Link
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-70 transition-opacity"
                          >
                            {item.company}
                          </Link>
                        ) : (
                          item.company
                        )}
                      </Heading>
                    </div>

                    <span className="mt-3 md:mt-0 pl-9 md:pl-0 text-left md:text-right italic font-maruBuri leading-tight">
                      {item.period}
                    </span>
                  </div>

                  {/* Content Container */}
                  <div className="pl-9 md:pl-11 mt-3">
                    {/* 직책 */}
                    <Heading level={5} fontFamily="maruBuri">
                      {item.position}
                    </Heading>

                    {/* 업무 설명 */}
                    {item.description.length > 0 && (
                      <ul className="mt-2 list-disc list-inside space-y-1">
                        {item.description.map((desc, descIndex) => (
                          <li key={descIndex} className="font-maruBuri leading-relaxed">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  },
);

AboutWorkExperience.displayName = 'AboutWorkExperience';
