import type { AttentionItem, CampusState, Severity } from '@/types'
import {
  buildBaseState,
  getBuilding,
  getModule,
  patchModule,
  recomputeCampus,
} from './generator'

// ---------------------------------------------------------------------------
// Demo scenarios. Each returns a full CampusState built from the healthy
// baseline plus targeted patches, so switching scenarios is a single swap.
// Timestamps are relative to `now` so live counters keep advancing.
// ---------------------------------------------------------------------------

export type ScenarioId =
  | 'normal'
  | 'warning'
  | 'critical'
  | 'degraded'
  | 'connection_lost'

export interface ScenarioMeta {
  id: ScenarioId
  label: string
  hint: string
}

export const SCENARIOS: ScenarioMeta[] = [
  { id: 'normal', label: 'Normal', hint: '0 critical · calm campus' },
  { id: 'warning', label: 'Warning', hint: 'HVAC · CCTV · Water degraded' },
  { id: 'critical', label: 'Critical', hint: 'Fire Alarm — Delta 7' },
  { id: 'degraded', label: 'Data Degraded', hint: 'Stale · No Data · partial' },
  { id: 'connection_lost', label: 'Connection Lost', hint: 'Last-known, not live' },
]

let evtSeq = 0

interface EvtInput {
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
  offsetSeconds?: number // how long ago it started
  acknowledged?: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
  status?: 'active' | 'resolved'
  groupCount?: number
  lifeSafety?: boolean
  destination?: AttentionItem['destination']
}

function evt(now: number, i: EvtInput): AttentionItem {
  const offset = i.offsetSeconds ?? 0
  const start = now - offset * 1000
  return {
    id: `evt-${++evtSeq}`,
    severity: i.severity,
    systemId: i.systemId,
    systemName: i.systemName,
    buildingId: i.buildingId,
    buildingName: i.buildingName,
    location: i.location,
    assetId: i.assetId,
    assetName: i.assetName,
    title: i.title,
    description: i.description,
    startTime: new Date(start).toISOString(),
    durationSeconds: offset,
    acknowledged: i.acknowledged,
    acknowledgedBy: i.acknowledgedBy,
    acknowledgedAt: i.acknowledgedAt,
    status: i.status ?? 'active',
    groupCount: i.groupCount,
    lifeSafety: i.lifeSafety,
    destination: i.destination,
  }
}

// --- Shared maintenance/info/resolved texture (healthy-state usefulness) -----

function baselineTexture(state: CampusState, now: number): void {
  state.briefing.push(
    evt(now, {
      severity: 'maintenance',
      systemId: 'fire_alarm',
      systemName: 'Fire Alarm',
      buildingId: 'delta-5',
      buildingName: 'Delta 5',
      assetId: 'SD-5F1-022',
      assetName: 'Detector SD-5F1-022',
      title: 'Detector isolated for maintenance',
      description: 'Scheduled isolation · planned window 09:00–17:00',
      offsetSeconds: 5400,
      destination: { type: 'module', id: 'fire_alarm' },
    }),
    evt(now, {
      severity: 'maintenance',
      systemId: 'hvac',
      systemName: 'HVAC',
      buildingId: 'delta-6',
      buildingName: 'Delta 6',
      assetId: 'AHU-06-03',
      assetName: 'AHU-06-03',
      title: 'Scheduled filter service',
      description: 'Planned maintenance ticket WO-4471',
      offsetSeconds: 2700,
      destination: { type: 'module', id: 'hvac' },
    }),
    evt(now, {
      severity: 'info',
      systemId: 'access_control',
      systemName: 'Access Control',
      buildingId: 'delta-2',
      buildingName: 'Delta 2',
      title: 'Controller firmware updated',
      description: 'AC-02 firmware v3.8.1 applied',
      offsetSeconds: 1500,
      destination: { type: 'module', id: 'access_control' },
    }),
    evt(now, {
      severity: 'info',
      systemId: 'fire_fighting',
      systemName: 'Fire Fighting',
      buildingId: 'delta-3',
      buildingName: 'Delta 3',
      assetName: 'Header Pressure',
      title: 'Header pressure restored',
      description: 'Recovered to 8.0 bar',
      offsetSeconds: 480,
      status: 'resolved',
      destination: { type: 'module', id: 'fire_fighting' },
    }),
    evt(now, {
      severity: 'info',
      systemId: 'cctv',
      systemName: 'CCTV',
      buildingId: 'delta-1',
      buildingName: 'Delta 1',
      assetName: 'CAM-01-118',
      title: 'Camera communication restored',
      offsetSeconds: 1020,
      status: 'resolved',
      destination: { type: 'module', id: 'cctv' },
    }),
  )
  // Reflect the two active maintenance isolations on the module cards.
  patchModule(state, 'delta-5', 'fire_alarm', { overallStatus: 'maintenance', secondaryMetric2: { label: 'Isolated', value: 1 }, maintenanceCount: 1 })
  patchModule(state, 'delta-6', 'hvac', { maintenanceCount: 1 })
}

// --- Warning injections (shared by warning + critical) ----------------------

function injectHvacDelta4(state: CampusState, now: number): void {
  const mod = getModule(state, 'delta-4', 'hvac')
  if (!mod) return
  const total = mod.totalCount ?? 17
  const standby = Number(mod.secondaryMetric1?.value ?? 2)
  const offline = 2
  const operational = total - standby - offline
  const attention: AttentionItem[] = [
    evt(now, { severity: 'warning', systemId: 'hvac', systemName: 'HVAC', buildingId: 'delta-4', buildingName: 'Delta 4', assetId: 'AHU-04', assetName: 'AHU-04', title: 'Communication lost', offsetSeconds: 720, destination: { type: 'module', id: 'hvac' } }),
    evt(now, { severity: 'warning', systemId: 'hvac', systemName: 'HVAC', buildingId: 'delta-4', buildingName: 'Delta 4', assetId: 'AHU-06', assetName: 'AHU-06', title: 'Temperature fault', offsetSeconds: 480, destination: { type: 'module', id: 'hvac' } }),
  ]
  patchModule(state, 'delta-4', 'hvac', {
    overallStatus: 'warning',
    primaryMetric: `${operational} / ${total}`,
    onlineCount: operational,
    offlineCount: offline,
    secondaryMetric1: { label: 'Standby', value: standby },
    secondaryMetric2: { label: 'Unavailable', value: offline },
    warningCount: 2,
    breakdown: [
      { label: 'Running', value: operational },
      { label: 'Standby', value: standby },
      { label: 'Fault', value: 1 },
      { label: 'Offline', value: 1 },
    ],
    attentionItems: attention,
  })
  state.briefing.push(
    evt(now, {
      severity: 'warning',
      systemId: 'hvac',
      systemName: 'HVAC',
      buildingId: 'delta-4',
      buildingName: 'Delta 4',
      title: '2 AHUs unavailable',
      description: 'AHU-04 comm loss · AHU-06 temperature fault',
      offsetSeconds: 720,
      groupCount: 2,
      destination: { type: 'module', id: 'hvac' },
    }),
  )
}

function injectCctvDelta9(state: CampusState, now: number): void {
  const mod = getModule(state, 'delta-9', 'cctv')
  if (!mod) return
  const total = mod.totalCount ?? 42
  const offline = 4
  patchModule(state, 'delta-9', 'cctv', {
    overallStatus: 'warning',
    primaryMetric: `${total - offline} / ${total}`,
    onlineCount: total - offline,
    offlineCount: offline,
    secondaryMetric1: { label: 'Offline', value: offline },
    secondaryMetric2: { label: 'Group', value: 'East Wing' },
    warningCount: 1,
    breakdown: [
      { label: 'Online', value: total - offline },
      { label: 'Offline', value: offline },
      { label: 'Recording Faults', value: 0 },
    ],
    attentionItems: [
      evt(now, { severity: 'warning', systemId: 'cctv', systemName: 'CCTV', buildingId: 'delta-9', buildingName: 'Delta 9', location: 'East Wing', title: '4 cameras offline', description: 'CAM-09-201…204 · common switch suspected', offsetSeconds: 720, groupCount: 4 }),
    ],
  })
  state.briefing.push(
    evt(now, {
      severity: 'warning',
      systemId: 'cctv',
      systemName: 'CCTV',
      buildingId: 'delta-9',
      buildingName: 'Delta 9',
      location: 'East Wing group',
      title: '4 cameras offline',
      description: 'East Wing group · common switch suspected',
      offsetSeconds: 720,
      groupCount: 4,
      destination: { type: 'module', id: 'cctv' },
    }),
  )
}

function injectWaterDelta3(state: CampusState, now: number): void {
  patchModule(state, 'delta-3', 'water', {
    overallStatus: 'warning',
    primaryMetric: 2.1,
    primaryUnit: 'bar',
    secondaryMetric1: { label: 'Tank Level', value: 41, unit: '%' },
    secondaryMetric2: { label: 'Duty Pump', value: 'Cycling' },
    warningCount: 1,
    breakdown: [
      { label: 'Supply Pressure', value: 2.1, unit: 'bar' },
      { label: 'Nominal', value: '3.6 bar' },
      { label: 'Tank Level', value: 41, unit: '%' },
      { label: 'Duty Pump', value: 'Cycling frequently' },
    ],
  })
  state.briefing.push(
    evt(now, {
      severity: 'warning',
      systemId: 'water',
      systemName: 'Water',
      buildingId: 'delta-3',
      buildingName: 'Delta 3',
      assetName: 'Zone 3 Riser',
      title: 'Supply pressure below threshold',
      description: '2.1 bar (nominal 3.6 bar) · duty pump cycling',
      offsetSeconds: 1560,
      destination: { type: 'module', id: 'water' },
    }),
  )
}

function injectHvacDelta6Fault(state: CampusState, now: number): void {
  const mod = getModule(state, 'delta-6', 'hvac')
  if (!mod) return
  const total = mod.totalCount ?? 13
  const standby = Number(mod.secondaryMetric1?.value ?? 2)
  const fault = 1
  patchModule(state, 'delta-6', 'hvac', {
    overallStatus: 'warning',
    primaryMetric: `${total - standby - fault} / ${total}`,
    onlineCount: total - standby - fault,
    secondaryMetric1: { label: 'Standby', value: standby },
    secondaryMetric2: { label: 'Fault', value: fault },
    warningCount: 1,
    breakdown: [
      { label: 'Running', value: total - standby - fault },
      { label: 'Standby', value: standby },
      { label: 'Fault', value: fault },
      { label: 'Offline', value: 0 },
    ],
    attentionItems: [
      evt(now, { severity: 'warning', systemId: 'hvac', systemName: 'HVAC', buildingId: 'delta-6', buildingName: 'Delta 6', assetId: 'AHU-06-01', assetName: 'AHU-06-01', title: 'Supply air temperature high', offsetSeconds: 900 }),
    ],
  })
  state.briefing.push(
    evt(now, {
      severity: 'warning',
      systemId: 'hvac',
      systemName: 'HVAC',
      buildingId: 'delta-6',
      buildingName: 'Delta 6',
      title: 'AHU supply temperature high',
      description: 'AHU-06-01 · supply air 26.4 °C',
      offsetSeconds: 900,
      destination: { type: 'module', id: 'hvac' },
    }),
  )
}

// --- Scenario builders ------------------------------------------------------

function scenarioNormal(now: number): CampusState {
  const state = buildBaseState(now, 'normal')
  baselineTexture(state, now)
  recomputeCampus(state)
  return state
}

function scenarioWarning(now: number): CampusState {
  const state = buildBaseState(now, 'warning')
  baselineTexture(state, now)
  injectHvacDelta4(state, now)
  injectCctvDelta9(state, now)
  injectWaterDelta3(state, now)
  recomputeCampus(state)
  return state
}

function scenarioCritical(now: number): CampusState {
  const state = buildBaseState(now, 'critical')
  baselineTexture(state, now)
  // Life-safety critical: Fire Alarm — Delta 7, Floor 2, East Corridor.
  patchModule(state, 'delta-7', 'fire_alarm', {
    overallStatus: 'critical',
    primaryMetric: 1,
    primaryLabel: 'Active Alarm',
    secondaryMetric1: { label: 'Faults', value: 0 },
    secondaryMetric2: { label: 'Zone', value: 'F2 East' },
    criticalCount: 1,
    attentionItems: [
      evt(now, {
        severity: 'critical',
        systemId: 'fire_alarm',
        systemName: 'Fire Alarm',
        buildingId: 'delta-7',
        buildingName: 'Delta 7',
        location: 'Floor 2 · East Corridor',
        assetId: 'SD-7F2-034',
        assetName: 'Smoke Detector SD-7F2-034',
        title: 'Smoke detected',
        offsetSeconds: 222,
        lifeSafety: true,
        destination: { type: 'incident', id: 'INC-7742' },
      }),
    ],
  })
  const b7 = getBuilding(state, 'delta-7')
  if (b7) b7.connectivityState = 'online'
  state.briefing.push(
    evt(now, {
      severity: 'critical',
      systemId: 'fire_alarm',
      systemName: 'Fire Alarm',
      buildingId: 'delta-7',
      buildingName: 'Delta 7',
      location: 'Floor 2 · East Corridor',
      assetId: 'SD-7F2-034',
      assetName: 'Smoke Detector SD-7F2-034',
      title: 'Fire alarm activated',
      description: 'Smoke Detector SD-7F2-034',
      offsetSeconds: 222,
      acknowledged: true,
      acknowledgedBy: 'M. Ali',
      acknowledgedAt: new Date(now - 150 * 1000).toISOString(),
      lifeSafety: true,
      destination: { type: 'incident', id: 'INC-7742' },
    }),
  )
  // Secondary conditions that must remain accessible but visually subordinate.
  injectHvacDelta4(state, now)
  injectHvacDelta6Fault(state, now)
  injectCctvDelta9(state, now)
  recomputeCampus(state)
  return state
}

function scenarioDegraded(now: number): CampusState {
  const state = buildBaseState(now, 'degraded')
  state.connection = 'delayed'
  baselineTexture(state, now)

  // Delta 2 building controller offline → subsystems no_data, building offline.
  const b2 = getBuilding(state, 'delta-2')
  if (b2) {
    b2.connectivityState = 'offline'
    b2.lastUpdated = new Date(now - 315 * 1000).toISOString()
    b2.moduleSummaries.forEach((m) => {
      // Life-safety stays "unknown" (never assert healthy), rest → no_data.
      m.overallStatus = 'no_data'
      m.dataQuality = 'missing'
      m.ageSeconds = 315
    })
  }
  state.briefing.push(
    evt(now, {
      severity: 'warning',
      systemId: 'network',
      systemName: 'Network / BMS',
      buildingId: 'delta-2',
      buildingName: 'Delta 2',
      assetId: 'BMS-CTRL-02',
      assetName: 'Building Controller BMS-CTRL-02',
      title: 'Building controller unreachable',
      description: 'No telemetry from Delta 2 subsystems',
      offsetSeconds: 315,
      destination: { type: 'module', id: 'network' },
    }),
  )

  // Stale module: Delta 5 energy telemetry aging past threshold.
  patchModule(state, 'delta-5', 'energy', {
    overallStatus: 'stale',
    dataQuality: 'stale',
    ageSeconds: 138,
    secondaryMetric2: { label: 'Feed', value: 'Stale' },
  })

  // Partial telemetry: Delta 4 HVAC — some units reporting, some no-data.
  const hvac4 = getModule(state, 'delta-4', 'hvac')
  if (hvac4) {
    const total = hvac4.totalCount ?? 17
    const offline = 2
    const noData = 3
    const operational = total - offline - noData
    patchModule(state, 'delta-4', 'hvac', {
      overallStatus: 'partial_data',
      dataQuality: 'partial',
      primaryMetric: `${operational}`,
      primaryLabel: 'Reporting Operational',
      onlineCount: operational,
      offlineCount: offline,
      secondaryMetric1: { label: 'Offline', value: offline },
      secondaryMetric2: { label: 'No Data', value: noData },
      contextNote: 'Partial telemetry — overall state incomplete',
      breakdown: [
        { label: 'Operational (reporting)', value: operational },
        { label: 'Offline', value: offline },
        { label: 'No Data', value: noData },
        { label: 'Total', value: total },
      ],
    })
  }

  // Alarm storm (grouped): Delta 10 FCU communication loss.
  const net10 = getModule(state, 'delta-10', 'network')
  if (net10) {
    const total = net10.totalCount ?? 9
    patchModule(state, 'delta-10', 'network', {
      overallStatus: 'warning',
      onlineCount: total - 1,
      offlineCount: 1,
      secondaryMetric1: { label: 'Offline', value: 1 },
      secondaryMetric2: { label: 'No Data', value: 12 },
    })
  }
  state.briefing.push(
    evt(now, {
      severity: 'warning',
      systemId: 'hvac',
      systemName: 'HVAC',
      buildingId: 'delta-10',
      buildingName: 'Delta 10',
      title: '12 FCUs reporting communication loss',
      description: 'Common field bus segment · grouped',
      offsetSeconds: 540,
      groupCount: 12,
      destination: { type: 'event', id: 'grp-fcu-10' },
    }),
  )

  recomputeCampus(state)
  return state
}

function scenarioConnectionLost(now: number): CampusState {
  const state = buildBaseState(now, 'connection_lost')
  state.connection = 'lost'
  state.lastReliableUpdate = new Date(now - 95 * 1000).toISOString()
  baselineTexture(state, now)

  // Everything becomes last-known / stale. Never present as live.
  state.buildings.forEach((b) => {
    b.connectivityState = 'unknown'
    b.lastUpdated = state.lastReliableUpdate
    b.moduleSummaries.forEach((m) => {
      m.dataQuality = 'stale'
      m.ageSeconds = 95
      if (m.overallStatus === 'normal') m.overallStatus = 'stale'
    })
  })
  state.briefing.push(
    evt(now, {
      severity: 'critical',
      systemId: 'network',
      systemName: 'Network / BMS',
      title: 'Backend connection lost',
      description: 'Showing last-known values — telemetry is not live',
      offsetSeconds: 95,
      destination: { type: 'module', id: 'network' },
    }),
  )
  recomputeCampus(state)
  // Force campus posture to stale (not attention) — feed is the problem.
  state.campus.overallStatus = 'stale'
  state.campus.dataQuality = 'stale'
  return state
}

const BUILDERS: Record<ScenarioId, (now: number) => CampusState> = {
  normal: scenarioNormal,
  warning: scenarioWarning,
  critical: scenarioCritical,
  degraded: scenarioDegraded,
  connection_lost: scenarioConnectionLost,
}

export function buildScenario(id: ScenarioId, now: number): CampusState {
  evtSeq = 0
  return (BUILDERS[id] ?? scenarioNormal)(now)
}
