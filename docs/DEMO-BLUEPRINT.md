# Demo site blueprint

How a Vervo niche demo is put together. It is taken from the demos that sell best in person
(Scheermes, Kwast & Kleur, Studio Glans, Kern). Follow the structure; change everything you can see.

## The rule that matters most

A business owner should open the demo on their phone and think "that's my kind of shop",
not "that's a template". So every demo gets its own:

- **Typeface pair** that nobody else on the site uses (see the table below).
- **Hero composition**: split, full-bleed photo, photo in a shape, centred over a photo, etc.
- **Headline in one style.** No "normal line + italic line" pairs, no two-tone half sentences,
  and not every headline as two short sentences with full stops. Write it the way the owner would say it.
- **One tool that only makes sense for that trade** (the reason the demo exists).

## Sections, in this order

1. **Header**: logo as text (no image needed), 3–5 anchors, one action button. Sticky.
2. **Hero**: what they do + where, one sentence of proof, primary action (book / call / quote),
   secondary action (prices / the tool). Live open status or response time where it fits.
3. **Trust strip**: 3–4 short facts (rating, years, guarantee, response time).
4. **The niche tool**, early on the page:
   - booking flow with real steps (barber, nails, yoga),
   - price calculator with sliders or choices (painter, groomer, installer),
   - picker or builder with a live preview (nail colours, bouquets),
   - short quiz that recommends a product (trainer).
   The tool's result always ends in the contact form, pre-filled.
5. **Prices**: plain list or cards, real-looking numbers, what's included.
6. **Work**: horizontal photo strip with captions (place, time taken, result).
7. **Reviews**: 2–3, first name + area, specific details (a day early, no paint on the floor).
8. **Practical**: opening hours with today highlighted, address, map loaded on click.
9. **Contact form**: name, phone, one question about the job. Demo box after sending.
10. **Footer**: KvK/BTW placeholders, "concept website by Vervo Studio" link.
11. **Mobile bar**: call + main action, fixed at the bottom, leaves room for the language pill.

## Languages

- NL first for Dutch businesses, EN and PL next to it. Pages live at `/slug/`, `/slug/en/`, `/slug/pl/`.
- Write each language on its own. Don't translate word for word; say it the way a local shop would.
- Polish: avoid forms that assume the visitor's gender.

## Code

- One file per demo in `src/demos/Name.astro` with a `T` dictionary (`nl`, `en`, `pl`).
- Pages: `src/pages/slug/index.astro`, `src/pages/slug/en/index.astro`, `src/pages/slug/pl/index.astro`.
- Shared helpers in `src/scripts/demo-kit.js`: `reveal`, `openStatus`, `markToday`, `mapOnClick`,
  `demoForm`, `euro`, `readCfg`. Pass data to the script as JSON in `<script type="application/json" id="cfg">`.
- `<Curtain />` at the top of `<body>`, `<DemoLang links={…} />` at the end.
- `noindex` on every demo. Photos go in `public/img/slug/` as WebP (max 1800 px wide, 1000×1500 for portraits).
- Register the demo in `SITES` (`src/data/hub-i18n.js`, with its `cat`), its texts in `T.*.sites.items`,
  the label in `Curtain.astro` (`DEMOS`), the thumbnails in `public/img/sites/slug-{nl,en,pl}.webp`
  (960×600) and the URLs in `public/sitemap.xml` if wanted.

## Typefaces in use

| Demo | Display | Body |
| --- | --- | --- |
| Ogrodowa 3 (restaurant) | Manrope | Manrope |
| OKTAN (car service) | Barlow Condensed | Barlow |
| Kontur (real estate) | Schibsted Grotesk | JetBrains Mono |
| Prolog (café) | Young Serif | Hanken Grotesk |
| Kołodziej (workshop) | Familjen Grotesk | IBM Plex Sans / Mono |
| Scheermes (barber) | Big Shoulders Display | Inter Tight |
| Studio Glans (nails) | Gloock | DM Sans |
| Kern (personal trainer) | Archivo (expanded) | Archivo |
| Kwast & Kleur (painters) | Sora | Figtree |
| Bron (installer) | Overpass | Overpass / Overpass Mono |
| Mos (florist) | Gilda Display | Karla |
| Pluis (dog groomer) | Fredoka | Nunito Sans |
| Adem (yoga) | Tenor Sans | Mulish |

## Before it goes live

- No horizontal scroll at 320, 375, 768 and 1440 px; no console errors.
- Every interactive step works in all three languages.
- The tool's result reaches the form.
- Thumbnails regenerated after any change to the first screen.
