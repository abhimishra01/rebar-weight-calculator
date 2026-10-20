// Core rebar math. Plain JavaScript so Node tests and the browser use the same code.
// Source: ASTM A615/A615M nominal weights (lb/ft and kg/m). Bar numbers are in eighths of an inch.

export const LB_PER_KG = 2.20462262185;
export const FT_PER_M = 3.280839895;

// US customary bars: [bar number, nominal diameter in, area in2, weight lb/ft]
export const IMPERIAL_BARS = [
  { id: '3', label: '#3', dia: 0.375, area: 0.11, w: 0.376 },
  { id: '4', label: '#4', dia: 0.5, area: 0.2, w: 0.668 },
  { id: '5', label: '#5', dia: 0.625, area: 0.31, w: 1.043 },
  { id: '6', label: '#6', dia: 0.75, area: 0.44, w: 1.502 },
  { id: '7', label: '#7', dia: 0.875, area: 0.6, w: 2.044 },
  { id: '8', label: '#8', dia: 1.0, area: 0.79, w: 2.67 },
  { id: '9', label: '#9', dia: 1.128, area: 1.0, w: 3.4 },
  { id: '10', label: '#10', dia: 1.27, area: 1.27, w: 4.303 },
  { id: '11', label: '#11', dia: 1.41, area: 1.56, w: 5.313 },
  { id: '14', label: '#14', dia: 1.693, area: 2.25, w: 7.65 },
  { id: '18', label: '#18', dia: 2.257, area: 4.0, w: 13.6 },
];

// Soft-metric designations of the same bars: nominal diameter mm, area mm2, weight kg/m
export const METRIC_BARS = [
  { id: 'M10', label: '#10 (10M)', dia: 9.5, area: 71, w: 0.56 },
  { id: 'M13', label: '#13 (13M)', dia: 12.7, area: 129, w: 0.994 },
  { id: 'M16', label: '#16 (16M)', dia: 15.9, area: 199, w: 1.552 },
  { id: 'M19', label: '#19 (19M)', dia: 19.1, area: 284, w: 2.235 },
  { id: 'M22', label: '#22 (22M)', dia: 22.2, area: 387, w: 3.042 },
  { id: 'M25', label: '#25 (25M)', dia: 25.4, area: 510, w: 3.973 },
  { id: 'M29', label: '#29 (29M)', dia: 28.7, area: 645, w: 5.06 },
  { id: 'M32', label: '#32 (32M)', dia: 32.3, area: 819, w: 6.404 },
  { id: 'M36', label: '#36 (36M)', dia: 35.8, area: 1006, w: 7.907 },
  { id: 'M43', label: '#43 (43M)', dia: 43.0, area: 1452, w: 11.38 },
  { id: 'M57', label: '#57 (57M)', dia: 57.3, area: 2581, w: 20.24 },
];

// Plain round diameters used in many countries: kg/m = d^2 x pi/4 x 7850 kg/m3 (about d^2 / 162.2)
export const ISO_DIAMETERS = [6, 8, 10, 12, 14, 16, 20, 25, 28, 32, 40];
export const ISO_BARS = ISO_DIAMETERS.map((d) => ({
  id: 'D' + d,
  label: d + ' mm',
  dia: d,
  area: Math.round(((d * d * Math.PI) / 4) * 10) / 10,
  w: ((d * d * Math.PI) / 4) * 7850 * 1e-6, // kg/m
}));

export const BARS = {
  imperial: IMPERIAL_BARS,
  metric: [...METRIC_BARS, ...ISO_BARS],
};

export function findBar(mode, id) {
  return BARS[mode].find((b) => b.id === id) || null;
}

// Read a number from user text. Accepts "12", "12.5", "1/2" and "3 1/2". Returns NaN if not valid.
export function parseNum(text) {
  if (typeof text === 'number') return text;
  const s = String(text ?? '').trim().replace(/,/g, '');
  if (s === '') return 0;
  let m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (m) return +m[1] + +m[2] / +m[3];
  m = s.match(/^(\d+)\/(\d+)$/);
  if (m) return +m[2] === 0 ? NaN : +m[1] / +m[2];
  return /^\d*\.?\d+$|^\d+\.$/.test(s) ? parseFloat(s) : NaN;
}

// Length of one bar in the base unit: feet (imperial) or meters (metric).
export function barLength(mode, a, b) {
  const x = parseNum(a), y = parseNum(b);
  if (Number.isNaN(x) || Number.isNaN(y) || x < 0 || y < 0) return NaN;
  return mode === 'imperial' ? x + y / 12 : x;
}

// One line: { size, a, b, qty }. Imperial a = feet, b = inches. Metric a = meters.
// Returns { ok, length (per bar, ft or m), totalLength, lb, kg }
export function lineResult(mode, line) {
  const bar = findBar(mode, line.size);
  const len = barLength(mode, line.a, line.b);
  const qty = parseNum(line.qty);
  if (!bar || Number.isNaN(len) || Number.isNaN(qty) || qty < 0 || !Number.isInteger(qty)) {
    return { ok: false, lb: 0, kg: 0, totalLength: 0, empty: false };
  }
  const totalLength = len * qty;
  const kg = mode === 'imperial' ? (bar.w * totalLength) / LB_PER_KG : bar.w * totalLength;
  const lb = kg * LB_PER_KG;
  return { ok: true, length: len, totalLength, lb, kg, empty: totalLength === 0 };
}

// Sum all lines. waste is a percent added on top (for laps, cut-offs, scrap).
export function totals(mode, lines, wastePct = 0) {
  const w = Number.isFinite(+wastePct) && +wastePct > 0 ? +wastePct : 0;
  let net = 0, len = 0, bad = 0;
  for (const l of lines) {
    const r = lineResult(mode, l);
    if (!r.ok) { bad++; continue; }
    net += r.kg;
    len += r.totalLength;
  }
  const kg = net * (1 + w / 100);
  const lb = kg * LB_PER_KG;
  return {
    kg,
    lb,
    shortTons: lb / 2000,
    metricTonnes: kg / 1000,
    netLb: net * LB_PER_KG,
    netKg: net,
    lengthFt: mode === 'imperial' ? len : len * FT_PER_M,
    lengthM: mode === 'imperial' ? len / FT_PER_M : len,
    invalid: bad,
  };
}

// Weight per unit length of one bar, in both unit systems.
export function perLength(mode, id) {
  const bar = findBar(mode, id);
  if (!bar) return null;
  return mode === 'imperial'
    ? { lbPerFt: bar.w, kgPerM: (bar.w / LB_PER_KG) * FT_PER_M }
    : { kgPerM: bar.w, lbPerFt: (bar.w * LB_PER_KG) / FT_PER_M };
}

export function fmt(n, digits = 2) {
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
