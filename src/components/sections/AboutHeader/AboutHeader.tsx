'use client';

import { Heading, Text } from '@/components/ui/typography';

export default function AboutHeader() {
  return (
    <section className="w-full transition-colors duration-300">
      <div className="max-w-3xl">
        <Text className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text)]/55">
          About
        </Text>
        <Heading level={1} fontFamily="maruBuri" className="text-4xl leading-tight md:text-5xl">
          Database engineer building reliable systems and readable notes.
        </Heading>
        <Text className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--color-text)]/72 md:text-lg">
          I work around PostgreSQL, distributed databases, automation, and the tooling that keeps
          engineering work reproducible.
        </Text>
      </div>
    </section>
  );
}
