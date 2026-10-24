# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary user is a transport or administration manager at a mid-size IT company in Kharadi, Pune. In a meeting with finance, they need to decide whether to operate a company shuttle from Ramwadi Metro to Kharadi IT parks and justify the recommendation. Hackathon judges watching on a projector and laptop are a secondary demo audience. Individual commuters are not a user in scope.

## Product Purpose

Last Mile is an offline planning tool that shows which employees could realistically switch from company cabs to Pune Metro plus a Ramwadi-to-Kharadi shuttle, how frequently that shuttle should run, and its financial, time, fleet, and CO₂ implications. Success is a defensible, traceable shuttle recommendation for finance.

## Positioning

Rather than offering a personal trip planner, Last Mile evaluates a synthetic 1,200-person workforce against a deterministic commute and fleet model, then translates the result into a finance-ready transport memo. Every numeric output is traceable to visible local assumptions.

## Operating Context

The tool is used in a company transport-planning and finance conversation for the Ramwadi Metro–Kharadi IT-park corridor. Users compare company-shuttle headways, tolerance for a slower Metro journey, whether a future Line 3 is open, and PMPML-only versus company-shuttle service. It must remain usable offline on a laptop during a hackathon demonstration.

## Capabilities and Constraints

- The one-screen web experience combines a schematic Pune Metro map, live controls, results, a generated transport memo, and an assumptions table.
- The commute model considers access to open Metro stations, Metro rides and transfers, shuttle wait and ride times, fares, eligibility, fleet sizing, savings, and annual CO₂ avoided.
- All employee, cost, speed, and operating figures are synthetic assumptions and must be labelled as such wherever shown; no real company is represented as the client.
- The product uses no runtime network access, map tiles, remote images, remote fonts, APIs, external dependencies, frameworks, or build step. It runs from a plain local HTTP server with vendored fonts and local JSON data.
- All rates, speeds, fares, and costs are drawn from `data/assumptions.json`, which exposes a label, value, unit, source, and confidence level for each assumption.
- Pure commute logic remains separate from the DOM and is unit-testable with Node's built-in test runner.
- The core map is a hand-built SVG schematic, not a geographic map.

## Brand Commitments

The product name is Last Mile. Its voice is plain, specific, and finance-friendly. `docs/design-brief.md` is a binding reference for the transit-signage vernacular, the use of vendored Overpass and Mukta fonts, and accessible status labelling. It identifies the amber Ramwadi-to-Kharadi shuttle loop as the memorable product element. The repository includes the corresponding vendored font assets.

## Evidence on Hand

- Product specification and acceptance criteria: `PLAN.md`.
- Binding visual and copy constraints: `docs/design-brief.md`.
- Demo narrative: `docs/demo-script.md`.
- Reference stations, places, and model assumptions: `docs/reference/`.
- Vendored Overpass and Mukta font files: `assets/fonts/`.
- No production customer testimonials, benchmarks, pricing commitments, or validated live transit timetable are on hand. Synthetic and unverified assumptions must not be presented as facts.

## Product Principles

1. Make the transport decision legible to finance, not merely interesting to commuters.
2. Keep every recommendation inspectable through explicit assumptions and deterministic calculations.
3. Treat the offline demonstration as a first-class operating condition.
4. Use synthetic data responsibly and disclose it wherever it appears.
5. Compare plausible operational choices rather than promising a single predetermined outcome.

## Accessibility & Inclusion

The interface must not rely on colour alone: status legends and tooltips use words. It must support reduced motion, render without horizontal scrolling at 375px, use legible transit-signage-oriented type, and pair Marathi station-name support with English labels.
