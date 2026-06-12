"use client"

import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useSnapshot } from "@/lib/data/load-json"

export function SnapshotStatusBanner() {
  const system = useSnapshot("/data/system_status.json")

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">Arquitectura de datos</p>
        <p className="text-xs text-muted-foreground">Render consume snapshots JSON. No hay conexion directa a SQLite Atlas.</p>
      </div>
      <DataStatusBadge status={system.status} generatedAtUtc={system.data?.generated_at_utc} label="system" />
    </div>
  )
}
