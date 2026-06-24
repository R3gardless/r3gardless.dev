import type { Paragraph, PhrasingContent, Root } from 'mdast';
import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

function textNode(value: string): PhrasingContent {
  return { type: 'text', value };
}

function sanitizeInlineNode(node: PhrasingContent): PhrasingContent[] {
  switch (node.type) {
    case 'text':
    case 'inlineCode':
    case 'inlineMath':
    case 'break':
      return [node];
    case 'emphasis':
    case 'strong':
    case 'delete':
      return [
        {
          ...node,
          children: node.children.flatMap(sanitizeInlineNode),
        },
      ];
    case 'link':
    case 'linkReference':
      return node.children.flatMap(sanitizeInlineNode);
    case 'image':
    case 'imageReference':
      return node.alt ? [textNode(node.alt)] : [];
    case 'html': {
      const label = toString(node).trim();
      return label ? [textNode(label)] : [];
    }
    default:
      return [];
  }
}

export function parseInlineMarkdownChildren(markdown: string): PhrasingContent[] {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(markdown) as Root;
  const paragraph = tree.children.find((node): node is Paragraph => node.type === 'paragraph');
  const children = paragraph?.children.flatMap(sanitizeInlineNode) ?? [];

  return children.length > 0 ? children : [textNode(markdown)];
}
