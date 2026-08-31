// Dane firmy — jedyne miejsce, które podmieniasz przy nowym kliencie.
// Wszystko poniżej jest fikcyjne (demo do portfolio).

export const mechanik = {
  name: 'Serwis Kołodziej',
  legalName: 'Serwis Kołodziej Marek Kołodziej',
  tagline: 'Diagnostyka i mechanika aut osobowych. Wołomin, od 2011 roku.',
  phone: '+48 123 456 789',
  email: 'kontakt@serwiskolodziej.example',
  street: 'ul. Lipińska 14',
  zip: '05-200',
  city: 'Wołomin',
  nip: '1250000000',
  mapUrl: 'https://maps.google.com/?q=Wołomin+Lipińska+14',
  slug: 'mechanik',
  schemaType: 'AutoRepair',
  openingHours: ['Mo-Fr 08:00-18:00', 'Sa 08:00-13:00'],
  hours: ['pon.–pt. 8:00–18:00', 'sob. 8:00–13:00', 'niedz. nieczynne'],
};

export const restauracja = {
  name: 'Ogrodowa 3',
  legalName: 'Ogrodowa 3 Sp. z o.o.',
  tagline: 'Kuchnia sezonowa i wina naturalne. Wołomin, po zmroku.',
  phone: '+48 123 456 789',
  email: 'rezerwacje@ogrodowa3.example',
  street: 'ul. Ogrodowa 3',
  zip: '05-200',
  city: 'Wołomin',
  nip: '1250000001',
  mapUrl: 'https://maps.google.com/?q=Wołomin+Ogrodowa+3',
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  // Klucz z web3forms.com — wklej, żeby formularz rezerwacji realnie wysyłał maile.
  // Puste = tryb pokazowy (walidacja działa, nic nie wychodzi na zewnątrz).
  formKey: '',
  slug: 'restauracja',
  schemaType: 'Restaurant',
  cuisine: 'Polish, seasonal',
  priceRange: '$$$',
  // Podsumowanie z wizytówki Google — fikcyjne, do demo portfolio.
  googleRating: 4.9,
  googleCount: 348,
  googleUrl: 'https://maps.google.com/?q=Wołomin+Ogrodowa+3',
  openingHours: ['We-Sa 16:00-22:00', 'Su 12:00-18:00'],
  hours: ['śr.–sob. 16:00–22:00', 'niedz. 12:00–18:00', 'pon.–wt. nieczynne'],
};

export const nieruchomosci = {
  name: 'Kontur Nieruchomości',
  legalName: 'Kontur Nieruchomości Sp. z o.o.',
  tagline: 'Sprzedaż mieszkań i domów w powiecie wołomińskim.',
  phone: '+48 123 456 789',
  email: 'biuro@kontur-nieruchomosci.example',
  street: 'ul. Legionów 8/3',
  zip: '05-200',
  city: 'Wołomin',
  nip: '1250000002',
  mapUrl: 'https://maps.google.com/?q=Wołomin+Legionów+8',
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  // Klucz z web3forms.com — wklej, żeby formularz zaczął realnie wysyłać.
  // Puste = tryb pokazowy (walidacja działa, nic nie wychodzi na zewnątrz).
  formKey: '',
  slug: 'nieruchomosci',
  schemaType: 'RealEstateAgent',
  openingHours: ['Mo-Fr 09:00-17:00'],
  hours: ['pon.–pt. 9:00–17:00', 'sob. po umówieniu', 'niedz. nieczynne'],
};

export const kawiarnia = {
  name: 'Prolog',
  legalName: 'Prolog Kawiarnia Sp. z o.o.',
  tagline: 'Kawa speciality, matcha i wypieki własne. Wołomin.',
  phone: '+48 123 456 789',
  email: 'czesc@prolog.example',
  street: 'ul. Kościelna 7',
  zip: '05-200',
  city: 'Wołomin',
  nip: '1250000003',
  mapUrl: 'https://maps.google.com/?q=Wołomin+Kościelna+7',
  // Podmień na prawdziwe profile klienta:
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  slug: 'kawiarnia',
  schemaType: 'CafeOrCoffeeShop',
  openingHours: ['Mo-Fr 07:30-18:00', 'Sa-Su 09:00-17:00'],
  hours: ['pon.–pt. 7:30–18:00', 'sob.–niedz. 9:00–17:00'],
};

export const oktan = {
  name: 'OKTAN',
  legalName: 'OKTAN Serwis Sp. z o.o.',
  tagline: 'Serwis samochodowy w Warszawie. Wszystkie marki, uczciwa wycena z góry.',
  phone: '+48 123 456 789',
  email: 'kontakt@oktanserwis.example',
  street: 'ul. Grochowska 210',
  zip: '04-077',
  city: 'Warszawa',
  nip: '1130000000',
  mapUrl: 'https://maps.google.com/?q=Warszawa+Grochowska+210',
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  // Klucz z web3forms.com — wklej, żeby formularz umawiania wizyt realnie wysyłał maile.
  // Puste = tryb pokazowy (walidacja działa, nic nie wychodzi na zewnątrz).
  formKey: '',
  slug: 'oktan',
  schemaType: 'AutoRepair',
  priceRange: '$$',
  googleRating: 4.9,
  googleCount: 512,
  googleUrl: 'https://maps.google.com/?q=Warszawa+Grochowska+210',
  openingHours: ['Mo-Fr 08:00-18:00', 'Sa 08:00-14:00'],
  hours: ['pon.–pt. 8:00–18:00', 'sob. 8:00–14:00', 'niedz. nieczynne'],
};

