import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildContentIndex, exportPublishedPost, transformMarkdownForExport } from '@/libs/content';

const fixtureKbRoot = path.join(process.cwd(), 'tests/fixtures/kb/KNOWELDGE_BASE');

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
    expect(result.markdown).toContain('cover: /content/posts/published-note/assets/cover.svg');
    expect(result.markdown).toContain('[[second-note|another note]]');
    expect(result.markdown).toContain('> [!TIP]');
    expect(result.markdown).toContain('\\text{MSE}(q) = \\mathbb{E}_X\\big[d(q(x), x)^2\\big]');
    expect(result.markdown).not.toContain('\\mathbb{E}\\_X');
    expect(result.markdown).not.toContain('\\big\\[');
    expect(result.markdown).toContain('[second](/blog/second-note)');
    expect(result.markdown).toContain('[source](https://www.youtube.com/watch?v=fixture)');
    expect(result.markdown).not.toContain('../sources/private-source.md');
    expect(result.markdown).not.toContain('./second-note.md');
    expect(result.markdown).toContain(
      '![Fixture image](/content/posts/published-note/assets/diagram.svg)',
    );
    expect(
      fs.existsSync(path.join(tempRoot, 'public/content/posts/published-note/assets/diagram.svg')),
    ).toBe(true);
    expect(
      fs.existsSync(path.join(tempRoot, 'public/content/posts/published-note/assets/cover.svg')),
    ).toBe(true);
  });

  it('exports each published note to content/posts/<slug>/index.md', () => {
    const index = buildContentIndex(fixtureKbRoot);
    const paths = createExportPaths();

    for (const note of index.publishedNotes) {
      exportPublishedPost(note, index, paths);
    }

    expect(fs.existsSync(path.join(paths.contentRoot, 'published-note/index.md'))).toBe(true);
    expect(fs.existsSync(path.join(paths.contentRoot, 'second-note/index.md'))).toBe(true);
    expect(fs.existsSync(path.join(paths.contentRoot, 'draft-note/index.md'))).toBe(false);
    expect(fs.existsSync(path.join(paths.contentRoot, 'youtube-source/index.md'))).toBe(false);
  });
});
