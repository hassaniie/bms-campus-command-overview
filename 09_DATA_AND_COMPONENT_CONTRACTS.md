# Data and Component Contracts

These structures define the information the Home screen expects from the BMS. Exact backend implementation may differ, but the UI should behave as if these contracts exist.

## Module Summary

Suggested shape:

```ts
type ModuleSummary = {
  moduleId: string
  moduleName: string

  scopeType: "campus" | "building"
  buildingId?: string

  overallStatus:
    | "normal"
    | "attention"
    | "warning"
    | "critical"
    | "maintenance"
    | "offline"
    | "no_data"
    | "stale"
    | "disabled"
    | "unknown"
    | "partial_data"
    | "not_installed"
    | "restricted"

  primaryMetric?: number | string
  primaryUnit?: string
  primaryLabel: string

  secondaryMetric1?: {
    label: string
    value: number | string
    unit?: string
  }

  secondaryMetric2?: {
    label: string
    value: number | string
    unit?: string
  }

  criticalCount?: number
  warningCount?: number
  maintenanceCount?: number

  onlineCount?: number
  offlineCount?: number
  totalCount?: number

  dataQuality:
    | "fresh"
    | "stale"
    | "partial"
    | "missing"
    | "unknown"

  lastUpdated?: string

  trend?: {
    period: string
    values: number[]
  }

  attentionItems?: AttentionItem[]
}
```

## Attention Item

```ts
type AttentionItem = {
  id: string
  severity:
    | "info"
    | "maintenance"
    | "warning"
    | "critical"

  systemId: string
  systemName: string

  buildingId?: string
  buildingName?: string
  location?: string

  assetId?: string
  assetName?: string

  title: string
  description?: string

  startTime?: string
  durationSeconds?: number

  acknowledged?: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string

  status: "active" | "resolved"

  destination?: {
    type: "module" | "incident" | "event"
    id?: string
  }
}
```

## Building Summary

```ts
type BuildingSummary = {
  buildingId: string
  buildingName: string

  overallStatus: string

  occupancy?: number
  energyDemandKw?: number

  activeCriticalCount: number
  activeWarningCount: number

  connectivityState:
    | "online"
    | "partial"
    | "offline"
    | "unknown"

  lastUpdated?: string

  moduleSummaries: ModuleSummary[]
}
```

## Campus Summary

```ts
type CampusSummary = {
  overallStatus: string

  criticalCount: number
  warningCount: number
  maintenanceCount: number
  noDataCount?: number

  peopleOnsite?: number

  currentDemandKw?: number

  connectedAssets?: number
  totalAssets?: number

  dataQuality: string
  lastUpdated?: string
}
```

## Scope state

```ts
type DashboardScope = {
  buildingId?: string
  systemId?: string
  layer: "health" | "occupancy" | "energy" | "alarms"
}
```

Examples:

Campus / All Systems:

```ts
{
  buildingId: undefined,
  systemId: undefined,
  layer: "health"
}
```

Delta 4 / HVAC:

```ts
{
  buildingId: "delta-4",
  systemId: "hvac",
  layer: "health"
}
```

## Freshness rules

The UI should not assume all modules have identical refresh rates.

The backend/configuration should define freshness thresholds per module where necessary.

Conceptually:

```ts
type FreshnessConfig = {
  expectedRefreshSeconds: number
  staleAfterSeconds: number
  noDataAfterSeconds: number
}
```

The interface should display freshness based on the relevant module's rules.

## Derived status caution

Do not derive a reassuring aggregate status from incomplete data.

Example:

If 120 of 132 HVAC units are healthy, 4 offline, and 8 unknown/no-data, do not show a health percentage as if all 132 were measured.

Prefer explicit counts.

## Operational Signature config

Each module can map into a standard signature definition.

Conceptually:

```ts
type OperationalSignatureConfig = {
  archetype:
    | "state"
    | "fleet"
    | "process"
    | "production"
    | "capacity"

  primaryField: string
  secondaryFields: string[]
  alertField?: string

  zeroValueBehavior?: "normal" | "contextual" | "attention"
}
```

## Briefing grouping

Backend or UI logic may group multiple events into a briefing item.

A grouped item should preserve:

- number of affected assets
- system
- building
- severity
- oldest active time
- destination to full event list

## UI consistency rule

The UI may adapt the presentation of each module, but component anatomy, state vocabulary, and interaction behavior should remain consistent.
