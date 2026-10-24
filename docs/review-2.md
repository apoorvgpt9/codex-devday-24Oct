# Review 2 — M2 + M3 (commits 1b7d4a2, c233790)

Rendered in headless Chromium by the orchestrator (screenshots in `docs/review-assets/`).

## Fixed by orchestrator
- **Page crashed on load — nothing rendered.** `map.js`: `group.append(title).textContent = …` — `append()` returns
  `undefined`. Fixed. After the fix: no console errors; controls verified live:
  default 271 / ₹21.7 L / 4 buses · 30 min 200 / ₹20.0 L / 2 · 10 min 284 / ₹17.6 L / 6 · Line 3 461 / ₹48.3 L / 5.
- Lesson: "HTTP 200 + module syntax" is not a render check. Codex cannot open a browser here; the orchestrator
  will render every milestone.

## MUST (do first, in this order)
1. **Remove angle snapping.** Each line is snapped independently from its first station, so errors accumulate:
   Line 3 does not reach District Court, Shivajinagar appears twice, and the central stations collapse together.
   Draw every station at its projected position (`project()`), shared stations once. Change the map note and header
   notice to "approximate positions, not to scale".
2. **Label clutter in central Pune is unreadable** (see desktop screenshot). Show a text label only for: line termini,
   District Court, Shivajinagar, Ramwadi, the office, and the top-5 boarding stations at the current setting.
   All other stations keep the dot plus a `<title>` tooltip and show their label on hover/focus.
   Re-render labels for the top-5 when controls change.
3. **Shuttle arrowhead is a blob** — the marker scales with stroke-width 9. Use `markerUnits="userSpaceOnUse"`,
   markerWidth/Height ≈ 16.
4. **Borderline dots use amber.** The brief reserves amber for the shuttle loop only. Draw borderline as a hollow
   ring in `--switch` (fill none, stroke 1.25) and update the legend to match.
5. **Label the residential clusters** (Wagholi, Hadapsar / Magarpatta, Viman Nagar, Kharadi, Kothrud, Pimpri-Chinchwad,
   Wakad / Hinjewadi, Baner) in `--mist`, 12px, at the cluster centroid offset above the dots. Judges need to read
   *who* is red without being told.

## SHOULD (M5 design pass)
- Map card uses a soft grey drop shadow — on the brief's "Do not" list. Replace with a 1px hairline border.
- Header notice uses an "A · B" meta string (also on the list). Write it as a plain sentence.
- Mobile: SVG is letterboxed inside a 430px min-height box (large empty bands). Drop the min-height under 600px.
- Check dark mode once.
