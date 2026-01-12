'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
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

/** 패럴랙스 기본 속도 - 첫 번째 섹션의 패럴랙스 강도 */
const BASE_PARALLAX_SPEED = 0.15;
/** 패럴랙스 속도 증가분 - 각 섹션마다 추가되는 패럴랙스 강도 (깊이감 연출) */
const PARALLAX_SPEED_INCREMENT = 0.05;
/** 패럴랙스 이동 거리 배율 */
const PARALLAX_DISTANCE_MULTIPLIER = 60;

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

  // 패럴랙스 스크롤 효과
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 각 섹션별로 다른 패럴랙스 속도 적용 (깊이감 연출)
  const parallaxSpeed = BASE_PARALLAX_SPEED + index * PARALLAX_SPEED_INCREMENT;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxSpeed * PARALLAX_DISTANCE_MULTIPLIER, parallaxSpeed * -PARALLAX_DISTANCE_MULTIPLIER],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.96, 1, 1, 0.96]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="rounded-lg bg-[var(--color-primary)]/10 backdrop-blur-sm shadow-sm shadow-black/10 dark:shadow-white/10 hover:shadow-md hover:shadow-black/15 dark:hover:shadow-white/15 transition-shadow duration-300"
    >
      <motion.div style={{ y, opacity, scale }}>{children}</motion.div>
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
    <nav className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2">
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          onClick={() => onNavigate(section.id)}
          className={`group flex items-center gap-2 p-2 rounded-l-lg cursor-pointer transition-all duration-300 ${
            activeSection === section.id
              ? 'bg-[var(--color-primary)] pr-4'
              : 'hover:bg-[var(--color-primary)]/30 hover:pr-4'
          }`}
          aria-label={`${section.label} 섹션으로 이동`}
        >
          <span
            className={`transition-colors ${
              activeSection === section.id
                ? 'text-[var(--color-text)]'
                : 'text-[var(--color-text)]/50'
            }`}
          >
            {section.icon}
          </span>
          <span
            className={`text-sm font-maruBuri whitespace-nowrap overflow-hidden transition-all duration-300 ${
              activeSection === section.id
                ? 'max-w-24 opacity-100 font-bold'
                : 'max-w-0 opacity-0 group-hover:max-w-24 group-hover:opacity-100'
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

  // 섹션 정보 (ref 제외 - 렌더링용)
  const sections = [
    { id: 'biography', label: 'About Me', icon: <User className="size-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="size-4" /> },
    { id: 'work', label: 'Experience', icon: <Briefcase className="size-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen className="size-4" /> },
  ];

  // 스크롤 위치에 따른 활성 섹션 감지
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 200;

    // sections 배열에서 ID 추출하여 중복 제거
    for (let i = sections.length - 1; i >= 0; i--) {
      const id = sections[i].id as keyof typeof sectionRefs;
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
  const containerStyles = 'w-full max-w-[1024px] mx-auto my-20 px-3';

  // 헤더 스타일
  const headerStyles = 'w-full mb-10 lg:mb-12';

  return (
    <>
      {/* 섹션 네비게이션 (책갈피) */}
      <SectionNav sections={sections} activeSection={activeSection} onNavigate={handleNavigate} />

      <div className={`${containerStyles} ${className}`}>
        {/* Header Section with fade-in */}
        <motion.header
          className={headerStyles}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AboutHeader />
        </motion.header>

        {/* 콘텐츠 영역 */}
        <div className="space-y-8 md:space-y-12">
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
