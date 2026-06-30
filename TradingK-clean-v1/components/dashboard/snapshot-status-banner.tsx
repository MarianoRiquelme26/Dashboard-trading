"use client"

import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { isUsingRemoteSnapshotApi } from "@/lib/data/snapshot-api"
import { formatSnapshotTime } from "@/lib/data/status"
import { useSignalsRecent, useSystemStatus } from "@/lib/data/use-snapshot-query"

export function SnapshotStatusBanner() {
  const recent = useSignalsRecent()
  const system = useSystemStatus()
  const isStale = recent.status === "stale" || system.status === "stale"
  const ageSeconds = system.ageSeconds ?? recent.ageSeconds
  const staleAfterSeconds = system.staleAfterSeconds ?? recent.staleAfterSeconds

  return (
    <div className={isStale ? "rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3" : "rounded-lg border border-border bg-secondary/30 px-4 py-3"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{isStale ? "Snapshot STALE" : "Arquitectura de datos"}</p>
          <p className="text-xs text-muted-foreground">
            {isUsingRemoteSnapshotApi()
              ? "Render consume snapshot_read_api_v1 read-only."
              : "Fallback local activo: NEXT_PUBLIC_TRADINGK_SNAPSHOT_BASE_URL no configurada."}{" "}
            No hay conexion directa a SQLite Atlas.
          </p>
          {isStale && (
            <p className="mt-2 text-sm text-amber-100">
              Datos del sistema desactualizados. Se muestran los ultimos datos disponibles. Ultimo snapshot:{" "}
              {formatSnapshotTime(system.generatedAtUtc ?? recent.generatedAtUtc)}
              {ageSeconds !== null && ageSeconds !== undefined ? ` · edad ${ageSeconds}s` : ""}
              {staleAfterSeconds !== null && staleAfterSeconds !== undefined ? ` · vence a los ${staleAfterSeconds}s` : ""}.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <DataStatusBadge status={recent.status} generatedAtUtc={recent.generatedAtUtc} label="signals_recent" />
          <DataStatusBadge status={system.status} generatedAtUtc={system.generatedAtUtc} label="system_status" />
        </div>
      </div>
    </div>
  )
}
