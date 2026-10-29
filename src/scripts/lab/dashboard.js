// Dashboard sprzedaży (koncept): dane generowane w przeglądarce z ziarnem, więc zawsze takie same.
// Wszystkie wykresy to ręcznie rysowane SVG, bez biblioteki.

const $ = (s, r = document) => r.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

const CHANNELS = [
  { id: 'web', name: 'Webshop', color: 'var(--acc)' },
  { id: 'cafe', name: 'Café', color: 'var(--acc-2)' },
  { id: 'whs', name: 'Wholesale', color: 'var(--fg-2)' },
];
const REGIONS = [
  { id: 'NL', name: 'Netherlands', w: 0.46 },
  { id: 'DE', name: 'Germany', w: 0.24 },
  { id: 'BE', name: 'Belgium', w: 0.18 },
  { id: 'PL', name: 'Poland', w: 0.12 },
];
const PRODUCTS = [
  { id: 'esp', name: 'House Espresso 1 kg', price: 32, w: { web: 3, cafe: 1, whs: 8 } },
  { id: 'eth', name: 'Ethiopia Guji 250 g', price: 14.5, w: { web: 4, cafe: 4, whs: 2 } },
  { id: 'col', name: 'Colombia Huila 250 g', price: 12.9, w: { web: 4, cafe: 5, whs: 2 } },
  { id: 'dec', name: 'Decaf Swiss Water 250 g', price: 13.5, w: { web: 1.6, cafe: 1.4, whs: 0.6 } },
  { id: 'cold', name: 'Cold Brew Pack', price: 18, w: { web: 1.2, cafe: 1.6, whs: 0.3 }, summer: true },
  { id: 'sub', name: 'Monthly Subscription', price: 29, w: { web: 2.4, cafe: 0, whs: 0 } },
  { id: 'grd', name: 'Hand Grinder', price: 89, w: { web: 0.7, cafe: 0.25, whs: 0 }, gift: true },
  { id: 'v60', name: 'V60 Starter Kit', price: 39, w: { web: 1.1, cafe: 0.6, whs: 0 }, gift: true },
  { id: 'cup', name: 'Ceramic Cup', price: 16, w: { web: 0.9, cafe: 2.2, whs: 0 }, gift: true },
];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SEASON = [0.85, 0.82, 0.9, 0.95, 1.0, 1.02, 0.98, 0.92, 1.0, 1.05, 1.18, 1.45];

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = new Intl.NumberFormat('en-IE');
const kfmt = (v) => (v >= 1e6 ? `€${(v / 1e6).toFixed(2)}M` : v >= 1e3 ? `€${(v / 1e3).toFixed(v >= 1e5 ? 0 : 1)}k` : `€${Math.round(v)}`);
const pct = (v, d = 1) => `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(d)}%`;

// ---------- generowanie zamówień 2024–2025 ----------
function generate() {
  const R = rng(2025);
  const pick = (weights) => { let t = 0; for (const w of weights) t += w; let r = R() * t; for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) return i; } return weights.length - 1; };
  const poisson = (l) => { if (l > 30) return Math.max(0, Math.round(l + Math.sqrt(l) * (R() + R() + R() - 1.5) * 1.4)); let L = Math.exp(-l), k = 0, p = 1; do { k++; p *= R(); } while (p > L); return k - 1; };
  const hourW = {
    web: [0.2, 0.1, 0.05, 0.05, 0.05, 0.1, 0.3, 0.6, 0.9, 1, 1.1, 1.3, 1.6, 1.4, 1.1, 1, 1, 1.1, 1.4, 1.9, 2.1, 1.9, 1.3, 0.6],
    cafe: [0, 0, 0, 0, 0, 0, 0, 1, 2.2, 2.8, 2.6, 2.2, 2, 1.8, 1.6, 1.5, 1.3, 0.9, 0.2, 0, 0, 0, 0, 0],
    whs: [0, 0, 0, 0, 0, 0, 0, 0.4, 1.4, 2, 2.1, 1.8, 1, 1.6, 1.8, 1.4, 0.8, 0.2, 0, 0, 0, 0, 0, 0],
  };
  const dowW = { web: [1, 0.95, 0.95, 1, 1.05, 1.1, 1.2], cafe: [0.8, 0.85, 0.85, 0.9, 1.05, 1.55, 1.35], whs: [1.2, 1.1, 1.1, 1.1, 1, 0, 0] };
  const base = { web: 34, cafe: 22, whs: 2.6 };
  const growth = { web: [1, 1.17], cafe: [1, 1.08], whs: [1, 1.34] };
  const repeatP = { web: 0.38, cafe: 0.55, whs: 0.86 };
  const pools = { web: {}, cafe: {}, whs: {} };
  let custSeq = 0;
  const orders = [];
  const start = Date.UTC(2024, 0, 1);
  for (let d = 0; d < 731; d++) {
    const date = new Date(start + d * 864e5);
    const y = date.getUTCFullYear() - 2024, mo = date.getUTCMonth(), dow = (date.getUTCDay() + 6) % 7;
    const yearFrac = (date - Date.UTC(date.getUTCFullYear(), 0, 1)) / (365 * 864e5);
    for (const ch of CHANNELS) {
      const c = ch.id;
      const g = growth[c][y] * (1 + 0.06 * yearFrac);
      const lam = base[c] * SEASON[mo] * dowW[c][dow] * g * (c === 'cafe' && mo >= 5 && mo <= 7 ? 1.12 : 1);
      const n = poisson(lam);
      for (let o = 0; o < n; o++) {
        const rg = c === 'cafe' ? 0 : c === 'whs' ? pick([0.55, 0.3, 0.15, 0]) : pick(REGIONS.map((r) => r.w));
        const pool = (pools[c][rg] ||= []);
        let cust, rep = false;
        if (pool.length && R() < repeatP[c]) { cust = pool[Math.floor(R() * pool.length)]; rep = true; } else { cust = ++custSeq; pool.push(cust); }
        const nl = c === 'whs' ? 1 + (R() < 0.45 ? 1 : 0) : 1 + (R() < 0.42 ? 1 : 0) + (R() < 0.12 ? 1 : 0);
        const lines = [];
        let rev = 0;
        for (let l = 0; l < nl; l++) {
          const ws = PRODUCTS.map((p) => p.w[c] * (p.summer && mo >= 5 && mo <= 7 ? 4 : 1) * (p.gift && mo === 11 ? 2.6 : 1));
          const pi = pick(ws);
          const q = c === 'whs' ? 6 + Math.floor(R() * 19) : 1 + (R() < 0.18 ? 1 : 0);
          const price = PRODUCTS[pi].price * (c === 'whs' ? 0.72 : 1);
          lines.push([pi, q, q * price]);
          rev += q * price;
        }
        orders.push({ y, mo, d, dow, h: pick(hourW[c]), ch: c, rg, rep, rev, lines, wk: Math.min(51, Math.floor((date - Date.UTC(date.getUTCFullYear(), 0, 1)) / (7 * 864e5))) });
      }
    }
  }
  return orders;
}

// ---------- rysowanie SVG ----------
const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent?.appendChild(e); return e; };
function svgBox(host, w, h) { host.querySelector('svg')?.remove(); const s = el('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img' }); host.prepend(s); return s; }
const niceMax = (v) => { const p = 10 ** Math.floor(Math.log10(v || 1)); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };

export function initDashboard() {
  const t0 = performance.now();
  const ORD = generate();
  const genMs = Math.round(performance.now() - t0);
  const state = { period: 'FY', channels: new Set(CHANNELS.map((c) => c.id)), region: '', sort: { k: 'rev', dir: -1 } };

  // meta
  const n25 = ORD.filter((o) => o.y === 1).length;
  $('#dsMeta').innerHTML = `<span><b>${num.format(ORD.length)}</b> orders 2024–2025</span><span><b>${num.format(n25)}</b> in 2025</span><span><b>3</b> channels · <b>4</b> countries · <b>${PRODUCTS.length}</b> products</span><span>generated in <b>${genMs} ms</b></span>`;

  // filtry
  const fCh = $('#fChannel');
  CHANNELS.forEach((c) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.v = c.id; b.setAttribute('aria-pressed', 'true');
    b.innerHTML = `<i style="color:${c.color}"></i>${c.name}`;
    b.addEventListener('click', () => {
      if (state.channels.has(c.id) && state.channels.size === 1) return;
      state.channels.has(c.id) ? state.channels.delete(c.id) : state.channels.add(c.id);
      b.setAttribute('aria-pressed', String(state.channels.has(c.id)));
      render();
    });
    fCh.appendChild(b);
  });
  const fRg = $('#fRegion');
  REGIONS.forEach((r, i) => { const o = document.createElement('option'); o.value = String(i); o.textContent = r.name; fRg.appendChild(o); });
  fRg.addEventListener('change', () => { state.region = fRg.value; render(); });
  $('#fPeriod').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    state.period = b.dataset.v;
    $('#fPeriod').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  }));

  const months = () => (state.period === 'FY' ? [...Array(12).keys()] : [0, 1, 2].map((i) => (+state.period[1] - 1) * 3 + i));
  const match = (o, y) => o.y === y && state.channels.has(o.ch) && (state.region === '' || o.rg === +state.region) && months().includes(o.mo);

  function render() {
    const cur = ORD.filter((o) => match(o, 1));
    const prev = ORD.filter((o) => match(o, 0));
    kpis(cur, prev);
    trend(cur, prev);
    channels(cur);
    regions(cur, prev);
    products(cur, prev);
    heat(cur);
    insights(cur, prev);
  }

  function sum(a, f) { let s = 0; for (const x of a) s += f(x); return s; }

  function kpis(cur, prev) {
    const rev = sum(cur, (o) => o.rev), prv = sum(prev, (o) => o.rev);
    const aov = rev / (cur.length || 1), paov = prv / (prev.length || 1);
    const rep = cur.filter((o) => o.rep).length / (cur.length || 1), prep = prev.filter((o) => o.rep).length / (prev.length || 1);
    const items = [
      ['Revenue', eur.format(rev), rev / prv - 1, false],
      ['Orders', num.format(cur.length), cur.length / prev.length - 1, false],
      ['Avg order value', eur2.format(aov), aov / paov - 1, false],
      ['Repeat orders', `${(rep * 100).toFixed(1)}%`, rep - prep, true],
    ];
    $('#kpis').innerHTML = items.map(([l, v, d, pts]) => `<div class="kpi"><span class="kpi__l mono">${l}</span><span class="kpi__v">${v}</span><span class="kpi__d ${d >= 0 ? 'up' : 'down'}">${d >= 0 ? '▲' : '▼'} ${pts ? `${(Math.abs(d) * 100).toFixed(1)} pts` : pct(d)} vs 2024</span></div>`).join('');
  }

  function trend(cur, prev) {
    const host = $('#cTrend');
    const ms = months();
    const w0 = state.period === 'FY' ? 0 : Math.floor(((+state.period[1] - 1) * 3 * 30.4) / 7);
    const w1 = state.period === 'FY' ? 52 : Math.min(52, Math.ceil(((+state.period[1]) * 3 * 30.4) / 7));
    const nW = w1 - w0;
    const a = new Array(nW).fill(0), p = new Array(nW).fill(0);
    cur.forEach((o) => { const i = o.wk - w0; if (i >= 0 && i < nW) a[i] += o.rev; });
    prev.forEach((o) => { const i = o.wk - w0; if (i >= 0 && i < nW) p[i] += o.rev; });
    const W = 720, H = 300, L = 46, Rr = 10, T = 14, B = 26;
    const s = svgBox(host, W, H);
    const max = niceMax(Math.max(...a, ...p) * 1.05);
    const x = (i) => L + (i / Math.max(1, nW - 1)) * (W - L - Rr), y = (v) => T + (1 - v / max) * (H - T - B);
    for (let g = 0; g <= 4; g++) {
      const v = (max / 4) * g;
      el('line', { x1: L, x2: W - Rr, y1: y(v), y2: y(v), stroke: 'var(--line)', 'stroke-width': 1 }, s);
      el('text', { x: L - 8, y: y(v) + 3, 'text-anchor': 'end' }, s).textContent = kfmt(v);
    }
    ms.forEach((m) => {
      const wk = Math.round((m * 30.4) / 7) - w0;
      if (wk < 0 || wk >= nW) return;
      el('text', { x: x(wk), y: H - 6, 'text-anchor': 'start' }, s).textContent = MONTHS[m];
    });
    const path = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
    const defs = el('defs', {}, s);
    const gr = el('linearGradient', { id: 'gTrend', x1: 0, x2: 0, y1: 0, y2: 1 }, defs);
    el('stop', { offset: '0%', 'stop-color': 'var(--acc)', 'stop-opacity': 0.35 }, gr);
    el('stop', { offset: '100%', 'stop-color': 'var(--acc)', 'stop-opacity': 0 }, gr);
    el('path', { d: `${path(a)}L${x(nW - 1)},${y(0)}L${x(0)},${y(0)}Z`, fill: 'url(#gTrend)' }, s);
    el('path', { d: path(p), fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, s);
    const line = el('path', { d: path(a), fill: 'none', stroke: 'var(--acc)', 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, s);
    const len = line.getTotalLength?.() || 0;
    if (len && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      line.style.strokeDasharray = `${len}`; line.style.strokeDashoffset = `${len}`;
      line.getBoundingClientRect();
      line.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1)'; line.style.strokeDashoffset = '0';
    }
    const cross = el('line', { y1: T, y2: H - B, stroke: 'var(--line-2)', 'stroke-width': 1, opacity: 0 }, s);
    const dot = el('circle', { r: 4.5, fill: 'var(--acc)', stroke: 'var(--bg-2)', 'stroke-width': 2, opacity: 0 }, s);
    $('#lgTrend').innerHTML = `<span><i style="background:var(--acc)"></i>2025</span><span><i class="dash"></i>2024</span>`;
    let tip = host.querySelector('.tip'); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; host.appendChild(tip); }
    s.addEventListener('pointermove', (e) => {
      const r = s.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * W;
      const i = Math.max(0, Math.min(nW - 1, Math.round(((px - L) / (W - L - Rr)) * (nW - 1))));
      cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('opacity', 1);
      dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(a[i])); dot.setAttribute('opacity', 1);
      tip.innerHTML = `Week ${i + w0 + 1}<br><b>${eur.format(a[i])}</b> 2025<br>${eur.format(p[i])} 2024`;
      tip.style.left = `${(x(i) / W) * 100}%`; tip.style.top = `${(y(a[i]) / H) * r.height}px`; tip.classList.add('on');
    });
    s.addEventListener('pointerleave', () => { tip.classList.remove('on'); cross.setAttribute('opacity', 0); dot.setAttribute('opacity', 0); });
  }

  function channels(cur) {
    const host = $('#cChannel');
    const ms = months();
    const data = ms.map((m) => CHANNELS.map((c) => sum(cur.filter((o) => o.mo === m && o.ch === c.id), (o) => o.rev)));
    const W = 560, H = 280, L = 46, Rr = 6, T = 10, B = 24;
    const s = svgBox(host, W, H);
    const max = niceMax(Math.max(...data.map((d) => d.reduce((a, b) => a + b, 0))) * 1.05);
    const y = (v) => T + (1 - v / max) * (H - T - B);
    for (let g = 0; g <= 4; g++) { const v = (max / 4) * g; el('line', { x1: L, x2: W - Rr, y1: y(v), y2: y(v), stroke: 'var(--line)' }, s); el('text', { x: L - 8, y: y(v) + 3, 'text-anchor': 'end' }, s).textContent = kfmt(v); }
    const bw = (W - L - Rr) / ms.length;
    let tip = host.querySelector('.tip'); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; host.appendChild(tip); }
    data.forEach((d, i) => {
      let acc = 0;
      const gx = L + i * bw + bw * 0.18, gw = bw * 0.64;
      const g = el('g', {}, s);
      CHANNELS.forEach((c, k) => {
        if (!state.channels.has(c.id) || !d[k]) return;
        el('rect', { x: gx, y: y(acc + d[k]), width: gw, height: y(acc) - y(acc + d[k]), fill: c.color, rx: 2 }, g);
        acc += d[k];
      });
      el('text', { x: gx + gw / 2, y: H - 6, 'text-anchor': 'middle' }, s).textContent = MONTHS[ms[i]];
      const hit = el('rect', { x: L + i * bw, y: T, width: bw, height: H - T - B, fill: 'transparent' }, s);
      hit.addEventListener('pointerenter', () => {
        tip.innerHTML = `${MONTHS[ms[i]]} 2025<br>` + CHANNELS.filter((c) => state.channels.has(c.id)).map((c) => `${c.name}: <b>${eur.format(d[CHANNELS.indexOf(c)])}</b>`).join('<br>');
        tip.style.left = `${((gx + gw / 2) / W) * 100}%`; tip.style.top = `${(y(acc) / H) * host.clientWidth * (H / W)}px`; tip.classList.add('on');
        g.style.opacity = 0.75;
      });
      hit.addEventListener('pointerleave', () => { tip.classList.remove('on'); g.style.opacity = 1; });
    });
    $('#lgChannel').innerHTML = CHANNELS.filter((c) => state.channels.has(c.id)).map((c) => `<span><i style="background:${c.color}"></i>${c.name}</span>`).join('');
  }

  function regions(cur, prev) {
    const host = $('#cRegion');
    const rows = REGIONS.map((r, i) => ({ r, v: sum(cur.filter((o) => o.rg === i), (o) => o.rev), p: sum(prev.filter((o) => o.rg === i), (o) => o.rev) })).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
    const tot = rows.reduce((a, b) => a + b.v, 0) || 1;
    const W = 560, rowH = 52, H = Math.max(rowH * rows.length + 8, 60);
    const s = svgBox(host, W, H);
    const max = Math.max(...rows.map((x) => x.v), 1);
    rows.forEach((x, i) => {
      const yy = i * rowH + 6;
      el('text', { x: 0, y: yy + 12, style: 'fill:var(--fg);font-size:12px' }, s).textContent = x.r.name;
      el('rect', { x: 0, y: yy + 20, width: W, height: 10, rx: 5, fill: 'var(--line)' }, s);
      const bar = el('rect', { x: 0, y: yy + 20, width: 0, height: 10, rx: 5, fill: i === 0 ? 'var(--acc)' : 'var(--fg-2)' }, s);
      requestAnimationFrame(() => { bar.style.transition = 'width .9s cubic-bezier(.22,1,.36,1)'; bar.setAttribute('width', ((x.v / max) * W).toFixed(1)); });
      const d = x.p ? x.v / x.p - 1 : 0;
      el('text', { x: W, y: yy + 12, 'text-anchor': 'end' }, s).innerHTML = `${eur.format(x.v)} · ${(x.v / tot * 100).toFixed(1)}% · <tspan style="fill:${d >= 0 ? '#3ddc84' : '#ff5a4d'}">${pct(d)}</tspan>`;
    });
    $('#regionNote').textContent = state.channels.has('cafe') && state.channels.size === 1 ? 'The café is in Utrecht (NL)' : 'Share · change vs 2024';
  }

  function products(cur, prev) {
    const rows = PRODUCTS.map((p, pi) => {
      let u = 0, r = 0, pr = 0; const spark = new Array(12).fill(0);
      cur.forEach((o) => o.lines.forEach(([i, q, v]) => { if (i === pi) { u += q; r += v; } }));
      prev.forEach((o) => o.lines.forEach(([i, q, v]) => { if (i === pi) pr += v; }));
      ORD.forEach((o) => { if (o.y === 1 && state.channels.has(o.ch) && (state.region === '' || o.rg === +state.region)) o.lines.forEach(([i, , v]) => { if (i === pi) spark[o.mo] += v; }); });
      return { name: p.name, units: u, rev: r, yoy: pr ? r / pr - 1 : 0, spark };
    }).filter((x) => x.rev > 0);
    const tot = rows.reduce((a, b) => a + b.rev, 0) || 1;
    rows.forEach((x) => { x.share = x.rev / tot; });
    const { k, dir } = state.sort;
    rows.sort((a, b) => (k === 'name' ? a.name.localeCompare(b.name) * -dir : (a[k] - b[k]) * dir));
    const maxR = Math.max(...rows.map((x) => x.rev));
    const sp = (arr) => { const m = Math.max(...arr, 1); return `<svg viewBox="0 0 60 18" width="60" height="18" style="vertical-align:middle"><polyline fill="none" stroke="var(--acc)" stroke-width="1.5" points="${arr.map((v, i) => `${(i / 11) * 60},${17 - (v / m) * 16}`).join(' ')}"/></svg>`; };
    const th = (key, label) => `<th${k === key ? ` aria-sort="${dir < 0 ? 'descending' : 'ascending'}"` : ''}><button type="button" data-k="${key}">${label}${k === key ? (dir < 0 ? ' ↓' : ' ↑') : ''}</button></th>`;
    $('#tProducts').innerHTML = `<thead><tr>${th('name', 'Product')}${th('units', 'Units')}${th('rev', 'Revenue')}${th('share', 'Share')}${th('yoy', 'vs 2024')}<th>2025 trend</th></tr></thead><tbody>${rows.map((x) => `<tr><td>${x.name}</td><td>${num.format(x.units)}</td><td><span class="bar" style="width:${Math.round((x.rev / maxR) * 46)}px"></span>${eur.format(x.rev)}</td><td>${(x.share * 100).toFixed(1)}%</td><td class="${x.yoy >= 0 ? 'up' : 'down'}">${pct(x.yoy)}</td><td>${sp(x.spark)}</td></tr>`).join('')}</tbody>`;
    $('#tProducts').querySelectorAll('th button').forEach((b) => b.addEventListener('click', () => {
      const key = b.dataset.k;
      state.sort = { k: key, dir: state.sort.k === key ? -state.sort.dir : -1 };
      products(cur, prev);
    }));
  }

  function heat(cur) {
    const host = $('#cHeat');
    const H0 = 6, H1 = 23;
    const m = DAYS.map(() => new Array(H1 - H0).fill(0));
    cur.forEach((o) => { if (o.h >= H0 && o.h < H1) m[o.dow][o.h - H0]++; });
    const max = Math.max(...m.flat(), 1);
    const W = 560, cw = (W - 40) / (H1 - H0), ch = 26, H = ch * 7 + 22;
    const s = svgBox(host, W, H);
    let tip = host.querySelector('.tip'); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; host.appendChild(tip); }
    DAYS.forEach((d, i) => {
      el('text', { x: 0, y: i * ch + ch / 2 + 4 }, s).textContent = d;
      m[i].forEach((v, j) => {
        const r = el('rect', { x: 40 + j * cw + 1, y: i * ch + 1, width: cw - 2, height: ch - 2, rx: 3, fill: 'var(--acc)', 'fill-opacity': (0.06 + 0.94 * (v / max) ** 0.8).toFixed(3) }, s);
        r.addEventListener('pointerenter', () => {
          tip.innerHTML = `${d} ${String(j + H0).padStart(2, '0')}:00<br><b>${num.format(v)}</b> orders`;
          tip.style.left = `${((40 + j * cw + cw / 2) / W) * 100}%`; tip.style.top = `${((i * ch) / H) * host.clientWidth * (H / W)}px`; tip.classList.add('on');
        });
        r.addEventListener('pointerleave', () => tip.classList.remove('on'));
      });
    });
    for (let j = 0; j < H1 - H0; j += 3) el('text', { x: 40 + j * cw + cw / 2, y: H - 4, 'text-anchor': 'middle' }, s).textContent = `${String(j + H0).padStart(2, '0')}h`;
  }

  function insights(cur, prev) {
    const out = [];
    const chs = CHANNELS.filter((c) => state.channels.has(c.id)).map((c) => {
      const a = sum(cur.filter((o) => o.ch === c.id), (o) => o.rev), b = sum(prev.filter((o) => o.ch === c.id), (o) => o.rev);
      return { c, a, g: b ? a / b - 1 : 0 };
    }).filter((x) => x.a > 0).sort((x, y) => y.g - x.g);
    if (chs.length > 1) out.push(`<b>${chs[0].c.name}</b> is the fastest-growing channel at <b>${pct(chs[0].g)}</b> vs 2024, while ${chs[chs.length - 1].c.name.toLowerCase()} grew ${pct(chs[chs.length - 1].g)}.`);
    else if (chs.length) out.push(`<b>${chs[0].c.name}</b> revenue changed <b>${pct(chs[0].g)}</b> vs the same period in 2024.`);
    const cnt = DAYS.map(() => new Array(24).fill(0));
    cur.forEach((o) => cnt[o.dow][o.h]++);
    let best = [0, 0, 0];
    cnt.forEach((row, d) => row.forEach((v, h) => { const two = v + (row[h + 1] || 0); if (two > best[0]) best = [two, d, h]; }));
    out.push(`The busiest two-hour window is <b>${DAYS[best[1]]} ${String(best[2]).padStart(2, '0')}:00–${String(best[2] + 2).padStart(2, '0')}:00</b>, with ${num.format(best[0])} orders in the selected period.`);
    const rep = cur.filter((o) => o.rep);
    const aovR = sum(rep, (o) => o.rev) / (rep.length || 1), aovN = sum(cur.filter((o) => !o.rep), (o) => o.rev) / ((cur.length - rep.length) || 1);
    out.push(`Returning customers spend <b>${eur2.format(aovR)}</b> per order against ${eur2.format(aovN)} for first orders, a difference of <b>${pct(aovR / aovN - 1, 0)}</b>.`);
    if (state.period === 'FY') {
      const by = new Array(12).fill(0); cur.forEach((o) => { by[o.mo] += o.rev; });
      const avg = by.reduce((a, b) => a + b, 0) / 12, pk = by.indexOf(Math.max(...by));
      out.push(`<b>${MONTHS[pk]}</b> is the peak month at ${eur.format(by[pk])}, <b>${pct(by[pk] / avg - 1, 0)}</b> above the monthly average. Gift items and grinders drive most of the lift.`);
    } else {
      const cb = PRODUCTS.findIndex((p) => p.id === 'cold');
      const r = sum(cur, (o) => o.lines.reduce((a, [i, , v]) => a + (i === cb ? v : 0), 0));
      out.push(`Cold Brew Pack made <b>${eur.format(r)}</b> this quarter${state.period === 'Q3' ? ', its strongest season by far' : ''}.`);
    }
    $('#insights').innerHTML = out.map((t, i) => `<div class="insight"><span class="mono">${String(i + 1).padStart(2, '0')}</span><p>${t}</p></div>`).join('');
  }

  render();
}
