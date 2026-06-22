export interface MarkdownImageDimensions {
  width?: number;
  height?: number;
}

export interface ParsedMarkdownImageAlt {
  alt: string;
  dimensions: MarkdownImageDimensions | null;
}

export interface ParsedMarkdownImageAttributeBlock {
  dimensions: MarkdownImageDimensions;
  consumedLength: number;
}

const SIZE_SPEC_PATTERN = /^(\d{1,5})(?:\s*[x×]\s*(\d{1,5}))?$/i;
const IMAGE_SIZE_SYNTAX_PATTERN =
  /!\[([^\]\n]*)\]\(([^)\s]+)\s+=([0-9]{1,5}(?:\s*[x×]\s*[0-9]{1,5})?)\)/g;
const ATTRIBUTE_BLOCK_PATTERN = /^\s*\{([^}]*)\}/;
const ATTRIBUTE_PATTERN = /\b(width|height)\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s}]+))/gi;

export const DEFAULT_MARKDOWN_IMAGE_WIDTH = 1200;
export const DEFAULT_MARKDOWN_IMAGE_HEIGHT = 675;

export function parseMarkdownImageDimensionValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const match = value.trim().match(/^(\d{1,5})(?:px)?$/i);
  if (!match) {
    return undefined;
  }

  const parsed = Number(match[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function parseMarkdownImageSizeSpec(value: unknown): MarkdownImageDimensions | null {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.trim().match(SIZE_SPEC_PATTERN);
  if (!match) {
    return null;
  }

  const width = parseMarkdownImageDimensionValue(match[1]);
  const height = parseMarkdownImageDimensionValue(match[2]);

  if (!width && !height) {
    return null;
  }

  return {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };
}

export function parseMarkdownImageAlt(value: string): ParsedMarkdownImageAlt {
  const separatorIndex = value.lastIndexOf('|');
  if (separatorIndex === -1) {
    return {
      alt: value,
      dimensions: null,
    };
  }

  const dimensions = parseMarkdownImageSizeSpec(value.slice(separatorIndex + 1));
  if (!dimensions) {
    return {
      alt: value,
      dimensions: null,
    };
  }

  return {
    alt: value.slice(0, separatorIndex).trim(),
    dimensions,
  };
}

export function parseMarkdownImageAttributeBlock(
  value: string,
): ParsedMarkdownImageAttributeBlock | null {
  const blockMatch = value.match(ATTRIBUTE_BLOCK_PATTERN);
  if (!blockMatch) {
    return null;
  }

  const dimensions: MarkdownImageDimensions = {};
  for (const attrMatch of blockMatch[1].matchAll(ATTRIBUTE_PATTERN)) {
    const name = attrMatch[1].toLowerCase();
    const rawValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
    const parsed = parseMarkdownImageDimensionValue(rawValue);

    if (!parsed) {
      continue;
    }

    if (name === 'width') {
      dimensions.width = parsed;
    }

    if (name === 'height') {
      dimensions.height = parsed;
    }
  }

  if (!dimensions.width && !dimensions.height) {
    return null;
  }

  return {
    dimensions,
    consumedLength: blockMatch[0].length,
  };
}

export function mergeMarkdownImageDimensions(
  ...items: Array<MarkdownImageDimensions | null | undefined>
): MarkdownImageDimensions {
  return items.reduce<MarkdownImageDimensions>(
    (merged, item) => ({
      ...merged,
      ...(item?.width ? { width: item.width } : {}),
      ...(item?.height ? { height: item.height } : {}),
    }),
    {},
  );
}

export function markdownImageDimensionToRem(value: number): string {
  return `${Number((value / 16).toFixed(4))}rem`;
}

export function normalizeMarkdownImageSizeSyntax(markdown: string): string {
  return markdown.replace(IMAGE_SIZE_SYNTAX_PATTERN, (_match, alt, src, sizeSpec) => {
    const dimensions = parseMarkdownImageSizeSpec(sizeSpec);
    if (!dimensions?.width) {
      return _match;
    }

    const attributes = [
      `width=${dimensions.width}`,
      ...(dimensions.height ? [`height=${dimensions.height}`] : []),
    ].join(' ');

    return `![${alt}](${src}){${attributes}}`;
  });
}
