# Information Architecture

## Primary layout

Target a dense but readable desktop SCADA layout.

At approximately 1920 × 1080:

- Main operational region: **70–74%**
- Right operational rail: **26–30%**

The page should ideally remain understandable within one viewport.

## Global header

The global header should preserve the existing BMS language and contain relevant items such as:

- menu / sidebar toggle
- area or campus selector
- current campus state
- critical / warning counts
- notifications
- user / profile
- settings where relevant
- weather
- current time
- connectivity/freshness where appropriate

Avoid vague global statements such as:

`ALL SYSTEM WORKING FINE`

Prefer measurable wording:

`CAMPUS NORMAL · 0 Critical · 2 Warnings · 3 Maintenance`

or:

`CAMPUS ATTENTION · 1 Critical · 4 Warnings · 2 No Data`

## Page title region

Primary title:

**CAMPUS COMMAND OVERVIEW**

Optional supporting line:

`Live operational overview of all buildings and systems`

Freshness examples:

- `LIVE · Updated 2 sec ago`
- `DATA DELAYED · Last update 42 sec ago`
- `CONNECTION LOST · Last reliable update 10:42:18`

## Compact campus summary

Provide concise global metrics rather than oversized cards.

Recommended examples:

- Campus state
- Critical alarms
- Warnings
- Occupancy
- Current energy demand
- Asset/controller connectivity

Example:

- CAMPUS: NORMAL
- ACTIVE ALARMS: 0 Critical / 3 Warning
- OCCUPANCY: 954
- ENERGY DEMAND: 485 kW
- CONNECTIVITY: 1,284 / 1,298

If showing a percentage, label it accurately:

`ASSET AVAILABILITY 98.4%`

Do not use a generic "overall health %" that can hide critical equipment failure.

## Main content stack

The main region should contain:

1. Scope Bar
2. Campus Digital Twin
3. System Overview

The right rail contains:

- Operational Briefing by default
- Quick Inspect when a system is being inspected

Quick Inspect replaces the Operational Briefing rail instead of opening a second side panel.

## Scope Bar

Operators must always know the current context.

Default:

`Campus / All Systems`

Examples:

- `Campus / HVAC`
- `Delta 4 / All Systems`
- `Delta 4 / HVAC`
- `Parking Plaza / CCTV`

Represent active filters clearly:

`[ Delta 4 × ] / [ HVAC × ]`

Provide:

`CLEAR FILTERS`

Never rely on hidden state.

## Campus Digital Twin

Use the isometric campus model showing:

- Delta 1 through Delta 11
- Parking Plaza

The model should remain central and visually understandable.

Buildings should generally remain neutral. Do not fill healthy buildings in bright green.

Use restrained status treatment:

- perimeter/outline
- subtle halo
- status beacon
- compact badge
- marker

Possible permanent building label:

`DELTA 4`
`120 people`
`⚠ 2`

Keep labels lightweight.

## Digital Twin layers

Recommended layer controls:

- Health
- Occupancy
- Energy
- Alarms

Potential future layers:

- HVAC
- Security
- Connectivity
- Fire/Life Safety

Layer changes should stay on the same page.

### Health
Shows overall building attention state.

### Occupancy
Shows people distribution.

### Energy
Shows electrical demand by building.

### Alarms
Shows active event distribution.

## Building hover

Hovering a building should show a concise snapshot using Operational Signatures.

Example:

DELTA 4  
Occupancy: 120  
Campus State: ATTENTION

HVAC: 22 / 24 operational  
Lighting: Normal  
Fire Alarm: Normal  
Fire Fighting: Normal  
CCTV: 46 / 48  
Energy: 42 kW

1 Warning  
2 Devices Offline

Do not dump every available metric into the tooltip.

## Building click

Clicking a building applies scope. It does not immediately navigate away.

Example:

`Delta 4 / All Systems`

The page then updates:

- System Overview
- Operational Briefing
- Digital Twin emphasis
- top summary if contextually appropriate
- Quick Inspect if already open

Non-selected buildings remain visible but recede.

## System Overview section

Place the module overview beneath the Digital Twin.

Representative systems:

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
- Network/BMS

Do not hide important life-safety systems below the fold.

If necessary, use compact grouping or a controlled internal region rather than turning the whole page into a long scrolling dashboard.

## Optional system grouping

Use subtle grouping only if it improves scanning:

### Environment
HVAC, Lighting, Water

### Energy
Energy, Solar, Generators

### Life Safety
Fire Alarm, Fire Fighting, Public Address

### Security
CCTV, Access Control

### Operations
Parking, Occupancy, Network/BMS

Avoid excessive headers and empty space.
