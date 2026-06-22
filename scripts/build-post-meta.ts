#!/usr/bin/env tsx
/**
 * 빌드 시 content/posts의 frontmatter를 읽어 포스트 메타데이터 JSON을 저장하는 스크립트
 */
import fs from 'node:fs';
import path from 'node:path';

import { readPostMetaFromContent } from '../src/libs/content/index.js';
import { PROJECT_ROOT, resolveContentRoot } from './content-paths.js';

const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'data');

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    // 출력 디렉토리 생성
    await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });

    const contentRoot = resolveContentRoot();
    const posts = readPostMetaFromContent(contentRoot);

    // JSON 파일로 저장
    const outputPath = path.join(OUTPUT_DIR, 'postMeta.json');
    await fs.promises.writeFile(outputPath, JSON.stringify(posts, null, 2), 'utf8');

    // 생성된 파일 확인
    const fileExists = await fs.promises
      .access(outputPath)
      .then(() => true)
      .catch(() => false);
    if (!fileExists) {
      throw new Error(`Failed to create postMeta.json file at ${outputPath}`);
    }

    console.log(`Generated ${posts.length} post metadata records from ${contentRoot}`);
  } catch (error) {
    console.error('Build metadata process failed:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main();
