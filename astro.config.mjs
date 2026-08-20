import { defineConfig } from 'astro/config';

export default defineConfig({
  // Zmień na własną domenę przed wdrożeniem — potrzebne do sitemap i tagów OG
  site: 'https://TWOJ-LOGIN.github.io',
  // Odkomentuj TYLKO przy GitHub Pages w repo projektowym:
  base: '/portfolio-stron',
});
