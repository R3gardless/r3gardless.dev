import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // GitHub Pages용 정적 빌드
  trailingSlash: true, // GitHub Pages 호환성
  images: {
    unoptimized: true, // 정적 빌드에서는 이미지 최적화 비활성화
  },
  // GitHub Pages 배포 시 base path 설정
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  // 환경변수를 빌드 타임에 포함
  env: {
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  },
  // 정적 파일 경로 설정
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
};

export default nextConfig;
