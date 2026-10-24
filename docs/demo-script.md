# Demo script — 2 minutes

**0:00 — Problem (20 s).** "Pune Metro ridership is below projections, and Maha Metro itself says the reason is the last mile.
Kharadi is the clearest case: thousands of IT employees, the nearest working station is Ramwadi, 3 to 6 km away,
and the public feeder runs about every 30 minutes. So companies keep paying for door-to-door cabs."

**0:20 — Who it's for (10 s).** "This is for the transport manager who pays that cab bill, not for the commuter.
Synthetic data: a 1,200-person company at EON IT Park."

**0:30 — The map (20 s).** Point at the amber loop. "Every dot is an employee. Green can switch to Metro plus a shuttle
from Ramwadi without losing more than 10 minutes. Red stays on cab."

**0:50 — First insight (20 s).** "Counter-intuitive: people who live *near* the Metro don't switch — their cab is short.
The switchers are long commuters from Kothrud and PCMC, where Metro beats a 70-minute road crawl."

**1:10 — The lever (25 s).** Start the slider at 30 and drag toward 10, slowly. "PMPML alone fills up at 150 people.
A company shuttle every 30 minutes: 200 people. Every 20 minutes: 253 people, 3 buses, ₹22.8 lakh a month net.
Push to 15 or 10 and you gain a few riders but need a fourth, fifth, sixth bus — the saving falls to ₹17.6 lakh.
The tool finds that peak itself: it recommends 20 minutes." Point at the savings-by-frequency chart and the memo's first line.

**1:35 — What-if (15 s).** Toggle Line 3. "When the Hinjewadi line runs end to end: 461 people and ₹48 lakh a month. Plan the shuttle before it opens."

**1:45 — The output (15 s).** Show memo. "It writes the memo to finance, with every assumption listed and its confidence.
Built with Codex and designed offline-first for exactly this train — no map tiles, no API calls, nothing that breaks on a weak signal."

**Optional (if M7a ships) — Robustness (15 s).** Click "Run robustness test". "Every guess here is labelled. Shift each
low-confidence one by 25% either way: 20 minutes stays best in 14 of 18. The one input that really matters is peak cab
speed — so that's what finance should measure first."

## If a judge asks
- *"Is the data real?"* — Stations and the feeder route are real (approximate positions). Employees and costs are synthetic
  and every assumption is on screen with a confidence level. Swap in a real HR pin-code export and it runs the same.
- *"Where's the AI?"* — Built end to end with Codex during the sprint. The runtime is deliberately deterministic: a finance
  decision should be explainable line by line. Next step: let the admin ask what-if questions in plain English.
- *"Is Line 3 open?"* — Status is unconfirmed as of today, which is exactly why it's a toggle, not a default.

## Sources for the pitch facts
- Pune Metro planning own feeder buses over last-mile gap, Apr 2026 — swarajyamag.com news brief
- PMPML Ramwadi → EON / ITP feeder, ~30 min headway — punekarnews.in (Aug 2024), mypunepulse.com (Aug 2025)
- Ramwadi is the only operational station near Kharadi; Ramwadi–Wagholi extension only began prep work Sep 2026 — squareyards.com, punekarnews.in
- Line 3 flag-off expected end-Sep 2026; Wikipedia lists Dec 2026 for phase 1 — swarajyamag.com, en.wikipedia.org (Pink Line)
