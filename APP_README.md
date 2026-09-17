# Campus Command Overview — Application

Production-quality interactive front-end for the **BMS / SCADA Campus Command
Overview** specified in this repository. The 12 Markdown specs (`README.md`,
`AI_BUILD_PROMPT.md`, `01`–`10`) remain the source of truth; this app implements
them.

> The Home screen does not need every detail in the BMS. It needs **everything
> required to decide where to look next.**

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS v3** (dark SCADA token system in `tailwind.config.js`)
- **lucide-react** icons
- No heavyweight UI framework — everything is config/data-driven.

## Run

```bash
npm install
npm run dev        # dev server → http://localhost:5173
npm run build      # typecheck (tsc -b) + production build → dist/
npm run preview    # serve the production build
npm run typecheck  # types only
```

Desktop control-room targets: **1920×1080** (primary), 1600×900, 1440×900,
1366×768. Not a mobile-first layout.

## Demo scenarios

A subtle **Demo** switcher in the header (dev affordance, intentionally muted)
cycles the full set of states, each a patch over a healthy baseline:

| Scenario | Demonstrates |
|---|---|
| **Normal** | 0 critical / 0 warning, 954 people, 485 kW, 2 maintenance, resolved items |
| **Warning** | Delta 4 HVAC (2 AHUs), Delta 9 CCTV (4 cameras), Delta 3 water pressure |
| **Critical** | Life-safety Fire Alarm — Delta 7 · Floor 2 · East Corridor · SD-7F2-034 |
| **Data Degraded** | Delta 2 controller offline, stale module, partial telemetry, alarm storm (12 FCUs) |
| **Connection Lost** | Whole feed stale, last-known values, never presented as live |

Each scenario change also exercises the **initial loading / skeleton** phase.

## Architecture

```
src/
  types/            Data contracts (09): ModuleSummary, AttentionItem, Building/CampusSummary, Scope
  config/
    buildings.ts    Delta 1–11 + Parking Plaza, isometric plan geometry, installed systems
    modules.ts      14-system registry (icon, archetype, group, freshness) + groupings
  lib/
    status.ts       Single source of truth: 13-state vocabulary → glyph+icon+color+rank
    briefing.ts     Operational priority sort + severity sectioning + life-safety pick
    time.ts/format.ts
  data/
    rng.ts          Deterministic seeded telemetry helpers
    generator.ts    Backend stand-in: healthy baseline + campus roll-ups (explicit counts)
    scenarios.ts    The 5 demo scenarios as patches over the baseline
  state/
    DashboardContext.tsx   Scope + phase + quick-inspect reducer
    selectors.ts    Pure scoped views (modules, briefing, twin-per-layer, campus summary)
    useClock.ts     1 Hz clock for live durations / freshness (localized re-renders)
  components/
    layout/         Sidebar, Header (measurable campus state), DevScenarioSwitcher, AppShell
    overview/       PageTitle + freshness, CampusSummaryStrip, ScopeBar
    twin/           DigitalTwin (isometric SVG), BuildingShape, tooltip, layers, legend
    systems/        SystemCard shell + 5 archetype bodies (state/fleet/process/production/capacity)
    briefing/       RightRail, OperationalBriefing, BriefingItem, LifeSafetyBanner
    inspect/        QuickInspect (read-only, module-aware)
    common/         StatusBadge, Sparkline, Skeleton, FreshnessIndicator, LiveTime
```

### Interaction model — `Campus Overview → Cross-filter → Quick Inspect → Full Module`

- **Scope** is a flat object `{ buildingId?, systemId?, layer }`, so cross-filter
  works in **both directions** (Building→System and System→Building) for free.
- **Building click** filters (does not navigate); **system-card click** applies
  the system filter **and** opens Quick Inspect, staying on Home.
- **Quick Inspect replaces** the Operational Briefing rail and **inherits scope**;
  closing restores the briefing and keeps the system filter.
- **Digital Twin layers** (Health / Occupancy / Energy / Alarms) are visualization
  modes and never change the Scope Bar.
- **Selection** uses cyan but **never hides severity**.

### Key principles enforced in code

- **No Data ≠ Normal** — the status vocabulary keeps all 13 states distinct; a
  single building's outage rolls up to **partial**, never a false campus "No Data",
  and incomplete data never reads as healthy (`aggregateStatus` in `generator.ts`).
- **Explicit counts, not fabricated health %** — campus cards sum real building
  telemetry.
- **Life-safety override** — a critical life-safety event escalates the briefing
  (banner), the building, and the system card while the rest of the campus recedes
  but stays accessible.
- **Freshness is always visible** and never claims LIVE when stale.
- **Read-only** — no start/stop/reset/override anywhere on Home.

## Replacing the mock backend

`src/data/generator.ts` is the single integration seam. Swap `buildBaseState`
(and the scenario patches) for real API calls that satisfy the contracts in
`src/types/index.ts` (mirrors `09_DATA_AND_COMPONENT_CONTRACTS.md`); every
component consumes those contracts, so no UI changes are required.

## Known limitations (prototype)

- Telemetry is deterministic mock data; the "full module" CTAs and sidebar nav
  items are placeholders (this repo scopes the Home screen only).
- Trends/sparklines use representative generated series.
- `disabled` / `unknown` / `restricted` states are fully implemented in the status
  system and components but are not wired into a dedicated demo scenario.
