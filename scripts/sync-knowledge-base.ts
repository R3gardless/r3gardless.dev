#!/usr/bin/env tsx
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { PROJECT_ROOT } from './content-paths.js';

const DEFAULT_KNOWLEDGE_BASE_REPO_URL = 'https://github.com/R3gardless/KNOWLEDGE_BASE.git';
const SYNC_ROOT = path.resolve(
  process.env.KNOWLEDGE_BASE_SYNC_DIR ||
    process.env.KB_SYNC_DIR ||
    path.join(PROJECT_ROOT, '.cache', 'knowledge-base'),
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
    throw new Error(`Synced repository does not look like a KNOWLEDGE_BASE: ${SYNC_ROOT}`);
  }

  return found;
}

function main() {
  const configuredPath = process.env.KNOWLEDGE_BASE_PATH || process.env.KB_PATH;
  if (configuredPath && fs.existsSync(configuredPath)) {
    console.log(`KNOWLEDGE_BASE_PATH already exists: ${path.resolve(configuredPath)}`);
    return;
  }

  const repoUrl =
    process.env.KNOWLEDGE_BASE_REPO_URL ||
    process.env.KB_REPO_URL ||
    DEFAULT_KNOWLEDGE_BASE_REPO_URL;
  fs.mkdirSync(path.dirname(SYNC_ROOT), { recursive: true });

  if (fs.existsSync(path.join(SYNC_ROOT, '.git'))) {
    runGit(['-C', SYNC_ROOT, 'pull', '--ff-only']);
  } else {
    fs.rmSync(SYNC_ROOT, { recursive: true, force: true });
    runGit(['clone', '--depth=1', repoUrl, SYNC_ROOT]);
  }

  console.log(`Synced KNOWLEDGE_BASE to ${resolveSyncedKbPath()}`);
}

main();
