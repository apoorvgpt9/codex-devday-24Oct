# 00 — Before boarding (do now, on Wi-Fi). No app code.

1. Get the repo onto the laptop:
   - If your Impeccable folder is NOT yet a git repo:
     `git clone https://github.com/apoorvgpt9/codex-devday-24Oct last-mile` and move any files Impeccable
     created (`PRODUCT.md`, `DESIGN.md`, `.agents/`, hook config) into the clone.
   - If it already is a git repo pointing at this remote: `git pull origin main --allow-unrelated-histories`.
2. Open Codex in the repo folder and run:
   `/impeccable init` — when asked about the product and design, give it `docs/design-brief.md` and `PLAN.md` §1–3.
   Check that `PRODUCT.md` and `DESIGN.md` now reflect the brief (concrete ground, amber shuttle, Overpass).
3. Confirm hooks: `/hooks` shows Impeccable's PostToolUse and Stop hooks as trusted.
4. Commit the Impeccable files: `git add -A && git commit -m "M0: design context" && git push`.
5. Check `node -v` works (tests use `node --test`). If Node is missing, tell the orchestrator.
6. Charge everything. Turn on phone hotspot once to confirm it works.
