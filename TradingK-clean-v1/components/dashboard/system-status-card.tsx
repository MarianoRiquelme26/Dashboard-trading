"use client"

import { ServerCog } from "lucide-react"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { StatusPill, toneForStatus } from "@/components/data-status/status-pill"
import { formatArgTime, formatSnapshotTime } from "@/lib/data/status"
import { useSystemStatus } from "@/lib/data/use-snapshot-query"

export function SystemStatusCard() {
  const { data, status, error, isLoading, refetch } = useSystemStatus()

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ServerCog className="h-4 w-4 text-primary" />
            <h3 className="font-heading text-lg font-semibold text-foreground">System Status</h3>
          </div>
          <p className="text-xs text-muted-foreground">Ultimo snapshot: {formatSnapshotTime(data?.generatedAtUtc)}</p>
        </div>
        <DataStatusBadge status={status} generatedAtUtc={data?.generatedAtUtc} />
      </div>

      {isLoading ? (
        <div className="h-28 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generatedAtUtc}
          onRetry={refetch}
          emptyTitle="System Status EMPTY"
          emptyDescription="Todavia no hay snapshot del sistema."
        >
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">db_status</p>
              <StatusPill label={data?.dbStatus ?? "unknown"} tone={toneForStatus(data?.dbStatus)} />
            </div>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p>Ultima senal: {formatArgTime(data?.lastSignalAtUtc)}</p>
              <p>Ultimo Telegram enviado: {formatArgTime(data?.lastTelegramSentAtUtc)}</p>
              <p>Ultimo error: {formatArgTime(data?.lastErrorAtUtc)}</p>
              <p>Errores recientes: {data?.recentErrorsCount ?? 0}</p>
              <p>
                Edad snapshot: {data?.snapshotAgeSeconds ?? "N/D"}s / stale after{" "}
                {data?.snapshotStaleAfterSeconds ?? "N/D"}s
              </p>
            </div>
          </div>
        </DataState>
      )}
    </section>
  )
}
