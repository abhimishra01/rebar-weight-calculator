# Mock-customer test: Rebar weight calculator

Tested on the live build (own build folder, port 4497) with playwright-cli. Real values typed, real results read. Math checked by hand: every total matched the ASTM nominal weights.

## Mike, 41, estimator at a concrete contractor, desktop 1366x800 (expert)
Mike takes off a footing job. He picks #4, types 20 ft 6 in, quantity 240. He presses Enter, adds #5 at 12 ft 3 in x 60, then #8 at 40 ft x 24. He sets waste to 5%. The total reads 6,947.18 lb, 3.474 short tons, 3,151 kg. That matches his hand math (6,616.37 net x 1.05). Copy takeoff gives a tab-separated block he can paste in Excel. Print gives a clean sheet.
- Click on Google over others? "Yes if it shows up. It is the first one that takes feet and inches and many lines."
- Under 30 seconds? "About 25 seconds for three lines. Enter to add a line is good."
- Confused? "The page opens with a made-up job (100 x 20 ft #5). I had to overwrite it. After 3 lines the total is below the fold, so I scroll to see it. No subtotal per bar size. Printout has no job name, no date field I can edit, no PO number."
- Missing to bookmark: job name and notes on the printout, subtotal by size, a line for stirrups and hooks (cut length from bend dimensions), lap splice helper, price per ton.
- Trust? "Yes. Weights match the CRSI chart I know, and the 6% tolerance note is honest."
- Come back? Yes, if lines are saved (they are, in the browser) and the printout has a job name.

## Dani, 26, site superintendent, iPhone 390x844 (beginner to intermediate)
Dani needs the weight of 40 pieces of #6, 20 ft, for a delivery check. The form is simple. He types 20' with the foot mark and gets "Check entry" and a note that one line is left out. He fixes it to 20. Result: 1,201.60 lb, 0.601 short tons. The result is below the fold on his phone (about 960 px down), so he scrolls.
- Click on Google? "Yes, the title says #3 to #18 in lb, kg and tons. That is what I search."
- Under 30 seconds? "About 20 seconds. Slower than I want because the answer was off screen."
- Confused? "The error for 20' does not say what is wrong. It says use numbers. Just let me type 20'. The 100 x 20 ft #5 starter numbers looked like my answer for a second."
- Missing: a truck load check (how many bars fit under 48,000 lb), a bigger result near the inputs, a Share button.
- Trust? "Yes."
- Come back? Yes, for delivery checks. He would add it to his home screen.

## Linda, 52, homeowner pouring a patio, Android 375x667 (beginner)
Linda has 30 pieces of #3 bar, 10 ft long. She types 10 and 30 and gets 112.80 lb. She tries "10 ft 6 in" and enters 6 in Inches: 118.44 lb. She types "thirty" in Quantity and sees "Check entry". She taps Metric bars out of curiosity, and her numbers are gone (a default 6 m x 100 of M16 appears). Her US lines come back when she switches back, but she did not know that.
- Click on Google? "I searched how much does rebar weigh. I might click a page that says that in the title."
- Under 30 seconds? "Yes, 15 seconds."
- Confused? "What is a #3? The dropdown shows 0.375 in, which helps. The tool does not tell me how many bars my slab needs. Waste or laps, what is that? Metric toggle erased my work."
- Missing: a slab or grid mode (give area and spacing, get bars), a plain-word hint for laps.
- Trust? "I think so. It shows the table below."
- Come back? Maybe, next project.

## Raj, 34, structural engineer, MacBook 1440x900 (expert, metric and US)
Raj checks a quote. Metric mode: 12 mm round, 12 m, 50 pcs gives 532.69 kg, 1,174.38 lb, 0.533 metric tons. Matches his 0.888 kg/m x 600 m (532.8; the small gap is that the tool uses exact density math, not the rounded 0.888). Then US mode: #18 at 38 ft 3 1/2 in x 12 gives 6,249.20 lb. Fraction input works, which he likes.
- Click on Google? "Only if I need a quick check. I usually open my own spreadsheet."
- Under 30 seconds? Yes.
- Confused? "12 mm gives 532.69, but the chart row says 0.888 kg/m, so 12 x 50 x 0.888 = 532.80. A 0.1 kg gap is fine, but a note on how the metric round value is computed would help. Grade is not stated (A615 Grade 60 vs A706 weldable). Same nominal weights, but the page does not say."
- Missing: Grade note (A615 / A706), weight per bar in the chart for a chosen length, a link to a shareable URL for a takeoff.
- Trust? "Yes. The page cites ASTM, shows the 6% tolerance, and lists nominal weights."
- Come back? Yes, for the chart, which he would bookmark.

## Carlos, 45, estimator on an iPad / phone 390x844, long takeoff (intermediate)
Carlos enters nine lines for a deck job. He types 1,200 with a comma and it works (22,528.80 lb for #5 18 ft). Enter in Quantity adds lines and puts the cursor in the next length box, which is fast. But on the phone each line is about 270 px tall. After nine lines the total sits more than 3,000 px down the page. He cannot see the running total while he types.
- Click on Google? "Yes, rebar weight calculator is what I search."
- Under 30 seconds? "No. Nine lines took minutes, which is normal, but I had to scroll a lot."
- Confused? "Add a line each time pushes me down. No way to duplicate a line. The inches box looks greyed when it shows 0. Deleting a line in the middle works."
- Missing: a sticky total bar at the bottom of the phone screen, compact line layout (size, length, qty in one row), duplicate line, one tap to export to a text or CSV file, saved named takeoffs.
- Trust? "Yes. It remembers my lines after a reload, which saved me once."
- Come back? Yes, if the total stays visible.

## Ranked change list

### Must
1. Keep the total visible while entering lines on phones (sticky bottom bar or total above the lines). Asked by 3 of 5 (Dani, Carlos, Mike on desktop with 3+ lines).
2. Start with empty fields instead of the 100 x 20 ft #5 starter job (or label it clearly as an example). Asked by 3 of 5 (Mike, Dani, Linda).
3. Accept and clean common typing: 20', 20'-6", 12'6". Today 20' gives "Check entry". Asked by 2 of 5 (Dani, Mike), and the error does not say which field is wrong.

### Should
4. Add a job name and notes to the printout and copied takeoff. Asked by 2 (Mike, Carlos).
5. Subtotal by bar size in totals and printout. Asked by 2 (Mike, Carlos).
6. Make each line shorter on phones (one row for size, length, qty). Asked by 2 (Carlos, Dani).
7. Warn or convert when switching between US and Metric so the lines do not seem lost. Asked by 2 (Linda, Raj).
8. Short plain help: what a #3 is, what laps are, what waste to use. Asked by 1 (Linda).
9. State the grade (A615 Grade 60 vs A706) and how the metric round value is computed. Asked by 1 (Raj).

### Nice
10. Slab or grid mode (area and spacing to number of bars). Asked by 1 (Linda).
11. Truck load check against a legal weight. Asked by 1 (Dani).
12. Stirrup and hook cut length helper. Asked by 1 (Mike).
13. Duplicate line, share link, download CSV. Asked by 2 (Carlos, Raj).

## Verdict
The core job works: math is correct, Enter-to-add is fast, fractions and commas work, takeoffs copy and print. Trust is high because the chart and tolerance are on the page. The main gaps are phone ergonomics (total out of sight), the starter values, and strict input parsing.
