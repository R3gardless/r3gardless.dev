import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const KB_PATH_CANDIDATES = [
  process.env.KB_PATH,
  '/Users/edgar.p/housing_knowledge_base/KNOWELDGE_BASE',
  path.resolve(PROJECT_ROOT, '..', 'housing_knowledge_base', 'KNOWELDGE_BASE'),
  path.join(PROJECT_ROOT, '.cache', 'knowledge-base', 'KNOWELDGE_BASE'),
  path.join(PROJECT_ROOT, '.cache', 'knowledge-base', 'KNOWLEDGE_BASE'),
  path.join(PROJECT_ROOT, '.cache', 'knowledge-base'),
  path.resolve(PROJECT_ROOT, '..', 'KNOWLEDGE_BASE'),
  path.resolve(PROJECT_ROOT, '..', 'KNOWELDGE_BASE'),
].filter(Boolean) as string[];

function resolveKbRoot(candidate: string): string | null {
  const resolved = path.resolve(candidate);
  const nestedCandidates = [
    path.join(resolved, 'KNOWELDGE_BASE'),
    path.join(resolved, 'KNOWLEDGE_BASE'),
    resolved,
  ];

  return nestedCandidates.find(dirPath => fs.existsSync(dirPath)) ?? null;
}

export function resolveKbPath(): string {
  for (const candidate of KB_PATH_CANDIDATES) {
    const kbRoot = resolveKbRoot(candidate);
    if (kbRoot) {
      return kbRoot;
    }
  }

  throw new Error(
    `KB_PATH is required. Tried: ${KB_PATH_CANDIDATES.map(candidate => `"${candidate}"`).join(', ')}`,
  );
}

export function resolveContentRoot(): string {
  return path.resolve(process.env.CONTENT_DIR || path.join(PROJECT_ROOT, 'content', 'posts'));
}

export function resolvePublicRoot(): string {
  return path.resolve(path.join(PROJECT_ROOT, 'public'));
}
