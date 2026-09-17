import { clsx } from '@/lib/format'

/** Loading placeholder that preserves geometry (07 → Initial loading). */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-sm bg-base-700/50',
        className,
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-sweep bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  )
}
