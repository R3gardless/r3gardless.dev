import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // GitHub Pages용 정적 빌드
  trailingSlash: true, // GitHub Pages 호환성
  images: {
    unoptimized: true, // 정적 빌드에서는 이미지 최적화 비활성화
  },
  // 환경변수를 빌드 타임에 포함
  env: {
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  },
};

export default nextConfig;
