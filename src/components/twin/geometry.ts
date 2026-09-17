import { BUILDINGS, type BuildingConfig } from '@/config/buildings'

// Isometric projection tuning. plan (x,y) + z(height) → SVG viewBox coords.
export const VIEW = { w: 1040, h: 660 }
const ISO = { tw: 13, th: 6.6, hz: 9.2, ox: 486, oy: 96 }

export type Pt = { x: number; y: number }

export function project(x: number, y: number, z = 0): Pt {
  return {
    x: ISO.ox + (x - y) * ISO.tw,
    y: ISO.oy + (x + y) * ISO.th - z * ISO.hz,
  }
}

const pts = (arr: Pt[]) => arr.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

export interface ProjectedBuilding {
  id: string
  name: string
  short: string
  topFace: string
  rightFace: string
  leftFace: string
  /** Ground-plane footprint (for selection halo on the plot). */
  groundFace: string
  /** Anchor at top centroid — where the label/badge sits. */
  labelAnchor: Pt
  /** Anchor at top-back corner — where a status beacon sits. */
  beaconAnchor: Pt
  /** Painter's-algorithm sort key (higher = nearer the viewer). */
  sortKey: number
  height: number
}

function projectBuilding(b: BuildingConfig): ProjectedBuilding {
  const { x, y, w, d } = b.plan
  const h = b.height
  // Plan corners.
  const A = { x, y }
  const B = { x: x + w, y }
  const C = { x: x + w, y: y + d }
  const D = { x, y: y + d }

  const g = (p: Pt) => project(p.x, p.y, 0)
  const t = (p: Pt) => project(p.x, p.y, h)

  const topFace = pts([t(A), t(B), t(C), t(D)])
  const rightFace = pts([g(B), g(C), t(C), t(B)]) // wall at x+w
  const leftFace = pts([g(D), g(C), t(C), t(D)]) // wall at y+d
  const groundFace = pts([g(A), g(B), g(C), g(D)])

  const cx = x + w / 2
  const cy = y + d / 2
  return {
    id: b.id,
    name: b.name,
    short: b.short,
    topFace,
    rightFace,
    leftFace,
    groundFace,
    labelAnchor: project(cx, cy, h),
    beaconAnchor: project(x + w * 0.5, y, h),
    sortKey: cx + cy,
    height: h,
  }
}

export const PROJECTED = BUILDINGS.map(projectBuilding).sort((a, b) => a.sortKey - b.sortKey)

export const PROJECTED_BY_ID: Record<string, ProjectedBuilding> = Object.fromEntries(
  PROJECTED.map((p) => [p.id, p]),
)

/** Tight viewBox around all geometry so the campus fills its panel. */
export function computeViewBox(pad = 54): string {
  const xs: number[] = []
  const ys: number[] = []
  for (const b of BUILDINGS) {
    const { x, y, w, d } = b.plan
    for (const [cx, cy] of [
      [x, y],
      [x + w, y],
      [x + w, y + d],
      [x, y + d],
    ]) {
      const g = project(cx, cy, 0)
      const t = project(cx, cy, b.height)
      xs.push(g.x, t.x)
      ys.push(g.y, t.y)
    }
    // account for labels/beacons above roofs
    ys.push(project(x + w / 2, y, b.height).y - 24)
  }
  const minX = Math.min(...xs) - pad
  const maxX = Math.max(...xs) + pad
  const minY = Math.min(...ys) - pad
  const maxY = Math.max(...ys) + pad
  return `${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`
}

/** Full campus plot outline (for the ground plane). */
export function plotOutline(): string {
  const margin = 3
  const minX = Math.min(...BUILDINGS.map((b) => b.plan.x)) - margin
  const maxX = Math.max(...BUILDINGS.map((b) => b.plan.x + b.plan.w)) + margin
  const minY = Math.min(...BUILDINGS.map((b) => b.plan.y)) - margin
  const maxY = Math.max(...BUILDINGS.map((b) => b.plan.y + b.plan.d)) + margin
  return pts([
    project(minX, minY),
    project(maxX, minY),
    project(maxX, maxY),
    project(minX, maxY),
  ])
}
