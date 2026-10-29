// Generator faktur (koncept): formularz → podgląd A4 na żywo, zapis w localStorage, druk do PDF.

const $ = (s, r = document) => r.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const KEY = 'vervo-invoice-v1';

function example() {
  const d = new Date();
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return {
    fromName: 'Vervo Studio', fromAddr: 'Example Street 12\n1000 AA Amsterdam', fromVat: 'NL000000000B01', fromIban: 'NL00 BANK 0000 0000 00',
    toName: 'Little Kettle Shop', toAddr: 'Harbour Road 4\n3011 AB Rotterdam',
    num: `INV-${d.getFullYear()}-014`, cur: 'EUR', date: iso, terms: 14, vat: 21, disc: 0,
    note: 'Thank you for your business. Please mention the invoice number with your payment.',
    items: [
      ['Order data cleaning: 300 rows, 4 countries', 1, 180],
      ['Sales summary tab with charts', 1, 120],
      ['Data validation and cleaning log', 1, 60],
    ],
  };
}

export function initInvoice() {
  const form = $('#invForm'), itemsEl = $('#items'), paper = $('#paper');
  let data;
  try { data = JSON.parse(localStorage.getItem(KEY)) || example(); } catch { data = example(); }

  const fields = ['fromName', 'fromAddr', 'fromVat', 'fromIban', 'toName', 'toAddr', 'num', 'cur', 'date', 'terms', 'vat', 'disc', 'note'];
  const fill = () => {
    fields.forEach((f) => { if (form.elements[f]) form.elements[f].value = data[f] ?? ''; });
    itemsEl.innerHTML = '';
    data.items.forEach((it) => addRow(it));
  };
  function addRow([d, q, p] = ['', 1, 0]) {
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `<input aria-label="Description" placeholder="Description" value="${esc(d)}" /><input aria-label="Quantity" type="number" min="0" step="0.5" value="${q}" /><input aria-label="Unit price" type="number" min="0" step="0.01" value="${p}" /><button type="button" aria-label="Remove line">×</button>`;
    row.querySelector('button').addEventListener('click', () => { row.remove(); sync(); });
    itemsEl.appendChild(row);
  }

  function sync() {
    fields.forEach((f) => { if (form.elements[f]) data[f] = form.elements[f].value; });
    data.items = [...itemsEl.querySelectorAll('.item')].map((r) => { const [a, b, c] = r.querySelectorAll('input'); return [a.value, +b.value || 0, +c.value || 0]; });
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
    render();
  }

  function render() {
    const money = new Intl.NumberFormat('en-IE', { style: 'currency', currency: data.cur || 'EUR' });
    const sub = data.items.reduce((a, [, q, p]) => a + q * p, 0);
    const disc = sub * (Math.min(100, Math.max(0, +data.disc || 0)) / 100);
    const net = sub - disc, vat = net * ((+data.vat || 0) / 100), total = net + vat;
    const issue = data.date ? new Date(data.date) : new Date();
    const due = new Date(issue.getTime() + (+data.terms || 0) * 864e5);
    const fmtD = (d) => (isNaN(d) ? '—' : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d));
    paper.innerHTML = `
      <div class="inv-h">
        <div><h2>Invoice</h2><p style="margin-top:.6em;color:#666">${esc(data.num)}</p></div>
        <svg class="mk" viewBox="0 0 68 60" aria-hidden="true"><path d="M6 10 L34 48 L62 10" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="meta">
        <div><b>From</b><strong>${esc(data.fromName)}</strong><div class="addr">${esc(data.fromAddr)}</div>${data.fromVat ? `<div>VAT ${esc(data.fromVat)}</div>` : ''}</div>
        <div><b>Bill to</b><strong>${esc(data.toName)}</strong><div class="addr">${esc(data.toAddr)}</div></div>
        <div><b>Dates</b><div>Issued ${fmtD(issue)}</div><div>Due ${fmtD(due)}</div></div>
      </div>
      <table>
        <thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Amount</th></tr></thead>
        <tbody>${data.items.filter(([d, q, p]) => d || q * p).map(([d, q, p]) => `<tr><td>${esc(d) || '—'}</td><td>${q}</td><td>${money.format(p)}</td><td>${money.format(q * p)}</td></tr>`).join('') || '<tr><td colspan="4" style="color:#999">Add a line item</td></tr>'}</tbody>
      </table>
      <div class="tot">
        <div><span>Subtotal</span><span>${money.format(sub)}</span></div>
        ${disc ? `<div><span>Discount ${+data.disc}%</span><span>−${money.format(disc)}</span></div>` : ''}
        <div><span>VAT ${+data.vat || 0}%</span><span>${money.format(vat)}</span></div>
        <div class="grand"><span>Total due</span><span>${money.format(total)}</span></div>
      </div>
      <p style="margin-top:2em;color:#444;max-width:60ch">${esc(data.note)}</p>
      <div class="inv-foot"><span>${esc(data.fromName)} · ${esc(data.fromIban)}</span><span>Payable within ${+data.terms || 0} days</span></div>`;
  }

  form.addEventListener('input', sync);
  $('#addItem').addEventListener('click', () => { addRow(); sync(); itemsEl.lastElementChild?.querySelector('input')?.focus(); });
  $('#resetInv').addEventListener('click', () => { data = example(); fill(); sync(); });
  $('#print').addEventListener('click', () => window.print());
  fill(); render();
}
