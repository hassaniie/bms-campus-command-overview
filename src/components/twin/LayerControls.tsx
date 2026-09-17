import { Activity, Users, Zap, Bell } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useDashboard } from '@/state/DashboardContext'
import type { TwinLayer } from '@/types'
import { clsx } from '@/lib/format'

const LAYERS: { id: TwinLayer; label: string; icon: LucideIcon }[] = [
  { id: 'health', label: 'Health', icon: Activity },
  { id: 'occupancy', label: 'Occupancy', icon: Users },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'alarms', label: 'Alarms', icon: Bell },
]

export function LayerControls() {
  const { scope, setLayer } = useDashboard()
  return (
    <div
      className="flex items-center gap-0.5 rounded-sm border border-base-600/70 bg-base-850/85 p-0.5 backdrop-blur"
      role="tablist"
      aria-label="Digital twin layer"
    >
      {LAYERS.map((l) => {
        const active = scope.layer === l.id
        const Icon = l.icon
        return (
          <button
            key={l.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => setLayer(l.id)}
            className={clsx(
              'flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-2xs font-semibold uppercase tracking-[0.08em] transition-colors',
              active ? 'bg-cyan/15 text-cyan ring-1 ring-cyan/40' : 'text-ink-faint hover:bg-base-700/70 hover:text-steel-200',
            )}
          >
            <Icon size={13} />
            <span className="hidden sm:inline">{l.label}</span>
          </button>
        )
      })}
    </div>
  )
}
