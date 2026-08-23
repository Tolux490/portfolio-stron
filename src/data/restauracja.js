// Treść restauracji Ogrodowa 3 — wszystko fikcyjne (demo do portfolio).
// Jedno miejsce na kartę, wina, opinie, wydarzenia i galerię.
// Zdjęcia: public/img/restauracja/*.webp

// ————————————————————————————————————————————————
//  KARTA (à la carte)
// ————————————————————————————————————————————————
export const menu = [
  {
    grupa: 'Na początek',
    opis: 'Małe formy do dzielenia i kieliszka na dobry początek.',
    dania: [
      { n: 'Tatar z polędwicy', o: 'żółtko konfitowane, ogórek małosolny, musztarda własnej roboty', c: '42', tag: 'sygnatura' },
      { n: 'Śledź w oleju rzepakowym', o: 'kiszone jabłko, koperek, cebula z octu', c: '28' },
      { n: 'Burak pieczony w soli', o: 'twaróg z koziego mleka, orzech laskowy, olej lubczykowy', c: '32', tag: 'wege' },
      { n: 'Ostrygi z Bretanii', o: 'szalotka w occie winnym, cytryna — sztuka', c: '18' },
      { n: 'Grzanka z podpłomyka', o: 'masło ziołowe, smalec gęsi, ogórek', c: '24' },
    ],
  },
  {
    grupa: 'Z pieca i garnka',
    opis: 'Zupy i ciepłe przystawki. Codziennie inna, w zależności od dostaw.',
    dania: [
      { n: 'Krem z pieczonej dyni', o: 'olej z pestek, grzanka żytnia, prażona kasza', c: '26', tag: 'wege' },
      { n: 'Rosół z kołdunami', o: 'gotowany na trzech mięsach, natka, marchew glazurowana', c: '30' },
      { n: 'Pierogi z kaszą gryczaną', o: 'twaróg, podsmażany boczek, cebula prażona', c: '38' },
    ],
  },
  {
    grupa: 'Dania główne',
    opis: 'Sedno karty. Sześć pozycji, zmienianych wraz z sezonem.',
    dania: [
      { n: 'Policzki wołowe', o: 'duszone w czerwonym winie, purée z selera, jarmuż', c: '68', tag: 'sygnatura' },
      { n: 'Pstrąg z pieca', o: 'koper włoski, masło cytrynowe, młode ziemniaki', c: '62' },
      { n: 'Kaczka z rożna', o: 'burak, wiśnia w porto, kopytka z pieca', c: '74' },
      { n: 'Comber jagnięcy', o: 'bób, czosnek niedźwiedzi, jus z rozmarynem', c: '86' },
      { n: 'Risotto z grzybami', o: 'borowik, parmezan dojrzewający 24 mies., estragon', c: '54', tag: 'wege' },
      { n: 'Dorsz konfitowany', o: 'soczewica beluga, chorizo, natka pietruszki', c: '70' },
    ],
  },
  {
    grupa: 'Na koniec',
    opis: 'Desery robimy sami, każdego dnia od nowa.',
    dania: [
      { n: 'Tarta czekoladowa', o: 'sorbet malinowy, coulis z owoców leśnych, kakao', c: '28', tag: 'sygnatura' },
      { n: 'Sernik pieczony', o: 'karmel solony, prażony orzech', c: '24' },
      { n: 'Beza z kremem mascarpone', o: 'sezonowe owoce, sos waniliowy', c: '26' },
      { n: 'Gruszka w korzeniach', o: 'lody śmietankowe, kruszonka piernikowa', c: '24' },
      { n: 'Deska serów', o: 'trzy sery zagrodowe, konfitura z cebuli, orzechy', c: '38' },
    ],
  },
];

// Menu degustacyjne
export const degustacja = {
  nazwa: 'Menu degustacyjne „Sezon”',
  opis: 'Siedem serwisów prowadzonych przez kuchnię, komponowanych z tego, co akurat najlepsze. Dostępne dla całego stołu, do wtorku prosimy o rezerwację.',
  cena: '260',
  paira: '160',
  serwisy: [
    'Powitanie od kuchni',
    'Burak, kozi twaróg, orzech',
    'Ostryga, szalotka, cytryna',
    'Rosół z kołdunami',
    'Pstrąg, koper włoski, cytryna',
    'Policzki wołowe, seler, jarmuż',
    'Tarta czekoladowa, malina',
  ],
};

// ————————————————————————————————————————————————
//  KARTA WIN
// ————————————————————————————————————————————————
export const wina = [
  {
    grupa: 'Musujące',
    pozycje: [
      { n: 'Crémant de Loire, Brut', reg: 'Dolina Loary, Francja', desc: 'chenin blanc, drobny mus, jabłko i brioche', kieliszek: '32', butelka: '180' },
      { n: 'Pét-Nat Winnica Turnau', reg: 'Zachodniopomorskie, Polska', desc: 'solaris, na naturalnym osadzie, gruszka', kieliszek: '34', butelka: '190' },
    ],
  },
  {
    grupa: 'Białe',
    pozycje: [
      { n: 'Riesling Trocken', reg: 'Mozela, Niemcy', desc: 'wytrawny, limonka, krzemień, długi finisz', kieliszek: '28', butelka: '150' },
      { n: 'Furmint', reg: 'Tokaj, Węgry', desc: 'gruszka, migdał, wyraźna mineralność', kieliszek: '26', butelka: '140' },
      { n: 'Grüner Veltliner', reg: 'Kamptal, Austria', desc: 'biały pieprz, zielone jabłko, świeżość', kieliszek: '30', butelka: '160' },
    ],
  },
  {
    grupa: 'Pomarańczowe i naturalne',
    pozycje: [
      { n: 'Rkatsiteli, maceracja skórkowa', reg: 'Kachetia, Gruzja', desc: 'w kvevri, suszona morela, herbata, tanina', kieliszek: '32', butelka: '175' },
      { n: 'Ryzlink, skin contact', reg: 'Morawy, Czechy', desc: 'niefiltrowane, pomarańcza, zioła, wosk', kieliszek: '30', butelka: '165' },
    ],
  },
  {
    grupa: 'Czerwone',
    pozycje: [
      { n: 'Blaufränkisch', reg: 'Burgenland, Austria', desc: 'wiśnia, pieprz, chłodna elegancja', kieliszek: '30', butelka: '160' },
      { n: 'Pinot Noir', reg: 'Badenia, Niemcy', desc: 'jagoda, poszycie leśne, jedwabista tanina', kieliszek: '36', butelka: '210' },
      { n: 'Zweigelt Winnica Płochockich', reg: 'Kujawsko-pomorskie, Polska', desc: 'śliwka, fiołek, lekki i pitki', kieliszek: '28', butelka: '150' },
    ],
  },
  {
    grupa: 'Na koniec wieczoru',
    pozycje: [
      { n: 'Tokaji Aszú 5 Puttonyos', reg: 'Tokaj, Węgry', desc: 'morela, miód, akacja — do serów i deserów', kieliszek: '38', butelka: '240' },
      { n: 'Porto Tawny 10 lat', reg: 'Douro, Portugalia', desc: 'orzech, karmel, suszona figa', kieliszek: '30', butelka: '200' },
    ],
  },
];

// ————————————————————————————————————————————————
//  OPINIE (wizytówka Google — fikcyjne)
// ————————————————————————————————————————————————
export const opinie = [
  { a: 'Magdalena P.', g: 5, kiedy: '2 tygodnie temu', lokalny: true, t: 'Karta na kilka pozycji brzmi ryzykownie, dopóki nie zjesz policzków wołowych. Wszystko smakuje, jakby ktoś gotował dla dziesięciu osób, nie dla stu. Obsługa doradziła wino idealnie.' },
  { a: 'Tomasz W.', g: 5, kiedy: 'miesiąc temu', lokalny: true, t: 'Byliśmy w środę na wejściu nowej karty — szef kuchni wyszedł na salę i opowiadał o każdym daniu. W Warszawie płaciłbym za to dwa razy tyle. Wracamy na menu degustacyjne.' },
  { a: 'Anna K.', g: 5, kiedy: 'miesiąc temu', lokalny: false, t: 'Najlepsza kolacja w tej okolicy od lat. Klimat świec i drewna, cicho, elegancko, bez zadęcia. Deser czekoladowy to poezja.' },
  { a: 'Piotr Zawadzki', g: 5, kiedy: '2 miesiące temu', lokalny: true, t: 'Rezerwacja telefoniczna, odebrali po dwóch sygnałach, stolik przy kominku dokładnie jak prosiłem. Wina naturalne, których nie znajdziesz nigdzie indziej w mieście.' },
  { a: 'Julia N.', g: 5, kiedy: '2 miesiące temu', lokalny: true, t: 'Świętowaliśmy rocznicę. Dostaliśmy powitanie od kuchni i kartkę z życzeniami. Detale, które robią różnicę. Pstrąg rozpływał się w ustach.' },
  { a: 'Marek Dąbrowski', g: 4, kiedy: '3 miesiące temu', lokalny: false, t: 'Bardzo dobre jedzenie i piękne wnętrze. Jedna gwiazdka mniej tylko za to, że trzeba rezerwować z wyprzedzeniem — ale rozumiem, miejsc jest niewiele.' },
  { a: 'Ewa Lorenc', g: 5, kiedy: '4 miesiące temu', lokalny: true, t: 'Kaczka z wiśnią w porto — zamawiam ją za każdym razem i za każdym razem jest równie dobra. Personel pamięta stałych gości. Czuć, że to miejsce z sercem.' },
  { a: 'Krzysztof B.', g: 5, kiedy: '5 miesięcy temu', lokalny: true, t: 'Kolacja degustacyjna z winami to było przeżycie na cały wieczór. Siedem dań, każde zaskakiwało. Sommelier wie, o czym mówi. Polecam każdemu.' },
  { a: 'Natalia S.', g: 5, kiedy: '6 miesięcy temu', lokalny: false, t: 'Wege wersje dań na życzenie i naprawdę przemyślane, nie na odczep. Risotto z borowikami zapamiętam na długo. Dziękuję za wieczór.' },
];

// ————————————————————————————————————————————————
//  WIECZORY / WYDARZENIA
// ————————————————————————————————————————————————
export const wydarzenia = [
  {
    t: 'Kolacja degustacyjna',
    kiedy: 'Ostatnia sobota miesiąca',
    d: 'Siedem dań w parach z winami. Dwadzieścia miejsc, jedno wspólne wejście o 19:00. Wieczór prowadzi szef kuchni razem z sommelierem.',
    m: '260 zł / os.',
    foto: 'danie-sygnatura',
  },
  {
    t: 'Środy z nową kartą',
    kiedy: 'W każdą środę',
    d: 'Pierwszy wieczór nowej karty tygodnia. Szef kuchni wychodzi na salę i opowiada, co się zmieniło i dlaczego. Bez dopłat, po prostu przyjdź.',
    m: 'bez dopłat',
    foto: 'kuchnia-akcja',
  },
  {
    t: 'Wieczory z winami naturalnymi',
    kiedy: 'Raz w miesiącu, czwartek',
    d: 'Spotkanie z winiarzem z małej winnicy — Polska, Morawy, Burgenland. Sześć win, przekąski od kuchni, rozmowa przy stole.',
    m: '140 zł / os.',
    foto: 'wino-kieliszki',
  },
  {
    t: 'Stół szefa kuchni',
    kiedy: 'Na zamówienie',
    d: 'Osobny stół z widokiem na kuchnię, do ośmiu osób. Menu układane pod Was, prowadzone danie po daniu prosto z wydawki.',
    m: 'wycena indywidualna',
    foto: 'kuchnia-pinceta',
  },
];

// Prywatne okazje
export const prywatne = [
  { t: 'Cała sala na wyłączność', d: 'Do 34 osób przy stołach, do 50 w formule koktajlowej. Urodziny, rocznice, kolacje firmowe.' },
  { t: 'Menu ustalane wcześniej', d: 'Wybieracie 3, 5 lub 7 dań. Wersje wege, bezglutenowe i alergie ustalamy przy rezerwacji.' },
  { t: 'Własne wino za korkowe', d: 'Macie butelkę na specjalną okazję? Możecie ją przynieść — otwieramy i podajemy za 40 zł od butelki.' },
];

// ————————————————————————————————————————————————
//  GALERIA
// ————————————————————————————————————————————————
export const galeria = [
  { src: 'wnetrze-kominek', alt: 'Sala z kominkiem wieczorem', ratio: '2/3', tag: 'Wnętrze' },
  { src: 'danie-sygnatura', alt: 'Sygnaturowy deser z coulis', ratio: '2/3', tag: 'Talerz' },
  { src: 'wino-kieliszki', alt: 'Kieliszki wina naturalnego', ratio: '3/4', tag: 'Wino' },
  { src: 'kuchnia-akcja', alt: 'Serwis w kuchni', ratio: '3/2', tag: 'Kuchnia' },
  { src: 'stol-nakrycie', alt: 'Nakryty stół przy oknie', ratio: '2/3', tag: 'Wnętrze' },
  { src: 'deser-pancake', alt: 'Deser na eleganckim nakryciu', ratio: '16/9', tag: 'Talerz' },
  { src: 'wnetrze-fotele', alt: 'Fotele i drewno na sali', ratio: '2/3', tag: 'Wnętrze' },
  { src: 'kuchnia-pinceta', alt: 'Wykończenie dania pincetą', ratio: '2/3', tag: 'Kuchnia' },
  { src: 'piwnica-win', alt: 'Półki z winami', ratio: '3/2', tag: 'Wino' },
  { src: 'deser-turkus', alt: 'Deser na turkusowym talerzu', ratio: '3/4', tag: 'Talerz' },
  { src: 'szef-kuchni', alt: 'Szef kuchni przy wydawce', ratio: '3/2', tag: 'Kuchnia' },
  { src: 'gosc-stolik', alt: 'Gość przy stoliku', ratio: '2/3', tag: 'Wnętrze' },
  { src: 'sernik-dwoje', alt: 'Sernik podany do stołu', ratio: '3/2', tag: 'Talerz' },
  { src: 'wnetrze-okno', alt: 'Sala przy dużym oknie', ratio: '2/3', tag: 'Wnętrze' },
  { src: 'petit-fours', alt: 'Petit fours na koniec', ratio: '2/3', tag: 'Talerz' },
  { src: 'deser-owoce', alt: 'Deser z owocami sezonowymi', ratio: '3/2', tag: 'Talerz' },
];

// ————————————————————————————————————————————————
//  ZESPÓŁ
// ————————————————————————————————————————————————
export const zespol = [
  { imie: 'Jan Ogrodowy', rola: 'Szef kuchni i współwłaściciel', o: 'Wcześniej w kuchniach Warszawy i Kopenhagi. Wrócił do Wołomina, żeby gotować z tego, co rośnie obok.' },
  { imie: 'Weronika Malec', rola: 'Sommelierka', o: 'Prowadzi kartę win naturalnych. Dobiera kieliszek do każdego dania — pytaj śmiało, doradza bez zadęcia.' },
  { imie: 'Adam Rey', rola: 'Kierownik sali', o: 'Dba, żeby wieczór miał rytm. Zna stałych gości po imieniu i pamięta ich ulubiony stolik.' },
];

// ————————————————————————————————————————————————
//  FAQ
// ————————————————————————————————————————————————
export const faq = [
  { q: 'Jak zarezerwować stolik?', a: 'Najprościej telefonicznie — przy kilkunastu stolikach telefon jest szybszy niż cokolwiek. Odbieramy od 15:00. Możesz też wysłać prośbę przez formularz, potwierdzimy ją tego samego dnia roboczego.' },
  { q: 'Czy macie dania wegetariańskie?', a: 'Tak. Kilka pozycji w karcie jest bezmięsnych, a większość dań przygotujemy w wersji wege, jeśli wspomnisz o tym przy rezerwacji.' },
  { q: 'Czy dostosowujecie menu do alergii?', a: 'Tak, o alergiach i nietolerancjach powiedz przy rezerwacji albo obsłudze na miejscu. Kuchnia dobierze dania i zamienniki.' },
  { q: 'Czy można przyjść z dziećmi?', a: 'Oczywiście. Mamy krzesełka i mniejsze porcje wybranych dań. Wieczory degustacyjne są jednak pomyślane dla dorosłych.' },
  { q: 'Czy przyjmujecie większe grupy?', a: 'Do ośmiu osób rezerwujemy standardowo. Grupy powyżej ośmiu osób i sala na wyłączność — mailowo, ustalimy menu i termin.' },
  { q: 'Czy mogę przynieść własne wino?', a: 'Tak, za korkowe 40 zł od butelki. Jeśli masz coś wyjątkowego na specjalną okazję — chętnie otworzymy i podamy w odpowiednich kieliszkach.' },
];
