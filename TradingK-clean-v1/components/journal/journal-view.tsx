"use client"

import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import { isJournalTradesSnapshot } from "@/lib/data/validators"
import type { JournalTradesSnapshot } from "@/types/snapshots"
import { PerformanceHero } from "./performance-hero"
import { TradeTable } from "./trade-table"

export function JournalView() {
  const { data, status, error, isLoading } = useSnapshot<JournalTradesSnapshot>("/data/journal_trades.json", {
    validate: isJournalTradesSnapshot,
  })
  const items = data?.items ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Journal</h2>
            <DataStatusBadge status={status} generatedAtUtc={data?.generated_at_utc} />
          </div>
          <p className="text-muted-foreground">Solo operaciones tomadas. No es inventario de oportunidades.</p>
          <p className="mt-1 text-xs text-muted-foreground">Último snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
        </div>
      </div>

      <PerformanceHero status={status} />

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generated_at_utc}
          emptyTitle="Journal EMPTY"
          emptyDescription="No hay operaciones reales registradas. Cuando trade_ingest_v1 esté activo, acá aparecerán operaciones tomadas."
        >
          <TradeTable items={items} />
        </DataState>
      )}
    </div>
  )
}
