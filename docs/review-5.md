# Review 5 — M4.1 + M5 (commits 835353f … 0286a49)

Rendered in headless Chromium by the orchestrator with **all non-localhost requests blocked**: zero external requests,
no console errors, 12/12 tests, 375px has no horizontal scroll, dark mode renders correctly.
20-min setting verified live: 253 / ₹22.8 L / 3 buses. Chart shows the 20-min peak; assumptions table formatted.

## MUST (before demo)
1. **The savings-by-frequency chart is below the fold** (needs a scroll at 1440×900; worse on a 1366×768 projector).
   It is the core of the pitch. Move it in the rail to directly under the big switcher number, above the three
   metric rows; move "Most-used boarding stations" to the bottom of the rail. Tighten the rail: radio rows and
   slider blocks currently use ~2× the vertical space they need. Target: chart fully visible at 1366×768 without scrolling.
2. **"Shivajinagar" renders twice** (L1 `shivajinagar` and L3 `shivajinagar-l3` at identical coordinates → overlapping
   label/glyph). In `map.js`, render one station mark + label per unique name+position. Do not change data or the model.
3. **Selected bar outline is invisible** at the current setting — make it a 2px `--slate` outline so the presenter's
   slider position and the green recommended bar are both readable.

## SHOULD
- Vanaz / Anand Nagar labels still touch; offset Vanaz's label to the left.
