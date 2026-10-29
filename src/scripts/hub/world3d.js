// Jeden świat 3D na całą stronę: te same kostki-dane przybierają kolejne kształty, gdy przewijasz.
// chaos → wykres (hero) → glob (manifest) → arkusz, który sam się czyści (proces) → logo „V” (kontakt).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (a, b, t) => a + (b - a) * t;

// deterministyczny generator, żeby kształty były zawsze takie same
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// punkty wewnątrz szewronu logo (2D), w kilku warstwach głębokości
function chevronPoints(count) {
  const A = [6, 10], B = [34, 48], C = [62, 10], W = 12;
  const distSeg = (px, py, a, b) => {
    const vx = b[0] - a[0], vy = b[1] - a[1];
    const t = clamp01(((px - a[0]) * vx + (py - a[1]) * vy) / (vx * vx + vy * vy));
    return Math.hypot(px - (a[0] + vx * t), py - (a[1] + vy * t));
  };
  const inside = (x, y) => Math.min(distSeg(x, y, A, B), distSeg(x, y, B, C)) <= W / 2;
  const layers = 2;
  let step = 2.6, pts = [];
  for (let k = 0; k < 14; k++) {
    pts = [];
    for (let y = 2; y <= 56; y += step) for (let x = -2; x <= 70; x += step) if (inside(x, y)) pts.push([x, y]);
    if (pts.length * layers > count) step *= 1.06; else if (pts.length * layers < count * 0.9) step *= 0.95; else break;
  }
  const out = [];
  const k = 0.12;
  for (let l = 0; l < layers; l++) for (const [x, y] of pts) out.push([(x - 34) * k, (29 - y) * k, (l - (layers - 1) / 2) * step * k]);
  return { pts: out.slice(0, count), size: step * k };
}

export function createWorld(canvas) {
  const small = window.matchMedia('(max-width: 760px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = small ? 13 : 19;
  const N = G * G;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !small;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 300);
  const camPos = new THREE.Vector3(18, 14, 18), camTarget = new THREE.Vector3(0, 0.6, 0);
  const wantPos = new THREE.Vector3(), wantTarget = new THREE.Vector3();

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-9, 16, 8);
  key.castShadow = !small;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 });
  key.shadow.bias = -0.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.0);
  rim.position.set(10, 6, -12);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 0.35));

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.ShadowMaterial({ opacity: 0.32 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const geo = new RoundedBoxGeometry(1, 1, 1, 3, 0.14);
  geo.translate(0, 0.5, 0);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.08, envMapIntensity: 0.9 });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  mesh.castShadow = !small;
  mesh.receiveShadow = !small;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  scene.add(mesh);

  // ---------- dane stałe dla każdej kostki ----------
  const R = rng(7);
  const GAP = 1.18;
  const cells = [];
  for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) {
    const x = (i - (G - 1) / 2) * GAP, z = (j - (G - 1) / 2) * GAP;
    const h = 0.35
      + 3.4 * Math.exp(-((x + 3.2) ** 2 + (z - 1.5) ** 2) / 9)
      + 2.3 * Math.exp(-((x - 4) ** 2 + (z + 3.5) ** 2) / 7)
      + 1.4 * Math.exp(-((x - 1) ** 2 + (z - 5) ** 2) / 5)
      + 0.25 * Math.sin(x * 0.9) * Math.cos(z * 0.7);
    const r = 7 + R() * 9, th = R() * Math.PI * 2, ph = Math.acos(-0.6 + R() * 1.6);
    cells.push({
      gx: x, gz: z, h: Math.max(0.18, h), dist: Math.hypot(x, z),
      cx: r * Math.sin(ph) * Math.cos(th), cy: Math.abs(r * Math.cos(ph)) * 0.7 + 1 + R() * 5, cz: r * Math.sin(ph) * Math.sin(th),
      rx: (R() - 0.5) * 6, ry: (R() - 0.5) * 6, rz: (R() - 0.5) * 6, cs: 0.35 + R() * 0.55,
      lag: R(), dirty: R() < 0.2, dirtyAt: R(), lift: 0,
    });
  }
  const maxH = Math.max(...cells.map((c) => c.h));

  // glob: punkty Fibonacciego
  const golden = Math.PI * (3 - Math.sqrt(5));
  cells.forEach((c, k) => {
    const y = 1 - (k / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), a = golden * k;
    c.sx = Math.cos(a) * rr; c.sy = y; c.sz = Math.sin(a) * rr;
    c.land = Math.sin(a * 3.1) * Math.cos(y * 4.2) > 0.25; // umowne „lądy” w akcencie
  });

  // arkusz: kolumny x wiersze, wąskie i szerokie komórki
  const COLS = small ? 8 : 11, ROWS = Math.ceil(N / COLS);
  cells.forEach((c, k) => { c.col = k % COLS; c.row = Math.floor(k / COLS); });

  // pierścień wykresu kołowego (donut): 3 pierścienie, segmenty o udziałach jak w raporcie
  const SHARES = [0.36, 0.24, 0.18, 0.13, 0.09];
  const RINGS = 3, perRing = Math.ceil(N / RINGS);
  cells.forEach((c, k) => {
    const ring = k % RINGS, idx = Math.floor(k / RINGS);
    const f = idx / perRing;
    let acc = 0, seg = 0;
    for (let i = 0; i < SHARES.length; i++) { if (f < acc + SHARES[i]) { seg = i; break; } acc += SHARES[i]; seg = i; }
    c.dTheta = f * Math.PI * 2; c.dR = 2.9 + ring * 0.62; c.dSeg = seg;
    c.dEdge = Math.min(f - acc, acc + SHARES[seg] - f) < 0.006; // przerwy między segmentami
  });

  // logo V
  const V = chevronPoints(N);
  cells.forEach((c, k) => { c.v = V.pts[k] || null; });

  // ---------- motyw ----------
  const cBase = new THREE.Color(), cTop = new THREE.Color(), cAcc = new THREE.Color(), cBad = new THREE.Color('#ff5a4d'), cHead = new THREE.Color();
  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    cBase.set(cs.getPropertyValue('--cube').trim() || '#2a2d35');
    cTop.set(cs.getPropertyValue('--cube-top').trim() || '#d8d4c8');
    cAcc.set(cs.getPropertyValue('--acc').trim() || '#f2a541');
    cHead.copy(cBase).lerp(cTop, 0.75);
    ground.material.opacity = parseFloat(cs.getPropertyValue('--shadow-op')) || 0.32;
  }
  readTheme();

  // ---------- wejście: mysz ----------
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3(999, 0, 999), hitS = new THREE.Vector3(999, 0, 999);
  const m = { x: 0, y: 0, sx: 0, sy: 0, in: false };
  const onMove = (e) => {
    m.x = (e.clientX / window.innerWidth) * 2 - 1; m.y = -(e.clientY / window.innerHeight) * 2 + 1; m.in = true;
    mouse.set(m.x, m.y);
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  // ---------- kształty: dla każdej kostki pozycja, obrót, skala, kolor ----------
  const anchor = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.52 }, anchorCur = { ...anchor };
  const st = { form: 'chaos', from: null, t0: 0, dur: 1.35, assemble: 0, clean: 0, scroll: 0, visible: true, active: true };
  const out = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, sz: 1, c: new THREE.Color() };

  const forms = {
    chaos(c, k, t) {
      out.x = c.cx; out.y = c.cy + Math.sin(t * 0.8 + k) * 0.3; out.z = c.cz;
      out.rx = c.rx + t * 0.3; out.ry = c.ry; out.rz = c.rz;
      out.sx = out.sy = out.sz = c.cs;
      out.c.copy(cBase).lerp(cTop, 0.15);
    },
    chart(c, k, t) {
      const dm = Math.hypot(c.gx - hitS.x, c.gz - hitS.z);
      const want = dm < 3.2 ? (1 - dm / 3.2) ** 2 * 2.6 : 0;
      c.lift += (want - c.lift) * 0.08;
      const wave = reduced ? 0 : Math.sin(t * 1.2 + c.gx * 0.45 + c.gz * 0.3) * 0.12;
      const sink = clamp01(st.scroll * 1.2 - c.dist / 40);
      out.x = c.gx; out.y = 0; out.z = c.gz;
      out.rx = out.ry = out.rz = 0;
      out.sx = out.sz = 0.92; out.sy = Math.max(0.12, (c.h + c.lift + wave) * (1 - sink * 0.85));
      const hn = clamp01(c.h / maxH);
      out.c.copy(cBase).lerp(cTop, hn * 0.55);
      out.c.lerp(cAcc, clamp01(clamp01(c.lift / 1.4) + (hn > 0.74 ? 0.45 + (hn - 0.74) * 2.2 : 0)));
    },
    globe(c, k, t) {
      const R0 = small ? 4.4 : 4.5, spin = (reduced ? 0 : t * 0.12) + m.sx * 0.6;
      const ca = Math.cos(spin), sa = Math.sin(spin), tilt = 0.35 + m.sy * 0.2;
      let x = c.sx * ca - c.sz * sa, z = c.sx * sa + c.sz * ca, y = c.sy;
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt); z = y * Math.sin(tilt) + z * Math.cos(tilt); y = y2;
      const pulse = c.land ? 1 + (reduced ? 0 : 0.25 * Math.sin(t * 2 + k)) : 1;
      out.x = x * R0; out.y = y * R0 + R0 + 1.2; out.z = z * R0;
      out.rx = -tilt; out.ry = -spin; out.rz = 0;
      const s = (c.land ? 0.42 : 0.3) * pulse;
      out.sx = out.sy = out.sz = s;
      out.c.copy(c.land ? cAcc : cTop);
      if (!c.land) out.c.lerp(cBase, 0.35 + 0.4 * (1 - (z + 1) / 2));
    },
    sheet(c, k, t) {
      const w = 1.62, d = 0.6;
      const x = (c.col - (COLS - 1) / 2) * (w + 0.12), z = (c.row - (ROWS - 1) / 2) * (d + 0.12);
      const isHead = c.row === 0;
      const bad = c.dirty && !isHead && st.clean < c.dirtyAt;
      const fixedNow = c.dirty && !isHead && st.clean >= c.dirtyAt && st.clean < c.dirtyAt + 0.08;
      const bob = bad && !reduced ? 0.25 + 0.2 * Math.sin(t * 3 + k) : 0;
      out.x = x + (bad ? Math.sin(k * 7.1) * 0.25 : 0); out.y = bob; out.z = z;
      out.rx = 0; out.ry = bad ? Math.sin(k * 3.7) * 0.25 : 0; out.rz = bad ? Math.sin(k * 5.3) * 0.18 : 0;
      out.sx = w; out.sy = isHead ? 0.34 : bad ? 0.32 : 0.16; out.sz = d;
      if (isHead) out.c.copy(cHead);
      else if (bad) out.c.copy(cBad);
      else if (fixedNow) out.c.copy(cAcc);
      else out.c.copy(cBase).lerp(cTop, 0.18 + (c.row % 2) * 0.06);
    },
    donut(c, k, t) {
      const spin = (reduced ? 0 : t * 0.18) + m.sx * 0.5;
      const tilt = 0.95 + m.sy * 0.15;
      const pull = c.dSeg === 0 ? 0.55 + (reduced ? 0 : 0.15 * Math.sin(t * 1.6)) : 0;
      const a = c.dTheta + spin;
      const mid = c.dSeg === 0 ? SHARES[0] * Math.PI : 0;
      const r = c.dR;
      let x = Math.cos(a) * r + Math.cos(mid + spin) * pull, z = Math.sin(a) * r + Math.sin(mid + spin) * pull;
      const h = (0.5 + (SHARES.length - c.dSeg) * 0.32) * (c.dEdge ? 0 : 1);
      // pochylenie całego pierścienia w stronę kamery
      const y0 = 0, yT = y0 * Math.cos(tilt) - z * Math.sin(tilt), zT = y0 * Math.sin(tilt) + z * Math.cos(tilt);
      out.x = x; out.y = yT + 6.6; out.z = zT;
      // ten sam obrót co pierścień: najpierw wokół osi pierścienia (Y), potem pochylenie (X)
      out.rx = tilt; out.ry = -a; out.rz = 0;
      out.sx = 0.5; out.sz = 0.5; out.sy = Math.max(0.001, h * 0.85);
      const cols = [cAcc, cTop, cBase, cTop, cBase];
      out.c.copy(cols[c.dSeg]);
      if (c.dSeg === 2 || c.dSeg === 4) out.c.lerp(cTop, 0.35);
      if (c.dSeg === 3) out.c.lerp(cBase, 0.45);
    },
    logo(c, k, t) {
      if (!c.v) { out.x = c.cx * 0.4; out.y = -4; out.z = c.cz * 0.4; out.sx = out.sy = out.sz = 0.001; out.rx = out.ry = out.rz = 0; out.c.copy(cBase); return; }
      const ay = m.sx * 0.55 + (reduced ? 0 : Math.sin(t * 0.6) * 0.15), ax = -m.sy * 0.3;
      const [vx, vy, vz] = c.v;
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
      let x = vx * cy + vz * sy, z = -vx * sy + vz * cy, y = vy;
      const y2 = y * cx - z * sx; z = y * sx + z * cx; y = y2;
      const float = reduced ? 0 : Math.sin(t * 1.1) * 0.25;
      out.x = x; out.y = y + 6.4 + float; out.z = z;
      out.rx = ax; out.ry = ay; out.rz = 0;
      const s = V.size * 0.86;
      out.sx = out.sy = out.sz = s;
      const shade = 0.75 + 0.25 * Math.sin(k * 1.7);
      out.c.copy(cAcc).multiplyScalar(shade);
    },
  };

  // kamery dla kształtów (pozycja, cel); hero ma orbitę
  function cameraFor(form, t) {
    if (form === 'chart' || form === 'chaos') {
      const orbit = (reduced ? 0 : t * 0.05) + st.scroll * 0.9;
      const r = (small ? 26 : 25) - st.scroll * 4;
      wantPos.set(Math.sin(orbit + 0.75) * r, 13 + st.scroll * 8, Math.cos(orbit + 0.75) * r);
      wantTarget.set(0, 0.6, 0);
    } else if (form === 'globe') {
      wantPos.set(0, 8.2, small ? 34 : 26); wantTarget.set(0, 6.4, 0);
    } else if (form === 'sheet') {
      wantPos.set(small ? 0 : 3, small ? 26 : 22, small ? 13 : 12); wantTarget.set(0, 0, 0.6);
    } else if (form === 'donut') {
      wantPos.set(0, 8.6, small ? 36 : 22); wantTarget.set(0, 6.6, 0);
    } else if (form === 'logo') {
      wantPos.set(0, 7, small ? 31 : 19); wantTarget.set(0, 6.4, 0);
    }
  }

  // stan bieżący każdej kostki (do płynnego przejścia)
  const cur = cells.map(() => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, sz: 1, c: new THREE.Color() }));
  const from = cells.map(() => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1, sz: 1, c: new THREE.Color() }));
  let first = true;

  function morphTo(name) {
    if (!forms[name] || name === st.form) return;
    for (let k = 0; k < N; k++) Object.assign(from[k], cur[k], { c: from[k].c.copy(cur[k].c) });
    st.form = name; st.t0 = performance.now() / 1000; st.morphing = true;
  }

  // ---------- rozmiar i widoczność ----------
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  const dummy = new THREE.Object3D();
  let raf = 0, last = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!st.active || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = now / 1000;

    m.sx += (m.x - m.sx) * (1 - Math.pow(0.02, dt)); m.sy += (m.y - m.sy) * (1 - Math.pow(0.02, dt));
    cameraFor(st.form, t);
    const kc = first ? 1 : 1 - Math.pow(0.08, dt);
    camPos.lerp(wantPos, kc); camTarget.lerp(wantTarget, kc);
    camera.position.copy(camPos); camera.lookAt(camTarget);
    // przesunięcie obrazu tak, by środek sceny trafił w kotwicę sekcji (scena „jedzie” razem ze stroną)
    const ka = first ? 1 : 1 - Math.pow(0.0005, dt);
    anchorCur.x += (anchor.x - anchorCur.x) * ka; anchorCur.y += (anchor.y - anchorCur.y) * ka;
    const vw = window.innerWidth, vh = window.innerHeight;
    camera.setViewOffset(vw, vh, vw / 2 - anchorCur.x, vh / 2 - anchorCur.y, vw, vh);

    if (st.form === 'chart' && m.in && !reduced) {
      ray.setFromCamera(mouse, camera);
      if (!ray.ray.intersectPlane(plane, hit)) hit.set(999, 0, 999);
    } else hit.set(999, 0, 999);
    hitS.lerp(hit, 1 - Math.pow(0.0015, dt));

    const f = forms[st.form];
    const since = t - st.t0;
    let anyMorph = false;
    for (let k = 0; k < N; k++) {
      const c = cells[k];
      f(c, k, t);
      const o = cur[k];
      // opóźnienie składania: chaos→wykres sterowane przez assemble, inne przejścia czasowe
      let a;
      if (st.form === 'chart' && st.fromChaos) a = ease(clamp01((st.assemble * 1.6 - (c.dist / (G * GAP * 0.7)) * 0.55 - c.lag * 0.25) / 0.9));
      else a = st.morphing && !first ? ease(clamp01((since - c.lag * 0.4) / st.dur)) : 1;
      if (a < 1) anyMorph = true;
      const fr = from[k];
      o.x = mix(fr.x, out.x, a); o.y = mix(fr.y, out.y, a); o.z = mix(fr.z, out.z, a);
      o.rx = mix(fr.rx, out.rx, a); o.ry = mix(fr.ry, out.ry, a); o.rz = mix(fr.rz, out.rz, a);
      o.sx = mix(fr.sx, out.sx, a); o.sy = mix(fr.sy, out.sy, a); o.sz = mix(fr.sz, out.sz, a);
      o.c.copy(fr.c).lerp(out.c, a);
      dummy.position.set(o.x, o.y, o.z);
      dummy.rotation.set(o.rx, o.ry, o.rz);
      dummy.scale.set(o.sx, o.sy, o.sz);
      dummy.updateMatrix();
      mesh.setMatrixAt(k, dummy.matrix);
      mesh.setColorAt(k, o.c);
    }
    if (st.morphing && !anyMorph) st.morphing = false;
    first = false;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    ground.visible = st.form === 'chart' || st.form === 'sheet';
    renderer.render(scene, camera);
  }

  // start: chaos zapisany jako punkt wyjścia
  for (let k = 0; k < N; k++) { forms.chaos(cells[k], k, 0); Object.assign(cur[k], out, { c: cur[k].c.copy(out.c) }); Object.assign(from[k], out, { c: from[k].c.copy(out.c) }); }
  st.form = 'chart'; st.fromChaos = true; st.assemble = reduced ? 1 : 0;
  raf = requestAnimationFrame(frame);

  return {
    morphTo(name) { if (name !== 'chart') st.fromChaos = false; morphTo(name); },
    setAssemble(v) { st.assemble = v; },
    setScroll(v) { st.scroll = clamp01(v); },
    setClean(v) { st.clean = clamp01(v); },
    setActive(v) { st.active = v; },
    setAnchor(x, y) { anchor.x = x; anchor.y = y; },
    get form() { return st.form; },
    get debug() { return { cam: camPos.toArray().map((v) => +v.toFixed(2)), want: wantPos.toArray().map((v) => +v.toFixed(2)), anchor: [Math.round(anchorCur.x), Math.round(anchorCur.y)] }; },
    readTheme,
    destroy() { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', resize); renderer.dispose(); },
  };
}
