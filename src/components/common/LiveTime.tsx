import { useClock } from '@/state/useClock'
import { formatDurationClock, formatDurationHuman } from '@/lib/time'

function elapsed(startTime?: string, fallback?: number): number {
  if (startTime) return Math.max(0, (Date.now() - Date.parse(startTime)) / 1000)
  return fallback ?? 0
}

/** Ticking mm:ss / h:mm:ss active-for counter. */
export function LiveDuration({ startTime, fallbackSeconds }: { startTime?: string; fallbackSeconds?: number }) {
  useClock(1000)
  return <span className="tnum">{formatDurationClock(elapsed(startTime, fallbackSeconds))}</span>
}

/** Ticking human duration ("12 min"), updates each 5s. */
export function LiveAgo({ startTime, fallbackSeconds }: { startTime?: string; fallbackSeconds?: number }) {
  useClock(5000)
  return <span className="tnum">{formatDurationHuman(elapsed(startTime, fallbackSeconds))}</span>
}
