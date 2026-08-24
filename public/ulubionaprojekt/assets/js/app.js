/* =====================================================================
   ULUBIONA LODY v2 — logika i renderowanie
   ===================================================================== */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- HEADER ---------- */
  const header = $(".hdr");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- MOBILE NAV ---------- */
  const burger = $(".burger"), mnav = $(".mnav");
  if (burger && mnav) {
    const toggle = (open) => {
      const o = open ?? !mnav.classList.contains("is-open");
      mnav.classList.toggle("is-open", o);
      burger.setAttribute("aria-expanded", String(o));
      document.body.style.overflow = o ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle());
    $$(".mnav a").forEach((a) => a.addEventListener("click", () => toggle(false)));
    document.addEventListener("keydown", (e) => e.key === "Escape" && toggle(false));
  }

  /* ---------- REVEAL ---------- */
  function initReveal(root = document) {
    const els = $$(".reveal", root);
    if (reduce || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }

  $$("[data-year]").forEach((e) => (e.textContent = new Date().getFullYear()));

  const footLocs = $("[data-footer-locations]");
  if (footLocs && typeof LOCATIONS !== "undefined")
    footLocs.innerHTML = LOCATIONS.map((l) => `<li><a href="lokal.html?id=${l.id}">${l.name}</a></li>`).join("");

  /* ---------- FORMULARZE (web3forms, tryb pokazowy gdy brak klucza) ---------- */
  function handleForm(form) {
    if (!form) return;
    const status = $(".form-status", form);
    const btn = $("[type=submit]", form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const setStatus = (msg, ok) => { if (status) { status.textContent = msg; status.className = "form-status " + (ok ? "ok" : "err"); } };
      const key = (typeof CONFIG !== "undefined" && CONFIG.formKey || "").trim();
      const label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.dataset.label = label; btn.textContent = "Wysyłanie…"; }
      try {
        if (!key) {
          await new Promise((r) => setTimeout(r, 600));
          setStatus("Dziękujemy! To wersja pokazowa, więc wiadomość nie została realnie wysłana. Po podpięciu klucza formularz działa naprawdę.", true);
          form.reset();
        } else {
          const fd = new FormData(form);
          fd.append("access_key", key);
          fd.append("subject", form.dataset.subject || "Wiadomość ze strony Ulubiona Lody");
          const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
          const json = await res.json();
          if (json.success) { setStatus("Dziękujemy! Wiadomość wysłana. Odezwiemy się wkrótce.", true); form.reset(); }
          else setStatus("Nie udało się wysłać. Spróbuj ponownie albo napisz na " + SITE.email + ".", false);
        }
      } catch (err) {
        setStatus("Wystąpił błąd sieci. Spróbuj ponownie za chwilę.", false);
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || label; }
      }
    });
  }
  $$("form[data-form]").forEach(handleForm);

  /* =====================================================================
     STRONA GŁÓWNA
     ===================================================================== */
  if (document.body.dataset.page === "home") {
    /* --- SMAKI DNIA (CMS) --- */
    const board = $("#flavorBoard"), sel = $("#flavorLoc"), note = $("#flavorNote");
    if (board) {
      if (sel && typeof LOCATIONS !== "undefined")
        sel.innerHTML = `<option value="">Wszystkie lokale</option>` +
          LOCATIONS.map((l) => `<option value="${l.id}">${l.name}</option>`).join("");
      Flavors.load().then((data) => {
        const draw = () => Flavors.renderInto(board, data.forLocation(sel ? sel.value : ""));
        draw();
        if (sel) sel.addEventListener("change", draw);
        if (note) {
          if (data.source === "sheet") {
            const t = data.updated ? data.updated.toLocaleDateString("pl-PL", { day: "numeric", month: "long" }) : "";
            note.innerHTML = `<span class="live"></span> Na żywo z tablicy smaków${t ? " · zaktualizowano " + t : ""}.`;
          } else {
            note.innerHTML = `<span class="live live--demo"></span> Podgląd przykładowy. Po podpięciu arkusza Google obsługa zmienia smaki codziennie z telefonu.`;
          }
        }
      });
    }

    /* --- LOKALE --- */
    const grid = $("#locGrid");
    if (grid && typeof LOCATIONS !== "undefined") {
      const card = (l) => {
        const st = openStatus(l);
        return `<article class="loc reveal" data-q="${(l.city + " " + l.name + " " + l.address).toLowerCase()}">
          <a class="loc__media" href="lokal.html?id=${l.id}" aria-label="Zobacz lokal ${l.name}">
            <img src="${l.hero}" alt="Ulubiona Lody, ${l.name}" loading="lazy" />
            ${l.flagship ? '<span class="loc__flag">Lokal flagowy</span>' : ""}
          </a>
          <div class="loc__body">
            <div class="loc__head">
              <h3 class="loc__name"><a href="lokal.html?id=${l.id}">${l.name}</a></h3>
              ${st ? `<span class="pill ${st.open ? "pill--open" : "pill--closed"}">${st.text}</span>` : ""}
            </div>
            <p class="loc__addr">${ICON.pin}<span>${l.address}</span></p>
            <div class="loc__foot">
              <a class="tlink" href="lokal.html?id=${l.id}">Zobacz lokal ${ICON.arrow}</a>
              <a class="loc__nav" href="${mapsDirections(l)}" target="_blank" rel="noopener" aria-label="Nawiguj do ${l.name}">${ICON.nav}</a>
            </div>
          </div>
        </article>`;
      };
      grid.innerHTML = LOCATIONS.map(card).join("");
      const search = $("#locSearch"), count = $("#locCount");
      const setCount = (n) => { if (count) count.textContent = n + " " + (n === 1 ? "lokal" : n < 5 ? "lokale" : "lokali"); };
      setCount(LOCATIONS.length);
      initReveal(grid);
      if (search) search.addEventListener("input", () => {
        const q = search.value.trim().toLowerCase(); let v = 0;
        $$(".loc", grid).forEach((c) => { const m = c.dataset.q.includes(q); c.style.display = m ? "" : "none"; if (m) v++; });
        setCount(v);
        let empty = $("#locEmpty");
        if (!v && !empty) { empty = document.createElement("p"); empty.id = "locEmpty"; empty.className = "flavor-empty"; empty.textContent = "Brak lokalu dla tej frazy. Spróbuj innej nazwy miasta."; grid.appendChild(empty); }
        else if (v && empty) empty.remove();
      });
    }

    /* --- KAWA (sklep) --- */
    const coffee = $("#coffeeGrid");
    if (coffee && typeof COFFEE !== "undefined")
      coffee.innerHTML = COFFEE.map((c) => `<article class="prod reveal">
        <div class="prod__ic">${ICON.coffee}</div>
        <h3 class="prod__name">${c.name}</h3>
        <p class="prod__meta">${c.variant} · ${c.weight}</p>
        <p class="prod__desc">${c.desc}</p>
        <div class="prod__foot"><span class="prod__price">${c.price}</span>
          <a class="btn btn--sm" href="#kontakt" data-prefill="Chcę zamówić kawę: ${c.name} (${c.variant}, ${c.weight}).">Zamów</a></div>
      </article>`).join("");

    /* --- OPINIE --- */
    const rev = $("#reviewGrid");
    if (rev && typeof REVIEWS !== "undefined") {
      const stars = (n) => Array.from({ length: 5 }, (_, i) => `<span class="${i < n ? "on" : ""}">${ICON.star}</span>`).join("");
      rev.innerHTML = REVIEWS.map((r) => `<blockquote class="review reveal">
        <div class="review__stars">${stars(r.stars)}</div>
        <p class="review__text">${r.text}</p>
        <cite class="review__author">${r.author}</cite>
      </blockquote>`).join("");
      const sum = $("#reviewSummary");
      if (sum && typeof REVIEWS_SUMMARY !== "undefined")
        sum.innerHTML = `<span class="rev-rating">${REVIEWS_SUMMARY.rating.toFixed(1)}</span>
          <span class="rev-stars">${stars(Math.round(REVIEWS_SUMMARY.rating))}</span>
          <span class="rev-count">na podstawie ${REVIEWS_SUMMARY.count.toLocaleString("pl-PL")} opinii Google</span>`;
    }

    /* --- FAQ --- */
    const faq = $("#faqList");
    if (faq && typeof FAQ !== "undefined") {
      faq.innerHTML = FAQ.map((f, i) => `<div class="faq reveal">
        <button class="faq__q" aria-expanded="false" aria-controls="faq${i}">
          <span>${f.q}</span><span class="faq__ic">${ICON.plus}</span>
        </button>
        <div class="faq__a" id="faq${i}" role="region"><p>${f.a}</p></div>
      </div>`).join("");
      $$(".faq__q", faq).forEach((btn) => btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        const panel = btn.nextElementSibling;
        panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
        btn.closest(".faq").classList.toggle("is-open", !open);
      }));
    }

    /* --- prefill formularza z przycisków "Zamów" --- */
    $$("[data-prefill]").forEach((a) => a.addEventListener("click", () => {
      const msg = $("#contactForm [name=message]");
      if (msg) { msg.value = a.dataset.prefill; }
      const type = $("#contactForm [name=temat]");
      if (type) type.value = "Zamówienie kawy";
    }));
  }

  /* =====================================================================
     PODSTRONA LOKALU
     ===================================================================== */
  if (document.body.dataset.page === "location") {
    const id = new URLSearchParams(location.search).get("id");
    const loc = (typeof LOCATIONS !== "undefined" && LOCATIONS.find((l) => l.id === id)) || LOCATIONS[0];
    const st = openStatus(loc);
    document.title = `${loc.name} · Ulubiona Lody`;

    $("#locHeroImg").src = loc.hero;
    $("#locHeroImg").alt = `Ulubiona Lody, ${loc.name}`;
    $("#locCity").textContent = loc.city;
    $("#locName").textContent = loc.name;
    $("#locAddr").innerHTML = ICON.pin + `<span>${loc.address}</span>`;
    if (st) { const p = $("#locStatus"); p.textContent = st.text; p.className = "pill " + (st.open ? "pill--open" : "pill--closed"); }
    $("#locIntro").textContent = loc.intro;
    $("#actNav").href = mapsDirections(loc);
    $("#actPhone").href = "tel:" + (SITE.phone || "").replace(/[^+\d]/g, "");

    $("#infoAddr").innerHTML = `<span>${loc.address}</span>`;
    $("#infoHours").innerHTML = `<table class="hours">${loc.hours.rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</table><p class="micro">Godziny sezonowe. Poza sezonem mogą być krótsze.</p>`;
    $("#infoSocial").innerHTML = `<div class="soc-row">
      <a href="${loc.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.instagram}</a>
      <a href="${loc.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ICON.facebook}</a>
      <a href="mailto:${SITE.email}" aria-label="E-mail">${ICON.mail}</a></div>`;
    $("#locMap").innerHTML = `<iframe title="Mapa, Ulubiona Lody ${loc.name}" src="${mapsEmbed(loc)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;

    Flavors.load().then((data) => {
      Flavors.renderInto($("#locFlavors"), data.forLocation(loc.id));
      const n = $("#locFlavorNote");
      if (n) n.textContent = data.source === "sheet" ? "Aktualna tablica smaków w tym lokalu." : "Przykładowa oferta. Pełną tablicę zobaczysz na miejscu i na Instagramie.";
    });

    $("#locPricing").innerHTML = PRICING.map((b) => `<div class="price-col">
      <h3 class="price-col__t">${b.title}${b.note ? `<span>${b.note}</span>` : ""}</h3>
      ${b.items.map((it) => `<div class="price-row"><span class="price-row__n">${it.name}${it.sub ? `<small>${it.sub}</small>` : ""}</span><span class="price-row__d"></span><span class="price-row__v">${it.val}</span></div>`).join("")}
    </div>`).join("");

    $("#locGallery").innerHTML = (loc.gallery || []).map((g) => `<a href="assets/img/${g}" target="_blank" rel="noopener"><img src="assets/img/${g}" alt="Ulubiona Lody ${loc.name}" loading="lazy" /></a>`).join("");

    $("#otherLocs").innerHTML = LOCATIONS.filter((l) => l.id !== loc.id).slice(0, 4).map((l) => `<a class="other" href="lokal.html?id=${l.id}"><span>${l.city}</span><strong>${l.name}</strong><small>${l.address}</small></a>`).join("");
  }

  initReveal();
})();
