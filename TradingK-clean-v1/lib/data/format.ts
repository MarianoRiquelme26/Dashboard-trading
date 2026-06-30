import type { DataSourceStatus, SignalBoardItem, SignalEntry } from "@/types/snapshots"
import { formatArgTime } from "./status"

export function formatPrice(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-"
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: value >= 100 ? 2 : 4,
    maximumFractionDigits: value >= 100 ? 2 : 5,
  }).format(value)
}

export function formatNumber(value: number | null | undefined, digits = 2) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-"
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatPercent(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-"
  return `${formatNumber(value, 2)}%`
}

export function formatOperationalTime(local: string | null | undefined, utc: string | null | undefined) {
  if (local) return `${local} ARG`
  return formatArgTime(utc)
}

export function getPrimaryEntry(entries: SignalEntry[]) {
  return entries.find((entry) => entry.baseId === "base_1") ?? entries[0] ?? null
}

export function getSignalTime(signal: SignalBoardItem) {
  return formatArgTime(signal.barCloseTimeUtc)
}

export function getStatusLabel(status: DataSourceStatus | string | null | undefined) {
  return status ?? "unknown"
}
