import type { DataSourceStatus } from "@/types/snapshots"
import { cn } from "@/lib/utils"

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "mock"

const toneClasses: Record<Tone, string> = {
  neutral: "border-slate-500/30 bg-slate-500/10 text-slate-200",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  danger: "border-red-500/30 bg-red-500/10 text-red-200",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  mock: "border-fuchsia-500/40 bg-fuchsia-500/15 text-fuchsia-200",
}

export function StatusPill({
  label,
  tone = "neutral",
  className,
}: {
  label: string
  tone?: Tone
  className?: string
}) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold", toneClasses[tone], className)}>
      {label}
    </span>
  )
}

export function toneForDirection(direction: string) {
  return direction.toUpperCase() === "BUY" ? "success" : direction.toUpperCase() === "SELL" ? "danger" : "neutral"
}

export function toneForStatus(status: string | DataSourceStatus | null | undefined): Tone {
  const value = String(status ?? "unknown").toLowerCase()
  if (["real", "ok", "taken", "linked", "validated", "open", "closed"].includes(value)) return "success"
  if (["partial", "warning", "pending", "suggested", "ambiguous", "expired", "stale"].includes(value)) return "warning"
  if (["error", "invalidated", "cancelled"].includes(value)) return "danger"
  if (["mock"].includes(value)) return "mock"
  if (["detected"].includes(value)) return "info"
  return "neutral"
}
