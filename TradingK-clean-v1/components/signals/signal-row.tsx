"use client"

import type { SnapshotRecord } from "@/types/snapshots"
import { cn } from "@/lib/utils"

const signalGrid = "grid-cols-[120px_110px_140px_90px_55px_90px_70px_90px_90px_90px_90px_110px_100px]"

function value(item: Record<string, unknown>, key: string, fallback = "-") {
  const raw = item[key]
  return typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean" ? String(raw) : fallback
}

function entryValue(item: Record<string, unknown>, key: "entry" | "sl" | "tp") {
  const entries = Array.isArray(item.entries) ? item.entries : []
  const first = entries[0]
  if (!first || typeof first !== "object") return "-"
  const raw = (first as Record<string, unknown>)[key]
  return typeof raw === "string" || typeof raw === "number" ? String(raw) : "-"
}

export function SignalRow({
  signal,
  selected,
  onSelect,
}: {
  signal: SnapshotRecord["items"][number]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "grid w-full min-w-[1280px] gap-3 border-t border-border px-4 py-3 text-left text-sm transition-colors hover:bg-secondary/40",
        signalGrid,
        selected && "bg-primary/10",
      )}
    >
      <div className="font-mono text-xs text-muted-foreground">{value(signal, "signal_time_utc")}</div>
      <div className="truncate">{value(signal, "bot_name")}</div>
      <div className="truncate text-primary">{value(signal, "strategy")}</div>
      <div className="font-mono">{value(signal, "symbol")}</div>
      <div>{value(signal, "timeframe")}</div>
      <div>{value(signal, "direction")}</div>
      <div>{value(signal, "score")}</div>
      <div className="font-mono">{entryValue(signal, "entry")}</div>
      <div className="font-mono">{entryValue(signal, "sl")}</div>
      <div className="font-mono">{entryValue(signal, "tp")}</div>
      <div>{value(signal, "telegram_sent")}</div>
      <div>{value(signal, "operation_status", value(signal, "signal_status"))}</div>
      <div>{value(signal, "linked_trade_id")}</div>
    </button>
  )
}

export { signalGrid }
