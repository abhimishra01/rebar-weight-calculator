// HTML for one takeoff line. Used on the server (first paint, no layout shift) and in the browser.
import { BARS, IMPERIAL_BARS, METRIC_BARS, ISO_BARS } from './rebar.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

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

export function rowHtml(mode, line, n, removable) {
  const imp = mode === 'imperial';
  const id = `l${n}`;
  return `<div class="rb-row" data-row="${n}" role="group" aria-label="Line ${n + 1}">
  <div class="rb-f rb-size"><label for="${id}-size">Bar size</label><select id="${id}-size" data-k="size" class="rb-in">${sizeOptions(mode, line.size)}</select></div>
  <div class="rb-f rb-len"><label for="${id}-a">${imp ? 'Length, ft' : 'Length, m'}</label><input id="${id}-a" data-k="a" class="rb-in" type="text" inputmode="decimal" autocomplete="off" value="${esc(line.a)}" placeholder="0"></div>
  <div class="rb-f rb-inch"${imp ? '' : ' hidden'}><label for="${id}-b">Inches</label><input id="${id}-b" data-k="b" class="rb-in" type="text" inputmode="decimal" autocomplete="off" value="${esc(line.b)}" placeholder="0"></div>
  <div class="rb-f rb-qty"><label for="${id}-qty">Quantity</label><input id="${id}-qty" data-k="qty" class="rb-in" type="text" inputmode="numeric" autocomplete="off" value="${esc(line.qty)}" placeholder="0"></div>
  <div class="rb-f rb-out"><span class="rb-lab">Weight</span><output data-out for="${id}-size ${id}-a ${id}-b ${id}-qty" class="rb-val">0</output></div>
  <button type="button" class="rb-del" data-del aria-label="Remove line ${n + 1}"${removable ? '' : ' hidden'}><svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button>
</div>`;
}

export const DEFAULT_LINE = { imperial: { size: '5', a: '20', b: '0', qty: '100' }, metric: { size: 'M16', a: '6', b: '0', qty: '100' } };
export { BARS };
