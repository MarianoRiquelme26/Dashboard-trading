"use client"

import { AlertTriangle } from "lucide-react"
import { DataState } from "@/components/data-status/data-state"
import { StatusPill, toneForStatus } from "@/components/data-status/status-pill"
import { formatArgTime } from "@/lib/data/status"
import { useSystemStatus } from "@/lib/data/use-snapshot-query"

export function RecentErrorsCard() {
  const { data, status, error, isLoading, refetch } = useSystemStatus()

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
        <h3 className="font-heading text-lg font-semibold text-foreground">Ultimos errores</h3>
      </div>
      {isLoading ? (
        <div className="h-20 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generatedAtUtc}
          onRetry={refetch}
          emptyTitle="System Status EMPTY"
          emptyDescription="Estado del sistema todavia no disponible."
        >
          {(data?.recentErrorsCount ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Sin errores reportados.</p>
          ) : (
            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusPill label={`${data?.recentErrorsCount ?? 0} errores recientes`} tone={toneForStatus("warning")} />
              </div>
              <p className="text-sm text-foreground">Ultimo error reportado por backend.</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{formatArgTime(data?.lastErrorAtUtc)}</p>
            </div>
          )}
        </DataState>
      )}
    </section>
  )
}
