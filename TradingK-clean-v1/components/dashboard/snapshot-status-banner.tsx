"use client"

import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { isUsingRemoteSnapshotApi } from "@/lib/data/snapshot-api"
import { useSignalsRecent, useSystemStatus } from "@/lib/data/use-snapshot-query"

export function SnapshotStatusBanner() {
  const recent = useSignalsRecent()
  const system = useSystemStatus()

  return (
    <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Arquitectura de datos</p>
          <p className="text-xs text-muted-foreground">
            {isUsingRemoteSnapshotApi()
              ? "Render consume snapshot_read_api_v1 read-only."
              : "Fallback local activo: NEXT_PUBLIC_TRADINGK_SNAPSHOT_BASE_URL no configurada."}{" "}
            No hay conexion directa a SQLite Atlas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DataStatusBadge status={recent.status} generatedAtUtc={recent.generatedAtUtc} label="signals_recent" />
          <DataStatusBadge status={system.status} generatedAtUtc={system.generatedAtUtc} label="system_status" />
        </div>
      </div>
    </div>
  )
}
