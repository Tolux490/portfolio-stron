// SQL playground (koncept): SQLite (sql.js, WebAssembly) w przeglądarce z wygenerowaną bazą wypożyczeń rowerów.
import initSqlJs from 'sql.js/dist/sql-wasm.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

const $ = (s, r = document) => r.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const num = new Intl.NumberFormat('en-IE');
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

const STATIONS = [
  ['Central Station', 'Centre', 3.2, 'hub'], ['Old Town', 'Centre', 2.4, 'leisure'], ['Market Square', 'Centre', 2.0, 'leisure'], ['City Hall', 'Centre', 1.4, 'work'],
  ['Canal Quarter', 'Centre', 1.6, 'home'], ['Museum Quarter', 'Centre', 1.3, 'leisure'], ['University Campus', 'East', 2.6, 'work'], ['Tech Campus', 'East', 1.7, 'work'],
  ['Hospital', 'East', 1.2, 'work'], ['East Gate', 'East', 1.1, 'home'], ['Botanic Garden', 'East', 0.8, 'leisure'], ['North Park', 'North', 1.3, 'home'],
  ['Library', 'North', 0.9, 'leisure'], ['Sports Hall', 'North', 0.8, 'leisure'], ['Old Mill', 'North', 0.9, 'home'], ['Business Park', 'West', 2.2, 'work'],
  ['West Harbour', 'West', 1.2, 'home'], ['Ferry Pier', 'West', 0.9, 'leisure'], ['South Station', 'South', 1.6, 'hub'], ['Riverside', 'South', 1.4, 'home'],
  ['Lakeside', 'South', 1.0, 'leisure'], ['Stadium', 'South', 0.7, 'leisure'],
];

function buildDb(SQL) {
  const R = rng(42);
  const db = new SQL.Database();
  db.run(`
    CREATE TABLE stations (id INTEGER PRIMARY KEY, name TEXT NOT NULL, district TEXT NOT NULL, docks INTEGER NOT NULL);
    CREATE TABLE weather (day TEXT PRIMARY KEY, temp_c REAL NOT NULL, rain_mm REAL NOT NULL);
    CREATE TABLE trips (id INTEGER PRIMARY KEY, start_station INTEGER NOT NULL REFERENCES stations(id), end_station INTEGER NOT NULL REFERENCES stations(id),
      started_at TEXT NOT NULL, duration_min INTEGER NOT NULL, rider TEXT NOT NULL CHECK (rider IN ('member','casual')));
  `);
  const ins = db.prepare('INSERT INTO stations VALUES (?,?,?,?)');
  STATIONS.forEach(([n, d, w], i) => ins.run([i + 1, n, d, 10 + Math.round(w * 8)]));
  ins.free();

  const pick = (ws) => { let t = 0; for (const w of ws) t += w; let r = R() * t; for (let i = 0; i < ws.length; i++) { r -= ws[i]; if (r <= 0) return i; } return ws.length - 1; };
  const wIns = db.prepare('INSERT INTO weather VALUES (?,?,?)');
  const tIns = db.prepare('INSERT INTO trips (start_station, end_station, started_at, duration_min, rider) VALUES (?,?,?,?,?)');
  const pad = (n) => String(n).padStart(2, '0');
  db.run('BEGIN');
  const start = Date.UTC(2025, 0, 1);
  for (let d = 0; d < 365; d++) {
    const dt = new Date(start + d * 864e5);
    const mo = dt.getUTCMonth(), dow = dt.getUTCDay(), weekend = dow === 0 || dow === 6;
    const day = `${dt.getUTCFullYear()}-${pad(mo + 1)}-${pad(dt.getUTCDate())}`;
    const temp = Math.round((10.5 - 8.5 * Math.cos(((d - 15) / 365) * Math.PI * 2) + (R() - 0.5) * 6) * 10) / 10;
    const rainy = R() < 0.36;
    const rain = rainy ? Math.round((R() < 0.25 ? 5 + R() * 14 : 0.3 + R() * 4.5) * 10) / 10 : 0;
    wIns.run([day, temp, rain]);
    const season = 0.55 + 0.45 * Math.max(0, Math.min(1, (temp + 2) / 22));
    const rainF = rain === 0 ? 1 : rain < 5 ? 0.8 : 0.52;
    const n = Math.round((weekend ? 21 : 27) * season * rainF * (0.85 + R() * 0.3));
    for (let k = 0; k < n; k++) {
      const casual = R() < (weekend ? 0.48 : 0.2) * (temp > 16 ? 1.2 : 0.85);
      let h;
      if (!casual && !weekend) h = R() < 0.42 ? 7 + Math.floor(R() * 3) : R() < 0.7 ? 16 + Math.floor(R() * 3) : 10 + Math.floor(R() * 6);
      else h = 10 + Math.floor(R() * 10);
      const commuteAM = !casual && !weekend && h < 10, commutePM = !casual && !weekend && h >= 16 && h < 19;
      const wStart = STATIONS.map(([, , w, kind]) => w * (commuteAM ? (kind === 'home' || kind === 'hub' ? 2.2 : 0.5) : commutePM ? (kind === 'work' ? 2.6 : 0.6) : casual ? (kind === 'leisure' ? 2.2 : kind === 'hub' ? 1.4 : 0.6) : 1));
      const s = pick(wStart);
      const wEnd = STATIONS.map(([, , w, kind], i) => (i === s ? (casual ? 1.4 : 0.15) : w * (commuteAM ? (kind === 'work' ? 2.8 : 0.4) : commutePM ? (kind === 'home' || kind === 'hub' ? 2.4 : 0.5) : casual ? (kind === 'leisure' ? 2 : 0.8) : 1)));
      const e = pick(wEnd);
      const base = s === e ? 25 + R() * 50 : 6 + R() * 18;
      const dur = Math.max(2, Math.round(base * (casual ? 1.6 : 1) * (1 + (R() - 0.3) * 0.5)));
      const mi = Math.floor(R() * 60);
      tIns.run([s + 1, e + 1, `${day} ${pad(h)}:${pad(mi)}:00`, dur, casual ? 'casual' : 'member']);
    }
  }
  db.run('COMMIT');
  wIns.free(); tIns.free();
  return db;
}

// pytania: SQL + wniosek liczony z wyniku
const Q = [
  {
    t: 'Which stations are the busiest?',
    sql: `SELECT s.name AS station,
       s.district,
       COUNT(*) AS trips
FROM trips t
JOIN stations s ON s.id = t.start_station
GROUP BY s.id
ORDER BY trips DESC
LIMIT 10;`,
    f: (r) => `<b>${r[0][0]}</b> is the busiest start point with <b>${num.format(r[0][2])}</b> trips, ${Math.round((r[0][2] / r[1][2] - 1) * 100)}% more than ${r[1][0]}.`,
  },
  {
    t: 'When do members and casual riders ride?',
    sql: `SELECT CAST(strftime('%H', started_at) AS INTEGER) AS hour,
       SUM(rider = 'member') AS members,
       SUM(rider = 'casual') AS casual
FROM trips
GROUP BY hour
ORDER BY hour;`,
    f: (r) => { const m = r.reduce((a, b) => (b[1] > a[1] ? b : a)); const c = r.reduce((a, b) => (b[2] > a[2] ? b : a)); return `Members peak at <b>${m[0]}:00</b>, a clear commuter pattern with a second peak after work. Casual riders build up slowly and peak at <b>${c[0]}:00</b>.`; },
  },
  {
    t: 'Does rain keep people off the bikes?',
    sql: `SELECT CASE WHEN w.rain_mm = 0 THEN 'dry'
            WHEN w.rain_mm < 5 THEN 'light rain'
            ELSE 'heavy rain' END AS weather,
       COUNT(DISTINCT w.day) AS days,
       ROUND(COUNT(t.id) * 1.0 / COUNT(DISTINCT w.day), 1) AS trips_per_day
FROM weather w
LEFT JOIN trips t ON date(t.started_at) = w.day
GROUP BY 1
ORDER BY trips_per_day DESC;`,
    f: (r) => { const dry = r.find((x) => x[0] === 'dry'), hv = r.find((x) => x[0] === 'heavy rain'); return `A heavy-rain day averages <b>${hv[2]}</b> trips against <b>${dry[2]}</b> on a dry day, a drop of <b>${Math.round((1 - hv[2] / dry[2]) * 100)}%</b>. Light rain costs far less.`; },
  },
  {
    t: 'How does ridership build up over the year?',
    sql: `SELECT strftime('%Y-%m', started_at) AS month,
       COUNT(*) AS trips,
       SUM(COUNT(*)) OVER (ORDER BY strftime('%Y-%m', started_at)) AS running_total
FROM trips
GROUP BY month
ORDER BY month;`,
    f: (r) => { const pk = r.reduce((a, b) => (b[1] > a[1] ? b : a)); return `Trips climb with the temperature and peak in <b>${pk[0]}</b> with <b>${num.format(pk[1])}</b> rides. The running total, a window function, reaches ${num.format(r[r.length - 1][2])} by December.`; },
  },
  {
    t: 'What are the most popular routes?',
    sql: `SELECT a.name AS from_station,
       b.name AS to_station,
       COUNT(*) AS trips,
       ROUND(AVG(t.duration_min), 1) AS avg_minutes
FROM trips t
JOIN stations a ON a.id = t.start_station
JOIN stations b ON b.id = t.end_station
WHERE t.start_station <> t.end_station
GROUP BY a.id, b.id
ORDER BY trips DESC
LIMIT 10;`,
    f: (r) => `The top route is <b>${r[0][0]} → ${r[0][1]}</b> with ${num.format(r[0][2])} trips at about ${r[0][3]} minutes each.`,
  },
  {
    t: 'Which stations need rebalancing?',
    sql: `WITH outflow AS (
  SELECT start_station AS id, COUNT(*) AS n FROM trips GROUP BY 1
), inflow AS (
  SELECT end_station AS id, COUNT(*) AS n FROM trips GROUP BY 1
)
SELECT s.name AS station,
       i.n - o.n AS net_bikes
FROM stations s
JOIN outflow o ON o.id = s.id
JOIN inflow  i ON i.id = s.id
ORDER BY ABS(i.n - o.n) DESC
LIMIT 10;`,
    f: (r) => { const gain = r.find((x) => x[1] > 0), loss = r.find((x) => x[1] < 0); return `Over the year <b>${gain[0]}</b> gains ${num.format(gain[1])} bikes more than it loses, while <b>${loss[0]}</b> is short by ${num.format(-loss[1])}. These are the first stops for the rebalancing van.`; },
  },
  {
    t: 'How long is a typical ride?',
    sql: `SELECT CASE WHEN duration_min < 10 THEN '0-9 min'
            WHEN duration_min < 20 THEN '10-19 min'
            WHEN duration_min < 30 THEN '20-29 min'
            WHEN duration_min < 60 THEN '30-59 min'
            ELSE '60+ min' END AS length,
       COUNT(*) AS trips,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM trips), 1) AS pct
FROM trips
GROUP BY 1
ORDER BY MIN(duration_min);`,
    f: (r) => { const top = r.reduce((a, b) => (b[1] > a[1] ? b : a)); return `<b>${top[2]}%</b> of all rides last ${top[0]}. Long rides are mostly round trips by casual riders.`; },
  },
  {
    t: 'Weekdays or weekends?',
    sql: `SELECT rider,
       CASE WHEN strftime('%w', started_at) IN ('0', '6')
            THEN 'weekend' ELSE 'weekday' END AS day_type,
       COUNT(*) AS trips,
       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY rider), 1) AS pct_of_rider
FROM trips
GROUP BY rider, day_type
ORDER BY rider, day_type;`,
    f: (r) => { const cw = r.find((x) => x[0] === 'casual' && x[1] === 'weekend'), mw = r.find((x) => x[0] === 'member' && x[1] === 'weekend'); return `<b>${cw[3]}%</b> of casual rides happen at the weekend, against <b>${mw[3]}%</b> for members, even though the weekend is only 29% of the week.`; },
  },
];

function chart(host, cols, rows) {
  host.innerHTML = '';
  if (rows.length < 2 || rows.length > 40 || cols.length < 2) return;
  const numIdx = cols.map((_, i) => i).filter((i) => i > 0 && rows.every((r) => typeof r[i] === 'number'));
  if (!numIdx.length) return;
  const series = numIdx.slice(0, cols[0].includes('month') ? 1 : 2);
  const W = 720, H = 240, L = 48, T = 12, B = 34;
  const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', `0 0 ${W} ${H}`); host.appendChild(s);
  const mk = (tag, a) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); s.appendChild(e); return e; };
  const max = Math.max(...rows.flatMap((r) => series.map((i) => r[i])), 1) * 1.08;
  const minV = Math.min(0, ...rows.flatMap((r) => series.map((i) => r[i])));
  const y = (v) => T + (1 - (v - minV) / (max - minV)) * (H - T - B);
  for (let g = 0; g <= 3; g++) { const v = minV + ((max - minV) / 3) * g; mk('line', { x1: L, x2: W, y1: y(v), y2: y(v), stroke: 'var(--line)' }); const tx = mk('text', { x: L - 6, y: y(v) + 3, 'text-anchor': 'end' }); tx.textContent = Math.round(v); }
  const bw = (W - L) / rows.length, colors = ['var(--acc)', 'var(--fg-2)'];
  rows.forEach((r, i) => {
    series.forEach((si, k) => {
      const w = (bw * 0.7) / series.length, x = L + i * bw + bw * 0.15 + k * w, v = r[si];
      mk('rect', { x, y: Math.min(y(v), y(0)), width: Math.max(1, w - 1), height: Math.abs(y(0) - y(v)), rx: 2, fill: colors[k] });
    });
    if (rows.length <= 14 || i % Math.ceil(rows.length / 12) === 0) {
      const lab = String(r[0]); const maxC = Math.max(4, Math.floor(bw / 6.2)); const tx = mk('text', { x: L + i * bw + bw / 2, y: H - 14, 'text-anchor': 'middle' }); tx.textContent = lab.length > maxC ? `${lab.slice(0, maxC - 1)}…` : lab;
    }
  });
  if (series.length > 1) {
    const lg = document.createElement('div'); lg.className = 'legend'; lg.style.marginBottom = '0.6rem';
    lg.innerHTML = series.map((si, k) => `<span><i style="background:${colors[k]}"></i>${cols[si]}</span>`).join('');
    host.prepend(lg);
  }
}

function table(el, cols, rows) {
  const esc = (v) => String(v ?? 'NULL').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  el.innerHTML = `<thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.slice(0, 500).map((r) => `<tr>${r.map((v) => `<td>${typeof v === 'number' ? num.format(v) : esc(v)}</td>`).join('')}</tr>`).join('')}</tbody>`;
}

export async function initSql() {
  const ed = $('#editor'), nums = $('#edNums'), runBtn = $('#run'), stat = $('#runStat');
  const syncNums = () => { nums.textContent = Array.from({ length: ed.value.split('\n').length }, (_, i) => i + 1).join('\n'); };
  ed.addEventListener('input', syncNums);
  ed.addEventListener('scroll', () => { nums.scrollTop = ed.scrollTop; });
  ed.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); const a = ed.selectionStart; ed.setRangeText('  ', a, ed.selectionEnd, 'end'); syncNums(); }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
  });

  const t0 = performance.now();
  let SQL, db;
  try {
    SQL = await initSqlJs({ locateFile: () => wasmUrl });
    db = buildDb(SQL);
  } catch (err) {
    $('#dbMeta').innerHTML = `<span class="down">Could not start the database in this browser: ${String(err.message || err)}</span>`;
    return;
  }
  const ms = Math.round(performance.now() - t0);
  const one = (q) => db.exec(q)[0].values[0][0];
  $('#dbMeta').innerHTML = `<span><b>${num.format(one('SELECT COUNT(*) FROM trips'))}</b> trips</span><span><b>${one('SELECT COUNT(*) FROM stations')}</b> stations</span><span><b>${one('SELECT COUNT(*) FROM weather')}</b> days of weather</span><span>SQLite ${one('SELECT sqlite_version()')} · ready in <b>${ms} ms</b></span>`;

  // schemat: kliknięcie wstawia nazwę do edytora
  const schema = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")[0].values.map(([n]) => n);
  $('#schema').innerHTML = schema.map((tname) => {
    const cols = db.exec(`PRAGMA table_info(${tname})`)[0].values.map((c) => `<button type="button" data-ins="${c[1]}">${c[1]}</button><em>${c[2].toLowerCase()}</em>`).join(' ');
    return `<div><b><button type="button" data-ins="${tname}" style="color:inherit">${tname}</button></b>${cols}</div>`;
  }).join('');
  $('#schema').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ins]'); if (!b) return;
    const a = ed.selectionStart; ed.setRangeText(b.dataset.ins, a, ed.selectionEnd, 'end'); ed.focus(); syncNums();
  });

  let cur = 0;
  const list = $('#qList');
  list.innerHTML = Q.map((q, i) => `<li><button type="button" data-i="${i}"><span>${String(i + 1).padStart(2, '0')}</span><span>${q.t}</span></button></li>`).join('');
  list.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) select(+b.dataset.i, true); });

  function run() {
    const q = ed.value.trim();
    if (!q) return;
    stat.className = 'mono ed__stat';
    const ts = performance.now();
    try {
      const res = db.exec(q);
      const took = (performance.now() - ts).toFixed(1);
      const last = res[res.length - 1];
      if (!last) { $('#resTable').innerHTML = ''; $('#resChart').innerHTML = ''; $('#resInfo').textContent = ''; stat.textContent = `Done in ${took} ms, no rows returned.`; return null; }
      table($('#resTable'), last.columns, last.values);
      chart($('#resChart'), last.columns, last.values);
      $('#resInfo').textContent = `${num.format(last.values.length)} row${last.values.length === 1 ? '' : 's'}`;
      stat.textContent = `Ran in ${took} ms`;
      return last;
    } catch (err) {
      stat.textContent = String(err.message || err);
      stat.classList.add('err');
      return null;
    }
  }

  function select(i, focus) {
    cur = i;
    list.querySelectorAll('button').forEach((b) => b.setAttribute('aria-current', String(+b.dataset.i === i)));
    $('#qNum').textContent = `Question ${String(i + 1).padStart(2, '0')} / ${String(Q.length).padStart(2, '0')}`;
    $('#qTitle').textContent = Q[i].t;
    ed.value = Q[i].sql; syncNums();
    const res = run();
    try { $('#qFinding').innerHTML = res ? Q[i].f(res.values) : ''; } catch { $('#qFinding').textContent = ''; }
    if (focus && window.innerWidth < 1000) $('#qTitle').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  $('#reset').addEventListener('click', () => select(cur, false));
  runBtn.addEventListener('click', run);
  runBtn.disabled = false;
  select(0, false);
}
