import { statusMeta } from '@/lib/status'
import type { Status } from '@/types'
import { clsx } from '@/lib/format'

interface Props {
  status: Status
  size?: 'sm' | 'md'
  /** Show the lucide icon in addition to glyph+text. */
  icon?: boolean
  /** Override the visible label. */
  label?: string
  className?: string
}

/**
 * Status pill that always pairs a color with a glyph AND text — never color
 * alone (08 → Accessibility). e.g. `● NORMAL`, `! CRITICAL`.
 */
export function StatusBadge({ status, size = 'sm', icon = false, label, className }: Props) {
  const meta = statusMeta(status)
  const Icon = meta.icon
  const critical = status === 'critical'
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-sm border font-mono uppercase tracking-[0.08em]',
        size === 'sm' ? 'px-1.5 py-0.5 text-2xs' : 'px-2 py-1 text-xs',
        meta.tint,
        meta.border,
        meta.fg,
        className,
      )}
      role="status"
    >
      {icon ? (
        <Icon size={size === 'sm' ? 11 : 13} className={clsx('shrink-0', critical && 'animate-pulse-crit')} strokeWidth={2.5} />
      ) : (
        <span aria-hidden className={clsx('leading-none', critical && 'animate-pulse-crit')}>
          {meta.glyph}
        </span>
      )}
      <span className="leading-none">{label ?? meta.label}</span>
    </span>
  )
}

interface DotProps {
  status: Status
  pulse?: boolean
  className?: string
}

/** Bare status dot for compact contexts; still followed by text elsewhere. */
export function StatusDot({ status, pulse, className }: DotProps) {
  const meta = statusMeta(status)
  return (
    <span
      className={clsx(
        'inline-block h-2 w-2 rounded-full',
        meta.dot,
        pulse && status === 'critical' && 'animate-pulse-crit',
        className,
      )}
      aria-hidden
    />
  )
}
