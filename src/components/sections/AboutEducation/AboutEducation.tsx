import { GraduationCap, School } from 'lucide-react';
import React, { forwardRef, HTMLAttributes } from 'react';

export interface EducationItem {
  /**
   * 교육 기관 고유 ID
   */
  id: string;

  /**
   * 아이콘 타입
   */
  icon: 'graduation-cap' | 'school';

  /**
   * 교육 기관 이름
   */
  institution: string;

  /**
   * 교육 기관 링크 (선택사항)
   */
  link?: string;

  /**
   * 학위 또는 전공 (선택사항)
   */
  degree?: string;

  /**
   * 기간
   */
  period: string;

  /**
   * 추가 상세 정보 (선택사항)
   */
  details?: readonly string[];
}

export interface AboutEducationProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * 섹션 제목
   */
  title: string;

  /**
   * 교육 기관 목록
   */
  items: readonly EducationItem[];

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * AboutEducation 컴포넌트
 * About 페이지의 Education 섹션을 표시하는 organism 컴포넌트
 */
export const AboutEducation = forwardRef<HTMLElement, AboutEducationProps>(
  ({ title, items, className = '', ...props }, ref) => {
    const iconMap = {
      'graduation-cap': GraduationCap,
      school: School,
    };

    return (
      <section
        ref={ref}
        className={`w-full max-w-screen-lg mx-auto py-6 px-4 md:py-10 md:px-7 ${className}`}
        {...props}
      >
        {/* Section Title */}
        <h2 className="mb-6 md:mb-8 text-2xl font-bold font-maruBuri leading-tight">{title}</h2>

        {/* Education Items */}
        <div className="space-y-6 md:space-y-8">
          {items.map(item => {
            const IconComponent = iconMap[item.icon];

            return (
              <div key={item.id} className="flex flex-col">
                {/* Top Row: Icon + Institution + Period */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                      <IconComponent className="size-6 md:size-7" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold font-maruBuri leading-tight">
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-70 transition-opacity"
                        >
                          {item.institution}
                        </a>
                      ) : (
                        item.institution
                      )}
                    </h3>
                  </div>

                  <span className="mt-2 md:mt-0 pl-9 md:pl-0 text-left md:text-right italic font-maruBuri leading-tight">
                    {item.period}
                  </span>
                </div>

                {/* Content Container (Indented to align with Institution Text) */}
                <div className="pl-9 md:pl-11 mt-3 md:mt-4">
                  {/* Degree */}
                  {item.degree && (
                    <p className="text-lg font-semibold font-maruBuri leading-relaxed">
                      {item.degree}
                    </p>
                  )}

                  {/* Details */}
                  {item.details && item.details.length > 0 && (
                    <ul className="mt-2 md:mt-3 list-disc list-inside space-y-1">
                      {item.details.map((detail, index) => (
                        <li key={index} className="text-base font-maruBuri leading-relaxed">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  },
);

AboutEducation.displayName = 'AboutEducation';
