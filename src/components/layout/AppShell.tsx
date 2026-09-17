import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { PageTitle } from '@/components/overview/PageTitle'
import { CampusSummaryStrip } from '@/components/overview/CampusSummaryStrip'
import { ScopeBar } from '@/components/overview/ScopeBar'
import { DigitalTwin } from '@/components/twin/DigitalTwin'
import { SystemOverview } from '@/components/systems/SystemOverview'
import { RightRail } from '@/components/briefing/RightRail'

export function AppShell() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-base-900 text-ink">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        {/* Content: main region (~72%) + right rail (~28%) */}
        <div
          className="grid min-h-0 flex-1 gap-3 p-3"
          style={{ gridTemplateColumns: 'minmax(0, 1fr) clamp(340px, 28%, 452px)' }}
        >
          {/* Main region — scrolls internally */}
          <main className="flex min-h-0 min-w-0 flex-col gap-3 overflow-y-auto scroll-thin pr-1">
            <PageTitle />
            <CampusSummaryStrip />
            <ScopeBar />

            <section
              aria-label="Campus digital twin"
              className="panel grid-blueprint relative min-h-[340px] flex-1 overflow-hidden"
              style={{ height: '44vh' }}
            >
              <DigitalTwin />
            </section>

            <SystemOverview />
          </main>

          {/* Right rail — full height */}
          <div className="min-h-0">
            <RightRail />
          </div>
        </div>
      </div>
    </div>
  )
}
