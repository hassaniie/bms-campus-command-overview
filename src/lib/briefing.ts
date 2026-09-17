import type { AttentionItem, Severity } from '@/types'
import { severityMeta } from './status'

// Operational priority model (05_OPERATIONAL_BRIEFING.md → Priority model).
// Sort is NOT purely chronological. Within a severity, life-safety wins, then
// larger asset groups, then older conditions.
export function briefingSort(a: AttentionItem, b: AttentionItem): number {
  const sa = severityMeta(a.severity).rank
  const sb = severityMeta(b.severity).rank
  if (sa !== sb) return sb - sa
  if (!!a.lifeSafety !== !!b.lifeSafety) return a.lifeSafety ? -1 : 1
  const ga = a.groupCount ?? 1
  const gb = b.groupCount ?? 1
  if (ga !== gb) return gb - ga
  const da = a.durationSeconds ?? 0
  const db = b.durationSeconds ?? 0
  return db - da
}

export interface BriefingSection {
  key: Severity
  label: string
  items: AttentionItem[]
}

const SECTION_ORDER: { key: Severity; label: string }[] = [
  { key: 'critical', label: 'Critical' },
  { key: 'warning', label: 'Attention' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'info', label: 'Information' },
]

/** Group active items into ordered severity sections, sorted within each. */
export function sectionize(active: AttentionItem[]): BriefingSection[] {
  return SECTION_ORDER.map(({ key, label }) => ({
    key,
    label,
    items: active.filter((i) => i.severity === key).sort(briefingSort),
  })).filter((s) => s.items.length > 0)
}

/** The single highest-priority life-safety critical event, if any. */
export function lifeSafetyCritical(active: AttentionItem[]): AttentionItem | undefined {
  return active
    .filter((i) => i.severity === 'critical' && i.lifeSafety)
    .sort(briefingSort)[0]
}
