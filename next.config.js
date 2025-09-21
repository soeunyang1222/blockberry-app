/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Vercel 배포를 위한 설정
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
