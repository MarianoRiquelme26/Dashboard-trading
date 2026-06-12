"use client"

import { ServerCog } from "lucide-react"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { StatusPill, toneForStatus } from "@/components/data-status/status-pill"
import { useSnapshot } from "@/lib/data/load-json"
import { formatArgTime, formatSnapshotTime } from "@/lib/data/status"
import { isSystemStatusSnapshot } from "@/lib/data/validators"
import type { SystemStatusSnapshot } from "@/types/snapshots"

export function SystemStatusCard() {
  const { data, status, error, isLoading } = useSnapshot<SystemStatusSnapshot>("/data/system_status.json", {
    validate: isSystemStatusSnapshot,
  })
  const services = data?.services ?? []

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ServerCog className="h-4 w-4 text-primary" />
            <h3 className="font-heading text-lg font-semibold text-foreground">System Status</h3>
          </div>
          <p className="text-xs text-muted-foreground">Último snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
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
          emptyDescription="Todavía no hay snapshot de n8n, SQLite ni generator."
        >
          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">overall_status</p>
              <StatusPill label={data?.overall_status ?? "unknown"} tone={toneForStatus(data?.overall_status)} />
            </div>
            {services.map((service) => (
              <div key={service.name} className="rounded-lg border border-border p-3 text-sm">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{service.name}</p>
                  <StatusPill label={service.status} tone={toneForStatus(service.status)} />
                </div>
                <div className="grid gap-1 text-xs text-muted-foreground">
                  <p>last_seen: {formatArgTime(service.last_seen_utc)}</p>
                  <p>last_insert: {formatArgTime(service.last_insert_utc)}</p>
                  <p>last_generated: {formatArgTime(service.last_generated_utc)}</p>
                </div>
                {service.message && <p className="mt-2 text-xs text-foreground/80">{service.message}</p>}
              </div>
            ))}
          </div>
        </DataState>
      )}
    </section>
  )
}
