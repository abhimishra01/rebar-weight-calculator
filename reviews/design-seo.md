# Design and SEO review: rebar-weight-calculator (Miranda, 2026-10-20)

Reviewed the live build at 1280 and 390 px, light and dark, with the page in use (add lines, metric toggle, clear, bad input).

## Scores (Lighthouse 13, headless Chrome, local static build)
| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Mobile | 100 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Mobile LCP 1.0 s, CLS 0, TBT 0 ms. Page weight is about 300 KB for the whole site (25 KB CSS, 10 KB JS, 68 KB OG image). No horizontal page scroll at 390 px.

## Verdict
Clearly better than the competitors in the research (machinemfg, calculate.co.nz, Firgelli, mirrors). It has US bar sizes first, multi-line takeoff, lb/kg/tons at once, a metric toggle, both charts, dark mode and a clean phone layout. Logo, favicon (readable at 32 px) and OG image are on brand and consistent. Must-fix count: 0. Fixes below are polish.

## Findings
| Severity | Area | Finding | Fix |
|---|---|---|---|
| Medium | Phone UX | The totals box starts about 960 px down at 390 px. With 2 or 3 lines it moves further, so a user types in the lines and cannot see the total change. | Add a slim sticky bottom bar on small screens that shows the total lb and kg, hidden when the full totals box is in view. |
| Medium | Phone UX | FAQ questions: only the `summary` text is the tap target and it is 24 px high. The row padding (py-4) sits on `details`, so taps in the padding do nothing. | Move the padding to `summary` (py-4) so the target is about 56 px. |
| Low | Phone UX | The link row under the tool (About, Privacy, Terms, Contact) has 17 px high links, below the 44 px guideline. Footer links are 20 px high. | Add `py-3 inline-block` to those links, or drop the row under the tool and keep the footer links. |
| Medium | Trust and content | The page opens with a prefilled example (100 x #5 x 20 ft = 2,086 lb). A user can copy or print it by mistake and send it as a real takeoff. | Label the first line "Example" with a one-line hint, or select the first field on focus. Keep the example for first paint. |
| Low | Empty state | Cleared lines show a bare "0" in the line Weight, while filled lines show "2,086.00 lb". The unit is missing. | Show "0.00 lb" (or "0.00 kg") in the empty state. |
| Low | Error state | Bad input is handled (the note says "Waste must be a number such as 5." and the field is marked invalid). The line fields were not tested with letters beyond this. | No fix needed. Keep the same message pattern for line fields. |
| Medium | SEO and trust | No visible source for the weights. The text says ASTM A615 but gives no link or "last checked" date. For a US engineer audience this is the main trust signal. | Add one line under the chart: "Source: ASTM A615/A615M nominal weights, as published by CRSI. Checked October 2026" with a link to the source. Regression reviewer to confirm the source. |
| Low | SEO | `<meta name="keywords">` is present. Google ignores it and it shows the target list to competitors. | Remove it. |
| Low | SEO | BreadcrumbList has one item (the home page). It gives no benefit. | Remove it until there are more pages. |
| Low | SEO | JSON-LD parses (WebApplication, BreadcrumbList, FAQPage, all valid JSON). FAQPage answers match the visible FAQ. FAQ rich results are now rare for most sites, so do not count on them. | Keep. No action. |
| Low | SEO | Article text is about 1,600 words with 11 headings, a worked example, two charts and 8 FAQs. That is deeper than every competitor listed. Heading outline is clean: one H1, H2 sections only. No internal links to other pages from the article. | Optional: link "Print" and "Copy takeoff" paragraph to nothing, but add a link to About near the source line. Add cross-links when sister tools exist. |
| Low | SEO | Title "Rebar Weight Calculator: #3 to #18 in lb, kg, tons" is 52 characters and has the exact query first. Meta description is 150 characters. Canonical, OG, Twitter card, sitemap (5 URLs), robots.txt, theme-color and manifest are correct. | No action. |
| Low | SEO | The H1 area repeats the meta description as its intro. | Rewrite the intro to say something the title does not, for example "Add one line per bar size and length. Totals update as you type." |
| Low | Deploy | `_headers` noindex for pages.dev is in place. Sitemap lists the canonical domain, which is right for launch. `ads.txt` is a stub comment while AdSense is off. | Confirm `ads.txt` is replaced when AdSense goes on. |
| Low | Accessibility | Focus ring is a 2 px brand outline on links and segment control. Inputs get a ring on focus. Table regions are focusable with labels. Muted text (#5d5d66 on #f7f5f0) passes AA. Dark mode muted text passes. Lighthouse reports 100. | No action. |
| Low | Design | The desktop tool card uses a hard offset shadow and a rib-pattern top strip. It looks distinctive and on topic. The "lb" unit in orange next to the large total is low-contrast in the dark totals panel for small viewing. | Optional: raise the unit colour to the full brand tint or use the ink colour. |
| Low | Tables | Both charts scroll sideways on a phone (615 px and 589 px wide in a 356 px box) with a sticky first column. Good, but nothing shows that the table scrolls. | Add a small "Swipe for more columns" hint or a right-edge fade under 640 px. |
| Low | Print | Not fully tested in print preview. Code exists for a clean print area. | The code reviewer or tester should check the print preview once. |
