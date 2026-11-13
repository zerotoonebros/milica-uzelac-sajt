# What is left to do

Status as of **13 Nov 2026, end of day one**. Tick items off as they are done. Details for every item are in the guide named next to it.

**Where things stand:** the site is built, live as a preview at **https://milica-uzelac.netlify.app**, stored in the private GitHub repository `zerotoonebros/milica-uzelac-sajt`, and publishes automatically on every push. It is hidden from Google. All content is draft.

## Picking up tomorrow

```bash
npm run dev
```

Then open http://localhost:4321. If the client (or you, through the editing panel) changed anything in the meantime, first run:

```bash
git pull
```

Remember: **every `git push` publishes the site and costs 15 Netlify credits** from the 300 a month you share with your own site (about 165 used this month by my estimate). Put `[skip ci]` in a commit message to push without publishing.

---

## 1. Finish the hosting setup — you, in the browser

Guide: [docs/02-go-live.md](docs/02-go-live.md)

- [ ] **Client login for the editing panel** — Step 4. Register a GitHub OAuth app (callback URL exactly `https://api.netlify.com/auth/done`), then paste its Client ID and secret into Netlify: Project configuration → Security → OAuth → Install Provider → GitHub. Until this is done `/admin/` opens but nobody can sign in.
- [ ] **Test the editing panel end to end** — log in at https://milica-uzelac.netlify.app/admin/, change one word on the home page, use **Save and Publish**, confirm it appears on the site. This has never been tried on the live site.
- [ ] **Publish button for the panel** — Step 5. Create a build hook (Project configuration → Developer settings → Continuous deployment → Build hooks) and paste its URL into the panel's Settings → Developer. Needed once per browser.
- [ ] **Form e-mail notifications** — Project configuration → **Notifications** tab → form submission notification → your (later the client's) e-mail. Until then messages are only stored in Netlify under Forms.
- [ ] **Send one test message** through the contact form on the live site and check it appears in Netlify under Forms. Do the same for the newsletter, a workshop sign-up, a program inquiry and the booking request.
- [ ] **"Powered by Netlify" badge** — decide whether to keep it; the setting is at Project configuration → General → Powered by Netlify badge.
- [ ] **Let the client try editing (optional, before handover)** — the client needs a GitHub account, added as a collaborator on the repository (GitHub → repository → Settings → Collaborators).
- [ ] **Watch the credits** — Netlify → team → Billing/Usage. If they run out, both this site and your own are paused until the monthly reset.
- [ ] **Check the site on a real iPhone and a real Android phone.**

## 2. Design review — you, then the client

Live style guide: https://milica-uzelac.netlify.app/stil/ · Notes: [docs/01-design-system.md](docs/01-design-system.md)

- [ ] **Confirm the palette.** I combined the cream and navy of your screenshot with the Persian blue and apricot from the moodboard in the brief. Tell me if you meant only the screenshot's colours.
- [ ] **Confirm the fonts** — EB Garamond (headings), Jost (text, buttons), Ms Madi (handwritten accent).
- [ ] **Confirm or replace the logo** — it is my proposal. If the client has their own, it replaces the files in `public/brend/` and the header.
- [ ] **Go through every page yourself** and note what you want changed: layout, section order, spacing, wording of buttons.
- [ ] **Send the client the preview link** and collect their feedback in one list.
- [ ] **Decide the language of the editing panel help** — the panel's own buttons are in English; all field names are Serbian.

## 3. Content from the client

Everything on the site now is a draft I wrote. Full table: [docs/05-launch-checklist.md](docs/05-launch-checklist.md)

- [ ] **Photos** — every photo slot shows a placeholder illustration. Portrait (4:5) for the home page and "O meni"; square for two sections; landscape for blog, workshops, programs.
- [ ] **Alt text** for every photo (one sentence describing it).
- [ ] **Contact details** — e-mail (now `kontakt@tvojdomen.rs`), phone, location.
- [ ] **Social media links** — Instagram, LinkedIn, TikTok (now generic links to the networks' home pages).
- [ ] **Biography** — "O meni" and "Moja priča".
- [ ] **Education and certificates** — three "Ovde upiši…" placeholders.
- [ ] **Mission, values, vision** — "Moja misija" page.
- [ ] **Individual sessions** — length, format, rhythm, price (four "Upiši…" placeholders), and the FAQ answers, especially cancellation terms.
- [ ] **Intro call** — length and whether it is free.
- [ ] **Workshops** — replace or delete the two invented examples.
- [ ] **Programs** — replace or delete the three invented examples.
- [ ] **Testimonials** — replace the four invented ones with real ones (with each person's consent) or delete them. **They must not go live as they are.**
- [ ] **Blog** — edit, replace or delete the three draft articles.
- [ ] **All other texts** — home page, "Rad sa mnom", "Programi", contact, booking, footer.
- [ ] **SEO titles and descriptions** — review the ones I wrote for each page.

## 4. Services to connect — accounts in the client's name

- [ ] **Domain** — register it in the client's name (`.rs` through an accredited registrar). Guide 2, Step 6.
- [ ] **Connect the domain to Netlify** and confirm HTTPS works; choose the primary address (with or without `www`).
- [ ] **Update `site_url` and `display_url`** in `public/admin/config.yml`, and the Homepage URL of the GitHub OAuth app, to the real domain.
- [ ] **Brevo** (confirmation e-mails + newsletter) — account, verified sender, authenticated domain, newsletter list, double opt-in template, API key, then five environment variables in Netlify. Guide: [docs/04-forms-newsletter-booking.md](docs/04-forms-newsletter-booking.md), Step 4.
- [ ] **Test the confirmation e-mails and newsletter sign-up** with real keys. The code has only been tested with the network faked.
- [ ] **Booking calendar** (Cal.com or Calendly) — account, connected calendar and video tool, "Uvodni razgovor" event; paste its link in the panel under Podešavanja. Guide 4, Step 5.
- [ ] **Google Analytics 4** and **Google Tag Manager** — create both, paste the GTM ID in the panel, build the tags, test, publish. Guide: [docs/03-analytics.md](docs/03-analytics.md), Steps 1–4.
- [ ] **Mark key events** in GA4 and add the custom dimensions; set data retention to 14 months.
- [ ] **Test the "booking completed" event** once the calendar is connected (guide 3, Step 5). It could not be tested without a real calendar.
- [ ] **Confirm nothing from Google loads before consent** — private window, choose "Samo neophodni", check the browser's Network tab.
- [ ] **Google Search Console** — verify the domain, add yourself as a user. Submit the sitemap only after launch.
- [ ] **UTM links** — give the client the ready-made links for Instagram, LinkedIn and the newsletter (table in guide 3).
- [ ] **Meta Pixel** — only when paid advertising starts (guide 3).

## 5. Legal — client and a lawyer

- [ ] **Fill in the `[Upisati: …]` placeholders** in the privacy policy: who handles the data, address, retention periods, the newsletter and booking services actually used.
- [ ] **Update the cookie policy** if the tools differ from what it lists.
- [ ] **Have a lawyer review both documents** and the cookie banner before launch (the brief asks for this).

## 6. Hand over to the client's accounts

Guide 2, section "Handing over to the client"

- [ ] Client creates a **GitHub** account (with two-factor authentication) and a **Netlify** account.
- [ ] **Transfer the GitHub repository** to the client; the client adds you back as a collaborator.
- [ ] Point your local folder at the new address (`git remote set-url …`) and update `repo:` in `public/admin/config.yml`.
- [ ] **Create the Netlify project in the client's account** and redo: repository link, OAuth app (under the client's GitHub), build hook, form notifications, environment variables. Switch off the visitor login wall there too if their team has it on.
- [ ] **Move the address / domain** from your project to theirs.
- [ ] Export any real form submissions from your project, then **delete your Netlify project and your OAuth app**.
- [ ] Choose the client's **Netlify plan** — Free allows about 20 publishes a month; Personal is about $9 a month.
- [ ] **30-minute walkthrough** of the editing panel with the client, using [docs/UPUTSTVO-ZA-UREDJIVANJE.md](docs/UPUTSTVO-ZA-UREDJIVANJE.md).
- [ ] **Agree maintenance in writing** — domain renewal, Netlify plan, who edits content, a yearly update of the site's software.

## 7. Launch day

Full ordered list: [docs/05-launch-checklist.md](docs/05-launch-checklist.md), "Launch day, in order"

- [ ] No example or placeholder content left. This should print nothing:

```bash
grep -rniE "upiši|upisati|tvojdomen|primer: true" src/content
```

- [ ] Every form tested on the live domain with a real e-mail address.
- [ ] **Switch on Google indexing** — panel → Podešavanja → Opšta podešavanja → SEO → "Dozvoli Google-u da prikazuje sajt" → Save and Publish.
- [ ] Check `https://DOMAIN/robots.txt` now says `Allow: /`.
- [ ] Submit `sitemap-index.xml` in Search Console and request indexing of the home page.
- [ ] Run **PageSpeed Insights** on the home page and a blog post with the real photos in; save the result for the client.

## 8. Not verified yet — worth knowing

- The editing panel on the live site (login, saving, publishing).
- Whether **Save** in the panel really skips a deploy and **Save and Publish** triggers one, as designed.
- Real delivery of form messages and e-mail notifications.
- Confirmation e-mails and newsletter sign-up against the real Brevo service.
- The "booking completed" analytics event.
- Speed with the client's real photos (current scores were measured without photos).
- Appearance on real phones.

## 9. Ideas for later

- English version of the site.
- Blog category pages and search, once there are 15 or more posts.
- Online payment or a course platform for the programs.
- A free PDF guide delivered by e-mail in exchange for a newsletter sign-up.

---

## Housekeeping

- **Netlify command-line tool is still signed in on this computer** (it was authorized on 13 Nov to do the first deploy). It is no longer needed now that pushes publish automatically. To sign it out:

```bash
npx netlify-cli@27.17.0 logout
```

- **Commits are authored as "Murmix"** with your e-mail, set for this project only. The client will see that in the history after the transfer.
