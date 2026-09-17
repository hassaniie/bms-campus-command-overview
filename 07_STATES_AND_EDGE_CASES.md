# States and Edge Cases

## Status vocabulary

Support distinct states:

- Normal
- Attention
- Warning
- Critical
- Maintenance
- Offline
- No Data
- Stale
- Disabled
- Unknown
- Partial Data
- Not Installed
- Restricted

Do not collapse these into only green/orange/red.

## Definitions

### Normal
Healthy state confirmed by valid, fresh telemetry.

### Offline
A known asset/system is unavailable or disconnected.

### No Data
Expected telemetry is absent.

### Stale
Telemetry exists but is older than the defined freshness threshold.

### Disabled
Asset is intentionally disabled, isolated, or taken out of service.

### Unknown
The system cannot confidently determine the state.

### Partial Data
Some telemetry is valid but the overall state is incomplete.

### Not Installed
The selected module does not exist in this building/scope.

### Restricted
The user is allowed to know the module exists but lacks detailed access.

## Data freshness

Possible labels:

- `Updated 2 sec ago`
- `Updated 18 sec ago`
- `Stale · 2 min`
- `No Data`
- `Connection Lost`

If only one system is stale, do not mark the whole campus disconnected.

## Initial loading

During initial load:

- preserve page geometry,
- use skeletons/placeholders,
- show telemetry as loading,
- do not show Normal before actual data arrives.

Digital Twin geometry can appear before telemetry.

Example card:

HVAC  
Loading telemetry…

## Partial telemetry

Example:

HVAC

120 Operational  
4 Offline  
8 No Data

`ATTENTION · Partial telemetry`

Do not derive a misleading health percentage from incomplete data.

## Total backend connection loss

Keep last known data visible if technically possible, but clearly mark it as stale.

Example:

CONNECTION LOST

Last reliable data: 10:42:18

DO NOT PRESENT THIS DATA AS LIVE.

Avoid blanking the whole interface if cached context remains useful.

## No active events

The briefing can show:

`NO ACTIVE CRITICAL EVENTS`

Then maintenance/recently-resolved items if available.

## Solar at night

0 kW is expected.

Use:

SOLAR  
● NORMAL

0 kW  
CURRENT GENERATION

Sunset: 18:21  
System available

Do not show Warning/Offline merely because production is zero.

## Generator standby

0 kW may be healthy if the generator is Ready/Standby.

Use readiness state, not output alone.

## Pump / water systems

0 flow may be correct if the pump is idle.

Interpret values based on operating mode.

## Empty occupancy

0 people may be expected after hours.

Do not show an alarm unless a configured occupancy rule is violated.

## Module not installed

Example:

PARKING  
Not installed in Delta 3

`VIEW CAMPUS PARKING`

Do not use Offline.

## Restricted module

Example:

CCTV  
Restricted

Summary available  
Detailed access unavailable

Full-module action should be hidden or disabled according to permissions.

## Building completely disconnected

Example tooltip:

DELTA 2  
OFFLINE

Building controller unavailable

Last communication: 10:32:14

Do not imply individual subsystems are confirmed healthy.

## Building with partial telemetry

DELTA 2  
ATTENTION  
Some data unavailable

HVAC: Normal  
Lighting: No Data  
Fire Alarm: Normal

## Alarm storm

Group repetitive events.

Example:

HVAC  
Delta 4

12 FCUs reporting communication loss

`VIEW 12 EVENTS`

Avoid listing 12 identical briefing cards.

Unique high-severity incidents should remain distinct.

## Acknowledged but active

Example:

CRITICAL  
Acknowledged by M. Ali  
10:44

Still Active

Acknowledgment does not reduce severity.

## Multiple simultaneous issues

The page must handle:

- multiple warning buildings,
- multiple systems affected,
- one critical + several warnings,
- critical life-safety event while telemetry is degraded elsewhere.

Critical items receive priority without completely hiding secondary issues.

## Card interaction states

Support:

- default
- hover
- focus
- selected
- warning
- critical
- maintenance
- offline
- no data
- stale
- partial data
- disabled
- not installed
- restricted

## Digital Twin states

Support:

- default
- hover building
- selected building
- filtered-system mode
- warning building
- critical building
- offline building
- no-data building
- multiple affected buildings

Selection must not remove campus geography.

## Live telemetry changes

When values update:

- avoid reshuffling layout,
- update numbers smoothly,
- give brief state-change feedback,
- do not continuously animate healthy states.

New critical events should visibly escalate.

## Resolved events

Recently resolved items can remain visible briefly.

Examples:

- pressure restored
- controller returned online
- camera communication restored
- AHU restarted

They remain secondary to active events.

## Lower-resolution behavior

At smaller supported desktop resolutions, preserve in this order:

1. critical state
2. Operational Briefing / Quick Inspect
3. Digital Twin
4. System Overview
5. secondary context

Do not convert the entire interface into a generic mobile card stack.
