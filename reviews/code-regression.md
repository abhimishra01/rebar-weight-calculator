# Code review: regression lens (Sherlock), rebar-weight-calculator

**Verdict: PASS with fixes. 0 must-fix, 3 should-fix, 5 nice.** All 11 US weights, the metric weights and the 6% tolerance check out. Two input-parsing bugs can show a wrong total or a wrong note without any warning.

## ASTM table verification (web sources)

All numbers in `src/lib/rebar.js` match the sources below. The ASTM text itself is paywalled (ANSI and ASTM stores return only the cover and scope), so the check uses secondary sources that reproduce Table 1.

| Item | Site value | Source value | Result |
|---|---|---|---|
| #3 to #18 lb/ft | 0.376, 0.668, 1.043, 1.502, 2.044, 2.670, 3.400, 4.303, 5.313, 7.650, 13.60 | Same, all 11 rows (Wikipedia "Rebar" US bar size table, which reproduces ASTM A615 Table 1; https://en.wikipedia.org/wiki/Rebar) | Match |
| #14 and #18 | 7.650 / 1.693 in / 2.25 in2; 13.600 / 2.257 in / 4.00 in2 | Caltrans Bridge Design Details, Sept 2025, ASTM bar table (https://dot.ca.gov/-/media/dot-media/programs/engineering/documents/bridgedesigndetails/chapter-12/202509bdd131reinforcement-a11y.pdf, via search excerpt) | Match |
| Diameters and areas, imperial | all 11 rows | Wikipedia table (0.375 to 2.257 in, 0.11 to 4.00 in2) | Match |
| Metric kg/m, sizes 10 to 36 | 0.560, 0.994, 1.552, 2.235, 3.042, 3.973, 5.060, 6.404, 7.907 | ASTM A615/A615M-08b Table 1 excerpt (https://webstore.ansi.org/standards/astm/astma615a615m08b, via search) and Wikipedia | Match |
| Metric kg/m, sizes 43 and 57 | 11.38, 20.24 | Wikipedia 11.384, 20.239 (same bars, rounded) | Match |
| Metric diameters and areas (9.5 to 57.3 mm, 71 to 2,581 mm2) | as listed | Wikipedia (9.53 vs 9.5 and 200 vs 199 mm2 for No.16 are rounding differences; ASTM A615M uses 9.5 and 199) | Match |
| Tolerance: bar may weigh up to 6% under nominal, overweight not a cause for rejection | faq.ts:10, Article.astro:72 | A615/A615M-96a quoted on Eng-Tips (https://eng-tips.com/threads/rebar-weight-related.224104): "variation from nominal weight shall not be more than 6%... overweight shall not be a cause for rejection". Also a CRSI presentation and forum posts: no less than 94% of nominal (A615, A706, A996, A955) | Consistent. Current edition text not read (paywalled). Wording is safe. |

## Hand-recomputed results (node, then confirmed in the built page in a browser)

All 13 checks agree to 4 decimals: #3 x 10 ft = 3.76 lb; #18 x 40 ft x 3 = 1,632 lb; #6 at 7 ft 3 in x 12 = 130.674 lb; #4 at 0 ft 6 in = 0.334 lb; #4 at 5 ft 14 in = 4.1193 lb (inches over 11 are accepted); M25 12 m x 10 = 476.76 kg; D40 = 9.8646 kg/m; two lines plus 7.5% waste = 3,103.525 lb; 50 x 12 m of #16 = 0.9312 t = 2,052.94 lb = 1,968.5 ft. Worked example in Article and FAQ (2,086 lb, 1.043 short tons, 946 kg, 2,190 lb with 5% waste, 150 and 266 and 96 and 67 and 49 pieces per ton, 12 mm = 0.888 kg/m, 0.04172 shortcut) all hold. Browser run: add line, mode switch, reload restore, Clear and the 2.5-quantity warning all behave. 12 unit tests pass.

Template rules (checked on a fresh build, folder deleted afterward): canonical on all pages, pages.dev noindex in `_headers`, 404 has noindex, legal pages linked, sitemap lists 5 pages, `ads.txt` is a comment when AdSense is empty, no GA or AdSense script when empty. All hold.

## Findings

| Sev | file:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | rebar.js:92 and Tool.astro:137, 186 | Waste is read two ways. `totals()` uses `+wastePct`, the note and the copy use `parseNum`. Verified in the browser: waste `1/2` shows "Includes 0.5% extra" but the total is unchanged; `1,5` shows "Includes 15% extra" while the total adds 0%. `1e1` does the reverse: total adds 10% and the note says "must be a number". Copy takeoff then prints a "Waste 15%" row with a 0.00 weight. | The page states one number and shows another. A user can order on the wrong total. | In `totals()` call `parseNum(wastePct)` and treat NaN or negative as 0. One parser everywhere. Add a test: `totals(..., '1/2')`. |
| should | rebar.js:59 | `parseNum` deletes every comma. `12,5` becomes 125 and `1,2` becomes 12. Verified: length `12,5` gives 12,500 ft and 13,037.50 lb with no warning. Metric users (the toggle exists for them) often type a decimal comma. | A silent tenfold error. | Allow commas only as thousands groups (`/^\d{1,3}(,\d{3})+(\.\d+)?$/`). Any other comma returns NaN, so the row shows "Check entry". Add tests for `12,5` and `1,200`. |
| should | rebar.js:24-34, Article.astro:41-55, faq.ts:7 | Metric bars are labeled `#10 (10M)`, `#13 (13M)` ... `#57 (57M)`. `10M` is the Canadian CSA name. ASTM A615M says "No. 10". In the same site, `#10`, `#11`, `#14`, `#18` are also US sizes with very different weights (US #10 is 4.303 lb/ft, metric #10 is 0.56 kg/m). | Real chance of a wrong pick or a wrong search match for the "#4 rebar weight" keywords. | Label as `No. 13 metric (12.7 mm, = US #4)`, or show the US match first. Keep the FAQ sentence as is. |
| nice | rebar.js:33-34 vs Article.astro:34 | The imperial chart shows #14 as 11.384 kg/m and #18 as 20.239, derived from lb/ft. The metric chart on the same page shows 11.380 and 20.240 (ASTM A615M values). Metric-mode lb/ft for #43 gives 7.647 against 7.650. | Two numbers for one bar, 0.03% apart. No effect on orders, but it looks careless in a "chart" page. | Round the derived kg/m to 2 decimals in the imperial chart, or note "rounded". |
| nice | Tool.astro:135 | "Bars" count adds the quantity of every line that has a whole-number quantity, even if the length is invalid and the weight is left out. | Count and weight disagree for that line. | Count only lines where `lineResult(...).ok`. |
| nice | Tool.astro:191, 219 | Copy and print skip invalid lines silently. The on-screen note about left-out lines is not in the copied or printed text. | A pasted takeoff can look complete when it is not. | Add a line "N lines left out (check entry)" to both outputs when `t.invalid > 0`. |
| nice | test/rebar.test.mjs:7-11, 28 | The A615 table test compares the constants to a copy of the same constants. The 16 mm test title says 1.578, the assertion says 1.579. Only the diameter-formula test is an independent check. | Gives false comfort; a typo in both places would pass. | Rename to "table snapshot", fix the title. Optional: keep the Wikipedia/Caltrans values as a cited comment. |
| nice | Tool.astro:70-90, 232 | Saved metric mode is applied only after the script runs, but the server draws imperial. Reload shows imperial for a moment. Not observed in a browser run (mode was imperial); this is from reading the code. Also the Add button stays active at 200 lines and does nothing. | Small flicker and a silent limit. | Optional: disable Add and show "200 lines is the limit". |

## Known template leftovers (not reviewed here)
Template README, `scripts/new-tool.sh`, screenshots tracked in git, duplicate legal links block on the home page, build-date "Last updated", British spelling: already on the fixer's list.
