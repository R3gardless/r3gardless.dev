import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

import { Heading, Caption, DateText } from '@/components/ui/typography';
import { getSiteConfig } from '@/utils/config';

export interface FooterProps {
  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * 웹사이트 하단 푸터 컴포넌트
 * 사이트 정보, 연락처, 저작권 정보를 표시
 */
export const Footer = ({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const siteConfig = getSiteConfig();

  // 빌드 시점의 날짜를 기본값으로 사용 (SSG)
  const buildDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <footer className={`border-t border-[color:var(--color-primary)] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex justify-between items-center gap-8">
          {/* 왼쪽 섹션: 사이트 정보 */}
          <div className="flex flex-col gap-4">
            {/* 사이트 제목과 위치 정보 */}
            <div className="flex items-center gap-4">
              <Heading level={2} fontFamily="maruBuri">
                {siteConfig.site.name}
              </Heading>
            </div>

            {/* 업데이트 정보 */}
            <DateText fontFamily="maruBuri" className="font-normal">
              Last Update is {buildDate}
            </DateText>

            {/* 저작권 정보 */}
            <Caption fontFamily="maruBuri" className="font-normal">
              © {currentYear} <span className="font-bold">{siteConfig.author.name}</span>. Powered
              by <span className="font-bold"> Next.js</span>
            </Caption>
          </div>

          {/* 오른쪽 섹션: 연락처 */}
          <div className="flex flex-col gap-4 items-center">
            <Heading level={3} fontFamily="maruBuri" className="text-center">
              Contact
            </Heading>

            {/* 소셜 링크들 */}
            <div className="flex gap-4">
              <a
                href={siteConfig.author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center size-6 text-[color:var(--color-text)] hover:text-[color:var(--color-primary-clicked)] transition-colors focus:outline-none focus-visible:outline-none"
                aria-label="LinkedIn 프로필"
              >
                <Linkedin className="size-5" strokeWidth={2} />
              </a>

              <a
                href={siteConfig.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center size-6 text-[color:var(--color-text)] hover:text-[color:var(--color-primary-clicked)] transition-colors focus:outline-none focus-visible:outline-none"
                aria-label="GitHub 프로필"
              >
                <Github className="size-5" strokeWidth={2} />
              </a>

              <a
                href={`mailto:${siteConfig.author.email}`}
                className="inline-flex items-center justify-center size-6 text-[color:var(--color-text)] hover:text-[color:var(--color-primary-clicked)] transition-colors focus:outline-none focus-visible:outline-none"
                aria-label="이메일 보내기"
              >
                <Mail className="size-5" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
