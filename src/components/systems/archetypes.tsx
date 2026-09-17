import type { ModuleSummary, Archetype } from '@/types'
import { PrimaryMetric, SecondaryPair, MiniBar } from './cardParts'
import { Sparkline } from '@/components/common/Sparkline'
import { statusMeta } from '@/lib/status'

interface BodyProps {
  m: ModuleSummary
}

function primaryTone(m: ModuleSummary): 'default' | 'crit' | 'warn' | 'muted' {
  if (m.overallStatus === 'critical') return 'crit'
  if (m.overallStatus === 'warning' || m.overallStatus === 'attention') return 'warn'
  if (['offline', 'no_data', 'stale', 'partial_data', 'not_installed', 'unknown'].includes(m.overallStatus)) return 'muted'
  return 'default'
}

// Archetype 2: Fleet — operational / total + availability bar.
export function FleetBody({ m }: BodyProps) {
  const frac = m.totalCount ? (m.onlineCount ?? 0) / m.totalCount : 1
  const offline = m.offlineCount ?? 0
  const tone = offline > 0 ? (m.overallStatus === 'critical' ? 'crit' : 'warn') : 'ok'
  return (
    <div className="space-y-2.5">
      <PrimaryMetric value={m.primaryMetric} unit={m.primaryUnit} label={m.primaryLabel} tone={primaryTone(m)} />
      <MiniBar fraction={frac} tone={tone} />
      <SecondaryPair a={m.secondaryMetric1} b={m.secondaryMetric2} />
    </div>
  )
}

// Archetype 1: State — status-forward, small counts.
export function StateBody({ m }: BodyProps) {
  return (
    <div className="space-y-2.5">
      <PrimaryMetric value={m.primaryMetric} unit={m.primaryUnit} label={m.primaryLabel} tone={primaryTone(m)} />
      <SecondaryPair a={m.secondaryMetric1} b={m.secondaryMetric2} />
    </div>
  )
}

// Archetype 3: Process — a physical measurement + stability trend.
export function ProcessBody({ m }: BodyProps) {
  const meta = statusMeta(m.overallStatus)
  return (
    <div className="space-y-2.5">
      <div className="flex items-end justify-between gap-2">
        <PrimaryMetric value={m.primaryMetric} unit={m.primaryUnit} label={m.primaryLabel} tone={primaryTone(m)} />
        {m.trend && m.overallStatus !== 'no_data' && (
          <Sparkline values={m.trend.values} color={meta.hex} width={96} height={30} />
        )}
      </div>
      <SecondaryPair a={m.secondaryMetric1} b={m.secondaryMetric2} />
    </div>
  )
}

// Archetype 4: Production — current output + trend.
export function ProductionBody({ m }: BodyProps) {
  const meta = statusMeta(m.overallStatus)
  const color = m.moduleId === 'solar' ? '#ffb23e' : m.moduleId === 'energy' ? '#38e1ff' : meta.hex
  return (
    <div className="space-y-2.5">
      <div className="flex items-end justify-between gap-2">
        <PrimaryMetric value={m.primaryMetric} unit={m.primaryUnit} label={m.primaryLabel} tone={primaryTone(m)} />
        {m.trend && m.overallStatus !== 'no_data' && m.overallStatus !== 'stale' && (
          <Sparkline values={m.trend.values} color={color} width={96} height={30} />
        )}
      </div>
      <SecondaryPair a={m.secondaryMetric1} b={m.secondaryMetric2} />
      {m.contextNote && <div className="text-2xs italic text-ink-faint">{m.contextNote}</div>}
    </div>
  )
}

// Archetype 5: Capacity — used / capacity + utilization bar.
export function CapacityBody({ m }: BodyProps) {
  const frac = m.totalCount ? (m.onlineCount ?? 0) / m.totalCount : 0
  const tone = frac > 0.9 ? 'warn' : 'cyan'
  return (
    <div className="space-y-2.5">
      <PrimaryMetric value={m.primaryMetric} unit={m.primaryUnit} label={m.primaryLabel} tone={primaryTone(m)} />
      <MiniBar fraction={frac} tone={tone} />
      <SecondaryPair a={m.secondaryMetric1} b={m.secondaryMetric2} />
    </div>
  )
}

const BODIES: Record<Archetype, (p: BodyProps) => JSX.Element> = {
  fleet: FleetBody,
  state: StateBody,
  process: ProcessBody,
  production: ProductionBody,
  capacity: CapacityBody,
}

export function ArchetypeBody({ archetype, m }: { archetype: Archetype; m: ModuleSummary }) {
  const Body = BODIES[archetype] ?? StateBody
  return <Body m={m} />
}
