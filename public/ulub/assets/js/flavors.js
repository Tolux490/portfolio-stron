/* =====================================================================
   SMAKI DNIA — CMS przez Arkusz Google (z listą zapasową)
   Personel edytuje arkusz -> strona pokazuje aktualne smaki. Bez rebuildu.
   ===================================================================== */
const Flavors = (function () {
  "use strict";

  function parseCSV(text) {
    const rows = []; let row = [], field = "", inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
        else field += c;
      } else if (c === '"') inQ = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c !== "\r") field += c;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // Kolumna "widoczny": puste = pokazuj (domyślnie tak)
  function truthy(v) {
    const s = String(v || "").trim().toLowerCase();
    return s === "" || ["tak", "yes", "1", "x", "true", "prawda", "✓"].includes(s);
  }

  // Zaznaczenie lokalu: puste = NIE (odwrotnie niż "widoczny"); obsługuje checkbox z Arkusza (TRUE)
  function marked(v) {
    const s = String(v || "").trim().toLowerCase();
    return ["x", "tak", "yes", "1", "true", "prawda", "✓", "✔", "v", "+"].indexOf(s) >= 0;
  }

  function norm(s) {
    return String(s || "").toLowerCase()
      .replace(/ł/g, "l").replace(/ą/g, "a").replace(/ę/g, "e").replace(/ó/g, "o")
      .replace(/ś/g, "s").replace(/[żź]/g, "z").replace(/ć/g, "c").replace(/ń/g, "n")
      .replace(/[^a-z0-9]/g, "");
  }

  // Lista lokali (id + warianty nazwy) do dopasowania nagłówków kolumn i tokenów
  function locIndex() {
    const out = [];
    if (typeof LOCATIONS !== "undefined" && Array.isArray(LOCATIONS)) {
      LOCATIONS.forEach((l) => {
        const keys = new Set([norm(l.id), norm(l.name)]);
        const parts = String(l.name).split(",");
        if (parts.length > 1) keys.add(norm(parts[parts.length - 1]));
        out.push({ id: l.id, keys: [...keys].filter(Boolean) });
      });
    }
    return out;
  }
  function matchLoc(token, idx) {
    const n = norm(token);
    if (!n) return null;
    if (["wszystkie", "wszystko", "wszedzie", "all", "kazdy", "kazde"].indexOf(n) >= 0) return "wszystkie";
    for (const l of idx) if (l.keys.indexOf(n) >= 0) return l.id;
    for (const l of idx) if (l.keys.some((k) => k && (n.indexOf(k) >= 0 || k.indexOf(n) >= 0))) return l.id;
    return null;
  }

  function makeData(source, updated, list) {
    return {
      source: source, updated: updated, list: list,
      // id pusty ("") = "Wszystkie lokale" => pełna lista
      forLocation: function (id) {
        if (!id) return this.list;
        return this.list.filter((f) => f.lokale.indexOf("wszystkie") >= 0 || f.lokale.indexOf(id) >= 0);
      }
    };
  }

  function rowsToItems(rows) {
    if (!rows.length) return [];
    const head = rows[0].map((h) => h.trim().toLowerCase());
    const idx = (names) => head.findIndex((h) => names.some((n) => h.includes(n)));
    const iName = idx(["smak", "nazwa", "flavor"]);
    const iDesc = idx(["opis", "desc"]);
    const iTag = idx(["tag", "etykieta"]);
    const iVis = idx(["widoczny", "aktywny", "pokaz", "visible"]);
    const iLokal = idx(["lokale", "lokal", "punkt", "miejsce"]); // stara kolumna tekstowa (opcjonalna)
    const lidx = locIndex();
    const known = {};
    [iName, iDesc, iTag, iVis, iLokal].forEach((i) => { if (i >= 0) known[i] = 1; });
    // Nowość: kolumny per-lokal (macierz zaznaczeń) + ewentualna kolumna "Wszystkie"
    const locCols = []; let iAll = -1;
    head.forEach((h, c) => {
      if (known[c]) return;
      const id = matchLoc(h, lidx);
      if (id === "wszystkie") { iAll = c; return; }
      if (id) locCols.push({ col: c, id: id });
    });
    const out = [];
    for (let r = 1; r < rows.length; r++) {
      const cols = rows[r];
      const name = (iName >= 0 ? cols[iName] : cols[1] || "").trim();
      if (!name) continue;
      if (iVis >= 0 && !truthy(cols[iVis])) continue;
      const set = [];
      const add = (id) => { if (id && set.indexOf(id) < 0) set.push(id); };
      locCols.forEach((lc) => { if (marked(cols[lc.col])) add(lc.id); });
      if (iAll >= 0 && marked(cols[iAll])) add("wszystkie");
      if (iLokal >= 0) String(cols[iLokal] || "").split(/[,;/|]+/).forEach((tok) => add(matchLoc(tok, lidx)));
      if (!set.length) add("wszystkie"); // brak zaznaczeń = wszędzie (bezpieczny domyślny)
      out.push({
        name: name,
        desc: (iDesc >= 0 ? cols[iDesc] : "").trim(),
        tag: (iTag >= 0 ? cols[iTag] : "").trim(),
        lokale: set
      });
    }
    return out;
  }

  function demoData() {
    return makeData("demo", null, FLAVORS.map((f) => ({ name: f.name, desc: f.desc, tag: f.tag, lokale: ["wszystkie"] })));
  }

  function load() {
    const url = (typeof CONFIG !== "undefined" && CONFIG.flavorsSheetCsvUrl || "").trim();
    if (!url) return Promise.resolve(demoData());

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    return fetch(url, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .then((text) => {
        clearTimeout(t);
        const list = rowsToItems(parseCSV(text));
        if (!list.length) return demoData();
        return makeData("sheet", new Date(), list);
      })
      .catch(() => { clearTimeout(t); return demoData(); });
  }

  function cardHTML(f, i) {
    const tag = f.tag ? `<span class="flavor-tag">${f.tag}</span>` : "";
    return `<article class="flavor">
      <div class="flavor__row"><span class="flavor__no">${String(i + 1).padStart(2, "0")}</span>${tag}</div>
      <h3 class="flavor__name">${f.name}</h3>
      ${f.desc ? `<p class="flavor__desc">${f.desc}</p>` : ""}
    </article>`;
  }

  function renderInto(el, items) {
    if (!el) return;
    if (!items.length) { el.innerHTML = `<p class="flavor-empty">Dziś przygotowujemy świeżą partię. Zajrzyj za chwilę.</p>`; return; }
    el.innerHTML = items.map(cardHTML).join("");
  }

  return { load, renderInto, cardHTML };
})();
