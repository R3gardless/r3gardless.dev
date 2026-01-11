import { Building2, FlaskConical } from 'lucide-react';
import React, { forwardRef, HTMLAttributes } from 'react';

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
        className={`w-full max-w-screen-lg mx-auto py-6 px-4 md:py-10 md:px-7 ${className}`}
        {...props}
      >
        {/* 섹션 제목 */}
        <h2 className="mb-6 md:mb-8 text-2xl font-bold font-maruBuri leading-tight">{title}</h2>

        {/* 경력 목록 with Timeline */}
        <div className="space-y-6 md:space-y-8">
          {items.map(item => {
            const Icon = item.type === 'research' ? FlaskConical : Building2;
            return (
              <div key={item.id} className="relative flex gap-4 md:gap-5">
                {/* Timeline: 점과 선 */}
                <div className="relative flex flex-col items-center">
                  {/* 점 */}
                  <div className="size-2.5 md:size-3 rounded-full bg-[var(--color-text)] flex-shrink-0 mt-2" />
                  {/* 선 - 모든 항목에 표시 */}
                  <div className="w-0.5 flex-1 bg-[var(--color-primary)]" />
                </div>

                {/* 콘텐츠 */}
                <div className="flex-1 min-w-0">
                  {/* Top Row: Icon + Company + Period */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="flex-shrink-0">
                        <Icon className="size-6 md:size-7" strokeWidth={2} />
                      </div>
                      <h3 className="text-xl font-bold font-maruBuri leading-tight">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-70 transition-opacity"
                          >
                            {item.company}
                          </a>
                        ) : (
                          item.company
                        )}
                      </h3>
                    </div>

                    <span className="mt-2 md:mt-0 pl-9 md:pl-0 text-left md:text-right italic font-maruBuri leading-tight">
                      {item.period}
                    </span>
                  </div>

                  {/* Content Container */}
                  <div className="pl-9 md:pl-11 mt-3 md:mt-4">
                    {/* 직책 */}
                    <p className="text-lg font-semibold font-maruBuri leading-relaxed">
                      {item.position}
                    </p>

                    {/* 업무 설명 */}
                    {item.description.length > 0 && (
                      <ul className="mt-2 md:mt-3 list-disc list-inside space-y-1">
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
