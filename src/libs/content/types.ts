import type { PostLang, TranslatedPostLang } from '@/types/blog';

export type ContentLayer = 'wiki' | 'report' | 'source' | (string & {});

export interface ContentFrontmatter {
  layer?: ContentLayer;
  type?: string;
  /**
   * 콘텐츠 언어. kr 원문은 lang 필드가 없고, 번역본은 en/ja를 명시합니다.
   */
  lang?: string;
  title?: string;
  description?: string;
  category?: string;
  category_color?:
    | 'gray'
    | 'brown'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'red';
  tags?: string[];
  publish?: boolean;
  slug?: string;
  published_at?: string;
  added?: string;
  updated?: string;
  cover?: string;
  as_of?: string;
  source_url?: string;
  archived_url?: string;
  /**
   * 예상 읽기 시간(분). KB frontmatter에서 주입됩니다.
   */
  reading_time?: number;
  /**
   * 시리즈 이름. kr 원문 값이 시리즈 그룹핑 키이고, 번역본은 표시용 이름만 다르게 가질 수 있습니다.
   */
  series?: string;
  /**
   * 시리즈 내 순서 (1부터 시작하는 양의 정수)
   */
  series_order?: number;
  [key: string]: unknown;
}

export interface KbNote {
  absolutePath: string;
  relativePath: string;
  dirRelativePath: string;
  basename: string;
  stem: string;
  /**
   * 정규화된 콘텐츠 언어. frontmatter lang이 없으면 kr입니다.
   */
  lang: PostLang;
  content: string;
  frontmatter: ContentFrontmatter;
}

export interface PublishedContentNote extends KbNote {
  slug: string;
  href: string;
}

export type ContentDiagnosticLevel = 'warning' | 'error';

export interface ContentDiagnostic {
  level: ContentDiagnosticLevel;
  code: string;
  message: string;
  file?: string;
}

export interface ContentIndex {
  notes: KbNote[];
  /**
   * kr canonical 발행 노트 목록. 번역본은 publishedVariants에만 포함됩니다.
   */
  publishedNotes: PublishedContentNote[];
  /**
   * kr 원문과 en/ja 번역본을 모두 포함한 발행 대상 전체 목록
   */
  publishedVariants: PublishedContentNote[];
  notesByAbsolutePath: Map<string, KbNote>;
  notesByRelativePath: Map<string, KbNote>;
  notesByBasename: Map<string, KbNote[]>;
  publishedByBasename: Map<string, PublishedContentNote>;
  /**
   * 번역 언어별 basename/title/slug -> 발행 번역본 매핑
   */
  translatedByBasename: Map<TranslatedPostLang, Map<string, PublishedContentNote>>;
  /**
   * 발행 slug별 제공 언어 목록 (kr 우선 순서)
   */
  languagesBySlug: Map<string, PostLang[]>;
  sourceUrlByBasename: Map<string, string>;
  sourceLabelByBasename: Map<string, string>;
  diagnostics: ContentDiagnostic[];
}

export interface ContentLinkMaps {
  published: Record<string, string>;
  sources: Record<string, string>;
  sourceLabels?: Record<string, string>;
  /**
   * 번역 언어별 published 링크 맵. 같은 언어 번역본이 있을 때만 항목이 존재합니다.
   */
  publishedByLang?: Partial<Record<TranslatedPostLang, Record<string, string>>>;
}

export type LinkResolutionKind = 'internal' | 'external' | 'text';

export interface LinkResolution {
  kind: LinkResolutionKind;
  label: string;
  target: string;
  href?: string;
  external?: boolean;
  warning?: string;
}
