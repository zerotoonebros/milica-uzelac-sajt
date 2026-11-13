// Ponašanje sajta u pregledaču: animacije pri skrolovanju, forme i merenje događaja.
// Namerno bez spoljnih biblioteka — nekoliko kilobajta ukupno.

type Podaci = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    __otkrijOK?: boolean;
    prati: (dogadjaj: string, podaci?: Podaci) => void;
  }
}

/* ---------- Merenje (GA4 preko Google Tag Managera) ----------
   Događaji se upisuju u dataLayer. Ako posetiteljka nije dala saglasnost,
   GTM se uopšte ne učitava i ništa se nikome ne šalje.
   VAŽNO: ovde se nikada ne šalju ime, e-mail, telefon ni sadržaj poruka. */
window.dataLayer = window.dataLayer || [];
window.prati = (dogadjaj, podaci = {}) => {
  window.dataLayer.push({ event: dogadjaj, ...podaci });
};

document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest<HTMLElement>('a, button');
  if (!link) return;

  const rucno = link.dataset.prati;
  if (rucno) {
    window.prati(rucno, {
      mesto: link.dataset.mesto,
      tekst_dugmeta: link.textContent?.trim().slice(0, 60),
    });
  }

  const href = link.getAttribute('href') ?? '';
  if (href.startsWith('mailto:')) window.prati('email_click');
  else if (href.startsWith('tel:')) window.prati('phone_click');
  else if (link.hasAttribute('download') || /\.(pdf|epub|zip|docx?|xlsx?)(\?|$)/i.test(href)) {
    window.prati('file_download', {
      file_name: href.split('/').pop()?.split('?')[0],
      file_extension: href.split('.').pop()?.split('?')[0],
    });
  }
});

/* ---------- Animacije pri skrolovanju ---------- */
const zaOtkrivanje = document.querySelectorAll<HTMLElement>('[data-otkrij]');
if ('IntersectionObserver' in window && zaOtkrivanje.length) {
  const posmatrac = new IntersectionObserver(
    (unosi) => {
      for (const unos of unosi) {
        if (unos.isIntersecting) {
          unos.target.classList.add('vidljivo');
          posmatrac.unobserve(unos.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  zaOtkrivanje.forEach((el) => posmatrac.observe(el));
} else {
  zaOtkrivanje.forEach((el) => el.classList.add('vidljivo'));
}
window.__otkrijOK = true;

/* ---------- Forme ---------- */
const poruke = {
  obavezno: 'Ovo polje je obavezno.',
  email: 'Unesi ispravnu e-mail adresu.',
  saglasnost: 'Potrebna je tvoja saglasnost da bismo nastavili.',
  kratko: 'Unos je prekratak.',
};

function porukaZa(polje: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string {
  const v = polje.validity;
  if (v.valueMissing) return polje.type === 'checkbox' ? poruke.saglasnost : poruke.obavezno;
  if (v.typeMismatch || v.patternMismatch) return poruke.email;
  if (v.tooShort) return poruke.kratko;
  return polje.validationMessage;
}

function prikaziGresku(polje: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
  const omot = polje.closest('.polje, .potvrda-omot') ?? polje.parentElement;
  if (!omot) return;
  let greska = omot.querySelector<HTMLElement>('.polje__greska');
  if (polje.validity.valid) {
    polje.removeAttribute('aria-invalid');
    polje.removeAttribute('aria-describedby');
    greska?.remove();
    return;
  }
  if (!greska) {
    greska = document.createElement('span');
    greska.className = 'polje__greska';
    greska.id = `${polje.id || polje.name}-greska`;
    omot.appendChild(greska);
  }
  greska.textContent = porukaZa(polje);
  polje.setAttribute('aria-invalid', 'true');
  polje.setAttribute('aria-describedby', greska.id);
}

const jeLokalno = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);

document.querySelectorAll<HTMLFormElement>('form[data-forma]').forEach((forma) => {
  const naziv = forma.getAttribute('name') ?? 'forma';
  const dogadjaj = forma.dataset.dogadjaj ?? 'generate_lead';
  const dugme = forma.querySelector<HTMLButtonElement>('[data-forma-dugme]');
  const dugmeTekst = forma.querySelector<HTMLElement>('[data-forma-dugme-tekst]');
  const greska = forma.querySelector<HTMLElement>('[data-forma-greska]');
  const uspeh = forma.nextElementSibling as HTMLElement | null;
  let zapoceto = false;

  // form_start — prvi put kada posetiteljka počne da popunjava formu
  forma.addEventListener('input', () => {
    if (zapoceto) return;
    zapoceto = true;
    window.prati('form_start', { form_name: naziv });
  });

  // Greška nestaje čim se polje ispravi
  forma.addEventListener(
    'blur',
    (e) => {
      const polje = e.target as HTMLInputElement;
      if (polje.matches?.('input, textarea, select') && polje.getAttribute('aria-invalid')) prikaziGresku(polje);
    },
    true,
  );
  forma.addEventListener('change', (e) => {
    const polje = e.target as HTMLInputElement;
    if (polje.getAttribute?.('aria-invalid')) prikaziGresku(polje);
  });

  forma.addEventListener('submit', async (e) => {
    e.preventDefault();
    const polja = Array.from(
      forma.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        'input:not([type=hidden]), textarea, select',
      ),
    );
    polja.forEach(prikaziGresku);
    const prvoNeispravno = polja.find((p) => !p.validity.valid);
    if (prvoNeispravno) {
      prvoNeispravno.focus();
      return;
    }

    const originalniTekst = dugmeTekst?.textContent ?? '';
    if (dugme) dugme.disabled = true;
    if (dugmeTekst) dugmeTekst.textContent = 'Šaljem…';
    if (greska) greska.hidden = true;

    try {
      if (!jeLokalno) {
        const podaci = new URLSearchParams(new FormData(forma) as unknown as Record<string, string>);
        const odgovor = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: podaci.toString(),
        });
        if (!odgovor.ok) throw new Error(`Status ${odgovor.status}`);
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }

      // Događaj za analitiku — bez ličnih podataka
      const parametri: Podaci = { form_name: naziv };
      const stavka = forma.querySelector<HTMLInputElement>('[name="radionica"], [name="program"]');
      if (stavka?.value) parametri.naziv_stavke = stavka.value;
      window.prati(dogadjaj, parametri);
      // Ako je uz upit štiklirana i prijava na newsletter
      const nl = forma.querySelector<HTMLInputElement>('[name="newsletter"]');
      if (dogadjaj !== 'newsletter_signup' && nl?.checked) {
        window.prati('newsletter_signup', { form_name: naziv });
      }

      forma.hidden = true;
      if (uspeh?.hasAttribute('data-forma-uspeh')) {
        uspeh.hidden = false;
        const lokalno = uspeh.querySelector<HTMLElement>('[data-forma-lokalno]');
        if (lokalno) lokalno.hidden = !jeLokalno;
        uspeh.focus();
      }
    } catch {
      if (greska) greska.hidden = false;
      if (dugme) dugme.disabled = false;
      if (dugmeTekst) dugmeTekst.textContent = originalniTekst;
    }
  });
});

export {};
