import type { DataSourceStatus, SnapshotBase } from "@/types/snapshots"

export const DATA_SOURCE_STATUSES: DataSourceStatus[] = [
  "REAL",
  "PARTIAL",
  "MOCK",
  "EMPTY",
  "ERROR",
  "STALE",
]

export function isDataSourceStatus(value: unknown): value is DataSourceStatus {
  return typeof value === "string" && DATA_SOURCE_STATUSES.includes(value as DataSourceStatus)
}

export function isSnapshotLike(value: unknown): value is SnapshotBase {
  if (!value || typeof value !== "object") return false
  const candidate = value as Partial<SnapshotBase>
  return typeof candidate.schema_version === "string" && Array.isArray(candidate.items)
}

export function isSnapshotStale(snapshot: SnapshotBase, now = Date.now()) {
  if (!snapshot.generated_at_utc || !snapshot.stale_after_seconds) return false
  const generatedAt = Date.parse(snapshot.generated_at_utc)
  if (Number.isNaN(generatedAt)) return false
  return now - generatedAt > snapshot.stale_after_seconds * 1000
}

export function resolveSnapshotStatus(snapshot: SnapshotBase, now = Date.now()): DataSourceStatus {
  if (snapshot.error_message) return "ERROR"
  if (!isDataSourceStatus(snapshot.source_status)) return "ERROR"
  if (isSnapshotStale(snapshot, now)) return "STALE"
  if (snapshot.source_status === "REAL" && !snapshot.generated_at_utc) {
    return snapshot.items.length === 0 ? "EMPTY" : "PARTIAL"
  }
  if (snapshot.items.length === 0 && snapshot.source_status === "REAL") return "EMPTY"
  return snapshot.source_status
}

export function formatSnapshotTime(value: string | null | undefined) {
  return formatArgTime(value)
}

export function formatSnapshotLabel(
  value: string | null | undefined,
  hasVisibleData = false,
) {
  if (value) return formatArgTime(value)
  if (hasVisibleData) return "Fuente real activa · timestamp no informado"
  return "N/D"
}

export function formatArgTime(value: string | null | undefined) {
  if (!value) return "N/D"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Fecha invalida"
  const formatted = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(date)
  return `${formatted.replace(",", "")} ARG`
}

export function getStatusDescription(status: DataSourceStatus) {
  const descriptions: Record<DataSourceStatus, string> = {
    REAL: "Snapshot válido desde fuente real.",
    PARTIAL: "Dato real incompleto.",
    MOCK: "Dato placeholder. No usar como real.",
    EMPTY: "Fuente real o pendiente sin registros.",
    ERROR: "No se pudo cargar o interpretar el snapshot.",
    STALE: "Snapshot vencido según stale_after_seconds.",
  }
  return descriptions[status]
}
