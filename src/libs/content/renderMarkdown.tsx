import GithubSlugger from 'github-slugger';
import type { Element, Root as HastRoot } from 'hast';
import { toString as hastToString } from 'hast-util-to-string';
import type { Heading, Root as MdastRoot } from 'mdast';
import { toString as mdastToString } from 'mdast-util-to-string';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeRaw from 'rehype-raw';
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

import { Mermaid } from '@/components/ui/blog/Mermaid';
import type { TableOfContentsItem } from '@/types/blog';

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

function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href);
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
          const label = wikiNode.data?.alias;
          const resolution = resolveWikiLinkFromMaps(wikiNode.value, label, linkMaps);

          if (resolution.kind === 'text') {
            if (mdastParent && typeof index === 'number') {
              mdastParent.children[index] = {
                type: 'text',
                value: resolution.label,
              };
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

function MarkdownLink({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
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

function MarkdownImage({ src, alt = '', title }: ComponentPropsWithoutRef<'img'>) {
  if (typeof src !== 'string') {
    return null;
  }

  return (
    <span className="markdown-image my-6 block">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        className="h-auto w-full rounded-lg border border-[color:var(--color-border)] object-contain"
        unoptimized
      />
      {(alt || title) && (
        <span className="mt-2 block text-center text-sm text-[color:var(--color-text-secondary)]">
          {title || alt}
        </span>
      )}
    </span>
  );
}

export async function renderMarkdownToReact(
  markdown: string,
  linkMaps: ContentLinkMaps = EMPTY_LINK_MAPS,
): Promise<ReactNode> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkNormalizeKatexMath)
    .use(remarkWikiLink, {
      aliasDivider: '|',
      pageResolver: (pageName: string) => [pageName],
      permalinks: Object.keys(linkMaps.published),
      hrefTemplate: (permalink: string) => linkMaps.published[permalink] || permalink,
    })
    .use(remarkResolveWikiLinks(linkMaps))
    .use(remarkAlert)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeMermaidComponent)
    .use(rehypeKatex)
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
      },
    })
    .process(markdown);

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
