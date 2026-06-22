import { Building2, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import React, { forwardRef, HTMLAttributes } from 'react';

import { Heading, Text } from '@/components/ui/typography';

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
      <section ref={ref} className={`w-full py-10 md:py-12 ${className}`} {...props}>
        {/* 섹션 제목 */}
        <div className="mb-8 md:mb-10">
          <Heading level={3} fontFamily="maruBuri" className="leading-tight">
            {title}
          </Heading>
        </div>

        {/* 경력 목록 with Timeline */}
        <div className="space-y-10">
          {items.map(item => {
            const Icon = item.type === 'research' ? FlaskConical : Building2;
            const isCurrentJob = item.period.toLowerCase().includes('present');
            return (
              <div key={item.id} className="relative grid gap-3 md:grid-cols-[1fr_11rem] md:gap-8">
                {/* Timeline: 점과 선 */}
                <div className="flex min-w-0 gap-4">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`mt-2 size-2.5 flex-shrink-0 rounded-full ${
                        isCurrentJob
                          ? 'bg-[var(--color-primary-clicked)]'
                          : 'bg-[var(--color-text)]'
                      }`}
                    />
                    <div className="w-px flex-1 bg-[var(--color-primary)]" />
                  </div>

                  {/* Top Row: Icon + Company + Period */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-1 size-5 flex-shrink-0" strokeWidth={2} />
                      <Heading level={4} fontFamily="maruBuri">
                        {item.link ? (
                          <Link
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-opacity hover:opacity-70"
                          >
                            {item.company}
                          </Link>
                        ) : (
                          item.company
                        )}
                      </Heading>
                    </div>

                    {/* Content Container */}
                    {/* 직책 */}
                    <Heading
                      level={5}
                      className="mt-2 pl-8 text-base leading-6 text-[color:var(--color-text)]/78"
                    >
                      {item.position}
                    </Heading>

                    {/* 업무 설명 */}
                    {item.description.length > 0 && (
                      <ul className="mt-3 list-disc space-y-1 pl-12">
                        {item.description.map((desc, descIndex) => (
                          <li
                            key={descIndex}
                            className="font-pretendard text-base leading-7 text-[color:var(--color-text)]/72"
                          >
                            {desc}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <Text className="pl-14 text-sm leading-6 text-[color:var(--color-text)]/58 md:pl-0 md:text-right">
                  {item.period}
                </Text>
              </div>
            );
          })}
        </div>
      </section>
    );
  },
);

AboutWorkExperience.displayName = 'AboutWorkExperience';
