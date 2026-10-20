import assert from 'node:assert/strict';
import { test } from 'node:test';
import { IMPERIAL_BARS, METRIC_BARS, ISO_BARS, parseNum, barLength, lineResult, totals, kgPerM, lbPerFt, splitLength, LB_PER_KG, findBar } from '../src/lib/rebar.js';
import { takeoffModel, takeoffText, takeoffHtml } from '../src/lib/takeoff.js';

const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

// Snapshot of ASTM A615 Table 1 (checked 2026-10-20 against Wikipedia's Rebar table and Caltrans Bridge Design Details, Sept 2025).
test('ASTM A615 lb/ft table snapshot', () => {
  const want = { 3: 0.376, 4: 0.668, 5: 1.043, 6: 1.502, 7: 2.044, 8: 2.67, 9: 3.4, 10: 4.303, 11: 5.313, 14: 7.65, 18: 13.6 };
  assert.equal(IMPERIAL_BARS.length, 11);
  for (const b of IMPERIAL_BARS) assert.equal(b.w, want[b.id], b.label);
});

test('imperial weight is close to diameter formula (steel 0.2836 lb/in3)', () => {
  for (const b of IMPERIAL_BARS) {
    const calc = ((Math.PI * b.dia * b.dia) / 4) * 12 * 0.2836;
    close(calc, b.w, b.w * 0.005); // within 0.5 percent
  }
});

test('metric table matches ASTM A615M kg/m and the US bar it equals', () => {
  const want = { M10: 0.56, M13: 0.994, M16: 1.552, M19: 2.235, M22: 3.042, M25: 3.973, M29: 5.06, M32: 6.404, M36: 7.907, M43: 11.38, M57: 20.24 };
  assert.equal(METRIC_BARS.length, 11);
  for (const b of METRIC_BARS) {
    assert.equal(b.w, want[b.id], b.id);
    const us = findBar('imperial', b.us);
    close(b.w, kgPerM(us), 0.005 * b.w + 0.002);
  }
});

test('ISO round bar: 12 mm is 0.888 kg/m, 16 mm is 1.579 kg/m, 25 mm is 3.853 kg/m', () => {
  const w = (d) => findBar('metric', 'D' + d).w;
  close(w(12), 0.888, 0.001); close(w(16), 1.579, 0.002); close(w(25), 3.853, 0.002);
  assert.equal(ISO_BARS.length, 11);
});

test('parseNum', () => {
  assert.equal(parseNum('12'), 12);
  assert.equal(parseNum(''), 0);
  assert.equal(parseNum('1,200'), 1200);
  assert.equal(parseNum('3 1/2'), 3.5);
  assert.equal(parseNum('1/4'), 0.25);
  assert.equal(parseNum('.5'), 0.5);
  assert.ok(Number.isNaN(parseNum('abc')));
  assert.ok(Number.isNaN(parseNum('1/0')));
  assert.ok(Number.isNaN(parseNum('-3')));
});

test('barLength feet and inches', () => {
  assert.equal(barLength('imperial', 20, 0), 20);
  close(barLength('imperial', 10, 6), 10.5, 1e-9);
  assert.equal(barLength('metric', 12, ''), 12);
  assert.ok(Number.isNaN(barLength('imperial', -1, 0)));
});

test('worked example: 100 pieces of #5, 20 ft = 2,086 lb', () => {
  const r = lineResult('imperial', { size: '5', a: 20, b: 0, qty: 100 });
  close(r.lb, 2086, 0.001);
  close(r.kg, 946.2, 0.1);
  assert.equal(r.totalLength, 2000);
});

test('#4 at 10 ft 6 in x 25', () => {
  const r = lineResult('imperial', { size: '4', a: '10', b: '6', qty: '25' });
  close(r.lb, 0.668 * 10.5 * 25, 1e-6);
});

test('metric line: 50 x 12 m of #16M = 931.2 kg', () => {
  const r = lineResult('metric', { size: 'M16', a: 12, b: 0, qty: 50 });
  close(r.kg, 931.2, 0.001);
  close(r.lb, 931.2 * LB_PER_KG, 0.01);
});

test('totals with waste and units', () => {
  const lines = [
    { size: '5', a: 20, b: 0, qty: 100 },
    { size: '8', a: 30, b: 0, qty: 10 },
  ];
  const t = totals('imperial', lines, 0);
  close(t.lb, 2086 + 801, 0.001);
  close(t.shortTons, 2887 / 2000, 1e-6);
  close(t.kg, 2887 / LB_PER_KG, 0.001);
  close(t.lengthFt, 2300, 1e-9);
  const w = totals('imperial', lines, 5);
  close(w.lb, 2887 * 1.05, 0.001);
  close(w.netLb, 2887, 0.001);
});

test('invalid lines are counted and skipped', () => {
  const t = totals('imperial', [{ size: '5', a: 'x', b: 0, qty: 3 }, { size: '4', a: 10, b: 0, qty: 1 }], 0);
  assert.equal(t.invalid, 1);
  close(t.lb, 6.68, 1e-6);
  assert.equal(lineResult('imperial', { size: '4', a: 10, b: 0, qty: 1.5 }).ok, false);
});

test('kgPerM and lbPerFt conversions', () => {
  close(kgPerM(findBar('imperial', '8')), 3.973, 0.01);
  close(lbPerFt(findBar('metric', 'M25')), 2.67, 0.01);
});

test('waste is read the same way everywhere (comma, fraction, percent sign, spaces)', () => {
  const lines = [{ size: '5', a: 20, b: 0, qty: 100 }];
  close(totals('imperial', lines, '1/2').lb, 2086 * 1.005, 0.001);
  close(totals('imperial', lines, ' 5').lb, 2086 * 1.05, 0.001);
  close(totals('imperial', lines, '1,000').lb, 2086 * 11, 0.01); // thousands comma
  assert.equal(totals('imperial', lines, '1,5').lb, 2086); // invalid, so no waste (the UI warns)
  assert.equal(totals('imperial', lines, '5%').lb, 2086);
  assert.equal(totals('imperial', lines, '1e1').lb, 2086);
  assert.equal(totals('imperial', lines, '-3').lb, 2086);
});

test('a decimal comma is not read as a thousands separator', () => {
  assert.ok(Number.isNaN(parseNum('12,5')));
  assert.ok(Number.isNaN(parseNum('1,2')));
  assert.equal(parseNum('1,200.5'), 1200.5);
  assert.equal(lineResult('imperial', { size: '5', a: '12,5', b: 0, qty: 1 }).ok, false);
});

test('huge input is invalid, not a silent zero', () => {
  const big = '9'.repeat(400);
  assert.equal(lineResult('imperial', { size: '5', a: big, b: 0, qty: 1 }).ok, false);
  assert.equal(lineResult('imperial', { size: '5', a: 20, b: 0, qty: big }).ok, false);
  assert.equal(totals('imperial', [{ size: '5', a: big, b: 0, qty: 1 }], 0).invalid, 1);
});

test('feet and inch marks: 20\', 20\'-6", 12\'6"', () => {
  close(barLength('imperial', "20'", ''), 20, 1e-9);
  close(barLength('imperial', "20'-6\"", ''), 20.5, 1e-9);
  close(barLength('imperial', "12'6\"", ''), 12.5, 1e-9);
  close(barLength('imperial', "10'", '6\"'), 10.5, 1e-9);
  close(barLength('imperial', '10 ft', '6 in'), 10.5, 1e-9);
  assert.ok(Number.isNaN(barLength('imperial', "x'", '')));
  assert.deepEqual(splitLength('metric', '12', ''), { major: 12, minor: 0 });
});

test('bar count only includes lines that count', () => {
  const t = totals('imperial', [{ size: '5', a: 'x', b: 0, qty: 7 }, { size: '4', a: 10, b: 0, qty: 3 }], 0);
  assert.equal(t.count, 3);
});

test('takeoff text and print use the same rows and the same waste line', () => {
  const lines = [{ size: '5', a: 20, b: 0, qty: 100 }, { size: '4', a: 'x', b: 0, qty: 2 }];
  const m = takeoffModel('imperial', lines, '5');
  assert.equal(m.rows.length, 1);
  assert.equal(m.left, 1);
  close(m.total, 2086 * 1.05, 0.001);
  const text = takeoffText(m);
  assert.match(text, /#5\t20'-0"\t100\t2000.00\t2086.00/);
  assert.match(text, /Waste 5%\t\t\t\t104.30/);
  assert.match(text, /Total weight\t\t\t\t2190.30/);
  assert.match(text, /1 line left out/);
  const html = takeoffHtml(m, '10/20/2026');
  assert.match(html, /Waste 5%/);
  assert.match(html, /2,190.30 lb/);
  assert.match(html, /1 line left out/);
});

test('takeoff with bad waste adds no waste row', () => {
  const m = takeoffModel('imperial', [{ size: '5', a: 20, b: 0, qty: 100 }], '1,5');
  assert.equal(m.wastePct, 0);
  assert.doesNotMatch(takeoffText(m), /Waste/);
});
