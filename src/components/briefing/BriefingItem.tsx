import type { AttentionItem } from '@/types'
import { severityMeta } from '@/lib/status'
import { MODULE_BY_ID } from '@/config/modules'
import { LiveAgo } from '@/components/common/LiveTime'
import { clsx } from '@/lib/format'
import { ChevronRight, Layers, CircleCheck } from 'lucide-react'

interface Props {
  item: AttentionItem
  onInspect: (systemId: string, buildingId?: string) => void
}

export function BriefingItem({ item, onInspect }: Props) {
  const meta = severityMeta(item.severity)
  const Icon = MODULE_BY_ID[item.systemId]?.icon ?? meta.icon
  const grouped = (item.groupCount ?? 0) > 1

  return (
    <div className={clsx('rounded-sm border-l-2 bg-base-800/60 py-2 pl-2.5 pr-2', meta.border, meta.tint)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Icon size={13} className={meta.fg} strokeWidth={2} />
          <span className="truncate font-display text-2xs font-bold uppercase tracking-wider text-ink">
            {item.systemName}
          </span>
          {item.buildingName && (
            <span className="shrink-0 rounded-sm bg-base-700/70 px-1.5 py-0.5 text-[10px] font-medium text-steel-300">
              {item.buildingName}
            </span>
          )}
        </div>
        <span className="shrink-0 whitespace-nowrap text-[10px] font-medium uppercase tracking-wide text-ink-faint">
          <LiveAgo startTime={item.startTime} fallbackSeconds={item.durationSeconds} />
        </span>
      </div>

      <div className="mt-1 text-xs font-semibold text-steel-100">{item.title}</div>
      {item.description && <div className="mt-0.5 text-2xs text-ink-muted">{item.description}</div>}
      {item.location && <div className="mt-0.5 text-2xs text-ink-faint">{item.location}</div>}

      {item.acknowledged && (
        <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-ink-faint">
          <span className="text-steel-400">Ack {item.acknowledgedBy}</span>
          <span className="rounded-sm bg-warn/10 px-1 py-0.5 font-semibold text-warn">Still active</span>
        </div>
      )}

      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onInspect(item.systemId, item.buildingId)}
          className={clsx(
            'inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide transition-colors',
            'border-base-500/60 text-steel-300 hover:border-cyan/50 hover:text-cyan',
          )}
        >
          Inspect <ChevronRight size={11} />
        </button>
        {grouped && (
          <button
            type="button"
            onClick={() => onInspect(item.systemId, item.buildingId)}
            className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-cyan/80 hover:text-cyan"
          >
            <Layers size={11} /> View {item.groupCount} events
          </button>
        )}
      </div>
    </div>
  )
}

export function ResolvedItem({ item }: { item: AttentionItem }) {
  const Icon = MODULE_BY_ID[item.systemId]?.icon ?? CircleCheck
  return (
    <div className="flex items-start gap-2 rounded-sm bg-base-850/50 px-2.5 py-1.5">
      <CircleCheck size={13} className="mt-0.5 shrink-0 text-ok/70" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Icon size={11} className="text-ink-faint" />
          <span className="truncate text-2xs font-semibold uppercase tracking-wide text-steel-300">
            {item.systemName}
          </span>
          {item.buildingName && <span className="text-[10px] text-ink-faint">· {item.buildingName}</span>}
        </div>
        <div className="text-2xs text-ink-muted">{item.title}</div>
      </div>
      <span className="shrink-0 text-[10px] text-ink-faint">
        <LiveAgo startTime={item.startTime} fallbackSeconds={item.durationSeconds} />
      </span>
    </div>
  )
}
