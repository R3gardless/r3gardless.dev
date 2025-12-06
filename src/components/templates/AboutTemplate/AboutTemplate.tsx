'use client';

import React from 'react';

import { ProfileHero } from '@/components/sections/ProfileHero';
import { ProfileInfo } from '@/components/sections/ProfileInfo';

/**
 * AboutTemplate Component Props
 */
export interface AboutTemplateProps {
  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * AboutTemplate Component
 * Template component for the About/Profile page
 * Follows the project structure with ProfileHero and ProfileInfo sections
 */
export const AboutTemplate = ({ className = '' }: AboutTemplateProps) => {
  const containerStyles = 'min-h-screen max-w-[1024px] mx-auto my-20 px-3';

  return (
    <div className={`${containerStyles} ${className}`}>
      <main className="flex-1">
        {/* Profile Hero Section */}
        <ProfileHero className="w-full max-w-[1024px] mx-auto" />

        {/* Profile Info Section */}
        <ProfileInfo className="w-full max-w-[1024px] mx-auto" />
      </main>
    </div>
  );
};

export default AboutTemplate;
