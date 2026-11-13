// Netlify funkcija koja se pokreće SAMA posle svake uspešno poslate forme (ime fajla je važno:
// „submission-created“ je događaj koji Netlify prepoznaje).
//
// Šta radi:
//   1. Šalje automatsku potvrdu prijema osobi koja je popunila formu.
//   2. Ako je forma „newsletter“ ili je u drugoj formi štiklirana prijava na newsletter,
//      dodaje kontakt u Brevo listu (uz double opt-in ako je podešen šablon).
//
// Dok promenljive okruženja (BREVO_API_KEY…) nisu unete u Netlify, funkcija ne radi ništa —
// forme i dalje normalno stižu na e-mail preko Netlify obaveštenja.
// Podešavanje: docs/04-forms-newsletter-booking.md
//
// NAPOMENA: ova funkcija nije mogla da bude isprobana pre objave sajta (potrebni su pravi ključevi).
// Posle podešavanja obavezno pošalji probnu poruku sa svake forme.

const BREVO = 'https://api.brevo.com/v3';

const potvrde = {
  kontakt: {
    predmet: 'Tvoja poruka je stigla',
    tekst: 'Hvala što si mi pisala. Tvoja poruka je stigla i odgovoriću ti lično, najčešće u roku od dva radna dana.',
  },
  zakazivanje: {
    predmet: 'Zahtev za uvodni razgovor je primljen',
    tekst: 'Hvala na interesovanju za uvodni razgovor. Uskoro ti se javljam sa predlogom termina.',
  },
  'prijava-radionica': {
    predmet: 'Prijava na radionicu je primljena',
    tekst: 'Hvala na prijavi! Tvoja prijava je zabeležena. Uskoro ti šaljem potvrdu mesta i sve detalje o radionici.',
  },
  'upit-program': {
    predmet: 'Zabeležila sam tvoje interesovanje',
    tekst: 'Hvala na interesovanju za program. Javiću ti se čim budem imala nove informacije.',
  },
};

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function htmlPoruke({ ime, tekst, dodatak, potpis, sajt }) {
  return `<!doctype html><html lang="sr"><body style="margin:0;background:#F8F0E9;font-family:Arial,Helvetica,sans-serif;color:#1B2545">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F0E9;padding:32px 16px"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFBF7;border-radius:24px;padding:40px 32px">
      <tr><td style="font-family:Georgia,serif;font-size:26px;line-height:1.25;padding-bottom:16px">Zdravo${ime ? ', ' + esc(ime) : ''}!</td></tr>
      <tr><td style="font-size:16px;line-height:1.65;padding-bottom:16px">${esc(tekst)}</td></tr>
      ${dodatak ? `<tr><td style="font-size:15px;line-height:1.6;padding:16px 20px;background:#E6ECF6;border-radius:12px">${dodatak}</td></tr>` : ''}
      <tr><td style="font-size:16px;line-height:1.65;padding-top:24px">Srdačno,<br><strong>${esc(potpis)}</strong></td></tr>
      <tr><td style="font-size:13px;line-height:1.5;color:#49526F;padding-top:28px;border-top:1px solid #E7DCCF">
        Ovu poruku dobijaš jer si popunila formu na sajtu <a href="${sajt}" style="color:#2B4A9B">${sajt.replace(/^https?:\/\//, '')}</a>.
        Ako to nisi bila ti, slobodno zanemari ovaj e-mail.
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

async function brevo(putanja, telo, kljuc) {
  const odgovor = await fetch(BREVO + putanja, {
    method: 'POST',
    headers: { 'api-key': kljuc, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(telo),
  });
  if (!odgovor.ok) {
    // Bez ličnih podataka u logu — samo status i poruka servisa
    console.error(`Brevo ${putanja} → ${odgovor.status}: ${(await odgovor.text()).slice(0, 300)}`);
  }
  return odgovor.ok;
}

export const handler = async (event) => {
  const kljuc = process.env.BREVO_API_KEY;
  const posiljalac = process.env.MEJL_POSILJAOCA;
  if (!kljuc || !posiljalac) return { statusCode: 200, body: 'Brevo nije podešen — preskačem.' };

  let payload;
  try {
    payload = JSON.parse(event.body).payload;
  } catch {
    return { statusCode: 400, body: 'Neispravan zahtev.' };
  }

  const forma = payload.form_name;
  const d = payload.data ?? {};
  const email = String(d.email ?? '').trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { statusCode: 200, body: 'Nema e-mail adrese.' };

  const ime = String(d.ime ?? '').trim().split(/\s+/)[0] ?? '';
  const potpis = process.env.IME_POSILJAOCA || 'Milica Uzelac';
  const sajt = process.env.URL || 'https://tvojdomen.rs';

  // 1) Automatska potvrda prijema
  const potvrda = potvrde[forma];
  if (potvrda) {
    const dodatak = d.radionica
      ? `<strong>Radionica:</strong> ${esc(d.radionica)}${d.termin ? `<br><strong>Termin:</strong> ${esc(d.termin)}` : ''}`
      : d.program
        ? `<strong>Program:</strong> ${esc(d.program)}`
        : '';
    await brevo(
      '/smtp/email',
      {
        sender: { name: potpis, email: posiljalac },
        to: [{ email, name: String(d.ime ?? '').trim() || undefined }],
        replyTo: { email: posiljalac, name: potpis },
        subject: potvrda.predmet,
        htmlContent: htmlPoruke({ ime, tekst: potvrda.tekst, dodatak, potpis, sajt }),
      },
      kljuc,
    );
  }

  // 2) Newsletter — samo uz izričitu saglasnost
  const zeliNewsletter = forma === 'newsletter' ? d.saglasnost_newsletter === 'da' : d.newsletter === 'da';
  const lista = Number(process.env.BREVO_LISTA_ID);
  if (zeliNewsletter && lista) {
    const sablon = Number(process.env.BREVO_DOI_SABLON_ID);
    if (sablon) {
      await brevo(
        '/contacts/doubleOptinConfirmation',
        {
          email,
          attributes: ime ? { FIRSTNAME: ime } : {},
          includeListIds: [lista],
          templateId: sablon,
          redirectionUrl: `${sajt}/hvala/`,
        },
        kljuc,
      );
    } else {
      await brevo(
        '/contacts',
        { email, attributes: ime ? { FIRSTNAME: ime } : {}, listIds: [lista], updateEnabled: true },
        kljuc,
      );
    }
  }

  return { statusCode: 200, body: 'OK' };
};
