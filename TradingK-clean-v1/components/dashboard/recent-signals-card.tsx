"use client"

import { RadioTower } from "lucide-react"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { useNavigation } from "@/components/navigation-context"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import type { SnapshotBase } from "@/types/snapshots"

type RecentSignal = Record<string, unknown>
type RecentSignalsSnapshot = SnapshotBase<RecentSignal>

function text(value: unknown, fallback = "-") {
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback
}

export function RecentSignalsCard() {
  const { openSignal } = useNavigation()
  const { data, status, error, isLoading } = useSnapshot<RecentSignalsSnapshot>("/data/signals_recent.json")
  const items = data?.items.slice(0, 8) ?? []

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <RadioTower className="h-4 w-4 text-primary" />
            <h3 className="font-heading text-lg font-semibold text-foreground">Recent Signals</h3>
          </div>
          <p className="text-xs text-muted-foreground">Ultimo snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
        </div>
        <DataStatusBadge status={status} generatedAtUtc={data?.generated_at_utc} />
      </div>

      {isLoading ? (
        <div className="h-24 animate-pulse rounded-lg bg-secondary/50" />
      ) : (
        <DataState
          status={status}
          error={error}
          generatedAtUtc={data?.generated_at_utc}
          emptyTitle="Recent Signals EMPTY"
          emptyDescription="No hay senales recientes para mostrar."
        >
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-6 gap-3 bg-secondary/50 px-4 py-3 text-[11px] uppercase tracking-wide text-muted-foreground">
              <div>Hora</div>
              <div>Estrategia</div>
              <div>Simbolo</div>
              <div>Direccion</div>
              <div>Score</div>
              <div>Estado</div>
            </div>
            {items.map((item, index) => (
              <button
                key={text(item.event_id, `recent-${index}`)}
                type="button"
                onClick={() => openSignal(typeof item.event_id === "string" ? item.event_id : null)}
                className="grid w-full grid-cols-6 gap-3 border-t border-border px-4 py-3 text-left text-sm transition-colors hover:bg-secondary/40"
              >
                <div className="font-mono text-xs text-muted-foreground">{text(item.signal_time_utc ?? item.created_at_utc)}</div>
                <div className="truncate text-foreground">{text(item.strategy)}</div>
                <div className="font-mono text-foreground/80">{text(item.symbol)}</div>
                <div>{text(item.direction)}</div>
                <div>{text(item.score)}</div>
                <div>{text(item.operation_status ?? item.signal_status)}</div>
              </button>
            ))}
          </div>
        </DataState>
      )}
    </section>
  )
}
