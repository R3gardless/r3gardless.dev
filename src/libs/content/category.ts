const CONTENT_LAYER_DIRS = new Set(['wiki', 'report', 'reports', 'source', 'sources']);

export const CATEGORY_COLORS = [
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];

const HASH_CATEGORY_COLORS = [
  'blue',
  'green',
  'purple',
  'orange',
  'yellow',
  'pink',
  'red',
  'brown',
] as const satisfies readonly CategoryColor[];

const CATEGORY_COLOR_BY_NAME: Record<string, CategoryColor> = {
  blog: 'blue',
  'build system': 'orange',
  database: 'blue',
  db: 'blue',
  frontend: 'green',
  infra: 'orange',
  postgres: 'blue',
  postgresql: 'blue',
  'vector search': 'purple',
  web: 'green',
  데이터베이스: 'blue',
  벡터검색: 'purple',
  웹: 'green',
};

export function deriveCategoryFromPath(dirRelativePath: string): string | undefined {
  const pathParts = dirRelativePath.split('/').filter(Boolean);
  const layerIndex = pathParts.findIndex(part => CONTENT_LAYER_DIRS.has(part));

  if (layerIndex > 0) {
    return pathParts[layerIndex - 1];
  }

  return undefined;
}

function normalizeCategoryName(category: string): string {
  return category.trim().toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');
}

function hashCategoryName(category: string): number {
  let hash = 0;
  for (const character of category) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

export function resolveCategoryColor(
  category: string | undefined,
  explicitColor?: CategoryColor,
): CategoryColor {
  if (explicitColor) {
    return explicitColor;
  }

  if (!category) {
    return 'gray';
  }

  const normalized = normalizeCategoryName(category);
  const knownColor = CATEGORY_COLOR_BY_NAME[normalized];
  if (knownColor) {
    return knownColor;
  }

  return HASH_CATEGORY_COLORS[hashCategoryName(normalized) % HASH_CATEGORY_COLORS.length];
}

function hslToRgb(hue: number, saturation: number, lightness: number): [number, number, number] {
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;

  const [r1, g1, b1] =
    hue < 60
      ? [c, x, 0]
      : hue < 120
        ? [x, c, 0]
        : hue < 180
          ? [0, c, x]
          : hue < 240
            ? [0, x, c]
            : hue < 300
              ? [x, 0, c]
              : [c, 0, x];

  return [Math.round((r1 + m) * 255), Math.round((g1 + m) * 255), Math.round((b1 + m) * 255)];
}

function getReadableForegroundRgb([red, green, blue]: [number, number, number]): string {
  const normalize = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  };
  const luminance = 0.2126 * normalize(red) + 0.7152 * normalize(green) + 0.0722 * normalize(blue);

  return luminance > 0.48 ? '24 24 23' : '255 255 255';
}

export function resolveCategoryRgb(category: string | undefined): string {
  const normalized = normalizeCategoryName(category || 'uncategorized');
  const hash = hashCategoryName(normalized);
  const hue = hash % 360;
  const saturation = 46 + ((hash >>> 8) % 18);
  const lightness = 74 + ((hash >>> 16) % 8);
  const rgb = hslToRgb(hue, saturation, lightness);

  return rgb.join(' ');
}

export function resolveCategoryForegroundRgb(category: string | undefined): string {
  const rgb = resolveCategoryRgb(category).split(' ').map(Number) as [number, number, number];

  return getReadableForegroundRgb(rgb);
}
