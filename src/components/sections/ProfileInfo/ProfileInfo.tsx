'use client';

import { motion } from 'framer-motion';
import { Heart, Lightbulb, Target } from 'lucide-react';
import React from 'react';

import { Heading, Text } from '@/components/ui/typography';
import { AUTHOR_CONFIG } from '@/constants';

export interface ProfileInfoProps {
  className?: string;
}

/**
 * ProfileInfo Component
 * Displays detailed information about the author's philosophy and interests
 */
export function ProfileInfo({ className = '' }: ProfileInfoProps) {
  const containerStyles = 'mx-auto mb-16';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className={`${containerStyles} ${className}`} aria-label="Profile Information">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Philosophy Section */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border mb-8"
        >
          <div className="flex items-start gap-4 mb-4">
            <Heart className="size-8 text-red-500 flex-shrink-0" />
            <div>
              <Heading level={2} fontFamily="maruBuri" className="text-2xl md:text-3xl mb-4">
                Philosophy
              </Heading>
              <Text fontFamily="maruBuri" className="text-base md:text-lg">
                {AUTHOR_CONFIG.philosophy}
              </Text>
            </div>
          </div>
        </motion.div>

        {/* Interests Section */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <Lightbulb className="size-8 text-yellow-500 flex-shrink-0" />
            <Heading level={2} fontFamily="maruBuri" className="text-2xl md:text-3xl">
              Interests
            </Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AUTHOR_CONFIG.interests.map((interest, index) => (
              <motion.div
                key={`interest-${index}-${interest}`}
                variants={itemVariants}
                className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border"
              >
                <Target className="size-5 text-primary flex-shrink-0" />
                <Text fontFamily="maruBuri" className="text-base md:text-lg">
                  {interest}
                </Text>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
