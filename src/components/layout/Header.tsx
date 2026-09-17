import { Menu, ChevronDown, Bell, Settings, User, CloudSun } from 'lucide-react'
import { useDashboard } from '@/state/DashboardContext'
import { useClock } from '@/state/useClock'
import { statusMeta } from '@/lib/status'
import { formatClock } from '@/lib/time'
import { clsx } from '@/lib/format'
import type { Status } from '@/types'
import { DevScenarioSwitcher } from './DevScenarioSwitcher'

function headline(status: Status): string {
  switch (status) {
    case 'critical':
      return 'Campus Critical'
    case 'attention':
    case 'warning':
    case 'partial_data':
      return 'Campus Attention'
    case 'stale':
    case 'offline':
    case 'no_data':
      return 'Campus — Data Stale'
    default:
      return 'Campus Normal'
  }
}

export function Header() {
  const { campus, scope, clearBuilding } = useDashboard()
  const now = useClock(1000)
  const c = campus.campus
  const meta = statusMeta(c.overallStatus)
  const criticalTotal = c.criticalCount

  return (
    <header className="relative z-40 flex h-14 shrink-0 items-center gap-3 border-b border-base-600/70 bg-base-850/80 px-3 backdrop-blur">
      {/* Left: menu + campus selector */}
      <button
        type="button"
        aria-label="Toggle menu"
        className="flex h-9 w-9 items-center justify-center rounded-sm border border-base-600/70 bg-base-800/80 text-ink-faint hover:text-steel-200"
      >
        <Menu size={18} />
      </button>

      <button
        type="button"
        onClick={() => (scope.buildingId ? clearBuilding() : undefined)}
        className="flex items-center gap-2 rounded-sm border border-base-600/70 bg-base-800/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-steel-200 hover:border-cyan/40"
        title="Campus selector"
      >
        <span className="text-cyan">◆</span>
        {scope.buildingId ? 'Al Rehman Campus' : 'Al Rehman Campus'}
        <ChevronDown size={14} className="text-ink-faint" />
      </button>

      {/* Center: measurable campus state */}
      <div
        className={clsx(
          'ml-1 flex min-w-0 items-center gap-2.5 rounded-sm border px-3 py-1.5',
          meta.border,
          meta.tint,
        )}
      >
        <span className={clsx('h-2 w-2 shrink-0 rounded-full', meta.dot, c.overallStatus === 'critical' && 'animate-pulse-crit')} />
        <span className={clsx('whitespace-nowrap font-display text-sm font-semibold uppercase tracking-wide', meta.fg)}>
          {headline(c.overallStatus)}
        </span>
        <span className="hidden items-center gap-2 font-mono text-2xs uppercase tracking-wider text-ink-muted md:flex">
          <Count n={c.criticalCount} label="Critical" tone="crit" />
          <Sep />
          <Count n={c.warningCount} label="Warnings" tone="warn" />
          <Sep />
          <Count n={c.maintenanceCount} label="Maint" tone="steel" />
          {(c.noDataCount ?? 0) > 0 && (
            <>
              <Sep />
              <Count n={c.noDataCount ?? 0} label="No Data" tone="nodata" />
            </>
          )}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <DevScenarioSwitcher />

        <div className="hidden items-center lg:flex">
          <IconBtn label="Notifications" badge={criticalTotal || undefined}>
            <Bell size={17} />
          </IconBtn>
          <IconBtn label="Settings">
            <Settings size={17} />
          </IconBtn>
          <IconBtn label="Operator profile">
            <User size={17} />
          </IconBtn>
        </div>

        {/* Weather + time */}
        <div className="hidden items-center gap-2 rounded-sm border border-base-600/70 bg-base-800/80 px-3 py-1.5 md:flex">
          <CloudSun size={20} className="text-warn/90" />
          <div className="leading-tight">
            <div className="font-mono text-xs font-semibold text-steel-200 tnum">28–32°C</div>
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">Lahore, Punjab</div>
          </div>
          <div className="ml-1 border-l border-base-600/70 pl-2 leading-tight">
            <div className="font-mono text-xs font-semibold text-cyan tnum">{formatClock(now, false)}</div>
            <div className="text-[10px] uppercase tracking-wider text-ink-faint">Local</div>
          </div>
        </div>
      </div>
    </header>
  )
}

function Sep() {
  return <span className="text-base-500">·</span>
}

function Count({ n, label, tone }: { n: number; label: string; tone: 'crit' | 'warn' | 'steel' | 'nodata' }) {
  const color =
    n === 0
      ? 'text-ink-faint'
      : tone === 'crit'
        ? 'text-crit'
        : tone === 'warn'
          ? 'text-warn'
          : tone === 'nodata'
            ? 'text-nodata'
            : 'text-steel-300'
  return (
    <span className="whitespace-nowrap">
      <span className={clsx('font-semibold tnum', color)}>{n}</span> <span className="text-ink-faint">{label}</span>
    </span>
  )
}

function IconBtn({ children, label, badge }: { children: React.ReactNode; label: string; badge?: number }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-sm text-ink-faint transition-colors hover:bg-base-700/70 hover:text-steel-200"
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-crit px-1 text-[9px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  )
}
