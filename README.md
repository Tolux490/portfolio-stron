# Portfolio stron — szkielet startowy

Trzy demo (warsztat, restauracja, biuro nieruchomości) na jednym silniku Astro.
Wspólny szkielet, osobne tokeny designu dla każdej branży.

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # statyczny HTML do katalogu dist/
```

## Co gdzie leży

```
src/
  data/firmy.js              ← dane firmy: nazwa, NIP, telefon, godziny
  layouts/Site.astro         ← head, nawigacja, stopka, pasek "Zadzwoń", schema.org
  components/Polityka.astro  ← wzór polityki prywatności (wersja bez formularza)
  styles/base.css            ← reset i szkielet — BEZ kolorów i fontów
  pages/
    index.astro              ← strona-hub z listą realizacji (noindex)
    mechanik/                ← demo 1
    restauracja/             ← demo 2
    nieruchomosci/           ← demo 3
```

Kolory i fonty każdej strony siedzą w bloku `:root` **na dole jej pliku**.
To jest cały mechanizm: ten sam kod, inny zestaw tokenów = inna strona.

## Nowa strona dla klienta — kolejność

1. Skopiuj katalog najbliższej branży, np. `src/pages/mechanik/` → `src/pages/nowy-klient/`.
2. Dopisz firmę w `src/data/firmy.js` (razem z polem `base: '/nowy-klient/'`).
3. Zmień blok `:root` — 2 fonty z Google Fonts, 4 kolory. To 80% odmienności.
4. Podmień treść. **Napisz ją przed kodem**, w Wordzie albo notatniku.
5. Wstaw zdjęcia w miejsce elementów `.ph`.

## Zdjęcia

Wszystkie kafelki z klasą `ph` to placeholdery. Przed pokazaniem czegokolwiek
klientowi podmień je na prawdziwe zdjęcia — inaczej demo wygląda na niedokończone.

Do demo bierz z Unsplash lub Pexels (licencja komercyjna, bez podawania autora).
Trzymaj jedną tonację w obrębie strony. Zapisz jako WebP, szerokość maks. 1600 px.

Frazy, które działają: *car repair shop interior*, *mechanic working under car*,
*small restaurant interior evening*, *chef plating dish*, *modern apartment interior warsaw*,
*real estate agent handing keys*.

## Wdrożenie na Cloudflare Pages

1. Wrzuć repozytorium na GitHub (może być prywatne).
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build`, output directory: `dist`.
4. Custom domains → dodaj domenę → skopiuj rekordy do panelu rejestratora.
5. Każdy `git push` = nowy deploy. Podgląd z gałęzi dostajesz automatycznie.

Do portfolio wystarczy jeden projekt i subdomeny, np. `demo.twojadomena.pl/mechanik/`.
Przy prawdziwym kliencie rób osobne repo i osobny projekt — łatwiej przekazać.

## Checklista przed publikacją

- [ ] telefon klikalny w nagłówku, w treści i w pasku na dole ekranu
- [ ] wszystkie placeholdery `.ph` zastąpione zdjęciami
- [ ] w stopce: pełna nazwa, adres, NIP, telefon, e-mail
- [ ] polityka prywatności podlinkowana i uzupełniona prawdziwymi danymi
- [ ] `site:` w `astro.config.mjs` ustawione na docelową domenę
- [ ] tytuł i opis (`title`, `description`) unikalne, z nazwą miasta
- [ ] Lighthouse w Chrome: min. 90 w Performance i SEO
- [ ] sprawdzone na prawdziwym telefonie, nie tylko w trybie mobilnym w przeglądarce
- [ ] Google Search Console + wizytówka Google podpięte

## Uwagi prawne

Wzór polityki prywatności zakłada brak formularza i brak cookies marketingowych.
Jeśli dołożysz Google Analytics, Piksel Meta albo formularz — dokument trzeba
rozszerzyć, a przy narzędziach z cookies dodać baner ze zgodą.

Przeniesienie majątkowych praw autorskich do projektu wymaga formy pisemnej.
Bez umowy klient płaci za stronę, ale praw nie nabywa. Wpisz to do umowy razem
z zakresem pól eksploatacji.

To nie jest opinia prawna — przy większych zleceniach warto, żeby dokumenty
przejrzał prawnik.

## Hosting na GitHub Pages

W repo jest gotowy workflow `.github/workflows/deploy.yml`.

1. `git init && git add . && git commit -m "start"` i wypchnij do nowego repo na GitHub.
2. W repo: Settings → Pages → **Source: GitHub Actions**.
3. W `astro.config.mjs` ustaw `site: 'https://TWOJ-LOGIN.github.io'` i **odkomentuj**
   `base: '/nazwa-repo'` — bez tego wszystkie linki będą prowadzić w pustkę.
4. Push do `main` uruchamia deploy. Adres: `https://TWOJ-LOGIN.github.io/nazwa-repo/`.

Przy własnej domenie (Settings → Pages → Custom domain) `base` **zostaw zakomentowany**,
a w `site` wpisz tę domenę.

Uwaga: na darmowym planie GitHub Pages działa tylko z repozytorium publicznym.
Dla portfolio to bez znaczenia, dla kodu klienta — już tak.
