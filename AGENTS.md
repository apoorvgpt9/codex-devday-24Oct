# AGENTS.md — rules for Codex in this repo

Read this file, then `PLAN.md`, then `PRODUCT.md` and `docs/design-brief.md` before writing code.
`DESIGN.md` does not exist yet by design — `docs/design-brief.md` is the visual source of truth until M5,
when `/impeccable document` generates `DESIGN.md` from the built UI. Do not create `DESIGN.md` before M5.

## What we are building
**Last Mile** — a planning tool for a company's transport/admin team in Pune. It shows which employees
can realistically commute by Pune Metro + a company shuttle from Ramwadi station to Kharadi IT parks,
how often that shuttle should run, and what it saves (₹ cab spend, CO₂, minutes). Full spec: `PLAN.md`.

## Hard constraints (non-negotiable)
1. **Zero dependencies, zero build step.** Plain `index.html` + ES modules in `src/` + CSS in `styles/`.
   No npm packages, no CDN links, no frameworks, no bundler. It must run with
   `python3 -m http.server 8000` (or `npx serve` if Python is missing) and work **with Wi-Fi off**.
2. **No network at runtime.** No map tiles, no Google Fonts, no remote images, no API calls in the core flow.
   Fonts are vendored in `assets/fonts/`. The map is a hand-built SVG schematic.
3. **All numbers come from `data/assumptions.json`.** Never hard-code a rate, speed, fare or cost in logic.
   Every assumption has a `label`, `value`, `unit`, `source` and `confidence` field and is shown in the UI.
4. **Synthetic data is labelled as synthetic** everywhere it appears. Never name a real company as the client.
5. **Pure logic is separate from UI.** `src/model/*.js` has no DOM access and is unit-testable with
   `node --test tests/`. UI code lives in `src/ui/*.js`.
6. **Design authority is Impeccable** (`PRODUCT.md`, later `DESIGN.md`) plus `docs/design-brief.md`.
   **Code-first, not comp-first:** build directly in HTML/CSS/SVG. No design images, no image generation, no mockup step.
   Do not install or invent a second design system. Do not use any pattern listed under "Do not" in the brief.

## Working rhythm
- Work milestone by milestone in the order in `PLAN.md`. Do not start a milestone before the previous
  one's acceptance checks pass.
- **Commit and push after every milestone** with message `M<n>: <what now works>`.
  If `git push` fails (no signal), keep working and push at the next opportunity — never block on it.
- Append one line per milestone to `PROGRESS.md`: time, milestone, what was verified, known gaps.
- If something in `PLAN.md` is ambiguous, pick the simplest option that keeps the demo working,
  note the choice in `PROGRESS.md`, and continue. Do not stop to ask.
- Never edit `PLAN.md`, `AGENTS.md`, `docs/` or `prompts/` — those are owned by the human/orchestrator.

## Definition of done for any milestone
- `node --test tests/` passes.
- Page loads from `http://localhost:8000` with no console errors and with network disabled.
- The milestone's acceptance checks in `PLAN.md` are met.
