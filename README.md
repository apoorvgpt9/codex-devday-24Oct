# Last Mile

Should your company run a shuttle from Ramwadi Metro to Kharadi — and who would actually switch from cabs?

A planning tool for transport teams in Pune. Built at the DevDay Exchange Community Metro Hackathon, Pune, 24 Oct 2026,
on a moving Pune Metro train with Codex.

**Run it:** `python3 -m http.server 8000` → open http://localhost:8000. Works offline.
**Test it:** `node --test tests/`

Data: stations and the PMPML feeder route are real (approximate positions). Employees, costs and speeds are synthetic
assumptions, all listed in `data/assumptions.json` and on screen.

- Spec: `PLAN.md` · Agent rules: `AGENTS.md` · Design brief: `docs/design-brief.md` · Demo: `docs/demo-script.md`
