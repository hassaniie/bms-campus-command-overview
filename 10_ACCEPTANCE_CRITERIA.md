# Acceptance Criteria

Use this file as the final review checklist before calling the Campus Command Overview complete.

## Core operator comprehension

An operator should be able to determine within approximately five seconds:

- whether the campus is normal,
- whether anything requires attention,
- whether a life-safety event exists,
- which building is affected,
- which system is affected,
- the severity,
- whether data is fresh.

## Cross-filtering

- Building selection updates relevant page content.
- System selection updates relevant page content.
- Building → System works.
- System → Building works.
- Scope is always visible.
- Filters can be cleared easily.
- Unsupported building/system combinations are handled explicitly.
- Selection does not destroy campus geography.

## Digital Twin

- Delta 1–11 and Parking Plaza remain identifiable.
- Healthy buildings remain visually calm.
- Warning and critical states are distinguishable.
- Offline and No Data are distinguishable.
- Building hover provides useful but concise context.
- Building click filters rather than immediately navigating.

## System cards

- Cards belong to one coherent component family.
- Each card uses one of the five archetypes.
- Each card stays within the information budget.
- Selection does not hide severity.
- Units are explicit.
- Zero values are interpreted contextually.
- Not Installed is not represented as Offline.
- Partial telemetry is not presented as fully healthy.

## Operational Briefing

- Briefing is not a duplicate raw alarm list.
- Priority is operational, not purely chronological.
- Life-safety critical events appear first.
- Repetitive events can be grouped.
- Acknowledged active events remain active.
- Recently resolved items are subordinate to active issues.
- Briefing respects current scope.
- Healthy state is still informative.

## Quick Inspect

- Opens without leaving Home.
- Replaces the Operational Briefing rail.
- Inherits current scope.
- Provides enough information to decide whether deeper investigation is necessary.
- Contains no direct equipment controls.
- Includes explicit path to the full module.
- Handles warning, critical, stale, no-data, and not-installed states.

## State handling

The design includes clear behavior for:

- normal
- warning
- critical
- maintenance
- offline
- no data
- stale
- disabled
- unknown
- partial data
- initial loading
- backend connection loss
- alarm storm
- zero values
- no events
- recently resolved
- restricted access
- module not installed

## Data trust

- No Data is never treated as Normal.
- Stale values are clearly marked.
- Cached/last-known values are not presented as live.
- Partial telemetry is communicated.
- Aggregate percentages do not hide uncertainty.

## Navigation

- Full module navigation is explicit.
- Current building/system context is preserved where possible.
- Returning to Home should not unexpectedly discard useful scope.
- Home is not used for direct start/stop/reset operations.

## Visual system

- Industrial SCADA character is preserved.
- Critical red remains rare and meaningful.
- Healthy states do not dominate visually.
- Cyan selection styling does not replace severity.
- Text remains legible at supported desktop resolutions.
- Important meaning is not encoded by color alone.
- Motion is restrained.
- Dense information remains aligned and scan-friendly.

## Life-safety scenario test

Given:

- Fire Alarm critical in Delta 7
- two HVAC warnings elsewhere
- one CCTV degradation elsewhere

The operator must immediately understand:

- Fire Alarm is the highest-priority condition.
- Delta 7 is the affected building.
- exact incident location is available.
- activation time/duration is visible.
- a direct View Incident/Open Fire Alarm path exists.
- other warnings remain accessible but visually secondary.

## Healthy scenario test

Given:

- zero critical alarms
- zero warnings
- small maintenance items
- all core telemetry available

The screen should still provide:

- campus status
- occupancy
- energy demand
- system summaries
- Digital Twin
- maintenance awareness
- recent resolved information if available

Do not fill the healthy screen with unnecessary decoration.

## Scalability

The design should support:

- future buildings,
- future modules,
- role-based prioritization,
- additional Digital Twin layers,
- wallboard/video-wall variants,
- new Operational Signature configurations,

without requiring a full redesign of the Home architecture.
