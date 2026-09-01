/* =====================================================================
   ULUBIONA LODY — v2 (premium pop-art)
   DANE + KONFIGURACJA. To jedyne miejsce, które podmieniasz.
   ===================================================================== */

const CONFIG = {
  /* --- CMS smaków przez Arkusz Google ---
     1. Zrób arkusz z kolumnami: smak | opis | tag | widoczny | + kolumna na KAŻDY lokal
        Nagłówki lokali: Kobyłka | Zielonka | Marki | Radzymin | Wołomin Piłsudskiego |
        Wołomin Kościelna | Białołęka | Targówek  (opcjonalnie kolumna "Wszystkie").
        W kolumnie lokalu wstaw "x" lub checkbox = smak jest dziś w tym lokalu.
        Pusto we wszystkich lokalach = smak wszędzie. "widoczny" = tak/nie (ukrycie smaku).
        (Zgodność wstecz: działa też stara kolumna "lokal" z jedną wartością lub listą po przecinku.)
     2. Plik → Udostępnij → Opublikuj w internecie → wybierz arkusz, format CSV.
     3. Wklej tutaj otrzymany link CSV.
     Puste = tryb pokazowy (strona używa smaków z listy FLAVORS poniżej). */
  flavorsSheetCsvUrl: "",

  /* --- Formularze (kontakt / rezerwacja / newsletter) przez web3forms.com ---
     Załóż darmowy klucz na web3forms.com i wklej tutaj.
     Puste = tryb pokazowy (walidacja działa, nic nie wysyła). */
  formKey: ""
};

const SITE = {
  name: "Nazwa lodziarni",
  tagline: "Krótki podtytuł marki",
  phone: "+48 000 000 000",
  email: "kontakt@twojadomena.pl",
  instagram: "",
  facebook: "",
  wwwLabel: "twojadomena.pl"
};

/* Godziny: [openH, openM, closeH, closeM] dla dni powszednich i weekendu. */
function makeHours(weekday, weekend) {
  const fmt = (h, m) => String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  const range = (a) => fmt(a[0], a[1]) + "–" + fmt(a[2], a[3]);
  const same = weekday.join() === weekend.join();
  const rows = same
    ? [["pon.–niedz.", range(weekday)]]
    : [["pon.–pt.", range(weekday)], ["sob.–niedz.", range(weekend)]];
  return { weekday, weekend, rows };
}

/* --------  LOKALE (8)  -------- */
const LOCATIONS = [
  {
    id: "lokal-1", name: "Lokal 1", city: "Miasto", flagship: true,
    address: "ul. Przykładowa 1, 00-000 Miasto",
    mapsQuery: "",
    intro: "Krótki opis lokalu. Wpisz tu kilka zdań o tym miejscu i jego atmosferze.",
    hero: "", gallery: [],
    hours: makeHours([11, 0, 20, 0], [11, 0, 20, 0]),
    instagram: "", facebook: ""
  },
  {
    id: "lokal-2", name: "Lokal 2", city: "Miasto",
    address: "ul. Przykładowa 2, 00-000 Miasto",
    mapsQuery: "",
    intro: "Krótki opis lokalu. Wpisz tu kilka zdań o tym miejscu.",
    hero: "", gallery: [],
    hours: makeHours([12, 0, 19, 0], [11, 0, 19, 0]),
    instagram: "", facebook: ""
  },
  {
    id: "lokal-3", name: "Lokal 3", city: "Miasto",
    address: "ul. Przykładowa 3, 00-000 Miasto",
    mapsQuery: "",
    intro: "Krótki opis lokalu. Wpisz tu kilka zdań o tym miejscu.",
    hero: "", gallery: [],
    hours: makeHours([12, 0, 19, 0], [11, 0, 19, 30]),
    instagram: "", facebook: ""
  }
];

function openStatus(loc) {
  const h = loc.hours; if (!h) return null;
  const now = new Date();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;
  const t = isWeekend ? h.weekend : h.weekday;
  const cur = now.getHours() * 60 + now.getMinutes();
  const open = t[0] * 60 + t[1], close = t[2] * 60 + t[3];
  const fmt = (hh, mm) => String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
  if (cur >= open && cur < close) return { open: true, text: "Otwarte do " + fmt(t[2], t[3]) };
  if (cur < open) return { open: false, text: "Otwarcie o " + fmt(t[0], t[1]) };
  return { open: false, text: "Zamknięte" };
}

/* --------  SMAKI — lista zapasowa (gdy nie ma podpiętego arkusza)  -------- */
const FLAVORS = [
  { name: "Pistacja z Bronte", desc: "Sycylijska pistacja, prażona i mielona u nas.", tag: "klasyk" },
  { name: "Śmietankowa", desc: "Naturalna baza na śmietanie i mleku.", tag: "klasyk" },
  { name: "Czekolada belgijska", desc: "Ciemna i aksamitna, z prawdziwej czekolady.", tag: "" },
  { name: "Słony karmel", desc: "Domowy karmel z nutą morskiej soli.", tag: "hit" },
  { name: "Truskawka", desc: "Z sezonowych, dojrzałych truskawek.", tag: "owocowy" },
  { name: "Malina ze śmietanką", desc: "Kwaskowa malina w kremowej bazie.", tag: "" },
  { name: "Mango i marakuja", desc: "Orzeźwiający sorbet bez laktozy.", tag: "sorbet" },
  { name: "Bakaliowa", desc: "Migdały, orzechy i bakalie.", tag: "" },
  { name: "Wanilia z Madagaskaru", desc: "Z prawdziwą laską wanilii.", tag: "" },
  { name: "Cytryna", desc: "Wytrawny sorbet na upalne dni.", tag: "sorbet" }
];

/* --------  CENNIK  -------- */
const PRICING = [
  {
    title: "Lody gałkowe", note: "1 porcja = 1 smak",
    items: [
      { name: "Porcja duża", sub: "ok. 80 g", val: "7,50 zł" },
      { name: "Porcja Kids", sub: "ok. 40 g", val: "5,00 zł" },
      { name: "Wafelek wypiekany", sub: "", val: "2,00 zł" },
      { name: "Wafelek bezglutenowy", sub: "", val: "2,50 zł" }
    ]
  },
  {
    title: "Lody włoskie", note: "śmietankowe",
    items: [
      { name: "Mały", sub: "", val: "7,50 zł" },
      { name: "Classic", sub: "", val: "10,00 zł" },
      { name: "XXL", sub: "", val: "15,00 zł" },
      { name: "Deser Fantazja", sub: "lód, polewa, posypka", val: "10,00 zł" }
    ]
  },
  {
    title: "Kawa z palarni", note: "100% arabica",
    items: [
      { name: "Espresso", sub: "", val: "7,00 zł" },
      { name: "Kawa czarna", sub: "", val: "8,00 zł" },
      { name: "Cappuccino", sub: "", val: "11,00 zł" },
      { name: "Kawa mrożona", sub: "z lodami", val: "14,00 zł" }
    ]
  }
];

/* --------  SKLEP: kawa ziarnista z palarni  -------- */
const COFFEE = [
  { name: "Arabica Colombia", variant: "ziarno", weight: "500 g", price: "49 zł", desc: "Nasz sztandarowy blend z własnej palarni. Nuty czekolady i orzechów, łagodna kwasowość." },
  { name: "Arabica Colombia", variant: "mielona", weight: "500 g", price: "44 zł", desc: "Ta sama kawa, zmielona pod ekspres przelewowy albo kawiarkę." },
  { name: "Zestaw prezentowy", variant: "ziarno + kartka", weight: "500 g", price: "59 zł", desc: "Kawa w ozdobnym opakowaniu z życzeniami. Gotowy prezent." }
];

/* --------  OPINIE (podsumowanie z wizytówki Google — do podmiany)  -------- */
const REVIEWS_SUMMARY = { rating: 4.8, count: 1240, url: "" };
const REVIEWS = [
  { author: "Magda K.", text: "Najlepsze lody w okolicy. Pistacja smakuje jak we Włoszech, a porcje są ogromne.", stars: 5 },
  { author: "Piotr W.", text: "Przyjeżdżamy całą rodziną z Warszawy specjalnie po te lody. Zawsze świeże i naturalne.", stars: 5 },
  { author: "Ola S.", text: "Sorbet mango i marakuja to mistrzostwo. Do tego kawa z ich palarni. Polecam w ciemno.", stars: 5 },
  { author: "Tomek R.", text: "Codziennie inne smaki, więc zawsze jest po co wracać. Obsługa mila, kolejka schodzi szybko.", stars: 4 }
];

/* --------  FAQ  -------- */
const FAQ = [
  { q: "Czy macie lody bezglutenowe?", a: "Tak. Oferujemy wafelki bezglutenowe, a większość naszych smaków jest bez glutenu. Zapytaj obsługę o aktualną listę." },
  { q: "Czy są smaki wegańskie i bez laktozy?", a: "Tak. Nasze sorbety owocowe są bez mleka i laktozy. Codziennie mamy przynajmniej kilka wegańskich pozycji." },
  { q: "Skąd wiem, jakie smaki są dziś dostępne?", a: "Tablica smaków na stronie aktualizuje się na bieżąco. Najświeższe informacje znajdziesz też na naszym Instagramie." },
  { q: "Robicie torty lodowe i zamówienia na eventy?", a: "Tak. Przyjmujemy zamówienia na torty lodowe i catering. Napisz przez formularz, a ustalimy szczegóły." },
  { q: "Czy można płacić kartą?", a: "We wszystkich lokalach przyjmujemy płatności kartą i BLIK-iem." }
];

/* --------  IKONY (inline SVG, stroke 1.7)  -------- */
const ICON = {
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  nav: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/></svg>',
  cone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10a4 4 0 0 1 8 0"/><circle cx="9.5" cy="8.5" r="2.2"/><circle cx="14.5" cy="8.5" r="2.2"/><path d="M8 11h8l-4 11-4-11Z"/></svg>',
  coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z"/><path d="M17 10h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M7 5c0-1 .5-1.5.5-2.5M11 5c0-1 .5-1.5.5-2.5"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 15-9 0 7-3 15-9 15Z"/><path d="M4 20c2-3 5-6 8-8"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1Z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>'
};

function mapsDirections(loc) { return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(loc.mapsQuery); }
function mapsEmbed(loc) { return "https://www.google.com/maps?q=" + encodeURIComponent(loc.mapsQuery) + "&z=15&output=embed"; }
