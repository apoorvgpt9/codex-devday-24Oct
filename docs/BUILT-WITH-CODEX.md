# Built with OpenAI Codex

Every line of application code in `src/`, `styles/`, `index.html`, `tests/` and `scripts/` was written by **OpenAI Codex**,
driven by long-running `/goal` runs against a written plan. Commits authored `apoorvgpt9` are Codex runs.

## How Codex was used

| Codex feature | Where to see it |
|---|---|
| `AGENTS.md` repo rules (zero deps, offline, every number from one file, model separate from UI) | [`AGENTS.md`](../AGENTS.md) |
| `/goal` long-running objectives with a verifiable stop condition and a commit per milestone | [`process/prompts/`](process/prompts/) — `01-train-goal.md`, `02-auditorium-goal.md`, `04-enhancements.md` |
| Plan-driven milestones with acceptance checks and expected numbers | [`process/PLAN.md`](process/PLAN.md) §8–§10 |
| Codex skills: **Impeccable** (`/impeccable init`, detector hooks, design pass) and **make-interfaces-feel-better** | [`PRODUCT.md`](../PRODUCT.md), [`DESIGN.md`](../DESIGN.md), `.impeccable/`, commits `d64e6ea`–`0286a49` |
| Codex's own progress log, one line per milestone | [`process/PROGRESS.md`](process/PROGRESS.md) |

## The loop

1. A milestone spec and its expected numbers go into the plan (e.g. "20-minute shuttle holds in 14 of 18 robustness tests").
2. Codex runs a `/goal` to build it, runs `node --test`, appends to `PROGRESS.md`, commits and pushes.
3. The commit is pulled, its tests rerun and the page rendered and clicked through in headless Chromium with all network
   blocked. Findings go into a review file with MUST items ([`process/reviews/`](process/reviews/)).
4. The next `/goal` applies the review's MUST items first, then builds the next milestone.

Planning, reviews and browser verification were done by Claude acting as orchestrator (commits with a Claude
co-author line); one load-crash fix in `src/ui/map.js` (`405908c`) was made during review. Everything else is Codex.

## Milestones (Codex commits)

| Milestone | Commit | What landed |
|---|---|---|
| M1 / M1.1 | `c4deeba`, `6f1e7f6` | Synthetic data, commute + fleet model, tests; review fixed round-trip fares and PMPML capacity |
| M2 / M3 / M3.1 | `1b7d4a2`, `c233790`, `485d18f` | SVG Metro map, live controls and results, map legibility |
| M4 / M4.1 | `cb3c146`, `835353f` | Finance memo, assumptions table, savings-by-frequency chart |
| M5 / M5.1 | `d64e6ea`–`0286a49`, `4959a61` | Design pass with Impeccable and make-interfaces-feel-better |
| M7a–c | `4d5ee00`, `8143701`, `500fc86` | Robustness test, click-a-dot explainer, CSV import |
| M7.1 / M7.2 | `b0a3516`, `4f52a81` | Review fixes: labels, negative money, stale robustness, zero-switcher chart |
