# 1. Design system

Everything in section 1 of the client's brief ("Vizuelni identitet") is defined here. A live, visual version is at **`/stil/`** on the site — that page is the easiest thing to show the client.

All values live in one file: [`src/styles/global.css`](../src/styles/global.css), in the `:root` block at the top. Change a value there and the whole site follows.

## Where the direction comes from

- **Palette:** the warm cream background and navy text of the screenshot you sent, combined with the moodboard inside the brief (Persian blue, soft apricot, grey-blue).
- **Typography:** the moodboard names "Garamond", "Minimalist Sans" and a handwritten "organic flow" script.
- **Shapes:** the moodboard's cut-paper organic forms, used for decoration, icon backgrounds and photo frames.

## Colors (HEX)

| Role in the brief | Name | HEX | CSS variable | Used for |
| --- | --- | --- | --- | --- |
| Primarna — tamno plava | Persian blue | `#2B4A9B` | `--c-plava` | Buttons (CTA), links, accents |
| | Blue, hover | `#1F3778` | `--c-plava-tamna` | Button hover |
| Sekundarna — svetlo plava | Light blue | `#C9D6EC` | `--c-svetloplava` | Decorative shapes |
| | Light blue, soft | `#E6ECF6` | `--c-svetloplava-blaga` | Section backgrounds, tags |
| Akcentna — kajsija | Apricot | `#F4C39E` | `--c-kajsija` | Accents, buttons on dark backgrounds |
| | Apricot, soft | `#FBE5D3` | `--c-kajsija-blaga` | Section backgrounds |
| | Apricot, deep | `#DD9A68` | `--c-kajsija-tamna` | Small details, numbers, lines |
| Pozadina — bež | Cream | `#F8F0E9` | `--c-bez` | Page background |
| | Cream, deep | `#F0E3D6` | `--c-bez-tamna` | Emphasized sections |
| | Paper | `#FFFBF7` | `--c-papir` | Cards, form fields |
| Tekst — teget | Navy | `#1B2545` | `--c-teget` | Text, dark sections |
| | Navy, muted | `#49526F` | `--c-teget-blagi` | Secondary text |
| | Mist | `#A9B4C4` | `--c-magla` | Decoration |

**Contrast (accessibility).** Navy text on cream is about 13:1 and Persian blue on cream about 7:1, both above the WCAG AA requirement of 4.5:1. Apricot is never used for text on a light background because it would be too faint; on dark navy it is used for buttons with navy text.

## Typography

| Use | Font | Weights | Notes |
| --- | --- | --- | --- |
| Main headings (H1–H3) | **EB Garamond** | 400 for large, 500 for H3 | Italic + blue for emphasized words: write `*word*` in a heading field |
| Body text | **Jost** | 400 | 17–19 px, line height 1.65 |
| Buttons, navigation, labels | **Jost** | 400 nav, 500 buttons | Buttons and labels in uppercase with letter-spacing |
| Handwritten accent | **Ms Madi** | 400 | Short personal phrases above headings only |

Why EB Garamond and not Cormorant Garamond: I started with Cormorant, but it places the Serbian carons (ž, š, č) far above the letters, which looks broken in Serbian text. EB Garamond sets them correctly.

All three fonts are open source (SIL Open Font License), downloaded at build time and served from the site's own domain — no requests to Google Fonts, which is better for both speed and privacy.

**Sizes** scale smoothly between phone and desktop:

| Style | Phone → desktop |
| --- | --- |
| Display (home H1) | 42 → 78 px |
| H1 | 37 → 62 px |
| H2 | 30 → 46 px |
| H3 | 23 → 30 px |
| Lead paragraph | 18 → 22 px |
| Body | 17 → 19 px |
| Label / overline | 13 px, uppercase |

## Buttons

| Type | Look | Hover |
| --- | --- | --- |
| Primary (CTA) | Persian blue fill, light text, pill shape, arrow | Deeper blue, lifts 2 px, soft shadow, arrow slides right |
| Secondary | Navy outline, transparent | Fills with navy |
| On dark background | Apricot fill, navy text | Lighter apricot |
| Text link with arrow | Blue uppercase text, underline | Arrow slides right |

The booking CTA ("Zakaži uvodni razgovor") is the only filled blue button in the header and hero, so it stands apart from everything else, as the brief asks. Minimum height is 52 px (44 px for the small variant), which is comfortable for thumbs.

## Icons and illustrations

- **Icons:** thin line (1.5 px), rounded ends, 24 px grid. Defined in [`src/components/Ikona.astro`](../src/components/Ikona.astro).
- **Shapes:** organic "cut paper" forms in blue, apricot and grey-blue. Defined in [`src/components/Oblik.astro`](../src/components/Oblik.astro).
- **Photo placeholders:** until real photos are uploaded, each photo slot shows an illustration built from the same shapes, labelled "Mesto za fotografiju".

## Radius, spacing, lines

| Element | Value |
| --- | --- |
| Cards and photos | 24 px |
| Large panels | 40 px |
| Buttons, tags | Fully rounded (pill) |
| Portraits | Arch (rounded top) or soft organic shape |
| Space between sections | 72 → 136 px |
| Max content width | 1216 px; reading column 704 px |
| Lines and borders | 1 px, navy at 14 % opacity |

## Scroll animations

Yes, discreet ones: content fades up by 24 px over 0.7 s when it enters the screen. The top of each page is never animated, so the main content appears instantly. Animations switch off automatically for visitors who enabled "reduce motion" on their device, and the content is fully visible even if JavaScript fails.

## Logo

Generated by `npm run brend` into [`public/brend/`](../public/brend/):

| File | Use |
| --- | --- |
| `logo-horizontalni.svg / .png` | Horizontal, light backgrounds |
| `logo-horizontalni-tamna-pozadina.svg / .png` | Horizontal, dark backgrounds |
| `logo-vertikalni.svg / .png` | Stacked, light backgrounds |
| `logo-vertikalni-tamna-pozadina.svg / .png` | Stacked, dark backgrounds |
| `znak.svg / .png` | Symbol only (also the favicon) |

The symbol is a blue pebble with a rising path and an apricot sun — a small picture of "napredak". Text in the SVG files is converted to outlines, so they look identical on any computer.

This is a proposal. If the client already has a logo, replace the files in `public/brend/`, `public/favicon.svg` and the markup in [`src/components/Logo.astro`](../src/components/Logo.astro).
