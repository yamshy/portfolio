import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  vite: {
    server: {
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          ws: true
        }
      }
    },
    preview: {
      host: true,
      allowedHosts: true
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: {
          browsers: '>= 0.5%, last 2 versions, Firefox ESR, not dead'
        },
        drafts: {
          nesting: true,
          customMedia: true
        },
        cssModules: false,
        minify: true
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "open-props/style";`
        }
      }
    }
  }
});