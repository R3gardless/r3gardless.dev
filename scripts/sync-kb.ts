#!/usr/bin/env tsx
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { PROJECT_ROOT } from './content-paths.js';

const DEFAULT_KB_REPO_URL = 'https://github.com/R3gardless/KNOWLEDGE_BASE.git';
const SYNC_ROOT = path.resolve(
  process.env.KB_SYNC_DIR || path.join(PROJECT_ROOT, '.cache', 'knowledge-base'),
);

function runGit(args: string[]) {
  execFileSync('git', args, { stdio: 'inherit' });
}

function hasMarkdownRoot(dirPath: string): boolean {
  return (
    fs.existsSync(path.join(dirPath, 'AGENTS.md')) ||
    fs.existsSync(path.join(dirPath, 'index.md')) ||
    fs.existsSync(path.join(dirPath, 'README.md'))
  );
}

function resolveSyncedKbPath(): string {
  const candidates = [
    path.join(SYNC_ROOT, 'KNOWELDGE_BASE'),
    path.join(SYNC_ROOT, 'KNOWLEDGE_BASE'),
    SYNC_ROOT,
  ];

  const found = candidates.find(hasMarkdownRoot);
  if (!found) {
    throw new Error(`Synced repository does not look like a KB: ${SYNC_ROOT}`);
  }

  return found;
}

function main() {
  if (process.env.KB_PATH && fs.existsSync(process.env.KB_PATH)) {
    console.log(`KB_PATH already exists: ${path.resolve(process.env.KB_PATH)}`);
    return;
  }

  const repoUrl = process.env.KB_REPO_URL || DEFAULT_KB_REPO_URL;
  fs.mkdirSync(path.dirname(SYNC_ROOT), { recursive: true });

  if (fs.existsSync(path.join(SYNC_ROOT, '.git'))) {
    runGit(['-C', SYNC_ROOT, 'pull', '--ff-only']);
  } else {
    fs.rmSync(SYNC_ROOT, { recursive: true, force: true });
    runGit(['clone', '--depth=1', repoUrl, SYNC_ROOT]);
  }

  console.log(`Synced KB to ${resolveSyncedKbPath()}`);
}

main();
