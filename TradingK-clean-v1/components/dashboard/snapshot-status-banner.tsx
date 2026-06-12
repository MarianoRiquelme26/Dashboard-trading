"use client"

import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useSnapshot } from "@/lib/data/load-json"
import { isSignalsRecentSnapshot, isSystemStatusSnapshot } from "@/lib/data/validators"
import type { SignalsRecentSnapshot, SystemStatusSnapshot } from "@/types/snapshots"

export function SnapshotStatusBanner() {
  const recent = useSnapshot<SignalsRecentSnapshot>("/data/signals_recent.json", { validate: isSignalsRecentSnapshot })
  const system = useSnapshot<SystemStatusSnapshot>("/data/system_status.json", { validate: isSystemStatusSnapshot })

  return (
    <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Arquitectura de datos</p>
          <p className="text-xs text-muted-foreground">Render consume snapshots JSON. No hay conexión directa a SQLite Atlas.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DataStatusBadge status={recent.status} generatedAtUtc={recent.data?.generated_at_utc} label="signals_recent" />
          <DataStatusBadge status={system.status} generatedAtUtc={system.data?.generated_at_utc} label="system_status" />
        </div>
      </div>
    </div>
  )
}
