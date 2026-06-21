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
