import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/**', // Exclude Playwright E2E tests
      '**/*.e2e.{test,spec}.{js,ts}'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85
      },
      exclude: [
        'dist/**',
        'node_modules/**',
        'tests/**',
        '**/*.config.*',
        '**/*.test.*',
        '**/*.spec.*'
      ]
    },
    setupFiles: ['./src/test/setup.ts']
  }
});
