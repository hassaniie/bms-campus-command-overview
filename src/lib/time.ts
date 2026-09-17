// Time & duration formatting. All display uses consistent local formats
// (see 08_VISUAL_SYSTEM_AND_ACCESSIBILITY.md → Time).

/** e.g. 10:42:18 AM */
export function formatClock(epochMs: number, withSeconds = true): string {
  const d = new Date(epochMs)
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: withSeconds ? '2-digit' : undefined,
    hour12: true,
  })
}

/** "12 min ago", "42 sec ago", "2 hr ago" */
export function formatAgo(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  if (s < 60) return `${s} sec ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.floor(h / 24)
  return `${d} day ago`
}

/** Compact freshness like "Updated 2 sec ago". */
export function formatUpdated(seconds: number): string {
  return `Updated ${formatAgo(seconds)}`
}

/** Active-for style counter: "03:42" (mm:ss) or "1:03:42" (h:mm:ss). */
export function formatDurationClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const hrs = Math.floor(s / 3600)
  const mins = Math.floor((s % 3600) / 60)
  const secs = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (hrs > 0) return `${hrs}:${pad(mins)}:${pad(secs)}`
  return `${pad(mins)}:${pad(secs)}`
}

/** Human duration for age: "23 min", "2 hr 5 min", "45 sec". */
export function formatDurationHuman(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  if (s < 60) return `${s} sec`
  const m = Math.floor(s / 60)
  if (m < 60) {
    const rem = s % 60
    return rem && m < 5 ? `${m} min ${rem} sec` : `${m} min`
  }
  const h = Math.floor(m / 60)
  const remM = m % 60
  return remM ? `${h} hr ${remM} min` : `${h} hr`
}
