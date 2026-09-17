# Product Intent

## Product role

The **Campus Command Overview** is the default operational home screen for the BMS.

Its job is not to reproduce every detailed module. It acts as the campus-level nervous system that aggregates state from all buildings and modules, surfaces abnormalities, provides spatial context, and routes the operator into deeper views only when needed.

## Primary operator questions

The screen must answer:

- Is anything wrong?
- Where is it?
- Which system is affected?
- How severe is it?
- How long has it been active?
- Is the data trustworthy and fresh?
- Can I understand the issue without opening a full module?
- What should I inspect next?

## Mental model

The whole experience should map to:

**WHAT'S HAPPENING?**  
→ Operational Briefing

**WHERE?**  
→ Campus Digital Twin

**WHICH SYSTEM?**  
→ System Overview

**TELL ME MORE**  
→ Quick Inspect

**I NEED TO INVESTIGATE OR CONTROL IT**  
→ Full Module

## Primary interaction path

**Campus Overview → Cross-filter → Quick Inspect → Full Module**

The homepage is optimized for:

- monitoring
- awareness
- triage
- discovery
- lightweight investigation

The homepage is not intended for direct physical equipment control.

## Non-goals

Do not turn the homepage into:

- a full analytics suite,
- a wall of charts,
- a duplicate of each module,
- an alarm event log,
- a command/control console for start/stop/reset actions,
- a generic SaaS dashboard,
- a collection of oversized KPI cards.

## Read-only principle

The Home / Command Overview should remain read-only unless a future product decision explicitly changes this.

Allowed actions:

- filter
- hover
- inspect
- open event
- open incident
- navigate to a module
- clear scope
- potentially acknowledge an event only if product rules later permit it

Do not add:

- start / stop
- reset
- barrier open / close
- equipment override
- setpoint change
- mode change
- direct actuator commands

## Exception-first philosophy

The interface should be visually calm during normal operation.

Attention should scale with operational importance:

**Normal → Informational → Maintenance → Degraded → Warning → Critical**

Also support:

- Offline
- No Data
- Stale
- Disabled
- Unknown

**No Data is never equivalent to Normal.**

## Life-safety priority

Fire Alarm, Fire Fighting, Emergency/Public Address, and other life-safety conditions must be able to override lower-priority visual hierarchy.

A critical life-safety event must immediately communicate:

- what happened,
- where it happened,
- when it started,
- whether it is still active,
- what the operator can inspect next.

Do not hide the rest of the campus, but visually recede non-critical information.

## Healthy-state philosophy

A healthy screen should still be informative.

For example:

- Campus Normal
- 0 Critical
- 0 Warning
- 2 Maintenance
- 954 People
- 485 kW
- all monitored life-safety systems normal

Do not fill empty space with decorative charts simply because the campus is healthy.
