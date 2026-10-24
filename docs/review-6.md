# Review 6 — M7a/b/c (commits 4d5ee00, 8143701, 500fc86)

Driven in headless Chromium at 1366×768 by the orchestrator, all external requests blocked: none made, no errors.
- M7a: "20 min shuttle stays the best plan in 14 of 18 tests … Most sensitive to peak-hour cab speed" — matches the
  orchestrator's independent recomputation exactly. 1.6 s. ✅
- M7b: clicking a PCMC dot opens cab 87 min / ₹839 vs Metro 90 min breakdown + verdict. ✅
- M7c: sample CSV loads 150 rows, everything recomputes; Reset restores 253 / ₹22.8 L / 3 / 1,200 dots. ✅

## MUST
1. **Regression of review-5 MUST 1:** the new "Use your own workforce" band sits between the header and the map, pushing
   the map and the savings chart down — at 1366×768 the chart is cut off again (`review-assets/review-6-upload.png`).
   Move the whole import block **below the robustness section** (above the assumptions table). Keep a one-line text link
   in the header notice: "Use your own CSV ↓" that scrolls to it. Re-check the chart is fully visible at 1366×768.
2. **Uploaded data is still called synthetic** ("25 of 150 synthetic employees…", header notice, memo). When an upload
   is active, every such string must say "uploaded" instead; when reset, back to "synthetic".
3. **Negative money renders as "₹-4.5 lakh".** Format negatives as "−₹4.5 lakh net cost" in the rail, the chart labels
   and the memo. (The sample upload genuinely loses money at 20 min for 150 people — the memo should then recommend
   whatever `recommendHeadway` returns; check it reads sensibly.)
4. **Explainer title shows the raw cluster id "Pcmc".** Use the cluster's display name from places.json
   ("Pimpri-Chinchwad"); for uploaded rows use "Uploaded employee". Replace the "87 min ·₹839/day" middle-dot string with
   "87 min, ₹839 a day".
