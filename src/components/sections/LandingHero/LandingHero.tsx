'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { getSiteConfig } from '@/utils/config';
import { Heading, Text, Italic } from '@/components/ui/typography';

export interface LandingHeroProps {
  className?: string;
}

export function LandingHero({ className = '' }: LandingHeroProps) {
  const { site, author } = getSiteConfig();
  const [currentExploringIndex, setCurrentExploringIndex] = useState(0);
  const [titleDisplayedText, setTitleDisplayedText] = useState('');
  const [titleIsDeleting, setTitleIsDeleting] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const currentlyExploringList = author.interests;

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
          if (titleDisplayedText.length < site.name.length) {
            setTitleDisplayedText(site.name.slice(0, titleDisplayedText.length + 1));
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
  }, [titleDisplayedText, titleIsDeleting, titleVisible, site.name]);

  // Currently Exploring 단어 변경 애니메이션 (나타났다 사라지는 효과)
  useEffect(() => {
    if (currentlyExploringList.length === 0) return; // Guard against empty list
    const interval = setInterval(() => {
      setCurrentExploringIndex(prev => (prev + 1) % currentlyExploringList.length);
    }, 3000); // 3초마다 변경

    return () => {
      clearInterval(interval);
    };
  }, [currentlyExploringList.length]);

  return (
    <section className={`mt-20 mb-10 ${className}`} aria-label="Landing Introduction">
      <div className="mx-auto">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
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
          className="mb-12"
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
        >
          <Text fontFamily="maruBuri" className="leading-relaxed mb-3">
            {author.position} @ <span className="font-bold">{author.team}</span>
          </Text>
          <Text fontFamily="maruBuri" className="leading-relaxed mb-3">
            {author.job_description}
          </Text>
          <Italic fontFamily="maruBuri" className="leading-relaxed">
            {author.philosophy}
          </Italic>
        </motion.div>

        {/* Currently Exploring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          className="mb-10"
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

        {/* More About Me Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5 }}
        >
          <motion.a
            href="/about"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 transition-colors group focus:outline-none focus-visible:outline-none hover:opacity-80"
          >
            <Text
              fontFamily="maruBuri"
              className="font-medium group-hover:font-bold transition-all duration-200"
            >
              More About Me
            </Text>
            <motion.span
              className="group-hover:translate-x-1 transition-transform font-maruBuri"
              whileHover={{ x: 3 }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
