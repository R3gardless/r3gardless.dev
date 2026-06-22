#!/usr/bin/env tsx
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { PROJECT_ROOT } from './content-paths.js';

const REQUIRED_VERIFY_STEPS = [
  'types:check',
  'lint:check',
  'format:check',
  'test:unit:run',
  'build',
  'check-content',
  'check-repo',
  'smoke:out',
  'check-links',
];

const REQUIRED_CI_COMMANDS = [
  'bun run types:check',
  'bun run lint:check',
  'bun run format:check',
  'bun run build',
  'bun run check-content',
  'bun run check-repo',
  'bun run smoke:out',
  'bun run check-links',
  'bun run test:unit:run',
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
  'GEMINI.md',
  'docs/REPO_GUIDE.md',
  '.agents/r3gardless-dev/SKILL.md',
  '.agents/r3gardless-dev/references/repo-guide.md',
  '.codex/skills/r3gardless-dev/SKILL.md',
  '.codex/skills/r3gardless-dev/references/repo-guide.md',
  'scripts/check-content-quality.ts',
  'scripts/check-repo-governance.ts',
  'scripts/check-links.ts',
  'src/styles/markdown.css',
  '.husky/pre-push',
  '.github/workflows/ci.yml',
  '.github/workflows/deploy.yml',
];

const GENERATED_ARTIFACT_PATTERNS = ['content/posts/', 'public/content/', 'public/data/'];

const PRIVATE_LOG_HYGIENE_PATTERNS = [
  {
    file: 'scripts/build-content.ts',
    forbidden: ['from ${kbRoot}', '${diagnostic.file ?'],
  },
  {
    file: 'scripts/build-post-meta.ts',
    forbidden: [
      'from ${contentRoot}',
      'at ${outputPath}',
      "console.error('Build metadata process failed:', error)",
    ],
  },
  {
    file: 'scripts/content-paths.ts',
    forbidden: ['Tried: ${KNOWLEDGE_BASE_PATH_CANDIDATES'],
  },
  {
    file: 'scripts/sync-knowledge-base.ts',
    forbidden: [
      "stdio: 'inherit'",
      'already exists: ${path.resolve(configuredPath)}',
      'to ${resolveSyncedKbPath()}',
      'does not look like a KNOWLEDGE_BASE: ${SYNC_ROOT}',
    ],
  },
  {
    file: 'src/libs/content/scanner.ts',
    forbidden: ['does not exist: ${kbRoot}', 'also used by ${duplicate.relativePath}'],
  },
];

const STRUCTURAL_SMELL_PATTERNS = [
  {
    file: 'src/utils/search.ts',
    forbidden: ['previous[index] = current[index]'],
    message: 'search Levenshtein rows must be swapped instead of copied on every iteration.',
  },
  {
    file: 'src/app/page.tsx',
    forbidden: ['new Set(posts.map(post => post.category.text))'],
    message: 'page-level post filter data must come from shared blog utils.',
  },
  {
    file: 'src/app/blog/page.tsx',
    forbidden: [
      'new Set(posts.map(post => post.category.text))',
      'new Set(posts.flatMap(post => post.tags))',
    ],
    message: 'page-level post filter data must come from shared blog utils.',
  },
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

function stripSourceComments(text: string): string {
  let result = '';
  let state:
    | 'code'
    | 'single-quote'
    | 'double-quote'
    | 'template'
    | 'line-comment'
    | 'block-comment' = 'code';

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (state === 'line-comment') {
      if (char === '\n') {
        result += char;
        state = 'code';
      }
      continue;
    }

    if (state === 'block-comment') {
      if (char === '*' && nextChar === '/') {
        index += 1;
        state = 'code';
        continue;
      }

      if (char === '\n') {
        result += char;
      }
      continue;
    }

    if (state === 'single-quote' || state === 'double-quote' || state === 'template') {
      result += char;

      if (char === '\\') {
        if (typeof nextChar !== 'undefined') {
          result += nextChar;
          index += 1;
        }
        continue;
      }

      if (
        (state === 'single-quote' && char === "'") ||
        (state === 'double-quote' && char === '"') ||
        (state === 'template' && char === '`')
      ) {
        state = 'code';
      }
      continue;
    }

    if (char === '/' && nextChar === '/') {
      state = 'line-comment';
      index += 1;
      continue;
    }

    if (char === '/' && nextChar === '*') {
      state = 'block-comment';
      index += 1;
      continue;
    }

    result += char;

    if (char === "'") {
      state = 'single-quote';
    } else if (char === '"') {
      state = 'double-quote';
    } else if (char === '`') {
      state = 'template';
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

  const codexSkillPath = path.join(PROJECT_ROOT, '.codex/skills/r3gardless-dev/SKILL.md');
  const codexSkillReferencePath = path.join(
    PROJECT_ROOT,
    '.codex/skills/r3gardless-dev/references/repo-guide.md',
  );

  if (
    fs.existsSync(codexSkillPath) &&
    (!fs.lstatSync(codexSkillPath).isSymbolicLink() ||
      fs.readlinkSync(codexSkillPath) !== '../../../.agents/r3gardless-dev/SKILL.md')
  ) {
    errors.push('.codex/skills/r3gardless-dev/SKILL.md must symlink to shared .agents skill.');
  }

  if (
    fs.existsSync(codexSkillReferencePath) &&
    (!fs.lstatSync(codexSkillReferencePath).isSymbolicLink() ||
      fs.readlinkSync(codexSkillReferencePath) !==
        '../../../../.agents/r3gardless-dev/references/repo-guide.md')
  ) {
    errors.push(
      '.codex/skills/r3gardless-dev/references/repo-guide.md must symlink to shared .agents reference.',
    );
  }
}

function checkGeneratedArtifactsIgnored(errors: string[]) {
  const gitignore = readText('.gitignore');

  for (const pattern of GENERATED_ARTIFACT_PATTERNS) {
    if (!gitignore.includes(pattern)) {
      errors.push(`.gitignore must ignore generated build artifact path: ${pattern}`);
    }
  }

  const trackedArtifacts = execFileSync(
    'git',
    ['ls-files', 'content/posts', 'public/content', 'public/data'],
    {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
    },
  )
    .trim()
    .split('\n')
    .filter(Boolean);

  if (trackedArtifacts.length > 0) {
    errors.push(
      `Generated content artifacts must not be tracked in git: ${trackedArtifacts.join(', ')}`,
    );
  }
}

function checkPrivateLogHygiene(errors: string[]) {
  for (const { file, forbidden } of PRIVATE_LOG_HYGIENE_PATTERNS) {
    const text = readText(file);
    for (const snippet of forbidden) {
      if (text.includes(snippet)) {
        errors.push(`${file}: build logs must not expose private content paths by default.`);
      }
    }
  }
}

function checkStructuralSmellPatterns(errors: string[]) {
  for (const { file, forbidden, message } of STRUCTURAL_SMELL_PATTERNS) {
    const text = readText(file);
    for (const snippet of forbidden) {
      if (text.includes(snippet)) {
        errors.push(`${file}: ${message}`);
      }
    }
  }

  const blogPosts = readText('src/components/sections/BlogPosts/BlogPosts.tsx');
  const ascendingSortLabelCount = blogPosts.match(/오름차순 정렬/g)?.length ?? 0;
  const descendingSortLabelCount = blogPosts.match(/내림차순 정렬/g)?.length ?? 0;

  if (ascendingSortLabelCount !== 1 || descendingSortLabelCount !== 1) {
    errors.push('BlogPosts sort controls must be implemented once and reused across states.');
  }

  const recentPosts = readText('src/components/sections/RecentPosts/RecentPosts.tsx');
  if (/\bposts\s*\.\s*sort\s*\(/.test(recentPosts)) {
    errors.push('RecentPosts must not mutate the posts prop while sorting.');
  }

  if (recentPosts.includes('style={{ animationDelay')) {
    errors.push('RecentPosts must preserve the existing class-based animation delay rendering.');
  }

  const blogUtils = readText('src/utils/blog.ts');
  if (!blogUtils.includes('return `/blog/?${params.toString()}`;')) {
    errors.push('createBlogFilterHref must preserve the existing /blog/?query URL shape.');
  }
}

function checkSourceCommentStripping(errors: string[]) {
  const docsUrl = ['https:', '//example.com/docs'].join('');
  const apiUrl = ['http:', '//example.com/api'].join('');
  const stripped = stripSourceComments(`
const docsUrl = '${docsUrl}';
const apiUrl = "${apiUrl}";
console.warn('visible runtime log');
// console.error('hidden line comment log');
/* console.warn('hidden block comment log'); */
`);

  if (!stripped.includes(docsUrl) || !stripped.includes(apiUrl)) {
    errors.push('Source comment stripping must preserve URL strings.');
  }

  if (!stripped.includes("console.warn('visible runtime log')")) {
    errors.push('Source comment stripping must preserve executable source.');
  }

  if (
    stripped.includes('hidden line comment log') ||
    stripped.includes('hidden block comment log')
  ) {
    errors.push('Source comment stripping must remove real comments.');
  }
}

function checkProductionLogging(errors: string[]) {
  const sourceFiles = walkFiles(path.join(PROJECT_ROOT, 'src')).filter(filePath => {
    const relativePath = path.relative(PROJECT_ROOT, filePath);
    return (
      /\.(ts|tsx)$/.test(filePath) &&
      !relativePath.endsWith('.test.ts') &&
      !relativePath.endsWith('.test.tsx') &&
      !relativePath.endsWith('.stories.tsx') &&
      relativePath !== 'src/utils/logger.ts'
    );
  });

  for (const filePath of sourceFiles) {
    const source = stripSourceComments(fs.readFileSync(filePath, 'utf8'));
    if (/console\.(debug|error|info|log|warn)\s*\(/.test(source)) {
      errors.push(
        `${path.relative(PROJECT_ROOT, filePath)}: production code must use src/utils/logger.ts instead of raw console calls.`,
      );
    }
  }
}

function checkPackageScripts(errors: string[]) {
  const packageJson = readJson<PackageJson>('package.json');
  const scripts = packageJson.scripts ?? {};
  const verify = scripts.verify ?? '';
  const prebuild = scripts.prebuild ?? '';

  for (const step of REQUIRED_VERIFY_STEPS) {
    if (!verify.includes(`bun run ${step}`)) {
      errors.push(`package.json verify script must include "bun run ${step}".`);
    }
  }

  if (!prebuild.includes('bun run build:content') || !prebuild.includes('bun run build:meta')) {
    errors.push('package.json prebuild script must run build:content and build:meta.');
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
    errors.push('CI/CD must checkout private KNOWLEDGE_BASE repository R3gardless/KNOWLEDGE_BASE.');
  }

  if (workflowText.includes('housing_knowledge_base')) {
    errors.push('CI/CD must not checkout the old housing_knowledge_base repository.');
  }

  if (
    !workflowText.includes('KNOWLEDGE_BASE_PATH: ${{ github.workspace }}/.cache/knowledge-base')
  ) {
    errors.push('CI/CD must set KNOWLEDGE_BASE_PATH to the checked-out repository root.');
  }

  if (workflowText.includes('KB_PATH:')) {
    errors.push('CI/CD must use KNOWLEDGE_BASE_PATH, not the legacy KB_PATH name.');
  }

  if (!workflowText.includes('KNOWLEDGE_BASE_TOKEN: ${{ secrets.KNOWLEDGE_BASE_TOKEN }}')) {
    errors.push('CI/CD must read the private KNOWLEDGE_BASE token from KNOWLEDGE_BASE_TOKEN.');
  }

  if (workflowText.includes('KB_REPO_TOKEN')) {
    errors.push('CI/CD must use KNOWLEDGE_BASE_TOKEN, not the legacy KB_REPO_TOKEN name.');
  }

  if (!ci.includes('lint-build:')) {
    errors.push('ci.yml must expose the required lint-build check.');
  }

  if (!ci.includes('unit-test:')) {
    errors.push('ci.yml must expose the required unit-test check.');
  }

  if (workflowText.includes('Use fixture') || workflowText.includes('tests/fixtures/kb')) {
    errors.push(
      'CI/CD must not fallback to fixture KNOWLEDGE_BASE when the private token is missing.',
    );
  }

  for (const command of REQUIRED_CI_COMMANDS) {
    if (!ci.includes(`run: ${command}`)) {
      errors.push(`ci.yml must run "${command}".`);
    }
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

function checkKbPathResolution(errors: string[]) {
  const contentPaths = readText('scripts/content-paths.ts');
  const knowledgeBasePathIndex = contentPaths.indexOf('process.env.KNOWLEDGE_BASE_PATH');
  const legacyKnowledgeBasePathIndex = contentPaths.indexOf('process.env.KB_PATH');
  const cacheKbIndex = contentPaths.indexOf("'.cache', 'knowledge-base'");

  if (knowledgeBasePathIndex === -1) {
    errors.push(
      'scripts/content-paths.ts must allow KNOWLEDGE_BASE_PATH to override all default roots.',
    );
  }

  if (contentPaths.includes('/Users/')) {
    errors.push('scripts/content-paths.ts must not hardcode a local user home path.');
  }

  if (cacheKbIndex === -1) {
    errors.push('scripts/content-paths.ts must include the synced cache path for CI/CD.');
  }

  if (
    knowledgeBasePathIndex !== -1 &&
    cacheKbIndex !== -1 &&
    !(knowledgeBasePathIndex < cacheKbIndex)
  ) {
    errors.push('scripts/content-paths.ts must resolve KNOWLEDGE_BASE_PATH before cache roots.');
  }

  if (
    knowledgeBasePathIndex !== -1 &&
    legacyKnowledgeBasePathIndex !== -1 &&
    !(knowledgeBasePathIndex < legacyKnowledgeBasePathIndex)
  ) {
    errors.push('scripts/content-paths.ts must prefer KNOWLEDGE_BASE_PATH over legacy KB_PATH.');
  }
}

function checkHuskyHooks(errors: string[]) {
  const prePush = readText('.husky/pre-push');

  if (!prePush.includes('bun run sync:knowledge-base')) {
    errors.push(
      '.husky/pre-push must sync the private KNOWLEDGE_BASE cache before building when KNOWLEDGE_BASE_PATH is not set.',
    );
  }

  if (!prePush.includes('[ -z "$KNOWLEDGE_BASE_PATH" ]')) {
    errors.push(
      '.husky/pre-push must let an explicit KNOWLEDGE_BASE_PATH override the synced cache.',
    );
  }

  if (!prePush.includes('bun run build')) {
    errors.push('.husky/pre-push must run bun run build before pushing.');
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
  const skill = readText('.agents/r3gardless-dev/SKILL.md');

  for (const [name, text] of [
    ['AGENTS.md', agents],
    ['docs/REPO_GUIDE.md', guide],
    ['.agents/r3gardless-dev/SKILL.md', skill],
  ] as const) {
    if (!text.includes('cover')) {
      errors.push(`${name} must document cover as the canonical image field.`);
    }

    if (!text.includes('Pretendard')) {
      errors.push(`${name} must document Pretendard typography expectations.`);
    }

    if (!text.includes('content hash')) {
      errors.push(`${name} must document content-hashed exported asset URLs.`);
    }
  }

  if (!guide.includes('R3gardless/KNOWLEDGE_BASE')) {
    errors.push('docs/REPO_GUIDE.md must document the private KNOWLEDGE_BASE repository.');
  }

  for (const [name, text] of [
    ['AGENTS.md', agents],
    ['docs/REPO_GUIDE.md', guide],
    ['.agents/r3gardless-dev/SKILL.md', skill],
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

    if (!text.includes("objectFit: 'fill'")) {
      errors.push(`${relativePath}: post cover images must set inline objectFit: 'fill'.`);
    }

    if (text.includes('object-cover')) {
      errors.push(
        `${relativePath}: post cover images must not use object-cover because that preserves aspect ratio and crops.`,
      );
    }

    if (!text.includes(' fill') && !text.includes(' fill ')) {
      errors.push(
        `${relativePath}: post cover images must use next/image fill inside fixed frames.`,
      );
    }

    if (/width=\{\d+\}|height=\{\d+\}/.test(text)) {
      errors.push(
        `${relativePath}: post cover images must not use numeric width/height props; use fill with a rem-sized frame.`,
      );
    }
  }
}

function checkBlogUnitConventions(errors: string[]) {
  const blogFiles = walkFiles(path.join(PROJECT_ROOT, 'src', 'components', 'ui', 'blog')).filter(
    filePath => /\.(ts|tsx)$/.test(filePath),
  );
  const pxUnitPattern = /\b\d*\.?\d+px\b/g;

  for (const filePath of blogFiles) {
    const text = fs.readFileSync(filePath, 'utf8');
    const matches = [...text.matchAll(pxUnitPattern)].map(match => match[0]);

    if (matches.length === 0) {
      continue;
    }

    const relativePath = path.relative(PROJECT_ROOT, filePath);
    errors.push(
      `${relativePath}: blog UI files must use rem units instead of px. Found: ${[...new Set(matches)].join(', ')}`,
    );
  }
}

function checkContentAssetPipeline(errors: string[]) {
  const exporter = readText('src/libs/content/exporter.ts');
  const checkContent = readText('scripts/check-content-quality.ts');

  if (!exporter.includes("createHash('sha256')")) {
    errors.push('src/libs/content/exporter.ts must content-hash exported asset filenames.');
  }

  if (!exporter.includes('preserveAspectRatio="none"')) {
    errors.push('src/libs/content/exporter.ts must force exported SVG covers to fill frames.');
  }

  if (!checkContent.includes('CONTENT_HASHED_ASSET_PATTERN')) {
    errors.push('scripts/check-content-quality.ts must reject unhashed exported asset URLs.');
  }
}

function main() {
  const errors: string[] = [];

  checkRequiredFiles(errors);
  checkGeneratedArtifactsIgnored(errors);
  checkPrivateLogHygiene(errors);
  checkStructuralSmellPatterns(errors);
  checkSourceCommentStripping(errors);
  checkProductionLogging(errors);
  checkPackageScripts(errors);
  checkWorkflows(errors);
  checkKbPathResolution(errors);
  checkHuskyHooks(errors);
  checkForbiddenSourceImports(errors);
  checkDocs(errors);
  checkCoverRendering(errors);
  checkBlogUnitConventions(errors);
  checkContentAssetPipeline(errors);

  if (errors.length > 0) {
    fail(errors);
  }

  console.log('Repository governance checked.');
}

main();
