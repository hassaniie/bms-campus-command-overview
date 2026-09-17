import type {
  BuildingSummary,
  CampusState,
  ModuleSummary,
  Status,
  Metric,
} from '@/types'
import { BUILDINGS, type BuildingConfig } from '@/config/buildings'
import { MODULES, MODULE_BY_ID } from '@/config/modules'
import { statusMeta } from '@/lib/status'
import { seededInt, seededFloat, seededTrend } from './rng'

// ---------------------------------------------------------------------------
// Backend stand-in. buildBaseState() returns a fully healthy campus with
// believable telemetry for every installed building/system. Scenarios patch it.
// Replacing this generator with real API calls that satisfy the same contracts
// (09_DATA_AND_COMPONENT_CONTRACTS.md) is the single integration seam.
// ---------------------------------------------------------------------------

interface Ctx {
  now: number
}

function area(b: BuildingConfig): number {
  return b.plan.w * b.plan.d
}

/** Base ModuleSummary with sensible defaults for a building-scoped, healthy module. */
function baseSummary(moduleId: string, b: BuildingConfig): ModuleSummary {
  const m = MODULE_BY_ID[moduleId]
  return {
    moduleId,
    moduleName: m.name,
    scopeType: 'building',
    buildingId: b.id,
    overallStatus: 'normal',
    primaryLabel: '',
    dataQuality: 'fresh',
    ageSeconds: 0,
  }
}

// --- Per-module healthy builders (building scope) ---------------------------

function buildBuildingModule(moduleId: string, b: BuildingConfig, ctx: Ctx): ModuleSummary {
  const s = baseSummary(moduleId, b)
  const a = area(b)
  const seed = `${b.id}:${moduleId}:${ctx.now}`

  switch (moduleId) {
    case 'hvac': {
      const total = Math.max(6, Math.round(a / 2.3))
      const standby = seededInt(seed + ':sb', 1, 4)
      const operational = total - standby
      s.overallStatus = 'normal'
      s.primaryMetric = `${operational} / ${total}`
      s.primaryLabel = 'Operational'
      s.onlineCount = operational
      s.totalCount = total
      s.offlineCount = 0
      s.secondaryMetric1 = { label: 'Standby', value: standby }
      s.secondaryMetric2 = { label: 'Fault', value: 0 }
      s.breakdown = [
        { label: 'Running', value: operational },
        { label: 'Standby', value: standby },
        { label: 'Fault', value: 0 },
        { label: 'Offline', value: 0 },
      ]
      s.trend = { period: '24h availability', values: seededTrend(seed, 12, 98.5, 0.6) }
      return s
    }
    case 'lighting': {
      const total = Math.max(4, Math.round(a / 2.5))
      const active = Math.round(total * seededFloat(seed + ':act', 0.55, 0.85, 2))
      s.primaryMetric = `${total} / ${total}`
      s.primaryLabel = 'Zones Healthy'
      s.onlineCount = total
      s.totalCount = total
      s.secondaryMetric1 = { label: 'Active Zones', value: active }
      s.secondaryMetric2 = { label: 'Faults', value: 0 }
      s.breakdown = [
        { label: 'Healthy', value: total },
        { label: 'Active', value: active },
        { label: 'Faults', value: 0 },
      ]
      return s
    }
    case 'water': {
      const pressure = seededFloat(seed + ':p', 3.3, 4.1, 1)
      const tank = seededInt(seed + ':t', 72, 94)
      s.primaryMetric = pressure
      s.primaryUnit = 'bar'
      s.primaryLabel = 'Supply Pressure'
      s.secondaryMetric1 = { label: 'Tank Level', value: tank, unit: '%' }
      s.secondaryMetric2 = { label: 'Pumps', value: 'Duty OK' }
      s.trend = { period: 'pressure 24h', values: seededTrend(seed, 12, pressure, 0.15) }
      s.breakdown = [
        { label: 'Supply Pressure', value: pressure, unit: 'bar' },
        { label: 'Tank Level', value: tank, unit: '%' },
        { label: 'Duty Pump', value: 'Running' },
        { label: 'Standby Pump', value: 'Ready' },
      ]
      return s
    }
    case 'energy': {
      const demand = b.energyBase
      const today = Math.round(demand * 13.4)
      s.primaryMetric = demand
      s.primaryUnit = 'kW'
      s.primaryLabel = 'Current Demand'
      s.secondaryMetric1 = { label: "Today", value: today, unit: 'kWh' }
      s.secondaryMetric2 = { label: 'Feeders', value: 'Online' }
      s.trend = { period: 'demand 24h', values: seededTrend(seed, 16, demand, demand * 0.18) }
      return s
    }
    case 'solar': {
      const gen = Math.round(a * seededFloat(seed + ':g', 1.1, 1.5, 2))
      const inverters = Math.max(2, Math.round(a / 7))
      const today = Math.round(gen * 7.2) / 1000
      s.primaryMetric = gen
      s.primaryUnit = 'kW'
      s.primaryLabel = 'Current Generation'
      s.secondaryMetric1 = { label: 'Today', value: today, unit: 'MWh' }
      s.secondaryMetric2 = { label: 'Inverters', value: `${inverters} / ${inverters}` }
      s.onlineCount = inverters
      s.totalCount = inverters
      s.trend = { period: 'output 24h', values: seededTrend(seed, 16, gen, gen * 0.25) }
      return s
    }
    case 'generators': {
      const total = seededInt(seed + ':n', 1, 2)
      const fuel = seededInt(seed + ':f', 82, 98)
      s.primaryMetric = `${total} / ${total}`
      s.primaryLabel = 'Ready · Standby'
      s.onlineCount = total
      s.totalCount = total
      s.secondaryMetric1 = { label: 'Running', value: 0 }
      s.secondaryMetric2 = { label: 'Fuel', value: fuel, unit: '%' }
      s.contextNote = 'On standby — 0 kW expected'
      s.breakdown = [
        { label: 'Ready', value: total },
        { label: 'Running', value: 0 },
        { label: 'Fuel', value: fuel, unit: '%' },
      ]
      return s
    }
    case 'fire_alarm': {
      const isolated = seededInt(seed + ':iso', 0, 2)
      s.primaryMetric = 0
      s.primaryLabel = 'Active Alarms'
      s.secondaryMetric1 = { label: 'Faults', value: 0 }
      s.secondaryMetric2 = { label: 'Isolated', value: isolated }
      s.maintenanceCount = isolated
      return s
    }
    case 'fire_fighting': {
      const pressure = seededFloat(seed + ':hp', 7.7, 8.4, 1)
      const pumps = seededInt(seed + ':pumps', 2, 3)
      const tank = seededInt(seed + ':tk', 76, 94)
      s.primaryMetric = pressure
      s.primaryUnit = 'bar'
      s.primaryLabel = 'Header Pressure'
      s.secondaryMetric1 = { label: 'Pumps Ready', value: `${pumps} / ${pumps}` }
      s.secondaryMetric2 = { label: 'Tank', value: tank, unit: '%' }
      s.trend = { period: 'pressure 24h', values: seededTrend(seed, 12, pressure, 0.1) }
      s.breakdown = [
        { label: 'Header Pressure', value: pressure, unit: 'bar' },
        { label: 'Pumps Ready', value: `${pumps} / ${pumps}` },
        { label: 'Jockey Pump', value: 'Auto' },
        { label: 'Tank Level', value: tank, unit: '%' },
      ]
      return s
    }
    case 'public_address': {
      const zones = Math.max(3, Math.round(a / 4))
      s.primaryMetric = `${zones} / ${zones}`
      s.primaryLabel = 'Zones Available'
      s.onlineCount = zones
      s.totalCount = zones
      s.secondaryMetric1 = { label: 'Amplifier Faults', value: 0 }
      s.secondaryMetric2 = { label: 'Mode', value: 'Standby' }
      return s
    }
    case 'cctv': {
      const total = Math.max(6, Math.round(a * 1.0) + 6)
      s.primaryMetric = `${total} / ${total}`
      s.primaryLabel = 'Cameras Online'
      s.onlineCount = total
      s.totalCount = total
      s.offlineCount = 0
      s.secondaryMetric1 = { label: 'Offline', value: 0 }
      s.secondaryMetric2 = { label: 'Recording Faults', value: 0 }
      s.breakdown = [
        { label: 'Online', value: total },
        { label: 'Offline', value: 0 },
        { label: 'Recording Faults', value: 0 },
      ]
      return s
    }
    case 'access_control': {
      const total = Math.max(6, Math.round(a / 2) + 8)
      s.primaryMetric = `${total} / ${total}`
      s.primaryLabel = 'Doors Online'
      s.onlineCount = total
      s.totalCount = total
      s.secondaryMetric1 = { label: 'Forced / Held', value: 0 }
      s.secondaryMetric2 = { label: 'Comm Faults', value: 0 }
      return s
    }
    case 'parking': {
      const capacity = 450
      const occupied = seededInt(seed + ':occ', 300, 360)
      s.primaryMetric = `${occupied} / ${capacity}`
      s.primaryLabel = 'Occupied'
      s.onlineCount = occupied
      s.totalCount = capacity
      s.secondaryMetric1 = { label: 'Available', value: capacity - occupied }
      s.secondaryMetric2 = { label: 'ANPR', value: 'Online' }
      s.breakdown = [
        { label: 'Occupied', value: occupied },
        { label: 'Available', value: capacity - occupied },
        { label: 'Barriers', value: '4 / 4 Online' },
        { label: 'ANPR', value: 'Online' },
      ]
      return s
    }
    case 'occupancy': {
      const people = b.occupancyBase
      const capacity = Math.round(b.occupancyBase * 1.7) + 40
      s.primaryMetric = people
      s.primaryLabel = 'People Onsite'
      s.onlineCount = people
      s.totalCount = capacity
      s.secondaryMetric1 = { label: 'Capacity', value: capacity }
      s.secondaryMetric2 = { label: 'Utilisation', value: Math.round((people / capacity) * 100), unit: '%' }
      s.trend = { period: 'occupancy 24h', values: seededTrend(seed, 16, people, people * 0.4) }
      return s
    }
    case 'network': {
      const total = Math.max(4, Math.round(a / 6) + 4)
      s.primaryMetric = `${total} / ${total}`
      s.primaryLabel = 'Controllers Online'
      s.onlineCount = total
      s.totalCount = total
      s.offlineCount = 0
      s.secondaryMetric1 = { label: 'Offline', value: 0 }
      s.secondaryMetric2 = { label: 'No Data', value: 0 }
      return s
    }
    default: {
      s.primaryLabel = 'Status'
      s.primaryMetric = 'Normal'
      return s
    }
  }
}

// --- Building assembly ------------------------------------------------------

function buildBuilding(b: BuildingConfig, ctx: Ctx): BuildingSummary {
  const moduleSummaries = MODULES.filter((m) => b.installedSystems.includes(m.id)).map((m) =>
    buildBuildingModule(m.id, b, ctx),
  )
  return {
    buildingId: b.id,
    buildingName: b.name,
    overallStatus: 'normal',
    occupancy: b.occupancyBase,
    energyDemandKw: b.energyBase,
    activeCriticalCount: 0,
    activeWarningCount: 0,
    connectivityState: 'online',
    lastUpdated: new Date(ctx.now).toISOString(),
    moduleSummaries,
    installedSystems: b.installedSystems,
  }
}

// --- Campus rollups ---------------------------------------------------------

function num(v: number | string | undefined): number {
  return typeof v === 'number' ? v : 0
}

const DEGRADED = new Set<Status>(['no_data', 'offline', 'stale', 'unknown', 'partial_data'])
const HEALTHY = new Set<Status>(['normal', 'maintenance', 'disabled'])

/**
 * Aggregate many part-statuses into one. Critically: a mix of some-reporting +
 * some-degraded resolves to `partial_data`, NOT full No Data — a single
 * building's outage must never make a whole campus system read "No Data",
 * and incomplete data must never read as fully healthy (09 → Derived status).
 */
export function aggregateStatus(statuses: Status[]): Status {
  const present = statuses.filter((s) => s !== 'not_installed')
  if (present.length === 0) return 'not_installed'
  if (present.includes('critical')) return 'critical'
  if (present.some((s) => s === 'warning' || s === 'attention')) return 'warning'

  const degraded = present.filter((s) => DEGRADED.has(s))
  const healthy = present.filter((s) => HEALTHY.has(s))
  if (degraded.length > 0) {
    if (healthy.length > 0) return 'partial_data'
    // all degraded — surface the most specific shared kind
    if (present.every((s) => s === 'offline')) return 'offline'
    if (present.every((s) => s === 'stale')) return 'stale'
    if (present.every((s) => s === 'no_data')) return 'no_data'
    return 'partial_data'
  }
  if (present.includes('maintenance')) return 'maintenance'
  return 'normal'
}

/** Aggregate every building's module of `moduleId` into one campus ModuleSummary. */
export function rollupCampusModule(moduleId: string, buildings: BuildingSummary[]): ModuleSummary {
  const m = MODULE_BY_ID[moduleId]
  const parts = buildings
    .map((b) => b.moduleSummaries.find((s) => s.moduleId === moduleId))
    .filter((x): x is ModuleSummary => Boolean(x))

  const statuses = parts.map((p) => p.overallStatus)
  const status: Status = parts.length ? aggregateStatus(statuses) : 'not_installed'

  const s: ModuleSummary = {
    moduleId,
    moduleName: m.name,
    scopeType: 'campus',
    overallStatus: status,
    primaryLabel: '',
    dataQuality: parts.some((p) => p.dataQuality !== 'fresh')
      ? parts.some((p) => p.dataQuality === 'missing')
        ? 'partial'
        : 'stale'
      : 'fresh',
    criticalCount: parts.reduce((n, p) => n + num(p.criticalCount), 0),
    warningCount: parts.reduce((n, p) => n + num(p.warningCount), 0),
    maintenanceCount: parts.reduce((n, p) => n + num(p.maintenanceCount), 0),
    attentionItems: parts.flatMap((p) => p.attentionItems ?? []),
    ageSeconds: Math.max(0, ...parts.map((p) => p.ageSeconds ?? 0)),
  }

  const sumOnline = parts.reduce((n, p) => n + num(p.onlineCount), 0)
  const sumTotal = parts.reduce((n, p) => n + num(p.totalCount), 0)
  const sumOffline = parts.reduce((n, p) => n + num(p.offlineCount), 0)

  switch (m.archetype) {
    case 'fleet': {
      s.onlineCount = sumOnline
      s.totalCount = sumTotal
      s.offlineCount = sumOffline
      if (moduleId === 'hvac') {
        const standby = parts.reduce(
          (n, p) => n + num(p.breakdown?.find((x) => x.label === 'Standby')?.value as number),
          0,
        )
        const fault = parts.reduce(
          (n, p) => n + num(p.breakdown?.find((x) => x.label === 'Fault')?.value as number),
          0,
        )
        s.primaryMetric = `${sumOnline} / ${sumTotal}`
        s.primaryLabel = 'Operational'
        s.secondaryMetric1 = { label: 'Standby', value: standby }
        s.secondaryMetric2 = { label: sumOffline ? 'Offline' : 'Fault', value: sumOffline || fault }
        s.breakdown = [
          { label: 'Running', value: sumOnline },
          { label: 'Standby', value: standby },
          { label: 'Fault', value: fault },
          { label: 'Offline', value: sumOffline },
        ]
      } else if (moduleId === 'cctv') {
        s.primaryMetric = `${sumOnline} / ${sumTotal}`
        s.primaryLabel = 'Cameras Online'
        s.secondaryMetric1 = { label: 'Offline', value: sumOffline }
        s.secondaryMetric2 = { label: 'Recording Faults', value: 0 }
        s.breakdown = [
          { label: 'Online', value: sumOnline },
          { label: 'Offline', value: sumOffline },
          { label: 'Recording Faults', value: 0 },
        ]
      } else if (moduleId === 'lighting') {
        s.primaryMetric = `${sumOnline} / ${sumTotal}`
        s.primaryLabel = 'Zones Healthy'
        const active = parts.reduce(
          (n, p) => n + num(p.secondaryMetric1?.value as number),
          0,
        )
        s.secondaryMetric1 = { label: 'Active Zones', value: active }
        s.secondaryMetric2 = { label: 'Faults', value: 0 }
      } else if (moduleId === 'access_control') {
        s.primaryMetric = `${sumOnline} / ${sumTotal}`
        s.primaryLabel = 'Doors Online'
        s.secondaryMetric1 = { label: 'Forced / Held', value: 0 }
        s.secondaryMetric2 = { label: 'Comm Faults', value: sumOffline }
      } else {
        // network
        s.primaryMetric = `${sumOnline} / ${sumTotal}`
        s.primaryLabel = 'Controllers Online'
        s.secondaryMetric1 = { label: 'Offline', value: sumOffline }
        const noData = parts.reduce(
          (n, p) => n + num(p.secondaryMetric2?.value as number),
          0,
        )
        s.secondaryMetric2 = { label: 'No Data', value: noData }
      }
      break
    }
    case 'production': {
      const sumPrimary = parts.reduce((n, p) => n + num(p.primaryMetric as number), 0)
      if (moduleId === 'energy') {
        const today = parts.reduce((n, p) => n + num(p.secondaryMetric1?.value as number), 0)
        s.primaryMetric = sumPrimary
        s.primaryUnit = 'kW'
        s.primaryLabel = 'Campus Demand'
        s.secondaryMetric1 = { label: 'Today', value: Math.round(today / 100) / 10, unit: 'MWh' }
        s.secondaryMetric2 = { label: 'Feeders', value: 'Online' }
        s.trend = { period: 'demand 24h', values: seededTrend('campus:energy', 16, sumPrimary, sumPrimary * 0.16) }
      } else if (moduleId === 'solar') {
        const today = parts.reduce((n, p) => n + Number(p.secondaryMetric1?.value ?? 0), 0)
        s.primaryMetric = sumPrimary
        s.primaryUnit = 'kW'
        s.primaryLabel = 'Current Generation'
        s.secondaryMetric1 = { label: 'Today', value: Math.round(today * 10) / 10, unit: 'MWh' }
        s.secondaryMetric2 = { label: 'Inverters', value: `${sumOnline} / ${sumTotal}` }
        s.onlineCount = sumOnline
        s.totalCount = sumTotal
        s.trend = { period: 'output 24h', values: seededTrend('campus:solar', 16, sumPrimary, sumPrimary * 0.22) }
      } else {
        // generators
        const running = parts.reduce((n, p) => n + num(p.secondaryMetric1?.value as number), 0)
        const fuelMin = Math.min(...parts.map((p) => num(p.secondaryMetric2?.value as number)))
        s.primaryMetric = `${sumOnline} / ${sumTotal}`
        s.primaryLabel = 'Ready · Standby'
        s.onlineCount = sumOnline
        s.totalCount = sumTotal
        s.secondaryMetric1 = { label: 'Running', value: running }
        s.secondaryMetric2 = { label: 'Lowest Fuel', value: fuelMin, unit: '%' }
        s.contextNote = 'All sets on standby — 0 kW expected'
      }
      break
    }
    case 'process': {
      const minPressure = Math.min(...parts.map((p) => num(p.primaryMetric as number)))
      if (moduleId === 'fire_fighting') {
        const pumps = parts.reduce((n, p) => {
          const [ready] = String(p.secondaryMetric1?.value ?? '0 / 0').split(' / ')
          return n + Number(ready)
        }, 0)
        const pumpsTotal = parts.reduce((n, p) => {
          const parts2 = String(p.secondaryMetric1?.value ?? '0 / 0').split(' / ')
          return n + Number(parts2[1] ?? 0)
        }, 0)
        const lowestTank = Math.min(...parts.map((p) => num(p.secondaryMetric2?.value as number)))
        s.primaryMetric = minPressure
        s.primaryUnit = 'bar'
        s.primaryLabel = 'Main Header Pressure'
        s.secondaryMetric1 = { label: 'Pumps Ready', value: `${pumps} / ${pumpsTotal}` }
        s.secondaryMetric2 = { label: 'Lowest Tank', value: lowestTank, unit: '%' }
        s.trend = { period: 'pressure 24h', values: seededTrend('campus:ff', 12, minPressure, 0.08) }
      } else {
        // water
        const lowestTank = Math.min(...parts.map((p) => num(p.secondaryMetric1?.value as number)))
        s.primaryMetric = minPressure
        s.primaryUnit = 'bar'
        s.primaryLabel = 'Lowest Supply Pressure'
        s.secondaryMetric1 = { label: 'Lowest Tank', value: lowestTank, unit: '%' }
        s.secondaryMetric2 = { label: 'Pumps', value: 'Healthy' }
        s.trend = { period: 'pressure 24h', values: seededTrend('campus:water', 12, minPressure, 0.12) }
      }
      break
    }
    case 'state': {
      if (moduleId === 'fire_alarm') {
        const active = parts.reduce((n, p) => n + num(p.primaryMetric as number), 0)
        const faults = parts.reduce((n, p) => n + num(p.secondaryMetric1?.value as number), 0)
        const isolated = parts.reduce((n, p) => n + num(p.secondaryMetric2?.value as number), 0)
        s.primaryMetric = active
        s.primaryLabel = 'Active Alarms'
        s.secondaryMetric1 = { label: 'Faults', value: faults }
        s.secondaryMetric2 = { label: 'Isolated', value: isolated }
        s.maintenanceCount = isolated
      } else {
        // public address
        s.primaryMetric = `${sumOnline} / ${sumTotal}`
        s.primaryLabel = 'Zones Available'
        s.onlineCount = sumOnline
        s.totalCount = sumTotal
        const faults = parts.reduce((n, p) => n + num(p.secondaryMetric1?.value as number), 0)
        s.secondaryMetric1 = { label: 'Amplifier Faults', value: faults }
        s.secondaryMetric2 = { label: 'Mode', value: 'Standby' }
      }
      break
    }
    case 'capacity': {
      if (moduleId === 'parking') {
        const occupied = parts.reduce((n, p) => n + num(p.onlineCount), 0)
        const capacity = parts.reduce((n, p) => n + num(p.totalCount), 0)
        s.primaryMetric = `${occupied} / ${capacity}`
        s.primaryLabel = 'Occupied'
        s.onlineCount = occupied
        s.totalCount = capacity
        s.secondaryMetric1 = { label: 'Available', value: capacity - occupied }
        s.secondaryMetric2 = { label: 'ANPR', value: 'Online' }
      } else {
        // occupancy
        const people = parts.reduce((n, p) => n + num(p.primaryMetric as number), 0)
        const capacity = parts.reduce((n, p) => n + num(p.secondaryMetric1?.value as number), 0)
        s.primaryMetric = people
        s.primaryLabel = 'People Onsite'
        s.onlineCount = people
        s.totalCount = capacity
        s.secondaryMetric1 = { label: 'Capacity', value: capacity }
        s.secondaryMetric2 = { label: 'Utilisation', value: Math.round((people / capacity) * 100), unit: '%' }
        s.trend = { period: 'occupancy 24h', values: seededTrend('campus:occ', 16, people, people * 0.35) }
      }
      break
    }
  }

  return s
}

export function rollupAllCampusModules(buildings: BuildingSummary[]): ModuleSummary[] {
  return MODULES.map((m) => rollupCampusModule(m.id, buildings))
}

// --- Building status recompute ---------------------------------------------

export function recomputeBuilding(b: BuildingSummary): void {
  const statuses = b.moduleSummaries.map((s) => s.overallStatus)
  // A downed controller reads as OFFLINE at the building level.
  b.overallStatus =
    b.connectivityState === 'offline'
      ? 'offline'
      : statuses.length
        ? aggregateStatus(statuses)
        : 'unknown'
  b.activeCriticalCount = b.moduleSummaries.filter(
    (s) => s.overallStatus === 'critical',
  ).length
  b.activeWarningCount = b.moduleSummaries.filter(
    (s) => s.overallStatus === 'warning' || s.overallStatus === 'attention',
  ).length
}

// --- Campus summary recompute ----------------------------------------------

function statusIsWarning(st: Status): boolean {
  return st === 'warning' || st === 'attention' || st === 'partial_data'
}

export function recomputeCampus(state: CampusState): void {
  const buildings = state.buildings
  buildings.forEach(recomputeBuilding)
  state.campusModules = rollupAllCampusModules(buildings)

  // Count from briefing (active events) so severity matches the rail.
  const active = state.briefing.filter((e) => e.status === 'active')
  const critical = active.filter((e) => e.severity === 'critical').length
  const warning = active.filter((e) => e.severity === 'warning').length
  const maintenance = active.filter((e) => e.severity === 'maintenance').length

  const noDataCount = buildings.reduce(
    (n, b) =>
      n +
      b.moduleSummaries.filter(
        (s) => s.overallStatus === 'no_data' || s.overallStatus === 'offline',
      ).length,
    0,
  )

  const peopleOnsite = buildings.reduce((n, b) => n + (b.occupancy ?? 0), 0)
  const currentDemandKw = buildings.reduce((n, b) => n + (b.energyDemandKw ?? 0), 0)

  // Connectivity: sum fleet + life-safety device counts campus-wide.
  const fleetModules = ['hvac', 'cctv', 'access_control', 'network', 'lighting']
  let totalAssets = 0
  let connectedAssets = 0
  buildings.forEach((b) => {
    b.moduleSummaries.forEach((s) => {
      if (fleetModules.includes(s.moduleId) && s.totalCount) {
        totalAssets += s.totalCount
        connectedAssets += s.onlineCount ?? s.totalCount
      }
    })
  })

  let overall: Status = 'normal'
  if (critical > 0) overall = 'critical'
  else if (warning > 0 || buildings.some((b) => statusIsWarning(b.overallStatus))) overall = 'attention'
  else if (state.connection === 'lost') overall = 'stale'
  else if (noDataCount > 0) overall = 'partial_data'

  state.campus = {
    overallStatus: overall,
    criticalCount: critical,
    warningCount: warning,
    maintenanceCount: maintenance,
    noDataCount,
    peopleOnsite,
    currentDemandKw,
    peakDemandKw: 596,
    connectedAssets,
    totalAssets,
    dataQuality:
      state.connection === 'lost' ? 'stale' : noDataCount > 0 ? 'partial' : 'fresh',
    lastUpdated: state.lastReliableUpdate,
  }
}

// --- Base state -------------------------------------------------------------

export function buildBaseState(now: number, scenarioId: string): CampusState {
  const ctx: Ctx = { now }
  const buildings = BUILDINGS.map((b) => buildBuilding(b, ctx))
  const state: CampusState = {
    scenarioId,
    now,
    connection: 'live',
    lastReliableUpdate: new Date(now).toISOString(),
    campus: {
      overallStatus: 'normal',
      criticalCount: 0,
      warningCount: 0,
      maintenanceCount: 0,
      dataQuality: 'fresh',
    },
    buildings,
    campusModules: [],
    briefing: [],
  }
  recomputeCampus(state)
  return state
}

// --- Patch helpers (used by scenarios) --------------------------------------

export function getBuilding(state: CampusState, id: string): BuildingSummary | undefined {
  return state.buildings.find((b) => b.buildingId === id)
}

export function getModule(
  state: CampusState,
  buildingId: string,
  moduleId: string,
): ModuleSummary | undefined {
  return getBuilding(state, buildingId)?.moduleSummaries.find((s) => s.moduleId === moduleId)
}

export function patchModule(
  state: CampusState,
  buildingId: string,
  moduleId: string,
  patch: Partial<ModuleSummary>,
): void {
  const mod = getModule(state, buildingId, moduleId)
  if (mod) Object.assign(mod, patch)
}

export function setSecondary(m: ModuleSummary, slot: 1 | 2, metric: Metric): void {
  if (slot === 1) m.secondaryMetric1 = metric
  else m.secondaryMetric2 = metric
}

export { statusMeta }
