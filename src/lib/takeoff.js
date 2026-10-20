// The takeoff sheet: one data model, rendered as tab-separated text (copy) and as an HTML table (print).
import { totals, lineResult, splitLength, findBar, parseNum, fmt, materialCost, LIMITS } from './rebar.js';

// price (optional): { text, unit }. A cost row appears only when the price is a valid number above zero.
export function takeoffModel(mode, lines, wastePct, price) {
  const imp = mode === 'imperial';
  const t = totals(mode, lines, wastePct);
  const w = parseNum(wastePct);
  const rows = [];
  for (const l of lines) {
    const r = lineResult(mode, l);
    if (!r.ok || r.empty) continue;
    const { major, minor } = splitLength(mode, l.a, l.b);
    rows.push({
      bar: findBar(mode, l.size).label,
      length: imp ? `${major}'-${minor}"` : String(major),
      qty: parseNum(l.qty),
      totalLength: r.totalLength,
      weight: imp ? r.lb : r.kg,
    });
  }
  const wastePctUsed = w > 0 && w <= LIMITS.waste ? w : 0;
  const cost = price && parseNum(price.text) > 0 ? materialCost(price.text, price.unit, t.lb, t.kg) : NaN;
  const priceLabel = price && parseNum(price.text) > 0 ? `$${fmt(parseNum(price.text))} per ${{ lb: 'lb', ton: 'short ton', kg: 'kg', tonne: 'metric ton' }[price.unit]}` : '';
  return {
    imp,
    unit: imp ? 'lb' : 'kg',
    lengthUnit: imp ? 'ft' : 'm',
    rows,
    net: imp ? t.netLb : t.netKg,
    wastePct: wastePctUsed,
    wasteWeight: wastePctUsed > 0 ? (imp ? t.lb - t.netLb : t.kg - t.netKg) : 0,
    total: imp ? t.lb : t.kg,
    other: { label: imp ? 'Total in kg' : 'Total in lb', value: imp ? t.kg : t.lb },
    tons: { label: imp ? 'Short tons' : 'Metric tons', value: imp ? t.shortTons : t.metricTonnes },
    cost: Number.isFinite(cost) ? cost : null,
    priceLabel,
    left: t.invalid,
  };
}

// Same rounding as fmt() on screen and in print, but without thousands commas, so a pasted number is a number.
const plain = (n, d = 2) => (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { useGrouping: false, minimumFractionDigits: d, maximumFractionDigits: d });

export function takeoffText(m, sep = '\t') {
  const out = [['Bar', `Length (${m.imp ? 'ft-in' : 'm'})`, 'Qty', `Total length (${m.lengthUnit})`, `Weight (${m.unit})`]];
  for (const r of m.rows) out.push([r.bar, r.length, String(r.qty), plain(r.totalLength, 2), plain(r.weight, 2)]);
  out.push([]);
  out.push(['Net weight', '', '', '', plain(m.net, 2)]);
  if (m.wastePct > 0) out.push([`Waste ${m.wastePct}%`, '', '', '', plain(m.wasteWeight, 2)]);
  out.push(['Total weight', '', '', '', plain(m.total, 2)]);
  out.push([m.other.label, '', '', '', plain(m.other.value, 2)]);
  out.push([m.tons.label, '', '', '', plain(m.tons.value, 3)]);
  if (m.cost !== null) out.push([`Material cost (${m.priceLabel})`, '', '', '', plain(m.cost, 2)]);
  if (m.left) out.push([`${m.left} line${m.left > 1 ? 's' : ''} left out (check entry)`]);
  return out.map((r) => r.join(sep)).join('\n');
}

export function takeoffHtml(m, dateText) {
  const row = (r) => `<tr><td>${r.bar}</td><td>${r.length}</td><td>${r.qty}</td><td>${fmt(r.totalLength)}</td><td>${fmt(r.weight)}</td></tr>`;
  const foot = (label, value) => `<tr><th colspan="4">${label}</th><td>${value}</td></tr>`;
  return `<h1>Rebar takeoff</h1><p>${dateText} &middot; Nominal ASTM A615 weights</p>
<table><thead><tr><th>Bar</th><th>Length (${m.imp ? 'ft-in' : 'm'})</th><th>Qty</th><th>Total length (${m.lengthUnit})</th><th>Weight (${m.unit})</th></tr></thead><tbody>${m.rows.map(row).join('')}</tbody>
<tfoot>${foot('Net weight', fmt(m.net))}${m.wastePct > 0 ? foot(`Waste ${m.wastePct}%`, fmt(m.wasteWeight)) : ''}${foot('Total weight', `${fmt(m.total)} ${m.unit}`)}${foot(m.other.label, fmt(m.other.value))}${foot(m.tons.label, fmt(m.tons.value, 3))}${m.cost !== null ? foot(`Material cost (${m.priceLabel})`, '$' + fmt(m.cost)) : ''}</tfoot></table>${m.left ? `<p>${m.left} line${m.left > 1 ? 's' : ''} left out (check entry).</p>` : ''}`;
}

// CSV for Excel and Google Sheets. Every cell is quoted, and a quote inside a cell is doubled.
export function takeoffCsv(m) {
  const q = (c) => `"${String(c).replace(/"/g, '""')}"`;
  return takeoffText(m, '\u0000').split('\n').map((r) => r.split('\u0000').map(q).join(',')).join('\r\n');
}
