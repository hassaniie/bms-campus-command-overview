import { useMemo } from 'react'
import type { AttentionItem } from '@/types'
import { useDashboard } from '@/state/DashboardContext'
import { scopedBriefing } from '@/state/selectors'
import { sectionize, lifeSafetyCritical } from '@/lib/briefing'
import { severityMeta } from '@/lib/status'
import { buildingName } from '@/config/buildings'
import { MODULE_BY_ID } from '@/config/modules'
import { BriefingItem, ResolvedItem } from './BriefingItem'
import { LifeSafetyBanner } from './LifeSafetyBanner'
import { ClipboardList, ShieldCheck, History } from 'lucide-react'

export function OperationalBriefing() {
  const { campus, scope, inspectFromBriefing } = useDashboard()
  const { active, resolved } = useMemo(() => scopedBriefing(campus, scope), [campus, scope])

  const banner = lifeSafetyCritical(active)
  const rest = banner ? active.filter((i) => i.id !== banner.id) : active
  const sections = useMemo(() => sectionize(rest), [rest])

  const scopeNote = `${buildingName(scope.buildingId)} · ${
    scope.systemId ? MODULE_BY_ID[scope.systemId]?.name : 'All systems'
  }`

  const onInspect = (systemId: string, bId?: string) => inspectFromBriefing(systemId, bId)
  const onViewIncident = (item: AttentionItem) => inspectFromBriefing(item.systemId, item.buildingId)

  const hasActive = active.length > 0

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-base-600/70 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <ClipboardList size={15} className="text-cyan" />
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-ink">
            Operational Briefing
          </h2>
        </div>
        <span className="rounded-sm border border-base-600/60 bg-base-750/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-steel-300">
          {scopeNote}
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto scroll-thin px-3 py-3">
        {banner && <LifeSafetyBanner item={banner} onViewIncident={onViewIncident} />}

        {!hasActive && (
          <div className="flex flex-col items-center gap-2 rounded-panel border border-ok/25 bg-ok/5 px-3 py-6 text-center">
            <ShieldCheck size={26} className="text-ok" />
            <div className="font-display text-sm font-bold uppercase tracking-wide text-ok">
              No Active Critical Events
            </div>
            <div className="text-2xs text-ink-muted">
              All monitored life-safety systems normal in scope.
            </div>
          </div>
        )}

        {sections.map((section) => {
          const meta = severityMeta(section.key)
          return (
            <div key={section.key}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                <h3 className={`label-cap ${meta.fg}`}>{section.label}</h3>
                <span className="text-[10px] text-ink-faint tnum">{section.items.length}</span>
                <span className="h-px flex-1 bg-base-600/40" />
              </div>
              <div className="space-y-1.5">
                {section.items.map((item) => (
                  <BriefingItem key={item.id} item={item} onInspect={onInspect} />
                ))}
              </div>
            </div>
          )
        })}

        {resolved.length > 0 && (
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <History size={12} className="text-ink-faint" />
              <h3 className="label-cap text-ink-faint">Recently Resolved</h3>
              <span className="h-px flex-1 bg-base-600/40" />
            </div>
            <div className="space-y-1">
              {resolved.map((item) => (
                <ResolvedItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
