// Shared helpers for the niche demo sites (src/demos/*). Only the parts every demo needs
// and nobody should rewrite: reveal on scroll, "open now" status, map on click, demo forms.
// Layout, fonts and the niche tool stay in each demo, so the sites don't look alike.
// See docs/DEMO-BLUEPRINT.md for how a demo is put together.

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Read the JSON config a demo prints into <script type="application/json" id="cfg">.
export const readCfg = (id = 'cfg') => JSON.parse(document.getElementById(id)?.textContent || '{}');

// Fade elements with .rv in as they scroll into view (CSS sets the start state).
export function reveal(sel = '.rv') {
  if (!('IntersectionObserver' in window)) { $$(sel).forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$(sel).forEach((el) => io.observe(el));
}

// Day of week (0 = Monday) and minutes since midnight in the business's time zone.
export function localNow(tz = 'Europe/Amsterdam', date = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(date).map((x) => [x.type, x.value]));
  return { wd: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(p.weekday), min: +p.hour * 60 + +p.minute };
}

export const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

// "Open now · until 18:00" / "Closed now · opens Tuesday 09:00".
// hours: 7 entries, Monday first, each [openMinutes, closeMinutes] or null when closed.
// t: { openNow, closedNow, until, opensAt, days: [7 day names] }. lang 'en' keeps day names capitalised.
export function openStatus(el, { hours, t, lang = 'nl', tz = 'Europe/Amsterdam' }) {
  if (!el) return null;
  const { wd, min } = localNow(tz);
  const h = hours[wd];
  if (h && min >= h[0] && min < h[1]) {
    el.classList.remove('is-closed');
    el.innerHTML = `<i></i>${t.openNow} · ${t.until} ${hhmm(h[1])}`;
    return { open: true, wd };
  }
  let label = '';
  for (let k = 0; k < 8; k++) {
    const d = (wd + k) % 7, hh = hours[d];
    if (hh && (k > 0 || min < hh[0])) {
      const day = k === 0 ? '' : `${lang === 'en' ? t.days[d] : t.days[d].toLowerCase()} `;
      label = `${day}${hhmm(hh[0])}`;
      break;
    }
  }
  el.classList.add('is-closed');
  el.innerHTML = `<i></i>${t.closedNow} · ${t.opensAt} ${label}`;
  return { open: false, wd };
}

// Mark today's row in an opening-hours table: rows need data-day="0..6" (Monday = 0).
export function markToday(table, tz) {
  if (!table) return;
  const { wd } = localNow(tz);
  $(`[data-day="${wd}"]`, table)?.classList.add('is-today');
}

// Load a Google Maps iframe only after a click, so the page sets no cookies before that.
export function mapOnClick(btn, box) {
  btn?.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = btn.dataset.src; f.loading = 'lazy'; f.title = 'Google Maps';
    box.replaceChildren(f);
  });
}

// Demo form: checks the required fields, never sends anything, shows the "done" box.
// onDone(form) can fill the done box (e.g. a WhatsApp-style preview).
export function demoForm(form, { required = ['name', 'phone'], done, onDone } = {}) {
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    required.forEach((n) => {
      const f = form.elements[n];
      if (!f) return;
      const bad = f.type === 'email' ? !/^\S+@\S+\.\S+$/.test(f.value) : f.value.trim().length < 2;
      f.classList.toggle('is-bad', bad);
      if (bad) ok = false;
    });
    if (!ok) { form.querySelector('.is-bad')?.focus(); return; }
    onDone?.(form);
    const box = done || form.querySelector('[data-done]');
    if (box) { box.hidden = false; box.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  });
}

// Euro formatter in the page language.
export const euro = (lang, digits = 0) => {
  const nf = new Intl.NumberFormat({ en: 'en-IE', nl: 'nl-NL', pl: 'pl-PL' }[lang] || 'nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: digits, minimumFractionDigits: digits });
  return (n) => nf.format(n);
};
