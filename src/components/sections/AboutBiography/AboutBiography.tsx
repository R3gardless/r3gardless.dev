'use client';

import { Mail } from 'lucide-react';
import Image from 'next/image';
import React, { forwardRef, HTMLAttributes } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { SiGithub } from 'react-icons/si';

import { Heading, Text } from '@/components/ui/typography';
import { ABOUT_BIOGRAPHY } from '@/constants';

import { HandwrittenName } from '../../ui/about/HandwrittenName';

const iconMap = {
  linkedin: FaLinkedin,
  github: SiGithub,
  mail: Mail,
} as const;

export interface AboutBiographyProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  className?: string;
}

export const AboutBiography = forwardRef<HTMLElement, AboutBiographyProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <section ref={ref} className={`w-full py-10 md:py-12 ${className}`} {...props}>
        <div className="grid gap-8 md:grid-cols-[180px_1fr] md:gap-12">
          {/* Left Column: Profile Image and Social Links */}
          <div className="flex flex-col items-start">
            {/* Profile Image with hover effect */}
            <div className="size-32 overflow-hidden rounded-md bg-[var(--color-primary)] md:size-40">
              <Image
                src={ABOUT_BIOGRAPHY.profileImage.src}
                alt={ABOUT_BIOGRAPHY.profileImage.alt}
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Social Links - Horizontal Layout below image, centered */}
            <div className="mt-5 flex justify-center gap-4 md:mt-6">
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
                    className="size-5 text-[var(--color-text)]/68 transition-opacity duration-200 hover:opacity-100 focus:outline-none focus-visible:outline-none md:size-6"
                  >
                    <Icon className="w-full h-full" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right Column: Biography Content */}
          <div className="max-w-2xl">
            {/* Name with handwriting animation */}
            <Heading level={1}>
              <HandwrittenName />
            </Heading>
            <Text fontFamily="maruBuri" className="mt-3 text-lg font-semibold leading-tight">
              {ABOUT_BIOGRAPHY.position}
            </Text>
            <Text className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--color-text)]/72 md:mt-6">
              {ABOUT_BIOGRAPHY.bio}
            </Text>
          </div>
        </div>
      </section>
    );
  },
);

AboutBiography.displayName = 'AboutBiography';
