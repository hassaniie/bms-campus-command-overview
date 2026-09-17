import type { Metric } from '@/types'
import { clsx } from '@/lib/format'
import { formatValue } from '@/lib/format'

export function PrimaryMetric({
  value,
  unit,
  label,
  tone = 'default',
}: {
  value: number | string | undefined
  unit?: string
  label: string
  tone?: 'default' | 'crit' | 'warn' | 'muted'
}) {
  const color =
    tone === 'crit'
      ? 'text-crit'
      : tone === 'warn'
        ? 'text-warn'
        : tone === 'muted'
          ? 'text-steel-300'
          : 'text-ink'
  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span className={clsx('font-display text-2xl font-bold leading-none tnum', color)}>
          {value ?? '—'}
        </span>
        {unit && <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{unit}</span>}
      </div>
      <div className="mt-1 label-cap text-ink-faint">{label}</div>
    </div>
  )
}

export function SecondaryPair({ a, b }: { a?: Metric; b?: Metric }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {a && <SecondaryCell metric={a} />}
      {b && <SecondaryCell metric={b} />}
    </div>
  )
}

function SecondaryCell({ metric }: { metric: Metric }) {
  const alert =
    (metric.label.toLowerCase().includes('offline') ||
      metric.label.toLowerCase().includes('fault') ||
      metric.label.toLowerCase().includes('unavailable') ||
      metric.label.toLowerCase().includes('no data')) &&
    Number(metric.value) > 0
  return (
    <div className="min-w-0 rounded-sm border border-base-600/50 bg-base-850/50 px-2 py-1">
      <div className="label-cap line-clamp-2 min-h-[1.6em] leading-tight">{metric.label}</div>
      <div className={clsx('mt-0.5 truncate font-mono text-sm font-semibold tnum', alert ? 'text-warn' : 'text-steel-200')}>
        {formatValue(metric.value, metric.unit)}
      </div>
    </div>
  )
}

/** Availability / capacity ratio bar. tone chooses fill color. */
export function MiniBar({
  fraction,
  tone = 'ok',
}: {
  fraction: number
  tone?: 'ok' | 'cyan' | 'warn' | 'crit'
}) {
  const f = Math.max(0, Math.min(1, fraction))
  const color =
    tone === 'crit' ? 'bg-crit' : tone === 'warn' ? 'bg-warn' : tone === 'cyan' ? 'bg-cyan' : 'bg-ok'
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-base-700">
      <div className={clsx('h-full rounded-full transition-all', color)} style={{ width: `${f * 100}%` }} />
    </div>
  )
}
