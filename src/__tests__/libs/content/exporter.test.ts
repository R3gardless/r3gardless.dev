import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildContentIndex, exportPublishedPost, transformMarkdownForExport } from '@/libs/content';

const fixtureKbRoot = path.join(process.cwd(), 'tests/fixtures/kb/KNOWELDGE_BASE');
const publishedSlug = '2026-06-21-published-note';
const secondSlug = '2026-06-20-second-note';

let tempRoot: string;

function createExportPaths() {
  return {
    contentRoot: path.join(tempRoot, 'content/posts'),
    publicRoot: path.join(tempRoot, 'public'),
    publicAssetsBasePath: 'content/posts',
  };
}

beforeEach(() => {
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'r3gardless-content-'));
});

afterEach(() => {
  fs.rmSync(tempRoot, { recursive: true, force: true });
});

describe('content exporter', () => {
  it('rewrites markdown links and copies local assets', () => {
    const index = buildContentIndex(fixtureKbRoot);
    const note = index.publishedByBasename.get('published-note');

    expect(note).toBeDefined();

    const result = transformMarkdownForExport(note!, index, createExportPaths());

    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        level: 'warning',
        code: 'LINK_DEGRADED_TO_TEXT',
      }),
    ]);
    expect(result.markdown).toMatch(
      /cover: \/content\/posts\/2026-06-21-published-note\/assets\/cover\.[a-f0-9]{12}\.svg/,
    );
    expect(result.markdown).toContain('[[second-note|another note]]');
    expect(result.markdown).toContain('> [!TIP]');
    expect(result.markdown).toContain('\\text{MSE}(q) = \\mathbb{E}_X\\big[d(q(x), x)^2\\big]');
    expect(result.markdown).toContain("$k'$");
    expect(result.markdown).not.toContain('$k’$');
    expect(result.markdown).not.toContain('\\mathbb{E}\\_X');
    expect(result.markdown).not.toContain('\\big\\[');
    expect(result.markdown).toContain('[[youtube-source|the original source]]');
    expect(result.markdown).toContain(`[second](/blog/${secondSlug})`);
    expect(result.markdown).toContain(`[internal old URL](/blog/${secondSlug})`);
    expect(result.markdown).toContain(`[absolute old URL](/blog/${secondSlug}#details-section)`);
    expect(result.markdown).toContain('[source](https://www.youtube.com/watch?v=fixture)');
    expect(result.markdown).toContain('[YouTube Source](https://www.youtube.com/watch?v=fixture)');
    expect(result.markdown).not.toContain(
      '[YouTube Source](https://www.youtube.com/watch?v=fixture) — [원문](https://www.youtube.com/watch?v=fixture)',
    );
    expect(result.markdown).not.toContain('[원문](https://www.youtube.com/watch?v=fixture)');
    expect(result.markdown).toContain('**[[youtube-source|PostgreSQL 자체 Git 저장소]]**');
    expect(result.markdown).not.toContain(
      '\\*\\*[[youtube-source|PostgreSQL 자체 Git 저장소]]\\*\\*',
    );
    expect(result.markdown).toContain(
      '**[PostgreSQL 자체 Git 저장소](https://git.postgresql.org/git/postgresql.git)**',
    );
    expect(result.markdown).not.toContain(
      '\\*\\*[PostgreSQL 자체 Git 저장소](https://git.postgresql.org/git/postgresql.git)\\*\\*',
    );
    expect(result.markdown).toContain('*[[youtube-source|PostgreSQL 자체 Git 저장소]]*를');
    expect(result.markdown).not.toContain('\\*[[youtube-source|PostgreSQL 자체 Git 저장소]]\\*를');
    expect(result.markdown).toContain(
      '*[PostgreSQL 자체 Git 저장소](https://git.postgresql.org/git/postgresql.git)*를',
    );
    expect(result.markdown).not.toContain(
      '\\*[PostgreSQL 자체 Git 저장소](https://git.postgresql.org/git/postgresql.git)\\*를',
    );
    expect(result.markdown).toMatch(
      new RegExp(String.raw`[*-] \[Second Note\]\(/blog/${secondSlug}\)`),
    );
    expect(result.markdown).not.toMatch(/[*-] \[\[second-note\]\]/);
    expect(result.markdown).not.toMatch(/[*-] \[\[youtube-source\]\]/);
    expect(result.markdown).not.toContain('../sources/private-source.md');
    expect(result.markdown).not.toContain('./second-note.md');
    expect(result.markdown).toMatch(
      /!\[Fixture image\]\(\/content\/posts\/2026-06-21-published-note\/assets\/diagram\.[a-f0-9]{12}\.svg\)/,
    );
    expect(result.markdown).toMatch(
      /!\[Sized fixture\]\(\/content\/posts\/2026-06-21-published-note\/assets\/diagram\.[a-f0-9]{12}\.svg\)\{width=320 height=180\}/,
    );
    expect(
      fs
        .readdirSync(path.join(tempRoot, 'public/content/posts', publishedSlug, 'assets'))
        .some(fileName => /^diagram\.[a-f0-9]{12}\.svg$/.test(fileName)),
    ).toBe(true);
    expect(
      fs
        .readdirSync(path.join(tempRoot, 'public/content/posts', publishedSlug, 'assets'))
        .some(fileName => /^cover\.[a-f0-9]{12}\.svg$/.test(fileName)),
    ).toBe(true);

    const exportedAssetsDir = path.join(tempRoot, 'public/content/posts', publishedSlug, 'assets');
    const exportedCover = fs
      .readdirSync(exportedAssetsDir)
      .find(fileName => /^cover\.[a-f0-9]{12}\.svg$/.test(fileName));
    const exportedDiagram = fs
      .readdirSync(exportedAssetsDir)
      .find(fileName => /^diagram\.[a-f0-9]{12}\.svg$/.test(fileName));

    expect(exportedCover).toBeDefined();
    expect(fs.readFileSync(path.join(exportedAssetsDir, exportedCover!), 'utf8')).toContain(
      'preserveAspectRatio="none"',
    );
    expect(exportedDiagram).toBeDefined();
    expect(fs.readFileSync(path.join(exportedAssetsDir, exportedDiagram!), 'utf8')).not.toContain(
      'preserveAspectRatio="none"',
    );
  });

  it('exports each published note to content/posts/<slug>/index.md', () => {
    const index = buildContentIndex(fixtureKbRoot);
    const paths = createExportPaths();

    for (const note of index.publishedNotes) {
      exportPublishedPost(note, index, paths);
    }

    expect(fs.existsSync(path.join(paths.contentRoot, `${publishedSlug}/index.md`))).toBe(true);
    expect(fs.existsSync(path.join(paths.contentRoot, `${secondSlug}/index.md`))).toBe(true);
    expect(fs.existsSync(path.join(paths.contentRoot, 'draft-note/index.md'))).toBe(false);
    expect(fs.existsSync(path.join(paths.contentRoot, 'youtube-source/index.md'))).toBe(false);
  });

  it('exports en/ja variants next to the kr original with language-aware links', () => {
    const index = buildContentIndex(fixtureKbRoot);
    const paths = createExportPaths();

    for (const note of index.publishedVariants) {
      exportPublishedPost(note, index, paths);
    }

    expect(fs.existsSync(path.join(paths.contentRoot, `${publishedSlug}/index.md`))).toBe(true);
    expect(fs.existsSync(path.join(paths.contentRoot, `${publishedSlug}/index.en.md`))).toBe(true);
    expect(fs.existsSync(path.join(paths.contentRoot, `${publishedSlug}/index.ja.md`))).toBe(true);
    expect(fs.existsSync(path.join(paths.contentRoot, `${secondSlug}/index.en.md`))).toBe(true);
    expect(fs.existsSync(path.join(paths.contentRoot, `${secondSlug}/index.ja.md`))).toBe(false);

    const enMarkdown = fs.readFileSync(
      path.join(paths.contentRoot, `${publishedSlug}/index.en.md`),
      'utf8',
    );
    expect(enMarkdown).toContain('lang: en');
    expect(enMarkdown).toContain(`slug: ${publishedSlug}`);
    // 직접 블로그 URL은 같은 언어 라우트로 승격됩니다.
    expect(enMarkdown).toContain(`[internal old URL](/en/blog/${secondSlug})`);
    // Sources 섹션 위키링크도 같은 언어 번역본을 우선합니다.
    expect(enMarkdown).toMatch(
      new RegExp(String.raw`[*-] \[Second Note \(EN\)\]\(/en/blog/${secondSlug}\)`),
    );
    // 공유 에셋은 kr과 같은 slug 경로로 export됩니다.
    expect(enMarkdown).toMatch(
      /!\[Fixture image\]\(\/content\/posts\/2026-06-21-published-note\/assets\/diagram\.[a-f0-9]{12}\.svg\)/,
    );
    expect(enMarkdown).toMatch(
      /cover: \/content\/posts\/2026-06-21-published-note\/assets\/cover\.[a-f0-9]{12}\.svg/,
    );

    const jaMarkdown = fs.readFileSync(
      path.join(paths.contentRoot, `${publishedSlug}/index.ja.md`),
      'utf8',
    );
    expect(jaMarkdown).toContain('lang: ja');
    // ja 번역본이 없는 대상은 kr 원문 경로로 폴백합니다.
    expect(jaMarkdown).toContain(`[内部リンク](/blog/${secondSlug})`);
    // 본문 위키링크는 렌더링 시점에 언어별로 해석되도록 그대로 유지됩니다.
    expect(jaMarkdown).toContain('[[second-note|別のノート]]');
  });
});
