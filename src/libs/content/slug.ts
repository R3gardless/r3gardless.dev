import GithubSlugger from 'github-slugger';

const UNSAFE_SLUG_CHARACTERS = /[^\p{Letter}\p{Number}_-]+/gu;

export function stripMarkdownExtension(fileName: string): string {
  return fileName.replace(/\.mdx?$/i, '');
}

export function slugifyPost(rawValue: string): string {
  const normalized = rawValue
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/\./g, '-')
    .replace(UNSAFE_SLUG_CHARACTERS, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || 'untitled';
}

export function slugifyHeading(rawValue: string): string {
  const slugger = new GithubSlugger();
  return slugger.slug(rawValue);
}

export function createPostSlug(fileStem: string, frontmatterSlug?: string): string {
  return slugifyPost(frontmatterSlug || fileStem);
}

function normalizePostSlugDate(value?: string): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString().slice(0, 10);
}

export function createDatedPostSlug(
  fileStem: string,
  frontmatterSlug?: string,
  date?: string,
): string {
  const slug = createPostSlug(fileStem, frontmatterSlug);
  const datePrefix = normalizePostSlugDate(date);

  if (!datePrefix) {
    return slug;
  }

  return `${datePrefix}-${slug.replace(/^\d{4}-\d{2}-\d{2}-/, '')}`;
}
