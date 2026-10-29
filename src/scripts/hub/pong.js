// Pong w starym stylu: kwadratowa piłka, przerywana linia, cyfry z „pikseli”.
// Tryb 'attract' = dwa komputery grają same (tło sekcji „Nudzisz się?”), tryb 'play' = gracz kontra komputer.
// Na pionowym ekranie (telefon) boisko obraca się: gracz na dole, komputer na górze.

// cyfry 3×5 pikseli
const DIGITS = ['111101101101111', '010110010010111', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001001001001', '111101111101111', '111101111001111'];
const WIN = 5;

export function createPong(canvas, { mode = 'play', onEnd, onScore, sound = true } = {}) {
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1, U = 8, vertical = false;
  const col = { bg: '#000', fg: '#fff', acc: '#f60', dim: 'rgba(255,255,255,.2)' };
  const readColors = () => {
    const cs = getComputedStyle(document.documentElement);
    col.bg = cs.getPropertyValue('--bg').trim() || '#000';
    col.fg = cs.getPropertyValue('--fg').trim() || '#fff';
    col.acc = cs.getPropertyValue('--acc').trim() || '#f60';
    col.dim = cs.getPropertyValue('--line-2').trim() || 'rgba(255,255,255,.2)';
  };

  // stan gry w jednostkach logicznych: oś „długa” (między graczami) to L, „krótka” to S
  const g = { L: 100, S: 60, pad: 12, padW: 1.6, ball: 1.6, p: 30, c: 30, bx: 50, by: 30, vx: 0, vy: 0, sp: 0, sP: 0, sC: 0, serve: 0, over: false, waiting: true, cpuErr: 0, target: 30 };
  let raf = 0, last = 0, running = false;

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    canvas.width = W * dpr; canvas.height = H * dpr;
    vertical = mode === 'play' && H > W * 1.1;
    const long = vertical ? H : W, short = vertical ? W : H;
    g.L = 100; g.S = (short / long) * 100;
    U = long / 100; // piksele na jednostkę
    g.pad = Math.max(10, g.S * 0.2);
    g.p = Math.min(Math.max(g.p, g.pad / 2), g.S - g.pad / 2);
    g.c = Math.min(Math.max(g.c, g.pad / 2), g.S - g.pad / 2);
  }

  // dźwięk: krótkie piski fali prostokątnej (tylko w trybie gry, po kliknięciu użytkownika)
  let ac = null, muted = !sound;
  const beep = (f, d = 0.06) => {
    if (muted || mode !== 'play') return;
    try {
      ac ||= new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), v = ac.createGain();
      o.type = 'square'; o.frequency.value = f; v.gain.value = 0.045;
      o.connect(v).connect(ac.destination);
      o.start(); v.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + d); o.stop(ac.currentTime + d);
    } catch (e) { /* bez dźwięku */ }
  };

  function serve(dir) {
    g.bx = g.L / 2; g.by = g.S / 2;
    g.sp = mode === 'play' ? 48 : 40;
    const a = (Math.random() * 0.8 - 0.4);
    g.vx = Math.cos(a) * dir; g.vy = Math.sin(a);
    g.serve = 0.6;
  }
  function reset() { g.sP = 0; g.sC = 0; g.over = false; g.waiting = mode === 'play'; serve(Math.random() < 0.5 ? 1 : -1); }

  // gracz: oś krótka; komputer: śledzi piłkę z błędem i limitem prędkości
  const setPlayer = (v) => { g.p = Math.min(g.S - g.pad / 2, Math.max(g.pad / 2, v)); };
  function step(dt) {
    if (g.over || g.waiting) return;
    if (g.serve > 0) { g.serve -= dt; return; }
    // komputer (w attract: obaj)
    const track = (cur, isLeft) => {
      const coming = isLeft ? g.vx < 0 : g.vx > 0;
      const aim = coming ? g.by + g.cpuErr : g.S / 2;
      const max = (mode === 'play' ? 46 : 60) * dt;
      return cur + Math.max(-max, Math.min(max, aim - cur));
    };
    if (mode === 'attract') g.p = track(g.p, true);
    g.c = track(g.c, false);
    if (keys.up) setPlayer(g.p - 70 * dt);
    if (keys.down) setPlayer(g.p + 70 * dt);

    g.bx += g.vx * g.sp * dt; g.by += g.vy * g.sp * dt;
    const r = g.ball / 2;
    if (g.by < r) { g.by = r; g.vy = Math.abs(g.vy); beep(220); }
    if (g.by > g.S - r) { g.by = g.S - r; g.vy = -Math.abs(g.vy); beep(220); }
    const hit = (paddleY, x, dir) => {
      const off = (g.by - paddleY) / (g.pad / 2);
      if (Math.abs(off) > 1.15) return false;
      const ang = off * 0.9;
      g.vx = Math.cos(ang) * dir; g.vy = Math.sin(ang);
      g.sp = Math.min(130, g.sp * 1.06);
      g.bx = x;
      g.cpuErr = (Math.random() - 0.5) * g.pad * (mode === 'play' ? 1.1 : 0.4);
      beep(dir > 0 ? 440 : 520);
      return true;
    };
    const xL = 4 + g.padW + r, xR = g.L - 4 - g.padW - r;
    if (g.vx < 0 && g.bx <= xL && g.bx > xL - 3) hit(g.p, xL, 1);
    if (g.vx > 0 && g.bx >= xR && g.bx < xR + 3) hit(g.c, xR, -1);
    if (g.bx < -4) { g.sC++; beep(120, 0.25); onScore?.(g.sP, g.sC); point(-1); }
    if (g.bx > g.L + 4) { g.sP++; beep(660, 0.2); onScore?.(g.sP, g.sC); point(1); }
  }
  function point(dir) {
    if (mode === 'play' && (g.sP >= WIN || g.sC >= WIN)) { g.over = true; onEnd?.(g.sP > g.sC); return; }
    if (mode === 'attract' && (g.sP >= 9 || g.sC >= 9)) { g.sP = 0; g.sC = 0; }
    serve(dir);
  }

  // rysowanie: wszystko z prostokątów, zaokrąglone do pikseli
  const toPx = (l, s) => (vertical ? [s * U, (g.L - l) * U] : [l * U, s * U]);
  const rect = (l, s, wl, ws, c) => {
    const [x, y] = toPx(l, s);
    const w = (vertical ? ws : wl) * U, h = (vertical ? wl : ws) * U;
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(vertical ? x - w / 2 : x - w / 2), Math.round(vertical ? y - h / 2 : y - h / 2), Math.round(w), Math.round(h));
  };
  const digit = (n, l, s, c) => {
    const px = Math.max(3, Math.round(U * 1.4)) / U;
    String(n).split('').forEach((ch, k) => {
      const m = DIGITS[+ch];
      for (let i = 0; i < 15; i++) if (m[i] === '1') {
        const cx = (i % 3), cy = Math.floor(i / 3);
        if (vertical) rect(l - cy * px, s + (cx + k * 4) * px, px, px, c);
        else rect(l + (cx + k * 4) * px, s + cy * px, px, px, c);
      }
    });
  };
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const dim = mode === 'attract' ? col.dim : col.fg;
    // przerywana linia środkowa
    for (let s = 1; s < g.S; s += 4) rect(g.L / 2, s + 1, 0.6, 2, mode === 'attract' ? col.dim : col.dim);
    // wynik
    if (vertical) { digit(g.sC, g.L / 2 + 10, g.S - 12, dim); digit(g.sP, g.L / 2 - 4, g.S - 12, dim); }
    else { digit(g.sP, g.L / 2 - 12, 4, dim); digit(g.sC, g.L / 2 + 6, 4, dim); }
    // paletki i piłka
    rect(4 + g.padW / 2, g.p, g.padW, g.pad, dim);
    rect(g.L - 4 - g.padW / 2, g.c, g.padW, g.pad, dim);
    if (!(g.serve > 0 && Math.floor(g.serve * 8) % 2)) rect(g.bx, g.by, g.ball, g.ball, mode === 'attract' ? col.dim : col.acc);
  }
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.033, (now - last) / 1000 || 0); last = now;
    if (!reduced || mode === 'play') step(dt);
    draw();
  }

  // sterowanie: wskaźnik nad płótnem (mysz lub palec) i klawisze
  const keys = { up: false, down: false };
  const onPointer = (e) => {
    if (mode !== 'play') return;
    const r = canvas.getBoundingClientRect();
    const v = vertical ? ((e.clientX - r.left) / r.width) * g.S : ((e.clientY - r.top) / r.height) * g.S;
    setPlayer(v);
  };
  const onDown = (e) => { if (mode !== 'play') return; onPointer(e); if (g.waiting) { g.waiting = false; } else if (g.over) { reset(); g.waiting = false; } };
  const onKey = (e) => {
    if (mode !== 'play') return;
    const up = vertical ? ['ArrowLeft', 'a'] : ['ArrowUp', 'w'], down = vertical ? ['ArrowRight', 'd'] : ['ArrowDown', 's'];
    if (up.includes(e.key)) { keys.up = e.type === 'keydown'; e.preventDefault(); }
    if (down.includes(e.key)) { keys.down = e.type === 'keydown'; e.preventDefault(); }
    if (e.type === 'keydown' && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); if (g.waiting) g.waiting = false; else if (g.over) { reset(); g.waiting = false; } }
  };
  canvas.addEventListener('pointermove', onPointer);
  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);
  const ro = new ResizeObserver(() => { resize(); draw(); });
  ro.observe(canvas);

  readColors(); resize(); reset();
  return {
    start() { if (running) return; running = true; readColors(); last = performance.now(); raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); },
    reset() { reset(); },
    readColors,
    setMuted(v) { muted = v; },
    get waiting() { return g.waiting; },
    destroy() { this.stop(); ro.disconnect(); canvas.removeEventListener('pointermove', onPointer); canvas.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); },
  };
}
