"use client"

import { useMemo, useState } from "react"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { JOURNAL_LINK_FILTERS, journalLinkFilterLabel, mergeTradesWithLinks, tradeMatchesJournalLinkFilter, type JournalLinkFilter } from "@/lib/data/signal-trade-links"
import { formatSnapshotLabel } from "@/lib/data/status"
import { useJournalTrades, useSignalTradeLinks } from "@/lib/data/use-snapshot-query"
import { PerformanceHero } from "./performance-hero"
import { TradeTable } from "./trade-table"
import { TradeDetailPanel } from "./trade-detail-panel"

export function JournalView() {
  const { data, status, error, isLoading, refetch } = useJournalTrades()
  const linksQuery = useSignalTradeLinks()
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null)
  const [linkStatusFilter, setLinkStatusFilter] = useState<JournalLinkFilter | "">("")
  const items = useMemo(() => mergeTradesWithLinks(data?.items ?? [], linksQuery.data?.items ?? []), [data?.items, linksQuery.data?.items])
  const filteredItems = useMemo(() => {
    if (!linkStatusFilter) return items
    return items.filter((trade) => tradeMatchesJournalLinkFilter(trade, linkStatusFilter))
  }, [items, linkStatusFilter])
  const selectedTrade = filteredItems.find((trade) => trade.tradeId === selectedTradeId) ?? filteredItems[0] ?? null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Journal</h2>
            <DataStatusBadge status={status} generatedAtUtc={data?.generatedAtUtc} />
          </div>
          <p className="text-muted-foreground">Operaciones ejecutadas, abiertas y cerradas. No es inventario de oportunidades.</p>
          <p className="mt-1 text-xs text-muted-foreground">Ultimo snapshot: {formatSnapshotLabel(data?.generatedAtUtc, (data?.items.length ?? 0) > 0)}</p>
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
          {linksQuery.status === "error" && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
              No se pudo cargar signal-trade-links. Journal queda visible sin inferir vinculos nuevos.
            </div>
          )}
          <div className="flex flex-wrap items-end justify-between gap-3 rounded-lg border border-border bg-card p-4">
            <label className="block w-full max-w-xs">
              <span className="mb-1 block text-[11px] uppercase tracking-wide text-muted-foreground">Vinculo senal</span>
              <select
                value={linkStatusFilter}
                onChange={(event) => setLinkStatusFilter(event.target.value as JournalLinkFilter | "")}
                className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="">Todos</option>
                {JOURNAL_LINK_FILTERS.map((linkFilter) => (
                  <option key={linkFilter} value={linkFilter}>
                    {journalLinkFilterLabel(linkFilter)}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm text-muted-foreground">{filteredItems.length} operaciones visibles</p>
          </div>
          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
            <TradeTable
              items={filteredItems}
              selectedTradeId={selectedTrade?.tradeId ?? null}
              onSelect={(trade) => setSelectedTradeId(trade.tradeId)}
            />
            <TradeDetailPanel trade={selectedTrade} />
          </div>
        </DataState>
      )}
    </div>
  )
}
