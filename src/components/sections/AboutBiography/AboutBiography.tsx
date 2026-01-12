'use client';

import { Github, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';
import React, { forwardRef, HTMLAttributes, useEffect, useState } from 'react';

import { ABOUT_BIOGRAPHY } from '@/constants';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

import { HandwrittenName } from '../../ui/about/HandwrittenName';

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  mail: Mail,
} as const;

export interface AboutBiographyProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  className?: string;
}

export const AboutBiography = forwardRef<HTMLElement, AboutBiographyProps>(
  ({ className = '', ...props }, ref) => {
    const [startTyping, setStartTyping] = useState(false);

    // 컴포넌트 마운트 후 타이핑 시작
    useEffect(() => {
      const timer = setTimeout(() => setStartTyping(true), 500);
      return () => clearTimeout(timer);
    }, []);

    const { displayedText, isComplete } = useTypingAnimation(ABOUT_BIOGRAPHY.bio, {
      speed: 25,
      delay: 0,
      enabled: startTyping,
    });

    return (
      <section
        ref={ref}
        className={`w-full max-w-screen-lg mx-auto py-6 px-6 md:px-8 ${className}`}
        {...props}
      >
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left Column: Profile Image and Social Links */}
          <div className="flex flex-col flex-shrink-0 items-center">
            {/* Profile Image with hover effect */}
            <div className="group size-32 md:size-40 bg-[var(--color-primary)] overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105">
              <Image
                src={ABOUT_BIOGRAPHY.profileImage.src}
                alt={ABOUT_BIOGRAPHY.profileImage.alt}
                width={160}
                height={160}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Social Links - Horizontal Layout below image, centered */}
            <div className="flex justify-center gap-4 mt-5 md:mt-6">
              {ABOUT_BIOGRAPHY.social.map(social => {
                const Icon = iconMap[social.icon as keyof typeof iconMap];
                return (
                  <a
                    key={social.icon}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="size-6 md:size-7 text-[var(--color-text)] hover:opacity-70 hover:scale-110 transition-all duration-200"
                  >
                    <Icon className="w-full h-full" strokeWidth={2} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column: Biography Content */}
          <div className="flex-1 max-w-2xl text-center md:text-left">
            {/* Name with handwriting animation */}
            <h2 className="text-3xl font-bold font-maruBuri leading-tight text-[var(--color-text)]">
              <HandwrittenName className="text-[var(--color-text)]" />
            </h2>
            <p className="text-lg font-semibold font-maruBuri leading-tight text-[var(--color-text)] mt-3 md:mt-4">
              {ABOUT_BIOGRAPHY.position}
            </p>
            {/* Bio with typing animation */}
            <p className="text-base font-maruBuri leading-relaxed text-[var(--color-text)] mt-5 md:mt-6 min-h-[4.5rem]">
              {displayedText}
              {/* Blinking cursor while typing */}
              {!isComplete && (
                <span className="inline-block w-0.5 h-4 ml-0.5 bg-[var(--color-text)] animate-pulse" />
              )}
            </p>
          </div>
        </div>
      </section>
    );
  },
);

AboutBiography.displayName = 'AboutBiography';
