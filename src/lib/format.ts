// Value + unit formatting. Always show units (08 → Units).

export function formatNumber(value: number, opts?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', opts).format(value)
}

/** Format a metric value with an optional unit, keeping units explicit. */
export function formatValue(value: number | string | undefined, unit?: string): string {
  if (value === undefined || value === null) return '—'
  const v =
    typeof value === 'number'
      ? formatNumber(value, {
          maximumFractionDigits: Math.abs(value) < 10 && !Number.isInteger(value) ? 2 : 0,
        })
      : value
  return unit ? `${v} ${unit}` : v
}

export function clsx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
