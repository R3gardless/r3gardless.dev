import GithubSlugger from 'github-slugger';
import type { Element, Root as HastRoot, Text as HastText } from 'hast';
import { toString as hastToString } from 'hast-util-to-string';
import { ExternalLink } from 'lucide-react';
import type { Heading, PhrasingContent, Root as MdastRoot } from 'mdast';
import { toString as mdastToString } from 'mdast-util-to-string';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeReact from 'rehype-react';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkAlert from 'remark-github-blockquote-alert';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkWikiLink from 'remark-wiki-link';
import { unified } from 'unified';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

import { CodeBlock } from '@/components/ui/blog/CodeBlock';
import { MarkdownImageLightbox } from '@/components/ui/blog/MarkdownImageLightbox';
import { Mermaid } from '@/components/ui/blog/Mermaid';
import { DEFAULT_POST_LANG } from '@/types/blog';
import type { PostLang, TableOfContentsItem } from '@/types/blog';

import { remarkRepairBrokenStrongMarkers } from './emphasis';
import { extractImageAltAtStart } from './imageAlt';
import {
  DEFAULT_MARKDOWN_IMAGE_HEIGHT,
  DEFAULT_MARKDOWN_IMAGE_WIDTH,
  clampMarkdownImageDimensions,
  markdownImageDimensionToRem,
  mergeMarkdownImageDimensions,
  normalizeMarkdownImageSizeSyntax,
  parseMarkdownImageAlt,
  parseMarkdownImageAttributeBlock,
  parseMarkdownImageDimensionValue,
  parseMarkdownImageSizeSpec,
} from './imageDimensions';
import { parseInlineMarkdownChildren } from './inlineMarkdown';
import { resolveWikiLinkFromMaps } from './linkResolver';
import { normalizeKatexMathTree } from './math';
import { isReferenceHeadingTitle } from './references';
import type { ContentLinkMaps } from './types';

const EMPTY_LINK_MAPS: ContentLinkMaps = {
  published: {},
  sources: {},
};

interface WikiLinkNode {
  type: 'wikiLink';
  value: string;
  data?: {
    alias?: string;
    hName?: string;
    hProperties?: Record<string, unknown>;
    hChildren?: Array<{ type: 'text'; value: string }>;
  };
}

interface MdastParent {
  children: unknown[];
}

interface MdastStrongNode {
  type: 'strong';
  children: unknown[];
}

interface MdastEmphasisNode {
  type: 'emphasis';
  children: unknown[];
}

interface MdastLinkNode {
  type: 'link';
  url?: string;
  title?: string | null;
  children?: unknown[];
  data?: {
    hProperties?: Record<string, unknown>;
  };
}

interface MdastImageNode {
  type: 'image';
  data?: {
    hProperties?: Record<string, unknown>;
  };
}

interface MdastTextNode {
  type: 'text';
  value: string;
}

interface MdastHtmlNode {
  type: 'html';
  value: string;
}

interface MdastHastNode {
  type: string;
  children?: unknown[];
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
}

function isMdastImageNode(value: unknown): value is MdastImageNode {
  return Boolean(
    value && typeof value === 'object' && (value as { type?: unknown }).type === 'image',
  );
}

function isMdastTextNode(value: unknown): value is MdastTextNode {
  return Boolean(
    value && typeof value === 'object' && (value as { type?: unknown }).type === 'text',
  );
}

function isMdastLinkNode(value: unknown): value is MdastLinkNode {
  return Boolean(
    value && typeof value === 'object' && (value as { type?: unknown }).type === 'link',
  );
}

function isMdastHtmlNode(value: unknown): value is MdastHtmlNode {
  return Boolean(
    value && typeof value === 'object' && (value as { type?: unknown }).type === 'html',
  );
}

function hasMdastChildren(value: unknown): value is MdastParent {
  return Boolean(
    value && typeof value === 'object' && Array.isArray((value as { children?: unknown }).children),
  );
}

function strongNode(children: unknown | unknown[]): MdastStrongNode {
  return {
    type: 'strong',
    children: Array.isArray(children) ? children : [children],
  };
}

function emphasisNode(children: unknown | unknown[]): MdastEmphasisNode {
  return {
    type: 'emphasis',
    children: Array.isArray(children) ? children : [children],
  };
}

function consumeMarkersAroundInlineNode(
  parent: MdastParent,
  index: number,
  marker: '*' | '**',
): boolean {
  const previous = parent.children[index - 1];
  const next = parent.children[index + 1];

  if (!isMdastTextNode(previous) || !isMdastTextNode(next)) {
    return false;
  }

  if (!previous.value.endsWith(marker) || !next.value.startsWith(marker)) {
    return false;
  }

  if (marker === '*' && (previous.value.endsWith('**') || next.value.startsWith('**'))) {
    return false;
  }

  previous.value = previous.value.slice(0, -marker.length);
  next.value = next.value.slice(marker.length);

  return true;
}

function consumeStrongMarkersAroundInlineNode(parent: MdastParent, index: number): boolean {
  return consumeMarkersAroundInlineNode(parent, index, '**');
}

function consumeEmphasisMarkersAroundInlineNode(parent: MdastParent, index: number): boolean {
  return consumeMarkersAroundInlineNode(parent, index, '*');
}

function consumeEmphasisWrapperAroundInlineNode(
  parent: MdastParent,
  index: number,
): 'strong' | 'emphasis' | null {
  if (consumeStrongMarkersAroundInlineNode(parent, index)) {
    return 'strong';
  }

  if (consumeEmphasisMarkersAroundInlineNode(parent, index)) {
    return 'emphasis';
  }

  return null;
}

function wrapInlineNodes(children: unknown[], wrapper: 'strong' | 'emphasis' | null) {
  if (wrapper === 'strong') {
    return strongNode(children);
  }

  if (wrapper === 'emphasis') {
    return emphasisNode(children);
  }

  return null;
}

function replaceInlineNode(
  parent: MdastParent,
  index: number,
  children: unknown[],
  wrapper: 'strong' | 'emphasis' | null,
) {
  const wrappedNode = wrapInlineNodes(children, wrapper);

  if (wrappedNode) {
    parent.children[index] = wrappedNode;
    return;
  }

  parent.children.splice(index, 1, ...children);
}

function wikiLinkNode(
  label: string,
  href: string,
  kind: 'internal' | 'external',
  external: boolean,
): MdastLinkNode {
  return {
    type: 'link',
    url: href,
    title: null,
    data: {
      hProperties: {
        className: kind === 'internal' ? 'wiki-link' : 'wiki-link external-link',
        ...(external
          ? {
              target: '_blank',
              rel: 'noopener noreferrer',
            }
          : {}),
      },
    },
    children: parseInlineMarkdownChildren(label),
  };
}

function getClassNames(element: Element): string[] {
  const className = element.properties?.className;

  if (Array.isArray(className)) {
    return className.map(String);
  }

  if (typeof className === 'string') {
    return className.split(/\s+/).filter(Boolean);
  }

  return [];
}

function addClassName(element: Element, className: string) {
  const classNames = new Set([...getClassNames(element), className]);
  element.properties = {
    ...element.properties,
    className: Array.from(classNames),
  };
}

function classifyHref(href: string): 'internal' | 'external' | 'unsafe' {
  const trimmedHref = href.trim();

  if (!trimmedHref) {
    return 'unsafe';
  }

  if (/^\/\//.test(trimmedHref)) {
    return 'external';
  }

  const schemeMatch = trimmedHref.match(/^([a-z][a-z\d+.-]*):/i);
  if (!schemeMatch) {
    return 'internal';
  }

  const scheme = schemeMatch[1].toLowerCase();
  if (scheme === 'http' || scheme === 'https' || scheme === 'mailto' || scheme === 'tel') {
    return 'external';
  }

  return 'unsafe';
}

function shouldOpenInNewTab(href: string): boolean {
  return /^(https?:)?\/\//i.test(href);
}

function isHeadingElement(element: Element): boolean {
  return /^h[1-6]$/.test(element.tagName);
}

function headingDepth(element: Element): number {
  return Number(element.tagName.slice(1));
}

function isReferenceHeading(element: Element): boolean {
  if (!isHeadingElement(element)) {
    return false;
  }

  return isReferenceHeadingTitle(hastToString(element));
}

function sourceLabelFromHref(href: string): string {
  if (href.startsWith('/')) {
    return 'r3gardless.dev';
  }

  try {
    const url = new globalThis.URL(href);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}

/**
 * 참고문헌 카드의 파비콘 소스를 결정합니다.
 * - 내부 링크: 사이트 자체 파비콘(외부 요청 없음)
 * - 외부 http(s) 링크: 도메인 파비콘 서비스
 * - 프로토콜 상대(//host)는 https로 보정, mailto/tel/unsafe 등은 파비콘 없음
 */
function referenceFaviconSrc(
  href: string,
  kind: 'internal' | 'external' | 'unsafe',
): string | null {
  if (kind === 'internal') {
    return '/favicon.ico';
  }

  if (kind !== 'external') {
    return null;
  }

  try {
    const normalized = href.startsWith('//') ? `https:${href}` : href;
    const url = new globalThis.URL(normalized);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url.hostname)}&sz=64`;
  } catch {
    return null;
  }
}

function remarkResolveWikiLinks(linkMaps: ContentLinkMaps, lang: PostLang) {
  return function plugin() {
    return function transformer(tree: Node) {
      visit(
        tree,
        () => true,
        (node, index, parent) => {
          if (node.type !== 'wikiLink') {
            return;
          }

          const wikiNode = node as unknown as WikiLinkNode;
          const mdastParent = parent as MdastParent | undefined;
          const alias = wikiNode.data?.alias;
          const label = alias && alias !== wikiNode.value ? alias : undefined;
          const resolution = resolveWikiLinkFromMaps(wikiNode.value, label, linkMaps, lang);
          const wrapper =
            mdastParent && typeof index === 'number'
              ? consumeEmphasisWrapperAroundInlineNode(mdastParent, index)
              : null;

          if (resolution.kind === 'text') {
            if (mdastParent && typeof index === 'number') {
              replaceInlineNode(
                mdastParent,
                index,
                parseInlineMarkdownChildren(resolution.label),
                wrapper,
              );
            }
            return;
          }

          if (!resolution.href) {
            if (mdastParent && typeof index === 'number') {
              replaceInlineNode(
                mdastParent,
                index,
                parseInlineMarkdownChildren(resolution.label),
                wrapper,
              );
            }
            return;
          }

          if (mdastParent && typeof index === 'number') {
            replaceInlineNode(
              mdastParent,
              index,
              [
                wikiLinkNode(
                  resolution.label,
                  resolution.href,
                  resolution.kind,
                  Boolean(resolution.external),
                ),
              ],
              wrapper,
            );
          }
        },
      );
    };
  };
}

function remarkNormalizeKatexMath() {
  return function transformer(tree: Node) {
    normalizeKatexMathTree(tree);
  };
}

function remarkRepairAdjacentStrongMarkers() {
  return function transformer(tree: Node) {
    visit(
      tree,
      () => true,
      (node, index, parent) => {
        if (!isMdastLinkNode(node) || typeof index !== 'number' || !parent) {
          return;
        }

        const mdastParent = parent as MdastParent;
        const wrapper = consumeEmphasisWrapperAroundInlineNode(mdastParent, index);
        if (!wrapper) {
          return;
        }

        mdastParent.children[index] = wrapper === 'strong' ? strongNode(node) : emphasisNode(node);
      },
    );
  };
}

function applyImageDimensionsToNode(
  image: MdastImageNode,
  dimensions: { width?: number; height?: number },
) {
  image.data = {
    ...image.data,
    hProperties: {
      ...image.data?.hProperties,
      ...(dimensions.width ? { width: dimensions.width } : {}),
      ...(dimensions.height ? { height: dimensions.height } : {}),
    },
  };
}

function remarkImageDimensions() {
  return function transformer(tree: Node) {
    visit(tree, 'paragraph', node => {
      const parent = node as MdastParent;

      for (let index = 0; index < parent.children.length; index += 1) {
        const child = parent.children[index];
        const nextChild = parent.children[index + 1];

        if (!isMdastImageNode(child) || !isMdastTextNode(nextChild)) {
          continue;
        }

        const parsed = parseMarkdownImageAttributeBlock(nextChild.value);
        if (!parsed) {
          continue;
        }

        applyImageDimensionsToNode(child, parsed.dimensions);
        nextChild.value = nextChild.value.slice(parsed.consumedLength);

        if (!nextChild.value) {
          parent.children.splice(index + 1, 1);
        }
      }
    });
  };
}

/**
 * 같은 문단에 이미지가 2개 이상 연속으로 오면 나란히(row) 배치할 수 있도록
 * 문단에 `markdown-image-row` 클래스를 부여하는 플러그인.
 *
 * ```md
 * ![왼쪽 그림](a.png)
 * ![오른쪽 그림](b.png)
 * ```
 * 처럼 빈 줄 없이 붙여 쓰면 한 문단이 되고, 이미지 사이 개행(공백 text 노드)만 허용합니다.
 */
function remarkImageRow() {
  return function transformer(tree: Node) {
    visit(tree, 'paragraph', node => {
      const paragraph = node as MdastParent & { data?: { hProperties?: Record<string, unknown> } };
      let imageCount = 0;

      for (const child of paragraph.children) {
        if (isMdastImageNode(child)) {
          imageCount += 1;
          continue;
        }

        if (isMdastTextNode(child) && !child.value.trim()) {
          continue;
        }

        // 이미지와 개행 외 다른 콘텐츠가 섞여 있으면 일반 문단으로 둔다
        return;
      }

      if (imageCount < 2) {
        return;
      }

      paragraph.data = {
        ...paragraph.data,
        hProperties: {
          ...paragraph.data?.hProperties,
          className: 'markdown-image-row',
        },
      };
    });
  };
}

interface MdastPositionedNode {
  position?: {
    start?: { offset?: number };
    end?: { offset?: number };
  };
  data?: {
    hProperties?: Record<string, unknown>;
  };
}

/**
 * 이미지 캡션에 서식을 살리기 위한 플러그인.
 *
 * CommonMark는 `![*italic*](url)`의 alt를 계산할 때 강조 마커를 제거하므로,
 * mdast `image.alt`만으로는 `*italic*`/`_italic_`/`~~del~~` 등을 복원할 수 없습니다.
 * 그래서 원본 소스에서 alt 부분(`![` ~ `]`)을 그대로 잘라 `data-raw-alt`로 보존하고,
 * 렌더 시 인라인 Markdown으로 다시 파싱합니다.
 */
function remarkImageRawCaption() {
  return function transformer(tree: Node, file: { value?: unknown }) {
    const source = typeof file.value === 'string' ? file.value : String(file.value ?? '');

    visit(tree, 'image', node => {
      const image = node as unknown as MdastPositionedNode;
      const startOffset = image.position?.start?.offset;
      const endOffset = image.position?.end?.offset;

      if (typeof startOffset !== 'number' || typeof endOffset !== 'number') {
        return;
      }

      const raw = source.slice(startOffset, endOffset);
      // 중첩 대괄호(`![a [b] c](...)`)·이스케이프까지 고려해 alt를 정확히 추출합니다.
      const rawAlt = extractImageAltAtStart(raw);
      if (rawAlt === null) {
        return;
      }

      image.data = {
        ...image.data,
        hProperties: {
          ...image.data?.hProperties,
          'data-raw-alt': rawAlt,
        },
      };
    });
  };
}

function parseDetailsOpening(value: string): { summary: string; open: boolean } | null {
  const trimmed = value.trim();

  if (!/^<details(?:\s+open)?\s*>/i.test(trimmed)) {
    return null;
  }

  const summaryMatch = trimmed.match(/<summary(?:\s[^>]*)?>([\s\S]*?)<\/summary>/i);
  if (!summaryMatch) {
    return null;
  }

  const summary = summaryMatch[1].trim();
  if (/[<>]/.test(summary)) {
    return null;
  }

  if (!summary) {
    return null;
  }

  return {
    summary,
    open: /^<details\s+open\s*>/i.test(trimmed),
  };
}

function isDetailsClosing(value: unknown): value is MdastHtmlNode {
  return isMdastHtmlNode(value) && /^<\/details>\s*$/i.test(value.value.trim());
}

function createDetailsNode(summary: string, children: unknown[], open: boolean): MdastHastNode {
  return {
    type: 'detailsBlock',
    data: {
      hName: 'details',
      hProperties: {
        className: ['markdown-details'],
        ...(open ? { open: true } : {}),
      },
    },
    children: [
      {
        type: 'detailsSummary',
        data: {
          hName: 'summary',
          hProperties: {
            className: ['markdown-details-summary'],
          },
        },
        children: [{ type: 'text', value: summary }],
      },
      {
        type: 'detailsContent',
        data: {
          hName: 'div',
          hProperties: {
            className: ['markdown-details-content'],
          },
        },
        children,
      },
    ],
  };
}

function transformDetailsBlocks(parent: MdastParent) {
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index];

    if (hasMdastChildren(child)) {
      transformDetailsBlocks(child);
    }

    if (!isMdastHtmlNode(child)) {
      continue;
    }

    const opening = parseDetailsOpening(child.value);
    if (!opening) {
      continue;
    }

    const closeIndex = parent.children.findIndex(
      (candidate, candidateIndex) => candidateIndex > index && isDetailsClosing(candidate),
    );
    if (closeIndex === -1) {
      continue;
    }

    const detailsChildren = parent.children.slice(index + 1, closeIndex);
    transformDetailsBlocks({ children: detailsChildren });
    parent.children.splice(
      index,
      closeIndex - index + 1,
      createDetailsNode(opening.summary, detailsChildren, opening.open),
    );
  }
}

function remarkDetailsBlocks() {
  return function transformer(tree: Node) {
    if (hasMdastChildren(tree)) {
      transformDetailsBlocks(tree);
    }
  };
}

function rehypeMermaidComponent() {
  return function transformer(tree: HastRoot) {
    visit(
      tree,
      () => true,
      (node, index, parent) => {
        if (node.type !== 'element') {
          return;
        }

        const element = node as Element;
        if (element.tagName !== 'pre') {
          return;
        }

        const codeNode = element.children.find(
          child =>
            child.type === 'element' &&
            child.tagName === 'code' &&
            Array.isArray(child.properties?.className) &&
            child.properties.className.includes('language-mermaid'),
        ) as Element | undefined;

        const hastParent = parent as Element | HastRoot | undefined;
        if (!codeNode || !hastParent || typeof index !== 'number') {
          return;
        }

        hastParent.children[index] = {
          type: 'element',
          tagName: 'mermaid',
          properties: {
            code: hastToString(codeNode),
          },
          children: [],
        };
      },
    );
  };
}

function readStringProperty(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined;
}

/**
 * rehype-pretty-code가 만든 `figure[data-rehype-pretty-code-figure]`를 커스텀
 * `code-block` 엘리먼트로 치환합니다. 언어(`language`)와 줄 수(`lineCount`)를 넘겨
 * 클라이언트 `CodeBlock`이 언어 라벨 · 복사 · 접기 chrome을 렌더링하게 합니다.
 * rehypePrettyCode 이후에 실행되어야 합니다. (mermaid는 그 전에 이미 치환됨)
 */
function rehypeCodeBlock() {
  return function transformer(tree: HastRoot) {
    visit(tree, 'element', node => {
      const element = node as Element;
      if (element.tagName !== 'figure') {
        return;
      }

      if (!element.properties || !('data-rehype-pretty-code-figure' in element.properties)) {
        return;
      }

      const pre = element.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'pre',
      );
      if (!pre) {
        return;
      }

      const code = pre.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      );

      const language =
        readStringProperty(pre.properties?.['data-language']) ??
        readStringProperty(code?.properties?.['data-language']);

      const lineCount = code
        ? code.children.filter(
            child => child.type === 'element' && (child as Element).tagName === 'span',
          ).length
        : 0;

      element.tagName = 'code-block';
      element.properties = {
        ...(language ? { language } : {}),
        lineCount,
      };
    });
  };
}

function markReferenceCardLists(node: Node) {
  visit(
    node,
    () => true,
    current => {
      if (current.type !== 'element') {
        return;
      }

      const element = current as Element;
      if (element.tagName !== 'ul' && element.tagName !== 'ol') {
        return;
      }

      const hasReferenceCardItem = element.children.some(
        child =>
          child.type === 'element' &&
          child.tagName === 'li' &&
          getClassNames(child).includes('reference-card-list-item'),
      );

      if (hasReferenceCardItem) {
        addClassName(element, 'reference-card-list');
      }
    },
  );
}

function isHastElement(value: unknown): value is Element {
  return Boolean(
    value && typeof value === 'object' && (value as { type?: unknown }).type === 'element',
  );
}

function isHastText(value: unknown): value is HastText {
  return Boolean(
    value && typeof value === 'object' && (value as { type?: unknown }).type === 'text',
  );
}

function isReferenceOriginalLabel(value: string): boolean {
  return /^(원문|original)$/i.test(value.trim());
}

function collapseDuplicateReferenceOriginalLinks(node: Node) {
  visit(
    node,
    () => true,
    current => {
      if (!isHastElement(current)) {
        return;
      }

      for (let index = 0; index < current.children.length - 2; index += 1) {
        const first = current.children[index];
        const separator = current.children[index + 1];
        const second = current.children[index + 2];

        if (!isHastElement(first) || !isHastText(separator) || !isHastElement(second)) {
          continue;
        }

        if (first.tagName !== 'a' || second.tagName !== 'a') {
          continue;
        }

        const firstHref = first.properties?.href;
        const secondHref = second.properties?.href;
        if (typeof firstHref !== 'string' || firstHref !== secondHref) {
          continue;
        }

        if (
          !/^\s*[—-]\s*$/.test(separator.value) ||
          !isReferenceOriginalLabel(hastToString(second))
        ) {
          continue;
        }

        current.children.splice(index + 1, 2);
        index -= 1;
      }
    },
  );
}

function transformReferenceLinksToCards(node: Node) {
  collapseDuplicateReferenceOriginalLinks(node);

  visit(
    node,
    () => true,
    (current, _index, parent) => {
      if (current.type !== 'element') {
        return;
      }

      const element = current as Element;
      if (element.tagName !== 'a') {
        return;
      }

      const href = element.properties?.href;
      if (typeof href !== 'string' || !href) {
        return;
      }

      const label = hastToString(element).trim() || href;
      element.tagName = 'reference-card';
      element.properties = {
        href,
        label,
        source: sourceLabelFromHref(href),
      };
      element.children = [];

      const hastParent = parent as Element | undefined;
      if (hastParent?.type === 'element' && hastParent.tagName === 'li') {
        addClassName(hastParent, 'reference-card-list-item');
      }
    },
  );

  markReferenceCardLists(node);
}

function rehypeReferenceCards() {
  return function transformer(tree: HastRoot) {
    let referenceDepth: number | null = null;

    for (const child of tree.children) {
      if (child.type === 'element' && isHeadingElement(child)) {
        if (referenceDepth !== null && headingDepth(child) <= referenceDepth) {
          referenceDepth = null;
        }

        if (isReferenceHeading(child)) {
          referenceDepth = headingDepth(child);
        }

        continue;
      }

      if (referenceDepth !== null) {
        transformReferenceLinksToCards(child);
      }
    }
  };
}

function MarkdownLink({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const hrefKind = classifyHref(href);

  if (hrefKind === 'unsafe') {
    return <span {...props}>{children}</span>;
  }

  if (hrefKind === 'external') {
    return (
      <a
        href={href}
        {...(shouldOpenInNewTab(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

/**
 * 인라인 Markdown(강조/굵게/취소선/인라인 코드)을 React 노드로 변환합니다.
 * 이미지 캡션처럼 원래 순수 문자열로 렌더링되던 텍스트에 `*italic*`, `**bold**`
 * 등의 서식을 적용하기 위해 사용합니다. 링크/이미지는 상위에서 텍스트로 평탄화됩니다.
 */
function renderInlineMarkdownNodes(nodes: PhrasingContent[]): ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
        return <Fragment key={index}>{node.value}</Fragment>;
      case 'inlineCode':
        return <code key={index}>{node.value}</code>;
      case 'break':
        return <br key={index} />;
      case 'emphasis':
        return <em key={index}>{renderInlineMarkdownNodes(node.children)}</em>;
      case 'strong':
        return <strong key={index}>{renderInlineMarkdownNodes(node.children)}</strong>;
      case 'delete':
        return <del key={index}>{renderInlineMarkdownNodes(node.children)}</del>;
      default:
        return <Fragment key={index}>{mdastToString(node)}</Fragment>;
    }
  });
}

function renderInlineMarkdownToReact(markdown: string): ReactNode {
  return renderInlineMarkdownNodes(parseInlineMarkdownChildren(markdown));
}

function MarkdownImage({
  src,
  alt = '',
  title,
  width,
  height,
  ...props
}: ComponentPropsWithoutRef<'img'>) {
  if (typeof src !== 'string') {
    return null;
  }

  const parsedAlt = parseMarkdownImageAlt(alt);
  const rawAltAttr = (props as Record<string, unknown>)['data-raw-alt'];
  // 원본 alt(강조 마커 보존)에서 크기 힌트(`|WxH`)만 벗겨낸 캡션 소스.
  const rawCaption =
    typeof rawAltAttr === 'string' ? parseMarkdownImageAlt(rawAltAttr).alt : parsedAlt.alt;
  const titleDimensions = parseMarkdownImageSizeSpec(title);
  const propDimensions = {
    width: parseMarkdownImageDimensionValue(width),
    height: parseMarkdownImageDimensionValue(height),
  };
  const requestedDimensions = mergeMarkdownImageDimensions(
    titleDimensions,
    parsedAlt.dimensions,
    propDimensions,
  );
  const dimensions = clampMarkdownImageDimensions(requestedDimensions);
  const hasCustomDimensions = Boolean(requestedDimensions.width || requestedDimensions.height);
  const intrinsicWidth = dimensions.width || DEFAULT_MARKDOWN_IMAGE_WIDTH;
  const intrinsicHeight =
    dimensions.height ||
    (dimensions.width
      ? Math.round(
          (dimensions.width * DEFAULT_MARKDOWN_IMAGE_HEIGHT) / DEFAULT_MARKDOWN_IMAGE_WIDTH,
        )
      : DEFAULT_MARKDOWN_IMAGE_HEIGHT);
  const imageStyle: CSSProperties | undefined = hasCustomDimensions
    ? {
        maxWidth: '100%',
        width: dimensions.width ? markdownImageDimensionToRem(dimensions.width) : 'auto',
        height: dimensions.height ? markdownImageDimensionToRem(dimensions.height) : 'auto',
      }
    : undefined;
  const imageClassName = [
    hasCustomDimensions ? 'max-w-full' : 'h-auto w-full',
    'rounded-lg border border-[color:var(--color-border)] object-contain',
  ].join(' ');
  const caption = titleDimensions ? rawCaption : title || rawCaption;
  // 접근성 라벨 폴백용 순수 텍스트(강조 마커 없는 평탄화 버전).
  const captionText = titleDimensions ? parsedAlt.alt : title || parsedAlt.alt;

  return (
    <MarkdownImageLightbox
      src={src}
      alt={parsedAlt.alt}
      width={intrinsicWidth}
      height={intrinsicHeight}
      className={imageClassName}
      style={imageStyle}
      caption={caption ? renderInlineMarkdownToReact(caption) : undefined}
      captionText={captionText || undefined}
      sized={hasCustomDimensions}
    />
  );
}

interface ReferenceCardProps extends ComponentPropsWithoutRef<'a'> {
  label?: string;
  source?: string;
}

function ReferenceCard({ href = '', label, source, className = '', ...props }: ReferenceCardProps) {
  const title = label || href;
  const domain = source || sourceLabelFromHref(href);
  const cardClassName = ['reference-card', className].filter(Boolean).join(' ');
  const hrefKind = classifyHref(href);
  // 내부 링크는 사이트 자체 파비콘(외부 요청 없음), 외부 http(s) 링크는 도메인 파비콘을
  // 사용하고, mailto/tel/unsafe 등에는 파비콘을 렌더링하지 않습니다.
  const faviconSrc = referenceFaviconSrc(href, hrefKind);
  const content = (
    <>
      {faviconSrc && (
        <img
          className="reference-card-favicon"
          src={faviconSrc}
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
      <span className="reference-card-content">
        <span className="reference-card-title">{title}</span>
        <span className="reference-card-source">{domain}</span>
      </span>
      <ExternalLink className="reference-card-icon" aria-hidden="true" />
    </>
  );

  if (hrefKind === 'unsafe') {
    return <span className={cardClassName}>{content}</span>;
  }

  if (hrefKind === 'external') {
    return (
      <a
        href={href}
        {...(shouldOpenInNewTab(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={cardClassName}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cardClassName} {...props}>
      {content}
    </Link>
  );
}

export async function renderMarkdownToReact(
  markdown: string,
  linkMaps: ContentLinkMaps = EMPTY_LINK_MAPS,
  lang: PostLang = DEFAULT_POST_LANG,
): Promise<ReactNode> {
  const normalizedMarkdown = normalizeMarkdownImageSizeSyntax(markdown);
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkNormalizeKatexMath)
    .use(remarkImageDimensions)
    .use(remarkImageRow)
    .use(remarkImageRawCaption)
    .use(remarkWikiLink, {
      aliasDivider: '|',
      pageResolver: (pageName: string) => [pageName],
      permalinks: Object.keys(linkMaps.published),
      hrefTemplate: (permalink: string) => linkMaps.published[permalink] || permalink,
    })
    .use(remarkResolveWikiLinks(linkMaps, lang))
    .use(remarkRepairAdjacentStrongMarkers)
    .use(remarkRepairBrokenStrongMarkers)
    .use(remarkAlert)
    .use(remarkDetailsBlocks)
    .use(remarkRehype)
    .use(rehypeMermaidComponent)
    .use(rehypeKatex)
    .use(rehypeReferenceCards)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['heading-anchor'],
      },
    })
    .use(rehypePrettyCode, {
      theme: {
        light: 'github-light',
        dark: 'github-dark',
      },
      keepBackground: false,
    })
    .use(rehypeCodeBlock)
    .use(rehypeReact, {
      Fragment,
      jsx,
      jsxs,
      components: {
        a: MarkdownLink,
        img: MarkdownImage,
        mermaid: (props: ComponentPropsWithoutRef<typeof Mermaid>) => (
          <Mermaid {...props} lang={lang} />
        ),
        'code-block': (props: ComponentPropsWithoutRef<typeof CodeBlock>) => (
          <CodeBlock {...props} lang={lang} />
        ),
        'reference-card': ReferenceCard,
      },
    })
    .process(normalizedMarkdown);

  return file.result as ReactNode;
}

export function extractTableOfContentsFromMarkdown(markdown: string): TableOfContentsItem[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as MdastRoot;
  const slugger = new GithubSlugger();
  const headings: TableOfContentsItem[] = [];

  visit(
    tree,
    () => true,
    node => {
      if (node.type !== 'heading') {
        return;
      }

      const heading = node as Heading;
      if (heading.depth < 1 || heading.depth > 2) {
        return;
      }

      const title = mdastToString(heading).trim();
      if (!title) {
        return;
      }

      headings.push({
        id: slugger.slug(title),
        title,
        level: heading.depth as 1 | 2,
      });
    },
  );

  const root: TableOfContentsItem[] = [];
  const stack: TableOfContentsItem[] = [];

  for (const heading of headings) {
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(heading);
    } else {
      const parent = stack[stack.length - 1];
      parent.children = parent.children || [];
      parent.children.push(heading);
    }

    stack.push(heading);
  }

  return root;
}
