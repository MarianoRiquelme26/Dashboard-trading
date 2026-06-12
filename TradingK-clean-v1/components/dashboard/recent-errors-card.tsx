"use client"

import { AlertTriangle } from "lucide-react"
import { DataState } from "@/components/data-status/data-state"
import { StatusPill, toneForStatus } from "@/components/data-status/status-pill"
import { formatArgTime } from "@/lib/data/status"
import { useSnapshot } from "@/lib/data/load-json"
import { isSystemStatusSnapshot } from "@/lib/data/validators"
import type { SystemStatusSnapshot } from "@/types/snapshots"

export function RecentErrorsCard() {
  const { data, status, error, isLoading } = useSnapshot<SystemStatusSnapshot>("/data/system_status.json", {
    validate: isSystemStatusSnapshot,
  })
  const errors = data?.recent_errors ?? []

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-300" />
        <h3 className="font-heading text-lg font-semibold text-foreground">Últimos errores</h3>
      </div>
      {isLoading ? (
        <div className="h-20 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generated_at_utc}
          emptyTitle="System Status EMPTY"
          emptyDescription="Estado del sistema todavía no disponible."
        >
          {errors.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin errores reportados.</p>
          ) : (
            <div className="space-y-2">
              {errors.slice(0, 5).map((systemError, index) => (
                <div key={`${systemError.created_at_utc}-${index}`} className="rounded-lg border border-border bg-secondary/30 p-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {systemError.level && <StatusPill label={systemError.level} tone={toneForStatus(systemError.level)} />}
                    {systemError.component && <StatusPill label={systemError.component} tone="neutral" />}
                  </div>
                  <p className="text-sm text-foreground">{systemError.message}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{formatArgTime(systemError.created_at_utc)}</p>
                </div>
              ))}
            </div>
          )}
        </DataState>
      )}
    </section>
  )
}
