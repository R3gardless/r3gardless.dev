'use client';

import { Check, ChevronDown, Copy } from 'lucide-react';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang } from '@/types/blog';

/**
 * 코드 블록이 이 줄 수를 넘으면 접기(collapse) UI를 노출합니다.
 */
const COLLAPSE_LINE_THRESHOLD = 16;

/**
 * `data-language` 값 → 사람이 읽기 좋은 표기. 없으면 대문자로 폴백합니다.
 */
const LANGUAGE_LABELS: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  json: 'JSON',
  jsonc: 'JSONC',
  yaml: 'YAML',
  yml: 'YAML',
  toml: 'TOML',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  shellscript: 'Shell',
  zsh: 'Zsh',
  python: 'Python',
  py: 'Python',
  go: 'Go',
  rust: 'Rust',
  rs: 'Rust',
  java: 'Java',
  kotlin: 'Kotlin',
  kt: 'Kotlin',
  c: 'C',
  cpp: 'C++',
  'c++': 'C++',
  cs: 'C#',
  csharp: 'C#',
  ruby: 'Ruby',
  rb: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'Sass',
  sql: 'SQL',
  graphql: 'GraphQL',
  gql: 'GraphQL',
  md: 'Markdown',
  markdown: 'Markdown',
  mdx: 'MDX',
  dockerfile: 'Dockerfile',
  docker: 'Dockerfile',
  diff: 'Diff',
  text: 'Text',
  txt: 'Text',
  plaintext: 'Text',
};

function languageLabel(language?: string): string {
  if (!language) {
    return 'Text';
  }

  const key = language.toLowerCase();
  return LANGUAGE_LABELS[key] ?? language.toUpperCase();
}

const UI_TEXT: Record<
  PostLang,
  { copy: string; copied: string; expand: string; collapse: string }
> = {
  kr: { copy: '복사', copied: '복사됨', expand: '더 보기', collapse: '접기' },
  en: { copy: 'Copy', copied: 'Copied', expand: 'Show more', collapse: 'Show less' },
  ja: { copy: 'コピー', copied: 'コピー済み', expand: 'もっと見る', collapse: '折りたたむ' },
};

export interface CodeBlockProps {
  /**
   * `data-language` 원본 값 (예: `yaml`, `ts`).
   */
  language?: string;
  /**
   * 하이라이트된 코드의 줄 수. 접기 노출 여부를 결정합니다.
   */
  lineCount?: number;
  /**
   * UI 라벨 로컬라이즈용 렌더 언어.
   */
  lang?: PostLang;
  /**
   * rehype-pretty-code가 생성한 `<pre><code>` 트리.
   */
  children?: ReactNode;
}

/**
 * Markdown 코드 블록을 언어 라벨 · 복사 버튼 · 긴 블록 접기 기능과 함께 렌더링합니다.
 * 하이라이팅 결과(children)는 그대로 감싸고, 부가 chrome만 덧씌웁니다.
 */
export function CodeBlock({
  language,
  lineCount = 0,
  lang = DEFAULT_POST_LANG,
  children,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const text = UI_TEXT[lang] ?? UI_TEXT[DEFAULT_POST_LANG];
  const collapsible = lineCount > COLLAPSE_LINE_THRESHOLD;
  const showCollapsed = collapsible && !expanded;

  const handleCopy = async () => {
    const code = contentRef.current?.querySelector('code')?.textContent ?? '';
    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      globalThis.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 권한이 없거나 실패한 경우 조용히 무시합니다.
    }
  };

  return (
    <div className="code-block" data-language={language}>
      <div className="code-block-header">
        <span className="code-block-language">{languageLabel(language)}</span>
        <button
          type="button"
          className="code-block-copy"
          data-copied={copied ? 'true' : undefined}
          onClick={handleCopy}
          aria-label={copied ? text.copied : text.copy}
          title={copied ? text.copied : text.copy}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </button>
      </div>
      <div
        ref={contentRef}
        className="code-block-content"
        data-collapsed={showCollapsed ? 'true' : undefined}
      >
        {children}
      </div>
      {collapsible && (
        <button
          type="button"
          className="code-block-toggle"
          onClick={() => setExpanded(value => !value)}
          aria-expanded={expanded}
        >
          <ChevronDown
            className="code-block-toggle-icon"
            data-expanded={expanded ? 'true' : undefined}
            aria-hidden="true"
          />
          <span>{expanded ? text.collapse : text.expand}</span>
        </button>
      )}
    </div>
  );
}
