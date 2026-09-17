# Visual System and Accessibility

## Visual direction

The interface should feel:

- advanced
- industrial
- technical
- professional
- mission-critical
- precise
- premium
- calm under normal conditions
- highly legible under stress

Preserve the current BMS / SCADA visual personality.

Avoid turning it into:

- generic SaaS
- fintech
- consumer app styling
- excessive glassmorphism
- excessive neon
- oversized rounded cards
- decorative charting
- huge empty whitespace
- uncontrolled gradients

## Color semantics

Recommended semantic roles:

- Dark navy / graphite: application base
- White: primary information
- Steel blue / muted grey: secondary information
- Cyan: selection, active interaction, navigation
- Green: confirmed healthy state
- Amber: degraded/warning/attention
- Red: critical/alarm/life-safety
- Grey: offline/disabled/unavailable
- Distinct styling: No Data / Stale

Do not rely on color alone.

## Building status treatment

Healthy buildings should remain mostly neutral.

Avoid filling the entire building bright green.

Use:

- outline
- thin perimeter
- compact beacon
- subtle halo
- badge
- corner marker

Critical states may use stronger treatment, but should remain readable.

## Typography

Use highly legible UI typography.

A futuristic display font may be used sparingly for large headings if readability remains strong.

Operational content should use a readable sans-serif or technical sans/mono pairing.

Hierarchy should clearly distinguish:

- page title
- section title
- module name
- status
- primary metric
- secondary metric
- metadata
- timestamp

Do not use tiny text for dense operational information.

## Iconography

Use a coherent industrial icon set.

Examples:

- HVAC: fan / snowflake
- Energy: lightning
- Solar: sun / panel
- Fire Alarm: alarm/flame
- Fire Fighting: hydrant/pump
- Water: droplet
- CCTV: camera
- Public Address: speaker
- Parking: P / car
- Occupancy: people
- Access: door / credential

Critical states should pair icon + text.

Do not encode important meaning through an icon alone.

## Accessibility

- State must not depend on color alone.
- Maintain strong contrast.
- Use visible keyboard focus.
- Keep target areas large enough for reliable mouse/touch interaction.
- Tooltips should also be accessible by focus if implementation allows.
- Avoid extremely subtle grey-on-grey labels.
- Use explicit text for critical states.

Examples:

`● NORMAL`
`⚠ WARNING`
`! CRITICAL`
`× OFFLINE`
`— NO DATA`

## Units

Always show units.

Good:

- 485 kW
- 1.24 MWh
- 8.1 bar
- 74%
- 954 people

Bad:

- 485
- 1.24
- 8.1
- 74

## Time

Use consistent local time formats.

Examples:

- 10:42:18 AM
- 12 min ago
- Active for 03:42
- Last update 10:31:22

## Motion

Keep motion restrained.

Recommended:

- 150–250 ms transitions
- smooth selection emphasis
- one-time state-change pulse if useful
- controlled critical alarm attention

Avoid:

- bouncing
- continuous pulsing for healthy systems
- dramatic 3D camera moves on every filter
- animated decoration unrelated to operations

## Charts and sparklines

Only use trends where they help operational decisions.

Good candidates:

- energy demand
- solar output
- pressure stability
- availability trend

Do not add sparklines to Fire Alarm or Public Address merely for decoration.

## Density

This is a command interface, so moderate-to-high information density is acceptable.

The goal is not minimalism for its own sake.

Use:

- structured panels
- strong alignment
- consistent spacing
- predictable card anatomy
- readable grouping
- restrained visual hierarchy
