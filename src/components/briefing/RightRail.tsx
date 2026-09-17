import { useDashboard } from '@/state/DashboardContext'
import { OperationalBriefing } from './OperationalBriefing'
import { QuickInspect } from '@/components/inspect/QuickInspect'

/**
 * The single right rail. Quick Inspect REPLACES the Operational Briefing while
 * open (06 → Placement) — never a second side panel. Closing restores briefing.
 */
export function RightRail() {
  const { quickInspectOpen, scope } = useDashboard()
  const showInspect = quickInspectOpen && Boolean(scope.systemId)

  return (
    <aside className="panel flex h-full min-h-0 flex-col overflow-hidden" aria-label={showInspect ? 'Quick Inspect' : 'Operational Briefing'}>
      {showInspect ? <QuickInspect /> : <OperationalBriefing />}
    </aside>
  )
}
