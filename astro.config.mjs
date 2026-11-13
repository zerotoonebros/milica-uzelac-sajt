// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Adresa sajta. Na Netlify-ju se promenljiva URL popunjava sama (glavni domen sajta),
// pa canonical linkovi i sitemap uvek pokazuju na pravu adresu.
const site = process.env.SITE_URL || process.env.URL || 'http://localhost:4321';

// Stranice koje ne treba da se nađu u sitemap-u (interne / zahvalnice).
const izvanSitemapa = ['/hvala/', '/stil/', '/404'];

export default defineConfig({
  site,
  trailingSlash: 'always',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  vite: {
    plugins: [
      {
        // Lokalni pregled: /admin/ otvara panel za uređivanje (na Netlify-ju to radi samo od sebe).
        name: 'admin-lokalno',
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            if (req.url === '/admin' || req.url === '/admin/') req.url = '/admin/index.html';
            next();
          });
        },
      },
    ],
  },
  integrations: [
    sitemap({
      filter: (page) => !izvanSitemapa.some((p) => page.includes(p)),
    }),
  ],
  fonts: [
    {
      // Naslovi
      name: 'EB Garamond',
      cssVariable: '--font-garamond',
      provider: fontProviders.fontsource(),
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'serif'],
      display: 'swap',
    },
    {
      // Tekst, dugmad i navigacija
      name: 'Jost',
      cssVariable: '--font-jost',
      provider: fontProviders.fontsource(),
      weights: ['400 600'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Century Gothic', 'sans-serif'],
      display: 'swap',
    },
    {
      // Rukopisni akcenat
      name: 'Ms Madi',
      cssVariable: '--font-msmadi',
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['cursive'],
      display: 'swap',
    },
  ],
});
