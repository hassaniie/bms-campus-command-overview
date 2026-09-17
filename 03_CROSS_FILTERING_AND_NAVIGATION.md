# Cross-Filtering and Navigation

## Core principle

The homepage should filter before it navigates.

Two dimensions drive scope:

1. Building
2. System

These can be selected in either order.

## Default scope

`Campus / All Systems`

## Workflow A: Building → System

1. User clicks Delta 4.
2. Scope becomes `Delta 4 / All Systems`.
3. System cards update to Delta 4.
4. Operational Briefing updates to Delta 4.
5. Digital Twin emphasizes Delta 4.
6. User clicks HVAC.
7. Scope becomes `Delta 4 / HVAC`.
8. HVAC Quick Inspect opens.
9. Digital Twin reflects HVAC status.
10. Briefing/inspection content becomes Delta 4 HVAC specific.

## Workflow B: System → Building

1. User clicks HVAC.
2. Scope becomes `Campus / HVAC`.
3. HVAC Quick Inspect opens.
4. Digital Twin compares HVAC across all buildings.
5. User clicks Delta 4.
6. Scope becomes `Delta 4 / HVAC`.
7. Quick Inspect immediately updates to Delta 4 HVAC.

## System-selected Digital Twin

When a system is selected, building indicators should communicate that system's state.

Example for `Campus / HVAC`:

- Delta 1: Healthy
- Delta 2: Healthy
- Delta 3: 1 Warning
- Delta 4: 2 Faults
- Delta 5: Healthy

The campus geography must remain visible.

## Filter inheritance

All relevant surfaces should inherit current scope:

- top summary where useful
- Digital Twin
- building tooltip
- system cards
- Operational Briefing
- Quick Inspect

Never show a campus-wide Quick Inspect while the Scope Bar says Delta 4.

## Clearing filters

Provide intuitive ways to return to:

`Campus / All Systems`

Supported actions:

- Clear Filters
- remove building chip
- remove system chip
- click Campus
- use Home overview shortcut

Removing a filter must not unexpectedly navigate away.

## Unsupported building/system combination

Some systems do not exist in every building.

Example:

`Delta 3 / Parking`

If Parking is not installed in Delta 3:

Show:

`Parking`
`Not available in Delta 3`

Provide a useful next path, such as:

`VIEW CAMPUS PARKING`

Do not show a misleading zero or Offline state.

## Full module navigation

Open a full module only when the operator explicitly requests deeper investigation.

Examples:

- `OPEN HVAC MODULE →`
- `OPEN FIRE ALARM →`
- `VIEW INCIDENT →`
- `VIEW ENERGY ANALYTICS →`

Preserve context where possible.

Example:

If current scope is `Delta 4 / HVAC`, opening HVAC should ideally open the HVAC module already focused on Delta 4.

## Return behavior

When returning from a full module, preserve useful context where possible.

Example:

The operator returns from Delta 4 HVAC and sees:

`Delta 4 / HVAC`

Do not silently reset to campus-wide state unless that is an explicit product decision.

## Layer controls vs scope

Digital Twin layers such as Health, Occupancy, Energy, and Alarms are visualization modes, not equivalent to the system scope.

For example:

Scope: `Campus / All Systems`  
Layer: `Occupancy`

The Scope Bar must remain unchanged.

## Card click behavior

Clicking a module card should:

1. apply the system filter,
2. open Quick Inspect,
3. keep the operator on the home screen.

Do not immediately redirect to the full module.

## Hover behavior

- Hovering a building = lightweight contextual tooltip
- Hovering a card = normal interactive state
- Hover does not open Quick Inspect
- Hover does not alter the permanent scope

Quick Inspect should require an intentional click.

## Selection vs severity

Selection uses the interaction color, such as cyan.

Severity remains semantically visible.

A selected critical module is still clearly critical. Selection styling must not hide severity.
