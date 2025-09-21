import { svelte } from '@sveltejs/vite-plugin-svelte';
import type { Options as SvelteOptions } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

import svelteConfig from './svelte.config.js';

const resolvedSvelteConfig = svelteConfig as SvelteOptions;

export default defineConfig({
  plugins: [
    svelte({
      ...resolvedSvelteConfig,
      compilerOptions: {
        ...(resolvedSvelteConfig.compilerOptions ?? {}),
        dev: true,
      },
    }),
  ],
  resolve: {
    conditions: ['svelte', 'browser'],
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/e2e/**',
      '**/*.e2e.{test,spec}.{js,ts}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/components/**/*.svelte'],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
      exclude: [
        'dist/**',
        'node_modules/**',
        'tests/**',
        '**/*.config.*',
        '**/*.test.*',
        '**/*.spec.*',
      ],
    },
    setupFiles: ['./tests/setup.ts'],
    server: {
      deps: {
        inline: ['@testing-library/svelte'],
      },
    },
  },
});
