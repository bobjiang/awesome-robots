import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Default test environment (node for E2E tests)
    // Unit tests use @vitest-environment jsdom directive in-file
    environment: 'node',

    // Global test timeout (60s for E2E tests)
    testTimeout: 60000,

    // Hooks timeout
    hookTimeout: 30000,

    // Setup files
    setupFiles: ['./tests/setup.ts'],

    // Include patterns
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],

    // Exclude patterns
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
    ],

    // Reporter configuration
    reporters: ['verbose'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.test.ts',
        '**/*.config.ts',
      ],
    },

    // Retry failed tests once to handle flakiness
    retry: 1,

    // Run tests sequentially to avoid MCP conflicts
    pool: 'forks',
    // Note: poolOptions commented out due to TypeScript compatibility with Next.js build
    // This configuration is still valid for vitest runtime but may cause build errors
    // poolOptions: {
    //   forks: {
    //     singleFork: true,
    //   },
    // },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
});
