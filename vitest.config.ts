import { transform } from '@astrojs/compiler';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import type { Options as SvelteOptions } from '@sveltejs/vite-plugin-svelte';
import ts from 'typescript';
import { defineConfig } from 'vitest/config';

import svelteConfig from './svelte.config.js';

const resolvedSvelteConfig = svelteConfig as SvelteOptions;

const astroPlugin = () => ({
  name: 'astro-component-transform',
  enforce: 'pre' as const,
  async transform(code: string, id: string) {
    const [filename] = id.split('?');
    if (!filename?.endsWith('.astro')) {
      return null;
    }

    const result = await transform(code, { filename });
    const transpiled = ts.transpileModule(result.code, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2020,
      },
    });
    const sanitizedCode = transpiled.outputText
      .replace(/,?\s*createMetadata as \$\$createMetadata/, '')
      .replace(
        /const \$\$metadata = \$\$createMetadata\([^;]+\);/,
        'const $$metadata = {};',
      );
    return {
      code: sanitizedCode,
      map: result.map ? JSON.parse(result.map) : null,
    };
  },
});

export default defineConfig({
  plugins: [
    astroPlugin(),
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
