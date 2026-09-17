import type { ModuleSummary } from '@/types'
import { MODULE_BY_ID } from '@/config/modules'
import { statusMeta, statusShort } from '@/lib/status'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Skeleton } from '@/components/common/Skeleton'
import { ArchetypeBody } from './archetypes'
import { clsx } from '@/lib/format'
import { formatAgo } from '@/lib/time'
import { AlertTriangle, OctagonAlert, CircleSlash, Lock, Clock4 } from 'lucide-react'

interface Props {
  m: ModuleSummary
  selected: boolean
  loading: boolean
  onSelect: (id: string) => void
}

export function SystemCard({ m, selected, loading, onSelect }: Props) {
  const cfg = MODULE_BY_ID[m.moduleId]
  const meta = statusMeta(m.overallStatus)
  const Icon = cfg?.icon
  const critical = m.overallStatus === 'critical'

  // Selection uses cyan but must NOT hide severity (03 → Selection vs severity).
  const borderClass = critical
    ? 'border-crit/60'
    : m.overallStatus === 'warning' || m.overallStatus === 'attention'
      ? 'border-warn/50'
      : selected
        ? 'border-cyan/50'
        : 'border-base-600/70'

  return (
    <button
      type="button"
      onClick={() => onSelect(m.moduleId)}
      aria-pressed={selected}
      className={clsx(
        'group relative flex flex-col gap-2.5 rounded-card border bg-base-800/70 p-3 text-left transition-all duration-150',
        borderClass,
        selected && 'ring-2 ring-cyan/60 ring-offset-1 ring-offset-base-900',
        critical && 'shadow-glow-crit',
        'hover:border-cyan/50 hover:bg-base-750/70 focus-visible:border-cyan',
      )}
    >
      {/* Header — name on row 1, status on row 2 so long labels never truncate */}
      <div className="flex items-center gap-2">
        <span className={clsx('flex h-6 w-6 shrink-0 items-center justify-center rounded-sm', meta.tint, meta.fg)}>
          {Icon && <Icon size={15} strokeWidth={2} />}
        </span>
        <span className="min-w-0 flex-1 truncate font-display text-[13px] font-bold uppercase tracking-wide text-ink">
          {cfg?.name ?? m.moduleName}
        </span>
      </div>
      <div className="-mt-1 flex items-center justify-between">
        <StatusBadge status={m.overallStatus} icon={critical} label={statusShort(m.overallStatus)} />
      </div>

      {/* Body */}
      {loading ? (
        <div className="space-y-2 py-1">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <CardBody m={m} />
      )}

      {/* Alert / freshness footer */}
      <Footer m={m} loading={loading} />
    </button>
  )
}

function CardBody({ m }: { m: ModuleSummary }) {
  const cfg = MODULE_BY_ID[m.moduleId]
  switch (m.overallStatus) {
    case 'not_installed':
      return (
        <div className="flex flex-col items-start gap-1 py-1">
          <CircleSlash size={18} className="text-ink-faint" />
          <div className="text-sm font-semibold text-steel-300">Not installed</div>
          <div className="text-2xs text-ink-faint">Not available in this building</div>
        </div>
      )
    case 'restricted':
      return (
        <div className="flex flex-col items-start gap-1 py-1">
          <Lock size={16} className="text-gone" />
          <div className="text-sm font-semibold text-steel-300">Restricted</div>
          <div className="text-2xs text-ink-faint">Summary available · detailed access unavailable</div>
        </div>
      )
    case 'offline':
      return (
        <div className="py-1">
          <div className="font-display text-lg font-bold text-gone">× Offline</div>
          <div className="mt-1 text-2xs text-ink-faint">System unavailable or disconnected</div>
        </div>
      )
    case 'no_data':
      return (
        <div className="py-1">
          <div className="font-display text-lg font-bold text-nodata">— No Data</div>
          <div className="mt-1 text-2xs text-ink-faint">Expected telemetry absent · not confirmed healthy</div>
        </div>
      )
    default:
      return <ArchetypeBody archetype={cfg?.archetype ?? 'state'} m={m} />
  }
}

function Footer({ m, loading }: { m: ModuleSummary; loading: boolean }) {
  if (loading) return <div className="h-4" />

  // Priority: active alert indicator, else freshness/uncertainty note.
  const critCount = m.criticalCount ?? 0
  const warnCount = m.warningCount ?? 0

  if (m.overallStatus === 'critical' && critCount > 0) {
    return (
      <div className="flex items-center gap-1.5 border-t border-crit/25 pt-2 text-2xs font-semibold text-crit">
        <OctagonAlert size={12} className="animate-pulse-crit" /> {critCount} active life-safety event
      </div>
    )
  }
  if ((m.overallStatus === 'warning' || m.overallStatus === 'attention') && warnCount > 0) {
    return (
      <div className="flex items-center gap-1.5 border-t border-warn/25 pt-2 text-2xs font-semibold text-warn">
        <AlertTriangle size={12} /> {warnCount} condition{warnCount > 1 ? 's' : ''} need attention
      </div>
    )
  }
  if (m.overallStatus === 'stale' || m.dataQuality === 'stale') {
    return (
      <div className="flex items-center gap-1.5 border-t border-nodata/25 pt-2 text-2xs font-medium text-nodata">
        <Clock4 size={12} /> Stale · {formatAgo(m.ageSeconds ?? 0)} · not live
      </div>
    )
  }
  if (m.overallStatus === 'partial_data' || m.dataQuality === 'partial') {
    return (
      <div className="flex items-center gap-1.5 border-t border-nodata/25 pt-2 text-2xs font-medium text-nodata">
        <AlertTriangle size={12} /> Partial telemetry · state incomplete
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between border-t border-base-600/40 pt-2 text-[10px] uppercase tracking-wide text-ink-faint">
      <span>Inspect →</span>
      <span className="tnum">{m.dataQuality === 'fresh' ? 'Live' : m.dataQuality}</span>
    </div>
  )
}
