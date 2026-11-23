# Milica Uzelac — Coach za lični napredak

Website for Milica Uzelac. Fast static site with an editing panel (CMS) so the client can change texts, photos, workshops, programs and blog posts without touching code.

## Quick start (local preview)

You need [Node.js](https://nodejs.org) 22.23 or newer (24 recommended).

```bash
npm install
```

```bash
npm run dev
```

Open **http://localhost:4321**. The page reloads by itself when you save a file.

| Address | What it is |
| --- | --- |
| http://localhost:4321/ | The site |
| http://localhost:4321/stil/ | Visual identity guide: colors (HEX), fonts, buttons, logo downloads |
| http://localhost:4321/admin/ | Editing panel (CMS). Locally: click **Work with Local Repository** and pick this folder (Chrome or Edge only) |

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Local preview with live reload |
| `npm run build` | Builds the production site into `dist/` |
| `npm run preview` | Serves the built `dist/` locally (use this for speed tests) |
| `npm run check` | Type-checks the code |
| `npm run provera` | Checks that the CMS fields match the content files — run after editing `public/admin/config.yml` |
| `npm run brend` | Regenerates logo files, favicon and the social sharing image |

## How it works (the short version)

```
Client edits in /admin/  →  change is saved to GitHub  →  Netlify rebuilds the site  →  live in about a minute
```

- **Astro** turns the content and templates into plain HTML/CSS. There is no database and no server to hack or update, which is why the site is fast and needs almost no maintenance.
- **Sveltia CMS** (`/admin/`) is the editing panel. It is a small web app that saves the client's changes as files in the GitHub repository.
- **Netlify** hosts the site, provides HTTPS, receives form submissions and rebuilds the site when content changes.
- All content lives in `src/content/` as readable text files, so nothing is locked inside a platform.

## Where things are

```
src/
  content/            ← ALL texts and settings (edited through the CMS)
    podesavanja/      site settings, navigation
    stranice/         page texts (home, about, mission…)
    blog/             blog posts
    radionice/        workshops
    programi/         e-book and masterclass programs
    utisci/           testimonials
    pravno/           privacy policy, cookie policy
  assets/uploads/     photos uploaded through the CMS (auto-optimized at build)
  pages/              page templates — one file per URL
  components/         building blocks (header, footer, forms, cards…)
  layouts/Osnovni.astro   <head>, SEO tags, cookie consent, header + footer
  styles/global.css   DESIGN SYSTEM — every color, font size, spacing and radius
  scripts/sajt.ts     forms, scroll animations, analytics events
public/
  admin/              CMS panel + its config (config.yml)
  brend/              logo files (SVG + PNG)
netlify/functions/    automatic confirmation e-mails + newsletter sign-up
netlify.toml          hosting settings, security headers, caching
docs/                 guides (see below)
```

## Guides

| File | For | Contents |
| --- | --- | --- |
| [TODO.md](TODO.md) | you | **Everything that is left to do**, as a checklist |
| [docs/01-design-system.md](docs/01-design-system.md) | you + client | Colors with HEX codes, typography, buttons, shapes, spacing |
| [docs/02-go-live.md](docs/02-go-live.md) | you | Step by step: GitHub → Netlify → domain → CMS login → sharing the preview with the client |
| [docs/03-analytics.md](docs/03-analytics.md) | you | GTM, GA4 events and key events, Search Console, Meta Pixel, consent, UTM links |
| [docs/04-forms-newsletter-booking.md](docs/04-forms-newsletter-booking.md) | you | Form notifications, spam protection, confirmation e-mails, newsletter, booking calendar |
| [docs/05-launch-checklist.md](docs/05-launch-checklist.md) | you + client | The client's checklist mapped to what is done, what you do, what the client does |
| [docs/UPUTSTVO-ZA-UREDJIVANJE.md](docs/UPUTSTVO-ZA-UREDJIVANJE.md) | client (Serbian) | How to edit the site in the CMS |
| [docs/SPISAK-ZA-KLIJENTKINJU.md](docs/SPISAK-ZA-KLIJENTKINJU.md) | client (Serbian) | What she fills in herself before launch, where each item is in the panel, and the decisions to send you |

## Important before launch

- **Google indexing is switched off** (`Podešavanja → Opšta podešavanja → SEO → Dozvoli Google-u da prikazuje sajt`). Turn it on only when the real content is in.
- Sample workshops, programs and testimonials are marked **„Primer“** on the site. Replace or delete them.
- The privacy and cookie policies contain `[Upisati: …]` placeholders and should be reviewed by a lawyer.
- The full list is in [docs/05-launch-checklist.md](docs/05-launch-checklist.md).
