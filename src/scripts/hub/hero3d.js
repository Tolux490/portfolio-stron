// Scena 3D w hero: kostki-dane zaczynają jako chaos i składają się w czysty wykres słupkowy.
// Kursor podnosi słupki, przewijanie obraca kamerę i rozbiera wykres przy wyjściu z hero.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

export function createHero3D(canvas, opts = {}) {
  const small = window.matchMedia('(max-width: 760px)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = small ? 13 : 19;
  const COUNT = N * N;
  const GAP = 1.18;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !small;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  const target = new THREE.Vector3(0, 0.6, 0);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-9, 16, 8);
  key.castShadow = !small;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 50 });
  key.shadow.bias = -0.0004;
  key.shadow.radius = 4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.9);
  rim.position.set(10, 6, -12);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 0.35));

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.32 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const geo = new RoundedBoxGeometry(1, 1, 1, 3, 0.14);
  geo.translate(0, 0.5, 0); // podstawa kostki na y=0, żeby skalować słupki od dołu
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.08, envMapIntensity: 0.9 });
  const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
  mesh.castShadow = !small;
  mesh.receiveShadow = !small;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(mesh);

  // Dla każdej kostki: pozycja w chaosie, pozycja w siatce, wysokość słupka, opóźnienie składania.
  const rnd = (a, b) => a + Math.random() * (b - a);
  const cells = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const x = (i - (N - 1) / 2) * GAP;
      const z = (j - (N - 1) / 2) * GAP;
      const d = Math.hypot(x, z);
      // „wykres”: kilka gaussowskich wzniesień + delikatna fala
      const h = 0.35
        + 3.4 * Math.exp(-((x + 3.2) ** 2 + (z - 1.5) ** 2) / 9)
        + 2.3 * Math.exp(-((x - 4) ** 2 + (z + 3.5) ** 2) / 7)
        + 1.4 * Math.exp(-((x - 1) ** 2 + (z - 5) ** 2) / 5)
        + 0.25 * Math.sin(x * 0.9) * Math.cos(z * 0.7);
      const r = rnd(7, 15), th = rnd(0, Math.PI * 2), ph = Math.acos(rnd(-0.6, 1));
      cells.push({
        gx: x, gz: z, h: Math.max(0.18, h), dist: d,
        cx: r * Math.sin(ph) * Math.cos(th), cy: Math.abs(r * Math.cos(ph)) * 0.7 + rnd(1, 6), cz: r * Math.sin(ph) * Math.sin(th),
        rx: rnd(-3, 3), ry: rnd(-3, 3), rz: rnd(-3, 3), cs: rnd(0.35, 0.9),
        delay: d / (N * GAP * 0.7) * 0.55 + rnd(0, 0.25),
        lift: 0, hue: 0,
      });
    }
  }
  const maxH = Math.max(...cells.map((c) => c.h));

  const dummy = new THREE.Object3D();
  const cBase = new THREE.Color(), cTop = new THREE.Color(), cAcc = new THREE.Color(), tmp = new THREE.Color();
  let state = { assemble: reduced ? 1 : 0, scroll: 0, visible: true, t0: performance.now() };

  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    cBase.set(cs.getPropertyValue('--cube').trim() || '#2a2d35');
    cTop.set(cs.getPropertyValue('--cube-top').trim() || '#d8d4c8');
    cAcc.set(cs.getPropertyValue('--acc').trim() || '#f2a541');
    ground.material.opacity = parseFloat(cs.getPropertyValue('--shadow-op')) || 0.32;
  }
  readTheme();

  // mysz → punkt na ziemi
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2(9, 9), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3(999, 0, 999), hitSmooth = new THREE.Vector3(999, 0, 999);
  let pointerIn = false;
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    pointerIn = e.clientY >= r.top && e.clientY <= r.bottom;
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // na szerokim ekranie przesuwamy obraz w prawo, żeby wykres nie wchodził pod nagłówek
    if (w > 900) camera.setViewOffset(w, h, -w * 0.2, h * 0.02, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const io = new IntersectionObserver(([e]) => { state.visible = e.isIntersecting; }, { threshold: 0 });
  io.observe(canvas);

  let raf = 0, last = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!state.visible || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const time = (now - state.t0) / 1000;

    // składanie po starcie (przyspiesza je preloader przez setAssemble)
    if (!reduced && opts.autoAssemble !== false) state.assemble = Math.min(1, state.assemble + dt / 2.6);
    const sc = state.scroll;

    // kamera: wolna orbita + przewijanie podnosi ją i obraca
    const orbit = (reduced ? 0 : time * 0.05) + sc * 0.9 + (opts.side ? 0.35 : 0);
    const radius = (small ? 26 : 25) - sc * 4;
    const camY = 13 + sc * 8;
    camera.position.set(Math.sin(orbit + 0.75) * radius, camY, Math.cos(orbit + 0.75) * radius);
    camera.lookAt(target);

    if (pointerIn && !reduced) {
      ray.setFromCamera(mouse, camera);
      ray.ray.intersectPlane(plane, hit) || hit.set(999, 0, 999);
    } else hit.set(999, 0, 999);
    hitSmooth.lerp(hit, 1 - Math.pow(0.0015, dt));

    for (let k = 0; k < COUNT; k++) {
      const c = cells[k];
      const a = smooth(clamp01((state.assemble * 1.6 - c.delay) / 0.9));
      // wyjście z hero: słupki opadają falą od środka
      const sink = smooth(clamp01((sc * 1.4 - c.dist / 30)));
      const dm = Math.hypot(c.gx - hitSmooth.x, c.gz - hitSmooth.z);
      const want = dm < 3.2 ? (1 - dm / 3.2) ** 2 * 2.6 : 0;
      c.lift += (want - c.lift) * (1 - Math.pow(0.002, dt));
      const wave = reduced ? 0 : Math.sin(time * 1.2 + c.gx * 0.45 + c.gz * 0.3) * 0.12;
      const h = Math.max(0.12, (c.h + c.lift + wave) * (1 - sink * 0.92));

      const x = c.cx + (c.gx - c.cx) * a;
      const y = (c.cy + Math.sin(time * 0.8 + k) * 0.3 * (1 - a)) * (1 - a);
      const z = c.cz + (c.gz - c.cz) * a;
      dummy.position.set(x, y, z);
      dummy.rotation.set(c.rx * (1 - a) + time * 0.4 * (1 - a), c.ry * (1 - a), c.rz * (1 - a));
      const s = c.cs + (1 - c.cs) * a;
      dummy.scale.set(s * 0.92, (s * (1 - a) + h * a), s * 0.92);
      dummy.updateMatrix();
      mesh.setMatrixAt(k, dummy.matrix);

      // kolor: wyższe słupki jaśniejsze, podniesione i najwyższe w akcencie
      const hn = clamp01(c.h / maxH);
      tmp.copy(cBase).lerp(cTop, hn * 0.55 * a);
      const accAmt = clamp01(c.lift / 1.4) + (hn > 0.74 ? (0.45 + (hn - 0.74) * 2.2) * a : 0);
      tmp.lerp(cAcc, clamp01(accAmt));
      mesh.setColorAt(k, tmp);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  return {
    setScroll(v) { state.scroll = clamp01(v); },
    setAssemble(v) { state.assemble = v; },
    restart() { state.assemble = 0; },
    readTheme,
    destroy() { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onMove); renderer.dispose(); },
  };
}
