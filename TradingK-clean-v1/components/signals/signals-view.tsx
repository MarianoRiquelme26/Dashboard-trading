"use client"

import { useMemo, useState } from "react"
import { EmptyState } from "@/components/data-status/empty-state"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useNavigation } from "@/components/navigation-context"
import { formatSnapshotTime } from "@/lib/data/status"
import { useSignalsBoard } from "@/lib/data/use-snapshot-query"
import type { SignalBoardItem } from "@/types/snapshots"
import { SignalDetailDrawer } from "./signal-detail-drawer"
import { emptySignalFilters, SignalsFilters, type SignalFilters } from "./signals-filters"
import { SignalsSummary } from "./signals-summary"
import { SignalsTable } from "./signals-table"
import { SignalsTabs, type SignalTab } from "./signals-tabs"

function tabMatches(signal: SignalBoardItem, tab: SignalTab) {
  if (tab === "all") return true
  if (tab === "unlinked") return signal.linkedTrade == null && signal.linkedTradeId == null
  return signal.operationStatus === tab
}

function matchesFilters(signal: SignalBoardItem, filters: SignalFilters) {
  if (filters.strategyName && signal.strategyName !== filters.strategyName) return false
  if (filters.botName && signal.botName !== filters.botName) return false
  if (filters.symbol && signal.symbol !== filters.symbol) return false
  if (filters.timeframeSignal && signal.timeframeSignal !== filters.timeframeSignal) return false
  if (filters.direction && signal.direction !== filters.direction) return false
  if (filters.operationStatus && (signal.operationStatus ?? signal.signalStatus) !== filters.operationStatus) return false
  if (filters.telegramSent && (signal.telegramSent ? "Si" : "No") !== filters.telegramSent) return false
  if (filters.minScore && (signal.scoreTotal ?? Number.NEGATIVE_INFINITY) < Number(filters.minScore)) return false
  if (filters.dateFrom && (signal.barCloseTimeUtc ?? "") < `${filters.dateFrom}T00:00:00`) return false
  if (filters.dateTo && (signal.barCloseTimeUtc ?? "") > `${filters.dateTo}T23:59:59`) return false
  return true
}

function tabCounts(items: SignalBoardItem[]) {
  return {
    all: items.length,
    pending: items.filter((item) => item.operationStatus === "pending").length,
    taken: items.filter((item) => item.operationStatus === "taken").length,
    discarded: items.filter((item) => item.operationStatus === "discarded").length,
    expired: items.filter((item) => item.operationStatus === "expired").length,
    unlinked: items.filter((item) => item.linkedTrade == null && item.linkedTradeId == null).length,
  }
}

export function SignalsView() {
  const { signalEventIdFilter, clearSignalFilter } = useNavigation()
  const { data, status, error, isLoading, refetch } = useSignalsBoard()
  const [activeTab, setActiveTab] = useState<SignalTab>("all")
  const [filters, setFilters] = useState<SignalFilters>(emptySignalFilters)
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null)

  const items = useMemo(() => data?.items ?? [], [data?.items])
  const selectedSignal = items.find((item) => item.eventId === (signalEventIdFilter ?? selectedSignalId)) ?? null

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => (signalEventIdFilter ? item.eventId === signalEventIdFilter : true))
      .filter((item) => tabMatches(item, activeTab))
      .filter((item) => matchesFilters(item, filters))
  }, [activeTab, filters, items, signalEventIdFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Signals</h2>
            <DataStatusBadge status={status} generatedAtUtc={data?.generatedAtUtc} />
          </div>
          <p className="text-muted-foreground">Senales detectadas por bots. No son operaciones ejecutadas.</p>
          <p className="mt-1 text-xs text-muted-foreground">Ultimo snapshot: {formatSnapshotTime(data?.generatedAtUtc)}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generatedAtUtc}
          onRetry={refetch}
          emptyTitle="Signals EMPTY"
          emptyDescription="No hay senales reales exportadas."
        >
          <SignalsSummary items={items} />
          {signalEventIdFilter && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
              <span className="text-foreground">Filtro activo por eventId:</span>
              <span className="break-all font-mono text-primary">{signalEventIdFilter}</span>
              <button
                type="button"
                onClick={clearSignalFilter}
                className="rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                Quitar filtro
              </button>
            </div>
          )}
          <SignalsTabs active={activeTab} counts={tabCounts(items)} onChange={setActiveTab} />
          <SignalsFilters items={items} filters={filters} onChange={setFilters} onClear={() => setFilters(emptySignalFilters)} />
          {filteredItems.length === 0 ? (
            <EmptyState title="Sin coincidencias" description="No hay senales que coincidan con los filtros." />
          ) : (
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
              <SignalsTable
                items={filteredItems}
                selectedId={selectedSignal?.eventId ?? null}
                onSelect={(signal) => setSelectedSignalId(signal.eventId)}
              />
              <SignalDetailDrawer signal={selectedSignal} />
            </div>
          )}
        </DataState>
      )}
    </div>
  )
}
