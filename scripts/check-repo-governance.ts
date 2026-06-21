#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';

import { PROJECT_ROOT } from './content-paths.js';

const REQUIRED_VERIFY_STEPS = [
  'types:check',
  'lint:check',
  'format:check',
  'test:unit:run',
  'build:content',
  'build:meta',
  'check-content',
  'check-repo',
  'build',
  'smoke:out',
  'check-links',
];

const FORBIDDEN_DEPENDENCIES = [
  '@notionhq/client',
  'notion-client',
  'notion-types',
  'notion-utils',
  'react-notion-x',
  'prismjs',
];

const FORBIDDEN_SOURCE_PATTERNS = [
  '@notionhq/client',
  'notion-client',
  'notion-types',
  'notion-utils',
  'react-notion-x',
  'NotionRenderer',
  'ExtendedRecordMap',
];

const REQUIRED_FILES = [
  'AGENTS.md',
  'CLAUDE.md',
  'docs/REPO_GUIDE.md',
  '.codex/skills/r3gardless-dev/SKILL.md',
  'scripts/check-content-quality.ts',
  'scripts/check-repo-governance.ts',
  'scripts/check-links.ts',
  'src/styles/markdown.css',
  '.github/workflows/ci.yml',
  '.github/workflows/deploy.yml',
];

interface PackageJson {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function fail(errors: string[]): never {
  for (const error of errors) {
    console.error(`[ERROR] ${error}`);
  }
  process.exit(1);
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(PROJECT_ROOT, relativePath), 'utf8');
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readText(relativePath)) as T;
}

function walkFiles(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }

  const result: string[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const absolutePath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      result.push(...walkFiles(absolutePath));
      continue;
    }

    if (entry.isFile()) {
      result.push(absolutePath);
    }
  }

  return result;
}

function checkRequiredFiles(errors: string[]) {
  for (const relativePath of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(PROJECT_ROOT, relativePath))) {
      errors.push(`Required governance file is missing: ${relativePath}`);
    }
  }

  if (fs.existsSync(path.join(PROJECT_ROOT, 'src/styles/notion.css'))) {
    errors.push('Legacy src/styles/notion.css must not exist; use src/styles/markdown.css.');
  }
}

function checkPackageScripts(errors: string[]) {
  const packageJson = readJson<PackageJson>('package.json');
  const scripts = packageJson.scripts ?? {};
  const verify = scripts.verify ?? '';

  for (const step of REQUIRED_VERIFY_STEPS) {
    if (!verify.includes(`bun run ${step}`)) {
      errors.push(`package.json verify script must include "bun run ${step}".`);
    }
  }

  if (scripts['check-content'] !== 'tsx scripts/check-content-quality.ts') {
    errors.push('package.json check-content script must run scripts/check-content-quality.ts.');
  }

  if (scripts['check-repo'] !== 'tsx scripts/check-repo-governance.ts') {
    errors.push('package.json check-repo script must run scripts/check-repo-governance.ts.');
  }

  const dependencyNames = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ]);

  for (const dependency of FORBIDDEN_DEPENDENCIES) {
    if (dependencyNames.has(dependency)) {
      errors.push(`Forbidden Notion-era dependency remains in package.json: ${dependency}`);
    }
  }
}

function checkWorkflows(errors: string[]) {
  const ci = readText('.github/workflows/ci.yml');
  const deploy = readText('.github/workflows/deploy.yml');
  const workflowText = `${ci}\n${deploy}`;

  if (!workflowText.includes('repository: R3gardless/KNOWLEDGE_BASE')) {
    errors.push('CI/CD must checkout private KB repository R3gardless/KNOWLEDGE_BASE.');
  }

  if (workflowText.includes('housing_knowledge_base')) {
    errors.push('CI/CD must not checkout the old housing_knowledge_base repository.');
  }

  if (!workflowText.includes('KB_PATH: ${{ github.workspace }}/.cache/knowledge-base')) {
    errors.push('CI/CD must set KB_PATH to the checked-out KB repository root.');
  }

  if (!ci.includes('run: bun run verify')) {
    errors.push('ci.yml must run bun run verify.');
  }

  if (!deploy.includes('run: bun run verify')) {
    errors.push('deploy.yml must run bun run verify before Pages upload.');
  }

  if (!deploy.includes('touch out/.nojekyll')) {
    errors.push('deploy.yml must preserve out/.nojekyll for GitHub Pages.');
  }

  if (!deploy.includes('actions/upload-pages-artifact')) {
    errors.push('deploy.yml must upload the out/ Pages artifact.');
  }

  if (fs.existsSync(path.join(PROJECT_ROOT, '.github/workflows/dependabot-auto-merge.yml'))) {
    errors.push('Automatic merge workflow must not exist.');
  }
}

function checkForbiddenSourceImports(errors: string[]) {
  const roots = ['src', 'scripts'];
  const sourceFiles = roots
    .flatMap(root => walkFiles(path.join(PROJECT_ROOT, root)))
    .filter(filePath => {
      const relativePath = path.relative(PROJECT_ROOT, filePath);
      return (
        /\.(ts|tsx|js|jsx|mjs)$/.test(filePath) &&
        relativePath !== 'scripts/check-repo-governance.ts'
      );
    });

  for (const filePath of sourceFiles) {
    const text = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    for (const pattern of FORBIDDEN_SOURCE_PATTERNS) {
      if (text.includes(pattern)) {
        errors.push(`${relativePath}: forbidden Notion-era source pattern remains: ${pattern}`);
      }
    }
  }
}

function checkDocs(errors: string[]) {
  const agents = readText('AGENTS.md');
  const guide = readText('docs/REPO_GUIDE.md');
  const skill = readText('.codex/skills/r3gardless-dev/SKILL.md');

  for (const [name, text] of [
    ['AGENTS.md', agents],
    ['docs/REPO_GUIDE.md', guide],
    ['.codex/skills/r3gardless-dev/SKILL.md', skill],
  ] as const) {
    if (!text.includes('cover')) {
      errors.push(`${name} must document cover as the canonical image field.`);
    }

    if (!text.includes('Pretendard')) {
      errors.push(`${name} must document Pretendard typography expectations.`);
    }
  }

  if (!guide.includes('R3gardless/KNOWLEDGE_BASE')) {
    errors.push('docs/REPO_GUIDE.md must document the private KB repository.');
  }

  for (const [name, text] of [
    ['AGENTS.md', agents],
    ['docs/REPO_GUIDE.md', guide],
    ['.codex/skills/r3gardless-dev/SKILL.md', skill],
  ] as const) {
    if (!text.includes('src/styles/markdown.css')) {
      errors.push(`${name} must document src/styles/markdown.css as the Markdown body stylesheet.`);
    }

    if (text.includes('src/styles/notion.css')) {
      errors.push(`${name} must not reference legacy src/styles/notion.css.`);
    }
  }
}

function checkCoverRendering(errors: string[]) {
  const coverComponents = [
    'src/components/ui/blog/PostHeader/PostHeader.tsx',
    'src/components/ui/blog/PostCard/PostCard.tsx',
    'src/components/ui/blog/PostRow/PostRow.tsx',
  ];

  for (const relativePath of coverComponents) {
    const text = readText(relativePath);
    if (!text.includes('object-fill')) {
      errors.push(`${relativePath}: post cover images must use object-fill to fill fixed frames.`);
    }

    if (text.includes('object-cover')) {
      errors.push(
        `${relativePath}: post cover images must not use object-cover because that preserves aspect ratio and crops.`,
      );
    }
  }
}

function main() {
  const errors: string[] = [];

  checkRequiredFiles(errors);
  checkPackageScripts(errors);
  checkWorkflows(errors);
  checkForbiddenSourceImports(errors);
  checkDocs(errors);
  checkCoverRendering(errors);

  if (errors.length > 0) {
    fail(errors);
  }

  console.log('Repository governance checked.');
}

main();
