'use client';

import { Heading, Text } from '@/components/ui/typography';

export default function AboutHeader() {
  return (
    <section className="w-full transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <Heading level={1} fontFamily="maruBuri" className="text-6xl mb-10">
            About
          </Heading>
          <Text fontFamily="maruBuri">
            Developer who believes in clean code and continuous growth
          </Text>
        </div>
      </div>
    </section>
  );
}
