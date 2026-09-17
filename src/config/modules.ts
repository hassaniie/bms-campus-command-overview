import type { LucideIcon } from 'lucide-react'
import {
  Fan,
  Lightbulb,
  Droplets,
  Zap,
  Sun,
  Fuel,
  Flame,
  FireExtinguisher,
  Megaphone,
  DoorClosed,
  Cctv,
  SquareParking,
  Users,
  Network,
} from 'lucide-react'
import type { Archetype } from '@/types'

export type SystemGroupId = 'environment' | 'energy' | 'lifesafety' | 'security' | 'operations'

export interface ModuleConfig {
  id: string
  name: string
  icon: LucideIcon
  archetype: Archetype
  group: SystemGroupId
  /** Freshness threshold (seconds) after which telemetry is considered stale. */
  staleAfterSeconds: number
  /** Whether a compact trend is operationally meaningful for this module. */
  supportsTrend: boolean
  /** Life-safety systems can override visual hierarchy on critical. */
  lifeSafety?: boolean
}

// Registry is intentionally flat + data-driven. Adding a module = one entry.
export const MODULES: ModuleConfig[] = [
  { id: 'hvac', name: 'HVAC', icon: Fan, archetype: 'fleet', group: 'environment', staleAfterSeconds: 45, supportsTrend: true },
  { id: 'lighting', name: 'Lighting', icon: Lightbulb, archetype: 'fleet', group: 'environment', staleAfterSeconds: 60, supportsTrend: false },
  { id: 'water', name: 'Water', icon: Droplets, archetype: 'process', group: 'environment', staleAfterSeconds: 60, supportsTrend: true },
  { id: 'energy', name: 'Energy', icon: Zap, archetype: 'production', group: 'energy', staleAfterSeconds: 20, supportsTrend: true },
  { id: 'solar', name: 'Solar', icon: Sun, archetype: 'production', group: 'energy', staleAfterSeconds: 30, supportsTrend: true },
  { id: 'generators', name: 'Generators', icon: Fuel, archetype: 'production', group: 'energy', staleAfterSeconds: 60, supportsTrend: false },
  { id: 'fire_alarm', name: 'Fire Alarm', icon: Flame, archetype: 'state', group: 'lifesafety', staleAfterSeconds: 30, supportsTrend: false, lifeSafety: true },
  { id: 'fire_fighting', name: 'Fire Fighting', icon: FireExtinguisher, archetype: 'process', group: 'lifesafety', staleAfterSeconds: 45, supportsTrend: true, lifeSafety: true },
  { id: 'public_address', name: 'Public Address', icon: Megaphone, archetype: 'state', group: 'lifesafety', staleAfterSeconds: 60, supportsTrend: false, lifeSafety: true },
  { id: 'cctv', name: 'CCTV', icon: Cctv, archetype: 'fleet', group: 'security', staleAfterSeconds: 45, supportsTrend: false },
  { id: 'access_control', name: 'Access Control', icon: DoorClosed, archetype: 'fleet', group: 'security', staleAfterSeconds: 45, supportsTrend: false },
  { id: 'parking', name: 'Parking', icon: SquareParking, archetype: 'capacity', group: 'operations', staleAfterSeconds: 45, supportsTrend: false },
  { id: 'occupancy', name: 'Occupancy', icon: Users, archetype: 'capacity', group: 'operations', staleAfterSeconds: 45, supportsTrend: true },
  { id: 'network', name: 'Network / BMS', icon: Network, archetype: 'fleet', group: 'operations', staleAfterSeconds: 30, supportsTrend: false },
]

export const MODULE_BY_ID: Record<string, ModuleConfig> = Object.fromEntries(
  MODULES.map((m) => [m.id, m]),
)

export function moduleName(id?: string): string {
  if (!id) return 'All Systems'
  return MODULE_BY_ID[id]?.name ?? id
}

export interface SystemGroup {
  id: SystemGroupId
  label: string
  moduleIds: string[]
}

// Subtle grouping (02 → Optional system grouping). Order = scanning priority.
export const SYSTEM_GROUPS: SystemGroup[] = [
  { id: 'lifesafety', label: 'Life Safety', moduleIds: ['fire_alarm', 'fire_fighting', 'public_address'] },
  { id: 'environment', label: 'Environment', moduleIds: ['hvac', 'lighting', 'water'] },
  { id: 'energy', label: 'Energy', moduleIds: ['energy', 'solar', 'generators'] },
  { id: 'security', label: 'Security', moduleIds: ['cctv', 'access_control'] },
  { id: 'operations', label: 'Operations', moduleIds: ['parking', 'occupancy', 'network'] },
]
