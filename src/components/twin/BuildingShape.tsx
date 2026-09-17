import { clsx } from '@/lib/format'
import type { ProjectedBuilding } from './geometry'
import type { TwinBuildingView } from '@/state/selectors'
import { statusMeta } from '@/lib/status'

interface Props {
  geo: ProjectedBuilding
  view: TwinBuildingView
  selected: boolean
  hovered: boolean
  dimmed: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

// Neutral graphite building material — healthy buildings stay calm (08).
const TOP = '#1e2c46'
const RIGHT = '#16223c'
const LEFT = '#0f1a30'

const SEVERE = new Set(['warning', 'attention', 'critical', 'partial_data'])
const DEAD = new Set(['offline', 'no_data', 'stale', 'unknown'])

export function BuildingShape({ geo, view, selected, hovered, dimmed, onSelect, onHover }: Props) {
  const meta = statusMeta(view.status)
  const severe = SEVERE.has(view.status)
  const dead = DEAD.has(view.status)
  const critical = view.status === 'critical'
  const notInstalled = view.status === 'not_installed'

  // Edge + wash treatment scales with severity; healthy = neutral outline.
  const topStroke = selected
    ? '#38e1ff'
    : hovered
      ? '#7fdcf0'
      : severe || dead
        ? meta.hex
        : '#33466b'
  const strokeW = selected ? 2.4 : critical ? 2 : severe ? 1.6 : 1
  const washOpacity = critical ? 0.22 : view.status === 'warning' || view.status === 'attention' ? 0.14 : view.status === 'partial_data' ? 0.12 : 0
  const groupOpacity = notInstalled ? 0.32 : dimmed ? 0.46 : 1
  const dashed = dead || notInstalled

  return (
    <g
      opacity={groupOpacity}
      className="cursor-pointer transition-opacity duration-200"
      onClick={() => onSelect(geo.id)}
      onMouseEnter={() => onHover(geo.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(geo.id)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      role="button"
      aria-label={`${geo.name}, ${meta.label}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(geo.id)
        }
      }}
    >
      {/* Selection footprint halo on the ground */}
      {selected && (
        <polygon
          points={geo.groundFace}
          fill="rgba(56,225,255,0.10)"
          stroke="#38e1ff"
          strokeWidth={1.2}
          strokeDasharray="4 4"
        />
      )}

      {/* Walls */}
      <polygon points={geo.leftFace} fill={dead ? '#0c1424' : LEFT} stroke="#0a1120" strokeWidth={0.5} />
      <polygon points={geo.rightFace} fill={dead ? '#101a2c' : RIGHT} stroke="#0a1120" strokeWidth={0.5} />

      {/* Roof */}
      <polygon
        points={geo.topFace}
        fill={dead ? '#141f36' : TOP}
        stroke={topStroke}
        strokeWidth={strokeW}
        strokeDasharray={dashed ? '5 4' : undefined}
        className={clsx('transition-all duration-200', hovered && !selected && 'brightness-125')}
      />
      {/* Severity wash on roof (kept low so it never reads as bright fill) */}
      {washOpacity > 0 && (
        <polygon points={geo.topFace} fill={meta.hex} opacity={washOpacity} className={critical ? 'animate-pulse-crit' : undefined} />
      )}
    </g>
  )
}
