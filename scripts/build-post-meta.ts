#!/usr/bin/env tsx
/**
 * 빌드 시 Notion API에서 포스트 메타데이터를 가져와 JSON 파일로 저장하고
 * 커버 이미지를 다운로드하여 로컬에 저장하는 스크립트
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getPostList } from '../src/libs/notion.js';
import type { PostMeta } from '../src/types/blog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프로젝트 루트 경로
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'public', 'data');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images', 'blog', 'covers');

/**
 * 이미지를 다운로드하여 로컬에 저장
 */
async function downloadImage(url: string, fileName: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const filePath = path.join(IMAGES_DIR, fileName);
    
    // 디렉토리가 없으면 생성
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    
    // 파일 저장
    await fs.promises.writeFile(filePath, Buffer.from(buffer));
    
    // 웹에서 접근 가능한 경로 반환
    return `/images/blog/covers/${fileName}`;
  } catch (error) {
    console.error(`❌ Failed to download image ${fileName}:`, error);
    return ''; // 실패 시 빈 문자열 반환
  }
}

/**
 * URL에서 파일 확장자 추출
 */
function getImageExtension(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const ext = path.extname(pathname).toLowerCase();
    
    // 지원하는 이미지 확장자만 허용
    const supportedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    return supportedExts.includes(ext) ? ext : '.jpg'; // 기본값은 .jpg
  } catch {
    return '.jpg';
  }
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    // 환경 변수 검증
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      throw new Error('❌ Required environment variables (NOTION_API_KEY, NOTION_DATABASE_ID) are not set');
    }
    
    // 출력 디렉토리 생성
    await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.promises.mkdir(IMAGES_DIR, { recursive: true });
    
    // Notion API에서 포스트 목록 가져오기
    const posts = await getPostList();
    
    // 이미지 다운로드 및 경로 변환
    const postsWithLocalImages: PostMeta[] = [];
    
    for (const post of posts) {
      const slug = post.slug;

      const encodedSlug = encodeURIComponent(slug);
      
      let localCoverPath = '';
      
      // 커버 이미지가 있으면 다운로드
      if (post.cover && post.cover.startsWith('http')) {
        const extension = getImageExtension(post.cover);
        const fileName = `${slug}${extension}`;
        
        localCoverPath = await downloadImage(post.cover, fileName);
      }
      
      // 로컬 이미지 경로로 업데이트된 포스트 추가 (원본 slug와 인코딩된 slug 모두 저장)
      postsWithLocalImages.push({
        ...post,
        slug: slug, // 원본 slug 유지
        encodedSlug: encodedSlug, // 인코딩된 slug 추가
        cover: localCoverPath || post.cover, // 다운로드 실패 시 원본 URL 유지
      });
    }
    
    // JSON 파일로 저장
    const outputPath = path.join(OUTPUT_DIR, 'postMeta.json');
    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(postsWithLocalImages, null, 2),
      'utf8'
    );
    
    // 생성된 파일 확인
    const fileExists = await fs.promises.access(outputPath).then(() => true).catch(() => false);
    if (!fileExists) {
      throw new Error(`❌ Failed to create postMeta.json file at ${outputPath}`);
    }
    
  } catch (error) {
    console.error('❌ Build process failed:', error);
    process.exit(1);
  }
}

// 스크립트 실행
main();
