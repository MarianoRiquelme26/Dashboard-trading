"use client"

import { AlertTriangle } from "lucide-react"
import { useSnapshot } from "@/lib/data/load-json"
import type { SnapshotBase } from "@/types/snapshots"

interface SystemStatusSnapshot extends SnapshotBase {
  recent_errors?: Array<{ message?: string; created_at_utc?: string }>
}

export function RecentErrorsCard() {
  const { data } = useSnapshot<SystemStatusSnapshot>("/data/system_status.json")
  const errors = data?.recent_errors ?? []

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-300" />
        <h3 className="font-heading text-lg font-semibold text-foreground">Ultimos errores</h3>
      </div>
      {errors.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin errores reportados por snapshot.</p>
      ) : (
        <div className="space-y-2">
          {errors.slice(0, 5).map((error, index) => (
            <div key={`${error.created_at_utc}-${index}`} className="rounded-lg border border-border bg-secondary/30 p-3">
              <p className="text-sm text-foreground">{error.message ?? "Error sin mensaje"}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{error.created_at_utc ?? "sin fecha"}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
