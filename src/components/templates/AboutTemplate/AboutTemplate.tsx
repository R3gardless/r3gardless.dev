'use client';

import { motion, useInView } from 'framer-motion';
import { Briefcase, FolderOpen, GraduationCap, User } from 'lucide-react';
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

import { AboutBiography } from '@/components/sections/AboutBiography';
import { AboutEducation, AboutEducationProps } from '@/components/sections/AboutEducation';
import AboutHeader from '@/components/sections/AboutHeader/AboutHeader';
import { AboutProjects, AboutProjectsProps } from '@/components/sections/AboutProjects';
import {
  AboutWorkExperience,
  AboutWorkExperienceProps,
} from '@/components/sections/AboutWorkExperience';

/** 섹션 네비게이션 항목 */
const SECTION_NAV_ITEMS = [
  { id: 'biography', label: 'About Me', icon: <User className="size-4" /> },
  { id: 'education', label: 'Education', icon: <GraduationCap className="size-4" /> },
  { id: 'work', label: 'Experience', icon: <Briefcase className="size-4" /> },
  { id: 'projects', label: 'Projects', icon: <FolderOpen className="size-4" /> },
];

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
 * 패럴랙스 스크롤 애니메이션 섹션 래퍼
 */
interface AnimatedSectionProps {
  children: React.ReactNode;
  index: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="border-t border-[color:var(--color-primary)]"
    >
      {children}
    </motion.div>
  );
};

/**
 * 섹션 네비게이션 (책갈피 스타일)
 */
interface SectionNavProps {
  sections: { id: string; label: string; icon: React.ReactNode }[];
  activeSection: string;
  onNavigate: (id: string) => void;
}

const SectionNav: React.FC<SectionNavProps> = ({ sections, activeSection, onNavigate }) => {
  return (
    <nav className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 xl:flex">
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          onClick={() => onNavigate(section.id)}
          className={`group flex cursor-pointer items-center gap-2 border-r-2 px-3 py-2 text-right transition-all duration-200 ${
            activeSection === section.id
              ? 'border-[color:var(--color-text)] text-[color:var(--color-text)]'
              : 'border-transparent text-[color:var(--color-text)]/45 hover:border-[color:var(--color-primary-clicked)] hover:text-[color:var(--color-text)]'
          }`}
          aria-label={`${section.label} 섹션으로 이동`}
        >
          <span className="transition-colors">{section.icon}</span>
          <span
            className={`whitespace-nowrap font-maruBuri text-sm transition-all duration-200 ${
              activeSection === section.id ? 'font-bold' : ''
            }`}
          >
            {section.label}
          </span>
        </motion.button>
      ))}
    </nav>
  );
};

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
  const [activeSection, setActiveSection] = useState('biography');

  // 섹션 refs
  const biographyRef = useRef<HTMLElement>(null);
  const educationRef = useRef<HTMLElement>(null);
  const workExperienceRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);

  // ref 맵핑 (안정적인 참조 유지)
  const sectionRefs = useMemo(
    () => ({
      biography: biographyRef,
      education: educationRef,
      work: workExperienceRef,
      projects: projectsRef,
    }),
    [],
  );

  // 스크롤 위치에 따른 활성 섹션 감지
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 200;

    // sections 배열에서 ID 추출하여 중복 제거
    for (let i = SECTION_NAV_ITEMS.length - 1; i >= 0; i--) {
      const id = SECTION_NAV_ITEMS[i].id as keyof typeof sectionRefs;
      const ref = sectionRefs[id];
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const offsetTop = window.scrollY + rect.top;
        if (scrollPosition >= offsetTop) {
          setActiveSection(id);
          break;
        }
      }
    }
  }, [sectionRefs]);

  useEffect(() => {
    // 초기 스크롤 위치 계산을 다음 렌더링 프레임으로 지연 (DOM 완전 렌더링 후 실행)
    const frameId = window.requestAnimationFrame(() => {
      handleScroll();
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // 섹션으로 스크롤 이동
  const handleNavigate = (id: string) => {
    const ref = sectionRefs[id as keyof typeof sectionRefs];
    if (ref?.current) {
      const headerOffset = 120;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // 기본 컨테이너 스타일
  const containerStyles = 'w-full max-w-[1024px] mx-auto my-20 px-4 md:px-6';

  // 헤더 스타일
  const headerStyles = 'w-full mb-14 lg:mb-16';

  return (
    <>
      {/* 섹션 네비게이션 (책갈피) */}
      <SectionNav
        sections={SECTION_NAV_ITEMS}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <div className={`${containerStyles} ${className}`}>
        {/* Header Section with fade-in */}
        <motion.header
          className={headerStyles}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AboutHeader />
        </motion.header>

        {/* 콘텐츠 영역 */}
        <div>
          {/* Biography Section */}
          <AnimatedSection index={0}>
            <AboutBiography ref={biographyRef} />
          </AnimatedSection>

          {/* Education Section */}
          <AnimatedSection index={1}>
            <AboutEducation ref={educationRef} {...education} />
          </AnimatedSection>

          {/* Work Experience Section */}
          <AnimatedSection index={2}>
            <AboutWorkExperience ref={workExperienceRef} {...workExperience} />
          </AnimatedSection>

          {/* Projects Section */}
          <AnimatedSection index={3}>
            <AboutProjects ref={projectsRef} {...projects} />
          </AnimatedSection>
        </div>
      </div>
    </>
  );
};

export default AboutTemplate;
