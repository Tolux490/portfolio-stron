// Logo Vervo „V” w 3D: wyciągnięty szewron z lakierowanym materiałem, który śledzi kursor.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Obrys pogrubionej łamanej A-B-C (jak ścieżka SVG logo) z ucięciem pod kątem w wierzchołku.
function chevronShape(w = 12) {
  const A = new THREE.Vector2(6, 10), B = new THREE.Vector2(34, 48), C = new THREE.Vector2(62, 10);
  const half = w / 2;
  const n1 = new THREE.Vector2(-(B.y - A.y), B.x - A.x).normalize().multiplyScalar(half);
  const n2 = new THREE.Vector2(-(C.y - B.y), C.x - B.x).normalize().multiplyScalar(half);
  const meet = (p1, d1, p2, d2) => {
    const det = d1.x * d2.y - d1.y * d2.x;
    const t = ((p2.x - p1.x) * d2.y - (p2.y - p1.y) * d2.x) / det;
    return new THREE.Vector2(p1.x + d1.x * t, p1.y + d1.y * t);
  };
  const d1 = B.clone().sub(A), d2 = C.clone().sub(B);
  const outerB = meet(A.clone().sub(n1), d1, B.clone().sub(n2), d2);
  const innerB = meet(A.clone().add(n1), d1, B.clone().add(n2), d2);
  const pts = [A.clone().add(n1), innerB, C.clone().add(n2), C.clone().sub(n2), outerB, A.clone().sub(n1)];
  // oś Y w górę i środek w (0,0)
  const shape = new THREE.Shape(pts.map((p) => new THREE.Vector2(p.x - 34, -(p.y - 29))));
  return shape;
}

export function createLogo3D(canvas) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 500);
  camera.position.set(0, 0, 150);

  const geo = new THREE.ExtrudeGeometry(chevronShape(), { depth: 12, bevelEnabled: true, bevelThickness: 2.4, bevelSize: 2.2, bevelSegments: 8, curveSegments: 4 });
  geo.center();
  const mat = new THREE.MeshPhysicalMaterial({ metalness: 0.55, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.25 });
  const logo = new THREE.Mesh(geo, mat);
  const group = new THREE.Group();
  group.add(logo);
  scene.add(group);

  const l1 = new THREE.DirectionalLight(0xffffff, 1.6); l1.position.set(-40, 60, 80); scene.add(l1);
  const l2 = new THREE.PointLight(0xffffff, 4000, 0, 2); l2.position.set(60, -30, 60); scene.add(l2);

  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    mat.color.set(cs.getPropertyValue('--acc').trim() || '#f2a541');
  }
  readTheme();

  const m = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  const onMove = (e) => { m.x = (e.clientX / window.innerWidth) * 2 - 1; m.y = (e.clientY / window.innerHeight) * 2 - 1; };
  window.addEventListener('pointermove', onMove, { passive: true });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  let visible = false;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }); io.observe(canvas);

  let spin = 0, raf = 0, last = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = now / 1000;
    cur.x += (m.x - cur.x) * (1 - Math.pow(0.004, dt));
    cur.y += (m.y - cur.y) * (1 - Math.pow(0.004, dt));
    spin *= Math.pow(0.15, dt);
    group.rotation.y = cur.x * 0.7 + (reduced ? 0 : Math.sin(t * 0.6) * 0.18) + spin;
    group.rotation.x = cur.y * 0.45 + (reduced ? 0 : Math.cos(t * 0.5) * 0.08);
    group.position.y = reduced ? 0 : Math.sin(t * 1.1) * 1.6;
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);
  canvas.addEventListener('click', () => { spin += Math.PI * 2; });

  return { readTheme, destroy() { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onMove); renderer.dispose(); } };
}
