// RSS feed bloga (/rss.xml) — za čitače vesti i alate za newsletter.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { sajt } from '../lib/sajt';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const osnova = site ?? new URL('http://localhost:4321');
  const tekstovi = (await getCollection('blog', ({ data }) => !data.nacrt)).sort(
    (a, b) => b.data.datum.valueOf() - a.data.datum.valueOf(),
  );

  const stavke = tekstovi
    .map((t) => {
      const link = new URL(`/blog/${t.id}/`, osnova).href;
      return `    <item>
      <title>${esc(t.data.naslov)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${esc(t.data.opis)}</description>
      <category>${esc(t.data.kategorija)}</category>
      <pubDate>${t.data.datum.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(sajt.naziv)} — Blog</title>
    <link>${new URL('/blog/', osnova).href}</link>
    <description>${esc(sajt.seo.podrazumevani_opis)}</description>
    <language>sr</language>
    <atom:link href="${new URL('/rss.xml', osnova).href}" rel="self" type="application/rss+xml" />
${stavke}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
