# Code review, lens: minimalism (Lisbeth)

Verdict: lean already (clean build gives 25 KB CSS, 10 KB JS, no unused `rb-*` or `tbl` CSS), with about 40 lines of dead or duplicated code and no behavior to lose. 0 must-fix, 4 should-fix, 6 nice.

Template leftovers (already on the fixer list, not repeated): template README, scripts/new-tool.sh, tracked screenshots, duplicate legal links on the home page, build-date "Last updated", British spelling.

| Sev | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/lib/rebar.js:115-122, test/rebar.test.mjs (last test) | `perLength` is used only by its own test. | Dead code plus a test that guards nothing on the site. | Delete it and the test. Or use it in Article.astro (next row) and keep it. |
| should | src/components/Article.astro:34,48,51 | The lb/ft to kg/m conversion `(b.w / LB_PER_KG) * FT_PER_M` is written out three times in the tables. | Same formula as `perLength`, so one is redundant. | Keep one helper (`kgPerM(b)` / `lbPerFt(b)`) in rebar.js and call it. Drop `perLength` and its test, or call `perLength`. |
| should | src/components/Article.astro:47-52 | The metric table repeats the same `<tr>` markup for `METRIC_BARS` and `ISO_BARS`. | Two copies of one row to keep in sync. | `[...METRIC_BARS, ...ISO_BARS].map(...)` (or `BARS.metric`). |
| should | src/components/Article.astro:3-4 | Local `n` and `n0` re-implement `fmt` from rebar.js (`toLocaleString('en-US', min/max digits)`). | Third place that formats numbers. | `import { fmt }`; use `fmt(v, 3)` and `fmt(v, 0)`. Delete the two helpers. |
| nice | src/components/Tool.astro:57 | `LB_PER_KG` is imported in the client script and never used. | Dead import. | Remove it. |
| nice | src/lib/rows.js:2,31 | Imports `BARS` only to re-export it; nothing imports `BARS` from rows.js. | Dead re-export. | Delete both. |
| nice | src/components/Tool.astro:125 | `$('main-cap').textContent = 'Total weight'` runs on every update, but the HTML already says the same. | Constant assignment in a hot path. | Delete the line (the `id="main-cap"` can go too). |
| nice | src/components/Tool.astro:114 | `blank ? '0' : r.ok ? '0' : 'Check entry'` is a three-way ternary where two branches give '0'. | Hard to read. | `out.textContent = r.ok && !r.empty ? ... : (r.ok || blank) ? '0' : 'Check entry'`. |
| nice | src/components/Tool.astro:80,167 | The limit `200` appears twice as a bare number. | Two places to change. | `const MAX_LINES = 200;` once. |
| nice | src/components/Tool.astro:184-204 vs 217-229 | `takeoff()` and the print handler each build the same rows, waste and totals lines separately. | About 25 duplicated lines. If a row or total changes, two places need the edit. | Build one `{head, rows, foot}` model, then render it as tab text and as HTML. Not urgent. |
| nice | src/styles/global.css:136 | `.tbl caption{...}` styles captions, but both captions use `sr-only`. | Dead rule. | Delete it. |
| nice | dist/_astro/Base.BqJFBPDW.css (stale) | The tracked-out `dist/` has a 121 KB CSS, but a clean build today gives 25 KB. Tailwind 4 scans every untracked folder (tmp-*, dist-*, reviews/) at build time and can pull in classes from them. | Not a source bug. A build run while scratch folders hold HTML/class names will bloat the shipped CSS. | Deploy only from a clean build. Optionally set `@import "tailwindcss" source(none); @source "../";` in global.css so only src/ is scanned. |

Not changed and fine: `lib/rebar.js` and `rows.js` are small and shared between server and browser (right call, avoids duplicate math); FAQ and Article text have no filler; three dependencies plus wrangler (template choice); no leftover template demo code found in Tool.astro, Article.astro, index.astro, about/contact.
