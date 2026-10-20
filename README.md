# Rebar Weight Calculator

Single-purpose web tool at rebarweightcalculator.com. It gives the weight of reinforcing bar from bar size, length and quantity. It handles many lines, US bars #3 to #18 (ASTM A615 nominal lb/ft), metric bars and plain round diameters, and shows totals in lb, kg, short tons and metric tons. It can copy a takeoff to a spreadsheet and print it.

## Where the logic lives
- `src/lib/rebar.js`: bar tables, number and length parsing, line and total math.
- `src/lib/takeoff.js`: the copy and print sheet (one data model, text and HTML output).
- `src/lib/rows.js`: HTML for one input line, shared by the server and the browser.
- `src/components/Tool.astro`: the calculator UI and its browser script.
- `src/components/Article.astro`, `src/data/faq.ts`: the text and charts under the tool.
- `src/site.config.ts`: name, domain, description, ad and analytics IDs.

## Commands
- `npm install`, then `npm run dev` (local server).
- `npm test`: unit tests for the math, parsing and takeoff (`test/rebar.test.mjs`).
- `npm run build`: static site in `dist/`.
- `npm run deploy`: runs tests, builds, deploys to Cloudflare Pages (needs `npx wrangler login` once, done by the owner).

## GitHub Pages
The same build also serves from `https://abhimishra01.github.io/rebar-weight-calculator/`. Set `PAGES_BASE=/rebar-weight-calculator/` and `PAGES_SITE=https://abhimishra01.github.io` when you build. `.github/workflows/pages.yml` does this on every push to `main`. Canonical links always point to the real domain.

## Data check
Weights were checked against ASTM A615 Table 1 on 2026-10-20 (see `reviews/SUMMARY.md`).
