// Zajedničke funkcije i podešavanja sajta.
import type { ImageMetadata } from 'astro';
import { marked } from 'marked';
import sajtPodaci from '../content/podesavanja/sajt.json';
import navigacijaPodaci from '../content/podesavanja/navigacija.json';
import obavestenjePodaci from '../content/podesavanja/obavestenje.json';

export const sajt = sajtPodaci;
export const navigacija = navigacijaPodaci.stavke;
/** Obaveštenje (baner) ispod zaglavlja — uključuje se i isključuje u CMS-u. */
export const obavestenje = obavestenjePodaci;

/* ---------- Fotografije ----------
   Sve fotografije koje se dodaju kroz CMS završavaju u src/assets/uploads.
   Astro ih pri build-u sam smanjuje i pretvara u moderne formate (AVIF/WebP).
   Funkcija ispod pronalazi fotografiju po putanji koju CMS upiše u sadržaj. */
const sveSlike = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/uploads/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true },
);

const slikePoImenu = new Map<string, ImageMetadata>();
for (const [putanja, modul] of Object.entries(sveSlike)) {
  slikePoImenu.set(putanja.toLowerCase(), modul.default);
  slikePoImenu.set(putanja.replace('/src/assets/uploads/', '').toLowerCase(), modul.default);
}

export function nadjiSliku(putanja?: string | null): ImageMetadata | undefined {
  if (!putanja) return undefined;
  let p = decodeURIComponent(putanja.trim()).toLowerCase();
  if (!p.startsWith('/')) p = '/' + p;
  return (
    slikePoImenu.get(p) ??
    slikePoImenu.get(p.replace(/^\/(src\/assets\/)?uploads\//, '')) ??
    slikePoImenu.get(p.replace(/^\//, ''))
  );
}

/* ---------- Tekst ---------- */
marked.setOptions({ gfm: true, breaks: false });

/** Markdown u HTML (pasusi, liste, linkovi). */
export function md(tekst?: string | null): string {
  if (!tekst) return '';
  return marked.parse(tekst, { async: false }) as string;
}

/** Markdown u jednom redu — *kurziv* u naslovima postaje naglašena reč. */
export function mdRed(tekst?: string | null): string {
  if (!tekst) return '';
  return marked.parseInline(tekst, { async: false }) as string;
}

/** Uklanja markdown oznake (za meta opise, alt tekstove…). */
export function cistTekst(tekst?: string | null): string {
  if (!tekst) return '';
  return tekst
    .replace(/[*_`#>]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ---------- Datumi ---------- */
const meseci = [
  'januar', 'februar', 'mart', 'april', 'maj', 'jun',
  'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar',
];
const dani = ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'];

/** 14. mart 2027. */
export function datum(d: Date): string {
  return `${d.getUTCDate()}. ${meseci[d.getUTCMonth()]} ${d.getUTCFullYear()}.`;
}

/** subota, 14. mart 2027. u 10:00 — vreme se čita onako kako je upisano u CMS-u. */
export function datumIVreme(d: Date): string {
  const sati = String(d.getUTCHours()).padStart(2, '0');
  const minuti = String(d.getUTCMinutes()).padStart(2, '0');
  const vreme = sati === '00' && minuti === '00' ? '' : ` u ${sati}:${minuti}`;
  return `${dani[d.getUTCDay()]}, ${datum(d)}${vreme}`;
}

export function danMesec(d: Date): { dan: string; mesec: string } {
  return { dan: String(d.getUTCDate()), mesec: meseci[d.getUTCMonth()].slice(0, 3) };
}

/** Procena vremena čitanja u minutima. */
export function vremeCitanja(tekst: string): number {
  const reci = tekst.trim().split(/\s+/).length;
  return Math.max(1, Math.round(reci / 200));
}

/* ---------- Linkovi ---------- */
export function jeSpoljni(link: string): boolean {
  return /^https?:\/\//.test(link);
}

export function apsolutni(putanja: string, site: URL | undefined): string {
  return new URL(putanja, site ?? 'http://localhost:4321').href;
}

export const statusRadionice: Record<string, { tekst: string; otvoreno: boolean }> = {
  'prijave-otvorene': { tekst: 'Prijave su otvorene', otvoreno: true },
  'poslednja-mesta': { tekst: 'Poslednja mesta', otvoreno: true },
  uskoro: { tekst: 'Uskoro', otvoreno: false },
  popunjeno: { tekst: 'Popunjeno', otvoreno: false },
  zavrseno: { tekst: 'Završeno', otvoreno: false },
};

export const nazivFormata: Record<string, string> = {
  online: 'Online',
  uzivo: 'Uživo',
};

export const nazivVrste: Record<string, { jednina: string; mnozina: string; link: string }> = {
  'e-book': { jednina: 'E-book program', mnozina: 'E-book programi', link: '/programi/e-book/' },
  masterclass: {
    jednina: 'Online Masterclass',
    mnozina: 'Online Masterclass programi',
    link: '/programi/masterclass/',
  },
};

/* ---------- Tekst članka (blog, radionice, programi, pravne stranice) ----------
   Markdown iz CMS-a pretvara se u HTML. Fotografije ubačene u tekst prolaze istu
   optimizaciju kao i ostale: AVIF/WebP u više veličina, sa dimenzijama (bez „skakanja“
   stranice pri učitavanju) i odloženim učitavanjem. */
const escAtribut = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function mdClanak(tekst?: string | null): Promise<string> {
  if (!tekst) return '';
  const { Marked } = await import('marked');
  const { getImage } = await import('astro:assets');
  const sizes = '(min-width: 48em) 44rem, 92vw';

  const m = new Marked({
    gfm: true,
    async: true,
    async walkTokens(token) {
      if (token.type !== 'image') return;
      const fajl = nadjiSliku(token.href);
      if (!fajl) return;
      const sirine = [480, 800, 1200, 1600].filter((s) => s <= fajl.width);
      if (sirine.length === 0) sirine.push(fajl.width);
      const [avif, webp, rezerva] = await Promise.all([
        getImage({ src: fajl, format: 'avif', widths: sirine }),
        getImage({ src: fajl, format: 'webp', widths: sirine }),
        getImage({ src: fajl, format: 'jpg', width: Math.min(1200, fajl.width) }),
      ]);
      const alt = escAtribut(token.text ?? '');
      const opis = token.title ? `<figcaption>${escAtribut(token.title)}</figcaption>` : '';
      (token as { html?: string }).html =
        `<figure class="tekst__slika"><picture>` +
        `<source type="image/avif" srcset="${avif.srcSet.attribute}" sizes="${sizes}">` +
        `<source type="image/webp" srcset="${webp.srcSet.attribute}" sizes="${sizes}">` +
        `<img src="${rezerva.src}" alt="${alt}" width="${rezerva.attributes.width}" height="${rezerva.attributes.height}" loading="lazy" decoding="async">` +
        `</picture>${opis}</figure>`;
    },
    renderer: {
      image(token) {
        const gotovo = (token as { html?: string }).html;
        if (gotovo) return gotovo;
        return `<img src="${escAtribut(token.href)}" alt="${escAtribut(token.text ?? '')}" loading="lazy" decoding="async">`;
      },
      // Fotografija u svom pasusu ne treba da bude umotana u <p>
      paragraph(token) {
        const samoSlika = token.tokens?.length === 1 && token.tokens[0].type === 'image';
        const sadrzaj = this.parser.parseInline(token.tokens ?? []);
        return samoSlika ? sadrzaj : `<p>${sadrzaj}</p>\n`;
      },
      // Spoljni linkovi se otvaraju u novoj kartici
      link(token) {
        const tekstLinka = this.parser.parseInline(token.tokens ?? []);
        const spoljni = /^https?:\/\//.test(token.href);
        const naslov = token.title ? ` title="${escAtribut(token.title)}"` : '';
        return `<a href="${escAtribut(token.href)}"${naslov}${spoljni ? ' target="_blank" rel="noopener"' : ''}>${tekstLinka}</a>`;
      },
    },
  });
  return m.parse(tekst) as Promise<string>;
}
