import { X, Building2, LayoutGrid, ChevronRight, Eraser } from 'lucide-react'
import { useDashboard } from '@/state/DashboardContext'
import { buildingName } from '@/config/buildings'
import { MODULE_BY_ID } from '@/config/modules'
import { clsx } from '@/lib/format'

/**
 * Persistent Scope Bar. Scope is never hidden — the operator always knows the
 * current building/system context and can clear either dimension (03).
 */
export function ScopeBar() {
  const { scope, clearBuilding, clearSystem, clearAll } = useDashboard()
  const hasFilters = Boolean(scope.buildingId || scope.systemId)

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-panel border border-base-600/70 bg-base-800/60 px-3 py-2">
      <span className="label-cap mr-1 flex items-center gap-1.5 text-ink-faint">
        <LayoutGrid size={12} /> Scope
      </span>

      {/* Building dimension */}
      {scope.buildingId ? (
        <Chip
          icon={<Building2 size={12} />}
          label={buildingName(scope.buildingId)}
          onClear={clearBuilding}
        />
      ) : (
        <StaticChip label="Campus" />
      )}

      <ChevronRight size={14} className="text-base-500" />

      {/* System dimension */}
      {scope.systemId ? (
        <Chip
          icon={MODULE_BY_ID[scope.systemId] ? <ModuleIcon id={scope.systemId} /> : undefined}
          label={MODULE_BY_ID[scope.systemId]?.name ?? scope.systemId}
          onClear={clearSystem}
          accent
        />
      ) : (
        <StaticChip label="All Systems" />
      )}

      <div className="ml-auto">
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1.5 rounded-sm border border-base-500/60 px-2 py-1 text-2xs font-semibold uppercase tracking-[0.1em] text-ink-muted transition-colors hover:border-cyan/50 hover:text-cyan"
          >
            <Eraser size={12} /> Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}

function ModuleIcon({ id }: { id: string }) {
  const Icon = MODULE_BY_ID[id]?.icon
  return Icon ? <Icon size={12} /> : null
}

function StaticChip({ label }: { label: string }) {
  return (
    <span className="rounded-sm border border-base-600/60 bg-base-750/60 px-2 py-1 font-mono text-2xs font-semibold uppercase tracking-[0.08em] text-steel-300">
      {label}
    </span>
  )
}

function Chip({
  icon,
  label,
  onClear,
  accent,
}: {
  icon?: React.ReactNode
  label: string
  onClear: () => void
  accent?: boolean
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-mono text-2xs font-semibold uppercase tracking-[0.08em]',
        accent
          ? 'border-cyan/50 bg-cyan/10 text-cyan'
          : 'border-cyan/40 bg-cyan/10 text-cyan',
      )}
    >
      {icon}
      {label}
      <button
        type="button"
        onClick={onClear}
        aria-label={`Remove ${label} filter`}
        className="ml-0.5 rounded-sm p-0.5 text-cyan/70 transition-colors hover:bg-cyan/20 hover:text-cyan"
      >
        <X size={12} strokeWidth={3} />
      </button>
    </span>
  )
}
