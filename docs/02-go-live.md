# 2. Going live — step by step

This guide takes the site from your computer to the internet and gives the client a login to edit it. Do the steps in order. Total time: about 1–2 hours, plus waiting for the domain.

Menu names in GitHub and Netlify change now and then; if a label differs slightly from what is written here, look for the closest match. Netlify's **Project configuration** currently has these tabs: General · Environment variables · Developer settings · Notifications · Security · Configuration · Emails.

**What you get at the end**

- The site live on a private preview address (`something.netlify.app`) you can send to the client right away.
- The client logs in at `/admin/` and edits content.
- Later: the real domain with HTTPS.

---

## Current state (20 Nov 2026)

A preview is live, set up under the developer's own accounts for now:

| | |
| --- | --- |
| Preview address | **https://milica-uzelac.netlify.app** |
| Code | **Public** GitHub repository **zerotoonebros/milica-uzelac-sajt** (developer's account; to be transferred to the client later). Made public on 20 Nov 2026 — see the note under Step 1. Client `MilicaUz12` is a collaborator. |
| Netlify project | `milica-uzelac`, in the developer's team (Pro plan since 23 Nov 2026; credits shared with the developer's other project) |
| Publishing | **Linked to GitHub.** Every push to `main` rebuilds and publishes the site automatically (15 credits each). |
| Forms | Detection enabled; all five forms are registered and tested on the live site (23 Nov 2026). E-mail notifications go to the developer and the client (Step 7). |
| Editing panel (`/admin/`) | **Working since 19 Nov 2026.** Sign-in through GitHub (OAuth app "Milica Uzelac CMS" under `zerotoonebros`), and **Save and Publish** puts a change live. Confirmed for the client's own account on 20 Nov 2026. |
| Google | Hidden: indexing is switched off in the site settings. |

**Steps 1, 2 and 3 below are done.** Still to do:

1. **Step 4d** — give the client access: they create a GitHub account and are added as a collaborator on the repository.
2. **Step 5** — done 27 Nov 2026: the **Publish Changes** button now starts a deploy (build hook + GitHub Actions workflow).

**Mind the credits.** Each push to `main` costs 15 of the team's 300 monthly credits, shared with the developer's own site. To push something that does not need to go live (for example a change to these guides), put `[skip ci]` in the commit message and Netlify skips the build:

```bash
git commit -am "[skip ci] Opis izmene"
```

Things that came up during this first setup and will come up again on any new project in this team:

- **Login wall.** The team's default is "team login required" for new projects, so a fresh project shows visitors a Netlify login page. It was switched off for this project only (in the dashboard: **Project configuration → General → Visitor access**). The team default was left as it was.
- **"Powered by Netlify" badge.** Netlify's Free plan shows a small badge in the bottom-right corner of the site. Its setting is under **Project configuration → General → Powered by Netlify badge**.
- **Repository not in the list when linking.** The Netlify app on GitHub only sees repositories it was given. Add the new one at github.com/settings/installations → Netlify → Configure → Repository access.

---

## Step 0 — Decide who owns the accounts (5 min)

The brief (section 10) says the client must own everything. The clean way:

| Account | Created with | Your access |
| --- | --- | --- |
| GitHub (stores the site) | Client's e-mail | Client adds you as collaborator on the repository |
| Netlify (hosting) | Client's e-mail, or "Sign up with GitHub" using the client's GitHub | You set it up together on a call, or the client shares the login during setup and changes the password after |
| Domain registrar | Client's e-mail | Client changes DNS records once (Step 6), or gives temporary access |
| Google (Analytics, Tag Manager, Search Console) | Client's Google account | Client adds your Google account as admin/editor — see [03-analytics.md](03-analytics.md) |

If you start under your own accounts to move faster, that is fine for the preview phase. Do Steps 1–5 with your own GitHub and Netlify accounts, send the client the preview link, and follow **[Handing over to the client](#handing-over-to-the-client)** near the end of this guide when they are ready. Starting under the client's accounts saves that later step.

---

## Step 1 — Put the code on GitHub (10 min)

> **Why public.** On Netlify's Free plan a private repository only builds commits made by one person, the owner of the Netlify account. A commit from anyone else — the client editing in the panel, or the developer after the handover — is stopped with "Build blocked: Unrecognized Git contributor". A public repository has no such limit. The alternative is Netlify Pro. Nothing secret lives in the repository: keys go in Netlify's environment variables and form messages stay in Netlify. If the repository is ever switched from private to public while linked, Netlify keeps treating it as private until you link it again: **Project configuration → Developer settings → Repository → Manage repository → Link to a different repository**, and pick the same one.

1. Sign in to [github.com](https://github.com) (client's account, per Step 0).
2. Click **+** (top right) → **New repository**.
   - Name: `milica-uzelac-sajt`
   - Visibility: **Public** (see the note below)
   - Do **not** add a README, .gitignore or license (the project already has them).
   - Click **Create repository**.
3. On your computer, open a terminal in the project folder. Git is already initialized there; nothing is committed yet. Run:

```bash
git add .
```

```bash
git commit -m "Prva verzija sajta"
```

```bash
git remote add origin https://github.com/VLASNIK/milica-uzelac-sajt.git
```

```bash
git push -u origin main
```

Replace `VLASNIK` with the GitHub username that owns the repository. The first push asks you to sign in to GitHub in the browser.

4. If the repository is under the client's account: repository **Settings → Collaborators → Add people** → your GitHub username.

---

## Step 2 — Tell the CMS which repository to use (2 min)

Open [`public/admin/config.yml`](../public/admin/config.yml) and change one line near the top:

```yaml
  repo: VLASNIK/milica-uzelac-sajt
```

You will set `site_url` and `display_url` in Step 6 when the domain is known. Commit and push:

```bash
git commit -am "CMS: naziv repozitorijuma"
```

```bash
git push
```

---

## Step 3 — Deploy on Netlify (15 min)

1. Go to [app.netlify.com](https://app.netlify.com) and sign up (client's account, per Step 0).
2. **Add new project → Import an existing project → GitHub**. Authorize Netlify and choose the `milica-uzelac-sajt` repository.
3. Build settings are read from [`netlify.toml`](../netlify.toml) automatically. You should see:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy**. After about a minute you get an address like `https://random-name-123.netlify.app`.
5. Rename it: **Project configuration → General → Project details → Change project name** → e.g. `milica-uzelac` → the address becomes `https://milica-uzelac.netlify.app`.

**This address is the preview you share with the client.** It is not findable on Google: indexing is switched off in the site settings and `robots.txt` blocks search engines until you turn it on.

### About Netlify's free plan (read this once)

Netlify's Free plan includes **300 credits per month**, and each production deploy costs **15 credits** — so about **20 publishes per month**. Bandwidth and requests also use credits, though a small site uses very little. Form submissions are free and unlimited. If the credits run out on the Free plan, the site is **paused until the next month**.

**Update 23 Nov 2026:** the developer's team is on the **Pro plan** (3,000 credits a month, $20, billing period from the 23rd), so the Free-plan limit no longer applies while the site is hosted there. The numbers above matter again only if the site moves to a Free-plan account of the client's (Path B below).

That is why the CMS is set up so that saving does *not* publish each time: the client clicks **Save** as often as they like and publishes several changes at once (see Step 5). For a client who publishes often, the **Personal plan** (1,000 credits, about $9/month at the time of writing) removes the worry. Check current numbers at netlify.com/pricing before deciding.

---

## Step 4 — Give the client a login to the CMS (20 min)

The CMS signs people in with their GitHub account. Netlify acts as the go-between, so you register one "OAuth app" on GitHub and paste its two keys into Netlify.

### 4a. Register the OAuth app on GitHub

1. On GitHub: profile picture → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Fill in:
   - **Application name:** `Milica Uzelac CMS`
   - **Homepage URL:** `https://milica-uzelac.netlify.app` (the real domain later)
   - **Redirect URI** (older GitHub screens call it "Authorization callback URL"): `https://api.netlify.com/auth/done` ← must be exactly this
   - Leave **Allow wildcard matching** and **Enable Device Flow** unticked.
   - Untick **Expire user access tokens**. The panel gets a classic, non-expiring sign-in through Netlify; with expiring tokens the client would likely be signed out every few hours.
3. Click **Register application**.
4. Copy the **Client ID**. Click **Generate a new client secret** and copy it too — it is shown only once.

### 4b. Add the keys to Netlify

1. Netlify → your project → **Project configuration → Security → OAuth**. (This is *not* the "Identity" section.)
2. **Authentication providers → Install provider → GitHub**.
3. Paste the Client ID and Client secret → **Install**.

### 4c. Test the login

1. Open `https://milica-uzelac.netlify.app/admin/`.
2. Click **Sign In with GitHub** and approve.
3. You should see the collections: Blog, Radionice, Programi, Utisci klijenata, Stranice, Pravne stranice, Podešavanja.

### 4d. Who can log in

Anyone whose GitHub account has **write access to the repository**. If the client owns the repository, they already can. To add another editor: repository **Settings → Collaborators → Add people**.

> **Simpler alternative without OAuth:** on the login screen, **Sign In with Token** accepts a GitHub personal access token (GitHub → Settings → Developer settings → Fine-grained tokens → repository access: only this repository → Permissions: *Contents: Read and write*). Useful for a quick test, but tokens expire and are harder for a non-technical client, so use 4a–4c for the real setup.

---

## Step 5 — Set up publishing from the CMS (5 min)

In `config.yml` the option `skip_ci: true` means:

- **Save** stores the change in GitHub but does **not** rebuild the site (no Netlify credits used).
- **Save and Publish** (the arrow next to Save) stores the change **and** rebuilds the site.

- **Publish Changes** (the button in the CMS header) rebuilds the site with **everything saved so far**, without opening an entry.

**How Publish Changes reaches Netlify (set up 27 Nov 2026).** The button does not talk to Netlify. It sends GitHub a `repository_dispatch` event of type `sveltia-cms-publish`, and by itself that does nothing: on 27 Nov the client saved a day of work with **Save**, clicked **Publish Changes**, and no deploy started. Three parts now pass the click on:

1. A Netlify build hook: **Project configuration → Build & deploy → Continuous deployment → Build hooks**, name `CMS (Publish Changes)`, branch `main`.
2. Its URL stored as the GitHub Actions secret `NETLIFY_BUILD_HOOK`: repository **Settings → Secrets and variables → Actions**.
3. The workflow `.github/workflows/objava-iz-panela.yml`, which runs on that event and calls the hook.

It works for every editor in every browser, with nothing to set up on their computer. Each click is one deploy (15 credits), even when nothing changed, so click once. A click shows up in the repository's **Actions** tab within seconds and in Netlify's deploy list as "Objava iz panela (Publish Changes)".

The hook URL is a secret: the repository is public, and anyone who has the URL can start deploys and spend credits. Never commit it. If it leaks, delete the hook in Netlify, add a new one and update the secret.

**After a handover to the client's accounts (Path B):** the hook belongs to the Netlify project, so create a new one in her project and set the secret again in the transferred repository. Repository secrets do not travel with a transfer.

If you would rather have every Save publish immediately (simpler for the client, but uses a deploy each time), change `skip_ci: true` to `skip_ci: false` in `config.yml`.

---

## Step 6 — Connect the real domain (15 min + waiting)

1. If the client has no domain yet: `.rs` domains are registered through an accredited Serbian registrar (list at rnids.rs); `.com` through any registrar. **Register it in the client's name and e-mail.**
2. Netlify → **Domain management → Add a domain** → type the domain (e.g. `milicauzelac.rs`) → **Verify → Add domain**.
3. Netlify shows the DNS records to create. At the registrar's DNS panel add:
   - For `www`: a **CNAME** record → `milica-uzelac.netlify.app`
   - For the bare domain: the **A / ALIAS** record Netlify shows on that screen (copy the value from Netlify — do not use an IP address from an old tutorial).
   - Alternative: switch the domain's nameservers to Netlify DNS, which the same screen offers; then Netlify manages all records.
4. Wait for DNS to update (minutes to a few hours). Netlify then issues the **HTTPS certificate automatically** (Let's Encrypt) and renews it by itself.
5. In **Domain management**, set the primary domain (with or without `www`) — Netlify redirects the other one to it.
6. Update the site to the final address:
   - [`public/admin/config.yml`](../public/admin/config.yml): `site_url` and `display_url`
   - GitHub OAuth app (Step 4a): Homepage URL
   - Commit and push.

Canonical links, the sitemap and `robots.txt` pick up the primary domain on their own — Netlify passes it to the build.

---

## Step 7 — Turn on form notifications (5 min) — done 23 Nov 2026

Forms are detected automatically on the first deploy. Notifications are set on the project's **Forms** page, **Submission notifications** tab. See [04-forms-newsletter-booking.md](04-forms-newsletter-booking.md) for e-mail notifications, spam protection, confirmation e-mails and the newsletter.

---

## Step 8 — Launch

When the content is final, follow [05-launch-checklist.md](05-launch-checklist.md). The last switch is in the CMS:

**Podešavanja → Opšta podešavanja → SEO (Google) → "Dozvoli Google-u da prikazuje sajt" → on → Save and Publish.**

---

## How the client makes changes (so you can explain it)

1. The client opens `https://DOMAIN/admin/` and signs in with GitHub.
2. They pick a section (e.g. **Blog → New Tekst**, or **Stranice → Početna**), edit the fields and upload photos.
3. **Save** stores the change. **Save and Publish** puts it live in about a minute.
4. Behind the scenes, each save is a *commit* in the GitHub repository — a dated, named record of exactly what changed. Nothing is ever lost: any earlier version of any text can be restored from the repository history (**Commits** on GitHub).
5. Netlify sees the new commit, rebuilds the site and swaps it in. If a build fails, the old version simply stays online.

The client's own handbook, in Serbian, is [UPUTSTVO-ZA-UREDJIVANJE.md](UPUTSTVO-ZA-UREDJIVANJE.md).

### Getting the client's changes onto your computer

When the client edits through the CMS, GitHub has newer content than your local folder. Before you work on the site, always run:

```bash
git pull
```

### Making your own changes

Edit files, check at `http://localhost:4321`, then:

```bash
git add .
```

```bash
git commit -m "Opis izmene"
```

```bash
git push
```

Netlify publishes it automatically.

---

## Two ways to go live — decide before the domain is connected

Everything done so far (GitHub repository, Netlify project, CMS login, form notifications, tests) is valid for both paths. The difference is only *whose* Netlify account hosts the site after launch.

| | **Path A — keep hosting in your Netlify team** | **Path B — full handover to the client's accounts** |
| --- | --- | --- |
| Who pays Netlify | You (Pro plan, already paid; this site shares it) | The client (Free or a paid plan in her name) |
| Work to go live | Connect the domain (Step 6). Nothing else is redone. | Step 6 **plus** the whole "Handing over" section below (about an hour on a call) |
| Form notifications | Already set: yours and the client's | Must be created again in her account |
| Brevo keys, build hook, OAuth app | Stay as they are | Must be created again in her account |
| Repository | Can stay under `zerotoonebros` with the client as collaborator, or be transferred later | Transferred to the client |
| What the client owns | Domain, content, the code (public repository), all third-party accounts (Brevo, Google, calendar) | Everything, including hosting |
| Risk | The site depends on your account and your payment; needs a written agreement | None after the handover, but more setup steps and the Free-plan credit limit |
| Changing later | Path A can become Path B at any time by following the handover section | — |

The brief (section 10) says the client must own everything, so **Path B is the end state the brief asks for**. Path A is fine as an interim or as a paid hosting arrangement if the client agrees to it in writing.

### Path A — keep hosting in your team

1. **Domain:** follow Step 6 exactly as written. The domain is registered in the client's name; only its DNS points at your Netlify project.
2. **Addresses in the code:** Step 6, point 6 (`site_url`, `display_url`, OAuth app Homepage URL).
3. **Notifications:** the client's e-mail already receives every form submission. On launch day remove *your* e-mail from Submission notifications, so that real visitors' messages go only to her (the privacy policy names her as the one handling the data).
4. **Third-party accounts** (Brevo, calendar, Google) are still created in the client's name; their keys are pasted into *your* Netlify project's environment variables. That is normal: the keys can be moved to another project at any time.
5. **Repository (optional):** if you transfer it to the client now, relink it in Netlify afterwards (Developer settings → Repository → Manage repository → Link to a different repository, as on 20 Nov) and update `repo:` in `public/admin/config.yml`. Keep it public.
6. **Written agreement** (brief section 8): who pays for hosting and how much, who renews the domain, who edits content, how the client can leave (answer: Path B at any time; everything is in the public repository, so nothing is locked in), and what happens if you stop maintaining the site.
7. **Privacy policy:** the hosting provider (Netlify) is already listed; have the lawyer confirm whether the developer, as the account holder, needs a mention as well.

### Path B — full handover

Follow the "Handing over to the client" section below. If a custom domain is already connected to your project (Path A first), the order of point 6 there matters: remove the domain from your project, add it to hers, and keep the same `netlify.app` name on her project if possible so the DNS records do not change.

---

## Handing over to the client

Use this if you ran the preview under your own accounts. Plan about an hour on a call with the client. The site stays online on your Netlify project until the last step, so there is no downtime.

**Before the call — the client creates** (with their own e-mail): a GitHub account and a Netlify account. Ask them to turn on two-factor authentication on GitHub.

1. **Transfer the repository.** On GitHub, in your repository: **Settings → Danger Zone → Transfer ownership** → type the client's GitHub username. The client gets an e-mail and must accept it. The whole history moves with the repository, and GitHub redirects the old address to the new one. Leave the repository **public** (see the note under Step 1), or the developer's commits will not build.
2. **Get your access back.** After the transfer the repository is theirs and you are no longer in it. The client opens **Settings → Collaborators → Add people** and adds your username.
3. **Point your computer at the new address:**

```bash
git remote set-url origin https://github.com/KLIJENT/milica-uzelac-sajt.git
```

4. **Update the CMS config.** In [`public/admin/config.yml`](../public/admin/config.yml) change `repo:` to `KLIJENT/milica-uzelac-sajt`, then commit and push.
5. **Create the Netlify project in the client's account.** Signed in as the client, repeat **Step 3** (import the repository), **Step 4** (a new GitHub OAuth app under the *client's* GitHub, installed in the *client's* Netlify), **Step 5** (build hook) and **Step 7** (form notifications). If you set up Brevo, add the environment variables again too — they do not move between accounts.
6. **Move the address.** A `netlify.app` name can belong to only one project. Either give the client's project a different name, or rename/delete yours first so the name is free. If a custom domain is already connected, remove it from your project and add it to theirs (Step 6); DNS records stay the same when the `netlify.app` name stays the same.
7. **Check, then delete yours.** Open the client's site, log in to `/admin/` as the client, publish one small change, send one test form. Then delete your Netlify project and your GitHub OAuth app.

**What does not move:** form submissions stored in your Netlify project. Export them first (**Forms → the form → Download CSV**) if there are real ones.

Netlify also has a setting for transferring a project to another team. I have not verified its current conditions, so the steps above use a fresh import, which always works and takes about ten minutes.

**A note on the preview phase:** while the site is under your accounts, form messages and any e-mail notifications go where *you* set them. Tell the client the preview's forms are for testing, and do not collect real visitors' data there — the privacy policy names the client, not you, as the one handling it.

---

## Backups, security, maintenance (brief section 8)

| Topic | How it is covered |
| --- | --- |
| HTTPS / SSL | Automatic on Netlify, renewed automatically |
| Backup | The whole site and every past version are in the GitHub repository. Your local folder is a second copy. Form submissions are stored in Netlify (export as CSV from the Forms tab). |
| Admin protection | Login only through GitHub. Turn on **two-factor authentication** on the client's GitHub account (GitHub → Settings → Password and authentication). |
| Updates | There is no server software or plugin to update. Dependencies only matter when you rebuild; run `npm update` a couple of times a year and check the site still builds. |
| Spam protection | Honeypot field + Netlify's spam filter — see guide 4 |
| Security headers | Set in [`netlify.toml`](../netlify.toml) |
| Maintenance agreement | Agree with the client who handles: domain renewal (yearly), Netlify plan, content edits, and a yearly dependency update. Put it in writing. |

## If something goes wrong

| Symptom | Likely cause and fix |
| --- | --- |
| Netlify deploy fails | Open the deploy log. Usually a content field has an invalid value (e.g. an empty required date). Fix it in the CMS or revert the commit on GitHub. The live site is unaffected. |
| CMS login window closes with an error | The callback URL in the GitHub OAuth app is not exactly `https://api.netlify.com/auth/done`, or the provider is not installed in Netlify. |
| CMS shows "repository not found" | `repo:` in `config.yml` is wrong, or the GitHub account has no write access to the repository. |
| Change saved but not visible | It was saved with **Save** only. Click **Publish Changes** in the header (or use **Save and Publish** on an entry), then wait a minute and hard-refresh (Ctrl+F5). |
| **Publish Changes** clicked, no deploy in Netlify | Open the repository's **Actions** tab. No run: the editor has no write access, or the workflow file is missing from `main`. Failed run: the secret `NETLIFY_BUILD_HOOK` is missing or the hook was deleted in Netlify (Step 5). |
| Photo does not appear | The file must be uploaded through the CMS (it lands in `src/assets/uploads/`). Very large files (over 10 MB) are rejected. |
| Site says "Site not available" | Netlify credits ran out for the month (relevant on the Free plan; the developer's team is on Pro since 23 Nov 2026). Upgrade the plan or wait for the monthly reset. |
