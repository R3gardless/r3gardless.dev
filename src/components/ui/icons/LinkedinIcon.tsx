import React from 'react';

interface IconProps {
  size?: number | string;
  strokeWidth?: number | string;
  className?: string;
}

/**
 * LinkedIn 브랜드 아이콘 (SVG)
 * lucide-react 1.x에서 브랜드 아이콘이 제거되어 직접 구현
 */
export function LinkedinIcon({ size = 24, strokeWidth = 2, className = '' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
