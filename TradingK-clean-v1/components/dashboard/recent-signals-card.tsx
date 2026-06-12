"use client"

import { RadioTower } from "lucide-react"
import { DataState } from "@/components/data-status/data-state"
import { DataStatusBadge } from "@/components/data-status/data-status-badge"
import { StatusPill, toneForDirection, toneForStatus } from "@/components/data-status/status-pill"
import { useNavigation } from "@/components/navigation-context"
import { formatNumber, formatOperationalTime } from "@/lib/data/format"
import { useSnapshot } from "@/lib/data/load-json"
import { formatSnapshotTime } from "@/lib/data/status"
import { isSignalsRecentSnapshot } from "@/lib/data/validators"
import type { SignalsRecentSnapshot } from "@/types/snapshots"

export function RecentSignalsCard() {
  const { openSignal, setCurrentView } = useNavigation()
  const { data, status, error, isLoading } = useSnapshot<SignalsRecentSnapshot>("/data/signals_recent.json", {
    validate: isSignalsRecentSnapshot,
  })
  const items = data?.items.slice(0, 8) ?? []

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <RadioTower className="h-4 w-4 text-primary" />
            <h3 className="font-heading text-lg font-semibold text-foreground">Recent Signals</h3>
          </div>
          <p className="text-xs text-muted-foreground">Último snapshot: {formatSnapshotTime(data?.generated_at_utc)}</p>
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
          emptyDescription="No hay señales recientes para mostrar."
        >
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="hidden grid-cols-6 gap-3 bg-secondary/50 px-4 py-3 text-[11px] uppercase tracking-wide text-muted-foreground md:grid">
              <div>Hora</div>
              <div>Estrategia</div>
              <div>Símbolo</div>
              <div>Dirección</div>
              <div>Score</div>
              <div>Estado</div>
            </div>
            {items.map((item) => (
              <button
                key={item.event_id}
                type="button"
                onClick={() => openSignal(item.event_id)}
                className="grid w-full grid-cols-1 gap-2 border-t border-border px-4 py-3 text-left text-sm transition-colors hover:bg-secondary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:grid-cols-6 md:gap-3"
              >
                <div className="font-mono text-xs text-muted-foreground">{formatOperationalTime(item.bar_close_time_local, item.bar_close_time_utc)}</div>
                <div className="truncate text-foreground">{item.strategy_name}</div>
                <div className="font-mono text-foreground/80">{item.symbol}</div>
                <div>
                  <StatusPill label={item.direction.toUpperCase()} tone={toneForDirection(item.direction)} />
                </div>
                <div>{formatNumber(item.score_total, 1)} {item.score_label ?? ""}</div>
                <div>
                  <StatusPill label={item.operation_status ?? item.signal_status} tone={toneForStatus(item.operation_status ?? item.signal_status)} />
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setCurrentView("signals")}
            className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Ver todas las señales
          </button>
        </DataState>
      )}
    </section>
  )
}
