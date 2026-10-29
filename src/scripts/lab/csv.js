// CSV cleaner (koncept): parser CSV, kroki czyszczenia z podglądem zmian. Wszystko lokalnie w przeglądarce.

const $ = (s, r = document) => r.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// prosty parser CSV (cudzysłowy, przecinki/średniki, nowe linie w polach)
function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const first = text.split(/\r?\n/, 1)[0];
  const delim = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ',';
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  const clean = rows.filter((r) => r.some((c) => c.trim() !== ''));
  return { header: clean[0] || [], rows: clean.slice(1), delim };
}
const toCsv = (header, rows) => [header, ...rows].map((r) => r.map((v) => (/[",\n;]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v)).join(',')).join('\n');

// przykładowy brudny eksport
function sample() {
  const lines = [
    ['Order ID', 'Order Date', 'Customer', 'Country', 'Product', 'Qty', 'Unit Price', 'Payment'],
    [' KS-1001', '03/01/2026', 'anna de vries', 'Netherlands', 'Pour-Over Kettle', '1', '€39.90', 'ideal'],
    ['KS-1002', '2026-01-04', 'Lukas  Becker', 'germany', 'french press 1L', '2', 'EUR 24.95', 'Credit card'],
    ['KS-1003', '5 Jan 2026', 'MARIE DUBOIS', 'FR', 'Coffee Grinder', '1', '64,50', 'paypal'],
    ['KS-1004', '06.01.2026', 'Jan Peeters ', 'Belgie', 'Ceramic Mug Set (4)', '1', '€ 29.00', 'Bancontact'],
    ['KS-1002', '2026-01-04', 'Lukas  Becker', 'germany', 'french press 1L', '2', 'EUR 24.95', 'Credit card'],
    ['KS-1005', '2026/01/07', 'sophie martin', 'France ', 'Glass Teapot', '3', '18.5', 'PayPal'],
    ['KS-1006', 'Jan 8, 2026', 'Tom Jansen', 'the netherlands', 'Pour over kettle', '1', '39.9', 'iDEAL'],
    ['KS-1007', '09-01-2026', 'Eva Schmidt', 'DE', 'Cast Iron Pan 26cm', '1', '€54', 'credit card'],
    ['KS-1008', '2026-01-10', '', 'NL', 'Linen Tea Towels (2)', '2', '12.00', 'ideal'],
    ['KS-1009', '11/01/2026', 'Pierre Laurent', 'Frankrijk', 'Coffee grinder', '1', 'EUR64.50', 'Paypal'],
    ['KS-1010', '2026-01-12', 'Noah Visser', 'Nederland', 'Oak Cutting Board', '1', '-45.00', 'iDeal'],
    ['KS-1011', '13 Jan 2026', 'lena müller', 'Deutschland', 'French Press 1L', '1', '24.95', 'creditcard'],
    ['KS-1012', '2026-01-14', 'Lotte Claes', 'Belgium', 'ceramic mug set (4)', '2', '29', 'bancontact'],
    ['KS-1007', '09-01-2026', 'Eva Schmidt', 'DE', 'Cast Iron Pan 26cm', '1', '€54', 'credit card'],
    ['KS-1013', '15/01/2026', 'Daan Bakker', 'NL', 'Glass teapot', '0', '18.50', 'iDEAL'],
    ['KS-1014', '2026-01-16', 'Clara Fischer', 'Germany', 'Pour-Over Kettle', '1', '39.90', 'PayPal'],
    ['KS-1015', '17.01.2026', 'Hugo Lambert', 'belgium', 'Cast iron pan 26 cm', '1', '€ 54.00', 'Credit Card'],
    ['KS-1016', '2026-01-18', 'Mila de Boer', 'Holland', 'Coffee Grinder', '1', '64.5', 'ideal'],
    ['KS-1017', '19 January 2026', 'Felix Wagner', 'GER', 'Linen tea towels (2)', '3', '12', 'paypal'],
    ['KS-1018', '2026-13-01', 'Julia Weber', 'Germany', 'French Press 1 L', '1', '24.95', 'Credit card'],
  ];
  return { header: lines[0], rows: lines.slice(1), delim: ',' };
}

const COUNTRY = {
  netherlands: 'Netherlands', 'the netherlands': 'Netherlands', nederland: 'Netherlands', holland: 'Netherlands', nl: 'Netherlands',
  germany: 'Germany', deutschland: 'Germany', de: 'Germany', ger: 'Germany', duitsland: 'Germany',
  france: 'France', fr: 'France', frankrijk: 'France', frankreich: 'France',
  belgium: 'Belgium', belgie: 'Belgium', 'belgië': 'Belgium', belgique: 'Belgium', be: 'Belgium',
  poland: 'Poland', polska: 'Poland', pl: 'Poland', polen: 'Poland',
};
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
const pad = (n) => String(n).padStart(2, '0');
function parseDate(v) {
  const s = v.trim(); let m, y, mo, d;
  if ((m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/))) [, y, mo, d] = m;
  else if ((m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/))) [, d, mo, y] = m; // dzień najpierw (Europa)
  else if ((m = s.match(/^(\d{1,2})\s+([a-z]+)\.?\s+(\d{4})$/i))) { d = m[1]; mo = MONTHS[m[2].slice(0, 3).toLowerCase()]; y = m[3]; }
  else if ((m = s.match(/^([a-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})$/i))) { mo = MONTHS[m[1].slice(0, 3).toLowerCase()]; d = m[2]; y = m[3]; }
  else return null;
  y = +y; mo = +mo; d = +d;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (!mo || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${pad(mo)}-${pad(d)}`;
}
function parseMoney(v) {
  let s = v.replace(/[€$£\s]|EUR|USD|PLN/gi, '');
  if (/^-?\d{1,3}(\.\d{3})*,\d{1,2}$/.test(s) || /^-?\d+,\d{1,2}$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
  const n = Number(s);
  return s !== '' && Number.isFinite(n) ? n : null;
}
const titleCase = (s) => s.toLowerCase().replace(/(^|[\s(-])(\p{L})/gu, (a, p, c) => p + c.toUpperCase());

// kroki: id, nazwa, opis, dopasowanie kolumny po nazwie
const STEPS = [
  { id: 'trim', name: 'Trim spaces', d: 'Leading, trailing and double spaces', col: () => true },
  { id: 'date', name: 'Standardise dates', d: 'Any format → YYYY-MM-DD, impossible dates flagged', col: (h) => /date|datum|data/i.test(h) },
  { id: 'money', name: 'Clean prices', d: '“€ 54,00”, “EUR24.95” → 54.00, negatives flagged', col: (h) => /price|amount|total|prijs|cena|revenue/i.test(h) },
  { id: 'country', name: 'Standardise countries', d: 'Codes, local spellings → one English name', col: (h) => /country|land|kraj/i.test(h) },
  { id: 'case', name: 'Fix name and product casing', d: 'anna de vries → Anna De Vries', col: (h) => /customer|name|product|naam|klant/i.test(h) },
  { id: 'payment', name: 'Group payment methods', d: 'ideal, iDeal, IDEAL → iDEAL', col: (h) => /payment|method|betaal/i.test(h) },
  { id: 'qty', name: 'Check quantities', d: 'Zero or non-numeric quantities flagged', col: (h) => /qty|quantity|aantal|ilo/i.test(h) },
  { id: 'empty', name: 'Flag missing values', d: 'Empty required cells marked for review', col: () => true },
  { id: 'dedupe', name: 'Remove duplicates', d: 'Identical rows after cleaning', col: () => true },
];
const PAY = { ideal: 'iDEAL', paypal: 'PayPal', 'credit card': 'Credit card', creditcard: 'Credit card', bancontact: 'Bancontact' };

export function initCsv() {
  const on = new Set(STEPS.map((s) => s.id));
  let data = sample(), view = 'clean', srcName = 'kettle_shop_export.csv (sample)';
  let result = null;

  const stepsEl = $('#steps');
  stepsEl.innerHTML = STEPS.map((s) => `<li><label><input type="checkbox" data-s="${s.id}" checked /><span><b>${s.name}</b><small>${s.d}</small></span><em data-n="${s.id}">0</em></label></li>`).join('');
  stepsEl.addEventListener('change', (e) => { const id = e.target.dataset.s; if (!id) return; e.target.checked ? on.add(id) : on.delete(id); run(); });

  function run() {
    const H = data.header.map((h) => h.trim());
    const counts = Object.fromEntries(STEPS.map((s) => [s.id, 0]));
    const out = data.rows.map((r) => {
      const cells = H.map((_, i) => ({ raw: r[i] ?? '', v: r[i] ?? '', chg: false, bad: false, note: [] }));
      const apply = (id, fn) => {
        if (!on.has(id)) return;
        const step = STEPS.find((s) => s.id === id);
        cells.forEach((c, i) => {
          if (!step.col(H[i])) return;
          const before = c.v;
          const res = fn(c, i);
          if (res !== undefined && res !== before) { c.v = res; c.chg = true; c.note.push(step.name); counts[id]++; }
        });
      };
      apply('trim', (c) => c.v.replace(/\s+/g, ' ').trim());
      apply('date', (c) => { if (!c.v.trim()) return; const d = parseDate(c.v); if (!d) { c.bad = true; c.note.push('Date could not be parsed'); counts.date++; return; } return d; });
      apply('money', (c) => { if (!c.v.trim()) return; const n = parseMoney(c.v); if (n === null) { c.bad = true; counts.money++; return; } if (n < 0) { c.bad = true; c.note.push('Negative price'); counts.money++; } return n.toFixed(2); });
      apply('country', (c) => { const k = c.v.trim().toLowerCase(); return COUNTRY[k] || c.v; });
      apply('case', (c) => (c.v ? titleCase(c.v).replace(/\b(\d+)\s?l\b/gi, '$1 L').replace(/\b(\d+)\s?cm\b/gi, '$1 cm') : c.v));
      apply('payment', (c) => PAY[c.v.trim().toLowerCase()] || c.v);
      apply('qty', (c) => { const n = Number(c.v); if (!Number.isInteger(n) || n <= 0) { c.bad = true; c.note.push('Check quantity'); counts.qty++; } return c.v; });
      apply('empty', (c) => { if (c.v.trim() === '') { c.bad = true; c.note.push('Missing value'); counts.empty++; } return c.v; });
      return { cells, dup: false };
    });
    if (on.has('dedupe')) {
      const seen = new Set();
      out.forEach((r) => { const k = r.cells.map((c) => c.v.toLowerCase()).join('|'); if (seen.has(k)) { r.dup = true; counts.dedupe++; } else seen.add(k); });
    }
    result = { H, out };
    STEPS.forEach((s) => { const e = stepsEl.querySelector(`[data-n="${s.id}"]`); if (e) e.textContent = counts[s.id]; });
    const changed = out.reduce((a, r) => a + r.cells.filter((c) => c.chg).length, 0);
    const flagged = out.reduce((a, r) => a + r.cells.filter((c) => c.bad).length, 0);
    $('#stats').innerHTML = [[data.rows.length, 'rows in'], [out.filter((r) => !r.dup).length, 'rows out'], [changed, 'cells fixed'], [flagged, 'to review']].map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join('');
    $('#srcInfo').textContent = `${srcName} · ${data.rows.length} rows × ${H.length} columns · delimiter “${data.delim}”`;
    render();
  }

  function render() {
    const { H, out } = result;
    const rows = out.slice(0, 400);
    $('#tbl').innerHTML = `<thead><tr><th>#</th>${H.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => `<tr class="${view === 'clean' && r.dup ? 'dup' : ''}"><td>${i + 1}</td>${r.cells.map((c) => {
      if (view === 'raw') return `<td>${esc(c.raw) || '<span style="color:var(--muted)">∅</span>'}</td>`;
      const cls = c.bad ? 'bad' : c.chg ? 'chg' : '';
      const title = c.note.length ? ` title="${esc(`${c.note.join(' · ')} — was: “${c.raw}”`)}"` : '';
      return `<td class="${cls}"${title}>${esc(c.v) || '<span style="color:var(--muted)">∅</span>'}</td>`;
    }).join('')}</tr>`).join('')}</tbody>`;
  }

  $('#view').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    view = b.dataset.v; $('#view').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); render();
  }));
  $('#loadSample').addEventListener('click', () => { data = sample(); srcName = 'kettle_shop_export.csv (sample)'; run(); });
  $('#file').addEventListener('change', async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 5e6) { $('#srcInfo').textContent = 'That file is over 5 MB; this demo is meant for smaller exports.'; return; }
    const parsed = parseCsv(await f.text());
    if (!parsed.header.length) { $('#srcInfo').textContent = 'Could not read any rows from that file.'; return; }
    data = parsed; srcName = f.name; $('#loadSample').setAttribute('aria-pressed', 'false'); run();
  });
  $('#download').addEventListener('click', () => {
    const { H, out } = result;
    const csv = toCsv(H, out.filter((r) => !r.dup).map((r) => r.cells.map((c) => c.v)));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = srcName.replace(/\.csv.*$/i, '').replace(/ \(sample\)$/, '') + '_clean.csv';
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  run();
}
