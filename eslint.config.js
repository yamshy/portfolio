import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist',
      '**/.astro/**', // Astro's generated artifacts
      'node_modules',
      'public',
      'coverage',
      '**/*.mjs',
      'eslint.config.js',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
      },
    },
  },
  js.configs.recommended,
  ...astro.configs['flat/recommended'],
  jsxA11y.flatConfigs.recommended,
  prettier,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
];
