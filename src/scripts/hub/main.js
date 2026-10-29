// Warstwa ruchu i interakcji strony głównej: płynne przewijanie, preloader, odsłony tekstu,
// przewijanie w bok, kursor, motywy, menu, formularz. Sceny 3D ładują się osobno (dynamic import).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduced = root.classList.contains('reduced');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;

export function initHub() {
  const cfg = JSON.parse($('#hubConfig')?.textContent || '{}');
  let lenis = null;
  const scenes = { hero: null, logo: null };

  // ---------- płynne przewijanie ----------
  if (!reduced) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.4 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = (target) => {
    const el = typeof target === 'string' ? (target === '#top' ? 0 : $(target)) : target;
    if (el === null || el === undefined) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    else if (el === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else el.scrollIntoView({ behavior: 'smooth' });
  };
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const h = a.getAttribute('href');
    if (h.length < 2 || a.hasAttribute('data-mailto')) return;
    const el = h === '#top' ? 0 : $(h);
    if (el === null) return;
    e.preventDefault();
    closeMenu();
    scrollTo(h);
  }));

  // ---------- sceny 3D (osobny chunk z three.js) ----------
  const heroCanvas = $('#heroGl');
  const logoCanvas = $('#logoGl');
  const webgl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  if (webgl && heroCanvas) {
    import('./hero3d.js').then(({ createHero3D }) => {
      scenes.hero = createHero3D(heroCanvas, { autoAssemble: false });
      if (heroReady) scenes.hero.setAssemble(reduced ? 1 : 0);
      heroAssembleStart();
    });
  }
  if (webgl && logoCanvas) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import('./logo3d.js').then(({ createLogo3D }) => { scenes.logo = createLogo3D(logoCanvas); });
    }, { rootMargin: '600px' });
    io.observe(logoCanvas);
  }

  // składanie wykresu w hero: animujemy parametr po zakończeniu preloadera
  let heroReady = false, heroAnim = null;
  const assembleProxy = { v: 0 };
  function heroAssembleStart() {
    if (!heroReady || !scenes.hero || heroAnim) return;
    if (reduced) { scenes.hero.setAssemble(1); return; }
    heroAnim = gsap.to(assembleProxy, { v: 1, duration: 3.2, ease: 'power2.inOut', onUpdate: () => scenes.hero?.setAssemble(assembleProxy.v) });
  }

  // ---------- motywy ----------
  const themeColor = $('meta[name="theme-color"]');
  const setTheme = (th) => {
    root.setAttribute('data-theme', th);
    try { localStorage.setItem('vervo-theme', th); } catch {}
    requestAnimationFrame(() => {
      themeColor?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
      scenes.hero?.readTheme(); scenes.logo?.readTheme();
    });
  };
  $$('[data-set-theme]').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.setTheme)));
  themeColor?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());

  // ---------- zegar CET ----------
  const clock = $('#clock');
  const tick = () => { if (clock) clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Warsaw' }).format(new Date()); };
  tick(); setInterval(tick, 15000);

  // ---------- menu ----------
  const menu = $('#menu'), menuBtn = $('#menuBtn');
  let menuTl = null;
  const buildMenuTl = () => gsap.timeline({ paused: true })
    .to('.menu__bg', { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
    .from('.menu__w', { yPercent: 110, duration: 0.8, stagger: 0.05, ease: 'expo.out' }, '-=0.35')
    .from('.menu__n, .menu__side > *', { opacity: 0, y: 12, duration: 0.5, stagger: 0.02 }, '-=0.6');
  function openMenu() {
    root.classList.add('menu-open'); menu.removeAttribute('inert'); menuBtn.setAttribute('aria-expanded', 'true');
    lenis?.stop();
    if (reduced) { gsap.set('.menu__bg', { clipPath: 'inset(0 0 0% 0)' }); return; }
    (menuTl ||= buildMenuTl()).timeScale(1).play();
  }
  function closeMenu() {
    if (!root.classList.contains('menu-open')) return;
    root.classList.remove('menu-open'); menu.setAttribute('inert', ''); menuBtn.setAttribute('aria-expanded', 'false');
    lenis?.start();
    if (reduced || !menuTl) { gsap.set('.menu__bg', { clipPath: 'inset(0 0 100% 0)' }); return; }
    menuTl.timeScale(1.8).reverse();
  }
  menuBtn?.addEventListener('click', () => (root.classList.contains('menu-open') ? closeMenu() : openMenu()));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // ---------- nagłówek: chowa się przy przewijaniu w dół ----------
  const hdr = $('#hdr');
  let lastY = 0;
  const onScrollHdr = (y) => {
    hdr.classList.toggle('is-solid', y > 40);
    if (!root.classList.contains('menu-open')) hdr.classList.toggle('is-hidden', y > 400 && y > lastY + 2);
    if (y < lastY - 2) hdr.classList.remove('is-hidden');
    lastY = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScrollHdr(scroll));
  else window.addEventListener('scroll', () => onScrollHdr(window.scrollY), { passive: true });

  // ---------- preloader + wejście hero ----------
  const seen = root.classList.contains('seen');
  try { sessionStorage.setItem('vervo-seen', '1'); } catch {}
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .to('.hdr', { opacity: 1, duration: 1 }, 0)
    .to('.hero .hl__in', { yPercent: 0, y: 0, duration: 1.4, stagger: 0.12 }, 0.05)
    .to('.hero .avail, .hero__row, .hero__cta, .badge', { opacity: 1, duration: 1.2, stagger: 0.1 }, 0.5)
    .from('.hero__row, .hero__cta', { y: 24, duration: 1.2, stagger: 0.1 }, 0.5);
  function startIntro() {
    heroReady = true;
    heroAssembleStart();
    if (reduced) return;
    gsap.set('.hero .hl__in', { yPercent: 110 });
    intro.play();
  }
  if (reduced) startIntro();
  else if (seen) { gsap.delayedCall(0.1, startIntro); }
  else runPreloader(startIntro);

  function runPreloader(done) {
    const num = $('#preNum'), bar = $('#preBar'), stage = $('#preStage');
    const counter = { v: 0 };
    const stages = cfg.loading || [];
    lenis?.stop();
    gsap.timeline()
      .to(counter, {
        v: 100, duration: 2.1, ease: 'power3.inOut',
        onUpdate() {
          const v = Math.round(counter.v);
          num.textContent = v;
          bar.style.transform = `scaleX(${counter.v / 100})`;
          const s = Math.min(stages.length - 1, Math.floor(v / (100 / stages.length)));
          if (stages[s]) stage.textContent = `0${s + 1} / ${stages[s]}`;
        },
      })
      .to('#pre', { clipPath: 'inset(0 0 100% 0)', duration: 1.05, ease: 'expo.inOut', onStart: done }, '+=0.15')
      .add(() => { $('#pre').style.display = 'none'; lenis?.start(); ScrollTrigger.refresh(); });
  }

  // ---------- terminal w hero: pisze kroki czyszczenia danych z projektu Little Kettle ----------
  const term = $('#term');
  if (term && !reduced) {
    const LINES = [
      ['> SELECT * FROM orders_export', '300 rows'],
      ['> TRIM(order_id)', '✓ 24'],
      ['> PARSE_DATE(5 formats)', '✓ 193'],
      ['> MAP country  17 → 4', '✓ 240'],
      ['> MAP product  28 → 8', '✓ 201'],
      ['> DEDUPE orders', '✓ −18'],
      ['> FLAG suspicious_rows', '⚑ 10'],
      ['> BUILD summary', '€14,306'],
      ['> EXPORT report.xlsx', 'done'],
    ];
    let li = 0;
    const typeLine = () => {
      const [cmd, res] = LINES[li % LINES.length];
      const el = document.createElement('li');
      el.className = 'cur-line';
      term.querySelectorAll('.cur-line').forEach((x) => x.classList.remove('cur-line'));
      term.appendChild(el);
      while (term.children.length > 8) term.firstChild.remove();
      let c = 0;
      const pad = ' '.repeat(Math.max(1, 30 - cmd.length));
      const step = () => {
        c++;
        el.textContent = cmd.slice(0, c);
        if (c < cmd.length) setTimeout(step, 28 + Math.random() * 40);
        else setTimeout(() => {
          el.innerHTML = '';
          el.append(cmd + pad);
          const b = document.createElement('b'); b.textContent = res; el.append(b);
          li++;
          setTimeout(typeLine, li % LINES.length === 0 ? 2600 : 520);
        }, 260);
      };
      step();
    };
    setTimeout(typeLine, seen ? 1200 : 3600);
  }

  // ---------- hero: postęp przewijania → scena ----------
  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (st) => scenes.hero?.setScroll(st.progress),
  });
  if (!reduced) {
    gsap.to('.hero__in', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // ---------- nagłówki sekcji: litery wyjeżdżają z maski ----------
  if (!reduced) {
    document.fonts?.ready.then(() => {
      $$('.split').forEach((h) => {
        const st = new SplitText(h, { type: 'lines,words', mask: 'lines', linesClass: 'sl' });
        gsap.from(st.words, { yPercent: 110, duration: 1.1, stagger: 0.04, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
      });
      $$('.contact__big .hl__in').forEach((el, i) => {
        gsap.from(el, { yPercent: 110, duration: 1.3, delay: i * 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.contact__big', start: 'top 85%' } });
      });
      ScrollTrigger.refresh();
    });

    // manifest: słowa rozjaśniają się w rytm przewijania
    const mani = $('[data-words]');
    if (mani) {
      const st = new SplitText(mani, { type: 'words', wordsClass: 'w' });
      gsap.to(st.words, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: mani, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    }

    // ogólne odsłony bloków
    const reveal = (sel, opts = {}) => $$(sel).forEach((el) => {
      el.classList.add('rv');
      gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', ...opts, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    reveal('.shead__lede, .lab, .case, .svc__row, .cert, .why__i, .step, .faq details, .proof li, .contact__p, .soc li, .form, .cta-bar, .portrait, .about__p, .about__pic .hfacts, .sites__meta');

    // portret: lekka paralaksa
    gsap.fromTo('.portrait img', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'bottom top', scrub: true } });

    // proces: linia rysuje się przy przewijaniu
    gsap.to('#stepsLine', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 60%', scrub: true } });

    // wielki napis w stopce
    gsap.from('.word span', { yPercent: 100, duration: 1.2, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.word', start: 'top 95%' } });
  } else {
    gsap.set('#stepsLine', { scaleX: 1 });
  }

  // ---------- liczniki ----------
  $$('[data-count]').forEach((el) => {
    const end = parseInt(el.dataset.count, 10);
    if (reduced || !end) return;
    const o = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } }),
    });
  });

  // ---------- pasek narzędzi: nieskończona pętla, reaguje na prędkość przewijania ----------
  const track = $('.marq__track');
  if (track && !reduced) {
    const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    let dir = 1;
    ScrollTrigger.create({
      trigger: '.marq', start: 'top bottom', end: 'bottom top',
      onUpdate: (st) => {
        const v = st.getVelocity();
        dir = v < 0 ? -1 : 1;
        gsap.to(loop, { timeScale: dir * (1 + Math.min(4, Math.abs(v) / 400)), duration: 0.3, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.3, overwrite: false });
        gsap.to('.marq__it', { skewX: gsap.utils.clamp(-10, 10, -v / 180), duration: 0.4, overwrite: true });
        gsap.to('.marq__it', { skewX: 0, duration: 0.8, delay: 0.3, overwrite: false });
      },
    });
  }

  // ---------- strony www: przypięta sekcja przewijana w bok ----------
  const sitesTrack = $('#sitesTrack'), sitesProg = $('#sitesProg'), view = $('.sites__view');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    if (reduced || !sitesTrack) return;
    const dist = () => Math.max(0, sitesTrack.scrollWidth - window.innerWidth);
    const tween = gsap.to(sitesTrack, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.sites__pin', start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (st) => { if (sitesProg) sitesProg.style.transform = `scaleX(${st.progress})`; },
      },
    });
    return () => tween.scrollTrigger?.kill();
  });
  mm.add('(max-width: 899px)', () => {
    const onS = () => { const m = view.scrollWidth - view.clientWidth; if (sitesProg) sitesProg.style.transform = `scaleX(${m ? view.scrollLeft / m : 0})`; };
    view?.addEventListener('scroll', onS, { passive: true });
    return () => view?.removeEventListener('scroll', onS);
  });

  // ---------- filmy: grają tylko w kadrze ----------
  const vids = $$('.screen__vid');
  const vio = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting && !reduced) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.35 });
  vids.forEach((v) => {
    vio.observe(v);
    v.closest('.screen')?.addEventListener('click', () => { if (v.paused) v.play().catch(() => {}); else v.pause(); });
  });

  // ---------- wskaźnik sekcji ----------
  const railLinks = $$('[data-rail]');
  $$('[data-sec]').forEach((sec) => {
    const i = +sec.dataset.sec;
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: (st) => { if (st.isActive) railLinks.forEach((a) => a.classList.toggle('on', +a.dataset.rail === i)); },
    });
  });
  railLinks.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); scrollTo(a.getAttribute('href')); }));

  // ---------- kursor, magnes, przechył kart ----------
  if (finePointer && !reduced) {
    root.classList.add('has-cursor');
    const cur = $('#cur'), dot = $('.cur__dot'), ring = $('.cur__ring'), lab = $('#curLab');
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }, rp = { ...pos };
    const xDot = gsap.quickSetter(dot, 'x', 'px'), yDot = gsap.quickSetter(dot, 'y', 'px');
    const xRing = gsap.quickSetter(ring, 'x', 'px'), yRing = gsap.quickSetter(ring, 'y', 'px');
    window.addEventListener('pointermove', (e) => { pos.x = e.clientX; pos.y = e.clientY; xDot(pos.x); yDot(pos.y); }, { passive: true });
    gsap.ticker.add(() => {
      const k = 1 - Math.pow(0.0001, gsap.ticker.deltaRatio(60) / 60);
      rp.x += (pos.x - rp.x) * Math.max(k, 0.16); rp.y += (pos.y - rp.y) * Math.max(k, 0.16);
      xRing(rp.x); yRing(rp.y);
    });
    window.addEventListener('pointerdown', () => cur.classList.add('is-down'));
    window.addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('pointerover', (e) => {
      const el = e.target.closest('[data-cursor], a, button, summary');
      cur.classList.remove('is-hover', 'is-label');
      if (!el) return;
      const kind = el.dataset.cursor || 'hover';
      const label = cfg.cursor?.[kind];
      if (label) { lab.textContent = label; cur.classList.add('is-label'); }
      else cur.classList.add('is-hover');
    });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-hover', 'is-label'));

    // przyciski „magnetyczne”
    $$('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.32); yTo((e.clientY - r.top - r.height / 2) * 0.45);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });

    // przechył certyfikatów z odblaskiem
    $$('.tilt').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 10}deg) rotateX(${(0.5 - py) * 8}deg)`;
        el.style.setProperty('--gx', `${px * 100}%`); el.style.setProperty('--gy', `${py * 100}%`);
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  // ---------- e-mail: kopiowanie i mailto składane dopiero przy kliknięciu ----------
  const emailAddr = () => (cfg.parts ? cfg.parts[0] + String.fromCharCode(64) + cfg.parts.slice(1).join('.') : '');
  $$('[data-copy-email]').forEach((btn) => btn.addEventListener('click', async () => {
    const lab = btn.querySelector('span') || btn;
    try { await navigator.clipboard.writeText(emailAddr()); lab.textContent = cfg.copied; }
    catch { lab.textContent = emailAddr(); }
    setTimeout(() => { lab.textContent = cfg.copyEmail; }, 2200);
  }));
  $$('[data-mailto]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'mailto:' + emailAddr();
  }));

  // ---------- lightbox ----------
  const lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  $$('[data-zoom]').forEach((el) => el.addEventListener('click', () => {
    lbImg.src = el.dataset.zoom; lbImg.alt = el.dataset.cap || ''; lbCap.textContent = el.dataset.cap || '';
    lb.showModal(); lenis?.stop();
  }));
  $('#lbX')?.addEventListener('click', () => lb.close());
  lb?.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb?.addEventListener('close', () => lenis?.start());

  // ---------- formularz (FormSubmit) ----------
  const form = $('#kForm'), stat = $('#kStat'), btn = $('#kBtn');
  const btnLabel = btn?.querySelector('span');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault(); stat.textContent = ''; stat.className = 'kstat mono';
    let ok = true;
    form.querySelectorAll('[required]').forEach((p) => {
      if (p.type === 'checkbox') { if (!p.checked) ok = false; return; }
      const bad = !p.value.trim();
      p.closest('.fld')?.classList.toggle('bad', bad);
      if (bad) ok = false;
    });
    if (!ok) { stat.textContent = cfg.msgs.incomplete; stat.classList.add('err'); return; }
    const d = Object.fromEntries(new FormData(form).entries());
    if (d._honey) return; // pułapka na boty
    try {
      btn.disabled = true; btnLabel.textContent = cfg.msgs.sending;
      const to = cfg.formId || emailAddr();
      const res = await fetch('https://formsubmit.co/ajax/' + to, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: cfg.msgs.subject, _template: 'table', _captcha: 'false',
          'Imię': d.imie, 'E-mail': d.email, 'Potrzeba': d.potrzeba, 'Wiadomość': d.wiadomosc, 'Język strony': cfg.lang,
        }),
      });
      const r = await res.json();
      if (r.success === true || r.success === 'true') { stat.textContent = cfg.msgs.ok; stat.classList.add('ok'); form.reset(); }
      else throw 0;
    } catch { stat.textContent = cfg.msgs.fail; stat.classList.add('err'); }
    finally { btn.disabled = false; btnLabel.textContent = cfg.submitLabel; }
  });

  // przeliczenie pozycji po załadowaniu obrazków i fontów
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
