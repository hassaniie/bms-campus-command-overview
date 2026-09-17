import { useDashboard } from '@/state/DashboardContext'
import { scopedCampusSummary } from '@/state/selectors'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Skeleton } from '@/components/common/Skeleton'
import { formatNumber } from '@/lib/format'
import { clsx } from '@/lib/format'
import { Users, Zap, Radio, AlertOctagon, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

export function CampusSummaryStrip() {
  const { campus, scope, phase } = useDashboard()
  const s = scopedCampusSummary(campus, scope)
  const loading = phase === 'loading'

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      <Cell label={`${s.scopeLabel} State`} loading={loading}>
        <StatusBadge status={s.overallStatus} size="md" icon />
      </Cell>

      <Cell label="Active Alarms" loading={loading}>
        <span className="flex items-baseline gap-3">
          <Stat icon={<AlertOctagon size={13} className={s.criticalCount ? 'text-crit' : 'text-ink-faint'} />} value={s.criticalCount} suffix="Crit" tone={s.criticalCount ? 'crit' : 'muted'} />
          <Stat icon={<TriangleAlert size={13} className={s.warningCount ? 'text-warn' : 'text-ink-faint'} />} value={s.warningCount} suffix="Warn" tone={s.warningCount ? 'warn' : 'muted'} />
        </span>
      </Cell>

      <Cell label="Occupancy" loading={loading}>
        <Big icon={<Users size={15} className="text-cyan/80" />} value={s.peopleOnsite != null ? formatNumber(s.peopleOnsite) : '—'} unit="people" />
      </Cell>

      <Cell label="Energy Demand" loading={loading}>
        <Big icon={<Zap size={15} className="text-warn/80" />} value={s.currentDemandKw != null ? formatNumber(s.currentDemandKw) : '—'} unit="kW" />
      </Cell>

      <Cell label="Maintenance" loading={loading}>
        <Big value={`${s.maintenanceCount}`} unit="open" muted />
      </Cell>

      <Cell label="Asset Connectivity" loading={loading}>
        {s.totalAssets ? (
          <Big
            icon={<Radio size={14} className={s.connectedAssets === s.totalAssets ? 'text-ok/80' : 'text-warn/80'} />}
            value={`${formatNumber(s.connectedAssets ?? 0)} / ${formatNumber(s.totalAssets)}`}
            unit={`${(((s.connectedAssets ?? 0) / s.totalAssets) * 100).toFixed(1)}%`}
          />
        ) : (
          <Big value="—" unit="scoped" muted />
        )}
      </Cell>
    </div>
  )
}

function Cell({ label, children, loading }: { label: string; children: ReactNode; loading?: boolean }) {
  return (
    <div className="panel flex flex-col justify-between gap-1.5 px-3 py-2">
      <div className="label-cap">{label}</div>
      {loading ? <Skeleton className="h-5 w-24" /> : <div className="min-h-[24px]">{children}</div>}
    </div>
  )
}

function Big({ icon, value, unit, muted }: { icon?: ReactNode; value: string; unit?: string; muted?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
      {icon && <span className="self-center">{icon}</span>}
      <span className={clsx('whitespace-nowrap font-display text-lg font-semibold leading-none tnum', muted ? 'text-steel-300' : 'text-ink')}>
        {value}
      </span>
      {unit && <span className="whitespace-nowrap text-2xs font-medium uppercase tracking-wide text-ink-faint">{unit}</span>}
    </div>
  )
}

function Stat({ icon, value, suffix, tone }: { icon: ReactNode; value: number; suffix: string; tone: 'crit' | 'warn' | 'muted' }) {
  const color = tone === 'crit' ? 'text-crit' : tone === 'warn' ? 'text-warn' : 'text-steel-300'
  return (
    <span className="flex items-baseline gap-1">
      {icon}
      <span className={clsx('font-display text-lg font-semibold leading-none tnum', color)}>{value}</span>
      <span className="text-2xs uppercase tracking-wide text-ink-faint">{suffix}</span>
    </span>
  )
}
