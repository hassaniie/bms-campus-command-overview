import { useClock } from '@/state/useClock'
import type { ConnectionState } from '@/types'
import { formatAgo, formatClock } from '@/lib/time'
import { clsx } from '@/lib/format'
import { Radio, WifiOff, AlertTriangle } from 'lucide-react'

interface Props {
  connection: ConnectionState
  loadedAt: number
  lastReliableUpdate: string
  className?: string
}

/**
 * Always-visible freshness state. Never claims LIVE when data is stale
 * (07 → Total backend connection loss).
 */
export function FreshnessIndicator({ connection, loadedAt, lastReliableUpdate, className }: Props) {
  const now = useClock(1000)

  if (connection === 'lost') {
    return (
      <span
        className={clsx(
          'inline-flex items-center gap-2 rounded-sm border border-crit/60 bg-crit/10 px-2 py-1 font-mono text-2xs uppercase tracking-[0.1em] text-crit',
          className,
        )}
      >
        <WifiOff size={12} strokeWidth={2.5} className="animate-pulse-crit" />
        <span className="font-semibold">Connection Lost</span>
        <span className="text-crit/70">· Last reliable {formatClock(Date.parse(lastReliableUpdate))}</span>
      </span>
    )
  }

  if (connection === 'delayed') {
    const age = 42 + Math.floor((now - loadedAt) / 1000)
    return (
      <span
        className={clsx(
          'inline-flex items-center gap-2 rounded-sm border border-warn/50 bg-warn/10 px-2 py-1 font-mono text-2xs uppercase tracking-[0.1em] text-warn',
          className,
        )}
      >
        <AlertTriangle size={12} strokeWidth={2.5} />
        <span className="font-semibold">Data Delayed</span>
        <span className="text-warn/75">· Last update {formatAgo(age)}</span>
      </span>
    )
  }

  // live — simulate a ~6s refresh cadence so the counter reads continuously live
  const age = Math.floor((now - loadedAt) / 1000) % 6
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 rounded-sm border border-ok/35 bg-ok/10 px-2 py-1 font-mono text-2xs uppercase tracking-[0.1em] text-ok',
        className,
      )}
    >
      <Radio size={12} strokeWidth={2.5} />
      <span className="font-semibold">Live</span>
      <span className="text-ok/70">· Updated {formatAgo(age)}</span>
    </span>
  )
}
