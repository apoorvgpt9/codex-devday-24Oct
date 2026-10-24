# Design brief — Last Mile

Feed this to `/impeccable init` (or paste into `PRODUCT.md` / `DESIGN.md`). Impeccable is the design authority;
this brief is the input.

## Register
Product (operate), not marketing. A decision tool a transport manager uses in a meeting with finance.
The demo audience is hackathon judges watching on a projector and on a laptop screen.

## Subject vernacular — where the look comes from
Pune transit signage and the transit-diagram tradition: straight lines at 0/45/90°, round station ticks,
interchange rings, line colours as the only saturated colours on the page. The memorable element is the
**amber shuttle loop** from Ramwadi into Kharadi — the colour of an auto-rickshaw roof, the one bold thing on screen.

## Tokens
| Name | Hex | Role |
|---|---|---|
| concrete | `#E6EAEC` | page ground (cool, not cream) |
| slate | `#1E2B33` | text, station ticks |
| mist | `#8C9AA3` | secondary text, unopened what-if line labels |
| aqua | `#14A3B8` | Line 2 (operational) |
| purple | `#6B4FA0` | Line 1 (operational) |
| pink | `#D6418A` | Line 3 (what-if, dashed until toggled) |
| amber | `#F2B200` | company shuttle loop, primary action — use nowhere else |
| switch | `#1F8A5B` | employee can switch |
| stay | `#B5473A` | employee cannot switch |
Dark mode: ground `#11181D`, text `#E3E8EB`; line colours unchanged.

## Type
- **Overpass** (vendored, 400/600/800) for everything. It is derived from highway signage lettering, which fits.
  Use tabular figures for every number (`font-variant-numeric: tabular-nums`).
- **Mukta** (vendored, Devanagari 400/600) for Marathi station names only.
- Scale: 13 / 15 / 18 / 24 / 40. The one 40px element is the switchers count.

## Layout
Map is the hero at ~65% width, edge to edge vertically. Right rail holds controls on top, results below.
Memo and assumptions table sit beneath, full width. Left-aligned text throughout.

## Motion
One orchestrated moment: on load the amber shuttle loop draws itself (≈1.2 s), then dots fade to their verdict colours.
Control changes recolour dots with a short 150 ms transition. Respect `prefers-reduced-motion`.

## Do not
- Cream/beige backgrounds, terracotta accents, near-black-with-acid-green.
- Identical rounded cards with soft grey shadows; cards inside cards; gradient washes.
- All-caps eyebrow labels, "A · B · C" meta strings, "→" appended to buttons, monospace for data labels.
- A big-number-plus-gradient hero. The hero is the map.
- Emoji in UI. Stock icons as decoration.
- Colour as the only signal (the legend and tooltips say "can switch" / "stays on cab" in words).

## Copy voice
Plain, specific, finance-friendly. "286 people can switch to Metro + shuttle", not "Unlock smarter commuting".
Buttons say what they do: "Copy memo", "Show Line 3".
