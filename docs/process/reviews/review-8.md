# Review 8 — end-of-train checkpoint (13:16 IST) — GO

Demo build: `4f52a81` (M7.2). No commits since.
- Local, headless Chromium at 1366×768: 17/17 tests, no console errors, zero external requests.
  Baseline 20 min 253 / ₹22.8 lakh / 3 · robustness 14 of 18 · dot explainer · CSV upload + reset all verified.
- M7.2 fixes verified: robustness result clears on any control change; zero-switcher upload draws flat bars, memo says
  "No one can switch with this plan."
- Live GitHub Pages (checked from Apoorv's Mac): serves 4f52a81 — same baseline, robustness clears after a change.

No MUST items. Do not revert. Known non-blocker: robustness takes ~1.6 s on a recent laptop (up to ~9 s on a slow CPU).
