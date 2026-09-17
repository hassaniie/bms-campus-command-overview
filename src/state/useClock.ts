import { useEffect, useState } from 'react'

/**
 * Returns a ticking wall-clock (ms). Used only where live counters matter
 * (freshness labels, active-for durations) so re-renders stay localized.
 */
export function useClock(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}
