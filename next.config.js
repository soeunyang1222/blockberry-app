/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['typeorm', 'pg', 'reflect-metadata']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    SUI_NETWORK: process.env.SUI_NETWORK || 'devnet',
    CETUS_API_URL: process.env.CETUS_API_URL,
  },
  typescript: {
    // TypeORM 데코레이터 관련 타입 에러 무시
    ignoreBuildErrors: false,
  },
  eslint: {
    // ESLint 비활성화
    ignoreDuringBuilds: true,
  },
  // Vercel 배포를 위한 설정
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
