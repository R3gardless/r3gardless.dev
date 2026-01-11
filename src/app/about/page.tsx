import { Metadata } from 'next';

import { AboutWorkExperience } from '@/components/sections/AboutWorkExperience';
import { ABOUT_WORK_EXPERIENCE } from '@/constants/about';

export const metadata: Metadata = {
  title: 'About - r3gardless.dev',
  description: 'Learn more about developer r3gardless.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Work Experience Section */}
        <AboutWorkExperience
          title={ABOUT_WORK_EXPERIENCE.title}
          items={ABOUT_WORK_EXPERIENCE.items}
        />
      </div>
    </div>
  );
}
