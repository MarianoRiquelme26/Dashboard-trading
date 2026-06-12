"use client"

import { useMemo, useState } from "react"
import { EmptyState } from "@/components/data-status/empty-state"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useNavigation } from "@/components/navigation-context"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import { isSignalsBoardSnapshot } from "@/lib/data/validators"
import type { SignalBoardItem, SignalsBoardSnapshot } from "@/types/snapshots"
import { SignalDetailDrawer } from "./signal-detail-drawer"
import { emptySignalFilters, SignalsFilters, type SignalFilters } from "./signals-filters"
import { SignalsSummary } from "./signals-summary"
import { SignalsTable } from "./signals-table"
import { SignalsTabs, type SignalTab } from "./signals-tabs"

function tabMatches(signal: SignalBoardItem, tab: SignalTab) {
  if (tab === "all") return true
  if (tab === "unlinked") return signal.linked_trade == null
  return signal.operation_status === tab
}

function matchesFilters(signal: SignalBoardItem, filters: SignalFilters) {
  if (filters.strategyName && signal.strategy_name !== filters.strategyName) return false
  if (filters.botName && signal.bot_name !== filters.botName) return false
  if (filters.symbol && signal.symbol !== filters.symbol) return false
  if (filters.timeframeSignal && signal.timeframe_signal !== filters.timeframeSignal) return false
  if (filters.direction && signal.direction !== filters.direction) return false
  if (filters.operationStatus && (signal.operation_status ?? signal.signal_status) !== filters.operationStatus) return false
  if (filters.telegramSent && (signal.telegram_sent ? "Sí" : "No") !== filters.telegramSent) return false
  if (filters.minScore && (signal.score_total ?? Number.NEGATIVE_INFINITY) < Number(filters.minScore)) return false
  if (filters.dateFrom && signal.bar_close_time_utc < `${filters.dateFrom}T00:00:00`) return false
  if (filters.dateTo && signal.bar_close_time_utc > `${filters.dateTo}T23:59:59`) return false
  return true
}

function tabCounts(items: SignalBoardItem[]) {
  return {
    all: items.length,
    pending: items.filter((item) => item.operation_status === "pending").length,
    taken: items.filter((item) => item.operation_status === "taken").length,
    discarded: items.filter((item) => item.operation_status === "discarded").length,
    expired: items.filter((item) => item.operation_status === "expired").length,
    unlinked: items.filter((item) => item.linked_trade == null).length,
  }
}

export function SignalsView() {
  const { signalEventIdFilter, clearSignalFilter } = useNavigation()
  const { data, status, error, isLoading } = useSnapshot<SignalsBoardSnapshot>("/data/signals_board.json", {
    validate: isSignalsBoardSnapshot,
  })
  const [activeTab, setActiveTab] = useState<SignalTab>("all")
  const [filters, setFilters] = useState<SignalFilters>(emptySignalFilters)
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null)

  const items = useMemo(() => data?.items ?? [], [data?.items])
  const selectedSignal =
    items.find((item) => item.event_id === (signalEventIdFilter ?? selectedSignalId)) ?? null

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => (signalEventIdFilter ? item.event_id === signalEventIdFilter : true))
      .filter((item) => tabMatches(item, activeTab))
      .filter((item) => matchesFilters(item, filters))
  }, [activeTab, filters, items, signalEventIdFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Signals</h2>
            <DataStatusBadge status={status} generatedAtUtc={data?.generated_at_utc} />
          </div>
          <p className="text-muted-foreground">Todas las señales detectadas por bots y enviadas por Telegram.</p>
          <p className="mt-1 text-xs text-muted-foreground">Último snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generated_at_utc}
          emptyTitle="Signals EMPTY"
          emptyDescription="No hay señales en signals_board.json."
        >
          <SignalsSummary items={items} />
          {signalEventIdFilter && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
              <span className="text-foreground">Filtro activo por event_id:</span>
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
            <EmptyState title="Sin coincidencias" description="No hay señales que coincidan con los filtros activos." />
          ) : (
            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
              <SignalsTable
                items={filteredItems}
                selectedId={selectedSignal?.event_id ?? null}
                onSelect={(signal) => setSelectedSignalId(signal.event_id)}
              />
              <SignalDetailDrawer signal={selectedSignal} />
            </div>
          )}
        </DataState>
      )}
    </div>
  )
}
