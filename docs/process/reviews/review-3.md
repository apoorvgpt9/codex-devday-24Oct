# Review 3 — M3.1 (commit 485d18f)

Rendered in headless Chromium by the orchestrator. No console errors. Controls verified live:
default 271 / ₹21.7 L / 4 · 30 min 200 / ₹20.0 L / 2 · 10 min 284 / ₹17.6 L / 6 · Line 3 461 / ₹48.3 L / 5.
Review-2 MUST 1–5: all landed. Line 3 toggle now turns the west green — the strongest visual in the demo.

## MUST (fold into M4, small)
1. **Station and cluster labels collide** (see `review-assets/review-3-desktop.png`): Vanaz vs Kothrud,
   Baner vs Baner / Balewadi, Wakad Chowk vs Wakad / Hinjewadi, EON IT Park vs Kharadi (local),
   PCMC vs Pimpri-Chinchwad, and a stray glyph after "Shivajinagar". Place cluster labels *below* each cluster
   (centroid y + ~28px, text-anchor middle) and skip a cluster label whose box would overlap any rendered station label.
2. **The shuttle loop is no longer the bold element** — it reads as a thin yellow squiggle. Make it the hero:
   stroke-width 10 with a 2px `--slate` casing underneath, arrowhead ~18px, and one small marker (a 6px slate dot)
   that travels along the path once on load (reduced-motion: static). Keep it the only amber on the page.

## SHOULD (M5)
- Map card drop shadow → 1px hairline (brief "Do not" list).
- The map uses ~60% of the card; reduce the projection inset so the network fills it.
