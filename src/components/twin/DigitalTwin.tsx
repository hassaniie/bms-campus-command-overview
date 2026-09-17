import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useDashboard } from '@/state/DashboardContext'
import { twinBuildingViews, type TwinBuildingView } from '@/state/selectors'
import { MODULE_BY_ID } from '@/config/modules'
import { statusMeta } from '@/lib/status'
import { LayerControls } from './LayerControls'
import { BuildingShape } from './BuildingShape'
import { BuildingTooltip } from './BuildingTooltip'
import { PROJECTED, PROJECTED_BY_ID, computeViewBox, project, plotOutline, type Pt } from './geometry'
import { BUILDINGS } from '@/config/buildings'

const CALM = new Set(['normal', 'maintenance', 'disabled', 'restricted'])

export function DigitalTwin() {
  const { campus, scope, selectBuilding } = useDashboard()
  const [hovered, setHovered] = useState<string | null>(null)
  const [tipPos, setTipPos] = useState<Pt | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const views = useMemo(() => twinBuildingViews(campus, scope), [campus, scope])
  const selectedId = scope.buildingId

  // Map the hovered building's label anchor (viewBox coords) to container px.
  useLayoutEffect(() => {
    if (!hovered) {
      setTipPos(null)
      return
    }
    const svg = svgRef.current
    const container = containerRef.current
    const geo = PROJECTED_BY_ID[hovered]
    if (!svg || !container || !geo) return
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const p = svg.createSVGPoint()
    p.x = geo.labelAnchor.x
    p.y = geo.labelAnchor.y
    const sp = p.matrixTransform(ctm)
    const rect = container.getBoundingClientRect()
    setTipPos({ x: sp.x - rect.left, y: sp.y - rect.top })
  }, [hovered])

  const hoveredBuilding = hovered ? campus.buildings.find((b) => b.buildingId === hovered) : null

  // Iso ground grid lines for blueprint character.
  const gridLines = useMemo(() => buildGrid(), [])
  const viewBox = useMemo(() => computeViewBox(), [])

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* Top overlay: layer controls + hint */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3">
        <div className="pointer-events-auto">
          {scope.systemId ? (
            <div className="flex items-center gap-2 rounded-sm border border-cyan/40 bg-cyan/10 px-2.5 py-1.5 text-2xs font-semibold uppercase tracking-[0.08em] text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              {MODULE_BY_ID[scope.systemId]?.name} across campus
            </div>
          ) : (
            <div className="hidden rounded-sm border border-base-600/60 bg-base-850/70 px-2.5 py-1.5 font-mono text-2xs uppercase tracking-[0.1em] text-ink-faint md:block">
              Click a building to filter · hover for detail
            </div>
          )}
        </div>
        <div className="pointer-events-auto">
          <LayerControls />
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="plot-grad" cx="50%" cy="42%" r="70%">
            <stop offset="0%" stopColor="#0e1626" />
            <stop offset="100%" stopColor="#080d18" />
          </radialGradient>
        </defs>

        {/* Ground plate */}
        <polygon points={plotOutline()} fill="url(#plot-grad)" stroke="#1b2743" strokeWidth={1.5} />
        <g stroke="#16233c" strokeWidth={0.75} opacity={0.7}>
          {gridLines.map((l, i) => (
            <line key={i} x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} />
          ))}
        </g>

        {/* Buildings (painter's order) */}
        <g>
          {PROJECTED.map((geo) => {
            const view = views[geo.id]
            if (!view) return null
            return (
              <BuildingShape
                key={geo.id}
                geo={geo}
                view={view}
                selected={selectedId === geo.id}
                hovered={hovered === geo.id}
                dimmed={Boolean(selectedId) && selectedId !== geo.id}
                onSelect={selectBuilding}
                onHover={setHovered}
              />
            )
          })}
        </g>

        {/* Labels + beacons overlay (always on top, non-interactive) */}
        <g className="pointer-events-none">
          {PROJECTED.map((geo) => {
            const view = views[geo.id]
            if (!view) return null
            return (
              <TwinLabel
                key={geo.id}
                anchor={geo.labelAnchor}
                beacon={geo.beaconAnchor}
                short={geo.short}
                view={view}
                layer={scope.layer}
                systemFiltered={Boolean(scope.systemId)}
                selected={selectedId === geo.id}
                dimmed={Boolean(selectedId) && selectedId !== geo.id}
              />
            )
          })}
        </g>
      </svg>

      {/* Hover tooltip — flip below the building when near the panel top */}
      {hoveredBuilding && tipPos && (
        <BuildingTooltip building={hoveredBuilding} x={tipPos.x} y={tipPos.y} below={tipPos.y < 190} />
      )}

      {/* Legend */}
      <TwinLegend layer={scope.layer} systemId={scope.systemId} />
    </div>
  )
}

function TwinLabel({
  anchor,
  beacon,
  short,
  view,
  layer,
  systemFiltered,
  selected,
  dimmed,
}: {
  anchor: Pt
  beacon: Pt
  short: string
  view: TwinBuildingView
  layer: string
  systemFiltered: boolean
  selected: boolean
  dimmed: boolean
}) {
  const meta = statusMeta(view.status)
  const calm = CALM.has(view.status)
  const showBeacon = !calm || selected

  // Secondary text depends on layer / filter.
  let sub: string | null = null
  if (systemFiltered) sub = meta.label
  else if (layer === 'occupancy') sub = view.value ?? null
  else if (layer === 'energy') sub = view.value ?? null
  else if (layer === 'alarms') sub = view.value && view.value !== '0' ? `⚠ ${view.value}` : null

  const badge =
    view.activeCritical > 0 ? `! ${view.activeCritical}` : view.activeWarning > 0 ? `⚠ ${view.activeWarning}` : null

  const pillW = 46
  const x = anchor.x
  const y = anchor.y - 12

  return (
    <g opacity={dimmed ? 0.5 : 1}>
      {/* status beacon just above roof */}
      {showBeacon && (
        <>
          {view.status === 'critical' && (
            <circle cx={beacon.x} cy={beacon.y - 6} r={7} fill={meta.hex} opacity={0.25} className="animate-pulse-crit" />
          )}
          <circle
            cx={beacon.x}
            cy={beacon.y - 6}
            r={selected ? 3.4 : 3}
            fill={selected ? '#38e1ff' : meta.hex}
            stroke="#080d18"
            strokeWidth={1}
            className={view.status === 'critical' ? 'animate-pulse-crit' : undefined}
          />
        </>
      )}

      {/* label pill */}
      <g transform={`translate(${x}, ${y})`}>
        <rect
          x={-pillW / 2}
          y={sub ? -20 : -11}
          width={pillW}
          height={sub ? 32 : 20}
          rx={3}
          fill="rgba(8,13,24,0.82)"
          stroke={selected ? '#38e1ff' : calm ? '#2a3a5a' : meta.hex}
          strokeWidth={selected ? 1.4 : 1}
        />
        <text
          x={0}
          y={sub ? -7 : 4}
          textAnchor="middle"
          className="font-mono"
          fontSize={12}
          fontWeight={700}
          fill={selected ? '#5eeaff' : '#c6d2e6'}
          letterSpacing="0.5"
        >
          {short}
        </text>
        {sub && (
          <text x={0} y={8} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={meta.hex}>
            {sub}
          </text>
        )}
      </g>

      {/* corner severity badge */}
      {badge && !sub && (
        <g transform={`translate(${x + pillW / 2 - 2}, ${y - 11})`}>
          <rect x={-2} y={-8} width={18} height={13} rx={2.5} fill={meta.hex} />
          <text x={7} y={2} textAnchor="middle" fontSize={9} fontWeight={800} fill="#0a0f1c">
            {badge}
          </text>
        </g>
      )}
    </g>
  )
}

function TwinLegend({ layer, systemId }: { layer: string; systemId?: string }) {
  const items = systemId
    ? [
        { c: '#37d99a', t: 'Normal' },
        { c: '#ffb23e', t: 'Warning' },
        { c: '#ff4d55', t: 'Critical' },
        { c: '#a98bd8', t: 'No Data' },
        { c: '#38496f', t: 'Not installed' },
      ]
    : layer === 'alarms'
      ? [
          { c: '#37d99a', t: '0 events' },
          { c: '#ffb23e', t: 'Warnings' },
          { c: '#ff4d55', t: 'Critical' },
        ]
      : layer === 'health'
        ? [
            { c: '#37d99a', t: 'Normal' },
            { c: '#ffb23e', t: 'Attention' },
            { c: '#ff4d55', t: 'Critical' },
            { c: '#6b7890', t: 'Offline' },
            { c: '#a98bd8', t: 'No Data / Stale' },
          ]
        : [
            { c: '#38e1ff', t: layer === 'energy' ? 'Demand (kW)' : 'People onsite' },
          ]

  return (
    <div className="pointer-events-none absolute bottom-2 left-3 z-20 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-sm border border-base-600/50 bg-base-850/75 px-2.5 py-1.5 backdrop-blur">
      {items.map((it) => (
        <span key={it.t} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-ink-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: it.c }} />
          {it.t}
        </span>
      ))}
    </div>
  )
}

// Build iso ground grid lines across the plot extent.
function buildGrid(): [Pt, Pt][] {
  const margin = 3
  const minX = Math.min(...BUILDINGS.map((b) => b.plan.x)) - margin
  const maxX = Math.max(...BUILDINGS.map((b) => b.plan.x + b.plan.w)) + margin
  const minY = Math.min(...BUILDINGS.map((b) => b.plan.y)) - margin
  const maxY = Math.max(...BUILDINGS.map((b) => b.plan.y + b.plan.d)) + margin
  const lines: [Pt, Pt][] = []
  for (let gx = minX; gx <= maxX; gx += 4) {
    lines.push([project(gx, minY), project(gx, maxY)])
  }
  for (let gy = minY; gy <= maxY; gy += 4) {
    lines.push([project(minX, gy), project(maxX, gy)])
  }
  return lines
}
