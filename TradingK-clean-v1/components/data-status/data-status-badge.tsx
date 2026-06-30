import type { DataSourceStatus, UiDataStatus } from "@/types/snapshots"
import { cn } from "@/lib/utils"
import { formatSnapshotTime } from "@/lib/data/status"

type BadgeStatus = DataSourceStatus | UiDataStatus

const statusClasses: Record<BadgeStatus, string> = {
  REAL: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  PARTIAL: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  MOCK: "border-fuchsia-500/40 bg-fuchsia-500/15 text-fuchsia-200",
  EMPTY: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  ERROR: "border-red-500/40 bg-red-500/15 text-red-200",
  STALE: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  loading: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  ready: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  empty: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  error: "border-red-500/40 bg-red-500/15 text-red-200",
  stale: "border-amber-500/40 bg-amber-500/15 text-amber-200",
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
      title={generatedAtUtc ? `Último snapshot: ${formatSnapshotTime(generatedAtUtc)}` : undefined}
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
