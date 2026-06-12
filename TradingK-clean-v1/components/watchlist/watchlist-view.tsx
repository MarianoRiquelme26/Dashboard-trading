"use client"

import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { StatusPill, toneForStatus } from "@/components/data-status/status-pill"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import { isWatchlistGroupsSnapshot } from "@/lib/data/validators"
import type { WatchlistGroupsSnapshot } from "@/types/snapshots"

export function WatchlistView() {
  const { data, status, error, isLoading } = useSnapshot<WatchlistGroupsSnapshot>("/data/watchlist_groups.json", {
    validate: isWatchlistGroupsSnapshot,
  })

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Watchlist</h2>
          <DataStatusBadge status={status} generatedAtUtc={data?.generated_at_utc} />
        </div>
        <p className="text-muted-foreground">Configuración leída desde JSON, sin precios ni CRUD falsos.</p>
        <p className="mt-1 text-xs text-muted-foreground">Último snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
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
            {data?.items.map((group) => (
              <article key={group.group_id} className="glass rounded-lg p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{group.group_name}</h3>
                  <StatusPill label={group.is_active ? "activo" : "inactivo"} tone={toneForStatus(group.is_active ? "ok" : "unknown")} />
                </div>
                <p className="text-sm text-muted-foreground">Prioridad: {group.priority ?? "-"}</p>
                <p className="mt-2 text-sm text-muted-foreground">Tema: {group.correlation_theme ?? "-"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.asset_symbols.map((asset) => <StatusPill key={asset} label={asset} tone="info" />)}
                </div>
                {(group.news_currencies ?? []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.news_currencies?.map((currency) => <StatusPill key={currency} label={currency} tone="neutral" />)}
                  </div>
                )}
                {group.notes && <p className="mt-3 text-sm text-foreground/80">{group.notes}</p>}
              </article>
            ))}
          </div>
        </DataState>
      )}
    </div>
  )
}
