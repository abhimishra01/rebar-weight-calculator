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
  assert.equal(totals('imperial', lines, '1,000').lb, 2086); // thousands comma is read, but over 100% is refused
  assert.equal(totals('imperial', lines, '101').lb, 2086);
  close(totals('imperial', lines, '100').lb, 2086 * 2, 0.01);
  close(totals('imperial', lines, '1,5').lb, 2086 * 1.015, 0.001); // decimal comma
  assert.equal(totals('imperial', lines, '1,5,5').lb, 2086); // invalid, so no waste (the UI warns)
  assert.equal(totals('imperial', lines, '5%').lb, 2086);
  assert.equal(totals('imperial', lines, '1e1').lb, 2086);
  assert.equal(totals('imperial', lines, '-3').lb, 2086);
});

test('a decimal comma is read as a decimal point, a three-digit group as thousands', () => {
  assert.equal(parseNum('12,5'), 12.5);
  assert.equal(parseNum('1,2'), 1.2);
  assert.equal(parseNum('0,375'), 0.375);
  assert.equal(parseNum('1,200.5'), 1200.5);
  assert.equal(parseNum('1,200'), 1200);
  assert.ok(Number.isNaN(parseNum('1,2,3')));
  assert.ok(Number.isNaN(parseNum('1,5.5')));
  close(lineResult('imperial', { size: '5', a: '20,5', b: 0, qty: 1 }).lb, 20.5 * 1.043, 0.001);
});

test('inches of 12 or more are shown as feet and inches', () => {
  assert.deepEqual(splitLength('imperial', '20', '13'), { major: 21, minor: 1 });
  assert.deepEqual(splitLength('imperial', '20', '12'), { major: 21, minor: 0 });
  assert.deepEqual(splitLength('imperial', '20', '6'), { major: 20, minor: 6 });
  close(lineResult('imperial', { size: '5', a: '20', b: '13', qty: 1 }).lb, (20 + 13 / 12) * 1.043, 0.001);
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
  const m = takeoffModel('imperial', [{ size: '5', a: 20, b: 0, qty: 100 }], '1,5,5');
  assert.equal(m.wastePct, 0);
  assert.doesNotMatch(takeoffText(m), /Waste/);
});

// ---- gap fix: stock lengths, cost, share link, CSV, line help ----
import { barsToOrder, barsPerTon, materialCost } from '../src/lib/rebar.js';
import { encodeShare, decodeShare } from '../src/lib/share.js';
import { takeoffCsv } from '../src/lib/takeoff.js';
import { infoText } from '../src/lib/rows.js';

test('barsToOrder rounds up and ignores bad input', () => {
  assert.equal(barsToOrder(2000, 20), 100);
  assert.equal(barsToOrder(2000.1, 20), 101);
  assert.equal(barsToOrder(0, 20), 0);
  assert.equal(barsToOrder(100, 0), 0);
  assert.equal(barsToOrder(NaN, 20), 0);
});

test('bars per ton: #4 in 20 ft is about 150, 12 mm in 12 m is about 94', () => {
  close(barsPerTon('imperial', findBar('imperial', '4'), 20), 149.7, 0.1);
  close(barsPerTon('metric', findBar('metric', 'D12'), 12), 93.9, 0.1);
});

test('material cost by lb, short ton, kg and metric tonne', () => {
  close(materialCost('0.5', 'lb', 2000, 907.18), 1000, 0.01);
  close(materialCost('900', 'ton', 2000, 907.18), 900, 0.01);
  close(materialCost('1.2', 'kg', 2204.62, 1000), 1200, 0.01);
  close(materialCost('1,200', 'tonne', 2204.62, 1000), 1200, 0.01);
  assert.ok(Number.isNaN(materialCost('abc', 'lb', 1, 1)));
  assert.ok(Number.isNaN(materialCost('-1', 'lb', 1, 1)));
  assert.ok(Number.isNaN(materialCost('1', 'bogus', 1, 1)));
});

test('takeoff adds a cost row only for a valid price', () => {
  const lines = [{ size: '4', a: '20', b: '', qty: '100' }];
  const withPrice = takeoffModel('imperial', lines, '0', { text: '0.60', unit: 'lb' });
  close(withPrice.cost, 801.6, 0.01);
  assert.match(takeoffText(withPrice), /Material cost \(\$0\.60 per lb\)\t.*\t801\.60/);
  assert.match(takeoffHtml(withPrice, 'x'), /\$801\.60/);
  for (const bad of [{ text: '', unit: 'lb' }, { text: 'x', unit: 'lb' }, { text: '0', unit: 'lb' }, undefined]) {
    assert.equal(takeoffModel('imperial', lines, '0', bad).cost, null);
  }
  assert.doesNotMatch(takeoffText(takeoffModel('imperial', lines, '0')), /Material cost/);
});

test('price text can not inject HTML into the print sheet', () => {
  const m = takeoffModel('imperial', [{ size: '4', a: '20', b: '', qty: '1' }], '0', { text: '<img src=x>', unit: 'lb' });
  assert.equal(m.cost, null);
  assert.doesNotMatch(takeoffHtml(m, 'x'), /<img/);
});

test('CSV quotes every cell and doubles inch marks', () => {
  const m = takeoffModel('imperial', [{ size: '5', a: '12', b: '3', qty: '2' }], '5');
  const csv = takeoffCsv(m);
  assert.match(csv, /^"Bar","Length \(ft-in\)","Qty"/);
  assert.match(csv, /"#5","12'-3""","2"/);
  assert.match(csv, /"Waste 5%"/);
  assert.ok(csv.includes('\r\n'));
});

test('share link round trip', () => {
  const state = { mode: 'imperial', waste: '5', price: '0.6', priceUnit: 'ton', lines: [{ size: '5', a: "12'", b: '3', qty: '10' }, { size: '4', a: '20', b: '', qty: '1,200' }] };
  const back = decodeShare('#' + encodeShare(state));
  assert.deepEqual(back, state);
  const metric = { mode: 'metric', waste: '0', price: '', priceUnit: 'kg', lines: [{ size: 'D12', a: '6', b: '', qty: '4' }] };
  assert.deepEqual(decodeShare(encodeShare(metric)), metric);
});

test('share link rejects bad data and cleans odd fields', () => {
  for (const h of ['', '#', '#t=', '#t=%7B', '#t=' + encodeURIComponent('{"m":"i","l":[]}'), '#t=' + encodeURIComponent('{"m":"x","l":[["5","1","","1"]]}'), '#t=' + encodeURIComponent('{"m":"i","l":[["99","1","","1"]]}'), '#t=' + encodeURIComponent('{"m":"i","l":[1]}'), '#other=1']) {
    assert.equal(decodeShare(h), null, h);
  }
  const odd = decodeShare('#t=' + encodeURIComponent(JSON.stringify({ m: 'i', w: 'abc', p: 'zzz', u: 'kg', l: [['5', 'x'.repeat(100), null, 3]] })));
  assert.equal(odd.waste, '0');
  assert.equal(odd.price, '');
  assert.equal(odd.priceUnit, 'lb'); // kg is not an imperial unit
  assert.equal(odd.lines[0].a.length, 24);
  assert.equal(odd.lines[0].b, '');
  // too many lines
  assert.equal(decodeShare('#t=' + encodeURIComponent(JSON.stringify({ m: 'i', l: Array(201).fill(['5', '1', '', '1']) }))), null);
});

test('line help shows weight per foot and per bar', () => {
  assert.equal(infoText('imperial', { size: '5', a: '', b: '', qty: '' }), '#5 bar: 1.043 lb/ft (1.552 kg/m). One 20 ft bar: 20.86 lb.');
  assert.match(infoText('imperial', { size: '5', a: '12', b: '3', qty: '' }), /One 12 ft 3 in bar: 12\.78 lb\./);
  assert.match(infoText('imperial', { size: '4', a: 'abc', b: '', qty: '' }), /One 20 ft bar: 13\.36 lb\./);
  assert.match(infoText('metric', { size: 'D12', a: '', b: '', qty: '' }), /^12 mm bar: 0\.888 kg\/m \(0\.597 lb\/ft\)\. One 12 m bar: 10\.65 kg\.$/);
  assert.equal(infoText('imperial', { size: 'zz', a: '', b: '', qty: '' }), '');
});

test('sanity limits: huge lengths and counts are refused, empty length adds no bars', () => {
  assert.equal(lineResult('imperial', { size: '5', a: '999999999', b: '', qty: '999999999' }).ok, false);
  assert.equal(lineResult('imperial', { size: '5', a: '20', b: '', qty: '1000001' }).ok, false);
  assert.equal(lineResult('metric', { size: 'M16', a: '301', b: '', qty: '1' }).ok, false);
  assert.equal(totals('imperial', [{ size: '5', a: '', b: '', qty: '10' }], 0).count, 0);
});
