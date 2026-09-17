import { useDashboard } from '@/state/DashboardContext'
import { FreshnessIndicator } from '@/components/common/FreshnessIndicator'
import { MODULE_BY_ID } from '@/config/modules'
import { buildingName } from '@/config/buildings'

export function PageTitle() {
  const { campus, scope } = useDashboard()

  const scopeLine =
    scope.buildingId || scope.systemId
      ? `${buildingName(scope.buildingId)} · ${scope.systemId ? MODULE_BY_ID[scope.systemId]?.name : 'All systems'}`
      : 'Live operational overview of all buildings and systems'

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="min-w-0">
        <h1 className="font-display text-xl font-bold uppercase tracking-[0.06em] text-ink lg:text-2xl">
          Campus Command Overview
        </h1>
        <p className="mt-0.5 truncate font-mono text-2xs uppercase tracking-[0.12em] text-ink-faint">
          {scopeLine}
        </p>
      </div>
      <FreshnessIndicator
        connection={campus.connection}
        loadedAt={campus.now}
        lastReliableUpdate={campus.lastReliableUpdate}
      />
    </div>
  )
}
