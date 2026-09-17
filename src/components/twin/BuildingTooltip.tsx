import type { BuildingSummary } from '@/types'
import { statusMeta } from '@/lib/status'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatClock } from '@/lib/time'
import { MODULE_BY_ID } from '@/config/modules'
import { clsx } from '@/lib/format'

interface Props {
  building: BuildingSummary
  x: number
  y: number
  below?: boolean
}

// Concise Operational-Signature snapshot (02 → Building hover). Not a data dump.
const SNAPSHOT_MODULES = ['hvac', 'lighting', 'fire_alarm', 'fire_fighting', 'cctv', 'energy']

export function BuildingTooltip({ building, x, y, below }: Props) {
  const b = building
  const offline = b.connectivityState === 'offline'
  const partial = b.connectivityState === 'partial' || b.moduleSummaries.some((m) => m.overallStatus === 'no_data')

  return (
    <div
      className="pointer-events-none absolute z-40 w-64 -translate-x-1/2 animate-fade-in"
      style={{ left: x, top: y, transform: below ? 'translate(-50%, 22px)' : 'translate(-50%, calc(-100% - 14px))' }}
    >
      <div className="panel border-base-500/80 bg-base-800/95 p-0 shadow-panel backdrop-blur">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-base-600/70 px-3 py-2">
          <div>
            <div className="font-display text-sm font-bold uppercase tracking-wide text-ink">{b.buildingName}</div>
            <div className="text-2xs text-ink-faint">
              Occupancy: <span className="tnum text-steel-200">{b.occupancy ?? '—'}</span>
              {b.energyDemandKw != null && !offline && (
                <>
                  {' · '}
                  <span className="tnum text-steel-200">{b.energyDemandKw} kW</span>
                </>
              )}
            </div>
          </div>
          <StatusBadge status={b.overallStatus} icon />
        </div>

        {offline ? (
          <div className="px-3 py-2.5">
            <div className="text-xs font-semibold text-gone">Building controller unavailable</div>
            <div className="mt-1 text-2xs text-ink-faint">
              Last communication: <span className="tnum">{b.lastUpdated ? formatClock(Date.parse(b.lastUpdated)) : '—'}</span>
            </div>
            <div className="mt-1.5 text-2xs text-nodata/80">Subsystem health cannot be confirmed.</div>
          </div>
        ) : (
          <div className="px-3 py-2">
            {partial && (
              <div className="mb-1.5 text-2xs font-semibold uppercase tracking-wide text-nodata">Some data unavailable</div>
            )}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {SNAPSHOT_MODULES.map((id) => {
                const m = b.moduleSummaries.find((x) => x.moduleId === id)
                if (!m) return null
                return <SnapshotRow key={id} label={MODULE_BY_ID[id]?.name ?? id} m={m} />
              })}
            </div>

            {(b.activeWarningCount > 0 || b.activeCriticalCount > 0) && (
              <div className="mt-2 flex flex-wrap gap-2 border-t border-base-600/60 pt-2 text-2xs">
                {b.activeCriticalCount > 0 && (
                  <span className="font-semibold text-crit">{b.activeCriticalCount} Critical</span>
                )}
                {b.activeWarningCount > 0 && (
                  <span className="font-semibold text-warn">{b.activeWarningCount} Warning</span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="border-t border-base-600/70 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.14em] text-cyan/70">
          Click to filter scope
        </div>
      </div>
    </div>
  )
}

function SnapshotRow({ label, m }: { label: string; m: BuildingSummary['moduleSummaries'][number] }) {
  const meta = statusMeta(m.overallStatus)
  const compact =
    m.moduleId === 'hvac' || m.moduleId === 'cctv'
      ? String(m.primaryMetric ?? '')
      : m.moduleId === 'energy'
        ? `${m.primaryMetric} ${m.primaryUnit ?? ''}`
        : meta.label
  return (
    <div className="flex items-center justify-between gap-1.5">
      <span className="truncate text-2xs text-ink-faint">{label}</span>
      <span className={clsx('flex items-center gap-1 text-2xs font-medium tnum', meta.fg)}>
        <span className={clsx('h-1.5 w-1.5 rounded-full', meta.dot)} aria-hidden />
        {compact}
      </span>
    </div>
  )
}
