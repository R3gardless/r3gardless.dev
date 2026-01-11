import { Metadata } from 'next';

import { AboutTemplate } from '@/components/templates/AboutTemplate';
import { ABOUT_EDUCATION, ABOUT_PROJECTS, ABOUT_WORK_EXPERIENCE } from '@/constants/about';

export const metadata: Metadata = {
  title: 'About - r3gardless.dev',
  description: 'Learn more about developer r3gardless.',
};

export default function AboutPage() {
  return (
    <AboutTemplate
      education={{
        title: ABOUT_EDUCATION.title,
        items: ABOUT_EDUCATION.items,
      }}
      workExperience={{
        title: ABOUT_WORK_EXPERIENCE.title,
        items: ABOUT_WORK_EXPERIENCE.items,
      }}
      projects={{
        title: ABOUT_PROJECTS.title,
        items: ABOUT_PROJECTS.items,
      }}
    />
  );
}
