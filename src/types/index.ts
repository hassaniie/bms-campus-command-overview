// ---------------------------------------------------------------------------
// Data & component contracts — mirrors 09_DATA_AND_COMPONENT_CONTRACTS.md.
// These are the UI-facing shapes the Home screen behaves against. A real BMS
// backend can differ internally as long as it satisfies these contracts.
// ---------------------------------------------------------------------------

/** Full status vocabulary — see 07_STATES_AND_EDGE_CASES.md. Never collapse. */
export type Status =
  | 'normal'
  | 'attention'
  | 'warning'
  | 'critical'
  | 'maintenance'
  | 'offline'
  | 'no_data'
  | 'stale'
  | 'disabled'
  | 'unknown'
  | 'partial_data'
  | 'not_installed'
  | 'restricted'

/** Freshness / trustworthiness of the telemetry behind a summary. */
export type DataQuality = 'fresh' | 'stale' | 'partial' | 'missing' | 'unknown'

/** Event severity as used by the Operational Briefing / Attention items. */
export type Severity = 'info' | 'maintenance' | 'warning' | 'critical'

/** The five standardized card archetypes (04_SYSTEM_CARDS...). */
export type Archetype = 'state' | 'fleet' | 'process' | 'production' | 'capacity'

/** Digital Twin visualization layers (visualization mode, not scope). */
export type TwinLayer = 'health' | 'occupancy' | 'energy' | 'alarms'

export interface Metric {
  label: string
  value: number | string
  unit?: string
}

export interface Trend {
  period: string
  values: number[]
}

export interface ModuleSummary {
  moduleId: string
  moduleName: string

  scopeType: 'campus' | 'building'
  buildingId?: string

  overallStatus: Status

  /** Primary Operational Signature. */
  primaryMetric?: number | string
  primaryUnit?: string
  primaryLabel: string

  secondaryMetric1?: Metric
  secondaryMetric2?: Metric

  criticalCount?: number
  warningCount?: number
  maintenanceCount?: number

  onlineCount?: number
  offlineCount?: number
  totalCount?: number

  dataQuality: DataQuality
  lastUpdated?: string

  trend?: Trend

  attentionItems?: AttentionItem[]

  /** Optional per-status detail line surfaced in Quick Inspect breakdowns. */
  breakdown?: Metric[]

  /** Optional freshness override in seconds since update (for demo clocks). */
  ageSeconds?: number

  /** Context note for zero / expected-idle values (e.g. "Expected after sunset"). */
  contextNote?: string
}

export interface AttentionItem {
  id: string
  severity: Severity

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

  status: 'active' | 'resolved'

  /** Grouped alarm storm: number of underlying events rolled into this item. */
  groupCount?: number

  destination?: {
    type: 'module' | 'incident' | 'event'
    id?: string
  }

  /** Marks a life-safety incident that overrides visual hierarchy. */
  lifeSafety?: boolean
}

export type ConnectivityState = 'online' | 'partial' | 'offline' | 'unknown'

export interface BuildingSummary {
  buildingId: string
  buildingName: string

  overallStatus: Status

  occupancy?: number
  energyDemandKw?: number

  activeCriticalCount: number
  activeWarningCount: number

  connectivityState: ConnectivityState

  lastUpdated?: string

  moduleSummaries: ModuleSummary[]

  /** Systems physically installed in this building (others => not_installed). */
  installedSystems?: string[]
}

export interface CampusSummary {
  overallStatus: Status

  criticalCount: number
  warningCount: number
  maintenanceCount: number
  noDataCount?: number

  peopleOnsite?: number
  currentDemandKw?: number
  peakDemandKw?: number

  connectedAssets?: number
  totalAssets?: number

  dataQuality: DataQuality
  lastUpdated?: string
}

export interface DashboardScope {
  buildingId?: string
  systemId?: string
  layer: TwinLayer
}

export interface FreshnessConfig {
  expectedRefreshSeconds: number
  staleAfterSeconds: number
  noDataAfterSeconds: number
}

export interface OperationalSignatureConfig {
  archetype: Archetype
  primaryField: string
  secondaryFields: string[]
  alertField?: string
  zeroValueBehavior?: 'normal' | 'contextual' | 'attention'
}

/** Connection posture for the whole campus feed. */
export type ConnectionState = 'live' | 'delayed' | 'lost'

/** The complete raw model the app holds for a given scenario (backend stand-in). */
export interface CampusState {
  scenarioId: string
  /** Reference "now" for this scenario, epoch ms. Durations derive from it. */
  now: number
  connection: ConnectionState
  /** Wall-clock of the last reliable update (used when connection is lost). */
  lastReliableUpdate: string
  campus: CampusSummary
  buildings: BuildingSummary[]
  /** Campus-aggregated module summaries (rolled up from buildings). */
  campusModules: ModuleSummary[]
  /** All briefing events (active + resolved), unscoped; filtered by selectors. */
  briefing: AttentionItem[]
}
