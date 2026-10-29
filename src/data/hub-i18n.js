// Treść strony głównej Vervo Studio w trzech językach (EN domyślny, PL, NL).
// Ton osobisty: Antoni mówi w pierwszej osobie, Vervo Studio to marka. Bez myślników w roli pauzy.
export const LANGS = ['en', 'pl', 'nl'];
export const DEFAULT_LANG = 'en';

// Link do profilu na Fiverr. Puste = przyciski „Fiverr” znikają, a CTA prowadzą do formularza.
export const FIVERR_URL = 'https://www.fiverr.com/anthony_antc';
export const GITHUB_URL = 'https://github.com/Tolux490';
export const EMAIL = 'antoni.antczak05@gmail.com';

export const NAV_HREFS = ['#work', '#services', '#about', '#faq', '#contact'];
export const SKILLS = ['Excel', 'Google Sheets', 'Google Forms', 'Apps Script', 'SQL', 'Python', 'HTML · CSS · JS', 'Astro'];

// Media wspólne dla wszystkich języków. Teksty (podpisy, opisy) są w T[lang] pod tym samym indeksem.
export const CASE_MEDIA = [
  {
    video: 'video/kettle-cleanup.mp4', vw: 1280, vh: 632, poster: 'video/kettle-cleanup.webp', download: 'files/little-kettle-shop-orders.xlsx',
    shots: [
      { src: 'img/work/kettle-before-after.webp', w: 1600, h: 663 },
      { src: 'img/work/kettle-summary.webp', w: 1500, h: 436 },
      { src: 'img/work/kettle-log.webp', w: 905, h: 484 },
    ],
  },
  {
    video: 'video/bakery-tracker.mp4', vw: 1280, vh: 648, poster: 'video/bakery-tracker.webp',
    shots: [
      { src: 'img/work/bakery-form.webp', w: 840, h: 822 },
      { src: 'img/work/bakery-summary.webp', w: 1446, h: 450 },
      { src: 'img/work/bakery-orders.webp', w: 1600, h: 461 },
      { src: 'img/work/bakery-calendar.webp', w: 1600, h: 751 },
    ],
  },
];
export const SITE_HREFS = ['/restauracja/', '/oktan/', '/nieruchomosci/', '/kawiarnia/', '/mechanik/'];
export const SITE_THUMBS = ['img/sites/restauracja.webp', 'img/sites/oktan.webp', 'img/sites/nieruchomosci.webp', 'img/sites/kawiarnia.webp', 'img/sites/mechanik.webp'];
export const FICHES_URL = 'https://tolux490.github.io/Fiches/';
export const CERTS = [
  { t: 'SQL (Intermediate)', org: 'HackerRank', date: '2026-10-23', img: 'img/certs/hackerrank-sql-intermediate.webp', w: 1200, h: 914, verify: 'https://www.hackerrank.com/certificates/2e0af8f9bf52' },
  { t: 'SQL (Basic)', org: 'HackerRank', date: '2026-10-23', img: 'img/certs/hackerrank-sql-basic.webp', w: 1200, h: 914, verify: 'https://www.hackerrank.com/certificates/c82d7b5223cf' },
  { t: 'Python', org: 'Kaggle', date: '2026-10-23', img: 'img/certs/kaggle-python.webp', w: 1200, h: 740 },
];

export const T = {
  en: {
    meta: {
      ogLocale: 'en_US',
      title: 'Antoni Antczak | Excel, Google Sheets & web freelancer | Vervo Studio',
      description: 'Freelance data cleaning, Excel reports, Google Sheets automation and fast websites for small businesses. Business Analytics student, certified in SQL and Python.',
      ogTitle: 'Antoni Antczak | Vervo Studio',
      ogDescription: 'Clean data, smart spreadsheets and websites that work. See the projects, the videos and the certificates.',
    },
    schemaDesc: 'Freelance data cleaning, spreadsheet automation and websites for small businesses.',
    jobTitle: 'Business Analytics student and freelancer',
    navLabels: ['Work', 'Services', 'About', 'FAQ', 'Contact'],
    cta: { hire: 'Hire me', fiverr: 'Order on Fiverr', quote: 'Get a free quote', seeWork: 'See my work', ask: 'Ask for a quote', github: 'GitHub' },
    hero: {
      available: 'Available for new projects',
      h1: 'Clean data, smart spreadsheets <em>and websites that work.</em>',
      lede: 'Hi, I’m Antoni, a Business Analytics student who freelances as Vervo Studio. I clean up messy Excel files, build Google Sheets systems that run themselves and code fast websites for small businesses.',
      proof: [
        { b: '300', t: 'orders cleaned in one project' },
        { b: '3', t: 'certificates in SQL and Python' },
        { b: '5', t: 'live website demos' },
        { b: '< 24 h', t: 'reply time' },
      ],
      chips: ['18 duplicates removed', 'Updates automatically'],
    },
    skillsLabel: 'Tools I work with',
    services: {
      label: 'Services',
      h2: 'How I can help',
      lede: 'Clear scope, a fixed price and a delivery date before I start. Pick a service or just describe your problem.',
      items: [
        { t: 'Excel data cleaning & reports', o: 'Messy exports, duplicates, mixed formats. I turn them into one clean table and a summary you can actually use.', co: ['Clean, consistent data', 'Duplicates removed, problems flagged', 'Summary tab with charts', 'A log of every change'] },
        { t: 'Google Sheets & Forms automation', o: 'Order forms, trackers and dashboards that fill themselves, built on free Google tools.', co: ['Form connected to a sheet', 'Statuses and automatic flags', 'Live dashboard', 'Google Calendar integration'] },
        { t: 'Websites for small businesses', o: 'Fast, mobile-friendly sites written in clean code, no WordPress. From a one-page site to a full menu or booking page.', co: ['Looks great on phones', 'Loads in under a second', 'Contact or booking form', 'Basic SEO and Google setup'] },
        { t: 'Data analysis with SQL & Python', o: 'Questions about your sales or customers? I query the data, find the answer and explain it in plain words.', co: ['SQL queries and reports', 'Python for bigger files', 'Charts that make the point', 'A short written summary'] },
      ],
    },
    work: {
      label: 'Work',
      h2: 'Featured projects',
      lede: 'Two data projects from start to finish: the problem, the fix and the result. Each one comes with a short video.',
      problem: 'The problem', did: 'What I did', result: 'The result',
      sample: 'Sample project with made-up data', video: 'Video walkthrough', download: 'Download the workbook (.xlsx)', zoom: 'Click to enlarge',
      cases: [
        {
          kicker: 'Excel · Data cleaning',
          title: 'Little Kettle Shop: from a messy export to a clean sales report',
          intro: 'A small webshop selling coffee and kitchen goods in four countries exported 300 orders. Countries, product names, dates and prices were typed in every possible way, so nobody could answer a simple question like “how much did we sell in Germany?”',
          stats: [{ b: '300', t: 'orders cleaned' }, { b: '17 → 4', t: 'country spellings' }, { b: '28 → 8', t: 'product names' }, { b: '18', t: 'duplicates removed' }],
          did: [
            'Fixed dates stored as text in five different formats',
            'Standardised countries, products and payment methods, and turned text prices like “EUR 24.95” into real numbers',
            'Removed duplicate orders and flagged the 10 rows that need a human check instead of guessing',
            'Built a summary tab with revenue by month, country and product that updates by itself',
            'Added dropdowns and checks so new data stays clean, plus a log of every change',
          ],
          result: 'One workbook the owner can trust: €14,306 revenue across 300 orders, broken down by month, country and product, with every fix documented.',
          caps: ['Before and after: the raw export next to the clean table', 'Summary tab: key numbers, revenue by country and product', 'Cleaning log: every problem found and what was done about it'],
        },
        {
          kicker: 'Google Forms · Sheets · Calendar',
          title: 'Sweet Crumb Bakery: an order system that runs itself',
          intro: 'A bakery taking pickup orders by phone and chat kept losing track of who ordered what and for when. I built a free system on Google tools: customers order through a form and everything else happens automatically.',
          stats: [{ b: '60+', t: 'sample orders tracked' }, { b: '5', t: 'order statuses' }, { b: '3', t: 'automatic flags' }, { b: '€0', t: 'monthly software cost' }],
          did: [
            'An order form with the product list, pickup date and time, and notes',
            'An order sheet where every order gets an ID, price and total automatically',
            'Statuses from New to Collected, with rows that flag themselves: Pickup today, Overdue, Needs confirmation',
            'A summary dashboard: pickups today, open orders, revenue for the last 7 and 30 days, and top products',
            'Every pickup lands in Google Calendar, so the day plan is always on the phone',
          ],
          result: 'The bakery sees today’s pickups, overdue orders and revenue at a glance, without paying for any software.',
          caps: ['The order form customers fill in', 'Summary dashboard that updates itself', 'Order sheet with statuses and automatic flags', 'Pickups in Google Calendar'],
        },
      ],
    },
    sites: {
      label: 'Websites',
      h2: 'Websites I’ve built',
      note: 'Working demos for local businesses, written in Polish for the Polish market. Click any of them to open it live.',
      goLive: 'See it live ↗',
      items: [
        { nazwa: 'Ogrodowa 3', bran: 'Restaurant', opis: 'An elegant, multi-page site: à la carte and tasting menus, a wine list, online booking and a rotating 3D wine bottle.', tagi: ['Multiple pages', 'Booking', '3D model'] },
        { nazwa: 'OKTAN', bran: 'Car service', opis: 'A bold, carbon-styled service site with a price list, online booking, a gallery and a live open-now status.', tagi: ['Price list', 'Online booking', 'Live status'] },
        { nazwa: 'Kontur Nieruchomości', bran: 'Real estate agency', opis: 'Listings with filtering, sorting and a mortgage calculator, plus a viewing-request form with a full GDPR notice.', tagi: ['Listing filters', 'Mortgage calculator'] },
        { nazwa: 'Prolog', bran: 'Café', opis: 'A menu with category filters, a digital stamp card saved on the phone and a live open-now status.', tagi: ['Filtered menu', 'Stamp card'] },
        { nazwa: 'Serwis Kołodziej', bran: 'Car workshop', opis: 'A calm, premium take on a workshop: a labour price list with repair times and a live bay-availability board.', tagi: ['Labour pricing', 'Bay availability'] },
      ],
      project: { bran: 'Own project', nazwa: 'Fiches', opis: 'A French-learning app with AI-generated flashcards that I built for myself.', tagi: ['App', 'AI'], go: 'Open ↗' },
    },
    certs: {
      label: 'Certificates',
      h2: 'Verified skills',
      lede: 'Tested by HackerRank and Kaggle, so you don’t have to take my word for it.',
      view: 'View', verify: 'Verify ↗', earned: 'Earned',
    },
    about: {
      label: 'About',
      h2: 'Hi, I’m Antoni',
      p: [
        'I study Business Analytics, which means I spend my days between data, numbers and the businesses behind them. Vervo Studio is how I put that to work for real clients.',
        'Most small businesses don’t need a big IT project. They need the spreadsheet to add up, the orders to stop getting lost and a website that brings in customers. That’s exactly the kind of work I enjoy.',
        'I keep things simple: I explain what I’ll do in plain words, agree on the price up front and deliver files you fully own.',
      ],
      facts: [{ k: 'Studying', v: 'Business Analytics' }, { k: 'Languages', v: 'Polish, English' }, { k: 'Works', v: 'Remotely, worldwide' }],
      why: [
        { b: 'Plain language', s: 'No jargon. You always know what I’m doing and why.' },
        { b: 'Fixed price', s: 'Scope and price agreed before I start.' },
        { b: 'Documented', s: 'You get notes on what changed and how to use it.' },
        { b: 'Yours to keep', s: 'Files, code and data belong to you.' },
      ],
    },
    proces: {
      label: 'Process',
      h2: 'How we work together',
      steps: [
        { t: 'Tell me what you need', o: 'Send a message with the file, a link or a short description. Screenshots are fine.' },
        { t: 'Fixed quote', o: 'I reply with what I’ll do, the price and the delivery date. No surprises later.' },
        { t: 'I build it', o: 'On bigger jobs I send a preview along the way, so you can steer early.' },
        { t: 'Delivery', o: 'You get the finished files with short notes. Small tweaks after delivery are included.' },
      ],
    },
    faq: {
      label: 'FAQ',
      h2: 'Common questions',
      items: [
        { q: 'Can I order through Fiverr?', a: 'Yes. Fiverr is the easiest way: your payment is protected and you get a clear delivery date. You can also write to me directly using the form below.' },
        { q: 'What do you need from me to start?', a: 'The file or a copy of it, and a few sentences about what you want to get out of it. If something is unclear, I ask before I start.' },
        { q: 'Excel or Google Sheets?', a: 'Both. I work in whatever you already use. If you’re not sure, I’ll suggest what fits your team best.' },
        { q: 'Is my data safe with you?', a: 'I only use your data for your project, never share it and delete my copy after delivery if you ask. For sensitive files you can send a sample with the private details removed.' },
        { q: 'How long does it take?', a: 'It depends on the size of the job. You get an exact delivery date in my quote, before you pay anything.' },
        { q: 'Do you build websites for businesses outside Poland?', a: 'Yes. I build sites in English and Polish and can set up the domain and hosting for you.' },
      ],
    },
    kontakt: {
      label: 'Contact',
      h2: 'Tell me about your project',
      p: 'Describe what you need in a few sentences. I usually reply within 24 hours with a plan, a price and a delivery date.',
      fiverrNote: 'Prefer to order on Fiverr?',
      form: {
        imie: 'Name', email: 'Email',
        need: 'What do you need?', needChoose: 'Choose',
        needs: ['Excel data cleaning or a report', 'Google Sheets / Forms automation', 'A website', 'Data analysis (SQL / Python)', 'Something else'],
        wiadomosc: 'Message', wiadomoscPlaceholder: 'A few sentences about your project. Links to files are welcome.',
        consent: 'I agree to be contacted about my request.', submit: 'Send message',
      },
    },
    footer: { tx: 'Vervo Studio is the freelance studio of Antoni Antczak. Data cleaning, spreadsheet automation and websites for small businesses.' },
    formMsgs: {
      subject: 'New message from vervostudio.com',
      incomplete: 'Please complete the required fields and consent.',
      sending: 'Sending…',
      ok: 'Thanks! Your message is on its way. I usually reply within 24 hours.',
      fail: 'Could not send. Please write directly to ',
    },
  },

  pl: {
    meta: {
      ogLocale: 'pl_PL',
      title: 'Antoni Antczak | Excel, Arkusze Google i strony www | Vervo Studio',
      description: 'Porządkowanie danych w Excelu, raporty, automatyzacje w Arkuszach Google i szybkie strony dla małych firm. Student Business Analytics z certyfikatami z SQL i Pythona.',
      ogTitle: 'Antoni Antczak | Vervo Studio',
      ogDescription: 'Czyste dane, mądre arkusze i strony, które działają. Zobacz projekty, nagrania i certyfikaty.',
    },
    schemaDesc: 'Porządkowanie danych, automatyzacje arkuszy i strony internetowe dla małych firm.',
    jobTitle: 'Student Business Analytics i freelancer',
    navLabels: ['Projekty', 'Usługi', 'O mnie', 'FAQ', 'Kontakt'],
    cta: { hire: 'Współpraca', fiverr: 'Zamów na Fiverr', quote: 'Darmowa wycena', seeWork: 'Zobacz projekty', ask: 'Zapytaj o wycenę', github: 'GitHub' },
    hero: {
      available: 'Przyjmuję nowe projekty',
      h1: 'Czyste dane, mądre arkusze <em>i strony, które działają.</em>',
      lede: 'Cześć, jestem Antoni. Studiuję Business Analytics i jako Vervo Studio pomagam małym firmom: porządkuję chaotyczne pliki Excela, buduję w Arkuszach Google systemy, które działają same, i koduję szybkie strony internetowe.',
      proof: [
        { b: '300', t: 'zamówień uporządkowanych w jednym projekcie' },
        { b: '3', t: 'certyfikaty z SQL i Pythona' },
        { b: '5', t: 'działających stron demo' },
        { b: '< 24 h', t: 'czas odpowiedzi' },
      ],
      chips: ['18 duplikatów usuniętych', 'Aktualizuje się samo'],
    },
    skillsLabel: 'Narzędzia, z którymi pracuję',
    services: {
      label: 'Usługi',
      h2: 'W czym mogę pomóc',
      lede: 'Jasny zakres, stała cena i termin oddania, zanim zacznę. Wybierz usługę albo po prostu opisz problem.',
      items: [
        { t: 'Porządkowanie danych i raporty w Excelu', o: 'Chaotyczne eksporty, duplikaty, pomieszane formaty. Zamieniam je w jedną czystą tabelę i podsumowanie, z którego naprawdę da się korzystać.', co: ['Czyste, spójne dane', 'Usunięte duplikaty, oznaczone problemy', 'Zakładka z podsumowaniem i wykresami', 'Dziennik wszystkich zmian'] },
        { t: 'Automatyzacje w Arkuszach i Formularzach Google', o: 'Formularze zamówień, trackery i dashboardy, które uzupełniają się same. Na darmowych narzędziach Google.', co: ['Formularz połączony z arkuszem', 'Statusy i automatyczne oznaczenia', 'Dashboard na żywo', 'Integracja z Kalendarzem Google'] },
        { t: 'Strony internetowe dla małych firm', o: 'Szybkie strony, świetne na telefonie, pisane czystym kodem, bez WordPressa. Od wizytówki po menu czy rezerwacje.', co: ['Świetnie wygląda na telefonie', 'Ładuje się poniżej sekundy', 'Formularz kontaktu lub rezerwacji', 'Podstawowe SEO i wizytówka Google'] },
        { t: 'Analiza danych w SQL i Pythonie', o: 'Masz pytania o sprzedaż albo klientów? Wyciągam dane, znajduję odpowiedź i tłumaczę ją prostymi słowami.', co: ['Zapytania SQL i raporty', 'Python do większych plików', 'Wykresy, które pokazują sedno', 'Krótkie podsumowanie na piśmie'] },
      ],
    },
    work: {
      label: 'Projekty',
      h2: 'Wybrane projekty',
      lede: 'Dwa projekty z danymi od początku do końca: problem, rozwiązanie i efekt. Do każdego jest krótkie nagranie.',
      problem: 'Problem', did: 'Co zrobiłem', result: 'Efekt',
      sample: 'Projekt przykładowy, dane fikcyjne', video: 'Nagranie z omówieniem', download: 'Pobierz skoroszyt (.xlsx)', zoom: 'Kliknij, aby powiększyć',
      cases: [
        {
          kicker: 'Excel · Porządkowanie danych',
          title: 'Little Kettle Shop: od chaotycznego eksportu do czystego raportu sprzedaży',
          intro: 'Mały sklep internetowy z kawą i akcesoriami kuchennymi, sprzedający do czterech krajów, wyeksportował 300 zamówień. Kraje, nazwy produktów, daty i ceny były wpisane na wszystkie możliwe sposoby, więc nie dało się odpowiedzieć nawet na proste pytanie: ile sprzedaliśmy w Niemczech?',
          stats: [{ b: '300', t: 'uporządkowanych zamówień' }, { b: '17 → 4', t: 'zapisy nazw krajów' }, { b: '28 → 8', t: 'nazwy produktów' }, { b: '18', t: 'usuniętych duplikatów' }],
          did: [
            'Naprawiłem daty zapisane jako tekst w pięciu różnych formatach',
            'Ujednoliciłem kraje, produkty i metody płatności, a ceny typu „EUR 24.95” zamieniłem na prawdziwe liczby',
            'Usunąłem zduplikowane zamówienia i oznaczyłem 10 wierszy do sprawdzenia przez człowieka, zamiast zgadywać',
            'Zbudowałem zakładkę z podsumowaniem: przychód wg miesięcy, krajów i produktów, która aktualizuje się sama',
            'Dodałem listy rozwijane i kontrole, żeby nowe dane zostały czyste, oraz dziennik wszystkich zmian',
          ],
          result: 'Jeden skoroszyt, któremu właściciel może ufać: 14 306 € przychodu z 300 zamówień w podziale na miesiące, kraje i produkty, z każdą poprawką opisaną.',
          caps: ['Przed i po: surowy eksport obok czystej tabeli', 'Podsumowanie: kluczowe liczby, przychód wg krajów i produktów', 'Dziennik zmian: każdy znaleziony problem i co z nim zrobiłem'],
        },
        {
          kicker: 'Formularze · Arkusze · Kalendarz Google',
          title: 'Sweet Crumb Bakery: system zamówień, który działa sam',
          intro: 'Piekarnia przyjmowała zamówienia na odbiór przez telefon i czat i ciągle gubiła, kto co zamówił i na kiedy. Zbudowałem darmowy system na narzędziach Google: klient zamawia przez formularz, a cała reszta dzieje się automatycznie.',
          stats: [{ b: '60+', t: 'przykładowych zamówień w systemie' }, { b: '5', t: 'statusów zamówienia' }, { b: '3', t: 'automatyczne oznaczenia' }, { b: '0 zł', t: 'miesięcznie za oprogramowanie' }],
          did: [
            'Formularz zamówienia z listą produktów, datą i godziną odbioru oraz uwagami',
            'Arkusz zamówień, w którym każde zamówienie samo dostaje numer, cenę i sumę',
            'Statusy od nowego do odebranego i wiersze, które same się oznaczają: odbiór dziś, zaległe, do potwierdzenia',
            'Dashboard: odbiory na dziś, otwarte zamówienia, przychód z 7 i 30 dni oraz najlepiej sprzedające się produkty',
            'Każdy odbiór trafia do Kalendarza Google, więc plan dnia jest zawsze w telefonie',
          ],
          result: 'Piekarnia jednym rzutem oka widzi dzisiejsze odbiory, zaległe zamówienia i przychód, bez płacenia za żadne oprogramowanie.',
          caps: ['Formularz, który wypełnia klient', 'Dashboard, który aktualizuje się sam', 'Arkusz zamówień ze statusami i automatycznymi oznaczeniami', 'Odbiory w Kalendarzu Google'],
        },
      ],
    },
    sites: {
      label: 'Strony www',
      h2: 'Strony, które zbudowałem',
      note: 'Działające dema dla lokalnych firm. Kliknij, żeby otworzyć każde na żywo. Treści są przykładowe.',
      goLive: 'Zobacz na żywo ↗',
      items: [
        { nazwa: 'Ogrodowa 3', bran: 'Restauracja', opis: 'Wielostronicowa, elegancka witryna: karta i menu degustacyjne, karta win, rezerwacja online i obracany model 3D butelki wina.', tagi: ['Wiele podstron', 'Rezerwacje', 'Model 3D'] },
        { nazwa: 'OKTAN', bran: 'Serwis samochodowy', opis: 'Mocna, „carbonowa” strona serwisu z cennikiem, umawianiem wizyt online, galerią i statusem „otwarte teraz”.', tagi: ['Cennik', 'Umawianie wizyt', 'Status na żywo'] },
        { nazwa: 'Kontur Nieruchomości', bran: 'Biuro nieruchomości', opis: 'Oferty z filtrowaniem, sortowaniem i kalkulatorem raty oraz formularz umawiania oglądań z pełną klauzulą RODO.', tagi: ['Filtrowanie ofert', 'Kalkulator raty'] },
        { nazwa: 'Prolog', bran: 'Kawiarnia', opis: 'Menu z filtrami kategorii, cyfrowa karta pieczątek zapisywana w telefonie i status „otwarte teraz” liczony na żywo.', tagi: ['Menu z filtrami', 'Karta pieczątek'] },
        { nazwa: 'Serwis Kołodziej', bran: 'Warsztat samochodowy', opis: 'Spokojna, „premium” odsłona warsztatu: cennik robocizny z czasem naprawy i tabliczka z dostępnością stanowisk.', tagi: ['Cennik robocizny', 'Dostępność stanowisk'] },
      ],
      project: { bran: 'Projekt własny', nazwa: 'Fiches', opis: 'Aplikacja do nauki francuskiego z fiszkami generowanymi przez AI, zbudowana na własne potrzeby.', tagi: ['Aplikacja', 'AI'], go: 'Otwórz ↗' },
    },
    certs: {
      label: 'Certyfikaty',
      h2: 'Potwierdzone umiejętności',
      lede: 'Sprawdzone testami HackerRank i Kaggle, więc nie musisz wierzyć mi na słowo.',
      view: 'Zobacz', verify: 'Zweryfikuj ↗', earned: 'Uzyskany',
    },
    about: {
      label: 'O mnie',
      h2: 'Cześć, jestem Antoni',
      p: [
        'Studiuję Business Analytics, czyli na co dzień siedzę między danymi, liczbami i firmami, które za nimi stoją. Vervo Studio to mój sposób, żeby wykorzystać to w pracy dla prawdziwych klientów.',
        'Większość małych firm nie potrzebuje wielkiego projektu IT. Potrzebuje, żeby arkusz się zgadzał, zamówienia przestały ginąć, a strona przyprowadzała klientów. To jest dokładnie ta praca, którą lubię.',
        'Stawiam na prostotę: tłumaczę normalnym językiem, co zrobię, ustalam cenę z góry i oddaję pliki, które w całości należą do Ciebie.',
      ],
      facts: [{ k: 'Studia', v: 'Business Analytics' }, { k: 'Języki', v: 'polski, angielski' }, { k: 'Współpraca', v: 'zdalnie, z całego świata' }],
      why: [
        { b: 'Prosty język', s: 'Bez żargonu. Zawsze wiesz, co robię i dlaczego.' },
        { b: 'Stała cena', s: 'Zakres i cena ustalone, zanim zacznę.' },
        { b: 'Dokumentacja', s: 'Dostajesz notatki, co się zmieniło i jak z tego korzystać.' },
        { b: 'Na własność', s: 'Pliki, kod i dane należą do Ciebie.' },
      ],
    },
    proces: {
      label: 'Proces',
      h2: 'Jak wygląda współpraca',
      steps: [
        { t: 'Opisz, czego potrzebujesz', o: 'Wyślij wiadomość z plikiem, linkiem albo krótkim opisem. Zrzuty ekranu też są OK.' },
        { t: 'Stała wycena', o: 'Odpisuję, co zrobię, za ile i na kiedy. Bez niespodzianek później.' },
        { t: 'Realizacja', o: 'Przy większych zleceniach wysyłam po drodze podgląd, żebyś mógł wcześnie skorygować kierunek.' },
        { t: 'Oddanie', o: 'Dostajesz gotowe pliki z krótkimi notatkami. Drobne poprawki po oddaniu są w cenie.' },
      ],
    },
    faq: {
      label: 'FAQ',
      h2: 'Częste pytania',
      items: [
        { q: 'Czy mogę zamówić przez Fiverr?', a: 'Tak. Fiverr to najprostsza droga: płatność jest chroniona, a termin oddania jasny. Możesz też napisać do mnie bezpośrednio przez formularz poniżej.' },
        { q: 'Czego potrzebujesz ode mnie na start?', a: 'Pliku albo jego kopii i kilku zdań o tym, co chcesz z niego wyciągnąć. Jeśli coś jest niejasne, dopytam, zanim zacznę.' },
        { q: 'Excel czy Arkusze Google?', a: 'Jedno i drugie. Pracuję w tym, czego już używasz. Jeśli nie wiesz, co wybrać, podpowiem, co lepiej pasuje do Twojej firmy.' },
        { q: 'Czy moje dane są bezpieczne?', a: 'Używam Twoich danych tylko do Twojego projektu, nikomu ich nie udostępniam i na prośbę usuwam swoją kopię po oddaniu pracy. Przy wrażliwych plikach możesz wysłać próbkę bez danych osobowych.' },
        { q: 'Ile to trwa?', a: 'Zależy od wielkości zlecenia. Dokładny termin oddania dostajesz w wycenie, zanim cokolwiek zapłacisz.' },
        { q: 'Czy robisz strony dla firm spoza Polski?', a: 'Tak. Robię strony po polsku i po angielsku i mogę ogarnąć domenę oraz hosting.' },
      ],
    },
    kontakt: {
      label: 'Kontakt',
      h2: 'Opowiedz mi o swoim projekcie',
      p: 'Opisz w kilku zdaniach, czego potrzebujesz. Zwykle odpisuję w ciągu 24 godzin z planem, ceną i terminem.',
      fiverrNote: 'Wolisz zamówić przez Fiverr?',
      form: {
        imie: 'Imię', email: 'E-mail',
        need: 'Czego potrzebujesz?', needChoose: 'Wybierz',
        needs: ['Porządkowanie danych lub raport w Excelu', 'Automatyzacja w Arkuszach / Formularzach Google', 'Strona internetowa', 'Analiza danych (SQL / Python)', 'Coś innego'],
        wiadomosc: 'Wiadomość', wiadomoscPlaceholder: 'Kilka zdań o projekcie. Linki do plików mile widziane.',
        consent: 'Zgadzam się na kontakt w sprawie mojego zapytania.', submit: 'Wyślij wiadomość',
      },
    },
    footer: { tx: 'Vervo Studio to freelance’owe studio Antoniego Antczaka. Porządkowanie danych, automatyzacje arkuszy i strony dla małych firm.' },
    formMsgs: {
      subject: 'Nowa wiadomość ze strony vervostudio.com',
      incomplete: 'Uzupełnij wymagane pola i zgodę.',
      sending: 'Wysyłanie…',
      ok: 'Dzięki! Wiadomość wysłana, zwykle odpisuję w ciągu 24 godzin.',
      fail: 'Nie udało się wysłać. Napisz bezpośrednio na ',
    },
  },

  nl: {
    meta: {
      ogLocale: 'nl_NL',
      title: 'Antoni Antczak | Excel, Google Sheets & websites | Vervo Studio',
      description: 'Freelance data opschonen, Excel-rapporten, automatisering in Google Sheets en snelle websites voor kleine bedrijven. Business Analytics-student met certificaten in SQL en Python.',
      ogTitle: 'Antoni Antczak | Vervo Studio',
      ogDescription: 'Schone data, slimme spreadsheets en websites die werken. Bekijk de projecten, de video’s en de certificaten.',
    },
    schemaDesc: 'Freelance data opschonen, spreadsheet-automatisering en websites voor kleine bedrijven.',
    jobTitle: 'Business Analytics-student en freelancer',
    navLabels: ['Werk', 'Diensten', 'Over mij', 'FAQ', 'Contact'],
    cta: { hire: 'Werk met mij', fiverr: 'Bestel op Fiverr', quote: 'Gratis offerte', seeWork: 'Bekijk mijn werk', ask: 'Vraag een offerte', github: 'GitHub' },
    hero: {
      available: 'Beschikbaar voor nieuwe projecten',
      h1: 'Schone data, slimme spreadsheets <em>en websites die werken.</em>',
      lede: 'Hoi, ik ben Antoni. Ik studeer Business Analytics en help als Vervo Studio kleine bedrijven: ik maak rommelige Excel-bestanden schoon, bouw systemen in Google Sheets die vanzelf draaien en programmeer snelle websites.',
      proof: [
        { b: '300', t: 'bestellingen opgeschoond in één project' },
        { b: '3', t: 'certificaten in SQL en Python' },
        { b: '5', t: 'live website-demo’s' },
        { b: '< 24 u', t: 'reactietijd' },
      ],
      chips: ['18 dubbele rijen weg', 'Werkt zichzelf bij'],
    },
    skillsLabel: 'Tools waarmee ik werk',
    services: {
      label: 'Diensten',
      h2: 'Waarmee ik je kan helpen',
      lede: 'Duidelijke afspraken, een vaste prijs en een opleverdatum voordat ik begin. Kies een dienst of beschrijf gewoon je probleem.',
      items: [
        { t: 'Excel-data opschonen en rapporten', o: 'Rommelige exports, dubbele rijen, gemengde formaten. Ik maak er één schone tabel van, met een overzicht waar je echt iets aan hebt.', co: ['Schone, consistente data', 'Dubbele rijen weg, problemen gemarkeerd', 'Overzichtstabblad met grafieken', 'Logboek van elke wijziging'] },
        { t: 'Automatisering met Google Sheets en Forms', o: 'Bestelformulieren, trackers en dashboards die zichzelf invullen, gebouwd met gratis Google-tools.', co: ['Formulier gekoppeld aan een sheet', 'Statussen en automatische markeringen', 'Live dashboard', 'Koppeling met Google Agenda'] },
        { t: 'Websites voor kleine bedrijven', o: 'Snelle sites die perfect werken op mobiel, in schone code en zonder WordPress. Van een onepager tot een menu of reserveringspagina.', co: ['Ziet er top uit op mobiel', 'Laadt in minder dan een seconde', 'Contact- of reserveringsformulier', 'Basis-SEO en Google-profiel'] },
        { t: 'Data-analyse met SQL en Python', o: 'Vragen over je verkoop of klanten? Ik haal de data op, vind het antwoord en leg het uit in gewone taal.', co: ['SQL-queries en rapporten', 'Python voor grotere bestanden', 'Grafieken die de kern laten zien', 'Korte schriftelijke samenvatting'] },
      ],
    },
    work: {
      label: 'Werk',
      h2: 'Uitgelichte projecten',
      lede: 'Twee dataprojecten van begin tot eind: het probleem, de oplossing en het resultaat. Bij elk project hoort een korte video.',
      problem: 'Het probleem', did: 'Wat ik deed', result: 'Het resultaat',
      sample: 'Voorbeeldproject met verzonnen data', video: 'Video-walkthrough', download: 'Download de werkmap (.xlsx)', zoom: 'Klik om te vergroten',
      cases: [
        {
          kicker: 'Excel · Data opschonen',
          title: 'Little Kettle Shop: van een rommelige export naar een helder verkooprapport',
          intro: 'Een kleine webshop in koffie- en keukenspullen, actief in vier landen, exporteerde 300 bestellingen. Landen, productnamen, datums en prijzen stonden er op alle mogelijke manieren in, dus zelfs een simpele vraag als “hoeveel hebben we in Duitsland verkocht?” was niet te beantwoorden.',
          stats: [{ b: '300', t: 'bestellingen opgeschoond' }, { b: '17 → 4', t: 'schrijfwijzen van landen' }, { b: '28 → 8', t: 'productnamen' }, { b: '18', t: 'dubbele bestellingen weg' }],
          did: [
            'Datums die als tekst in vijf verschillende formaten stonden omgezet naar echte datums',
            'Landen, producten en betaalmethoden gelijkgetrokken, en tekstprijzen als “EUR 24.95” omgezet naar echte getallen',
            'Dubbele bestellingen verwijderd en de 10 rijen die een menselijke check nodig hebben gemarkeerd, in plaats van te gokken',
            'Een overzichtstabblad gebouwd met omzet per maand, land en product dat zichzelf bijwerkt',
            'Keuzelijsten en controles toegevoegd zodat nieuwe data schoon blijft, plus een logboek van elke wijziging',
          ],
          result: 'Eén werkmap waar de eigenaar op kan vertrouwen: €14.306 omzet uit 300 bestellingen, per maand, land en product, met elke correctie gedocumenteerd.',
          caps: ['Voor en na: de ruwe export naast de schone tabel', 'Overzicht: kerncijfers, omzet per land en product', 'Logboek: elk gevonden probleem en wat ermee gedaan is'],
        },
        {
          kicker: 'Google Forms · Sheets · Agenda',
          title: 'Sweet Crumb Bakery: een bestelsysteem dat zichzelf runt',
          intro: 'Een bakkerij nam afhaalbestellingen aan via telefoon en chat en raakte steeds kwijt wie wat had besteld en voor wanneer. Ik bouwde een gratis systeem met Google-tools: klanten bestellen via een formulier en de rest gaat automatisch.',
          stats: [{ b: '60+', t: 'voorbeeldbestellingen in het systeem' }, { b: '5', t: 'bestelstatussen' }, { b: '3', t: 'automatische markeringen' }, { b: '€0', t: 'per maand aan software' }],
          did: [
            'Een bestelformulier met de productlijst, afhaaldatum en -tijd en opmerkingen',
            'Een bestelsheet waarin elke bestelling automatisch een nummer, prijs en totaal krijgt',
            'Statussen van nieuw tot opgehaald, met rijen die zichzelf markeren: vandaag ophalen, te laat, nog bevestigen',
            'Een dashboard: afhalingen vandaag, openstaande bestellingen, omzet van de laatste 7 en 30 dagen en topproducten',
            'Elke afhaling komt in Google Agenda, dus de dagplanning staat altijd op je telefoon',
          ],
          result: 'De bakkerij ziet in één oogopslag de afhalingen van vandaag, achterstallige bestellingen en de omzet, zonder te betalen voor software.',
          caps: ['Het formulier dat klanten invullen', 'Dashboard dat zichzelf bijwerkt', 'Bestelsheet met statussen en automatische markeringen', 'Afhalingen in Google Agenda'],
        },
      ],
    },
    sites: {
      label: 'Websites',
      h2: 'Websites die ik heb gebouwd',
      note: 'Werkende demo’s voor lokale bedrijven, in het Pools voor de Poolse markt. Klik om ze live te bekijken.',
      goLive: 'Bekijk live ↗',
      items: [
        { nazwa: 'Ogrodowa 3', bran: 'Restaurant', opis: 'Een elegante site met meerdere pagina’s: à la carte en degustatiemenu, wijnkaart, online reserveren en een draaiende 3D-wijnfles.', tagi: ['Meerdere pagina’s', 'Reserveren', '3D-model'] },
        { nazwa: 'OKTAN', bran: 'Autoservice', opis: 'Een stoere servicesite in carbonstijl met prijslijst, online afspraken, een galerij en een live nu-open status.', tagi: ['Prijslijst', 'Online afspraken', 'Live status'] },
        { nazwa: 'Kontur Nieruchomości', bran: 'Makelaar', opis: 'Aanbod met filteren, sorteren en een hypotheekcalculator, plus een bezichtigingsformulier met volledige AVG-tekst.', tagi: ['Aanbod filteren', 'Hypotheekcalculator'] },
        { nazwa: 'Prolog', bran: 'Café', opis: 'Een menu met categoriefilters, een digitale stempelkaart op de telefoon en een live nu-open status.', tagi: ['Menu met filters', 'Stempelkaart'] },
        { nazwa: 'Serwis Kołodziej', bran: 'Autowerkplaats', opis: 'Een rustige, premium versie van een werkplaats: een prijslijst voor arbeid met reparatietijden en een live bord met beschikbare bruggen.', tagi: ['Arbeidsprijzen', 'Beschikbare bruggen'] },
      ],
      project: { bran: 'Eigen project', nazwa: 'Fiches', opis: 'Een app om Frans te leren met flashcards die door AI worden gemaakt, gebouwd voor mezelf.', tagi: ['App', 'AI'], go: 'Openen ↗' },
    },
    certs: {
      label: 'Certificaten',
      h2: 'Aangetoonde vaardigheden',
      lede: 'Getest door HackerRank en Kaggle, dus je hoeft me niet op mijn woord te geloven.',
      view: 'Bekijk', verify: 'Verifieer ↗', earned: 'Behaald',
    },
    about: {
      label: 'Over mij',
      h2: 'Hoi, ik ben Antoni',
      p: [
        'Ik studeer Business Analytics, dus ik zit dagelijks tussen data, cijfers en de bedrijven daarachter. Met Vervo Studio zet ik dat in voor echte klanten.',
        'De meeste kleine bedrijven hebben geen groot IT-project nodig. Ze willen dat de spreadsheet klopt, dat bestellingen niet meer zoekraken en dat de website klanten oplevert. Precies dat soort werk vind ik leuk.',
        'Ik houd het simpel: ik leg in gewone taal uit wat ik ga doen, spreek de prijs vooraf af en lever bestanden op die volledig van jou zijn.',
      ],
      facts: [{ k: 'Studie', v: 'Business Analytics' }, { k: 'Talen', v: 'Pools, Engels' }, { k: 'Werkt', v: 'Op afstand, wereldwijd' }],
      why: [
        { b: 'Gewone taal', s: 'Geen jargon. Je weet altijd wat ik doe en waarom.' },
        { b: 'Vaste prijs', s: 'Afspraken en prijs vastgelegd voordat ik begin.' },
        { b: 'Gedocumenteerd', s: 'Je krijgt notities over wat er veranderd is en hoe je het gebruikt.' },
        { b: 'Van jou', s: 'Bestanden, code en data zijn van jou.' },
      ],
    },
    proces: {
      label: 'Werkwijze',
      h2: 'Zo werken we samen',
      steps: [
        { t: 'Vertel wat je nodig hebt', o: 'Stuur een bericht met het bestand, een link of een korte beschrijving. Screenshots zijn ook prima.' },
        { t: 'Vaste offerte', o: 'Ik laat weten wat ik ga doen, wat het kost en wanneer het klaar is. Geen verrassingen achteraf.' },
        { t: 'Ik ga aan de slag', o: 'Bij grotere opdrachten stuur ik tussendoor een preview, zodat je vroeg kunt bijsturen.' },
        { t: 'Oplevering', o: 'Je krijgt de bestanden met korte notities. Kleine aanpassingen na oplevering zijn inbegrepen.' },
      ],
    },
    faq: {
      label: 'FAQ',
      h2: 'Veelgestelde vragen',
      items: [
        { q: 'Kan ik via Fiverr bestellen?', a: 'Ja. Fiverr is de makkelijkste manier: je betaling is beschermd en je krijgt een duidelijke opleverdatum. Je kunt me ook direct schrijven via het formulier hieronder.' },
        { q: 'Wat heb je van mij nodig om te beginnen?', a: 'Het bestand of een kopie ervan, en een paar zinnen over wat je eruit wilt halen. Is iets onduidelijk, dan vraag ik het voordat ik begin.' },
        { q: 'Excel of Google Sheets?', a: 'Allebei. Ik werk in wat je al gebruikt. Twijfel je, dan stel ik voor wat het beste bij je team past.' },
        { q: 'Is mijn data veilig?', a: 'Ik gebruik je data alleen voor jouw project, deel het met niemand en verwijder mijn kopie na oplevering als je dat wilt. Bij gevoelige bestanden kun je een voorbeeld sturen zonder persoonsgegevens.' },
        { q: 'Hoe lang duurt het?', a: 'Dat hangt af van de omvang. Je krijgt een exacte opleverdatum in mijn offerte, voordat je iets betaalt.' },
        { q: 'Bouw je ook websites voor bedrijven buiten Polen?', a: 'Ja. Ik bouw sites in het Engels en het Pools en kan het domein en de hosting voor je regelen.' },
      ],
    },
    kontakt: {
      label: 'Contact',
      h2: 'Vertel me over je project',
      p: 'Beschrijf in een paar zinnen wat je nodig hebt. Meestal reageer ik binnen 24 uur met een plan, een prijs en een opleverdatum.',
      fiverrNote: 'Liever bestellen via Fiverr?',
      form: {
        imie: 'Naam', email: 'E-mail',
        need: 'Wat heb je nodig?', needChoose: 'Kies',
        needs: ['Excel-data opschonen of een rapport', 'Automatisering met Google Sheets / Forms', 'Een website', 'Data-analyse (SQL / Python)', 'Iets anders'],
        wiadomosc: 'Bericht', wiadomoscPlaceholder: 'Een paar zinnen over je project. Links naar bestanden zijn welkom.',
        consent: 'Ik ga akkoord met contact over mijn aanvraag.', submit: 'Verstuur bericht',
      },
    },
    footer: { tx: 'Vervo Studio is de freelance studio van Antoni Antczak. Data opschonen, spreadsheet-automatisering en websites voor kleine bedrijven.' },
    formMsgs: {
      subject: 'Nieuw bericht via vervostudio.com',
      incomplete: 'Vul de verplichte velden en toestemming in.',
      sending: 'Versturen…',
      ok: 'Bedankt! Je bericht is verstuurd, ik reageer meestal binnen 24 uur.',
      fail: 'Versturen mislukt. Schrijf rechtstreeks naar ',
    },
  },
};
