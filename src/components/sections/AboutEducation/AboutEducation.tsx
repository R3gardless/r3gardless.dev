import { GraduationCap, School } from 'lucide-react';
import Link from 'next/link';
import React, { forwardRef, HTMLAttributes } from 'react';

import { Heading, Text } from '@/components/ui/typography';

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
      <section ref={ref} className={`w-full py-10 md:py-12 ${className}`} {...props}>
        {/* Section Title */}
        <div className="mb-8 md:mb-10">
          <Heading level={3} fontFamily="maruBuri" className="leading-tight">
            {title}
          </Heading>
        </div>

        {/* Education Items */}
        <div className="space-y-8">
          {items.map(item => {
            const IconComponent = iconMap[item.icon];

            return (
              <div key={item.id} className="grid gap-3 md:grid-cols-[1fr_11rem] md:gap-8">
                {/* Top Row: Icon + Institution + Period */}
                <div>
                  <div className="flex items-start gap-3">
                    <IconComponent className="mt-1 size-5 flex-shrink-0" strokeWidth={2} />
                    <div>
                      <Heading level={4} fontFamily="maruBuri">
                        {item.link ? (
                          <Link
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-opacity hover:opacity-70"
                          >
                            {item.institution}
                          </Link>
                        ) : (
                          item.institution
                        )}
                      </Heading>

                      {/* Degree */}
                      {item.degree && (
                        <Heading
                          level={5}
                          className="mt-2 text-base leading-6 text-[color:var(--color-text)]/78"
                        >
                          {item.degree}
                        </Heading>
                      )}

                      {/* Details */}
                      {item.details && item.details.length > 0 && (
                        <ul className="mt-3 list-disc space-y-1 pl-5">
                          {item.details.map((detail, index) => (
                            <li
                              key={index}
                              className="font-pretendard text-base leading-7 text-[color:var(--color-text)]/72"
                            >
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <Text className="pl-8 text-sm leading-6 text-[color:var(--color-text)]/58 md:pl-0 md:text-right">
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

AboutEducation.displayName = 'AboutEducation';
