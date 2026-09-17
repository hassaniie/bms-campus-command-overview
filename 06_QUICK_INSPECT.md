# Quick Inspect

## Purpose

Quick Inspect is the bridge between the overview and the full module.

It provides enough read-only detail for an operator to decide whether deeper investigation is necessary.

## Placement

Quick Inspect replaces the right-side Operational Briefing rail.

Do not open an additional third column.

Normal state:

`Main Workspace | Operational Briefing`

Inspecting state:

`Main Workspace | Quick Inspect`

Closing Quick Inspect restores the briefing.

## Opening behavior

Clicking a system card should:

1. apply/select that system scope,
2. open Quick Inspect,
3. remain on the Home screen.

## Scope inheritance

Quick Inspect must always inherit the current scope.

Examples:

`Campus / HVAC` → HVAC Quick Inspect for entire campus

`Delta 4 / HVAC` → HVAC Quick Inspect for Delta 4

If Delta 4 is removed while the drawer is open, the drawer should immediately update to campus-wide HVAC.

## Standard structure

A Quick Inspect panel should generally contain:

1. Module name
2. Current scope
3. Overall status
4. Primary Operational Signature
5. State/fleet breakdown
6. Needs Attention section
7. Optional recent trend / last 24h context
8. Explicit path to full module

## HVAC example

HVAC  
Campus  
● GOOD

124 / 132  
Operational

Running: 124  
Standby: 4  
Fault: 2  
Offline: 2

### NEEDS ATTENTION

AHU-04  
Delta 4  
Communication lost  
12 min

AHU-06  
Delta 4  
Temperature fault  
8 min

### LAST 24 HOURS

Availability: 98.6%  
Energy: 624 kWh  
Alarms: 4

`OPEN HVAC MODULE →`

## Fire Alarm example

FIRE ALARM  
Campus  
● NORMAL

No Active Fire Alarms

Faults: 0  
Isolated Devices: 2

### ISOLATED DEVICES

Delta 5 · Detector SD-5F1-022  
Maintenance isolation

Delta 8 · MCP-08-014  
Scheduled service

`OPEN FIRE ALARM MODULE →`

If critical:

FIRE ALARM  
Delta 7  
● CRITICAL

1 Active Alarm

Smoke Detector SD-7F2-034  
Floor 2 · East Corridor

Activated: 10:42:16  
Active for: 03:42

`VIEW INCIDENT →`

## Fire Fighting example

FIRE FIGHTING  
Campus  
● GOOD

8.1 bar  
Main Header Pressure

Pumps Ready: 9 / 9  
Lowest Tank: 74%

### NEEDS ATTENTION

Delta 3  
Jockey Pump cycling frequency above normal

`OPEN FIRE FIGHTING MODULE →`

## Solar example

SOLAR  
Campus  
● GOOD

136 kW  
Current Generation

Today: 1.24 MWh  
Inverters: 12 / 12 Online

If nighttime:

0 kW  
Expected after sunset

System available

`OPEN SOLAR MODULE →`

## CCTV example

CCTV  
Campus  
● ATTENTION

428 / 432  
Cameras Online

Offline: 4  
Recording Faults: 0

### NEEDS ATTENTION

Delta 9 · East Wing  
4 cameras offline  
12 min

`OPEN CCTV MODULE →`

## Parking example

PARKING  
Parking Plaza  
● NORMAL

328 / 450  
Occupied

Available: 122  
ANPR: Online  
Barriers: 4 / 4 Online

`OPEN PARKING MODULE →`

## Quick Inspect rules

- No direct equipment controls.
- Do not reproduce the entire module.
- Prioritize status and exceptions.
- Keep timestamps and units explicit.
- If data is stale, display that prominently.
- If partial telemetry exists, communicate uncertainty.
- If the module is not installed in current scope, show that explicitly.
- If access is restricted, explain that deeper details are unavailable.

## Closing behavior

Closing Quick Inspect should normally keep the selected system filter unless the product explicitly decides otherwise.

Example:

After closing HVAC Quick Inspect:

Scope remains `Campus / HVAC`

Operational Briefing now shows HVAC events across campus.
