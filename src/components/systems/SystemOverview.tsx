import { useMemo } from 'react'
import { useDashboard } from '@/state/DashboardContext'
import { scopedModules } from '@/state/selectors'
import { SYSTEM_GROUPS } from '@/config/modules'
import { statusMeta } from '@/lib/status'
import { SystemCard } from './SystemCard'
import type { ModuleSummary } from '@/types'

export function SystemOverview() {
  const { campus, scope, phase, selectSystem } = useDashboard()
  const modules = useMemo(() => scopedModules(campus, scope), [campus, scope])
  const byId = useMemo(() => new Map(modules.map((m) => [m.moduleId, m])), [modules])
  const loading = phase === 'loading'

  return (
    <section aria-label="System overview" className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      {SYSTEM_GROUPS.map((group) => {
        const groupModules = group.moduleIds
          .map((id) => byId.get(id))
          .filter((m): m is ModuleSummary => Boolean(m))
        const flagged = groupModules.filter((m) => statusMeta(m.overallStatus).notHealthy).length

        return (
          <div key={group.id} className="rounded-panel border border-base-600/40 bg-base-850/30 p-2.5">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="label-cap text-steel-400">{group.label}</h3>
              <span className="h-px flex-1 bg-base-600/50" />
              {flagged > 0 && (
                <span className="rounded-sm bg-warn/10 px-1.5 py-0.5 text-2xs font-semibold text-warn">
                  {flagged} flagged
                </span>
              )}
            </div>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(176px, 1fr))' }}
            >
              {groupModules.map((m) => (
                <SystemCard
                  key={m.moduleId}
                  m={m}
                  selected={scope.systemId === m.moduleId}
                  loading={loading}
                  onSelect={selectSystem}
                />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
