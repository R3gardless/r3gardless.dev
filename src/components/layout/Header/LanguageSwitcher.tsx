'use client';

import { Check, ChevronDown, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { DEFAULT_POST_LANG, POST_LANGUAGES } from '@/types/blog';
import type { PostLang } from '@/types/blog';

export interface LanguageSwitcherProps {
  /** 링크 클릭 시 호출 (모바일 메뉴 닫기 등) */
  onNavigate?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 언어별 표시 라벨.
 * - short: 버튼에 표시하는 짧은 코드
 * - flag: 국기 이모지
 * - english: 언어의 영어 명칭 (번역하지 않음)
 * - native: 해당 언어의 고유 명칭
 */
const LANG_LABELS: Record<
  PostLang,
  { short: string; flag: string; english: string; native: string }
> = {
  kr: { short: 'KO', flag: '🇰🇷', english: 'Korean', native: '한국어' },
  en: { short: 'EN', flag: '🇺🇸', english: 'English', native: 'English' },
  ja: { short: 'JP', flag: '🇯🇵', english: 'Japanese', native: '日本語' },
};

/**
 * 현재 경로에서 콘텐츠 언어를 파싱합니다. (/en/..., /ja/... 외에는 kr)
 */
export function langFromPathname(pathname: string | null | undefined): PostLang {
  const match = pathname?.match(/^\/(en|ja)(\/|$)/);
  return (match?.[1] as PostLang | undefined) ?? DEFAULT_POST_LANG;
}

/**
 * 현재 경로에서 언어 prefix(/en, /ja)를 제거한 기본 경로를 반환합니다.
 */
export function pathnameWithoutLangPrefix(pathname: string | null | undefined): string {
  const stripped = (pathname ?? '/').replace(/^\/(en|ja)(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

/**
 * 같은 페이지를 유지한 채 언어 prefix만 교체한 경로를 만듭니다.
 * kr은 prefix 없이 원래 경로, en/ja는 `/en`·`/ja`를 앞에 붙입니다.
 */
export function localizedPathname(pathname: string | null | undefined, lang: PostLang): string {
  const base = pathnameWithoutLangPrefix(pathname);
  if (lang === DEFAULT_POST_LANG) {
    return base;
  }
  return base === '/' ? `/${lang}` : `/${lang}${base}`;
}

/**
 * LanguageSwitcher 컴포넌트
 *
 * KR/EN/JP 콘텐츠 언어 전환 드롭다운.
 * 언어를 바꿔도 현재 페이지에 머무르도록, 경로의 언어 prefix만 교체합니다.
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  onNavigate,
  className = '',
}) => {
  const pathname = usePathname();
  const currentLang = langFromPathname(pathname);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 / Escape 로 닫기
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = () => {
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={containerRef} className={`relative font-pretendard ${className}`}>
      <button
        type="button"
        aria-label="Language switcher"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(prev => !prev)}
        className="
          flex items-center gap-1.5
          rounded-lg px-3 py-1.5
          bg-[color:var(--color-primary)]/60 hover:bg-[color:var(--color-primary)]
          text-sm font-medium text-[color:var(--color-text)]
          transition-colors duration-200 cursor-pointer
          focus:outline-none focus-visible:outline-none
        "
      >
        <Globe size={16} aria-hidden="true" />
        <span className="tracking-wide">{LANG_LABELS[currentLang].short}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Language options"
          className="
            absolute right-0 z-50 mt-2 min-w-[11rem]
            rounded-xl
            bg-[color:var(--color-background)]
            shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-[color:var(--color-text)]/10
            p-1.5
          "
        >
          {POST_LANGUAGES.map(lang => {
            const { flag, english, native } = LANG_LABELS[lang];
            const isCurrent = currentLang === lang;

            return (
              <li key={lang} role="option" aria-selected={isCurrent}>
                <Link
                  href={localizedPathname(pathname, lang)}
                  onClick={handleSelect}
                  className="
                    flex items-center gap-3 rounded-lg px-3 py-2
                    transition-colors duration-150
                    hover:bg-[color:var(--color-text)]/[0.06]
                    focus:outline-none focus-visible:outline-none
                  "
                >
                  <span aria-hidden="true" className="text-lg leading-none">
                    {flag}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm font-semibold text-[color:var(--color-text)]">
                      {english}
                    </span>
                    <span className="text-xs text-[color:var(--color-text)]/55">{native}</span>
                  </span>
                  {isCurrent && (
                    <Check
                      size={16}
                      aria-hidden="true"
                      className="ml-auto shrink-0 text-[color:var(--color-text)]/70"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
