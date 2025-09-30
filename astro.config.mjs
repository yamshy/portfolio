import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  vite: {
    server: {
      host: true,
      allowedHosts: ['.gitpod.dev']
    },
    preview: {
      host: true,
      allowedHosts: ['.gitpod.dev']
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: {
          browsers: 'defaults'
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