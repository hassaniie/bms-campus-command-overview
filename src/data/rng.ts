// Deterministic seeded pseudo-random helpers so mock telemetry is stable
// across renders (numbers don't jitter between paints) yet believable.

function hashString(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Returns a deterministic float in [0,1) for a given seed string. */
export function seeded(seed: string): number {
  const h = hashString(seed)
  // xorshift-ish scramble
  let x = h || 1
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  return ((x >>> 0) % 100000) / 100000
}

/** Deterministic integer in [min,max] inclusive. */
export function seededInt(seed: string, min: number, max: number): number {
  return min + Math.floor(seeded(seed) * (max - min + 1))
}

/** Deterministic float in [min,max] with fixed decimals. */
export function seededFloat(seed: string, min: number, max: number, decimals = 1): number {
  const v = min + seeded(seed) * (max - min)
  const f = Math.pow(10, decimals)
  return Math.round(v * f) / f
}

/** Deterministic trend array (gentle drift) for sparklines. */
export function seededTrend(seed: string, points: number, base: number, variance: number): number[] {
  const out: number[] = []
  for (let i = 0; i < points; i++) {
    const n = seeded(`${seed}:${i}`)
    out.push(Math.max(0, Math.round((base + (n - 0.5) * 2 * variance) * 10) / 10))
  }
  return out
}
