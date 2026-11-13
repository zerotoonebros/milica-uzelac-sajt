// Pravi sve fajlove vizuelnog identiteta: logo (SVG + PNG), favicon i sliku za deljenje.
// Pokretanje:  npm run brend
// Tekst u logou se pretvara u krive (vektore), pa SVG fajlovi izgledaju isto na svakom računaru.
import * as fontkit from 'fontkit';
import sharp from 'sharp';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sajt = JSON.parse(readFileSync(path.join(koren, 'src/content/podesavanja/sajt.json'), 'utf8'));
const NAZIV = sajt.naziv;
const PODNASLOV = sajt.podnaslov.toUpperCase();

const BOJE = {
  plava: '#2B4A9B',
  svetloplava: '#C9D6EC',
  kajsija: '#F4C39E',
  kajsijaTamna: '#DD9A68',
  bez: '#F8F0E9',
  kajsijaBlaga: '#FBE5D3',
  teget: '#1B2545',
};

const font = (paket, fajl) => fontkit.openSync(path.join(koren, 'node_modules/@fontsource', paket, 'files', fajl));
const serif = [
  font('eb-garamond', 'eb-garamond-latin-500-normal.woff'),
  font('eb-garamond', 'eb-garamond-latin-ext-500-normal.woff'),
];
const sans = [font('jost', 'jost-latin-500-normal.woff'), font('jost', 'jost-latin-ext-500-normal.woff')];

/** Tekst → SVG putanja. Vraća { d, sirina }. */
function tekstUPutanju(fontovi, tekst, velicina, razmak = 0) {
  const [glavni, dodatni] = fontovi;
  const k = velicina / glavni.unitsPerEm;
  let x = 0;
  const delovi = [];
  const raspored = glavni.layout(tekst);
  raspored.glyphs.forEach((glif, i) => {
    let g = glif;
    let pomak = raspored.positions[i].xAdvance;
    if (g.id === 0 && dodatni) {
      const znak = [...tekst][i];
      g = dodatni.glyphForCodePoint(znak.codePointAt(0));
      pomak = g.advanceWidth * (glavni.unitsPerEm / dodatni.unitsPerEm);
    }
    const d = g.path.toSVG();
    if (d) delovi.push(`<path transform="translate(${(x * k).toFixed(2)} 0) scale(${k.toFixed(5)} ${(-k).toFixed(5)})" d="${d}"/>`);
    x += pomak + razmak / k;
  });
  return { svg: delovi.join(''), sirina: (x - razmak / k) * k };
}

/** Znak (mreža 48×48) */
const znak = (tamnaPozadina = false) => `
  <circle cx="34.5" cy="13.5" r="9.5" fill="${BOJE.kajsija}"/>
  <path d="M22 9.5c9.5-.8 18.5 5.2 20.3 14.7 1.8 9.6-4.3 19-14.3 20.8-10 1.9-20.3-3.8-22.7-13.300C2.900 22.100 9.800 10.600 22 9.500Z" fill="${tamnaPozadina ? BOJE.svetloplava : BOJE.plava}"/>
  <path d="M12.5 33.500c4.500-.5 7.500-3 9.800-6.500 2.400-3.700 5.200-6.800 10.200-7.500" stroke="${tamnaPozadina ? BOJE.teget : BOJE.bez}" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;

function logoHorizontalni(tamna) {
  const boja = tamna ? BOJE.bez : BOJE.teget;
  const ime = tekstUPutanju(serif, NAZIV, 64);
  const pod = tekstUPutanju(sans, PODNASLOV, 15.5, 3.4);
  const znakV = 104;
  const razmak = 26;
  const sirina = Math.ceil(znakV + razmak + Math.max(ime.sirina, pod.sirina) + 4);
  const visina = 112;
  return {
    sirina,
    visina,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sirina} ${visina}" width="${sirina}" height="${visina}" role="img" aria-label="${NAZIV} — ${sajt.podnaslov}">
  <g transform="translate(0 4) scale(${znakV / 48})">${znak(tamna)}</g>
  <g fill="${boja}" transform="translate(${znakV + razmak} 62)">${ime.svg}</g>
  <g fill="${boja}" opacity=".8" transform="translate(${znakV + razmak + 2} 94)">${pod.svg}</g>
</svg>`,
  };
}

function logoVertikalni(tamna) {
  const boja = tamna ? BOJE.bez : BOJE.teget;
  const ime = tekstUPutanju(serif, NAZIV, 72);
  const pod = tekstUPutanju(sans, PODNASLOV, 16, 3.6);
  const sirina = Math.ceil(Math.max(ime.sirina, pod.sirina) + 24);
  const znakV = 132;
  const visina = 290;
  return {
    sirina,
    visina,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sirina} ${visina}" width="${sirina}" height="${visina}" role="img" aria-label="${NAZIV} — ${sajt.podnaslov}">
  <g transform="translate(${(sirina - znakV) / 2} 0) scale(${znakV / 48})">${znak(tamna)}</g>
  <g fill="${boja}" transform="translate(${(sirina - ime.sirina) / 2} 216)">${ime.svg}</g>
  <g fill="${boja}" opacity=".8" transform="translate(${(sirina - pod.sirina) / 2} 262)">${pod.svg}</g>
</svg>`,
  };
}

const znakSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="${NAZIV}">${znak(false)}</svg>`;

// Ikonica za telefone: znak na bež podlozi
const ikonaSvg = (v) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${v} ${v}" width="${v}" height="${v}">
  <rect width="${v}" height="${v}" fill="${BOJE.bez}"/>
  <g transform="translate(${v * 0.16} ${v * 0.16}) scale(${(v * 0.68) / 48})">${znak(false)}</g>
</svg>`;

// Slika za deljenje na mrežama (1200×630)
function ogSlika() {
  const ime = tekstUPutanju(serif, NAZIV, 104);
  const pod = tekstUPutanju(sans, PODNASLOV, 25, 6);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="${BOJE.bez}"/>
  <circle cx="1010" cy="150" r="150" fill="${BOJE.kajsija}"/>
  <path d="M640 520C680 380 800 300 930 330s210 150 190 290-150 220-290 190-230-150-190-290Z" fill="${BOJE.svetloplava}"/>
  <path d="M820 700V420c0-96 66-166 156-166s156 70 156 166v280Z" fill="${BOJE.plava}"/>
  <path d="M976 240c-52 0-92-42-88-96s42-94 94-92 90 48 84 100-40 88-90 88Z" fill="${BOJE.kajsijaTamna}"/>
  <path d="M780 250c40 30 50 76 0 152-50-76-40-122 0-152Z" fill="${BOJE.plava}" transform="rotate(-24 780 326)"/>
  <g transform="translate(88 150) scale(${118 / 48})">${znak(false)}</g>
  <g fill="${BOJE.teget}" transform="translate(88 400)">${ime.svg}</g>
  <g fill="${BOJE.plava}" transform="translate(92 462)">${pod.svg}</g>
</svg>`;
}

/** ICO fajl sa jednom PNG slikom (32×32) */
function ico(png) {
  const zaglavlje = Buffer.alloc(22);
  zaglavlje.writeUInt16LE(0, 0);
  zaglavlje.writeUInt16LE(1, 2);
  zaglavlje.writeUInt16LE(1, 4);
  zaglavlje.writeUInt8(32, 6);
  zaglavlje.writeUInt8(32, 7);
  zaglavlje.writeUInt8(0, 8);
  zaglavlje.writeUInt8(0, 9);
  zaglavlje.writeUInt16LE(1, 10);
  zaglavlje.writeUInt16LE(32, 12);
  zaglavlje.writeUInt32LE(png.length, 14);
  zaglavlje.writeUInt32LE(22, 18);
  return Buffer.concat([zaglavlje, png]);
}

const javno = path.join(koren, 'public');
const brend = path.join(javno, 'brend');
mkdirSync(brend, { recursive: true });

const png = (svg, sirina) => sharp(Buffer.from(svg), { density: 300 }).resize({ width: sirina }).png({ compressionLevel: 9 });

const logotipi = {
  'logo-horizontalni': logoHorizontalni(false),
  'logo-horizontalni-tamna-pozadina': logoHorizontalni(true),
  'logo-vertikalni': logoVertikalni(false),
  'logo-vertikalni-tamna-pozadina': logoVertikalni(true),
};

for (const [ime, l] of Object.entries(logotipi)) {
  writeFileSync(path.join(brend, `${ime}.svg`), l.svg);
  await png(l.svg, ime.includes('vertikalni') ? 1000 : 1600).toFile(path.join(brend, `${ime}.png`));
}
writeFileSync(path.join(brend, 'znak.svg'), znakSvg);
await png(znakSvg, 1024).toFile(path.join(brend, 'znak.png'));

writeFileSync(path.join(javno, 'favicon.svg'), znakSvg);
writeFileSync(path.join(javno, 'favicon.ico'), ico(await png(znakSvg, 32).toBuffer()));
await png(ikonaSvg(180), 180).toFile(path.join(javno, 'apple-touch-icon.png'));
await png(ikonaSvg(192), 192).toFile(path.join(javno, 'ikona-192.png'));
await png(ikonaSvg(512), 512).toFile(path.join(javno, 'ikona-512.png'));
await sharp(Buffer.from(ogSlika())).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(path.join(javno, 'og-podrazumevana.png'));

writeFileSync(
  path.join(javno, 'site.webmanifest'),
  JSON.stringify(
    {
      name: `${NAZIV} — ${sajt.podnaslov}`,
      short_name: NAZIV,
      lang: 'sr-Latn',
      start_url: '/',
      display: 'browser',
      background_color: BOJE.bez,
      theme_color: BOJE.bez,
      icons: [
        { src: '/ikona-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/ikona-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2,
  ),
);

console.log('Gotovo: public/brend/ (logo SVG + PNG), favicon, ikone i og-podrazumevana.png');
