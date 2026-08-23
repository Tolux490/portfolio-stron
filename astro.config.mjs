import { defineConfig } from 'astro/config';

export default defineConfig({
  // Własna domena (GitHub Pages + CNAME) — potrzebne do sitemap i tagów OG
  site: 'https://vervostudio.com',
  // base zostaje domyślne ('/') — domena apex, strona w katalogu głównym.
});
