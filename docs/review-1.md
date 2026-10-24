# Review 1 — M1 (commit c4deeba)

Verified independently: 7/7 tests pass; switchers 200 / 271 / 284 / 461 reproduce; no deps; no DOM in `src/model`.

## The problem
Net monthly saving today: PMPML-only ₹26.5 L > 15-min shuttle ₹23.6 L > 10-min shuttle ₹19.5 L.
The model currently says "don't run a shuttle" — because of three bugs, not because it's true.

## MUST (fix before M2) — ✅ resolved in 6f1e7f6, verified by orchestrator
1. **Fares are one-way, cab cost is round-trip.** `metroFare` and `accessCost` must be ×2 per day in
   `reimbursedFares` (to office and back), matching `cab.costPerDay`.
2. **PMPML has unlimited capacity.** A bus every 30 min cannot carry 200 extra people per day.
   Add capacity: per shift, `pmpmlCapacityPerShift = floor(shiftWindowMin / pmpmlHeadwayMin) × pmpmlSpareSeatsPerBus`.
   In PMPML mode, within each `shiftStart`, keep the would-be switchers with the most minutes saved (lowest `deltaMin`)
   up to capacity; the rest get `canSwitch: false`, `reason: 'PMPML feeder full at peak'`.
   Add PMPML ticket cost `pmpmlFare` (×2 per day) to reimbursed fares in PMPML mode.
   New assumptions (already added to `docs/reference/assumptions.json` — copy into `data/assumptions.json`):
   `pmpmlSpareSeatsPerBus` 25 (low), `pmpmlFare` 15 ₹ (low), `shuttleTurnaroundMin` 10 (medium).
3. **Hard-coded `TURNAROUND_MINUTES = 10`** in `commute.js` breaks AGENTS.md rule 3 → use `shuttleTurnaroundMin`.
4. **Tests:** add (a) PMPML switchers ≤ 3 shifts × capacity, (b) reimbursed fares equal 2 × one-way fares × days
   for a single switcher, (c) at default settings the 15-min company shuttle's net saving > PMPML-only's.
   Update `scripts/summary.mjs` to also print buses and net saving (₹ lakh) per setting.

## SHOULD (fold into M4)
- Add `recommendHeadway(employees, context, assumptions)` to the model: evaluate PMPML-only and company shuttle at
  10 / 15 / 20 / 30 min and return the option with the highest net monthly saving. The memo leads with it.
  This turns "10 min barely helps and costs ₹5 L more" into the tool's own conclusion.

## Fine as is
Routing (BFS by hops with transfer tie-break), nearest-station logic, CO₂, fleet sizing formula, test coverage of §5.
