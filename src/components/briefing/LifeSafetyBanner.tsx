import type { AttentionItem } from '@/types'
import { formatClock } from '@/lib/time'
import { LiveDuration } from '@/components/common/LiveTime'
import { OctagonAlert, ArrowRight, MapPin } from 'lucide-react'

interface Props {
  item: AttentionItem
  onViewIncident: (item: AttentionItem) => void
}

/**
 * Life-safety escalation block. Overrides visual hierarchy (05 → Life-safety
 * escalation): what happened, where, when it started, still active, next path.
 */
export function LifeSafetyBanner({ item, onViewIncident }: Props) {
  return (
    <div className="animate-fade-in rounded-panel border border-crit/60 bg-crit/10 shadow-glow-crit">
      <div className="flex items-center gap-2 border-b border-crit/40 px-3 py-2">
        <OctagonAlert size={16} className="animate-pulse-crit text-crit" strokeWidth={2.5} />
        <span className="font-display text-sm font-bold uppercase tracking-[0.1em] text-crit">
          Critical Alarm
        </span>
        <span className="ml-auto rounded-sm bg-crit/20 px-1.5 py-0.5 font-mono text-2xs font-bold uppercase text-crit">
          Life Safety
        </span>
      </div>

      <div className="px-3 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-bold uppercase tracking-wide text-ink">
            {item.buildingName}
          </span>
          <span className="font-display text-sm font-semibold uppercase tracking-wide text-crit">
            {item.systemName}
          </span>
        </div>

        <div className="mt-1.5 text-sm font-semibold text-ink">{item.assetName}</div>
        {item.location && (
          <div className="mt-0.5 flex items-center gap-1 text-2xs text-steel-200">
            <MapPin size={11} className="text-crit/80" /> {item.location}
          </div>
        )}

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <div className="rounded-sm border border-crit/25 bg-base-900/40 px-2 py-1.5">
            <div className="label-cap text-crit/70">Activated</div>
            <div className="mt-0.5 font-mono text-sm font-semibold text-ink tnum">
              {item.startTime ? formatClock(Date.parse(item.startTime)) : '—'}
            </div>
          </div>
          <div className="rounded-sm border border-crit/25 bg-base-900/40 px-2 py-1.5">
            <div className="label-cap text-crit/70">Active For</div>
            <div className="mt-0.5 font-mono text-sm font-semibold text-crit tnum">
              <LiveDuration startTime={item.startTime} fallbackSeconds={item.durationSeconds} />
            </div>
          </div>
        </div>

        {item.acknowledged && (
          <div className="mt-2 flex items-center gap-2 text-2xs">
            <span className="text-ink-muted">
              Acknowledged by {item.acknowledgedBy}
              {item.acknowledgedAt ? ` · ${formatClock(Date.parse(item.acknowledgedAt))}` : ''}
            </span>
            <span className="rounded-sm bg-crit/20 px-1.5 py-0.5 font-bold uppercase text-crit">Still Active</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => onViewIncident(item)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm bg-crit px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-crit-bright"
        >
          View Incident <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
