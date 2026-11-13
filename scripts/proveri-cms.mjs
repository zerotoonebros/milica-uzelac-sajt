// Proverava da li se polja u CMS-u (public/admin/config.yml) poklapaju sa sadržajem u src/content.
// Pokretanje:  npm run provera
// Korisno posle svake izmene config.yml ili strukture sadržaja — hvata zaboravljena polja pre objave.
import { parse } from 'yaml';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const cms = parse(readFileSync('public/admin/config.yml', 'utf8'), { merge: true });
const problemi = [];

const oblik = (polja) => {
  const o = {};
  for (const p of polja) {
    if (p.fields) o[p.name] = p.widget === 'list' ? [oblik(p.fields)] : oblik(p.fields);
    else o[p.name] = p.widget === 'list' ? ['*'] : '*';
  }
  return o;
};

function uporedi(sema, podaci, putanja) {
  if (Array.isArray(sema)) {
    if (!Array.isArray(podaci)) return problemi.push(`${putanja}: očekivana je lista`);
    if (typeof sema[0] === 'object') podaci.forEach((d, i) => uporedi(sema[0], d, `${putanja}[${i}]`));
    return;
  }
  if (typeof sema !== 'object') return;
  for (const k of Object.keys(sema)) {
    if (!(k in (podaci ?? {}))) problemi.push(`${putanja}.${k}: polje postoji u CMS-u, ali ne i u fajlu`);
    else uporedi(sema[k], podaci[k], `${putanja}.${k}`);
  }
  for (const k of Object.keys(podaci ?? {})) {
    if (!(k in sema)) problemi.push(`${putanja}.${k}: polje postoji u fajlu, ali ne i u CMS-u (ne može da se uređuje)`);
  }
}

let fajlova = 0;
for (const kolekcija of cms.collections) {
  if (kolekcija.files) {
    for (const f of kolekcija.files) {
      fajlova++;
      uporedi(oblik(f.fields), JSON.parse(readFileSync(f.file, 'utf8')), f.name);
    }
  } else {
    // Kolekcije sa više unosa (blog, radionice…): proveri zaglavlje svakog .md fajla
    const dozvoljena = new Set(kolekcija.fields.map((p) => p.name));
    for (const ime of readdirSync(kolekcija.folder).filter((f) => f.endsWith('.md'))) {
      fajlova++;
      const tekst = readFileSync(path.join(kolekcija.folder, ime), 'utf8');
      const zaglavlje = parse(tekst.split(/^---\s*$/m)[1] ?? '') ?? {};
      for (const k of Object.keys(zaglavlje)) {
        if (!dozvoljena.has(k)) problemi.push(`${kolekcija.name}/${ime}: polje „${k}“ ne postoji u CMS-u`);
      }
      for (const p of kolekcija.fields) {
        if (p.required !== false && p.name !== 'body' && p.widget !== 'boolean' && !(p.name in zaglavlje)) {
          problemi.push(`${kolekcija.name}/${ime}: nedostaje obavezno polje „${p.name}“`);
        }
      }
    }
  }
}

if (problemi.length) {
  console.error(`Pronađeno neslaganja: ${problemi.length}\n- ` + problemi.join('\n- '));
  process.exit(1);
}
console.log(`U redu: ${fajlova} fajlova sa sadržajem se poklapa sa CMS podešavanjima (${cms.collections.length} kolekcija).`);
