# 3. Analytics — GTM, GA4, Search Console, Meta Pixel

Covers sections 5, 6, 7 and 11 of the brief. Everything on the **site side is already built**; this guide is the account setup, which needs the client's Google account.

Menu names in Google's tools shift from time to time; look for the closest match if a label differs.

## What is already in the site

| Piece | Status | Where |
| --- | --- | --- |
| Cookie banner: accept / reject / customize, changeable later | Built | [`src/components/Kolacici.astro`](../src/components/Kolacici.astro) |
| Google Consent Mode v2, everything **denied** by default | Built | [`src/layouts/Osnovni.astro`](../src/layouts/Osnovni.astro) |
| Tag Manager loads **only after consent** | Built | same file |
| Events pushed to the data layer (table below) | Built | [`src/scripts/sajt.ts`](../src/scripts/sajt.ts) |
| No personal data in events (no names, e-mails, messages) | Built | same file |
| Field for the GTM ID and Search Console code | In the CMS | Podešavanja → Opšta podešavanja → Analitika i kolačići |

**How consent works here.** Nothing from Google or Meta loads when a visitor arrives. If they accept analytics and/or marketing cookies, the site records the choice, updates Consent Mode and only then loads Tag Manager. If they decline, Tag Manager never loads. This is the strict ("basic") version of Consent Mode, which is the safe reading of the Serbian law cited in the brief. The trade-off: visitors who decline are not counted at all, so GA4 numbers will be lower than real traffic.

## Events the site sends

| Event | Fires when | Parameters |
| --- | --- | --- |
| `page_view` | Each page load | automatic (GA4) |
| `form_start` | First keystroke in any form | `form_name` |
| `generate_lead` | Contact form or program inquiry sent successfully | `form_name`, `naziv_stavke` (program) |
| `booking_click` | Click on any "Zakaži uvodni razgovor" button | `mesto` (header, hero, footer…), `tekst_dugmeta` |
| `booking_request` | "Zatraži termin" form sent (used while no calendar is connected) | `form_name` |
| `booking_complete` | The embedded calendar reports a confirmed booking | — |
| `newsletter_signup` | Newsletter form sent, or newsletter box ticked in another form | `form_name` |
| `workshop_signup` | Workshop registration sent | `form_name`, `naziv_stavke` (workshop) |
| `file_download` | Click on a PDF / document link | `file_name`, `file_extension` |
| `email_click` | Click on the e-mail address | — |
| `phone_click` | Click on the phone number | — |
| `social_click` | Click on a social network icon | `mesto` (network) |
| `announcement_click` | Click on the link in the announcement bar under the header | `mesto` (`baner`), `tekst_dugmeta` |
| `kolacici_izbor` | Visitor saves a cookie choice | `analitika`, `marketing` (true/false) |

`form_name` values: `kontakt`, `newsletter`, `prijava-radionica`, `zakazivanje`, `upit-program`.

`booking_click` and `booking_complete` are separate on purpose, as the brief asks: a click is interest, a completed booking is a result. **`booking_complete` could not be tested before a real calendar is connected** — verify it in Step 5.

---

## Step 1 — Create the accounts (client's Google account)

All under the **client's** Google account; they then add you.

1. **Google Analytics:** [analytics.google.com](https://analytics.google.com) → Start measuring → account name `Milica Uzelac` → property name `Sajt` → time zone **Serbia**, currency **RSD** → platform **Web** → enter the site URL → you get a **Measurement ID** like `G-XXXXXXXXXX`.
2. **Google Tag Manager:** [tagmanager.google.com](https://tagmanager.google.com) → Create account → container name = the domain → target platform **Web** → you get a **Container ID** like `GTM-XXXXXXX`. Close the popup with the code snippets — the site already contains the equivalent code.
3. **Give yourself access:** GA4 → Admin → Account access management → add your e-mail as *Editor*. GTM → Admin → User management → add your e-mail with *Publish* permission.

## Step 2 — Connect GTM to the site

In the CMS: **Podešavanja → Opšta podešavanja → Analitika i kolačići → Google Tag Manager ID** → paste `GTM-XXXXXXX` → **Save and Publish**.

That is the only change the site needs. Everything else happens inside GTM.

## Step 3 — Configure GTM

### 3a. Consent settings

GTM → Admin → Container settings → tick **Enable consent overview**. The site already sends the consent state, and Google's own tags (GA4, Ads) respect it automatically.

### 3b. Google tag (GA4 base)

Tags → New → **Google Tag** → Tag ID: `G-XXXXXXXXXX` → Trigger: **Initialization – All Pages** → name it `GA4 – Google tag` → Save.

### 3c. Data layer variables

Variables → User-defined variables → New → **Data Layer Variable**. Create one for each:

| Variable name | Data Layer Variable Name |
| --- | --- |
| `dlv – form_name` | `form_name` |
| `dlv – mesto` | `mesto` |
| `dlv – naziv_stavke` | `naziv_stavke` |
| `dlv – file_name` | `file_name` |

### 3d. One trigger for all site events

Triggers → New → **Custom Event** → Event name:

```
^(form_start|generate_lead|booking_click|booking_request|booking_complete|newsletter_signup|workshop_signup|file_download|email_click|phone_click|social_click)$
```

Tick **Use regex matching** → name it `CE – događaji sajta` → Save.

### 3e. One GA4 event tag for all of them

Tags → New → **Google Analytics: GA4 Event** →

- Measurement ID: `G-XXXXXXXXXX`
- Event name: `{{Event}}` (the built-in variable — it passes the event name through unchanged)
- Event parameters:

| Parameter | Value |
| --- | --- |
| `form_name` | `{{dlv – form_name}}` |
| `mesto` | `{{dlv – mesto}}` |
| `naziv_stavke` | `{{dlv – naziv_stavke}}` |
| `file_name` | `{{dlv – file_name}}` |

- Trigger: `CE – događaji sajta`
- Name: `GA4 – događaji sajta` → Save.

### 3f. Test, then publish

1. GTM → **Preview** → enter the site URL. A debug panel opens next to the site.
2. On the site, **accept cookies** (otherwise nothing loads — that is correct behaviour).
3. Click a booking button, start and send a form, click the e-mail. Each should appear in the debug panel's left column and show the GA4 tag as *Fired*.
4. In GA4: Admin → **DebugView** — the same events should appear within seconds.
5. Also test the opposite: open the site in a private window, choose **Samo neophodni**, and confirm in the browser's Network tab that no request goes to `googletagmanager.com` or `google-analytics.com`.
6. Back in GTM → **Submit → Publish**.

## Step 4 — GA4 settings

1. **Key events** (Admin → Data display → Key events → New key event). Add: `generate_lead`, `booking_complete`, `booking_request`, `workshop_signup`, `newsletter_signup`, `file_download`. An event can only be marked after GA4 has received it at least once, so do this after Step 3f.
2. **Custom dimensions** (Admin → Data display → Custom definitions → Create custom dimension), scope *Event*: `form_name`, `mesto`, `naziv_stavke`. Without this, the parameters are collected but not visible in reports.
3. **Data retention:** Admin → Data collection and modification → Data retention → set to **14 months**. Write the same number into the privacy policy (section 4).
4. **Enhanced measurement:** Admin → Data streams → your stream → leave on. Turn **Form interactions** *off* there — the site sends its own, more precise form events, and leaving both on would double count.
5. **Internal traffic:** Data streams → Configure tag settings → Define internal traffic → add the client's and your IP, so your own visits do not skew the numbers.

## Step 5 — `booking_complete` once the calendar is connected

After the calendar link is set (guide 4), make one real test booking on `/zakazivanje/` with GTM Preview open and cookies accepted. `booking_complete` should fire when the calendar shows its confirmation screen.

If it does not: calendar tools change their embed messages. The listener is at the bottom of [`src/pages/zakazivanje.astro`](../src/pages/zakazivanje.astro). As a dependable fallback, both Cal.com and Calendly can redirect to a page after booking — set that to `https://DOMAIN/hvala/?zakazano=1` and create a GTM *Page View* trigger on that URL which fires a `booking_complete` event.

---

## Google Search Console (do this on day one)

1. [search.google.com/search-console](https://search.google.com/search-console) → Add property.
2. **Preferred — Domain property:** enter the bare domain → Google shows a TXT record → add it at the domain registrar's DNS panel → Verify. This covers every variant of the address.
3. **Alternative — URL prefix property:** choose "HTML tag" → copy only the value inside `content="…"` → CMS: **Podešavanja → Analitika i kolačići → Google Search Console — kod za verifikaciju** → Save and Publish → Verify.
4. Sitemaps → enter `sitemap-index.xml` → Submit.
5. Settings → Users and permissions → add your e-mail.

The sitemap only lists real pages once indexing is switched on in the site settings. Until then `robots.txt` blocks everything, so submit the sitemap **after** launch.

## Meta Pixel (later, when ads start)

The brief asks only that integration be foreseen. It is: the "Marketinški" cookie category already exists in the banner and maps to Consent Mode's `ad_storage`.

When the client starts advertising:

1. Meta Business Suite (client's account) → Events Manager → Connect data sources → Web → **Meta Pixel** → copy the Pixel ID.
2. GTM → Tags → New → Custom HTML → paste Meta's base pixel code → **Advanced settings → Consent settings → Require additional consent for tag to fire → `ad_storage`** → Trigger: All Pages.
3. Add a second Custom HTML tag for conversions, e.g. `fbq('track', 'Lead');`, with the trigger from 3d limited to `generate_lead|workshop_signup|booking_complete`, and the same consent requirement.
4. Add Meta to the privacy and cookie policies (the cookie policy already lists `_fbp`).
5. Test with the Meta Pixel Helper browser extension: no pixel requests before accepting marketing cookies, requests after.

## UTM links for Instagram, LinkedIn and newsletters

GA4 reads UTM tags automatically — no site work is needed. The client only has to use tagged links when sharing.

| Where the link is placed | Link |
| --- | --- |
| Instagram bio | `https://DOMAIN/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| Instagram story | `https://DOMAIN/?utm_source=instagram&utm_medium=social&utm_campaign=story` |
| Instagram, workshop post | `https://DOMAIN/rad-sa-mnom/grupne-radionice/NAZIV/?utm_source=instagram&utm_medium=social&utm_campaign=radionica-NAZIV` |
| LinkedIn post | `https://DOMAIN/?utm_source=linkedin&utm_medium=social&utm_campaign=objava` |
| Facebook ad | `https://DOMAIN/?utm_source=facebook&utm_medium=paid_social&utm_campaign=NAZIV-KAMPANJE` |
| Newsletter | `https://DOMAIN/blog/NAZIV/?utm_source=newsletter&utm_medium=email&utm_campaign=2027-01` |

Rules that keep reports clean: always lowercase, no spaces (use `-`), and always the same spelling for a source (`instagram`, never `Instagram` or `ig`). Google's free **Campaign URL Builder** makes these links without typing.

Where to read the results: GA4 → Reports → Acquisition → **Traffic acquisition** → set the dimension to *Session source / medium* or *Session campaign*. Add the *Key events* column to compare channels by sign-ups, not only visits.

## Monthly KPI review (brief section 11)

| KPI | Where in GA4 / Search Console |
| --- | --- |
| Total visitors | Reports → Acquisition → Overview (Users, Sessions) |
| Traffic sources | Acquisition → Traffic acquisition |
| Most visited pages | Engagement → Pages and screens |
| Organic search | Search Console → Performance (clicks, impressions, queries, position) |
| Lead conversion | Engagement → Events → `generate_lead` ÷ Users |
| Booking conversion | `booking_complete` (and `booking_request`) ÷ `booking_click` |
| Newsletter growth | `newsletter_signup` per month, compared with the list size in the newsletter tool |
| Workshop conversion | `workshop_signup` ÷ views of the workshop page |

A saved **Exploration** in GA4 (Explore → Free form) with these metrics saves the client from clicking through reports each month. Looker Studio can turn the same data into a one-page dashboard if they want something to glance at.
