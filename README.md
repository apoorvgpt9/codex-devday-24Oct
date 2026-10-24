# Last Mile

**Should a Kharadi IT company run a shuttle from Ramwadi Metro, how often, and who would actually leave their cab?**

Last Mile is a planning tool for a company's transport team. It models every employee's door-to-door commute by cab and
by Pune Metro + a last-mile shuttle, finds the shuttle frequency that saves the most, and writes the recommendation for finance.

**Live:** https://apoorvgpt9.github.io/codex-devday-24Oct/ · **Track:** Urban Mobility ·
**Built for:** DevDay Exchange Community Metro Hackathon, Pune, 24 Oct 2026, with OpenAI Codex

![Last Mile at the recommended 20-minute shuttle](docs/screenshot.png)

## The problem

Pune Metro ridership is below projections, and Maha Metro names the last mile as the reason: stations sit 3–6 km from
where people work. Kharadi's IT parks are the clearest case. The nearest working station is Ramwadi, the public PMPML
feeder runs about every 30 minutes, and the Metro extension toward Kharadi only began preparatory work in September 2026.
Companies keep paying for door-to-door cabs because nobody can show them, employee by employee, who could switch.

## What it finds

For a synthetic 1,200-person company at EON IT Park:

| Option | People who can switch | Buses | Net saving / month |
|---|---|---|---|
| PMPML feeder only | 150 (bus full at peak) | 0 | ₹18.2 lakh |
| Company shuttle every 30 min | 200 | 2 | ₹20.0 lakh |
| **Company shuttle every 20 min (recommended)** | **253** | **3** | **₹22.8 lakh** |
| Company shuttle every 15 min | 271 | 4 | ₹21.7 lakh |
| Company shuttle every 10 min | 284 | 6 | ₹17.6 lakh |
| 15 min, if Line 3 (Hinjewadi) runs end to end | 461 | 5 | ₹48.3 lakh |

- People who live near the Metro keep their cab (their ride is already short); long commuters from Kothrud and PCMC switch.
- More frequent shuttles add riders but cost more than they save; the tool finds the 20-minute optimum itself.
- The recommendation holds in 14 of 18 robustness tests (each uncertain input moved ±25%). The input that matters most
  is peak-hour cab speed, so that is what to measure before contracting buses.

## What you can do in the app

| Capability | How |
|---|---|
| See who can switch | 1,200 employee dots on a Metro map, green = can switch, red = stays on cab |
| Compare PMPML vs a company shuttle | **Shuttle decision → Company shuttle / PMPML only** |
| Find the best frequency | Drag **Shuttle every** (10–30 min); the bar chart marks the recommended option |
| Change what employees will accept | Drag **Time tolerance** (+0 to +20 min) |
| Plan for Line 3 | Tick **Show Line 3 what-if** |
| Get a finance memo | **Transport memo → Copy memo** |
| Test how sure the answer is | **Run robustness test** |
| Explain one person's verdict | Click any dot: cab vs Metro, leg by leg |
| Use your own workforce | **Use your own CSV ↓** (`lat,lng[,shiftStart]`); read in the browser, never uploaded |
| Check every number | **Model assumptions** table: value, source and confidence for all 25 inputs |

## Run and test

No install, no dependencies, no build step. Works offline.

```bash
npm start            # or: python3 -m http.server 8000  → open http://localhost:8000
npm test             # 17 unit tests (node --test, Node 18+)
npm run summary      # prints the headline numbers for each scenario
```

## How it works

```
data/*.json ──► src/main.js ──► src/model/ (pure, no DOM) ──► src/ui/ (SVG map, chart, memo, tables)
                      ▲                                              │
                      └───────────── control change ◄────────────────┘
```

For each employee the model (`src/model/commute.js`) compares:

1. **Cab:** road distance (straight line × 1.35) at 16 km/h peak speed, ₹18/km, round trip.
2. **Metro:** walk (≤1 km) or auto (≤5 km) to the nearest open station, ride to Ramwadi (2.2 min/stop, 6 min per line
   change, `network.js` route search), then shuttle wait (half the headway) + 6.5 km ride.
3. **Verdict:** can switch if Metro ≤ cab + tolerance. PMPML mode caps riders at the feeder's spare seats per shift.
4. **Fleet and money:** buses = max(what the headway needs, what the busiest shift needs). Net saving = cab spend avoided
   − bus contracts − reimbursed Metro, auto and PMPML fares.
5. **Recommendation:** the option with the highest net saving across PMPML and 30/25/20/15/10-minute shuttles.
6. **Robustness** (`sensitivity.js`): reruns step 5 with each low-confidence input at ×0.75 and ×1.25.

Every rate, speed and cost lives in [`data/assumptions.json`](data/assumptions.json) with its source and confidence, and is
shown in the app. Nothing is hard-coded in the calculation.

## Data: what is real

- **Real:** Pune Metro Lines 1 and 2 and the Line 3 stations (positions approximate, ±300 m); EON IT Park; the PMPML
  Ramwadi feeder route.
- **Synthetic, labelled as such everywhere:** the 1,200 employees (`scripts/gen-employees.mjs`, seeded), their home
  clusters, and the cost and speed assumptions.
- Line 3 is a toggle, not a default, because its full opening is unconfirmed.

## Project structure

```
index.html            single page
src/main.js           loads data, holds state, wires model to UI
src/model/            commute.js, network.js, geo.js, sensitivity.js, workforce.js — pure functions
src/ui/               map.js, controls.js, results.js, frequency-chart.js, memo.js, robustness.js, assumptions.js, workforce-import.js
styles/app.css        design tokens, dark mode, reduced motion, 375 px layout
data/                 stations, places, employees, assumptions, sample CSV
assets/fonts/         Overpass and Mukta (Marathi), vendored — no external requests
tests/                node:test unit tests
scripts/              data generators and the summary script
docs/                 design brief, demo script; docs/process/ holds the build plan, Codex prompts and review log
```

## How it was built

Built with OpenAI Codex, orchestrated milestone by milestone: [`AGENTS.md`](AGENTS.md) holds the rules Codex followed
(zero dependencies, offline, every number from the assumptions file, model separate from UI). The plan, the exact
prompts and the per-milestone review log are in [`docs/process/`](docs/process/). Every milestone was rendered and
clicked through in a headless browser before the next one started. Work began the morning of the event with the host's
go-ahead and continued on the Metro sprint; the commit history shows the timeline.

## Limits

- Illustrative numbers until real inputs replace the low-confidence assumptions.
- One office (EON IT Park) and one hub (Ramwadi).
- No live traffic or timetable data, by design (offline, explainable).
- The boarding station is the nearest one, not necessarily the fastest; this slightly under-counts switchers.

## Licence

MIT — see [LICENSE](LICENSE).
