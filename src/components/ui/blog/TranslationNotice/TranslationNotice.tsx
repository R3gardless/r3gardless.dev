import Link from 'next/link';
import React from 'react';

import type { TranslatedPostLang } from '@/types/blog';

/**
 * 언어별 LLM 번역 고지 문구
 */
const TRANSLATION_NOTICES: Record<TranslatedPostLang, { message: string; linkLabel: string }> = {
  en: {
    message:
      'This post was translated from the Korean original using an LLM. Some nuances may differ.',
    linkLabel: 'Read the original',
  },
  jp: {
    message:
      'この記事は韓国語の原文をLLMで翻訳したものです。ニュアンスが原文と異なる場合があります。',
    linkLabel: '原文を読む',
  },
};

export interface TranslationNoticeProps {
  /** 번역 언어 (en/jp) */
  lang: TranslatedPostLang;
  /** kr 원문 포스트 경로 (/blog/<slug>) */
  originalHref: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * TranslationNotice 컴포넌트
 *
 * en/jp 번역 포스트 상단에 LLM 번역 고지와 원문 링크를 표시합니다.
 * 디자인 톤앤매너에 맞춰 얇은 border와 CSS 변수 색상만 사용합니다.
 */
export function TranslationNotice({ lang, originalHref, className = '' }: TranslationNoticeProps) {
  const notice = TRANSLATION_NOTICES[lang];

  return (
    <aside
      data-lang={lang}
      className={`
        translation-notice
        flex flex-wrap items-baseline gap-x-2 gap-y-1
        rounded-md border border-[color:var(--color-primary)]
        px-4 py-3
        text-sm leading-6 text-[color:var(--color-text)]/70
        ${className}
      `}
    >
      <span>{notice.message}</span>
      <Link
        href={originalHref}
        className="
          whitespace-nowrap underline underline-offset-4
          text-[color:var(--color-text)]
          hover:opacity-80 transition-opacity duration-200
          focus:outline-none focus-visible:outline-none
        "
      >
        {notice.linkLabel}
      </Link>
    </aside>
  );
}
