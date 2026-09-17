# System Cards and Operational Signatures

## Goal

Every BMS module is different, but the Home screen needs a coherent family of summary components.

Do not create a completely unique card for every module.

Use one consistent card shell with one of five content archetypes.

## Archetype 1: State

Best for:

- Fire Alarm
- Public Address
- simple life-safety/availability systems

Typical content:

- Normal / Warning / Alarm / Fault / Offline
- active alarm count
- fault count
- isolated/disabled count

Example:

FIRE ALARM  
● NORMAL

NO ACTIVE ALARMS

Faults: 0  
Isolated: 2

## Archetype 2: Fleet

Best for:

- HVAC
- CCTV
- Lighting
- Access Control controllers

Typical content:

- operational / total
- offline count
- fault count
- standby count where relevant

Example:

HVAC  
● GOOD

124 / 132  
OPERATIONAL

Standby: 4  
Offline: 2  
Fault: 2

## Archetype 3: Process

Best for:

- Fire Fighting
- Water
- pumping/process systems

Typical content:

- one primary physical measurement
- equipment readiness
- supporting level/flow/pressure metric

Example:

FIRE FIGHTING  
● GOOD

8.1 bar  
HEADER PRESSURE

Pumps: 3 / 3 Ready  
Tank: 84%

## Archetype 4: Production

Best for:

- Solar
- Energy
- Generators

Typical content:

- current generation/load/output
- daily production/consumption
- equipment availability

Example:

SOLAR  
● GOOD

136 kW  
CURRENT GENERATION

Today: 1.24 MWh  
Inverters: 12 / 12

## Archetype 5: Capacity

Best for:

- Parking
- Occupancy

Typical content:

- current use vs capacity
- remaining capacity
- subsystem availability

Example:

PARKING

328 / 450  
OCCUPIED

Available: 122  
ANPR: Online

## Card anatomy

All cards should share:

1. Module icon
2. Module name
3. Overall status
4. Primary Operational Signature
5. Up to two supporting metrics
6. Optional alert/fault indicator
7. Optional small trend only when operationally meaningful

## Hard information budget

Maximum per overview card:

- 1 overall status
- 1 primary metric/state
- 2 secondary metrics
- 1 alert/fault indicator
- optional compact trend

Do not show every available KPI.

The card is not a module dashboard.

## Operational Signature

Each module must define the smallest useful set of information needed to understand its condition.

This signature powers:

- Home card
- Building tooltip
- Quick Inspect header
- compact wallboard/TV views in the future

## Recommended signatures

### HVAC
- status
- operational / total
- fault
- offline

### Lighting
- status
- healthy zones / total
- active zones
- faults

### Energy
- status
- current demand
- today's consumption
- peak demand if useful

### Solar
- status
- current generation
- today's generation
- inverter availability

### Generators
- status
- ready / total
- running count
- fuel or another critical readiness metric

### Fire Alarm
- status
- active alarms
- faults
- isolated devices

### Fire Fighting
- status
- main/header pressure
- pump readiness
- tank level

### Water
- status
- pressure
- tank level
- pump condition

### CCTV
- status
- cameras online / total
- offline cameras
- recording/storage issues

### Public Address
- status
- zones available / total
- amplifier/controller faults

### Access Control
- status
- controllers/doors online
- forced/open doors
- communication faults

### Parking
- occupied / capacity
- available spaces
- barrier status
- ANPR status

### Occupancy
- people onsite
- building distribution
- capacity state if relevant

### Network / BMS
- controllers online / total
- offline count
- stale/no-data count

## Zero values

Zero does not automatically mean failure.

Examples:

- Solar = 0 kW at night
- Generator = 0 kW while in standby
- Alarm count = 0 is healthy
- Pump flow = 0 while correctly idle
- Occupancy = 0 after hours may be expected

Interpret the metric in context.

## Not installed

If a module does not exist in a building, use:

`Not installed`

Do not show:

`Offline`

## Card states

Each card should support:

- default
- hover
- selected
- focus
- normal
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

Selection should not override severity.
