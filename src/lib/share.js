// Save and load a takeoff in the page address (the part after #), so it can be texted to a supplier.
import { findBar, parseNum } from './rebar.js';

const MAX_LINES = 200;

export function encodeShare(state) {
  const lines = state.lines.map((l) => [l.size, l.a, l.b, l.qty]);
  return 't=' + encodeURIComponent(JSON.stringify({ m: state.mode === 'metric' ? 'm' : 'i', w: state.waste, p: state.price, u: state.priceUnit, l: lines }));
}

// Returns { mode, lines, waste, price, priceUnit } or null when the text is not a valid takeoff.
export function decodeShare(hash) {
  try {
    const m = String(hash || '').replace(/^#/, '').match(/(?:^|&)t=([^&]*)/);
    if (!m) return null;
    const d = JSON.parse(decodeURIComponent(m[1]));
    const mode = d.m === 'm' ? 'metric' : d.m === 'i' ? 'imperial' : null;
    if (!mode || !Array.isArray(d.l) || !d.l.length || d.l.length > MAX_LINES) return null;
    const lines = [];
    for (const l of d.l) {
      if (!Array.isArray(l) || !findBar(mode, String(l[0]))) return null;
      lines.push({ size: String(l[0]), a: String(l[1] ?? '').slice(0, 24), b: String(l[2] ?? '').slice(0, 24), qty: String(l[3] ?? '').slice(0, 24) });
    }
    const units = mode === 'imperial' ? ['lb', 'ton'] : ['kg', 'tonne'];
    const waste = String(d.w ?? '0').slice(0, 12);
    const price = String(d.p ?? '').slice(0, 12);
    return {
      mode,
      lines,
      waste: Number.isNaN(parseNum(waste)) ? '0' : waste,
      price: Number.isNaN(parseNum(price)) ? '' : price,
      priceUnit: units.includes(d.u) ? d.u : units[0],
    };
  } catch {
    return null;
  }
}
