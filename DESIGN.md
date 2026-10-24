---
name: Last Mile
description: Offline, finance-ready shuttle planning for Pune Metro's Kharadi last mile.
colors:
  concrete: "#E6EAEC"
  slate: "#1E2B33"
  mist: "#65747D"
  paper: "#F7F9F9"
  aqua: "#14A3B8"
  purple: "#6B4FA0"
  pink: "#D6418A"
  amber: "#F2B200"
  amber-ink: "#1E2B33"
  switch: "#1F8A5B"
  stay: "#B5473A"
typography:
  display:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
rounded:
  control: "0.35rem"
spacing:
  compact: "0.5rem"
  regular: "1rem"
  section: "clamp(1.5rem, 3vw, 3rem)"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.slate}"
    rounded: "{rounded.control}"
    padding: "0.65rem 1rem"
    height: "2.75rem"
---

# Design System: Last Mile

## Overview

**Creative North Star: "The Transit Operations Board."**

Last Mile is a sober, projector-legible planning instrument for a finance and transport conversation, not a consumer journey planner. It borrows its structure from Pune transit signage: cool concrete ground, crisp schematic lines, and a single emphatic amber shuttle loop that turns the map into a decision.

Density serves inspection. The map is the visual hero; controls, results, recommendation, and assumptions remain direct and left-aligned so every claim can be checked. Synthetic data and uncertain inputs are stated plainly.

**Key Characteristics:**
- Transit-diagram geometry, not geographic-map realism.
- One amber operational signal: the Ramwadi–Kharadi shuttle and primary action.
- Finance-facing clarity through tabular figures, semantic verdict colour, and visible assumptions.

## Colors

Cool civic neutrals make the operational line colours easy to scan on a laptop or projector.

### Primary

- **Auto-rickshaw Amber** (`#F2B200`): the company shuttle loop and primary action only.
- **Metro Aqua** (`#14A3B8`): active Line 2 and focused station state.
- **Metro Purple** (`#6B4FA0`): Line 1.
- **What-if Pink** (`#D6418A`): Line 3; dashed while unavailable and solid when enabled.

### Neutral

- **Concrete Ground** (`#E6EAEC`): page surface.
- **Slate Ink** (`#1E2B33`): text, station marks, chart base, and shuttle casing.
- **Mist** (`#65747D`): supporting text and de-emphasized labels.
- **Paper** (`#F7F9F9`): map field and high-clarity surfaces.

### Named Rules

**The One Amber Rule.** Amber appears only on the shuttle route and the one primary action, so it always means company-operated last mile.

**The Verdict Rule.** Green means a switcher; brick red means a cab remains. Labels and tooltips carry the meaning as well as the colour.

## Typography

**Display Font:** Overpass, with a system sans fallback.

**Marathi Font:** Mukta for Devanagari station names.

**Character:** Overpass carries the transit-signage voice: compact, plain, and legible in dense operational views. All numeric data uses tabular figures.

### Hierarchy

- **Display** (800, `clamp(1.5rem, 2.5vw, 2.25rem)`, 1.05): product heading only.
- **Title** (600, `1.0625rem`): section and panel headings.
- **Body** (400, `0.9375rem`, 1.65): memo content at a readable measure of up to 72ch.
- **Label** (600, `0.8125rem`): controls, rail labels, and small supporting copy.
- **Metric** (800, `clamp(2.4rem, 5vw, 3.5rem)`, 0.9): switcher count, never a generic marketing hero.

## Layout

The desktop shell is a 1.85:0.85 map-and-rail grid inside a 1600px maximum width. The map remains the main field; planning controls and results occupy the right rail. Memo and assumptions span the full width below it. Section padding uses `clamp(1.5rem, 3vw, 3rem)`.

At 850px and below, the rail stacks below the map. At 600px and below, map heading and legend stack and the map remains at least 430px tall. Tables scroll within their own container rather than widening the document.

## Elevation & Depth

The system is flat and uses 1px hairlines to organize analytical material. The map field is a bounded paper surface rather than an elevated card; surrounding panels likewise avoid repeated shadows.

## Shapes

Transit geometry is mostly square and round: straight 0/45/90-degree routes, circular stations, squared data bars, and only a small `0.35rem` radius on the primary button and chart bars. Pills are reserved for no control in this product.

## Components

### Planning controls

- **Style:** native radio, checkbox, and range inputs retain familiar operating-system affordances with slate and aqua semantic accents.
- **Disabled state:** the headway slider visibly dims and becomes unavailable in PMPML-only mode.
- **Focus:** aqua focus outlines remain visible for keyboard navigation.

### Results rail

- **Character:** compact decision ledger rather than a collection of cards.
- **Metrics:** a single switcher count is the rail anchor; savings, buses, and CO₂ use aligned key/value rows.
- **Frequency chart:** slate bars compare all options, green marks the recommendation, and a slate outline identifies the selected setting.

### Primary button

- **Shape:** compact `0.35rem` corners with a 44px minimum hit area.
- **Primary:** amber fill with slate text; label states the action directly.
- **Active:** scales to 96% with a 150ms transition.

### Assumptions table

- **Style:** hairline row dividers, tabular values, and source/confidence columns.
- **Confidence:** low-confidence values use brick red text so contractual inputs are visibly provisional.

### Signature shuttle route

- **Style:** a 10px amber route over a 14px slate casing, ending in an 18px arrowhead.
- **Motion:** draws once on load; the slate marker travels it once. Reduced-motion users see the complete static route.

## Do's and Don'ts

### Do:

- **Do** keep the schematic map as the main visual field.
- **Do** show assumptions, sources, and confidence beside any planning conclusion.
- **Do** use the vendored Overpass and Mukta fonts and tabular figures for all numeric UI.
- **Do** use a local SVG map and local data only so the decision tool works offline.

### Don't:

- **Don't** use cream or beige grounds, gradients, decorative stock imagery, or generic dashboard cards.
- **Don't** use amber for secondary emphasis, status, or unrelated controls.
- **Don't** rely on colour alone for commuter verdicts or Line 3 availability.
- **Don't** turn a calculated recommendation into a promise or hide that the workforce data is synthetic.
