import type { LucideIcon } from 'lucide-react'
import {
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  Wrench,
  PowerOff,
  Minus,
  CircleSlash,
  HelpCircle,
  CircleDashed,
  Ban,
  Lock,
  Clock4,
  Info,
} from 'lucide-react'
import type { Status, Severity, DataQuality } from '@/types'

export interface StatusMeta {
  /** Explicit text label — never rely on color alone. */
  label: string
  /** Compact ASCII glyph used in dense/mono contexts (e.g. `● NORMAL`). */
  glyph: string
  icon: LucideIcon
  /** Foreground text color class. */
  fg: string
  /** Solid/marker color class (bg). */
  dot: string
  /** Subtle tint background for chips/badges. */
  tint: string
  /** Border color class. */
  border: string
  /** Raw hex for SVG (Digital Twin). */
  hex: string
  /**
   * Attention rank: higher = more operationally important.
   * Drives sort priority and "which state dominates".
   */
  rank: number
  /** True if this state must never be read as "healthy". */
  notHealthy: boolean
}

export const STATUS_META: Record<Status, StatusMeta> = {
  critical: {
    label: 'CRITICAL',
    glyph: '!',
    icon: OctagonAlert,
    fg: 'text-crit',
    dot: 'bg-crit',
    tint: 'bg-crit/10',
    border: 'border-crit/60',
    hex: '#ff4d55',
    rank: 100,
    notHealthy: true,
  },
  warning: {
    label: 'WARNING',
    glyph: '⚠',
    icon: AlertTriangle,
    fg: 'text-warn',
    dot: 'bg-warn',
    tint: 'bg-warn/10',
    border: 'border-warn/50',
    hex: '#ffb23e',
    rank: 80,
    notHealthy: true,
  },
  attention: {
    label: 'ATTENTION',
    glyph: '▲',
    icon: AlertTriangle,
    fg: 'text-warn',
    dot: 'bg-warn',
    tint: 'bg-warn/10',
    border: 'border-warn/40',
    hex: '#ffb23e',
    rank: 70,
    notHealthy: true,
  },
  partial_data: {
    label: 'PARTIAL DATA',
    glyph: '◐',
    icon: CircleDashed,
    fg: 'text-nodata',
    dot: 'bg-nodata',
    tint: 'bg-nodata/10',
    border: 'border-nodata/45',
    hex: '#a98bd8',
    rank: 62,
    notHealthy: true,
  },
  offline: {
    label: 'OFFLINE',
    glyph: '×',
    icon: PowerOff,
    fg: 'text-gone',
    dot: 'bg-gone',
    tint: 'bg-gone/10',
    border: 'border-gone/50',
    hex: '#6b7890',
    rank: 60,
    notHealthy: true,
  },
  no_data: {
    label: 'NO DATA',
    glyph: '—',
    icon: Minus,
    fg: 'text-nodata',
    dot: 'bg-nodata',
    tint: 'bg-nodata/10',
    border: 'border-nodata/45',
    hex: '#a98bd8',
    rank: 58,
    notHealthy: true,
  },
  stale: {
    label: 'STALE',
    glyph: '⧗',
    icon: Clock4,
    fg: 'text-nodata',
    dot: 'bg-nodata',
    tint: 'bg-nodata/10',
    border: 'border-nodata/40',
    hex: '#a98bd8',
    rank: 55,
    notHealthy: true,
  },
  unknown: {
    label: 'UNKNOWN',
    glyph: '?',
    icon: HelpCircle,
    fg: 'text-nodata',
    dot: 'bg-nodata',
    tint: 'bg-nodata/10',
    border: 'border-nodata/40',
    hex: '#a98bd8',
    rank: 50,
    notHealthy: true,
  },
  maintenance: {
    label: 'MAINTENANCE',
    glyph: '⚑',
    icon: Wrench,
    fg: 'text-steel-300',
    dot: 'bg-steel-400',
    tint: 'bg-steel-400/10',
    border: 'border-steel-400/35',
    hex: '#8ca0c4',
    rank: 40,
    notHealthy: false,
  },
  restricted: {
    label: 'RESTRICTED',
    glyph: '⊘',
    icon: Lock,
    fg: 'text-gone',
    dot: 'bg-gone',
    tint: 'bg-gone/10',
    border: 'border-gone/40',
    hex: '#6b7890',
    rank: 30,
    notHealthy: false,
  },
  disabled: {
    label: 'DISABLED',
    glyph: '⊘',
    icon: Ban,
    fg: 'text-gone',
    dot: 'bg-gone',
    tint: 'bg-gone/10',
    border: 'border-gone/40',
    hex: '#6b7890',
    rank: 25,
    notHealthy: false,
  },
  not_installed: {
    label: 'NOT INSTALLED',
    glyph: '∅',
    icon: CircleSlash,
    fg: 'text-ink-faint',
    dot: 'bg-base-500',
    tint: 'bg-base-700/40',
    border: 'border-base-600/60',
    hex: '#38496f',
    rank: 10,
    notHealthy: false,
  },
  normal: {
    label: 'NORMAL',
    glyph: '●',
    icon: CheckCircle2,
    fg: 'text-ok',
    dot: 'bg-ok',
    tint: 'bg-ok/10',
    border: 'border-ok/35',
    hex: '#37d99a',
    rank: 0,
    notHealthy: false,
  },
}

export function statusMeta(status: Status): StatusMeta {
  return STATUS_META[status] ?? STATUS_META.unknown
}

/** Pick the most operationally important status from a list. */
export function dominantStatus(statuses: Status[]): Status {
  if (statuses.length === 0) return 'unknown'
  return statuses.reduce((worst, s) =>
    statusMeta(s).rank > statusMeta(worst).rank ? s : worst,
  )
}

// --- Severity (Attention items) -------------------------------------------

export interface SeverityMeta {
  label: string
  icon: LucideIcon
  fg: string
  dot: string
  tint: string
  border: string
  rank: number
}

export const SEVERITY_META: Record<Severity, SeverityMeta> = {
  critical: {
    label: 'CRITICAL',
    icon: OctagonAlert,
    fg: 'text-crit',
    dot: 'bg-crit',
    tint: 'bg-crit/10',
    border: 'border-crit/55',
    rank: 100,
  },
  warning: {
    label: 'ATTENTION',
    icon: AlertTriangle,
    fg: 'text-warn',
    dot: 'bg-warn',
    tint: 'bg-warn/10',
    border: 'border-warn/45',
    rank: 80,
  },
  maintenance: {
    label: 'MAINTENANCE',
    icon: Wrench,
    fg: 'text-steel-300',
    dot: 'bg-steel-400',
    tint: 'bg-steel-400/10',
    border: 'border-steel-400/35',
    rank: 40,
  },
  info: {
    label: 'INFORMATION',
    icon: Info,
    fg: 'text-cyan',
    dot: 'bg-cyan',
    tint: 'bg-cyan/10',
    border: 'border-cyan/35',
    rank: 20,
  },
}

export function severityMeta(sev: Severity): SeverityMeta {
  return SEVERITY_META[sev] ?? SEVERITY_META.info
}

// --- Data quality ----------------------------------------------------------

export const DATA_QUALITY_LABEL: Record<DataQuality, string> = {
  fresh: 'Live',
  stale: 'Stale',
  partial: 'Partial telemetry',
  missing: 'No data',
  unknown: 'Unknown',
}

/** Is this status a healthy, trustworthy state? Used to keep "No Data ≠ Normal". */
export function isHealthy(status: Status): boolean {
  return status === 'normal'
}

/** Compact status label for tight contexts (card header badge). */
const SHORT: Partial<Record<Status, string>> = {
  maintenance: 'MAINT',
  not_installed: 'N/INST',
  partial_data: 'PARTIAL',
  restricted: 'RESTRICT',
  attention: 'ATTN',
}
export function statusShort(status: Status): string {
  return SHORT[status] ?? statusMeta(status).label
}
