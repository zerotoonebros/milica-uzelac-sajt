# What is left to do

Status as of **23 Nov 2026**. Tick items off as they are done. Details for every item are in the guide named next to it.

**Where things stand:** the site is built, live as a preview at **https://milica-uzelac.netlify.app**, stored in the **public** GitHub repository `zerotoonebros/milica-uzelac-sajt`, and publishes automatically on every push. It is hidden from Google. All content is draft. The client can sign in to the editing panel and publish on her own.

## Where we left off (20 Nov) — after the call with the client

Done on the call:

- **Client has a GitHub account** (`MilicaUz12`) and is a collaborator on the repository.
- **Client signed in to the editing panel** at `/admin/` and edited the home page.
- **Her first publish was blocked by Netlify** ("Unrecognized Git contributor"): on the Free plan, a private repository only builds commits from members of the Netlify team.
- **Fix: the repository is now public**, and it was linked to the Netlify project again so Netlify picked up the change. Before the switch the whole history was scanned for keys and tokens; none were found.
- **Confirmed:** her next edit (18:49, **Save and Publish**) went live by itself, with no help from you.

Consequences of the public repository:

- Anyone can read the code, the draft texts, these guides and the commit history. Never commit keys or passwords; they belong in Netlify's environment variables.
- The commit history shows the e-mail addresses of both of you. The client can hide hers for future commits in GitHub under Settings → Emails → "Keep my email addresses private".
- After the handover the repository must **stay public** (or the client pays for Netlify Pro), otherwise your commits would be the blocked ones.

Done after the call (confirmed by you, 23 Nov): the client tried editing on her own again and it worked. The four follow-ups from the call are closed:

- **Plain Save test** — done.
- **Photo upload** through the panel — done.
- **Announcement bar** — agreed with the client. Note: as of 23 Nov the repository still holds the example text ("Granice bez griže savesti"); whatever she chose has not been published yet, so check the live site before launch.
- **Design feedback / content** — moved to sections 2 and 3 below; the ball is with the client.

Nothing new has been pushed to GitHub since 20 Nov, so none of her later tests created commits.

## Picking up tomorrow

```bash
git pull
npm run dev
```

Then open http://localhost:4321. Always run `git pull` first now: the client edits through the panel, and each of her edits is a commit.

Remember: **every `git push` and every Save and Publish in the panel publishes the site and costs 15 Netlify credits.** Since 23 Nov the team is on Netlify's **Pro plan**: 3,000 credits a month for $20, billing period from the 23rd to the 22nd, so about 200 publishes a month shared with your own site. Usage is under the team's Usage & billing. Put `[skip ci]` in a commit message to push without publishing.

---

## 1. Finish the hosting setup — you, in the browser

Guide: [docs/02-go-live.md](docs/02-go-live.md)

- [x] **Client login for the editing panel** — done 19 Nov. GitHub OAuth app "Milica Uzelac CMS" registered under `zerotoonebros`, keys installed in Netlify.
- [x] **Test the editing panel end to end** — done 19 Nov. Signed in at `/admin/`, changed one word on the home page with **Save and Publish**, and it appeared on the live site.
- [ ] **Publish button for the panel (optional, skipped)** — Step 5. Only powers the separate "Publish Changes" button and has to be set up in every browser. **Save and Publish** works without it, and that is what the client handbook teaches.
- [x] **Form e-mail notifications** — done 23 Nov. Netlify → **Forms** → **Submission notifications** tab (not Project configuration → Notifications, which lists only deploy events). Two e-mail notifications, "Any form": yours and the client's; hers confirmed.
- [x] **Test all five forms on the live site** — done 23 Nov by you and the client: contact, newsletter, workshop sign-up, program inquiry and booking request all appear in Netlify under Forms and the notification e-mails arrive.
- [x] **"Powered by Netlify" badge** — decided 23 Nov (Project configuration → General → Powered by Netlify badge).
- [x] **Let the client try editing** — done 20 Nov. She signed in, edited the home page and published by herself (after the repository was made public).
- [x] **Credits** — read on 23 Nov: Pro plan, **3,000 credits a month** ($20), billing period runs from the 23rd to the 22nd. At 15 credits a publish that is about 200 publishes a month, shared with your own site. Form submissions cost nothing.
- [x] **Check the site on real phones** — done by you and the client, 23 Nov; looks fine.

## 2. Design review — you, then the client

Live style guide: https://milica-uzelac.netlify.app/stil/ · Notes: [docs/01-design-system.md](docs/01-design-system.md)

- [x] **Palette** — accepted by you and the client, 23 Nov. Changes later only if needed.
- [x] **Fonts** — accepted, 23 Nov (EB Garamond, Jost, Ms Madi).
- [x] **Logo** — accepted for now, 23 Nov. If the client ever brings her own, it replaces the files in `public/brend/` and the header.
- [x] **Go through every page** — done by you and the client, 23 Nov, on desktop and phone. One change requested: on the home page, every topic chip in "Sa čim ti mogu pomoći" gets the apricot background (previously every fourth one). Done in `src/pages/index.astro`; new chips added in the panel look the same automatically.
- [x] **Client's feedback** — she is happy with the look (23 Nov). Future tweaks as they come up.
- [x] **Panel language** — stays as it is (23 Nov): Sveltia's own buttons in English, every field name in Serbian. The client already edits and publishes with it, and the handbook says so.

## 3. Content from the client

Everything on the site now is a draft I wrote. Full table: [docs/05-launch-checklist.md](docs/05-launch-checklist.md). **Client-facing version in Serbian, ready to send: [docs/SPISAK-ZA-KLIJENTKINJU.md](docs/SPISAK-ZA-KLIJENTKINJU.md)** (written 23 Nov) — she does all of this herself in the panel; only the decisions in its section 1 come back to you.

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

## 6. Hosting after launch — choose a path

Guide 2, section "Two ways to go live". Everything done so far is valid for both. Decide before the domain is connected.

- [ ] **Decide with the client:** Path A (site stays in your Netlify Pro team, her domain points at it, paid hosting arrangement in writing) or Path B (everything moves to her own accounts, as the brief asks).

### Path A — keep hosting in your team

- [ ] Connect the client's domain to the existing project (section 4 above) and update the addresses in `public/admin/config.yml` and the OAuth app.
- [ ] On launch day remove **your** e-mail from Forms → Submission notifications, leaving only the client's.
- [ ] **Written hosting agreement** — monthly price, domain renewal, who edits content, yearly software update, and that she can move to her own accounts at any time (Path B).
- [ ] Ask the lawyer whether the privacy policy must name you as the hosting account holder.
- [ ] Optional: transfer the GitHub repository to the client now; then relink it in Netlify and update `repo:` in `public/admin/config.yml`. Keep it public.

### Path B — full handover to the client's accounts

Guide 2, section "Handing over to the client"

- [ ] Client creates a **Netlify** account. (GitHub account `MilicaUz12` exists since 20 Nov; check that two-factor authentication is on.)
- [ ] **Transfer the GitHub repository** to the client; the client adds you back as a collaborator. **Keep it public** — on Netlify's Free plan a private repository only builds commits from one person.
- [ ] Point your local folder at the new address (`git remote set-url …`) and update `repo:` in `public/admin/config.yml`.
- [ ] **Create the Netlify project in the client's account** and redo: repository link, OAuth app (under the client's GitHub), build hook, form notifications (yours and hers were set on 23 Nov in your project and do not move), environment variables. Switch off the visitor login wall there too if their team has it on.
- [ ] **Move the address / domain** from your project to theirs.
- [ ] Export any real form submissions from your project, then **delete your Netlify project and your OAuth app**.
- [ ] Choose the client's **Netlify plan** — Free allows about 20 publishes a month; Personal is about $9 a month.

### Both paths

- [ ] **30-minute walkthrough** of the editing panel with the client, using [docs/UPUTSTVO-ZA-UREDJIVANJE.md](docs/UPUTSTVO-ZA-UREDJIVANJE.md).
- [ ] **Agree maintenance in writing** — domain renewal, hosting, who edits content, a yearly update of the site's software.

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

- Whether **Save** in the panel really skips a deploy, as designed. (**Save and Publish** is confirmed to trigger one, for you on 19 Nov and for the client on 20 Nov.)
- Uploading a photo through the panel on the live site.
- Confirmation e-mails and newsletter sign-up against the real Brevo service.
- The "booking completed" analytics event.
- Speed with the client's real photos (current scores were measured without photos).

## 9. Ideas for later

- English version of the site.
- Blog category pages and search, once there are 15 or more posts.
- Online payment or a course platform for the programs.
- A free PDF guide delivered by e-mail in exchange for a newsletter sign-up.

---

## Housekeeping

- [x] **Netlify command-line tool's access revoked** (13 Nov). It was authorized only for the first deploy. It is signed out on this computer, its stored key is deleted, and the authorization was revoked in Netlify's user settings. To use the tool again, run `npx netlify-cli login`.

- **Commits are authored as "Murmix"** with your e-mail, set for this project only. The client will see that in the history after the transfer.
