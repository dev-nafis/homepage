import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nafisalmuhsin.com',
  base: '/newsite',
  outDir: './dist/newsite',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    build: {
      cssMinify: 'lightningcss'
    }
  }
});
