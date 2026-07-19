import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  buildContentIndex,
  exportPublishedPost,
  flushPendingImageExports,
  transformMarkdownForExport,
} from '@/libs/content';

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

  it('resizes raster body images to webp and keeps cover format with capped width', async () => {
    const { default: sharp } = await import('sharp');

    // 큰 래스터 이미지(2000px)를 본문과 커버로 쓰는 임시 KB를 구성한다
    const kbRoot = path.join(tempRoot, 'KB');
    const noteDir = path.join(kbRoot, 'dev', 'blog', 'wiki');
    fs.mkdirSync(path.join(noteDir, 'assets'), { recursive: true });
    await sharp({
      create: { width: 2000, height: 1000, channels: 3, background: { r: 180, g: 120, b: 60 } },
    })
      .png()
      .toFile(path.join(noteDir, 'assets', 'photo.png'));
    fs.writeFileSync(
      path.join(noteDir, 'raster-note.md'),
      [
        '---',
        'layer: wiki',
        'title: Raster Note',
        'publish: true',
        'slug: raster-note',
        'added: 2026-07-10',
        'cover: ./assets/photo.png',
        '---',
        '',
        '# Raster Note',
        '',
        '![Photo](./assets/photo.png)',
      ].join('\n'),
      'utf8',
    );

    const index = buildContentIndex(kbRoot);
    const paths = createExportPaths();
    for (const note of index.publishedNotes) {
      exportPublishedPost(note, index, paths);
    }
    const converted = await flushPendingImageExports();
    expect(converted).toBeGreaterThanOrEqual(2);

    const slug = '2026-07-10-raster-note';
    const markdown = fs.readFileSync(path.join(paths.contentRoot, slug, 'index.md'), 'utf8');
    // 본문 이미지는 webp로, 커버는 원본 포맷(png)을 유지한다
    expect(markdown).toMatch(
      new RegExp(`!\\[Photo\\]\\(/content/posts/${slug}/assets/photo\\.[a-f0-9]{12}\\.webp\\)`),
    );
    expect(markdown).toMatch(
      new RegExp(`cover: /content/posts/${slug}/assets/photo\\.[a-f0-9]{12}\\.png`),
    );

    const assetsDir = path.join(tempRoot, 'public/content/posts', slug, 'assets');
    const bodyFile = fs.readdirSync(assetsDir).find(name => name.endsWith('.webp'));
    const coverFile = fs.readdirSync(assetsDir).find(name => name.endsWith('.png'));
    expect(bodyFile).toBeDefined();
    expect(coverFile).toBeDefined();

    // 폭 상한: 본문 1440(720의 레티나 2배), 커버 1536(768의 2배). 비율 유지(crop 없음).
    const bodyMeta = await sharp(path.join(assetsDir, bodyFile!)).metadata();
    expect(bodyMeta.format).toBe('webp');
    expect(bodyMeta.width).toBe(1440);
    expect(bodyMeta.height).toBe(720);
    const coverMeta = await sharp(path.join(assetsDir, coverFile!)).metadata();
    expect(coverMeta.format).toBe('png');
    expect(coverMeta.width).toBe(1536);
    expect(coverMeta.height).toBe(768);
  });

  it('converts raw HTML figure rows into adjacent markdown images with exported assets', async () => {
    const { default: sharp } = await import('sharp');

    const kbRoot = path.join(tempRoot, 'KB');
    const noteDir = path.join(kbRoot, 'dev', 'blog', 'wiki');
    fs.mkdirSync(path.join(noteDir, 'assets'), { recursive: true });
    for (const name of ['left.png', 'right.png']) {
      await sharp({
        create: { width: 800, height: 600, channels: 3, background: { r: 90, g: 90, b: 90 } },
      })
        .png()
        .toFile(path.join(noteDir, 'assets', name));
    }
    // KB에서 실제로 쓰는 나란히 배치 raw HTML 패턴 그대로
    fs.writeFileSync(
      path.join(noteDir, 'figure-note.md'),
      [
        '---',
        'layer: wiki',
        'title: Figure Note',
        'publish: true',
        'slug: figure-note',
        'added: 2026-07-12',
        '---',
        '',
        '# Figure Note',
        '',
        '<div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-start;">',
        '  <figure style="flex: 1 1 320px; margin: 0;">',
        '    <img src="./assets/left.png" alt="왼쪽 alt" style="width: 100%;" />',
        '    <figcaption>왼쪽 recall@100 vs code length</figcaption>',
        '  </figure>',
        '  <figure style="flex: 1 1 320px; margin: 0;">',
        '    <img src="./assets/right.png" alt="오른쪽 alt" style="width: 100%;" />',
        '    <figcaption>오른쪽 recall@100 vs code length</figcaption>',
        '  </figure>',
        '</div>',
        '',
        '본문 텍스트.',
      ].join('\n'),
      'utf8',
    );

    const index = buildContentIndex(kbRoot);
    const paths = createExportPaths();
    for (const note of index.publishedNotes) {
      exportPublishedPost(note, index, paths);
    }
    await flushPendingImageExports();

    const slug = '2026-07-12-figure-note';
    const markdown = fs.readFileSync(path.join(paths.contentRoot, slug, 'index.md'), 'utf8');

    // raw HTML은 사라지고, figcaption을 캡션으로 쓰는 연속 markdown 이미지(같은 문단)로 변환된다
    expect(markdown).not.toContain('<img');
    expect(markdown).not.toContain('<figure');
    expect(markdown).toMatch(
      new RegExp(
        `!\\[왼쪽 recall@100 vs code length\\]\\(/content/posts/${slug}/assets/left\\.[a-f0-9]{12}\\.webp\\)\\n` +
          `!\\[오른쪽 recall@100 vs code length\\]\\(/content/posts/${slug}/assets/right\\.[a-f0-9]{12}\\.webp\\)`,
      ),
    );

    // 에셋도 webp로 export된다
    const assetsDir = path.join(tempRoot, 'public/content/posts', slug, 'assets');
    expect(fs.readdirSync(assetsDir).filter(name => name.endsWith('.webp'))).toHaveLength(2);
  });

  it('keeps small raster images at their original size', async () => {
    const { default: sharp } = await import('sharp');

    const kbRoot = path.join(tempRoot, 'KB');
    const noteDir = path.join(kbRoot, 'dev', 'blog', 'wiki');
    fs.mkdirSync(path.join(noteDir, 'assets'), { recursive: true });
    await sharp({
      create: { width: 400, height: 300, channels: 3, background: { r: 20, g: 40, b: 80 } },
    })
      .png()
      .toFile(path.join(noteDir, 'assets', 'small.png'));
    fs.writeFileSync(
      path.join(noteDir, 'small-note.md'),
      [
        '---',
        'layer: wiki',
        'title: Small Note',
        'publish: true',
        'slug: small-note',
        'added: 2026-07-11',
        '---',
        '',
        '# Small Note',
        '',
        '![Small](./assets/small.png)',
      ].join('\n'),
      'utf8',
    );

    const index = buildContentIndex(kbRoot);
    const paths = createExportPaths();
    for (const note of index.publishedNotes) {
      exportPublishedPost(note, index, paths);
    }
    await flushPendingImageExports();

    const assetsDir = path.join(
      tempRoot,
      'public/content/posts',
      '2026-07-11-small-note',
      'assets',
    );
    const bodyFile = fs.readdirSync(assetsDir).find(name => name.endsWith('.webp'));
    expect(bodyFile).toBeDefined();

    // 원본(400px)이 상한보다 작으면 업스케일하지 않는다
    const meta = await sharp(path.join(assetsDir, bodyFile!)).metadata();
    expect(meta.width).toBe(400);
    expect(meta.height).toBe(300);
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
