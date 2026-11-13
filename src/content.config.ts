// Definicija sadržaja koji se uređuje kroz CMS (public/admin/config.yml mora da prati ova polja).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const seo = {
  seo_naslov: z.string().optional().nullable(),
  seo_opis: z.string().optional().nullable(),
};

const prazno = (v: unknown) => (v === '' || v === null ? undefined : v);

// Datum i vreme se čitaju tačno onako kako su upisani u CMS-u (bez pomeranja vremenske zone).
const kaoUpisano = (v: unknown) => {
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) && !/(Z|[+-]\d{2}:?\d{2})$/.test(v)) {
    return v.length === 10 ? v + 'T00:00:00Z' : v + 'Z';
  }
  return v;
};
const datumPolje = z.preprocess(kaoUpisano, z.coerce.date());

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    naslov: z.string(),
    opis: z.string(),
    datum: datumPolje,
    azurirano: z.preprocess((v) => kaoUpisano(prazno(v)), z.coerce.date().optional()),
    kategorija: z.string().default('Lični razvoj'),
    slika: z.string().optional().nullable(),
    slika_alt: z.string().optional().nullable(),
    nacrt: z.boolean().default(false),
    ...seo,
  }),
});

const radionice = defineCollection({
  loader: glob({ base: './src/content/radionice', pattern: '**/*.md' }),
  schema: z.object({
    naslov: z.string(),
    opis: z.string(),
    datum: datumPolje,
    trajanje: z.string().optional().nullable(),
    format: z.enum(['online', 'uzivo']).default('online'),
    lokacija: z.string().optional().nullable(),
    cena: z.string().optional().nullable(),
    broj_mesta: z.string().optional().nullable(),
    status: z
      .enum(['prijave-otvorene', 'poslednja-mesta', 'uskoro', 'popunjeno', 'zavrseno'])
      .default('prijave-otvorene'),
    slika: z.string().optional().nullable(),
    slika_alt: z.string().optional().nullable(),
    za_koga: z.array(z.string()).default([]),
    sta_dobijas: z.array(z.string()).default([]),
    primer: z.boolean().default(false),
    ...seo,
  }),
});

const programi = defineCollection({
  loader: glob({ base: './src/content/programi', pattern: '**/*.md' }),
  schema: z.object({
    naslov: z.string(),
    vrsta: z.enum(['e-book', 'masterclass']),
    opis: z.string(),
    obim: z.string().optional().nullable(),
    cena: z.string().optional().nullable(),
    status: z.enum(['dostupno', 'uskoro']).default('uskoro'),
    link_za_kupovinu: z.string().optional().nullable(),
    slika: z.string().optional().nullable(),
    slika_alt: z.string().optional().nullable(),
    sta_sadrzi: z.array(z.string()).default([]),
    redosled: z.number().default(10),
    primer: z.boolean().default(false),
    ...seo,
  }),
});

const utisci = defineCollection({
  loader: glob({ base: './src/content/utisci', pattern: '**/*.md' }),
  schema: z.object({
    ime: z.string(),
    opis_osobe: z.string().optional().nullable(),
    usluga: z.string().optional().nullable(),
    istaknuto: z.boolean().default(false),
    redosled: z.number().default(10),
    primer: z.boolean().default(false),
  }),
});

const pravno = defineCollection({
  loader: glob({ base: './src/content/pravno', pattern: '**/*.md' }),
  schema: z.object({
    naslov: z.string(),
    azurirano: datumPolje,
    ...seo,
  }),
});

export const collections = { blog, radionice, programi, utisci, pravno };
