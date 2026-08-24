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

  function truthy(v) {
    const s = String(v || "").trim().toLowerCase();
    return s === "" || ["tak", "yes", "1", "x", "true", "prawda", "✓"].includes(s);
  }

  function rowsToItems(rows) {
    if (!rows.length) return [];
    const head = rows[0].map((h) => h.trim().toLowerCase());
    const idx = (names) => head.findIndex((h) => names.some((n) => h.includes(n)));
    const iLokal = idx(["lokal", "punkt", "miejsce"]);
    const iName = idx(["smak", "nazwa", "flavor"]);
    const iDesc = idx(["opis", "desc"]);
    const iTag = idx(["tag", "etykieta"]);
    const iVis = idx(["widoczny", "aktywny", "pokaz", "visible"]);
    const out = [];
    for (let r = 1; r < rows.length; r++) {
      const cols = rows[r];
      const name = (iName >= 0 ? cols[iName] : cols[1] || "").trim();
      if (!name) continue;
      if (iVis >= 0 && !truthy(cols[iVis])) continue;
      out.push({
        lokal: (iLokal >= 0 ? cols[iLokal] : "").trim().toLowerCase() || "wszystkie",
        name: name,
        desc: (iDesc >= 0 ? cols[iDesc] : "").trim(),
        tag: (iTag >= 0 ? cols[iTag] : "").trim()
      });
    }
    return out;
  }

  function demoData() {
    return {
      source: "demo",
      updated: null,
      list: FLAVORS.map((f) => ({ lokal: "wszystkie", name: f.name, desc: f.desc, tag: f.tag })),
      forLocation: function (id) {
        return this.list.filter((f) => f.lokal === "wszystkie" || f.lokal === id);
      }
    };
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
        return {
          source: "sheet",
          updated: new Date(),
          list: list,
          forLocation: function (id) {
            const here = this.list.filter((f) => f.lokal === "wszystkie" || f.lokal === id);
            return here.length ? here : this.list;
          }
        };
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
