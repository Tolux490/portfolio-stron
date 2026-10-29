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
  // stare linki do sekcji jednej długiej strony (np. /#work) prowadzą teraz na podstrony
  const MOVED = { '#work': 'work/', '#lab': 'lab/', '#websites': 'websites/', '#about': 'about/', '#certificates': 'about/#certificates', '#process': 'about/#process', '#faq': 'about/#faq' };
  if (cfg.page === 'home' && MOVED[location.hash]) { location.replace(location.pathname.replace(/\/?$/, '/') + MOVED[location.hash]); return; }
  let lenis = null;
  let world = null;

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

  // ---------- świat 3D (osobny chunk z three.js) ----------
  const worldCanvas = $('#world');
  const webgl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  if (webgl && worldCanvas) {
    import('./world3d.js').then(({ createWorld }) => {
      world = createWorld(worldCanvas);
      world.setActive(stagesInView.size > 0);
      worldCanvas.classList.toggle('on', stagesInView.size > 0);
      if (activeStage) world.morphTo(activeStage);
      heroAssembleStart();
    }).catch(() => { /* bez 3D strona działa normalnie */ });
  }

  // składanie wykresu w hero: animujemy parametr po zakończeniu preloadera
  let heroReady = false, heroAnim = null;
  const assembleProxy = { v: 0 };
  function heroAssembleStart() {
    if (!heroReady || !world || heroAnim) return;
    if (reduced) { world.setAssemble(1); return; }
    heroAnim = gsap.to(assembleProxy, { v: 1, duration: 3.2, ease: 'power2.inOut', onUpdate: () => world?.setAssemble(assembleProxy.v) });
  }

  // ---------- motywy ----------
  const themeColor = $('meta[name="theme-color"]');
  const setTheme = (th) => {
    root.setAttribute('data-theme', th);
    try { localStorage.setItem('vervo-theme', th); } catch {}
    requestAnimationFrame(() => {
      themeColor?.setAttribute('content', getComputedStyle(root).getPropertyValue('--bg').trim());
      world?.readTheme();
      pongAttract?.readColors(); pongGame?.readColors();
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
    .from('.menu__n, .menu__side .menu__grp', { opacity: 0, y: 14, duration: 0.6, stagger: 0.04 }, '-=0.6');
  function openMenu() {
    root.classList.add('menu-open'); menu.removeAttribute('inert'); menuBtn.setAttribute('aria-expanded', 'true');
    hdr?.classList.remove('is-hidden');
    menu.querySelector('.menu__in').scrollTop = 0;
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
  // link do strony, na której już jesteśmy: po prostu zamknij menu
  $$('.menu__a, .hnav__a').forEach((a) => a.addEventListener('click', (e) => {
    if (new URL(a.href, location.href).pathname === location.pathname && !a.hash) { e.preventDefault(); closeMenu(); scrollTo('#top'); }
  }));
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
  const hasHero = !!$('.hero'), hasHead = !!$('.phead');
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } }).to('.hdr', { opacity: 1, duration: 1 }, 0);
  if (hasHero) intro
    .to('.hero .hl__in', { yPercent: 0, y: 0, duration: 1.4, stagger: 0.12 }, 0.05)
    .to('.hero .avail, .hero__row, .hero__cta, .badge', { opacity: 1, duration: 1.2, stagger: 0.1 }, 0.5)
    .from('.hero__row, .hero__cta', { y: 24, duration: 1.2, stagger: 0.1 }, 0.5);
  if (hasHead) intro
    .fromTo('.phead .hl__in', { yPercent: 110 }, { yPercent: 0, duration: 1.4 }, 0.05)
    .from('.phead .lab, .phead__lede, .phead .sites__hint', { opacity: 0, y: 24, duration: 1.2, stagger: 0.08 }, 0.35);
  function startIntro() {
    heroReady = true;
    heroAssembleStart();
    if (reduced) return;
    if (hasHero) gsap.set('.hero .hl__in', { yPercent: 110 });
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
  if (hasHero) ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (st) => world?.setScroll(st.progress),
  });
  if (!reduced && hasHero) {
    gsap.to('.hero__in', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // ---------- sceny świata 3D ----------
  const stagesInView = new Set();
  let activeStage = null, activeEl = null;
  $$('[data-stage]').forEach((el) => {
    const name = el.dataset.stage;
    ScrollTrigger.create({
      trigger: el, start: 'top bottom', end: 'bottom top', refreshPriority: -1,
      onToggle: (st) => {
        if (st.isActive) stagesInView.add(el); else stagesInView.delete(el);
        const on = stagesInView.size > 0;
        worldCanvas?.classList.toggle('on', on);
        world?.setActive(on);
      },
    });
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', end: 'bottom 35%', refreshPriority: -1,
      onToggle: (st) => { if (st.isActive) { activeStage = name; activeEl = el; world?.morphTo(name); } },
    });
  });

  // kotwice: gdzie na ekranie stoi kształt danej sceny (śledzą sekcję przy przewijaniu)
  const wide = () => window.innerWidth >= 900;
  const centerOf = (sel, fx) => { const e = $(sel); if (!e) return null; const r = e.getBoundingClientRect(); return { x: wide() ? window.innerWidth * fx : window.innerWidth / 2, y: r.top + r.height / 2 }; };
  const ANCHORS = {
    chart: () => { const r = $('.hero').getBoundingClientRect(); return { x: wide() ? window.innerWidth * 0.68 : window.innerWidth / 2, y: r.top + (wide() ? 0.52 : 0.78) * window.innerHeight }; },
    // na telefonie kształt stoi nad tekstem (sekcje mają na to miejsce u góry)
    globe: () => (wide() ? centerOf('.mani', 0.76) : { x: window.innerWidth / 2, y: $('.mani').getBoundingClientRect().top + window.innerHeight * 0.26 }),
    sheet: () => ({ x: window.innerWidth * 0.66, y: window.innerHeight * 0.56 }),
    logo: () => { const e = $('.logo-space'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; },
  };
  // scena z zarezerwowanym miejscem ([data-space]): kształt stoi w nim i jest dopasowany do jego rozmiaru
  const spaceAnchor = () => {
    const sp = activeEl?.querySelector('[data-space]'), r = sp?.getBoundingClientRect();
    if (!r || !r.height) return null;
    world.setFit(r.height / window.innerHeight, r.width / window.innerWidth);
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  gsap.ticker.add(() => {
    if (!world || !stagesInView.size || !activeStage) return;
    let a = spaceAnchor();
    if (!a) { world.setFit(0, 0); a = ANCHORS[activeStage]?.(); }
    if (a) world.setAnchor(a.x, a.y);
  });

  // nagłówek „Projekty”: arkusz 3D sam się brudzi i czyści w pętli
  if ($('[data-autoclean]')) {
    const o = { v: 0 };
    const loop = () => { if (world && activeStage === 'sheet' && activeEl?.hasAttribute('data-autoclean')) world.setClean(o.v); };
    if (reduced) { o.v = 1; gsap.ticker.add(loop); }
    else { gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 1.6 }).to(o, { v: 1, duration: 4.5, ease: 'power1.inOut', onUpdate: loop }).to(o, { v: 0, duration: 0.01, onUpdate: loop }, '+=1.8'); }
  }

  // ---------- kliknięcie w pustą część sceny 3D rozrzuca kostki ----------
  window.addEventListener('pointerdown', (e) => {
    if (!world || !stagesInView.size || e.button > 0) return;
    if (e.target.closest('a, button, input, select, textarea, summary, label, .term, .proof, .pstep, .faq, .form, .contact__side, .menu')) return;
    if (!e.target.closest('.stage')) return;
    world.burst((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
  }, { passive: true });

  // ---------- proces: arkusz czyści się w rytm przewijania ----------
  const steps = $$('.pstep__i'), cleanBar = $('#cleanBar'), cleanPct = $('#cleanPct');
  const setClean = (p) => {
    world?.setClean(p);
    const idx = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
    steps.forEach((s, i) => { s.classList.toggle('on', i === idx); s.classList.toggle('done', i < idx); });
    if (cleanBar) cleanBar.style.transform = `scaleX(${p})`;
    if (cleanPct) cleanPct.textContent = `${Math.round((1 - p) * 20)}%`;
  };
  if ($('.process')) setClean(0);
  const mmP = gsap.matchMedia();
  mmP.add('(min-width: 900px) and (min-height: 620px)', () => {
    if (!$('.process__pin')) return;
    if (reduced) { setClean(1); return; }
    const st = ScrollTrigger.create({ trigger: '.process__pin', start: 'top top', end: '+=160%', pin: true, scrub: true, onUpdate: (s) => setClean(s.progress) });
    return () => st.kill();
  });
  mmP.add('(max-width: 899px), (max-height: 619px)', () => {
    if (!$('.process')) return;
    if (reduced) { setClean(1); return; }
    const st = ScrollTrigger.create({ trigger: '.process', start: 'top 70%', end: 'bottom 40%', scrub: true, onUpdate: (s) => setClean(s.progress) });
    return () => st.kill();
  });

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
    reveal('.shead__lede, .case, .svc__row, .cert, .why__i, .faq details, .proof li, .contact__p, .soc li, .form, .cta-bar, .about__p, .labc, .pjson, .chap__list li, .nextp__a');
    if ($('.kit')) gsap.from('.kit__i', { opacity: 0, y: 30, duration: 1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.kit', start: 'top 85%' } });

    // 2D #1: etykiety sekcji i kart wsuwają się spokojnie, kropka „zapala się” chwilę później
    $$('.lab, .labc__k, .case__bar span:first-child, .site__n').filter((el) => !el.closest('.phead')).forEach((el) => {
      gsap.from(el, { opacity: 0, x: -14, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    // 2D #2: zrzuty i okna odsłaniają się „kurtyną” z lekkim zoomem
    $$('.screen, .labc__img, .shot__img, .cert__img').forEach((el) => {
      const img = el.querySelector('img, video');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } });
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' });
      if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0.1);
    });

    // wielki napis w stopce
    gsap.from('.word span', { yPercent: 100, duration: 1.2, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.word', start: 'top 95%' } });
  }

  // ---------- ikony rysują się, gdy wjadą w kadr ----------
  const dio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('drawn'); dio.unobserve(e.target);
  }), { rootMargin: '0px 0px -10% 0px' });
  $$('.draw').forEach((el, i) => { el.style.setProperty('--d', `${(i % 8) * 0.08}s`); dio.observe(el); });

  // ---------- FAQ: płynne rozwijanie odpowiedzi ----------
  $$('.faq details').forEach((d) => {
    const sum = d.querySelector('summary'), body = d.querySelector('p');
    if (!sum || !body || reduced) return;
    sum.addEventListener('click', (e) => {
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, opacity: 0, duration: 0.45, ease: 'expo.inOut', onComplete: () => { d.open = false; gsap.set(body, { clearProps: 'height,opacity' }); ScrollTrigger.refresh(); } });
      } else {
        d.open = true;
        gsap.fromTo(body, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.6, ease: 'expo.out', onComplete: () => { gsap.set(body, { clearProps: 'height' }); ScrollTrigger.refresh(); } });
      }
    });
  });

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

  // ---------- strony www: przypięta sekcja przewijana w bok ----------
  const sitesTrack = $('#sitesTrack'), sitesProg = $('#sitesProg'), view = $('.sites__view');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    if (reduced || !sitesTrack || !$('.sites__pin')) return;
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
    if (!view) return;
    view.addEventListener('scroll', onS, { passive: true });
    return () => view?.removeEventListener('scroll', onS);
  });

  // ---------- spis rozdziałów: podgląd strony jedzie za kursorem ----------
  const chapFloat = $('.chap__float'), chapImg = $('#chapImg');
  if (chapFloat && finePointer && !reduced) {
    const fx = gsap.quickTo(chapFloat, 'x', { duration: 0.6, ease: 'power3.out' });
    const fy = gsap.quickTo(chapFloat, 'y', { duration: 0.6, ease: 'power3.out' });
    $$('.chap__a').forEach((a) => {
      a.addEventListener('pointerenter', () => { chapImg.src = a.dataset.img; chapFloat.classList.add('on'); });
      a.addEventListener('pointerleave', () => chapFloat.classList.remove('on'));
      a.addEventListener('pointermove', (e) => { fx(e.clientX + 40); fy(e.clientY); });
    });
  }

  // ---------- Pong: tło sekcji „Nudzisz się?” gra samo, przycisk otwiera grę ----------
  const B = cfg.bored || {};
  let pongGame = null, pongAttract = null;
  const attractCv = $('#pongAttract');
  if (attractCv) {
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        if (!pongAttract) import('./pong.js').then(({ createPong }) => { pongAttract = createPong(attractCv, { mode: 'attract' }); if (!reduced) pongAttract.start(); });
        else if (!reduced) pongAttract.start();
      } else pongAttract?.stop();
    }, { rootMargin: '80px' }).observe(attractCv);
  }
  const dlg = $('#pongDlg'), pMsg = $('#pongMsg'), pBig = $('#pongBig'), pSmall = $('#pongSmall');
  const showMsg = (big, small) => { pBig.textContent = big; pSmall.textContent = small; pMsg.hidden = false; };
  async function openPong() {
    if (!dlg) return;
    closeMenu();
    dlg.showModal(); lenis?.stop();
    const { createPong } = await import('./pong.js');
    if (!pongGame) {
      pongGame = createPong($('#pongCanvas'), {
        mode: 'play',
        onScore: (you, cpu) => { $('#pongYou').textContent = you; $('#pongCpu').textContent = cpu; },
        onEnd: (won) => showMsg(won ? B.win : B.lose, B.again),
      });
    }
    pongGame.readColors(); pongGame.reset();
    $('#pongYou').textContent = '0'; $('#pongCpu').textContent = '0';
    showMsg('', B.start);
    pongGame.start();
  }
  if (dlg) {
    const field = dlg.querySelector('.pong__field');
    const hide = () => { pMsg.hidden = true; };
    field.addEventListener('pointerdown', hide);
    dlg.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') hide(); });
    $('#pongClose').addEventListener('click', () => dlg.close());
    $('#pongSound').addEventListener('click', (e) => {
      const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
      e.currentTarget.setAttribute('aria-pressed', String(on)); pongGame?.setMuted(!on);
    });
    dlg.addEventListener('close', () => { pongGame?.stop(); lenis?.start(); });
  }
  $$('[data-pong]').forEach((b) => b.addEventListener('click', openPong));

  // ---------- kostka-nawigacja ----------
  const cubeCv = $('#navCube');
  if (cubeCv && webgl) {
    let made = false;
    new IntersectionObserver(([en], obs) => {
      if (!en.isIntersecting || made) return;
      made = true; obs.disconnect();
      const faces = JSON.parse(cubeCv.dataset.faces || '[]');
      import('./navcube.js').then(({ createNavCube }) => createNavCube(cubeCv, faces, {
        onPick: (f) => {
          if (f.k === 'pong') { openPong(); return; }
          if (f.href.startsWith('#')) { scrollTo(f.href); return; }
          const a = document.createElement('a');
          a.href = f.href; a.dataset.curtain = f.t; a.hidden = true;
          document.body.appendChild(a); a.click(); a.remove();
        },
      }));
    }, { rootMargin: '300px' }).observe(cubeCv);
  } else if (cubeCv) cubeCv.closest('.chap__cube')?.remove();

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
      trigger: sec, start: 'top 50%', end: 'bottom 50%', refreshPriority: -1,
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

  // podgląd stanu scen do testów: dodaj ?debug do adresu
  if (location.search.includes('debug')) window.__vervo = () => ({ form: world?.form, dbg: world?.debug, inView: [...stagesInView].map((e) => e.dataset.stage), y: window.scrollY, st: ScrollTrigger.getAll().filter((t) => t.trigger?.dataset?.stage).map((t) => [t.trigger.dataset.stage, Math.round(t.start), Math.round(t.end), t.isActive]) });

  // przypięcia i sceny liczone od góry strony do dołu (kolejność ma znaczenie przy pin)
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  window.addEventListener('load', () => {
    ScrollTrigger.sort(); ScrollTrigger.refresh();
    // wejście z innej strony na kotwicę (np. /#contact): przewiń po ułożeniu przypięć
    if (location.hash.length > 1 && $(location.hash)) {
      if (lenis) lenis.scrollTo($(location.hash), { immediate: true, force: true });
      else $(location.hash).scrollIntoView();
    }
  });
}
