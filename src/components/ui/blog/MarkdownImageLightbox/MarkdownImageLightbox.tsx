'use client';

import { Maximize2, X } from 'lucide-react';
import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface MarkdownImageLightboxProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  style?: CSSProperties;
  caption?: ReactNode;
  /**
   * 접근성 라벨 폴백용 순수 텍스트. caption이 ReactNode여도 aria-label에 캡션 텍스트를
   * 반영하기 위해 별도로 받습니다.
   */
  captionText?: string;
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
  captionText,
  sized,
}: MarkdownImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  // 캡션이 ReactNode여도 순수 텍스트(captionText)를 폴백으로 써서, alt가 비어도
  // 접근성 라벨에 캡션 내용이 반영되도록 합니다. 문자열 캡션도 폴백으로 허용합니다.
  const captionFallback = captionText ?? (typeof caption === 'string' ? caption : undefined);
  const label = alt || captionFallback || '이미지';
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
