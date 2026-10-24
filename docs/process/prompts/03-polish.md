# 03 — Design pass + ship (3:45–4:25 PM)

Run these in order. Commit after each with `M5: <what changed>`.

0. `/impeccable document` — creates `DESIGN.md` from the built UI. Check it records the brief's tokens.
1. `/impeccable critique` — read the findings; fix P0/P1 only.
2. `/impeccable polish` — keep the tokens in DESIGN.md / docs/design-brief.md; the amber shuttle loop stays the one bold element.
3. Ask Codex: "Use the make-interfaces-feel-better skill to review src/ui and styles/. Apply only: tabular numbers,
   hit areas ≥ 40px on controls, scale-on-press on buttons, interruptible transitions on dot recolour.
   Do not add libraries."
4. `/impeccable audit` — fix anything that breaks at 375px width or fails contrast.
5. Ship (M6):
   - Take one screenshot of the full screen at default settings → `docs/screenshot.png`, add to README.
   - Optional if network is good: enable GitHub Pages (Settings → Pages → main / root). Otherwise demo from localhost.
   - Rehearse `docs/demo-script.md` once, out loud, with a timer.
6. **Submit by 4:25 PM.** Judging starts 4:30.
