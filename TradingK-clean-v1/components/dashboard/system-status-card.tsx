"use client"

import { ServerCog } from "lucide-react"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import type { SnapshotBase } from "@/types/snapshots"

interface SystemService {
  name?: string
  status?: string
  last_insert_utc?: string | null
  message?: string
}

interface SystemStatusSnapshot extends SnapshotBase {
  overall_status?: string
  services?: SystemService[]
  recent_errors?: Array<{ message?: string; created_at_utc?: string }>
}

export function SystemStatusCard() {
  const { data, status, error, isLoading } = useSnapshot<SystemStatusSnapshot>("/data/system_status.json")
  const services = data?.services ?? []

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ServerCog className="h-4 w-4 text-primary" />
            <h3 className="font-heading text-lg font-semibold text-foreground">System Status</h3>
          </div>
          <p className="text-xs text-muted-foreground">Ultimo snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
        </div>
        <DataStatusBadge status={status} generatedAtUtc={data?.generated_at_utc} />
      </div>

      {isLoading ? (
        <div className="h-28 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generated_at_utc}
          emptyTitle="System Status EMPTY"
          emptyDescription="Todavia no hay snapshot de n8n, SQLite ni generator."
        >
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">overall_status</p>
              <p className="font-mono text-sm text-foreground">{data?.overall_status ?? "unknown"}</p>
            </div>
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.message ?? "Sin detalle"}</p>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{service.status ?? "unknown"}</span>
              </div>
            ))}
          </div>
        </DataState>
      )}
    </section>
  )
}
