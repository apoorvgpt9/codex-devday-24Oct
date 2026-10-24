# Review 4 — M4 (commit cb3c146)

Rendered in headless Chromium by the orchestrator: no console errors; 11/11 tests; controls reproduce the model.
Memo, recommendation, Copy memo and the full assumptions table all render.

## Finding — the demo story changed (for the better)
`recommendHeadway` picks **20 min**, not 15. Verified independently:
30 → ₹20.0 L · 25 → ₹22.0 L · **20 → ₹22.8 L (253 people, 3 buses)** · 15 → ₹21.7 L · 10 → ₹17.6 L · PMPML → ₹18.2 L.
The demo script now follows the model. Do not tune assumptions to make 15 win.

## MUST (M5, before polish)
1. **Show the optimum on screen.** In the results rail, add a small inline SVG bar chart "Net monthly saving by
   shuttle frequency": PMPML, 30, 25, 20, 15, 10 min. Bars in `--slate` at 35% opacity, the recommended bar in
   `--switch`, the currently selected bar outlined. Values as text labels (₹ lakh). Recomputes when tolerance or
   Line 3 changes. This is the single most persuasive element in the demo — the curve that peaks.
2. **Assumptions table formatting:** ₹ values with Indian grouping (₹2,50,000 / bus / month); fare slabs rendered as
   "≤2 stations ₹10 · …" in plain words, not a raw array. Confidence "Low" in `--stay`, so the weak inputs stand out.

## SHOULD
- Cluster labels still touch station labels at Pimpri-Chinchwad, Kothrud and Baner / Balewadi. Nudge, don't redesign.
- Memo: lead with the recommendation as its own bold line; the "At the selected…" paragraph can follow.
- Then run prompts/03-polish.md as planned.
