# 5. Launch checklist

The client's "Završna checklist-a za programera", item by item.

**Legend:** ✅ done in the project · 🔧 you do it (guide linked) · 👤 needs the client

## Vizuelni identitet i dizajn

| Item | Status | Notes |
| --- | --- | --- |
| Logo i sve njegove verzije | ✅ proposal | Horizontal + vertical, light + dark, SVG + PNG, favicon — `public/brend/`. 👤 Client approves or supplies their own. |
| Definisana paleta boja sa HEX kodovima | ✅ | [01-design-system.md](01-design-system.md), live at `/stil/` |
| Fontovi i tipografska hijerarhija | ✅ | EB Garamond / Jost / Ms Madi |
| Prilagođen dizajn za desktop, tablet i mobilni | ✅ | Checked at 375, 800 and 1440 px |
| Konzistentan izgled fotografija, dugmadi i ikonica | ✅ | One icon set, one button system, fixed photo shapes |
| Figma dizajn ili drugi pregledni prototip | ✅ | The local site and `/stil/` are the prototype; share the Netlify preview link |
| Fotografije | 👤 | Client has them. Upload in the CMS; every photo slot currently shows a placeholder illustration. |

## Struktura i funkcionalnosti

| Item | Status | Notes |
| --- | --- | --- |
| Početna, O meni, Moja misija, Rad sa mnom, Programi, Blog, Utisci, Kontakt | ✅ | Plus Individualne sesije, Grupne radionice, E-book, Masterclass, Zakazivanje |
| CMS za samostalno uređivanje sadržaja | ✅ built · 🔧 login | [02-go-live.md](02-go-live.md), Step 4 |
| Menjanje navigacije, fotografija, CTA dugmadi i linkova | ✅ | CMS → Podešavanja |
| Kreiranje radionica, E-book i Masterclass programa | ✅ | CMS → Radionice / Programi |
| Kontakt forma sa potvrdom uspešnog slanja | ✅ built · 🔧 notifications | [04](04-forms-newsletter-booking.md), Steps 1–3 |
| Automatska potvrda prijema upita | ✅ code · 🔧 keys | [04](04-forms-newsletter-booking.md), Step 4 |
| Zaštita od spama | ✅ | Honeypot + Netlify filter |
| Zakazivanje uvodnih razgovora | ✅ form · 🔧 calendar | [04](04-forms-newsletter-booking.md), Step 5 |
| Prijava na grupne radionice | ✅ | Form on each workshop page |
| Newsletter uz saglasnost | ✅ form · 🔧 Brevo | [04](04-forms-newsletter-booking.md), Step 4 |
| Preuzimanje PDF materijala (kasnije) | ✅ ready | Tracking is automatic; see guide 4 |
| Linkovi ka društvenim mrežama | ✅ · 👤 real links | CMS → Podešavanja → Društvene mreže (currently generic links) |

## SEO i tehnička optimizacija

| Item | Status | Notes |
| --- | --- | --- |
| SEO naslovi i meta opisi za svaku stranicu | ✅ | Editable per page and per blog post in the CMS |
| Jedan H1 po stranici, pravilna hijerarhija H2/H3 | ✅ | |
| Kratke i opisne URL adrese | ✅ | e.g. `/rad-sa-mnom/individualne-sesije/` |
| Alt tekstovi | ✅ field · 👤 fill in | Each photo field has an alt text field next to it |
| XML sitemap | ✅ | `/sitemap-index.xml`, generated on every build |
| robots.txt | ✅ | Blocks everything until indexing is switched on |
| Canonical tag | ✅ | On every page |
| Structured data | ✅ | Person/Service, Article, Event, FAQ, Breadcrumbs |
| Open Graph slika za deljenje | ✅ | Automatic; replaceable in the CMS |
| Optimizovane fotografije | ✅ | AVIF + WebP in six sizes, lazy loading, fixed dimensions |
| Brzina učitavanja / Core Web Vitals | ✅ local | See results below. 🔧 Re-test on the live domain with PageSpeed Insights. |
| HTTPS i SSL sertifikat | 🔧 | Automatic once the domain is on Netlify — [02](02-go-live.md), Step 6 |
| Mobile responsive testiranje | ✅ | 🔧 Also check on a real phone after deploy |

### Speed test results

Google Lighthouse, mobile profile with throttling, on the production build served locally (13 Nov 2026), with indexing temporarily switched on for the SEO score:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Početna | 100 | 100 | 100 | 100 | 1.1 s | 0 | 0 ms |
| Blog tekst | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |
| Radionica | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |
| Kontakt | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |

Targets from the brief: LCP ≤ 2.5 s, INP < 200 ms, CLS < 0.1. INP can only be measured with real visitors; total blocking time of 0 ms and about 2.5 KB of JavaScript make a good INP very likely.

**Two caveats.** These are lab numbers from this computer, not the live server. And the pages currently have no real photos — large photos are the usual reason scores drop. The site resizes and compresses every uploaded photo, so the effect should be small, but **re-run PageSpeed Insights after the real photos are in** and send the client that screenshot.

## Analitika i marketing

| Item | Status | Notes |
| --- | --- | --- |
| Google Analytics 4 | 🔧 | [03-analytics.md](03-analytics.md), Steps 1–4 |
| Google Tag Manager | ✅ site side · 🔧 container | Paste the GTM ID in the CMS |
| Google Search Console | 🔧 | Guide 3 |
| Podešeni GA4 događaji i key events | ✅ events sent · 🔧 GTM tag + key events | Guide 3, Steps 3–4 |
| UTM praćenje | ✅ | Works automatically; link table in guide 3 |
| Predviđena integracija Meta Pixel-a | ✅ | Marketing consent category exists; steps in guide 3 |
| Cookie consent i Google Consent Mode | ✅ | Accept / reject / customize; changeable from the footer |
| Bez ličnih podataka u GA događajima | ✅ | Only form names and item names are sent |

## Sigurnost i završna predaja

| Item | Status | Notes |
| --- | --- | --- |
| Politika privatnosti i politika kolačića | ✅ drafts · 👤 lawyer | Fill the `[Upisati: …]` placeholders, then legal review |
| Backup i zaštita sajta | ✅ | Full history in GitHub; security headers set; 🔧 enable 2FA on the client's GitHub |
| Svi vlasnički pristupi predati klijentu | 🔧 👤 | [02](02-go-live.md), Step 0 |
| Testirane kontakt forme i prijave | ✅ locally · 🔧 live | Validation and success states tested locally. Real delivery must be tested after deploy. |
| Testirani analitički događaji u GA4 DebugView-u | 🔧 | Guide 3, Step 3f. Events confirmed in the page's data layer locally. |
| Obuka za samostalno upravljanje sajtom | ✅ handbook · 🔧 walkthrough | [UPUTSTVO-ZA-UREDJIVANJE.md](UPUTSTVO-ZA-UREDJIVANJE.md) + a 30-minute call |
| Dogovoreno održavanje i tehnička podrška | 👤 🔧 | Agree in writing (domain renewal, plan, updates) |

---

## Content the client must supply or confirm

All current texts are **drafts I wrote** from the brief's keywords so the design can be judged with realistic content. None of it is confirmed by the client.

| What | Where in the CMS | Current state |
| --- | --- | --- |
| Photos | Every "Fotografija" field | Placeholder illustrations |
| E-mail, phone, location | Podešavanja → Opšta podešavanja | `kontakt@tvojdomen.rs`, no phone |
| Social network links | Podešavanja → Društvene mreže | Generic links to instagram.com etc. |
| Biography, "Moja priča" | Stranice → O meni | Generic draft |
| Education and certificates | Stranice → O meni → Obrazovanje | "Ovde upiši…" placeholders |
| Mission, values, vision | Stranice → Moja misija | Draft |
| Session length, format, price | Stranice → Individualne sesije → Praktične informacije | "Upiši…" placeholders |
| Intro call length and price | Stranice → Utisci, Kontakt, Zakazivanje… → Zakazivanje | "Upiši…" placeholders |
| Workshops | Radionice | 2 invented examples, marked "Primer" |
| Programs | Programi | 3 invented examples, marked "Primer" |
| **Testimonials** | Utisci klijenata | 4 invented examples, visibly marked "Primer teksta". **Must be replaced with real ones (with consent) or deleted before launch.** |
| Blog posts | Blog | 3 draft articles for the client to edit or replace |
| FAQ answers | Stranice → Individualne sesije → Česta pitanja | Draft — check cancellation terms especially |
| Legal texts | Pravne stranice | Templates with `[Upisati: …]` placeholders |

## Launch day, in order

1. All "Primer" items replaced or deleted; no "Upiši…" or `[Upisati` text left. Quick check — this should print nothing:

```bash
grep -rniE "upiši|upisati|tvojdomen|primer: true" src/content
```

2. Legal pages reviewed by a lawyer.
3. Domain connected, HTTPS working, primary domain chosen.
4. `site_url` in `public/admin/config.yml` updated to the real domain.
5. Test every form on the live site with a real e-mail address.
6. GTM published; events visible in GA4 DebugView; no Google requests before consent.
7. CMS → Podešavanja → SEO → **Dozvoli Google-u da prikazuje sajt → on** → Save and Publish.
8. Open `https://DOMAIN/robots.txt` — it should now say `Allow: /` and list the sitemap.
9. Search Console: submit `sitemap-index.xml`; use *URL inspection → Request indexing* for the home page.
10. Run PageSpeed Insights on the home page and one blog post; save the results for the client.
11. Check the site on a real iPhone and a real Android phone.

## Ideas for a later version

- English version of the site (the structure allows a second language).
- Blog category pages and search, once there are 15+ posts.
- Online payment or a course platform for programs.
- A lead-magnet PDF with automatic delivery by e-mail.
