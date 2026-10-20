// The takeoff sheet: one data model, rendered as tab-separated text (copy) and as an HTML table (print).
import { totals, lineResult, splitLength, findBar, parseNum, fmt } from './rebar.js';

export function takeoffModel(mode, lines, wastePct) {
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
  const wastePctUsed = w > 0 ? w : 0;
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
    left: t.invalid,
  };
}

export function takeoffText(m, sep = '\t') {
  const out = [['Bar', `Length (${m.imp ? 'ft-in' : 'm'})`, 'Qty', `Total length (${m.lengthUnit})`, `Weight (${m.unit})`]];
  for (const r of m.rows) out.push([r.bar, r.length, String(r.qty), r.totalLength.toFixed(2), r.weight.toFixed(2)]);
  out.push([]);
  out.push(['Net weight', '', '', '', m.net.toFixed(2)]);
  if (m.wastePct > 0) out.push([`Waste ${m.wastePct}%`, '', '', '', m.wasteWeight.toFixed(2)]);
  out.push(['Total weight', '', '', '', m.total.toFixed(2)]);
  out.push([m.other.label, '', '', '', m.other.value.toFixed(2)]);
  out.push([m.tons.label, '', '', '', m.tons.value.toFixed(3)]);
  if (m.left) out.push([`${m.left} line${m.left > 1 ? 's' : ''} left out (check entry)`]);
  return out.map((r) => r.join(sep)).join('\n');
}

export function takeoffHtml(m, dateText) {
  const row = (r) => `<tr><td>${r.bar}</td><td>${r.length}</td><td>${r.qty}</td><td>${fmt(r.totalLength)}</td><td>${fmt(r.weight)}</td></tr>`;
  const foot = (label, value) => `<tr><th colspan="4">${label}</th><td>${value}</td></tr>`;
  return `<h1>Rebar takeoff</h1><p>${dateText} &middot; Nominal ASTM A615 weights</p>
<table><thead><tr><th>Bar</th><th>Length (${m.imp ? 'ft-in' : 'm'})</th><th>Qty</th><th>Total length (${m.lengthUnit})</th><th>Weight (${m.unit})</th></tr></thead><tbody>${m.rows.map(row).join('')}</tbody>
<tfoot>${foot('Net weight', fmt(m.net))}${m.wastePct > 0 ? foot(`Waste ${m.wastePct}%`, fmt(m.wasteWeight)) : ''}${foot('Total weight', `${fmt(m.total)} ${m.unit}`)}${foot(m.other.label, fmt(m.other.value))}${foot(m.tons.label, fmt(m.tons.value, 3))}</tfoot></table>${m.left ? `<p>${m.left} line${m.left > 1 ? 's' : ''} left out (check entry).</p>` : ''}`;
}
