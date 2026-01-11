import { Github, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';

import { ABOUT_BIOGRAPHY } from '@/constants';

const iconMap = {
  linkedin: Linkedin,
  github: Github,
  mail: Mail,
} as const;

export function AboutBiography() {
  return (
    <section className="w-full max-w-screen-lg mx-auto py-6 px-4 md:py-10 md:px-7">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12">
        {/* Left Column: Profile Image and Social Links */}
        <div className="flex flex-col flex-shrink-0 items-center">
          {/* Profile Image */}
          <div className="size-32 md:size-40 bg-[var(--color-primary)] overflow-hidden">
            <Image
              src={ABOUT_BIOGRAPHY.profileImage.src}
              alt={ABOUT_BIOGRAPHY.profileImage.alt}
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Social Links - Horizontal Layout below image, centered */}
          <div className="flex justify-center gap-3 mt-4 md:mt-5">
            {ABOUT_BIOGRAPHY.social.map(social => {
              const Icon = iconMap[social.icon as keyof typeof iconMap];
              return (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="size-5 md:size-6 text-[var(--color-text)] hover:opacity-70 transition-opacity"
                >
                  <Icon className="w-full h-full" strokeWidth={2} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column: Biography Content */}
        <div className="flex-1 max-w-2xl text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold font-maruBuri leading-tight text-[var(--color-text)]">
            {ABOUT_BIOGRAPHY.name}
          </h2>
          <p className="text-lg md:text-xl font-semibold font-maruBuri leading-tight text-[var(--color-text)] mt-3 md:mt-4">
            {ABOUT_BIOGRAPHY.position}
          </p>
          <p className="text-base md:text-lg font-maruBuri leading-relaxed text-[var(--color-text)] mt-4 md:mt-5">
            {ABOUT_BIOGRAPHY.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
