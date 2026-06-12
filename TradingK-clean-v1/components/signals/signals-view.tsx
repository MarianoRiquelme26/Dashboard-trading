"use client"

import { useMemo, useState } from "react"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useNavigation } from "@/components/navigation-context"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import type { SnapshotRecord } from "@/types/snapshots"
import { SignalDetailDrawer } from "./signal-detail-drawer"
import { SignalsFilters } from "./signals-filters"
import { SignalsSummary } from "./signals-summary"
import { SignalsTable } from "./signals-table"
import { SignalsTabs, type SignalTab } from "./signals-tabs"

function signalId(signal: Record<string, unknown>, index: number) {
  return typeof signal.event_id === "string" ? signal.event_id : `signal-${index}`
}

export function SignalsView() {
  const { signalEventIdFilter } = useNavigation()
  const { data, status, error, isLoading } = useSnapshot<SnapshotRecord>("/data/signals_board.json")
  const [activeTab, setActiveTab] = useState<SignalTab>("all")
  const [selectedSignal, setSelectedSignal] = useState<SnapshotRecord["items"][number] | null>(null)

  const items = data?.items ?? []
  const filteredItems = useMemo(() => {
    let next = items
    if (signalEventIdFilter) next = next.filter((item) => item.event_id === signalEventIdFilter)
    if (activeTab !== "all") next = next.filter((item) => item.operation_status === activeTab)
    return next
  }, [activeTab, items, signalEventIdFilter])

  const selectedId = selectedSignal ? signalId(selectedSignal, items.indexOf(selectedSignal)) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Signals</h2>
            <DataStatusBadge status={status} generatedAtUtc={data?.generated_at_utc} />
          </div>
          <p className="text-muted-foreground">Todas las senales detectadas por bots y enviadas por Telegram.</p>
          <p className="mt-1 text-xs text-muted-foreground">Ultimo snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
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
          emptyDescription="No hay senales en signals_board.json."
        >
          <SignalsSummary items={items} />
          <SignalsTabs active={activeTab} onChange={setActiveTab} />
          <SignalsFilters />
          <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_420px]">
            <SignalsTable items={filteredItems} selectedId={selectedId} onSelect={setSelectedSignal} />
            <SignalDetailDrawer signal={selectedSignal} />
          </div>
        </DataState>
      )}
    </div>
  )
}
