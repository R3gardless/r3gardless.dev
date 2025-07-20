#!/usr/bin/env tsx

/**
 * 빌드 타임에 Notion 데이터를 가져와서 로컬에 저장하는 스크립트
 */
import fs from 'fs/promises';
import path from 'path';
import { getPostList } from '../src/libs/notion';
import { downloadNotionImage } from '../src/utils/imageDownloader';
import type { PostMeta } from '../src/types/blog';

interface BuildDataOptions {
  verbose?: boolean;
}

/**
 * 포스트 메타데이터를 가져와서 로컬에 저장합니다
 */
async function buildPostMeta(options: BuildDataOptions = {}): Promise<void> {
  const { verbose = false } = options;

  try {
    console.log('🚀 포스트 메타데이터를 가져오는 중...');

    // Notion에서 포스트 목록 가져오기
    const posts = await getPostList();
    
    if (verbose) {
      console.log(`📝 총 ${posts.length}개의 포스트를 찾았습니다.`);
    }

    // 커버 이미지 다운로드 및 경로 수정
    const postsWithLocalImages: PostMeta[] = [];
    
    for (const post of posts) {
      if (verbose) {
        console.log(`📷 ${post.title}: 커버 이미지 처리 중...`);
      }

      let localCoverPath = post.cover;
      
      // 커버 이미지가 있으면 다운로드
      if (post.cover && post.cover.startsWith('https://')) {
        localCoverPath = await downloadNotionImage(post.cover, 'cover', post.id);
        if (verbose) {
          console.log(`  ✅ 커버 이미지 저장: ${localCoverPath}`);
        }
      }

      postsWithLocalImages.push({
        ...post,
        cover: localCoverPath,
      });
    }

    // public/data 디렉토리 생성
    const dataDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(dataDir, { recursive: true });

    // postMeta.json 파일 생성
    const jsonPath = path.join(dataDir, 'postMeta.json');
    await fs.writeFile(
      jsonPath,
      JSON.stringify(postsWithLocalImages, null, 2),
      'utf8',
    );

    console.log(`✅ 포스트 메타데이터가 저장되었습니다: ${jsonPath}`);
    console.log(`📊 총 ${postsWithLocalImages.length}개의 포스트 처리 완료`);
    
  } catch (error) {
    console.error('❌ 빌드 데이터 생성 중 오류 발생:', error);
    process.exit(1);
  }
}

/**
 * 메인 실행 함수
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose') || args.includes('-v');

  console.log('🔨 Next.js 블로그 데이터 빌드 시작...\n');

  await buildPostMeta({ verbose });

  console.log('\n🎉 빌드 데이터 생성 완료!');
}

// 스크립트가 직접 실행될 때만 main 함수 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ 스크립트 실행 중 오류:', error);
    process.exit(1);
  });
}

export { buildPostMeta };
