// Analiza kohort (koncept): wygenerowani subskrybenci, macierz retencji, krzywe i wnioski liczone z danych.

const $ = (s, r = document) => r.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const num = new Intl.NumberFormat('en-IE');
const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const N_COH = 12, AGES = 13, PRICE = 59;

function generate() {
  const R = rng(311);
  const users = [];
  for (let c = 0; c < N_COH; c++) {
    const n = Math.round(260 + c * 22 + (c === 0 ? 120 : 0) + (c === 8 ? 140 : 0) + R() * 40);
    for (let k = 0; k < n; k++) {
      const disc = R() < (c === 8 ? 0.72 : 0.45);
      // ryzyko odejścia: wysokie na starcie, potem maleje; zniżka = więcej „turystów”; od kohorty 6 lepszy onboarding
      const onboard = c >= 6 ? 0.78 : 1;
      let alive = true; const months = [];
      for (let a = 0; a < AGES && c + a < N_COH + 6; a++) {
        if (a > 0) {
          const base = a === 1 ? (disc ? 0.46 : 0.24) * onboard : a === 2 ? (disc ? 0.2 : 0.14) * onboard : 0.055 + 0.04 / a;
          if (R() < base) alive = false;
        }
        if (!alive) break;
        const boxes = 2 + (R() < 0.35 ? 1 : 0) + (R() < 0.12 ? 1 : 0);
        const rev = boxes * PRICE / 4 * (a === 0 && disc ? 0.5 : 1) * (1 + Math.min(a, 8) * 0.012);
        months.push(rev);
      }
      users.push({ c, src: disc ? 'discount' : 'organic', months });
    }
  }
  return users;
}

export function initCohorts() {
  const U = generate();
  const state = { metric: 'users', src: '' };
  // ostatni pełny miesiąc obserwacji: kohorta c ma dane do wieku (N_COH + 5 - c)
  const maxAge = (c) => Math.min(AGES - 1, N_COH + 5 - c);

  $('#coMeta').innerHTML = `<span><b>${num.format(U.length)}</b> subscribers</span><span><b>${N_COH}</b> monthly cohorts · 2025</span><span>box price <b>€${PRICE}</b> · first box 50% off for discount signups</span>`;

  function matrix() {
    const users = U.filter((u) => !state.src || u.src === state.src);
    return [...Array(N_COH).keys()].map((c) => {
      const g = users.filter((u) => u.c === c);
      const size = g.length, rev0 = g.reduce((a, u) => a + (u.months[0] || 0), 0);
      const cells = [...Array(AGES).keys()].map((a) => {
        if (a > maxAge(c)) return null;
        const act = g.filter((u) => u.months.length > a);
        return state.metric === 'users' ? act.length / size : act.reduce((s, u) => s + u.months[a], 0) / rev0;
      });
      const ltv = g.reduce((a, u) => a + u.months.reduce((x, y) => x + y, 0), 0) / (size || 1);
      return { c, size, cells, ltv };
    });
  }

  function heat(M) {
    const head = `<div class="coh__r"><span class="coh__h">Cohort</span><span class="coh__h" style="text-align:right">Size</span>${[...Array(AGES).keys()].map((a) => `<span class="coh__h">M${a}</span>`).join('')}</div>`;
    const body = M.map((r) => `<div class="coh__r"><span class="coh__l">${MONTHS[r.c]} 2025</span><span class="coh__n">${num.format(r.size)}</span>${r.cells.map((v, a) => {
      if (v === null) return '<span></span>';
      const t = Math.min(1, v);
      const style = `background:color-mix(in srgb, var(--acc) ${Math.round(8 + t * 86)}%, var(--bg-3))`;
      return `<span class="coh__c${t > 0.55 ? ' dark' : ''}" style="${style}" title="${MONTHS[r.c]} cohort, month ${a}: ${(v * 100).toFixed(1)}% ${state.metric === 'users' ? 'of customers still active' : 'of month-0 revenue'}">${(v * 100).toFixed(0)}%</span>`;
    }).join('')}</div>`).join('');
    $('#heat').innerHTML = head + body;
  }

  function curve(M) {
    const host = $('#curve'); host.innerHTML = '';
    const W = 560, H = 300, L = 40, T = 12, B = 26, Rr = 8;
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', `0 0 ${W} ${H}`); host.appendChild(s);
    const mk = (tag, a) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); s.appendChild(e); return e; };
    const ymax = state.metric === 'users' ? 1 : Math.max(1, ...M.flatMap((r) => r.cells.filter((v) => v !== null)));
    const x = (a) => L + (a / (AGES - 1)) * (W - L - Rr), y = (v) => T + (1 - v / ymax) * (H - T - B);
    for (let g = 0; g <= 4; g++) { const v = (ymax / 4) * g; mk('line', { x1: L, x2: W - Rr, y1: y(v), y2: y(v), stroke: 'var(--line)' }); mk('text', { x: L - 6, y: y(v) + 3, 'text-anchor': 'end' }).textContent = `${Math.round(v * 100)}%`; }
    for (let a = 0; a < AGES; a += 2) mk('text', { x: x(a), y: H - 6, 'text-anchor': 'middle' }).textContent = `M${a}`;
    const line = (cells, attrs) => mk('path', { d: cells.map((v, a) => (v === null ? '' : `${a ? 'L' : 'M'}${x(a).toFixed(1)},${y(v).toFixed(1)}`)).join(''), fill: 'none', ...attrs });
    M.forEach((r) => line(r.cells, { stroke: 'var(--fg-2)', 'stroke-opacity': 0.18, 'stroke-width': 1.2 }));
    const early = avg(M.filter((r) => r.c < 6)), late = avg(M.filter((r) => r.c >= 6));
    line(early, { stroke: 'var(--muted)', 'stroke-width': 2.2, 'stroke-dasharray': '5 4' });
    const p = line(late, { stroke: 'var(--acc)', 'stroke-width': 2.6 });
    const len = p.getTotalLength?.();
    if (len && !matchMedia('(prefers-reduced-motion: reduce)').matches) { p.style.strokeDasharray = len; p.style.strokeDashoffset = len; p.getBoundingClientRect(); p.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(.22,1,.36,1)'; p.style.strokeDashoffset = 0; }
    $('#lgCurve').innerHTML = '<span><i style="background:var(--acc)"></i>Jul–Dec cohorts</span><span><i class="dash"></i>Jan–Jun cohorts</span><span><i style="background:var(--fg-2);opacity:.3"></i>each cohort</span>';
    return { early, late };
  }

  function avg(rows) {
    return [...Array(AGES).keys()].map((a) => {
      let s = 0, w = 0;
      rows.forEach((r) => { if (r.cells[a] !== null) { s += r.cells[a] * r.size; w += r.size; } });
      return w ? s / w : null;
    });
  }

  function render() {
    const M = matrix();
    heat(M);
    const { early, late } = curve(M);
    const all = avg(M);
    const ltv = M.reduce((a, r) => a + r.ltv * r.size, 0) / M.reduce((a, r) => a + r.size, 0);
    const k = [
      ['Month-1 retention', `${(all[1] * 100).toFixed(1)}%`, state.metric === 'users' ? 'customers' : 'of revenue'],
      ['Month-3 retention', `${(all[3] * 100).toFixed(1)}%`, 'weighted average'],
      ['Month-6 retention', `${(all[6] * 100).toFixed(1)}%`, 'cohorts with 6+ months'],
      ['Revenue per signup', eur.format(ltv), 'observed so far'],
    ];
    $('#coKpis').innerHTML = k.map(([l, v, d]) => `<div class="kpi"><span class="kpi__l mono">${l}</span><span class="kpi__v">${v}</span><span class="kpi__d" style="color:var(--muted)">${d}</span></div>`).join('');

    // wnioski z danych
    const m1 = (src) => { const g = U.filter((u) => u.src === src && maxAge(u.c) >= 1); return g.filter((u) => u.months.length > 1).length / g.length; };
    const ins = [];
    ins.push(`The biggest drop happens straight after the first box: <b>${((1 - all[1]) * 100).toFixed(0)}%</b> ${state.metric === 'users' ? 'of customers have cancelled' : 'of first-month revenue is lost'} by month 1. After month 3 the curve flattens to a slow decline.`);
    if (!state.src && m1('discount') < m1('organic')) ins.push(`Discount signups keep only <b>${(m1('discount') * 100).toFixed(0)}%</b> into month 1, against <b>${(m1('organic') * 100).toFixed(0)}%</b> for full-price signups. The 50% offer buys volume, not loyalty.`);
    if (late[3] !== null && early[3] !== null) ins.push(`Cohorts from July onwards, after the onboarding change, hold <b>${((late[3] - early[3]) * 100).toFixed(1)} pts</b> more at month 3 than the January–June cohorts (${(late[3] * 100).toFixed(0)}% vs ${(early[3] * 100).toFixed(0)}%).`);
    const big = M.reduce((a, r) => (r.size > a.size ? r : a));
    const below = big.cells[1] < all[1];
    ins.push(`<b>${MONTHS[big.c]}</b> was the largest cohort (${num.format(big.size)} signups) and retains ${(big.cells[1] * 100).toFixed(0)}% at month 1, ${below ? 'below' : 'above'} the ${(all[1] * 100).toFixed(0)}% average${below ? ': worth checking which campaign brought them in' : ''}.`);
    $('#coIns').innerHTML = ins.map((t, i) => `<div class="insight"><span class="mono">${String(i + 1).padStart(2, '0')}</span><p>${t}</p></div>`).join('');
  }

  const seg = (id, key) => $(id).querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    state[key] = b.dataset.v; $(id).querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); render();
  }));
  seg('#fMetric', 'metric'); seg('#fSrc', 'src');
  render();
}
