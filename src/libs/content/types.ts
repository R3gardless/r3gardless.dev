export type ContentLayer = 'wiki' | 'report' | 'source' | (string & {});

export interface ContentFrontmatter {
  layer?: ContentLayer;
  type?: string;
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
  [key: string]: unknown;
}

export interface KbNote {
  absolutePath: string;
  relativePath: string;
  dirRelativePath: string;
  basename: string;
  stem: string;
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
  publishedNotes: PublishedContentNote[];
  notesByAbsolutePath: Map<string, KbNote>;
  notesByRelativePath: Map<string, KbNote>;
  notesByBasename: Map<string, KbNote[]>;
  publishedByBasename: Map<string, PublishedContentNote>;
  sourceUrlByBasename: Map<string, string>;
  sourceLabelByBasename: Map<string, string>;
  diagnostics: ContentDiagnostic[];
}

export interface ContentLinkMaps {
  published: Record<string, string>;
  sources: Record<string, string>;
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
