# AI Build Prompt

Use the following as the primary instruction when giving this specification folder to an AI design or coding agent.

---

You are building the **Home / Campus Command Overview** for an enterprise Building Management System (BMS) / SCADA platform.

This repository/folder contains the complete product and UX specification for the screen.

## Your first task

Before designing or coding anything:

1. Read `README.md`.
2. Then read all specification files in the exact order below:
   - `01_PRODUCT_INTENT.md`
   - `02_INFORMATION_ARCHITECTURE.md`
   - `03_CROSS_FILTERING_AND_NAVIGATION.md`
   - `04_SYSTEM_CARDS_AND_OPERATIONAL_SIGNATURES.md`
   - `05_OPERATIONAL_BRIEFING.md`
   - `06_QUICK_INSPECT.md`
   - `07_STATES_AND_EDGE_CASES.md`
   - `08_VISUAL_SYSTEM_AND_ACCESSIBILITY.md`
   - `09_DATA_AND_COMPONENT_CONTRACTS.md`
   - `10_ACCEPTANCE_CRITERIA.md`
3. Treat those files as one connected specification, not independent suggestions.
4. Do not begin implementation after reading only one or two files.
5. If the project already contains an existing BMS/SCADA UI, inspect it and preserve the established navigation, layout language, component conventions, and visual identity where they do not conflict with this specification.

## What you are building

Build a production-grade **Campus Command Overview** that becomes the default Home screen of the BMS.

The campus contains Delta 1 through Delta 11 plus a Parking Plaza.

The screen must provide campus-wide awareness across systems such as:

- HVAC
- Lighting
- Energy
- Solar
- Generators
- Fire Alarm
- Fire Fighting
- Water
- CCTV
- Public Address
- Access Control
- Parking
- Occupancy
- Network / BMS

The core interaction model is:

**Campus Overview → Cross-filter → Quick Inspect → Full Module**

The homepage must help operators understand the whole campus without forcing them into individual modules unless deeper investigation is necessary.

## Required primary regions

Implement/design:

1. Existing global header/sidebar integration
2. Campus title + live freshness state
3. Compact global campus summary
4. Persistent Scope Bar
5. Interactive Campus Digital Twin
6. Health / Occupancy / Energy / Alarms visualization layers
7. Cross-filtering by Building and System
8. System Overview using standardized card archetypes
9. Operational Briefing right rail
10. Quick Inspect that replaces the Operational Briefing rail
11. Life-safety escalation behavior
12. Loading, warning, critical, offline, no-data, stale, partial-data, and connection-loss states

## Non-negotiable interaction rules

- Building click filters the dashboard. It does not immediately navigate away.
- System-card click applies the system filter and opens Quick Inspect.
- Cross-filtering works in both directions:
  - Building → System
  - System → Building
- Scope is always visible.
- Quick Inspect inherits scope.
- Quick Inspect is read-only.
- Direct equipment controls remain inside detailed modules.
- No Data must never be shown as Normal.
- Critical life-safety events override lower-priority visual hierarchy.
- Selection styling must not hide severity.
- The full module opens only after explicit operator intent.

## How to use the files while working

Do not memorize the whole specification and then ignore the source files.

Use the documents by concern:

- Product purpose / non-goals:
  `01_PRODUCT_INTENT.md`

- Layout / page regions / Digital Twin:
  `02_INFORMATION_ARCHITECTURE.md`

- Filtering / navigation / scope behavior:
  `03_CROSS_FILTERING_AND_NAVIGATION.md`

- Card types / system summary content:
  `04_SYSTEM_CARDS_AND_OPERATIONAL_SIGNATURES.md`

- Right rail / prioritization / critical escalation:
  `05_OPERATIONAL_BRIEFING.md`

- Drawer behavior and module inspection:
  `06_QUICK_INSPECT.md`

- Loading / errors / telemetry uncertainty / edge cases:
  `07_STATES_AND_EDGE_CASES.md`

- Visual styling / accessibility / motion:
  `08_VISUAL_SYSTEM_AND_ACCESSIBILITY.md`

- Data structures and component contracts:
  `09_DATA_AND_COMPONENT_CONTRACTS.md`

- Final validation:
  `10_ACCEPTANCE_CRITERIA.md`

If implementation exposes a conflict or ambiguity, re-open the relevant files and resolve it using the precedence rules in `README.md`.

## Implementation approach

Work in this order:

### Phase 1: Understand
- Inspect the current project structure.
- Identify the existing sidebar, header, theme, tokens, routes, and reusable components.
- Identify how current BMS modules are represented.
- Map existing data sources if available.
- Do not redesign unrelated modules.

### Phase 2: Architecture
Define:
- page grid
- Scope state
- Digital Twin state
- system-card component API
- Quick Inspect state
- Operational Briefing state
- data freshness model
- severity/status model

### Phase 3: Build the healthy/default state
Create:
- Campus / All Systems
- normal campus
- system cards
- Digital Twin
- Operational Briefing
- scope controls

### Phase 4: Build filtering
Implement:
- building selection
- system selection
- combined scope
- clear filters
- filtered building tooltips
- system-aware Digital Twin

### Phase 5: Build Quick Inspect
Implement consistent Quick Inspect patterns for at least:
- HVAC
- Fire Alarm
- Fire Fighting
- Solar
- CCTV
- Parking

### Phase 6: Build abnormal states
Implement:
- warning
- critical
- life-safety event
- offline
- no data
- stale
- partial telemetry
- backend connection loss
- alarm storm grouping

### Phase 7: Validate
Review every item in `10_ACCEPTANCE_CRITERIA.md`.

Do not consider the feature complete while major acceptance criteria remain unresolved.

## Visual direction

The final product should feel like an advanced industrial command center, not a generic SaaS admin panel.

Preserve the current dark SCADA aesthetic while improving:

- hierarchy
- readability
- calmness
- semantic color usage
- information density
- spatial context
- progressive disclosure

Use restrained motion and avoid decorative complexity.

## Deliverables

At minimum, produce:

- Default Campus / All Systems state
- Building-filtered state
- System-filtered state
- Building + System filtered state
- Building hover tooltip
- Five system-card archetypes
- Operational Briefing
- Quick Inspect
- Warning scenario
- Critical Fire Alarm scenario
- Offline / No Data / Stale states
- Loading and backend-disconnected states

If building code, ensure architecture is reusable and driven by data/configuration rather than hard-coded one-off module cards.

## Final rule

The Home screen does not need every detail available in the BMS.

It must contain:

**everything required to decide where to look next.**

Before finalizing, verify the result against `10_ACCEPTANCE_CRITERIA.md`.

---
