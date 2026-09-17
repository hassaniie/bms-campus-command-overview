import {
  LayoutGrid,
  Building2,
  Zap,
  Fan,
  Lightbulb,
  Cctv,
  DoorClosed,
  Flame,
  Megaphone,
  Droplets,
  SquareParking,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { clsx } from '@/lib/format'

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  active?: boolean
}

const TOP: NavItem[] = [
  { id: 'overview', label: 'Campus Command Overview', icon: LayoutGrid, active: true },
  { id: 'buildings', label: 'Buildings', icon: Building2 },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'hvac', label: 'HVAC', icon: Fan },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb },
  { id: 'cctv', label: 'CCTV', icon: Cctv },
  { id: 'access', label: 'Access Control', icon: DoorClosed },
  { id: 'fire', label: 'Fire & Life Safety', icon: Flame },
  { id: 'pa', label: 'Public Address', icon: Megaphone },
  { id: 'water', label: 'Water', icon: Droplets },
  { id: 'parking', label: 'Parking', icon: SquareParking },
  { id: 'security', label: 'Security', icon: ShieldCheck },
]

export function Sidebar() {
  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-[52px] shrink-0 flex-col items-center border-r border-base-600/70 bg-base-850/90 py-3"
    >
      {/* Brand mark */}
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-sm bg-gradient-to-br from-cyan/25 to-ok/15 ring-1 ring-cyan/30">
        <svg viewBox="0 0 32 32" className="h-5 w-5">
          <path d="M8 23 L15 8 L18 8 L11 23 Z" fill="#38e1ff" />
          <path d="M16 23 L21 12 L24 12 L19 23 Z" fill="#37d99a" />
        </svg>
      </div>

      <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto scroll-thin">
        {TOP.map((item) => (
          <SideButton key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-2 border-t border-base-600/60 pt-2">
        <SideButton item={{ id: 'logout', label: 'Sign out', icon: LogOut }} />
      </div>
    </nav>
  )
}

function SideButton({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      title={item.label}
      aria-label={item.label}
      aria-current={item.active ? 'page' : undefined}
      className={clsx(
        'group relative flex h-9 w-9 items-center justify-center rounded-sm transition-colors',
        item.active
          ? 'bg-cyan/10 text-cyan ring-1 ring-cyan/40'
          : 'text-ink-faint hover:bg-base-700/70 hover:text-steel-200',
      )}
    >
      {item.active && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-cyan" />
      )}
      <Icon size={18} strokeWidth={1.9} />
    </button>
  )
}
