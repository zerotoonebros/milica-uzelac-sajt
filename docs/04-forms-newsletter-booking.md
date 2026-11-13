# 4. Forms, confirmation e-mails, newsletter, booking

Covers the functional items in section 3 of the brief.

## What exists on the site

| Form | Name in Netlify | Where | Fields |
| --- | --- | --- | --- |
| Contact / message box | `kontakt` | Footer of every page, and `/kontakt/` | ime, email, poruka, saglasnost, newsletter (optional) |
| Newsletter | `newsletter` | Footer of every page | ime, email, saglasnost_newsletter (required) |
| Workshop registration | `prijava-radionica` | Each workshop page while registrations are open | radionica, termin, ime, email, telefon, poruka, saglasnost, newsletter |
| Booking request | `zakazivanje` | `/zakazivanje/` while no calendar is connected | ime, email, telefon, tema, termini, saglasnost |
| Program inquiry | `upit-program` | Each program page while it has no purchase link | program, ime, email, saglasnost, newsletter |

Every form has: Serbian validation messages, a clear success message, a required consent box linking to the privacy policy, and a hidden trap field for spam bots. On `localhost` forms only simulate sending and say so — they start working once the site is on Netlify.

---

## Step 1 — Check the forms arrived in Netlify (after first deploy)

1. Netlify → your project → **Forms**. If asked, click **Enable form detection**, then trigger a new deploy (Deploys → Trigger deploy).
2. You should see the five form names from the table above.
3. Send a test message from the live preview site. It appears under **Forms → kontakt** within seconds.

## Step 2 — E-mail notifications to the client

Netlify → **Project configuration → Notifications → Form submission notifications → Add notification → Email notification**.

- Event: *New form submission*
- E-mail: the client's address
- Form: *Any form* (or add one notification per form to use different subject lines)

Each form sends a `subject` field, so e-mails arrive titled e.g. "Prijava na radionicu: Granice bez griže savesti".

## Step 3 — Spam protection

Already active, in two layers:

1. **Honeypot:** a hidden field (`vebsajt`) that people never see and bots fill in. Netlify discards those submissions.
2. **Netlify's spam filter** (Akismet) screens everything else. Flagged items land under *Forms → Spam submissions*, where real messages can be rescued.

If spam still gets through, add a third layer: Netlify supports reCAPTCHA on forms. I left it off because it adds a Google script and a puzzle for real visitors; turn it on only if needed.

## Step 4 — Automatic confirmation e-mail + newsletter (Brevo)

Netlify notifies the *owner*, but it does not send a confirmation to the *visitor*, and it is not a newsletter tool. One free service covers both: **Brevo** (free plan: 300 e-mails a day at the time of writing). The code is already written — [`netlify/functions/submission-created.mjs`](../netlify/functions/submission-created.mjs) — and stays dormant until you add the keys.

> **Honest status:** I tested this function's logic with the network stubbed out, but not against the real Brevo service — that needs the client's account. After the setup below, send a test through every form.

1. Create a Brevo account with the **client's** e-mail: [brevo.com](https://www.brevo.com).
2. **Verify the sender:** Senders, Domains & Dedicated IPs → add the address confirmations will come from (ideally on the client's own domain, e.g. `kontakt@DOMAIN`). For good deliverability, also **authenticate the domain** — Brevo shows DNS records (DKIM, DMARC) to add at the registrar.
3. **Create the list:** Contacts → Lists → New list → `Newsletter`. Note its **ID** (a number).
4. **Double opt-in template** (recommended — it is the proof of consent): Campaigns → Templates → new template → it must contain a confirmation button whose link is `{{ doubleoptin }}`, and the template must be tagged `optin`. Activate it and note its **ID**.
5. **API key:** account menu → SMTP & API → API Keys → Generate → copy it.
6. Netlify → **Project configuration → Environment variables → Add a variable**:

| Key | Value |
| --- | --- |
| `BREVO_API_KEY` | the API key (mark as *secret*) |
| `MEJL_POSILJAOCA` | the verified sender address |
| `IME_POSILJAOCA` | `Milica Uzelac` |
| `BREVO_LISTA_ID` | the list ID |
| `BREVO_DOI_SABLON_ID` | the double opt-in template ID (leave empty to add contacts without a confirmation e-mail) |

7. Deploys → **Trigger deploy** (environment variables apply from the next deploy).
8. **Test every form** with your own address. Expected: a confirmation e-mail for contact, booking, workshop and program forms; a "confirm your subscription" e-mail for the newsletter; the contact appears in the Brevo list after clicking the confirmation link.
9. If nothing arrives: Netlify → **Logs → Functions → submission-created** shows what Brevo answered (no personal data is logged, only the status and Brevo's message).

**What the function does, in plain words:** Netlify calls it by itself after each accepted submission. It sends the visitor a short branded confirmation, and — only if they ticked the newsletter consent — adds them to the Brevo list. Confirmation texts are at the top of the file and easy to edit.

**Prefer MailerLite or Mailchimp?** Then keep steps 1–3 of this guide, skip Brevo, and change only the two `brevo(...)` calls in the function to that service's API. The forms themselves do not change.

**Sending the newsletter:** the client writes and sends campaigns inside Brevo. Every campaign automatically includes the unsubscribe link the law requires. The blog's RSS feed (`/rss.xml`) can be used in Brevo to pull the latest posts into a campaign.

## Step 5 — Booking calendar

Until a calendar is connected, `/zakazivanje/` shows a "Zatraži termin" form, so booking works from day one (the client replies by e-mail to agree a time).

To let visitors pick a slot themselves:

1. Create an account (client's e-mail) at **Cal.com** (free for one person, open source) or **Calendly** (free for one event type).
2. Connect the client's calendar (Google / Outlook) so busy times are blocked, and connect Zoom or Google Meet so each booking gets a video link.
3. Create the event type: *Uvodni razgovor*, with its duration, availability, minimum notice (e.g. 24 h) and buffer between calls. Set the language to Serbian if offered and write the confirmation text.
4. Copy the event's public link, e.g. `https://cal.com/milica/uvodni-razgovor`.
5. CMS → **Podešavanja → Opšta podešavanja → Zakazivanje uvodnog razgovora → Link kalendara** → paste → Save and Publish.

The form on `/zakazivanje/` is replaced by a **Prikaži kalendar** button. The calendar loads only when the visitor clicks it, so nothing is sent to the calendar company before that, and the page stays fast.

Then verify the `booking_complete` event as described in [03-analytics.md](03-analytics.md), Step 5, and name the calendar service in the privacy policy.

## PDF downloads (brief: "later")

Ready when needed, no code required:

1. In the CMS, open any text field that uses the rich editor (blog post, workshop, program) and add a link to the file — or upload the PDF to `public/` (e.g. `public/materijali/vodic.pdf`) and link to `/materijali/vodic.pdf`.
2. Clicks on `.pdf` links are tracked automatically as `file_download`.

To collect an e-mail before the download (a "lead magnet"), the simplest route is a Brevo automation: sign-up form → automatic e-mail containing the PDF link. That keeps consent and delivery in one place.

## Selling programs (e-book, masterclass)

Each program has a **Link za kupovinu / pristup** field. While it is empty, the program page shows a "Javi mi kada bude dostupno" form — useful for measuring interest before launch. When the program is ready, paste the checkout or course link (e.g. from a payment or course platform the client chooses) and set the status to *Dostupno*; the form is replaced by a "Želim ovaj program" button.

Payments are deliberately not built into the site: taking card payments in Serbia needs a contract with a bank or payment institution, and course platforms already solve delivery, invoices and access. When the client picks a provider, only the link changes.
