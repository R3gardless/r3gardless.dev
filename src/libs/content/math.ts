import type { Root } from 'mdast';
import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

interface MathNode {
  type: 'math' | 'inlineMath';
  value: string;
  data?: {
    hChildren?: Array<{
      type: string;
      value?: string;
    }>;
  };
}

export function normalizeKatexMathSyntax(value: string): string {
  return value
    .replace(/[\u2018\u2019\u2032\u02b9]/g, "'")
    .replace(/[\u201c\u201d\u2033]/g, "''")
    .replace(/\u2034/g, "'''");
}

export function normalizeKatexMathTree(tree: Root | Node) {
  visit(tree, ['math', 'inlineMath'], node => {
    const mathNode = node as MathNode;
    mathNode.value = normalizeKatexMathSyntax(mathNode.value);
    mathNode.data?.hChildren?.forEach(child => {
      if (typeof child.value === 'string') {
        child.value = normalizeKatexMathSyntax(child.value);
      }
    });
  });
}
