import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  // Turbopack 설정 (Next.js 15)
  experimental: {
    // 필요시 추가 설정
  },
  // 기존 CDN 이미지 경로 지원
  env: {
    CDN_IMG_PREFIX: process.env.CDN_IMG_PREFIX || '',
  },
};

export default nextConfig;
