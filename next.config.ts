import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // GitHub Pages용 정적 빌드
  trailingSlash: true, // GitHub Pages 호환성
  images: {
    unoptimized: true, // 정적 빌드에서는 이미지 최적화 비활성화
  },
};

export default nextConfig;
