"use client"

import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { formatSnapshotTime } from "@/lib/data/status"
import { useJournalTrades } from "@/lib/data/use-snapshot-query"
import { PerformanceHero } from "./performance-hero"
import { TradeTable } from "./trade-table"

export function JournalView() {
  const { data, status, error, isLoading, refetch } = useJournalTrades()
  const items = data?.items ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Journal</h2>
            <DataStatusBadge status={status} generatedAtUtc={data?.generatedAtUtc} />
          </div>
          <p className="text-muted-foreground">Operaciones ejecutadas, abiertas y cerradas. No es inventario de oportunidades.</p>
          <p className="mt-1 text-xs text-muted-foreground">Ultimo snapshot: {formatSnapshotTime(data?.generatedAtUtc)}</p>
        </div>
      </div>

      <PerformanceHero status={status} />

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generatedAtUtc}
          onRetry={refetch}
          emptyTitle="Journal EMPTY"
          emptyDescription="Journal EMPTY: todavia no hay operaciones reales exportadas."
        >
          <TradeTable items={items} />
        </DataState>
      )}
    </div>
  )
}
