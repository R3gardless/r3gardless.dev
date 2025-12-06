import { Metadata } from 'next';

import { AboutTemplate } from '@/components/templates/AboutTemplate';

export const metadata: Metadata = {
  title: 'About - r3gardless.dev',
  description: 'Learn more about developer r3gardless.',
};

export default function AboutPage() {
  return <AboutTemplate />;
}
