'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { SiGithub } from 'react-icons/si';

import { Heading, Text } from '@/components/ui/typography';
import { SITE_CONFIG, AUTHOR_CONFIG } from '@/constants';

export interface LandingHeroProps {
  className?: string;
}

export function LandingHero({ className = '' }: LandingHeroProps) {
  const [currentExploringIndex, setCurrentExploringIndex] = useState(0);
  const [titleDisplayedText, setTitleDisplayedText] = useState('');
  const [titleIsDeleting, setTitleIsDeleting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const currentlyExploringList = AUTHOR_CONFIG.interests;

  // 패럴랙스 스크롤 효과
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // 다층 패럴랙스 효과 (레이어별 다른 속도)
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const descriptionY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const exploringY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const linkY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  // 타이틀 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleVisible(true);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Site name 타이핑 애니메이션
  useEffect(() => {
    if (!titleVisible) return;

    const timeout = setTimeout(
      () => {
        if (!titleIsDeleting) {
          if (titleDisplayedText.length < SITE_CONFIG.name.length) {
            setTitleDisplayedText(SITE_CONFIG.name.slice(0, titleDisplayedText.length + 1));
          } else {
            // 텍스트 완성 후 잠시 대기
            setTimeout(() => {
              setTitleIsDeleting(true);
            }, 3000);
          }
        } else {
          // 첫 글자는 항상 남기고, 2글자 이상일 때만 삭제
          if (titleDisplayedText.length > 1) {
            setTitleDisplayedText(
              titleDisplayedText.slice(0, Math.max(1, titleDisplayedText.length - 1)),
            );
          } else {
            setTitleIsDeleting(false);
          }
        }
      },
      titleIsDeleting ? 50 : 100,
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [titleDisplayedText, titleIsDeleting, titleVisible]);

  // Currently Exploring 단어 변경 애니메이션 (나타났다 사라지는 효과)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExploringIndex(prev => (prev + 1) % currentlyExploringList.length);
    }, 3000); // 3초마다 변경

    return () => {
      clearInterval(interval);
    };
  }, [currentlyExploringList.length]);

  const containerStyles = 'mx-auto my-20';

  return (
    <section
      ref={containerRef}
      className={`${containerStyles} ${className}`}
      aria-label="Landing Introduction"
    >
      <motion.div style={{ opacity: heroOpacity }}>
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
          style={{ y: titleY }}
        >
          <Text fontFamily="maruBuri" className="font-bold text-lg">
            👋 This is
          </Text>
        </motion.div>

        {/* Site Title with Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: titleVisible ? 1 : 0, y: titleVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12 overflow-hidden"
          style={{ y: titleY }}
        >
          <Heading level={1} fontFamily="maruBuri" className="text-6xl">
            {titleVisible && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="inline-flex items-center"
              >
                {titleDisplayedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1 h-12 md:h-16 ml-2"
                />
              </motion.span>
            )}
          </Heading>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mb-10"
          style={{ y: descriptionY }}
        >
          <Text fontFamily="maruBuri" className="mb-3">
            {AUTHOR_CONFIG.position} @{' '}
            <span className="font-bold text-lg">{AUTHOR_CONFIG.team}</span>
          </Text>
          <Text fontFamily="maruBuri" className="mb-3">
            {AUTHOR_CONFIG.jobDescription}
          </Text>
          <Text fontFamily="maruBuri" className="italic">
            {AUTHOR_CONFIG.philosophy}
          </Text>
        </motion.div>

        {/* Currently Exploring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mb-10"
          style={{ y: exploringY }}
        >
          <div className="flex flex-row items-center">
            <Text fontFamily="maruBuri">🔍 Currently Exploring on</Text>
            <div className="flex items-center ml-1">
              <Text fontFamily="maruBuri" className="font-bold text-xl">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentExploringIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    {currentlyExploringList[currentExploringIndex]}
                  </motion.span>
                </AnimatePresence>
              </Text>
            </div>
          </div>
        </motion.div>

        {/* About Me 버튼 + 소셜 링크 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5 }}
          style={{ y: linkY }}
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* About Me 채운 버튼 (라이트/다크 반전) */}
            <Link
              href="/about"
              aria-label="About Me"
              className="group inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-text)] px-5 py-2.5 text-[color:var(--color-text-clicked)] transition-transform duration-300 ease-out hover:scale-[1.03] focus:outline-none focus-visible:outline-none"
            >
              <span className="font-maruBuri font-semibold">About Me</span>
              <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* GitHub */}
            <a
              href={AUTHOR_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="inline-flex size-10 items-center justify-center rounded-lg text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-text)] focus:outline-none focus-visible:outline-none"
            >
              <SiGithub className="size-5" aria-hidden="true" />
            </a>

            {/* LinkedIn */}
            <a
              href={AUTHOR_CONFIG.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex size-10 items-center justify-center rounded-lg text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-text)] focus:outline-none focus-visible:outline-none"
            >
              <FaLinkedin className="size-5" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
