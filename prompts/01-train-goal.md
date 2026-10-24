# 01 — Train sprint (start at 12:00 when the sprint officially begins)

Paste this into Codex exactly:

```
/goal Implement milestones M1, M2 and M3 of PLAN.md in this repo — skip any milestone PROGRESS.md already marks done and apply MUST items from any docs/review-*.md first — following AGENTS.md strictly (zero dependencies, offline, assumptions only from data/assumptions.json, pure model separate from UI). Read AGENTS.md, PLAN.md, PRODUCT.md and docs/design-brief.md first (DESIGN.md intentionally does not exist yet; build code-first, no comps). Work in order: M1 data + model + tests, then M2 SVG schematic map, then M3 controls + live results. After each milestone: run `node --test tests/`, load the page via `python3 -m http.server 8000` and check for console errors, compare switcher counts with the ballpark table in PLAN.md §8, append a line to PROGRESS.md, then `git add -A && git commit -m "M<n>: <what works>" && git push` (if push fails, continue and retry later). Stop when M3's acceptance holds: moving the shuttle-frequency slider from 30 to 10 recolours dots and updates switchers, ₹ saving and bus count on screen, with all tests passing and committed. Do not start M4. If blocked for more than 10 minutes on one problem, pick the simplest workaround, record it in PROGRESS.md and continue.
```

## While it runs
- Keep the laptop plugged into a power bank if you have one; dim the screen.
- Glance at `PROGRESS.md` every ~10 minutes. If Codex starts adding packages or a map library, `/goal pause`
  and say: "AGENTS.md rule 1: zero dependencies. Remove it and continue."
- If the hotspot drops: Codex itself needs the network to think. Wait it out — commits queue locally.
- By ~1:10 PM: `/goal pause` if not finished, commit whatever works, push at the next station.
