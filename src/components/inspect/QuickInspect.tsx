import { useState } from 'react'
import { useDashboard } from '@/state/DashboardContext'
import { moduleForScope, attentionForModule } from '@/state/selectors'
import { MODULE_BY_ID } from '@/config/modules'
import { buildingName } from '@/config/buildings'
import { statusMeta, severityMeta } from '@/lib/status'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Sparkline } from '@/components/common/Sparkline'
import { LiveAgo, LiveDuration } from '@/components/common/LiveTime'
import { formatClock } from '@/lib/time'
import { clsx, formatValue } from '@/lib/format'
import type { AttentionItem, ModuleSummary } from '@/types'
import {
  X,
  ArrowRight,
  MapPin,
  Building2,
  CircleSlash,
  Lock,
  Clock4,
  TriangleAlert,
} from 'lucide-react'

export function QuickInspect() {
  const { campus, scope, closeInspect, clearBuilding } = useDashboard()
  const systemId = scope.systemId
  const [opened, setOpened] = useState<string | null>(null)

  if (!systemId) return null
  const cfg = MODULE_BY_ID[systemId]
  const m = moduleForScope(campus, scope, systemId)
  const meta = statusMeta(m.overallStatus)
  const Icon = cfg?.icon
  const attention = attentionForModule(campus, scope, systemId)
  const scopeLabel = buildingName(scope.buildingId)
  const critical = m.overallStatus === 'critical'
  const criticalItem = attention.find((a) => a.severity === 'critical')

  const moduleCta = `Open ${cfg?.name ?? 'Module'} Module`
  const stale = m.dataQuality === 'stale' || m.overallStatus === 'stale'
  const partial = m.dataQuality === 'partial' || m.overallStatus === 'partial_data'

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-base-600/70 px-3 py-2.5">
        <span className={clsx('flex h-7 w-7 items-center justify-center rounded-sm', meta.tint, meta.fg)}>
          {Icon && <Icon size={16} strokeWidth={2} />}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-display text-sm font-bold uppercase tracking-wider text-ink">
              {cfg?.name ?? m.moduleName}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-2xs text-ink-faint">
            <Building2 size={10} /> {scopeLabel} · Quick Inspect
          </div>
        </div>
        <button
          type="button"
          onClick={closeInspect}
          aria-label="Close Quick Inspect"
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-sm text-ink-faint transition-colors hover:bg-base-700/70 hover:text-steel-200"
        >
          <X size={16} />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto scroll-thin px-3 py-3">
        {/* Data-trust banners */}
        {stale && (
          <TrustBanner tone="nodata" icon={<Clock4 size={13} />}>
            Telemetry is stale ({<LiveAgo startTime={undefined} fallbackSeconds={m.ageSeconds} />} old). Not live.
          </TrustBanner>
        )}
        {partial && (
          <TrustBanner tone="nodata" icon={<TriangleAlert size={13} />}>
            Partial telemetry — overall state is incomplete. Counts shown are for reporting assets only.
          </TrustBanner>
        )}

        {m.overallStatus === 'not_installed' ? (
          <NotInstalled name={cfg?.name ?? 'Module'} building={scopeLabel} onViewCampus={clearBuilding} />
        ) : m.overallStatus === 'restricted' ? (
          <Restricted name={cfg?.name ?? 'Module'} />
        ) : (
          <>
            {/* Status + primary signature */}
            <div className="rounded-panel border border-base-600/60 bg-base-850/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <StatusBadge status={m.overallStatus} size="md" icon />
                {m.contextNote && <span className="text-2xs italic text-ink-faint">{m.contextNote}</span>}
              </div>
              {critical && criticalItem ? (
                <CriticalSignature item={criticalItem} />
              ) : (
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className={clsx('font-display text-3xl font-bold leading-none tnum', meta.fg)}>
                        {m.primaryMetric ?? '—'}
                      </span>
                      {m.primaryUnit && <span className="text-sm font-semibold text-ink-muted">{m.primaryUnit}</span>}
                    </div>
                    <div className="mt-1 label-cap text-ink-faint">{m.primaryLabel}</div>
                  </div>
                  {m.trend && !stale && (
                    <Sparkline values={m.trend.values} color={meta.hex} width={120} height={38} />
                  )}
                </div>
              )}
            </div>

            {/* Breakdown */}
            {m.breakdown && m.breakdown.length > 0 && (
              <Section title="Breakdown">
                <div className="grid grid-cols-2 gap-2">
                  {m.breakdown.map((b, i) => (
                    <div key={i} className="rounded-sm border border-base-600/50 bg-base-850/40 px-2 py-1.5">
                      <div className="label-cap truncate">{b.label}</div>
                      <div className="mt-0.5 font-mono text-sm font-semibold text-steel-100 tnum">
                        {formatValue(b.value, b.unit)}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Needs attention */}
            {attention.length > 0 && (
              <Section title="Needs Attention" accent={critical ? 'crit' : 'warn'}>
                <div className="space-y-1.5">
                  {attention.map((a) => (
                    <AttentionRow key={a.id} item={a} />
                  ))}
                </div>
              </Section>
            )}

            {/* Last 24h context */}
            {m.trend && !stale && m.overallStatus !== 'no_data' && (
              <Section title="Last 24 Hours">
                <div className="flex items-center justify-between gap-3 rounded-sm border border-base-600/50 bg-base-850/40 px-3 py-2">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {last24h(m).map((s) => (
                      <div key={s.label}>
                        <div className="label-cap">{s.label}</div>
                        <div className="font-mono text-xs font-semibold text-steel-200 tnum">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <Sparkline values={m.trend.values} color={meta.hex} width={90} height={34} />
                </div>
              </Section>
            )}
          </>
        )}
      </div>

      {/* Footer CTA — explicit path to full module (03). */}
      {m.overallStatus !== 'not_installed' && m.overallStatus !== 'restricted' && (
        <div className="border-t border-base-600/70 p-3">
          {opened ? (
            <div className="flex items-center gap-2 rounded-sm border border-cyan/40 bg-cyan/10 px-3 py-2 text-2xs text-cyan animate-fade-in">
              <ArrowRight size={13} />
              <span>{opened}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() =>
                setOpened(
                  `${critical ? 'Opening incident' : `Opening ${cfg?.name} module`}${
                    scope.buildingId ? ` — focused on ${scopeLabel}` : ' — campus-wide'
                  } (prototype)`,
                )
              }
              className={clsx(
                'flex w-full items-center justify-center gap-2 rounded-sm px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-colors',
                critical
                  ? 'bg-crit text-white hover:bg-crit-bright'
                  : 'border border-cyan/50 bg-cyan/10 text-cyan hover:bg-cyan/20',
              )}
            >
              {critical ? 'View Incident' : moduleCta} <ArrowRight size={14} />
            </button>
          )}
          <p className="mt-1.5 text-center text-[10px] text-ink-faint">
            Read-only inspection · equipment controls live inside the module
          </p>
        </div>
      )}
    </div>
  )
}

function CriticalSignature({ item }: { item: AttentionItem }) {
  return (
    <div>
      <div className="text-sm font-bold text-crit">{item.title === 'Smoke detected' ? '1 Active Alarm' : item.title}</div>
      <div className="mt-1.5 text-sm font-semibold text-ink">{item.assetName}</div>
      {item.location && (
        <div className="mt-0.5 flex items-center gap-1 text-2xs text-steel-200">
          <MapPin size={11} className="text-crit/80" /> {item.location}
        </div>
      )}
      <div className="mt-2 flex gap-4 text-2xs">
        <div>
          <span className="text-ink-faint">Activated </span>
          <span className="font-mono font-semibold text-ink tnum">
            {item.startTime ? formatClock(Date.parse(item.startTime)) : '—'}
          </span>
        </div>
        <div>
          <span className="text-ink-faint">Active for </span>
          <span className="font-mono font-semibold text-crit tnum">
            <LiveDuration startTime={item.startTime} fallbackSeconds={item.durationSeconds} />
          </span>
        </div>
      </div>
    </div>
  )
}

function AttentionRow({ item }: { item: AttentionItem }) {
  const meta = severityMeta(item.severity)
  return (
    <div className={clsx('rounded-sm border-l-2 bg-base-850/50 py-1.5 pl-2.5 pr-2', meta.border)}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-semibold text-steel-100">
          {item.assetName ?? item.title}
        </span>
        <span className="shrink-0 text-[10px] text-ink-faint">
          <LiveAgo startTime={item.startTime} fallbackSeconds={item.durationSeconds} />
        </span>
      </div>
      <div className="text-2xs text-ink-muted">
        {item.buildingName ? `${item.buildingName} · ` : ''}
        {item.assetName ? item.title : item.description}
        {item.groupCount && item.groupCount > 1 ? ` · ${item.groupCount} assets` : ''}
      </div>
    </div>
  )
}

function Section({
  title,
  children,
  accent,
}: {
  title: string
  children: React.ReactNode
  accent?: 'crit' | 'warn'
}) {
  const color = accent === 'crit' ? 'text-crit' : accent === 'warn' ? 'text-warn' : 'text-steel-400'
  return (
    <div>
      <h3 className={clsx('label-cap mb-1.5', color)}>{title}</h3>
      {children}
    </div>
  )
}

function TrustBanner({
  tone,
  icon,
  children,
}: {
  tone: 'nodata' | 'warn'
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const cls = tone === 'nodata' ? 'border-nodata/40 bg-nodata/10 text-nodata' : 'border-warn/40 bg-warn/10 text-warn'
  return (
    <div className={clsx('flex items-start gap-2 rounded-sm border px-2.5 py-2 text-2xs font-medium', cls)}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

function NotInstalled({ name, building, onViewCampus }: { name: string; building: string; onViewCampus: () => void }) {
  return (
    <div className="rounded-panel border border-base-600/60 bg-base-850/50 p-4 text-center">
      <CircleSlash size={26} className="mx-auto text-ink-faint" />
      <div className="mt-2 font-display text-base font-bold uppercase tracking-wide text-steel-200">{name}</div>
      <div className="mt-1 text-2xs text-ink-muted">Not available in {building}</div>
      <button
        type="button"
        onClick={onViewCampus}
        className="mt-3 inline-flex items-center gap-1.5 rounded-sm border border-cyan/50 bg-cyan/10 px-3 py-1.5 text-2xs font-bold uppercase tracking-wide text-cyan hover:bg-cyan/20"
      >
        View Campus {name} <ArrowRight size={12} />
      </button>
    </div>
  )
}

function Restricted({ name }: { name: string }) {
  return (
    <div className="rounded-panel border border-base-600/60 bg-base-850/50 p-4 text-center">
      <Lock size={24} className="mx-auto text-gone" />
      <div className="mt-2 font-display text-base font-bold uppercase tracking-wide text-steel-200">{name}</div>
      <div className="mt-1 text-2xs text-ink-muted">Summary available · detailed access unavailable</div>
      <div className="mt-2 text-[10px] uppercase tracking-wide text-ink-faint">
        Full module access requires elevated permissions
      </div>
    </div>
  )
}

// Small derived "last 24h" context so the inspect reads like a real triage view.
function last24h(m: ModuleSummary): { label: string; value: string }[] {
  const out: { label: string; value: string }[] = []
  if (m.totalCount) {
    const avail = ((m.onlineCount ?? 0) / m.totalCount) * 100
    out.push({ label: 'Availability', value: `${avail.toFixed(1)}%` })
  }
  if (m.moduleId === 'energy') out.push({ label: 'Consumption', value: `${(Number(m.secondaryMetric1?.value) || 0)} MWh` })
  if (m.moduleId === 'solar') out.push({ label: 'Generated', value: `${m.secondaryMetric1?.value} MWh` })
  if (m.moduleId === 'hvac') out.push({ label: 'Alarms', value: `${(m.warningCount ?? 0) + (m.criticalCount ?? 0)}` })
  if (m.trend) out.push({ label: 'Trend', value: m.trend.period })
  return out.slice(0, 4)
}
