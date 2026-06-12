"use client"

import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import type { SnapshotRecord } from "@/types/snapshots"

export function WatchlistView() {
  const { data, status, error, isLoading } = useSnapshot<SnapshotRecord>("/data/watchlist_groups.json")

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Watchlist</h2>
          <DataStatusBadge status={status} generatedAtUtc={data?.generated_at_utc} />
        </div>
        <p className="text-muted-foreground">Configuracion leida desde JSON, sin precios ni CRUD falsos.</p>
        <p className="mt-1 text-xs text-muted-foreground">Ultimo snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
      </div>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generated_at_utc}
          emptyTitle="Watchlist EMPTY"
          emptyDescription="No hay grupos de watchlist disponibles. El CRUD queda oculto hasta tener persistencia real."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data?.items.map((group, index) => (
              <div key={String(group.group_id ?? index)} className="glass rounded-lg p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground">{String(group.name ?? "Grupo")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{String(group.description ?? "Sin descripcion")}</p>
              </div>
            ))}
          </div>
        </DataState>
      )}
    </div>
  )
}
