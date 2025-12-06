'use client';

import { motion } from 'framer-motion';
import { User, Mail, Github, Linkedin } from 'lucide-react';
import React from 'react';

import { Heading, Text } from '@/components/ui/typography';
import { AUTHOR_CONFIG } from '@/constants';

export interface ProfileHeroProps {
  className?: string;
}

/**
 * ProfileHero Component
 * Displays the author's profile introduction with animations
 */
export function ProfileHero({ className = '' }: ProfileHeroProps) {
  const containerStyles = 'mx-auto mb-16';

  return (
    <section className={`${containerStyles} ${className}`} aria-label="Profile Introduction">
      <div className="text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <User className="size-24 mx-auto text-primary" />
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <Heading level={1} fontFamily="maruBuri" className="text-5xl md:text-6xl">
            {AUTHOR_CONFIG.name}
          </Heading>
        </motion.div>

        {/* Position and Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <Text fontFamily="maruBuri" className="text-xl md:text-2xl text-muted-foreground">
            {AUTHOR_CONFIG.position}
          </Text>
          <Text fontFamily="maruBuri" className="text-lg md:text-xl text-muted-foreground">
            @ {AUTHOR_CONFIG.team}
          </Text>
        </motion.div>

        {/* Job Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <Text fontFamily="maruBuri" className="text-base md:text-lg max-w-2xl mx-auto">
            {AUTHOR_CONFIG.jobDescription}
          </Text>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center gap-6"
        >
          <a
            href={`mailto:${AUTHOR_CONFIG.email}`}
            className="inline-flex items-center gap-2 hover:text-primary transition-colors focus:outline-none focus-visible:outline-none"
            aria-label="Email"
          >
            <Mail className="size-6" />
          </a>
          <a
            href={AUTHOR_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-primary transition-colors focus:outline-none focus-visible:outline-none"
            aria-label="GitHub"
          >
            <Github className="size-6" />
          </a>
          <a
            href={AUTHOR_CONFIG.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-primary transition-colors focus:outline-none focus-visible:outline-none"
            aria-label="LinkedIn"
          >
            <Linkedin className="size-6" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
