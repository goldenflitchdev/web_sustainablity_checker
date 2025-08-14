import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['jsdom'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'jsdom': 'commonjs jsdom',
        'canvas': 'commonjs canvas',
      });
    }
    
    // Ensure proper module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
};

export default nextConfig;
