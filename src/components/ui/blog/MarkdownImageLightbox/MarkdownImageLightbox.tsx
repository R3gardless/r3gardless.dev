'use client';

import { Maximize2, X } from 'lucide-react';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';

interface MarkdownImageLightboxProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  style?: CSSProperties;
  caption?: string;
  sized?: boolean;
}

export function MarkdownImageLightbox({
  src,
  alt,
  width,
  height,
  className,
  style,
  caption,
  sized,
}: MarkdownImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const label = alt || caption || '이미지';
  const lightboxImageStyle = {
    '--markdown-image-aspect-ratio': String(width / height),
  } as CSSProperties;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <span className="markdown-image my-6 block" data-sized={sized ? 'true' : undefined}>
      <button
        type="button"
        className="markdown-image-trigger"
        aria-label={`이미지 확대: ${label}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={style}
          unoptimized
        />
        <span className="markdown-image-zoom-icon" aria-hidden="true">
          <Maximize2 />
        </span>
      </button>
      {caption && (
        <span className="mt-2 block text-center text-sm text-[color:var(--color-text-secondary)]">
          {caption}
        </span>
      )}
      {isOpen && (
        <span
          className="markdown-image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`이미지 확대: ${label}`}
        >
          <button
            type="button"
            className="markdown-image-lightbox-backdrop"
            aria-label="이미지 확대 닫기"
            onClick={() => setIsOpen(false)}
          />
          <button
            type="button"
            className="markdown-image-lightbox-close"
            aria-label="이미지 확대 닫기"
            onClick={() => setIsOpen(false)}
          >
            <X aria-hidden="true" />
          </button>
          <span className="markdown-image-lightbox-content">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="markdown-image-lightbox-image"
              style={lightboxImageStyle}
              unoptimized
            />
            {caption && <span className="markdown-image-lightbox-caption">{caption}</span>}
          </span>
        </span>
      )}
    </span>
  );
}
