import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'], // Allow Google user profile images
  },
  webpack: (config, { isServer }) => {
    // Suppress warnings for optional TypeORM dependencies
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/typeorm/ },
    ];

    // Add fallback for modules that shouldn't be bundled
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'react-native-sqlite-storage': false,
      '@sap/hana-client': false,
      'mysql': false,
      'mysql2': false,
      'oracledb': false,
      'pg-native': false,
      'sqlite3': false,
      'better-sqlite3': false,
      'ioredis': false,
      'redis': false,
      'typeorm-aurora-data-api-driver': false,
      'hdb-pool': false,
      'sql.js': false,
    };

    // For server-side, mark these as external
    if (isServer) {
      const externals = Array.isArray(config.externals)
        ? config.externals
        : typeof config.externals === 'function'
        ? [config.externals]
        : config.externals
        ? [config.externals]
        : [];

      config.externals = [
        ...externals,
        'react-native-sqlite-storage',
        '@sap/hana-client',
        'mysql',
        'mysql2',
        'oracledb',
        'pg-native',
        'sqlite3',
        'better-sqlite3',
        'ioredis',
        'redis',
        'typeorm-aurora-data-api-driver',
        'hdb-pool',
        'sql.js',
      ];
    }

    return config;
  },
};

export default nextConfig;
