import type {
  AttentionItem,
  BuildingSummary,
  CampusState,
  CampusSummary,
  DashboardScope,
  ModuleSummary,
  Status,
  TwinLayer,
} from '@/types'
import { MODULES, MODULE_BY_ID } from '@/config/modules'
import { BUILDINGS, BUILDING_BY_ID } from '@/config/buildings'
import { statusMeta } from '@/lib/status'

function notInstalledSummary(moduleId: string, buildingId: string): ModuleSummary {
  return {
    moduleId,
    moduleName: MODULE_BY_ID[moduleId]?.name ?? moduleId,
    scopeType: 'building',
    buildingId,
    overallStatus: 'not_installed',
    primaryLabel: 'Not installed',
    primaryMetric: '—',
    dataQuality: 'unknown',
  }
}

/** Module summaries for the System Overview grid, honoring building scope. */
export function scopedModules(campus: CampusState, scope: DashboardScope): ModuleSummary[] {
  if (!scope.buildingId) return campus.campusModules
  const building = campus.buildings.find((b) => b.buildingId === scope.buildingId)
  const cfg = BUILDING_BY_ID[scope.buildingId]
  return MODULES.map((m) => {
    const found = building?.moduleSummaries.find((s) => s.moduleId === m.id)
    if (found) return found
    // Installed but no data vs. genuinely not installed.
    if (cfg && !cfg.installedSystems.includes(m.id)) {
      return notInstalledSummary(m.id, scope.buildingId!)
    }
    return notInstalledSummary(m.id, scope.buildingId!)
  })
}

/** The single module summary that Quick Inspect should show for current scope. */
export function moduleForScope(
  campus: CampusState,
  scope: DashboardScope,
  moduleId: string,
): ModuleSummary {
  if (scope.buildingId) {
    const building = campus.buildings.find((b) => b.buildingId === scope.buildingId)
    const found = building?.moduleSummaries.find((s) => s.moduleId === moduleId)
    if (found) return found
    return notInstalledSummary(moduleId, scope.buildingId)
  }
  const found = campus.campusModules.find((s) => s.moduleId === moduleId)
  return found ?? notInstalledSummary(moduleId, 'campus')
}

/** Attention items for a given module across current building scope. */
export function attentionForModule(
  campus: CampusState,
  scope: DashboardScope,
  moduleId: string,
): AttentionItem[] {
  return campus.briefing.filter(
    (e) =>
      e.systemId === moduleId &&
      e.status === 'active' &&
      (!scope.buildingId || e.buildingId === scope.buildingId),
  )
}

export interface ScopedBriefing {
  active: AttentionItem[]
  resolved: AttentionItem[]
}

/** Briefing items filtered by current scope (building + system). */
export function scopedBriefing(campus: CampusState, scope: DashboardScope): ScopedBriefing {
  const match = (e: AttentionItem) =>
    (!scope.buildingId || e.buildingId === scope.buildingId) &&
    (!scope.systemId || e.systemId === scope.systemId)
  const items = campus.briefing.filter(match)
  return {
    active: items.filter((e) => e.status === 'active'),
    resolved: items.filter((e) => e.status === 'resolved'),
  }
}

/** Campus summary strip data, narrowed to a building when one is selected. */
export function scopedCampusSummary(
  campus: CampusState,
  scope: DashboardScope,
): CampusSummary & { scopeLabel: string } {
  if (!scope.buildingId) {
    return { ...campus.campus, scopeLabel: 'Campus' }
  }
  const b = campus.buildings.find((x) => x.buildingId === scope.buildingId)
  if (!b) return { ...campus.campus, scopeLabel: 'Campus' }

  const active = campus.briefing.filter(
    (e) => e.status === 'active' && e.buildingId === scope.buildingId,
  )
  const critical = active.filter((e) => e.severity === 'critical').length
  const warning = active.filter((e) => e.severity === 'warning').length
  const maintenance = active.filter((e) => e.severity === 'maintenance').length
  const noData = b.moduleSummaries.filter(
    (s) => s.overallStatus === 'no_data' || s.overallStatus === 'offline',
  ).length

  return {
    overallStatus: b.overallStatus,
    criticalCount: critical,
    warningCount: warning,
    maintenanceCount: maintenance,
    noDataCount: noData,
    peopleOnsite: b.occupancy,
    currentDemandKw: b.energyDemandKw,
    connectedAssets: undefined,
    totalAssets: undefined,
    dataQuality: b.connectivityState === 'offline' ? 'missing' : campus.campus.dataQuality,
    lastUpdated: b.lastUpdated,
    scopeLabel: b.buildingName,
  }
}

// --- Digital Twin per-building view ----------------------------------------

export interface TwinBuildingView {
  buildingId: string
  status: Status
  /** Primary display value for the active layer (already unit-formatted). */
  value?: string
  /** Small caption under the value. */
  caption?: string
  activeCritical: number
  activeWarning: number
  connectivity: BuildingSummary['connectivityState']
  hex: string
}

function buildingStatusForSystem(b: BuildingSummary, systemId?: string): Status {
  if (!systemId) return b.overallStatus
  const cfg = BUILDING_BY_ID[b.buildingId]
  if (cfg && !cfg.installedSystems.includes(systemId)) return 'not_installed'
  const m = b.moduleSummaries.find((s) => s.moduleId === systemId)
  return m?.overallStatus ?? 'unknown'
}

/**
 * Compute the twin display for each building given the current layer and any
 * system filter. System filter recolors buildings by that system's state.
 */
export function twinBuildingViews(
  campus: CampusState,
  scope: DashboardScope,
): Record<string, TwinBuildingView> {
  const layer: TwinLayer = scope.layer
  const out: Record<string, TwinBuildingView> = {}

  const maxEnergy = Math.max(1, ...campus.buildings.map((b) => b.energyDemandKw ?? 0))
  const maxOcc = Math.max(1, ...campus.buildings.map((b) => b.occupancy ?? 0))

  for (const b of campus.buildings) {
    const status = buildingStatusForSystem(b, scope.systemId)
    const meta = statusMeta(status)
    let value: string | undefined
    let caption: string | undefined

    if (scope.systemId) {
      // System-filtered mode: caption reflects that system.
      caption = MODULE_BY_ID[scope.systemId]?.name
    } else {
      switch (layer) {
        case 'occupancy':
          value = b.connectivityState === 'offline' ? '—' : `${b.occupancy ?? 0}`
          caption = 'people'
          break
        case 'energy':
          value = b.connectivityState === 'offline' ? '—' : `${b.energyDemandKw ?? 0} kW`
          caption = 'demand'
          break
        case 'alarms': {
          const n = b.activeCriticalCount + b.activeWarningCount
          value = `${n}`
          caption = 'active events'
          break
        }
        case 'health':
        default:
          caption = meta.label.toLowerCase()
          break
      }
    }

    out[b.buildingId] = {
      buildingId: b.buildingId,
      status,
      value,
      caption,
      activeCritical: b.activeCriticalCount,
      activeWarning: b.activeWarningCount,
      connectivity: b.connectivityState,
      hex: meta.hex,
      // intensity handled in component via these maxes
      ...(layer === 'energy' ? { intensity: (b.energyDemandKw ?? 0) / maxEnergy } : {}),
      ...(layer === 'occupancy' ? { intensity: (b.occupancy ?? 0) / maxOcc } : {}),
    } as TwinBuildingView & { intensity?: number }
  }
  return out
}

/** Ordered building list (config order) for consistent rendering. */
export function orderedBuildings(campus: CampusState): BuildingSummary[] {
  const order = new Map(BUILDINGS.map((b, i) => [b.id, i]))
  return [...campus.buildings].sort(
    (a, b) => (order.get(a.buildingId) ?? 0) - (order.get(b.buildingId) ?? 0),
  )
}
