// robots.txt — pravila za pretraživače.
// Dok je u podešavanjima isključeno „Dozvoli indeksiranje“, ceo sajt je sakriven od Google-a
// (korisno dok se sadržaj još priprema). Kada se uključi, sajt postaje vidljiv i prijavljuje sitemap.
import type { APIRoute } from 'astro';
import { sajt } from '../lib/sajt';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap-index.xml', site ?? 'http://localhost:4321').href;
  const telo = sajt.seo.dozvoli_indeksiranje
    ? `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /hvala/\nDisallow: /stil/\n\nSitemap: ${sitemap}\n`
    : `# Sajt je u pripremi — indeksiranje je isključeno u podešavanjima.\nUser-agent: *\nDisallow: /\n`;
  return new Response(telo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
