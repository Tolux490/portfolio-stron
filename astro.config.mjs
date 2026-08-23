import { defineConfig } from 'astro/config';

export default defineConfig({
  // Własna domena (GitHub Pages/Cloudflare + CNAME) — potrzebne do sitemap i tagów OG
  site: 'https://vervostudio.com',
  // base zostaje domyślne ('/') — domena apex, strona w katalogu głównym.
  // Sitemap: ręczny plik public/sitemap.xml (tylko strona główna; dema są noindex).
});
