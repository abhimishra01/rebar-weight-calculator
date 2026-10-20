import assert from 'node:assert/strict';
import { test } from 'node:test';
import { IMPERIAL_BARS, METRIC_BARS, ISO_BARS, parseNum, barLength, lineResult, totals, perLength, LB_PER_KG, findBar } from '../src/lib/rebar.js';

const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

test('ASTM A615 lb/ft table', () => {
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

test('metric table matches ASTM A615M kg/m and the imperial bars', () => {
  const want = [0.56, 0.994, 1.552, 2.235, 3.042, 3.973, 5.06, 6.404, 7.907, 11.38, 20.24];
  METRIC_BARS.forEach((b, i) => {
    assert.equal(b.w, want[i]);
    close(b.w, (IMPERIAL_BARS[i].w / LB_PER_KG) * 3.280839895, 0.005 * b.w + 0.002);
  });
});

test('ISO round bar: 12 mm is 0.888 kg/m, 16 mm is 1.578 kg/m, 25 mm is 3.853 kg/m', () => {
  const w = (d) => findBar('metric', 'D' + d).w;
  close(w(12), 0.888, 0.001); close(w(16), 1.579, 0.002); close(w(25), 3.853, 0.002);
  assert.ok(ISO_BARS.length >= 8);
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

test('perLength conversions', () => {
  close(perLength('imperial', '8').kgPerM, 3.973, 0.01);
  close(perLength('metric', 'M25').lbPerFt, 2.67, 0.01);
});
