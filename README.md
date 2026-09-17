# BMS Campus Command Overview

This folder is the source-of-truth specification for the **Home / Campus Command Overview** of an enterprise Building Management System (BMS) / SCADA platform.

The screen is the default landing experience for operators and should answer, at a glance:

1. Is the campus operating normally?
2. What requires attention?
3. Where is the problem?
4. Which system is affected?
5. How severe is it?
6. Can it be understood without opening the full module?
7. If not, where should the operator go next?

The core interaction model is:

**Campus Overview → Cross-filter → Quick Inspect → Full Module**

This homepage is primarily for monitoring, awareness, triage, discovery, and investigation. It is **not** intended to become a direct equipment-control screen.

## Campus scope

The campus contains:

- Delta 1
- Delta 2
- Delta 3
- Delta 4
- Delta 5
- Delta 6
- Delta 7
- Delta 8
- Delta 9
- Delta 10
- Delta 11
- Parking Plaza

The BMS includes systems such as:

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
- Occupancy / People Counting
- Network / BMS Controllers
- Future modules

## Design principles

- Exception-first, not KPI-first.
- Healthy systems should feel calm.
- Critical conditions should dominate attention immediately.
- **No Data ≠ Normal.**
- Operators must always know the current scope and data freshness.
- The interface must preserve campus geography and spatial awareness.
- Cross-filtering should happen before full-page navigation.
- Use progressive disclosure rather than displaying every metric at once.
- Keep controls inside detailed modules unless explicitly approved later.
- Preserve industrial SCADA character rather than turning the product into a generic SaaS dashboard.

## File map and reading order

Read these files in order:

1. `01_PRODUCT_INTENT.md`  
   Product purpose, users, mental model, and non-goals.

2. `02_INFORMATION_ARCHITECTURE.md`  
   Page layout, major regions, hierarchy, scope bar, Digital Twin, and system overview.

3. `03_CROSS_FILTERING_AND_NAVIGATION.md`  
   Building/system filtering, navigation rules, filter inheritance, return context.

4. `04_SYSTEM_CARDS_AND_OPERATIONAL_SIGNATURES.md`  
   Five card archetypes, module signatures, card anatomy, content limits.

5. `05_OPERATIONAL_BRIEFING.md`  
   Right rail, prioritization, grouping, resolved items, life-safety escalation.

6. `06_QUICK_INSPECT.md`  
   Read-only inspection drawer, layout, interactions, inheritance, module examples.

7. `07_STATES_AND_EDGE_CASES.md`  
   Loading, stale/no-data/offline, partial telemetry, alarm storms, zero values, permissions, connection loss.

8. `08_VISUAL_SYSTEM_AND_ACCESSIBILITY.md`  
   SCADA visual direction, color semantics, typography, iconography, accessibility, motion.

9. `09_DATA_AND_COMPONENT_CONTRACTS.md`  
   UI-facing data contracts for module summaries, briefing items, buildings, freshness, and state handling.

10. `10_ACCEPTANCE_CRITERIA.md`  
    Functional, UX, safety, and design checks before considering the screen complete.

11. `AI_BUILD_PROMPT.md`  
    The execution prompt to give an AI design/coding agent. It explains how to read and apply all other files.

## Source-of-truth and precedence

If requirements appear to conflict, use this order of precedence:

1. Safety / life-safety behavior in `05_OPERATIONAL_BRIEFING.md` and `07_STATES_AND_EDGE_CASES.md`
2. Product intent in `01_PRODUCT_INTENT.md`
3. Interaction rules in `03_CROSS_FILTERING_AND_NAVIGATION.md`
4. Data/state rules in `09_DATA_AND_COMPONENT_CONTRACTS.md`
5. Layout and visual decisions in the remaining files

Do not silently invent missing safety-critical behavior. If a missing requirement would materially change operator workflow, surface the ambiguity explicitly before implementation.

## Primary target

- Desktop SCADA workstation
- Primary design target: **1920 × 1080**
- Also support: 1600 × 900, 1440 × 900, 1366 × 768
- Do not redesign this as a mobile-first application

## Definition of success

The screen is successful if an operator can determine within a few seconds:

- whether the campus is normal,
- whether anything requires attention,
- the affected building,
- the affected system,
- the severity,
- whether data is fresh,
- and whether deeper investigation is necessary.
