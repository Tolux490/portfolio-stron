// Kostka-nawigacja na stronie głównej: przeciągasz, żeby obrócić, dotykasz ściany, żeby wejść.
// Każda ściana to podstrona (rysowana na płótnie jako tekstura), szósta ściana to Pong.
import * as THREE from 'three';

const FONT_D = "'Bricolage Grotesque Variable', 'Bricolage Grotesque', system-ui, sans-serif";
const FONT_B = "'Geist Variable', 'Geist', system-ui, sans-serif";

// kolory z motywu strony: ściany w kolorze tekstu, napisy w kolorze tła (na jasnym motywie odwrotnie)
function themeColors() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n, d) => cs.getPropertyValue(n).trim() || d;
  return { face: v('--fg', '#f3efe8'), ink: v('--bg', '#0e1116'), acc: v('--acc', '#ff6a4d'), muted: v('--muted', '#888') };
}

function drawFace(face, c, size = 1024) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const x = cv.getContext('2d');
  const P = size * 0.085;
  x.fillStyle = c.face; x.fillRect(0, 0, size, size);
  // drobne „pory” jak w betonie
  let seed = face.n.charCodeAt(1) * 977;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  x.fillStyle = c.ink;
  for (let i = 0; i < 260; i++) { x.globalAlpha = 0.04 + rnd() * 0.08; const r = 0.6 + rnd() * 2.4; x.beginPath(); x.arc(rnd() * size, rnd() * size, r, 0, 7); x.fill(); }
  x.globalAlpha = 1;
  // ramka wewnętrzna
  x.strokeStyle = c.ink; x.globalAlpha = 0.14; x.lineWidth = 2; x.strokeRect(P * 0.5, P * 0.5, size - P, size - P); x.globalAlpha = 1;
  // numer i strzałka
  x.fillStyle = c.ink; x.textBaseline = 'top';
  x.font = `500 ${size * 0.045}px ${FONT_B}`;
  x.fillText(face.n, P, P);
  x.textAlign = 'right'; x.font = `400 ${size * 0.075}px ${FONT_B}`;
  x.fillText(face.k === 'pong' ? '▶' : '↗', size - P, P * 0.85);
  x.textAlign = 'left';
  // mały rysunek Ponga na ścianie „Nudzisz się?”
  if (face.k === 'pong') {
    const cx = size / 2, cy = size * 0.42, u = size * 0.012;
    x.fillStyle = c.ink;
    x.fillRect(cx - size * 0.26, cy - u * 6, u * 2.2, u * 12);
    x.fillRect(cx + size * 0.26 - u * 2.2, cy - u * 2, u * 2.2, u * 12);
    for (let i = -5; i < 6; i++) { x.globalAlpha = 0.3; x.fillRect(cx - u * 0.4, cy + i * u * 3, u * 0.8, u * 1.6); }
    x.globalAlpha = 1; x.fillStyle = c.acc; x.fillRect(cx + size * 0.08, cy - u * 3, u * 2.2, u * 2.2);
  }
  // podpis i tytuł u dołu
  x.textBaseline = 'alphabetic';
  let fs = size * 0.2;
  x.font = `600 ${fs}px ${FONT_D}`;
  while (x.measureText(face.t).width > size - P * 2.4 && fs > size * 0.08) { fs *= 0.94; x.font = `600 ${fs}px ${FONT_D}`; }
  x.fillStyle = c.ink;
  const ty = size - P * 1.05;
  x.fillText(face.t, P, ty);
  const tw = x.measureText(face.t).width;
  x.fillStyle = c.acc; x.beginPath(); x.arc(P + tw + fs * 0.12, ty - fs * 0.06, fs * 0.07, 0, 7); x.fill();
  x.fillStyle = c.ink; x.globalAlpha = 0.62; x.font = `500 ${size * 0.042}px ${FONT_B}`;
  x.fillText(face.s, P, ty - fs * 0.92);
  x.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createNavCube(canvas, faces, { onPick } = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
  camera.position.set(0, 0.35, 9.2);
  camera.lookAt(0, -0.05, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x404040, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.5); rim.position.set(4, -2, -3); scene.add(rim);

  const group = new THREE.Group();
  scene.add(group);
  const mats = faces.map(() => new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 }));
  const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), mats);
  group.add(cube);

  // miękki cień pod kostką (rysowany na płótnie)
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const sx = sc.getContext('2d');
  const rg = sx.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, 'rgba(0,0,0,0.55)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  sx.fillStyle = rg; sx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.position.set(0, -1.95, 0); shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  const paint = () => {
    const c = themeColors();
    faces.forEach((f, i) => { mats[i].map?.dispose(); mats[i].map = drawFace(f, c); mats[i].needsUpdate = true; });
    dirty = true;
  };

  // startowe ustawienie: widać trzy ściany, „Projekty” z przodu
  group.quaternion.setFromEuler(new THREE.Euler(0.42, -0.62, 0));
  const vel = new THREE.Vector2(0, 0);
  let dragging = false, moved = 0, lastX = 0, lastY = 0, hover = -1, dirty = true, visible = false, snap = null, idleT = 0;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const axis = new THREE.Vector3(), dq = new THREE.Quaternion();

  const rotateBy = (dx, dy) => {
    const len = Math.hypot(dx, dy);
    if (!len) return;
    axis.set(dy, dx, 0).normalize();
    dq.setFromAxisAngle(axis, len * 0.0085);
    group.quaternion.premultiply(dq);
    dirty = true;
  };
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObject(cube)[0];
    return h ? h.face.materialIndex : -1;
  };
  const setHover = (i) => { if (i === hover) return; hover = i; canvas.style.cursor = i >= 0 ? 'pointer' : 'grab'; dirty = true; };

  const onDown = (e) => { dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; vel.set(0, 0); snap = null; canvas.setPointerCapture?.(e.pointerId); };
  const onMove = (e) => {
    if (!dragging) { if (e.pointerType === 'mouse') setHover(pick(e)); return; }
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
    rotateBy(dx, e.pointerType === 'touch' ? 0 : dy);
    vel.set(dx, e.pointerType === 'touch' ? 0 : dy);
  };
  const NORMALS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map((n) => new THREE.Vector3(...n));
  const onUp = (e) => {
    if (!dragging) return;
    dragging = false;
    if (moved > 7) return;
    const i = pick(e);
    if (i < 0) return;
    // obracamy wybraną ścianę przodem do widza, potem wchodzimy
    const n = NORMALS[i].clone().applyQuaternion(group.quaternion);
    const to = new THREE.Quaternion().setFromUnitVectors(n, new THREE.Vector3(0, 0.08, 1).normalize()).multiply(group.quaternion);
    snap = { from: group.quaternion.clone(), to, t: 0, i };
    vel.set(0, 0);
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', () => { dragging = false; });
  canvas.addEventListener('pointerleave', () => setHover(-1));

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
    camera.aspect = r.width / Math.max(1, r.height);
    camera.position.z = camera.aspect < 1 ? 9.2 / camera.aspect ** 0.8 : 9.2;
    camera.updateProjectionMatrix();
    dirty = true;
  };
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { rootMargin: '100px' });
  io.observe(canvas);
  const mo = new MutationObserver(paint);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  let raf = 0, last = performance.now(), scale = 1;
  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!visible) return;
    if (snap) {
      snap.t = Math.min(1, snap.t + dt / 0.55);
      const k = 1 - Math.pow(1 - snap.t, 3);
      group.quaternion.slerpQuaternions(snap.from, snap.to, k);
      if (snap.t >= 1) { const i = snap.i; snap = null; onPick?.(faces[i], i); }
      dirty = true;
    } else if (!dragging) {
      if (Math.abs(vel.x) + Math.abs(vel.y) > 0.05) { rotateBy(vel.x, vel.y); vel.multiplyScalar(Math.pow(0.04, dt)); }
      else if (!reduced && hover < 0) { idleT += dt; dq.setFromAxisAngle(new THREE.Vector3(0, 1, 0), dt * 0.22); group.quaternion.premultiply(dq); dirty = true; }
    }
    const want = hover >= 0 ? 1.05 : 1;
    if (Math.abs(scale - want) > 0.001) { scale += (want - scale) * (1 - Math.pow(0.001, dt)); group.scale.setScalar(scale); dirty = true; }
    if (!reduced) { const bob = Math.sin(now / 900) * 0.06; group.position.y = bob; shadow.scale.setScalar(1 - bob * 0.6); dirty = true; }
    if (dirty) { renderer.render(scene, camera); dirty = false; }
  };

  (document.fonts?.ready || Promise.resolve()).then(() => {
    Promise.all([document.fonts?.load?.(`600 100px ${FONT_D}`), document.fonts?.load?.(`500 40px ${FONT_B}`)]).catch(() => {}).finally(() => { paint(); resize(); raf = requestAnimationFrame(frame); });
  });

  return {
    destroy() { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); mo.disconnect(); window.removeEventListener('pointerup', onUp); renderer.dispose(); },
  };
}
