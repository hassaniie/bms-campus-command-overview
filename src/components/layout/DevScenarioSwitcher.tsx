import { useState, useRef, useEffect } from 'react'
import { FlaskConical, ChevronDown, Check } from 'lucide-react'
import { useDashboard } from '@/state/DashboardContext'
import { SCENARIOS } from '@/data/scenarios'
import { clsx } from '@/lib/format'

/**
 * Subtle development/demo state switcher. Deliberately muted so it does not
 * dominate the product UI — it is a demo affordance, not an operator control.
 */
export function DevScenarioSwitcher() {
  const { scenarioId, setScenario } = useDashboard()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = SCENARIOS.find((s) => s.id === scenarioId)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-testid="scenario-trigger"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-sm border border-base-500/70 bg-base-800/70 px-2 py-1.5 text-2xs font-medium uppercase tracking-[0.1em] text-ink-faint transition-colors hover:border-cyan/40 hover:text-steel-200"
        title="Demo scenario (development only)"
      >
        <FlaskConical size={12} className="text-nodata/80" />
        <span className="hidden text-nodata/70 xl:inline">Demo</span>
        <span className="text-steel-200">{current?.label ?? 'Normal'}</span>
        <ChevronDown size={12} className={clsx('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-64 animate-fade-in rounded-panel border border-base-500/70 bg-base-800 p-1 shadow-panel">
          <div className="label-cap px-2 pb-1 pt-1.5 text-nodata/60">Demo scenario</div>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              data-scenario={s.id}
              onClick={() => {
                setScenario(s.id)
                setOpen(false)
              }}
              className={clsx(
                'flex w-full items-start gap-2 rounded-sm px-2 py-1.5 text-left transition-colors',
                s.id === scenarioId ? 'bg-cyan/10' : 'hover:bg-base-700/70',
              )}
            >
              <span className="mt-0.5 w-3.5">
                {s.id === scenarioId && <Check size={13} className="text-cyan" />}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold text-ink">{s.label}</span>
                <span className="block text-2xs text-ink-faint">{s.hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
