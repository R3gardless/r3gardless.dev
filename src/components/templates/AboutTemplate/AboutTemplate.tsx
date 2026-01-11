'use client';

import React from 'react';

import { AboutBiography } from '@/components/sections/AboutBiography';
import { AboutEducation, AboutEducationProps } from '@/components/sections/AboutEducation';
import AboutHeader from '@/components/sections/AboutHeader/AboutHeader';
import { AboutProjects, AboutProjectsProps } from '@/components/sections/AboutProjects';
import {
  AboutWorkExperience,
  AboutWorkExperienceProps,
} from '@/components/sections/AboutWorkExperience';

export interface AboutTemplateProps {
  /**
   * Education 섹션 props
   */
  education: AboutEducationProps;

  /**
   * Work Experience 섹션 props
   */
  workExperience: AboutWorkExperienceProps;

  /**
   * Projects 섹션 props
   */
  projects: AboutProjectsProps;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * AboutTemplate 컴포넌트
 *
 * About 페이지의 전체 레이아웃을 담당하는 template 컴포넌트
 * - AboutHeader: 페이지 제목
 * - AboutBiography: 프로필 정보
 * - AboutEducation: 학력 정보
 * - AboutWorkExperience: 경력 정보
 * - AboutProjects: 프로젝트 정보
 */
export const AboutTemplate: React.FC<AboutTemplateProps> = ({
  education,
  workExperience,
  projects,
  className = '',
}) => {
  // 기본 컨테이너 스타일 - 1024px 고정 너비 (BlogTemplate과 동일)
  const containerStyles = 'w-full max-w-[1024px] mx-auto my-20 px-3';

  // 헤더 스타일 - 전체 너비
  const headerStyles = 'w-full mb-8 lg:mb-12';

  return (
    <div className={`${containerStyles} ${className}`}>
      {/* Header Section */}
      <header className={headerStyles}>
        <AboutHeader />
      </header>

      {/* Biography Section */}
      <AboutBiography />

      {/* Education Section */}
      <AboutEducation {...education} />

      {/* Work Experience Section */}
      <AboutWorkExperience {...workExperience} />

      {/* Projects Section */}
      <AboutProjects {...projects} />
    </div>
  );
};

export default AboutTemplate;
