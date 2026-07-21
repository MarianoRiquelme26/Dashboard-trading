import type { DataSourceStatus, UiDataStatus } from "@/types/snapshots"
import { cn } from "@/lib/utils"
import { formatSnapshotTime } from "@/lib/data/status"

type BadgeStatus = DataSourceStatus | UiDataStatus

const statusClasses: Record<BadgeStatus, string> = {
  REAL: "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
  PARTIAL: "border-sky-300 bg-sky-100 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
  MOCK: "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-800 dark:border-fuchsia-500/40 dark:bg-fuchsia-500/15 dark:text-fuchsia-200",
  EMPTY: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-300",
  ERROR: "border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-200",
  STALE: "border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200",
  loading: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-300",
  ready: "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
  empty: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-500/30 dark:bg-slate-500/10 dark:text-slate-300",
  error: "border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-200",
  stale: "border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200",
}

interface DataStatusBadgeProps {
  status: BadgeStatus
  label?: string
  generatedAtUtc?: string | null
  className?: string
}

export function DataStatusBadge({ status, label, generatedAtUtc, className }: DataStatusBadgeProps) {
  return (
    <span
      title={generatedAtUtc ? `Ultimo snapshot: ${formatSnapshotTime(generatedAtUtc)}` : undefined}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide",
        statusClasses[status],
        className,
      )}
    >
      {label ? `${label}: ` : null}
      {status.toUpperCase()}
    </span>
  )
}
