# Operational Briefing

## Purpose

The right rail is an **Operational Briefing**, not another raw alarm log.

It should answer:

- What requires attention right now?
- Where?
- Which system?
- How severe?
- How long has it been active?
- Is it acknowledged?
- Is it resolved?
- What should I inspect next?

## Default position

The Operational Briefing remains visible in the right rail whenever Quick Inspect is closed.

## Suggested sections

- Critical
- Attention
- Maintenance
- Information
- Recently Resolved

Do not render empty sections unnecessarily.

## Example

OPERATIONAL BRIEFING

### ATTENTION

HVAC  
Delta 4

2 AHUs unavailable  
Oldest condition: 23 min

`INSPECT`

CCTV  
Delta 9

4 cameras offline  
East Wing group

`INSPECT`

### RECENTLY RESOLVED

Fire Fighting  
Delta 3

Header pressure restored  
8 min ago

## Priority model

Do not sort only by newest.

Suggested priority:

1. Life-safety critical event
2. Critical system failure
3. Multi-asset degradation
4. Single major equipment fault
5. Communication failure / No Data
6. Maintenance condition
7. Informational operational change
8. Recently resolved

Within the same severity, consider:

- event age
- acknowledgment
- affected asset importance
- number of assets
- building importance
- SLA/response threshold

## Scope inheritance

The briefing must obey current scope.

### Campus / All Systems
Show campus-wide relevant items.

### Delta 4 / All Systems
Show Delta 4 items only.

### Campus / HVAC
Show HVAC items across all buildings.

### Delta 4 / HVAC
Show only Delta 4 HVAC items.

Make filtered context obvious.

## Grouping and alarm storms

Do not list dozens of repetitive events.

Group related events by:

- system
- building
- common fault/root cause
- asset group
- short time window

Example:

HVAC  
Delta 4

12 FCUs reporting communication loss

`VIEW 12 EVENTS`

Do not group unique critical life-safety incidents into an ambiguous generic item.

## Acknowledgment

Distinguish:

- Unacknowledged
- Acknowledged
- Resolved

Acknowledged does not mean resolved.

Example:

CRITICAL  
Acknowledged by M. Ali  
10:44

Still Active

Severity must not be reduced merely because someone acknowledged it.

## Recently resolved

Keep recent recovery information visible but subordinate to active issues.

Examples:

- pressure restored
- controller returned online
- camera communication restored
- AHU restarted

Do not allow resolved events to dominate the rail.

## Empty briefing

If there are no active issues:

`NO ACTIVE CRITICAL EVENTS`

Then optionally show:

- scheduled maintenance
- small informational items
- recently resolved conditions

The right rail should still feel useful in the healthy state.

## Life-safety escalation

A critical life-safety event must immediately take priority.

Example:

CRITICAL ALARM

DELTA 7  
FIRE ALARM

Smoke Detector SD-7F2-034  
Floor 2 · East Corridor

Activated: 10:42:16  
Active for: 03:42

`VIEW INCIDENT →`

During life-safety escalation:

- relevant building is highlighted,
- relevant system card escalates,
- briefing prioritizes the incident,
- non-critical content recedes,
- clear path to incident/module is provided,
- rest of the campus remains accessible.

Do not auto-navigate away unless an explicit product rule later requires it.
