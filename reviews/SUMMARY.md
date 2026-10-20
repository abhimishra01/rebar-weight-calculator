# Fix summary: rebar-weight-calculator (Kamala, 2026-10-20)

## Fixed
- Must: waste parsed two ways. `totals()` now uses `parseNum`, so total, note, copy and print agree. Tests for `1/2`, ` 5`, `1,000`, `1,5`, `5%`, `1e1`, `-3`.
- Must (customers): lines start empty (no starter job). Sticky total bar on phones when the totals box is off screen. Length accepts `20'`, `20'-6"`, `12'6"`, `10 ft 6 in`; both fields are marked invalid on a bad length.
- Decimal comma (`12,5`) was read as 125. Now invalid ("Check entry"); only thousands groups (`1,200`) pass. Test added.
- Huge input (400 digits) showed "0 lb". Now invalid. Test added.
- Ctrl+P printed a blank page. The print sheet is now built on `beforeprint` and cleared on `afterprint`; the Print button calls `window.print()`.
- Copy and print built the same rows twice. Now one model in `src/lib/takeoff.js` with tests. Both outputs add "N lines left out" and "Total in kg/lb" label. Bar count counts only valid lines.
- localStorage restore validates into fresh objects, then applies (no half-loaded state, null lines skipped).
- Metric labels `#10 (10M)` clashed with US sizes. Now `M10 (US #3)` ... `M57 (US #18)`; Article, FAQ and test pairing use the new `us` field.
- 200-line cap: Add button disables with a note.
- Dead code removed: `perLength` (replaced by `kgPerM`/`lbPerFt` helpers used in Article), BARS re-export, unused imports, `main-cap` write, `.tbl caption` rule, `no-print` class, ISO_DIAMETERS export. Article uses `fmt`. Metric table is one loop. `esc` renamed `escAttr` and escapes all five characters.
- Test titles fixed (16 mm = 1.579); ISO count asserted exactly; table test marked as a snapshot with its source.
- Text: privacy local-storage text consistent; no claim of a consent banner (consent via Google's consent message when ads are on; analytics and ads off today); Article no longer mentions a per-size subtotal; About filler sentence cut; Terms no longer says the code belongs to the tool name; home intro rewritten.
- Design/SEO: visible source line under the US chart ("ASTM A615/A615M, Table 1 (nominal weights). Checked 2026-10-20."), empty lines show "0.00 lb", FAQ rows have a full-height tap target, duplicate legal link row removed from home (footer keeps them), swipe hint on phone charts, `meta keywords` and one-item BreadcrumbList removed.
- Template items: README rewritten; US spelling; fixed "Last updated" (October 20, 2026); no cross-project paths; `scripts/new-tool.sh` removed; `screenshots/`, `.playwright-cli/`, `dist-*`, `tmp-*` ignored and untracked; deploy runs `npm test` first; Tailwind scans only `src` (`source(none)` + `@source "../"`).
- GitHub Pages: `PAGES_BASE` and `PAGES_SITE` in astro config; all links, icons, manifest (now a route) and sitemap link use `src/lib/url.ts`; canonical always on rebarweightcalculator.com; `.github/workflows/pages.yml` (checkout@v4, setup-node@v4 node 22, npm ci, npm test, build with base, upload-pages-artifact@v3, deploy-pages@v4). Verified with `PAGES_BASE=/rebar-weight-calculator/` build served under that path: home, about, privacy, icons, manifest all 200; canonical on the real domain; dist-pages deleted. Branch is `main`; not pushed.

## Rejected (with reason)
- Rename `a`/`b`/`w` fields (readability 2, 3): churn across tests, storage and UI; the shape is now documented in comments. Do later if the code grows.
- Job name and notes on printout, subtotal by size, duplicate line, share link, CSV, slab mode, truck-load check, stirrup helper, lap helper (customers should/nice): each turns a single-purpose tool into a bigger app.
- Warn when switching US and metric (Linda): lines for each mode are kept and return on switch; no change.
- Chart kg/m differs 0.03% between charts (regression nice): both are correct roundings of the source values; no order impact.
- Mode flicker on reload, `owner` config rename, H1 from config, `unit1` renames: low value.
- Grade note (A615 vs A706): not verified against a source in this pass; left for the owner.

## Status
- `npm test`: 19 of 19 pass (was 12). `npm run build`: OK, 6 pages.
- CSS: 121 KB (stale dist built with Tailwind scanning scratch folders) before, 25.3 KB after; JS 10.1 KB to 11.7 KB.
- Screenshots at 1280 and 390, light and dark, checked in `screenshots/` (ignored by git). Sticky bar and chart swipe hint checked at 390.
- Lighthouse not re-run in this pass (reviewer scores were 100 across the board before; changes are small and add no weight).

## Left for the owner
- Buy the domain; replace `ads.txt` stub when AdSense goes on; real `hello@` mailbox.
- Decide on the A706 grade note.
- Source check used secondary sources (ASTM text is paywalled); the visible line says "Checked 2026-10-20".

## Phase 2 SEO pages (best 20 candidates, not built)
1. #3 rebar weight per foot
2. #4 rebar weight per foot
3. #5 rebar weight per foot
4. #6 rebar weight per foot
5. #7 rebar weight per foot
6. #8 rebar weight per foot
7. #9 rebar weight per foot
8. #10 rebar weight per foot
9. #11 rebar weight per foot
10. 10 mm rebar weight per meter
11. 12 mm rebar weight per meter
12. 16 mm rebar weight per meter
13. 20 mm rebar weight per meter
14. 25 mm rebar weight per meter
15. Rebar weight chart (printable PDF)
16. How many pieces of rebar in a ton
17. Rebar weight per 20 ft bar
18. Rebar weight per ton in feet
19. Rebar weight kg to lb
20. Rebar weight for a slab (waste and laps guide)
