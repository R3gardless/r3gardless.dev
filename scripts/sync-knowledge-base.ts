#!/usr/bin/env tsx
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { PROJECT_ROOT } from './content-paths.js';

const DEFAULT_KNOWLEDGE_BASE_REPO_URL = 'https://github.com/R3gardless/KNOWLEDGE_BASE.git';
const VERBOSE_LOGS = process.env.CONTENT_VERBOSE_LOGS === '1';
const SYNC_ROOT = path.resolve(
  process.env.KNOWLEDGE_BASE_SYNC_DIR ||
    process.env.KB_SYNC_DIR ||
    path.join(PROJECT_ROOT, '.cache', 'knowledge-base'),
);

function runGit(args: string[], failureMessage = 'Private content repository sync failed.') {
  try {
    const output = execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    if (VERBOSE_LOGS && output) {
      process.stdout.write(output);
    }
  } catch {
    throw new Error(failureMessage);
  }
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
    throw new Error('Synced private content repository is missing a Markdown root.');
  }

  return found;
}

function main() {
  const configuredPath = process.env.KNOWLEDGE_BASE_PATH || process.env.KB_PATH;
  if (configuredPath && fs.existsSync(configuredPath)) {
    console.log('Private content repository already available.');
    return;
  }

  const repoUrl =
    process.env.KNOWLEDGE_BASE_REPO_URL ||
    process.env.KB_REPO_URL ||
    DEFAULT_KNOWLEDGE_BASE_REPO_URL;
  fs.mkdirSync(path.dirname(SYNC_ROOT), { recursive: true });

  if (fs.existsSync(path.join(SYNC_ROOT, '.git'))) {
    try {
      runGit(['-C', SYNC_ROOT, 'pull', '--quiet', '--ff-only']);
    } catch (error) {
      if (process.env.CI === 'true') {
        throw error;
      }

      resolveSyncedKbPath();
      console.warn(
        'Private content repository update failed; using the existing local cache. Set CONTENT_VERBOSE_LOGS=1 and retry sync for local debugging.',
      );
      return;
    }
  } else {
    fs.rmSync(SYNC_ROOT, { recursive: true, force: true });
    runGit(['clone', '--quiet', '--depth=1', repoUrl, SYNC_ROOT]);
  }

  resolveSyncedKbPath();
  console.log('Private content repository synced.');
}

main();
