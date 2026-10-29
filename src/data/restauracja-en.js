// Ogrodowa 3 — angielska wersja treści z restauracja.js (te same nazwy eksportów i ten sam układ).
// Ceny zostają w złotówkach; nazwy własne (winnice, regiony, osoby) bez zmian.

// ————————————————————————————————————————————————
//  MENU (à la carte)
// ————————————————————————————————————————————————
export const menu = [
  {
    grupa: 'To start',
    opis: 'Small plates to share, with a glass, to begin the evening.',
    dania: [
      { n: 'Beef tenderloin tartare', o: 'confit egg yolk, half-sour cucumber, house mustard', c: '42', tag: 'sygnatura' },
      { n: 'Herring in rapeseed oil', o: 'fermented apple, dill, pickled onion', c: '28' },
      { n: 'Salt-baked beetroot', o: 'goat\'s milk curd cheese, hazelnut, lovage oil', c: '32', tag: 'wege' },
      { n: 'Brittany oysters', o: 'shallot in wine vinegar, lemon, price per piece', c: '18' },
      { n: 'Flatbread toast', o: 'herb butter, goose dripping, pickled cucumber', c: '24' },
    ],
  },
  {
    grupa: 'From the oven and the pot',
    opis: 'Soups and warm starters. A different one every day, depending on deliveries.',
    dania: [
      { n: 'Roasted pumpkin soup', o: 'pumpkin seed oil, rye croutons, toasted groats', c: '26', tag: 'wege' },
      { n: 'Consommé with kołduny dumplings', o: 'made with three meats, parsley, glazed carrot', c: '30' },
      { n: 'Buckwheat pierogi', o: 'curd cheese, crispy bacon, fried onion', c: '38' },
    ],
  },
  {
    grupa: 'Mains',
    opis: 'The heart of the menu. Six dishes that change with the season.',
    dania: [
      { n: 'Beef cheeks', o: 'braised in red wine, celeriac purée, kale', c: '68', tag: 'sygnatura' },
      { n: 'Oven-baked trout', o: 'fennel, lemon butter, new potatoes', c: '62' },
      { n: 'Spit-roasted duck', o: 'beetroot, cherries in port, oven-baked potato dumplings', c: '74' },
      { n: 'Saddle of lamb', o: 'broad beans, wild garlic, rosemary jus', c: '86' },
      { n: 'Mushroom risotto', o: 'porcini, 24-month Parmesan, tarragon', c: '54', tag: 'wege' },
      { n: 'Confit cod', o: 'beluga lentils, chorizo, flat-leaf parsley', c: '70' },
    ],
  },
  {
    grupa: 'To finish',
    opis: 'We make our desserts ourselves, fresh every day.',
    dania: [
      { n: 'Chocolate tart', o: 'raspberry sorbet, forest fruit coulis, cocoa', c: '28', tag: 'sygnatura' },
      { n: 'Baked cheesecake', o: 'salted caramel, toasted nuts', c: '24' },
      { n: 'Meringue with mascarpone cream', o: 'seasonal fruit, vanilla sauce', c: '26' },
      { n: 'Spiced pear', o: 'cream ice cream, gingerbread crumble', c: '24' },
      { n: 'Cheese board', o: 'three farmhouse cheeses, onion jam, nuts', c: '38' },
    ],
  },
];

// Tasting menu
export const degustacja = {
  nazwa: 'Tasting menu "Season"',
  opis: 'Seven courses led by the kitchen, built from whatever is best at the moment. Served to the whole table; please book by Tuesday.',
  cena: '260',
  paira: '160',
  serwisy: [
    'A welcome from the kitchen',
    'Beetroot, goat\'s curd, hazelnut',
    'Oyster, shallot, lemon',
    'Consommé with kołduny dumplings',
    'Trout, fennel, lemon',
    'Beef cheeks, celeriac, kale',
    'Chocolate tart, raspberry',
  ],
};

// ————————————————————————————————————————————————
//  WINE LIST
// ————————————————————————————————————————————————
export const wina = [
  {
    grupa: 'Sparkling',
    pozycje: [
      { n: 'Crémant de Loire, Brut', reg: 'Loire Valley, France', desc: 'chenin blanc, fine mousse, apple and brioche', kieliszek: '32', butelka: '180' },
      { n: 'Pét-Nat Winnica Turnau', reg: 'West Pomerania, Poland', desc: 'solaris, bottled on its natural lees, pear', kieliszek: '34', butelka: '190' },
    ],
  },
  {
    grupa: 'White',
    pozycje: [
      { n: 'Riesling Trocken', reg: 'Mosel, Germany', desc: 'dry, lime, flint, long finish', kieliszek: '28', butelka: '150' },
      { n: 'Furmint', reg: 'Tokaj, Hungary', desc: 'pear, almond, distinct minerality', kieliszek: '26', butelka: '140' },
      { n: 'Grüner Veltliner', reg: 'Kamptal, Austria', desc: 'white pepper, green apple, freshness', kieliszek: '30', butelka: '160' },
    ],
  },
  {
    grupa: 'Orange and natural',
    pozycje: [
      { n: 'Rkatsiteli, skin maceration', reg: 'Kakheti, Georgia', desc: 'made in qvevri, dried apricot, tea, tannin', kieliszek: '32', butelka: '175' },
      { n: 'Ryzlink, skin contact', reg: 'Moravia, Czechia', desc: 'unfiltered, orange, herbs, wax', kieliszek: '30', butelka: '165' },
    ],
  },
  {
    grupa: 'Red',
    pozycje: [
      { n: 'Blaufränkisch', reg: 'Burgenland, Austria', desc: 'cherry, pepper, cool elegance', kieliszek: '30', butelka: '160' },
      { n: 'Pinot Noir', reg: 'Baden, Germany', desc: 'berries, forest floor, silky tannins', kieliszek: '36', butelka: '210' },
      { n: 'Zweigelt Winnica Płochockich', reg: 'Kuyavia-Pomerania, Poland', desc: 'plum, violet, light and easy-drinking', kieliszek: '28', butelka: '150' },
    ],
  },
  {
    grupa: 'To end the evening',
    pozycje: [
      { n: 'Tokaji Aszú 5 Puttonyos', reg: 'Tokaj, Hungary', desc: 'apricot, honey, acacia, for cheese and desserts', kieliszek: '38', butelka: '240' },
      { n: 'Tawny Port 10 Years', reg: 'Douro, Portugal', desc: 'walnut, caramel, dried fig', kieliszek: '30', butelka: '200' },
    ],
  },
];

// ————————————————————————————————————————————————
//  REVIEWS (Google listing — fictional)
// ————————————————————————————————————————————————
export const opinie = [
  { a: 'Magdalena P.', g: 5, kiedy: '2 weeks ago', lokalny: true, t: 'A menu of just a few dishes sounds risky until you taste the beef cheeks. Everything tastes like someone is cooking for ten people, not a hundred. The staff recommended the perfect wine.' },
  { a: 'Tomasz W.', g: 5, kiedy: 'a month ago', lokalny: true, t: 'We came on a Wednesday when the new menu launched. The head chef came out and talked us through every dish. In Warsaw I would pay twice as much for this. Coming back for the tasting menu.' },
  { a: 'Anna K.', g: 5, kiedy: 'a month ago', lokalny: false, t: 'The best dinner in the area in years. Candles and wood, quiet, elegant and not stuffy. The chocolate dessert is poetry.' },
  { a: 'Piotr Zawadzki', g: 5, kiedy: '2 months ago', lokalny: true, t: 'Booked by phone, they picked up after two rings, and we got the table by the fireplace exactly as I asked. Natural wines you will not find anywhere else in town.' },
  { a: 'Julia N.', g: 5, kiedy: '2 months ago', lokalny: true, t: 'We were celebrating our anniversary. We got a welcome from the kitchen and a card with best wishes. Small details that make a difference. The trout melted in the mouth.' },
  { a: 'Marek Dąbrowski', g: 4, kiedy: '3 months ago', lokalny: false, t: 'Very good food and a beautiful interior. One star off only because you have to book well ahead, but I understand, there are not many tables.' },
  { a: 'Ewa Lorenc', g: 5, kiedy: '4 months ago', lokalny: true, t: 'I order the duck with cherries in port every time, and every time it is just as good. The staff remember regulars. You can tell this place has heart.' },
  { a: 'Krzysztof B.', g: 5, kiedy: '5 months ago', lokalny: true, t: 'The tasting dinner with wine pairing was an experience for the whole evening. Seven courses, each one a surprise. The sommelier knows what she is talking about. Highly recommended.' },
  { a: 'Natalia S.', g: 5, kiedy: '6 months ago', lokalny: false, t: 'Vegetarian versions of dishes on request, and genuinely thought through, not an afterthought. I will remember the porcini risotto for a long time. Thank you for the evening.' },
];

// ————————————————————————————————————————————————
//  EVENINGS / EVENTS
// ————————————————————————————————————————————————
export const wydarzenia = [
  {
    t: 'Tasting dinner',
    kiedy: 'Last Saturday of the month',
    d: 'Seven courses paired with wines. Twenty seats, one shared start at 19:00. The evening is hosted by the head chef together with the sommelier.',
    m: 'PLN 260 / person',
    foto: 'danie-sygnatura',
  },
  {
    t: 'New menu Wednesdays',
    kiedy: 'Every Wednesday',
    d: 'The first evening of the week\'s new menu. The head chef comes out to the dining room and explains what has changed and why. No extra charge, just come along.',
    m: 'no extra charge',
    foto: 'kuchnia-akcja',
  },
  {
    t: 'Natural wine evenings',
    kiedy: 'Once a month, on a Thursday',
    d: 'Meet a winemaker from a small vineyard: Poland, Moravia or Burgenland. Six wines, small plates from the kitchen and conversation around the table.',
    m: 'PLN 140 / person',
    foto: 'wino-kieliszki',
  },
  {
    t: 'Chef\'s table',
    kiedy: 'On request',
    d: 'A separate table overlooking the kitchen, for up to eight guests. A menu built around you, served course by course straight from the pass.',
    m: 'priced individually',
    foto: 'kuchnia-pinceta',
  },
];

// Private occasions
export const prywatne = [
  { t: 'The whole dining room to yourselves', d: 'Up to 34 seated guests, up to 50 for a standing reception. Birthdays, anniversaries, company dinners.' },
  { t: 'Menu agreed in advance', d: 'Choose 3, 5 or 7 courses. Vegetarian and gluten-free versions and allergies are arranged when you book.' },
  { t: 'Bring your own wine', d: 'Have a bottle for a special occasion? Bring it along; we will open and serve it for a corkage fee of PLN 40 per bottle.' },
];

// ————————————————————————————————————————————————
//  GALLERY
// ————————————————————————————————————————————————
export const galeria = [
  { src: 'wnetrze-kominek', alt: 'The dining room with the fireplace in the evening', ratio: '2/3', tag: 'Interior' },
  { src: 'danie-sygnatura', alt: 'Signature dessert with coulis', ratio: '2/3', tag: 'Plates' },
  { src: 'wino-kieliszki', alt: 'Glasses of natural wine', ratio: '3/4', tag: 'Wine' },
  { src: 'kuchnia-akcja', alt: 'Service in the kitchen', ratio: '3/2', tag: 'Kitchen' },
  { src: 'stol-nakrycie', alt: 'A table laid by the window', ratio: '2/3', tag: 'Interior' },
  { src: 'deser-pancake', alt: 'A dessert on an elegant table setting', ratio: '16/9', tag: 'Plates' },
  { src: 'wnetrze-fotele', alt: 'Armchairs and wood in the dining room', ratio: '2/3', tag: 'Interior' },
  { src: 'kuchnia-pinceta', alt: 'Finishing a dish with tweezers', ratio: '2/3', tag: 'Kitchen' },
  { src: 'piwnica-win', alt: 'Wine shelves', ratio: '3/2', tag: 'Wine' },
  { src: 'deser-turkus', alt: 'A dessert on a turquoise plate', ratio: '3/4', tag: 'Plates' },
  { src: 'szef-kuchni', alt: 'The head chef at the pass', ratio: '3/2', tag: 'Kitchen' },
  { src: 'gosc-stolik', alt: 'A guest at a table', ratio: '2/3', tag: 'Interior' },
  { src: 'sernik-dwoje', alt: 'Cheesecake served at the table', ratio: '3/2', tag: 'Plates' },
  { src: 'wnetrze-okno', alt: 'The dining room by the large window', ratio: '2/3', tag: 'Interior' },
  { src: 'petit-fours', alt: 'Petit fours to finish', ratio: '2/3', tag: 'Plates' },
  { src: 'deser-owoce', alt: 'A dessert with seasonal fruit', ratio: '3/2', tag: 'Plates' },
];

// ————————————————————————————————————————————————
//  TEAM
// ————————————————————————————————————————————————
export const zespol = [
  { imie: 'Jan Ogrodowy', rola: 'Head chef and co-owner', o: 'Previously in kitchens in Warsaw and Copenhagen. Came back to Wołomin to cook with what grows nearby.' },
  { imie: 'Weronika Malec', rola: 'Sommelier', o: 'Runs the natural wine list and pairs a glass with every dish. Ask away; she gives advice without any pretension.' },
  { imie: 'Adam Rey', rola: 'Restaurant manager', o: 'Makes sure the evening has a rhythm. Knows the regulars by name and remembers their favourite table.' },
];

// ————————————————————————————————————————————————
//  FAQ
// ————————————————————————————————————————————————
export const faq = [
  { q: 'How do I book a table?', a: 'Calling is easiest; with just over a dozen tables it is the quickest way. We answer from 15:00. You can also send a request through the form and we will confirm it the same working day.' },
  { q: 'Do you have vegetarian dishes?', a: 'Yes. Several dishes on the menu are meat-free, and we can prepare most others in a vegetarian version if you mention it when booking.' },
  { q: 'Can you adapt the menu for allergies?', a: 'Yes. Tell us about allergies and intolerances when you book or let the staff know on the day. The kitchen will suggest dishes and substitutes.' },
  { q: 'Can I come with children?', a: 'Of course. We have high chairs and smaller portions of selected dishes. The tasting evenings, however, are designed for adults.' },
  { q: 'Do you take larger groups?', a: 'We take standard bookings for up to eight people. For groups of more than eight, or the whole room, email us and we will agree the menu and date.' },
  { q: 'Can I bring my own wine?', a: 'Yes, with a corkage fee of PLN 40 per bottle. If you have something special for an occasion, we will gladly open it and serve it in the right glasses.' },
];
