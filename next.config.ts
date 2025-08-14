import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['jsdom'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure proper handling of server-side dependencies
      config.externals = config.externals || [];
      config.externals.push({
        'jsdom': 'commonjs jsdom',
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
