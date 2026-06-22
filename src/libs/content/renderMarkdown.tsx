import GithubSlugger from 'github-slugger';
import type { Element, Root as HastRoot, Text as HastText } from 'hast';
import { toString as hastToString } from 'hast-util-to-string';
import { ExternalLink } from 'lucide-react';
import type { Heading, Root as MdastRoot } from 'mdast';
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

import { MarkdownImageLightbox } from '@/components/ui/blog/MarkdownImageLightbox';
import { Mermaid } from '@/components/ui/blog/Mermaid';
import type { TableOfContentsItem } from '@/types/blog';

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
import { resolveWikiLinkFromMaps } from './linkResolver';
import { normalizeKatexMathTree } from './math';
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

interface MdastLinkNode {
  type: 'link';
  children?: unknown[];
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

function strongNode(child: unknown): MdastStrongNode {
  return {
    type: 'strong',
    children: [child],
  };
}

function consumeStrongMarkersAroundInlineNode(parent: MdastParent, index: number): boolean {
  const previous = parent.children[index - 1];
  const next = parent.children[index + 1];

  if (!isMdastTextNode(previous) || !isMdastTextNode(next)) {
    return false;
  }

  if (!previous.value.endsWith('**') || !next.value.startsWith('**')) {
    return false;
  }

  previous.value = previous.value.slice(0, -2);
  next.value = next.value.slice(2);

  return true;
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

  const title = hastToString(element)
    .trim()
    .toLowerCase()
    .replace(/^\d+(?:\.\d+)*\.?\s*/, '');

  return (
    title === '참고문헌' ||
    title === 'references' ||
    title === 'reference' ||
    title === 'sources' ||
    title === 'source'
  );
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

function remarkResolveWikiLinks(linkMaps: ContentLinkMaps) {
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
          const resolution = resolveWikiLinkFromMaps(wikiNode.value, label, linkMaps);
          const isStrongWrapped =
            mdastParent && typeof index === 'number'
              ? consumeStrongMarkersAroundInlineNode(mdastParent, index)
              : false;

          if (resolution.kind === 'text') {
            if (mdastParent && typeof index === 'number') {
              const replacement = {
                type: 'text',
                value: resolution.label,
              };
              mdastParent.children[index] = isStrongWrapped ? strongNode(replacement) : replacement;
            }
            return;
          }

          wikiNode.data = {
            ...wikiNode.data,
            hName: 'a',
            hProperties: {
              href: resolution.href,
              className: resolution.kind === 'internal' ? 'wiki-link' : 'wiki-link external-link',
              ...(resolution.external
                ? {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  }
                : {}),
            },
            hChildren: [{ type: 'text', value: resolution.label }],
          };

          if (isStrongWrapped && mdastParent && typeof index === 'number') {
            mdastParent.children[index] = strongNode(wikiNode);
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
        if (!consumeStrongMarkersAroundInlineNode(mdastParent, index)) {
          return;
        }

        mdastParent.children[index] = strongNode(node);
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

function MarkdownImage({ src, alt = '', title, width, height }: ComponentPropsWithoutRef<'img'>) {
  if (typeof src !== 'string') {
    return null;
  }

  const parsedAlt = parseMarkdownImageAlt(alt);
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
  const caption = titleDimensions ? parsedAlt.alt : title || parsedAlt.alt;

  return (
    <MarkdownImageLightbox
      src={src}
      alt={parsedAlt.alt}
      width={intrinsicWidth}
      height={intrinsicHeight}
      className={imageClassName}
      style={imageStyle}
      caption={caption || undefined}
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
  const sourceLabel = source || sourceLabelFromHref(href);
  const cardClassName = ['reference-card', className].filter(Boolean).join(' ');
  const hrefKind = classifyHref(href);
  const content = (
    <>
      <span className="reference-card-content">
        <span className="reference-card-title">{title}</span>
        <span className="reference-card-source">{sourceLabel}</span>
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
): Promise<ReactNode> {
  const normalizedMarkdown = normalizeMarkdownImageSizeSyntax(markdown);
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkNormalizeKatexMath)
    .use(remarkImageDimensions)
    .use(remarkWikiLink, {
      aliasDivider: '|',
      pageResolver: (pageName: string) => [pageName],
      permalinks: Object.keys(linkMaps.published),
      hrefTemplate: (permalink: string) => linkMaps.published[permalink] || permalink,
    })
    .use(remarkResolveWikiLinks(linkMaps))
    .use(remarkRepairAdjacentStrongMarkers)
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
    .use(rehypeReact, {
      Fragment,
      jsx,
      jsxs,
      components: {
        a: MarkdownLink,
        img: MarkdownImage,
        mermaid: Mermaid,
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
