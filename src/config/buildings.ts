// Campus building registry + isometric plan geometry for the Digital Twin.
// Plan coordinates are in abstract "plot" units; the DigitalTwin projects them
// to isometric screen space. Buildings are laid out with street gaps so the
// projected footprints stay individually readable.

export interface BuildingConfig {
  id: string
  name: string
  /** Short tag used on the twin footprint, e.g. "D4", "PP". */
  short: string
  /** Plan-space footprint: origin (x,y) + size (w depth d) in plot units. */
  plan: { x: number; y: number; w: number; d: number }
  /** Extrusion height in plot units (Parking Plaza is deliberately low). */
  height: number
  /** Baseline occupancy at a busy weekday midday. */
  occupancyBase: number
  /** Baseline electrical demand (kW). */
  energyBase: number
  /** Systems physically present. Others resolve to `not_installed`. */
  installedSystems: string[]
}

// Every Delta building carries the full stack except campus parking.
const FULL_STACK = [
  'hvac',
  'lighting',
  'water',
  'energy',
  'solar',
  'generators',
  'fire_alarm',
  'fire_fighting',
  'public_address',
  'access_control',
  'cctv',
  'occupancy',
  'network',
]

// The Parking Plaza is a structure, not an office block: no HVAC/solar/PA,
// but it owns the campus Parking system.
const PLAZA_STACK = [
  'lighting',
  'water',
  'energy',
  'generators',
  'fire_alarm',
  'fire_fighting',
  'access_control',
  'cctv',
  'parking',
  'occupancy',
  'network',
]

export const BUILDINGS: BuildingConfig[] = [
  { id: 'delta-1', name: 'Delta 1', short: 'D1', plan: { x: 1, y: 1, w: 6, d: 5 }, height: 4.5, occupancyBase: 96, energyBase: 44, installedSystems: FULL_STACK },
  { id: 'delta-2', name: 'Delta 2', short: 'D2', plan: { x: 9, y: 1, w: 5, d: 5 }, height: 5.5, occupancyBase: 78, energyBase: 39, installedSystems: FULL_STACK },
  { id: 'delta-3', name: 'Delta 3', short: 'D3', plan: { x: 16, y: 1, w: 6, d: 4 }, height: 4, occupancyBase: 64, energyBase: 33, installedSystems: FULL_STACK },
  { id: 'delta-4', name: 'Delta 4', short: 'D4', plan: { x: 1, y: 8, w: 5, d: 6 }, height: 6, occupancyBase: 120, energyBase: 58, installedSystems: FULL_STACK },
  { id: 'delta-5', name: 'Delta 5', short: 'D5', plan: { x: 8, y: 8, w: 4, d: 5 }, height: 5, occupancyBase: 71, energyBase: 36, installedSystems: FULL_STACK },
  { id: 'delta-6', name: 'Delta 6', short: 'D6', plan: { x: 14, y: 8, w: 5, d: 6 }, height: 6.5, occupancyBase: 108, energyBase: 52, installedSystems: FULL_STACK },
  { id: 'delta-7', name: 'Delta 7', short: 'D7', plan: { x: 21, y: 8, w: 6, d: 5 }, height: 7, occupancyBase: 134, energyBase: 61, installedSystems: FULL_STACK },
  { id: 'delta-8', name: 'Delta 8', short: 'D8', plan: { x: 2, y: 16, w: 5, d: 5 }, height: 4.5, occupancyBase: 58, energyBase: 30, installedSystems: FULL_STACK },
  { id: 'delta-9', name: 'Delta 9', short: 'D9', plan: { x: 9, y: 16, w: 6, d: 5 }, height: 5.5, occupancyBase: 88, energyBase: 41, installedSystems: FULL_STACK },
  { id: 'delta-10', name: 'Delta 10', short: 'D10', plan: { x: 17, y: 16, w: 5, d: 6 }, height: 6, occupancyBase: 74, energyBase: 38, installedSystems: FULL_STACK },
  { id: 'delta-11', name: 'Delta 11', short: 'D11', plan: { x: 3, y: 23, w: 7, d: 4 }, height: 4, occupancyBase: 63, energyBase: 32, installedSystems: FULL_STACK },
  { id: 'parking-plaza', name: 'Parking Plaza', short: 'PP', plan: { x: 13, y: 23, w: 11, d: 6 }, height: 2.4, occupancyBase: 0, energyBase: 21, installedSystems: PLAZA_STACK },
]

export const BUILDING_BY_ID: Record<string, BuildingConfig> = Object.fromEntries(
  BUILDINGS.map((b) => [b.id, b]),
)

export function buildingName(id?: string): string {
  if (!id) return 'Campus'
  return BUILDING_BY_ID[id]?.name ?? id
}
