// HTML for one takeoff line. Used on the server (first paint, no layout shift) and in the browser.
import { IMPERIAL_BARS, METRIC_BARS, ISO_BARS, findBar, lineResult, barLength, splitLength, kgPerM, lbPerFt, fmt } from './rebar.js';

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function sizeOptions(mode, selected) {
  const opt = (b, text) => `<option value="${b.id}"${b.id === selected ? ' selected' : ''}>${text}</option>`;
  if (mode === 'imperial') {
    return IMPERIAL_BARS.map((b) => opt(b, `${b.label} &middot; ${b.dia} in`)).join('');
  }
  return (
    `<optgroup label="ASTM metric bar sizes">${METRIC_BARS.map((b) => opt(b, `${b.label} &middot; ${b.dia} mm`)).join('')}</optgroup>` +
    `<optgroup label="Round diameter (mm)">${ISO_BARS.map((b) => opt(b, b.label)).join('')}</optgroup>`
  );
}

// Plain-text help under a line: weight per foot (or meter) and the weight of one bar.
// With no valid length it uses a stock bar (20 ft, or 12 m), so the size answers "how much does it weigh" at once.
export function infoText(mode, line) {
  const bar = findBar(mode, line.size);
  if (!bar) return '';
  const imp = mode === 'imperial';
  const len = barLength(mode, line.a, line.b);
  const typed = Number.isFinite(len) && len > 0;
  const per = imp ? `${bar.w.toFixed(3)} lb/ft (${fmt(kgPerM(bar), 3)} kg/m)` : `${fmt(bar.w, 3)} kg/m (${fmt(lbPerFt(bar), 3)} lb/ft)`;
  const useLen = typed ? len : imp ? 20 : 12;
  const w = bar.w * useLen;
  const one = imp ? `${fmt(w)} lb` : `${fmt(w)} kg`;
  let lenText;
  if (!typed) lenText = imp ? '20 ft' : '12 m';
  else if (imp) { const { major, minor } = splitLength(mode, line.a, line.b); lenText = minor ? `${major} ft ${minor} in` : `${major} ft`; }
  else lenText = `${splitLength(mode, line.a, line.b).major} m`;
  return `${bar.label.replace(/ \(.*\)/, '')} bar: ${per}. One ${lenText} bar: ${one}.`;
}

export function rowHtml(mode, line, n, removable) {
  const imp = mode === 'imperial';
  const id = `l${n}`;
  const r = lineResult(mode, line);
  const weight = r.ok && !r.empty ? `${fmt(imp ? r.lb : r.kg)} ${imp ? 'lb' : 'kg'}` : imp ? '0.00 lb' : '0.00 kg';
  return `<div class="rb-row" data-row="${n}" role="group" aria-label="Line ${n + 1}">
  <div class="rb-f rb-size"><label for="${id}-size">Bar size</label><select id="${id}-size" data-k="size" class="rb-in">${sizeOptions(mode, line.size)}</select></div>
  <div class="rb-f rb-len"><label for="${id}-a">${imp ? 'Length, ft' : 'Length, m'}</label><input id="${id}-a" data-k="a" class="rb-in" type="text" inputmode="decimal" autocomplete="off" value="${escAttr(line.a)}" placeholder="0"></div>
  <div class="rb-f rb-inch"${imp ? '' : ' hidden'}><label for="${id}-b">Inches</label><input id="${id}-b" data-k="b" class="rb-in" type="text" inputmode="decimal" autocomplete="off" value="${escAttr(line.b)}" placeholder="0"></div>
  <div class="rb-f rb-qty"><label for="${id}-qty">Quantity</label><input id="${id}-qty" data-k="qty" class="rb-in" type="text" inputmode="numeric" autocomplete="off" value="${escAttr(line.qty)}" placeholder="0"></div>
  <div class="rb-f rb-out"><span class="rb-lab">Weight</span><output data-out for="${id}-size ${id}-a ${id}-b ${id}-qty" class="rb-val">${weight}</output></div>
  <button type="button" class="rb-del" data-del aria-label="Remove line ${n + 1}"${removable ? '' : ' hidden'}><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button>
  <p class="rb-info" data-info>${infoText(mode, line)}</p>
</div>`;
}

// New lines start empty so nobody copies an example by mistake.
export const DEFAULT_LINE = { imperial: { size: '5', a: '', b: '', qty: '' }, metric: { size: 'M16', a: '', b: '', qty: '' } };
